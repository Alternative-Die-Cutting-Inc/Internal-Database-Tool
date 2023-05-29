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
		case "save_field":
			if (!isset($objData->data->docket_number) ||
				!isset($objData->data->field) ||
				!isset($objData->data->value)) {
					die(json_encode(array('ERROR' => 'No docket number, field or value given.',
						"Received" => $objData->data)));
			} else {	
				saveField($objData->data->docket_number,$objData->data->field,$objData->data->value);				
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
		case "get_extras":
			if (!isset($objData->data->docket_number)) {
					die(json_encode(array('ERROR' => 'No docket number given.',
						"Received" => $objData->data)));
			} else {	
				getExtras($objData->data->docket_number);				
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
	Given a docket number and a date, set the DueDate in the table DueDate.
*/
function saveField($docket_number, $field, $value) {
	$query = "UPDATE Production SET $field='$value' WHERE DocketNumber='$docket_number'";
	$result = runQuery($query);
	if ($result) {
		echo json_encode(array("Success" => $query));
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
/*
	Given a docket number, get all the extra chargers.
*/
function getExtras($docket_number) {
	$query = "SELECT * FROM ExtraCharges WHERE DocketNumber=$docket_number ORDER BY ExId ASC";
	$result = runQuery($query);

	$extraCharges = array();
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			$extraCharges[] = $row;
		}
	}

	echo json_encode($extraCharges);
	
}

?> 
