<?php
/*
	This helper file serves the DocketLogin Controller.
	Written July 30th, 2013 by Peter Tran
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
		case 'get_production_info':
			if(!isset($objData->data->docket_number)) {
					die(json_encode(array('ERROR' => 'No docket number given.',
						"Received" => $objData->data)));
			} else {
				getProductionInfo($objData->data->docket_number);
			}
			break;
		case 'get_quote_info':
			if(!isset($objData->data->quote_quantity_id)||
				!isset($objData->data->quote_number)) {
					die(json_encode(array('ERROR' => 'No QuoteQuantityID or quote number given.',
						"Received" => $objData->data)));
			} else {
				getQuoteInfo($objData->data->quote_number,$objData->data->quote_quantity_id);
			}
			break;
		case "get_forms":
			if (!isset($objData->data->docket_number)) {
					die(json_encode(array('ERROR' => 'No docket number given.',
						"Received" => $objData->data)));
			} else {	
				getForms($objData->data->docket_number);				
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
	Given a docket number, return the row in the Production table that matches it.
*/
function getProductionInfo($docket_number) {
	$query = 
		"SELECT * 
		FROM Production 
		WHERE DocketNumber=$docket_number";
	$result = runQuery($query);
	if ($result) {
		$row = mysql_fetch_array($result);
		echo json_encode($row,JSON_FORCE_OBJECT);
	}
}

/*
	Given a quote number and quote quantity id, return the runspeeds for press, gluer, stripping and handwork.
*/
function getQuoteInfo($quote_number, $quantity_id) {
	$query =
		"SELECT units, sheets, press_runspeed, strip_runspeed, gluer_runspeed, handwork_runspeed, press_setup, gluer_setup
		FROM QT_QuoteQuantities
		WHERE 
			quote_number=$quote_number 
			AND 
			quantity_id=$quantity_id";
	$result = runQuery($query);
	if ($result) {
		$row = mysql_fetch_array($result);
		echo json_encode($row,JSON_FORCE_OBJECT);
	}
}

/*
	Given a docket number, get all the forms.
*/
function getforms($docket_number) {
	$query = "SELECT * FROM Forms WHERE DocketNumber=$docket_number ORDER BY FormId ASC";
	$result = runQuery($query);

	$forms = array();
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			$forms[] = $row;
		}
	}

	echo json_encode($forms);
	
}
?>