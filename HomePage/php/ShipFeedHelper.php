<?php
/*
	This manages requests from HomePage's QuoteSearch. It interacts
	with the database to retreive search information.
	Written July 17th, 2013 by Peter Tran
*/

/* Connection the database */
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
/* Database query helpers: runQuery */
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/backendHelper.php";

/* We need some functionality from the old shipping system for notifications. */
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/phpmailer/mailHelper.php";

// The request is a JSON request.
$data = file_get_contents("php://input");
 
/* Give all functions access to the request object. */
global $objData;
$objData = json_decode($data);

/*
	Route the requests to the corresponding functions.
	Check required variables have been passed in.
*/
if (isset($objData->data->request)) {
	switch($objData->data->request) {
		case 'get_ship_feed':
			getShipFeed();
			break;
		case 'ship_out':
			if (!isset($objData->data->sess_id) ||
				!isset($objData->data->docket_number) ||
				!isset($objData->data->job_name)) {
				die(json_encode(array('ERROR' => "SessId or DocketNumber not passed.",
									"Received" => $objData->data)));
			} else {
				shipOutSlip($objData->data->docket_number, $objData->data->sess_id, $objData->data->job_name);
			}
			break;
		default:
			die(json_encode(array('ERROR' => '' . $objData->data->request . ' is an unrecognized request.')));
			break;
	}

} else {
	/* If the request was not found, return an error. */
	die(json_encode(array('ERROR' => 'request not passed in.')));
}

/*
	Return the ship feed.
*/
function getShipFeed() {
	
    date_default_timezone_set("America/Toronto");
    /* Get unshipped delivery slips. */
    $query = "SELECT JobName, Customer, CustomerPoNo, TimeIn, DateIn, TimeOut, DateOut, DocketNumber, SessId 
            FROM (Production NATURAL JOIN SlipStatus) 
            WHERE ((DateOut IS NULL) AND (DateIn IS NOT NULL))
            ORDER By DateIn DESC, TimeIn DESC";

	/* Get shipped delivery slips. */
    $shippedQuery = "SELECT JobName, Customer, CustomerPoNo, TimeIn, DateIn, TimeOut, DateOut, DocketNumber, SessId 
            FROM (Production NATURAL JOIN SlipStatus) 
            WHERE (TO_DAYS(DateOut)>=TO_DAYS(NOW())-4)
            ORDER By DateOut DESC, TimeOut DESC";

	$results = array();
	$result = runQuery($query);
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			$row['TimeIn'] = date("g:iA", strtotime($row['TimeIn']));
			array_push($results, $row);
		}
	}

	$result = runQuery($shippedQuery);
	if ($result) {
		while ($row = mysql_fetch_array($result)) {

			$row['TimeIn'] = date("g:iA", strtotime($row['TimeIn']));
			$row['TimeOut'] = date("g:iA", strtotime($row['TimeOut']));
			$row["shipclass"] = "shipped";
			array_push($results, $row);
		}
	}

	echo json_encode($results);
}

/*
	Given a Docket number and a session ID, set the shipout time/date.
*/
function shipOutSlip($docketNumber, $sessId, $jobName) {
	date_default_timezone_set("America/Toronto");
    $statusQuery = "UPDATE SlipStatus
            		SET DateOut=CURDATE(), TimeOut=NOW()
            		WHERE SessId={$sessId}";
    $result = runQuery($statusQuery);
    if ($result) {
        sendEmailNotifications($docketNumber, "shipped", $jobName);
        echo json_encode(array("SUCCESS" => $statusQuery . " successful."));
    }
}

?>