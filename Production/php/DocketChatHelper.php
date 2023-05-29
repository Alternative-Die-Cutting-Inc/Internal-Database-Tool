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
		case 'get_conversation_logs':
			if(!isset($objData->data->docket_number)) {
					die(json_encode(array('ERROR' => 'No quote number given.',
						"Received" => $objData->data)));
			} else {
				getConversationLogs($objData->data->docket_number);
			}
			break;
		case 'log_message':
			if(!isset($objData->data->docket_number) || !isset($objData->data->message)) {
					die(json_encode(array('ERROR' => 'No quote number given.',
						"Received" => $objData->data)));
			} else {
				logMessage($objData->data->docket_number, $objData->data->message, $objData->data->user);
			}
			break;
		case "run_queries":
			if (!isset($objData->data->query)) {
					die(json_encode(array('ERROR' => 'Query not passed.',
						"Received" => $objData->data)));
			} else {	
				runQueries($objData->data->query);				
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
	Return an array of conversation logs for the given docket number.
*/





/*
	Given the docket number and string message, log the message into the database.
*/
function logMessage($docket_number, $message, $user) {
	
	$link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to databse. ");
    }
    
	$query = "INSERT INTO DocketChat (DocketNumber, Message, User) VALUES ($docket_number, '" . mysql_real_escape_string($message) . "', '$user')";
    $result = mysql_query($query, $link);
    if (!$result) {
        die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));
    } else {
		echo json_encode(array("Query Successful" => $query));
    }
    disconnect($link);

}


/*
	Given a large semi-colon separated string of mysql queries,
	run each individual query.
*/
function runQueries($queries) {
	$individual_queries = explode(";", $queries);
	foreach ($individual_queries as $query) {
		if ($query !== "") {
			runQuery($query);
		}
	}
	echo json_encode($queries);

}

?>