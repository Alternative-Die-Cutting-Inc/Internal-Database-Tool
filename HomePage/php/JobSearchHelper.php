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
		case 'job_search':
			jobSearch();
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
	Given an array of required info, check that they are all set. Return true if it is. If not, return an error.
	@param $required_info An array of strings containing required meta data to complete the request.
	@return boolean true if all required info is set, output json encoded error message otherwise.
*/
function checkRequired($required_info) {
	foreach ($required_info as $info) {
		if (!isset($objData->data->$info)) {
			returnErrorMessage($required_info);
		}
	}
	return true;
}

/*
 * 	Exit message when request does not contain all required information.
 * @param $required_info An array of strings containing required meta data to complete the request.
*/
function returnErrorMessage($required_info) {

	die(json_encode(array('ERROR' => 'Insufficent meta data pased in.', 
						"Received" => $objDAta->data,
						"Required" => $required_info)));
}

/*
	Search for quote with the passed in data. Output the row.
*/
function jobSearch() {
	/* Creating search query separately because it is to long.*/
	$query = createSearchQuery();
	$result = runQuery($query);
	$resultArray = array();

	while($row = mysql_fetch_array($result)) {
		array_push($resultArray, $row);
	}

	echo json_encode($resultArray);
}

/*
	Create the search query from the passed in ObjData.
*/
function createSearchQuery() {
	global $objData;
	$query = 'SELECT * FROM Production WHERE';

	/* Search all the passed in values. */
	foreach ($objData->data->values as $field => $value) {
        $query .= " (CAST( " . $field . " as CHAR) LIKE \"%" . $value. "%\" ) AND";
    }
    //Remove the last "AND"
    $query = substr($query, 0, strlen($query)-3);

    if (isset($objData->data->range)) {   
    	$query .= "AND ('" . $objData->data->range->from . "' <= Date AND Date <='" .  $objData->data->range->to . "')";
    }
    //Order by date, display 100 starting from index.
    $query .= " ORDER BY DocketNumber DESC LIMIT " . $objData->data->start_index . ", 100";
	return $query;
}
?>
