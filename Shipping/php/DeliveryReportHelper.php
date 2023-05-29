<?php
/*
	This helper file serves the Production Controller.
	Written Aug 7th, 2013 by Peter Tran
*/

/* Connection the database */
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
/* Database query helpers: runQuery */
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/backendHelper.php";

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
		case "get_shipment_info":
			if (!isset($objData->data->docket_number)) {
					die(json_encode(array('ERROR' => 'Docket Number not passed.',
						"Received" => $objData->data)));
			} else {	
				getShipmentInfo($objData->data->docket_number);				
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
	Given a quote number, get the quantities of it from QT_QuoteQuantities.
	Include the quantity_id, total, total_per_m
*/
function getShipmentInfo($docket_number) {

	//Get forms for the job.
	$forms = getForms($docket_number);
	$forms = getFormTotals($docket_number, $forms);
	$slips = getSlips($docket_number);
	echo json_encode(array("summary"=>$forms, "history" => $slips));
}

/*
	Return an array of forms
	array(form_name => quantity)
	sorted by formid.
*/
function getForms($docket_number) {
	$forms = array();
	$forms_query = "SELECT FormId, Form, Quantity
				FROM Forms
				WHERE DocketNumber=$docket_number
				ORDER BY FormId";
	$result = runQuery($forms_query);
	while ($row = mysql_fetch_array($result)) {
		$forms[$row['Form']] = array("Name" => $row['Form'],"Quantity" => $row["Quantity"], "Sent" => 0, "Date" => "");
	}
	return $forms;
}

/*
	For the given docket number, populate the "Sent" value of each array in the forms array.
*/
function getFormTotals($docket_number, $forms) {
	date_default_timezone_set("America/Toronto");
    
	$totals_query = "SELECT Form, Total, Date as DeliveryDate FROM Slip WHERE DocketNumber=$docket_number ORDER BY DATE ASC";
	$result = runQuery($totals_query);
	while ($row = mysql_fetch_array($result)) {
		if (isset($forms[$row['Form']])) {
			$forms[$row['Form']]["Sent"] += $row["Total"];
			$forms[$row['Form']]["Date"] = date("D, M jS, Y",strtotime($row["DeliveryDate"]));
		}
	}
	return $forms;
}

/*
	Given a docket number, return an array of all the slips for that docket number.
	Split the slips into arrays.
*/
function getSlips($docket_number) {
	date_default_timezone_set("America/Toronto");
	$slips = array();
	$query = "SELECT *
				FROM 
					(SELECT * FROM Slip WHERE DocketNumber=$docket_number) as A
						NATURAL JOIN 
					(SELECT FormId, Form From Forms WHERE DocketNumber=$docket_number) as B
				ORDER BY Date ASC, FormId ASC";
	$result = runQuery($query);
	while ($row = mysql_fetch_array($result)) {
			if (!array_key_exists($row['SessId'], $slips)) {
				$slips[$row['SessId']] = array();
			}
			$row['Date'] = date("D, M jS, Y",strtotime($row["Date"]));
			$slips[$row['SessId']][] = $row;
	}

	return $slips;
}
?>