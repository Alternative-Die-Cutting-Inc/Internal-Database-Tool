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
		case 'quote_search':
			quoteSearch();
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
function quoteSearch() {
	/* Creating search query separately because it is to long.*/
	$query = createSearchQuery();
	$result = runQuery($query);
	$resultArray = array();

	/* Keep track of the current quote number we are looping through.*/
	$current_quote_number = NULL;
	$current_row = null;

	/* Keep an array to group all the quantities together. */
	$quantity_array = array();

	$current_row = mysql_fetch_array($result);
	$quote_number = $current_row["quote_number"];

	while($row = mysql_fetch_array($result)) {
		
		/* Insert into results array for each new quote. */
		if ($row["quote_number"] !== $current_quote_number && !is_null($current_quote_number)) {

			$current_row["quantities"] = $quantity_array;
			array_push($resultArray, $current_row);

			// Initiate a new quantity array for this new quote number.
			$quantity_array = array();

		}

		$current_row = $row;
		/* Save the current quote number*/
		$current_quote_number = $row['quote_number'];
		
		/*Save the quantity info */
		array_push($quantity_array, array("units" => $row["units"], "sheets" => $row["sheets"], "total" => $row["total"], "total_per_m" => $row["total_per_m"]));
	}
	$current_row["quantities"] = $quantity_array;
	array_push($resultArray, $current_row);

	$resultArray["query"] = $query;
	echo json_encode(array_values($resultArray));
}

/*
	Create the search query from the passed in ObjData.
*/
function createSearchQuery() {
	global $objData;
	$query = 'SELECT A.quote_number as quote_number, A.customer as customer, A.attention as attention, A.job_name as job_name, A.description as description, A.notes as notes, A.date as date, B.units as units, B.sheets as sheets, B.total_per_m as total_per_m, B.total as total FROM (SELECT * FROM QT_Quote WHERE';

	/* Search all the passed in values. */
	foreach ($objData->data->values as $field => $value) {
        $query .= " (CAST( " . $field . " as CHAR) LIKE \"%" . $value. "%\" ) AND";
    }
    //Remove the last "AND"
    $query = substr($query, 0, strlen($query)-3);

    if (isset($objData->data->range)) {   
    	$query .= "AND ('" . $objData->data->range->from . "' <= date AND date <='" .  $objData->data->range->to . "')";
    }
    //Order by date, display 100 starting from index.
    $query .= " ORDER BY quote_number DESC LIMIT " . $objData->data->start_index . ", 100)";
	$query .= " as A NATURAL JOIN QT_QuoteQuantities as B ORDER BY quote_number DESC";
	return $query;
}
?>