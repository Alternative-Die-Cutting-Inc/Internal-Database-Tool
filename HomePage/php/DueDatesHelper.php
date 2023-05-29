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
		case 'get_jobs':
			getJobs();
			break;
		case 'get_jobs_simple':
			getJobsSimple();
			break;
		case 'get_jobs_by_log_date':
			getJobsByLogDate();
			break;
		case 'save_memo':
			if (!isset($objData->data->docket_number) ||
				!isset($objData->data->memo)) {
				die(json_encode(array('ERROR' => 'No docket number or memo given.',
						"Received" => $objData->data)));
			} else {	
				saveMemo($objData->data->docket_number, $objData->data->memo);				
			}
			break;
		case "set_due_date":
			if (!isset($objData->data->docket_number) ||
				!isset($objData->data->date)) {
					die(json_encode(array('ERROR' => 'No docket number or date given.',
						"Received" => $objData->data)));
			} else {	
				setDueDate($objData->data->docket_number, $objData->data->date);				
			}
			break;
		case "get_jobs_with_memo":
			if (!isset($objData->data->memo)) {
					die(json_encode(array('ERROR' => 'No docket number or date given.',
						"Received" => $objData->data)));
			} else {	
				getJobsWithMemo($objData->data->memo);				
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
	Return the open jobs and their due dates in an array.
	The array will have indexes: today, tomrrow, this week, next week and future, past
	Append to the array in the corresponding postion.
*/
function getJobs() {
	date_default_timezone_set("America/Toronto");

	/* Different types of queries*/
    $unset_query = "SELECT JobName, Customer, DocketNumber, DueDate, Memo, QuoteNumber, FinalPrice, ProductionPerson, CustomerPoNo,  Finishing, SpecialInstructions, Quantity
            FROM (Production NATURAL JOIN DueDate)
            WHERE status='open' AND DueDate IS NULL
            ORDER By DueDate ASC";
    $query = "SELECT JobName, Customer, DocketNumber, DueDate, Memo, QuoteNumber, FinalPrice, ProductionPerson, CustomerPoNo,  Finishing, SpecialInstructions, Quantity
            FROM (Production NATURAL JOIN DueDate)
            WHERE status='open' AND DueDate >= DATE(NOW())
            ORDER By DueDate ASC";
    $past_query = "SELECT JobName, Customer, DocketNumber, DueDate, Memo, QuoteNumber, FinalPrice, ProductionPerson, CustomerPoNo,  Finishing, SpecialInstructions, Quantity
            FROM (Production NATURAL JOIN DueDate)
            WHERE status='open' AND DueDate < DATE(NOW())
            ORDER By DueDate ASC";

    /* The orgnization of our results */
	$results = array("0unset" => array("name" => "Unset deadline - Address Immediately", "jobs" => array()),
					"past" => array("name" => "Past Jobs", "jobs" => array()));

	$result = runQuery($unset_query);
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			array_push($results["0unset"]["jobs"], $row);
		}
	}

	$result = runQuery($query);
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			if (!isset($results[$row['DueDate']])) {

				$results[$row['DueDate']] = array("name" => strftime($row['DueDate']), "jobs" => array());
			}
			array_push($results[$row['DueDate']]["jobs"], $row);
		}
	}

	$result = runQuery($past_query);
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			array_push($results["past"]["jobs"], $row);
		}
	}

	foreach ($results as $date_range => $info) {
		foreach ($info as $something) {
		 	if (is_array($something)) {
		 		foreach($something as $job) {

		 			$docket_number = $job["DocketNumber"];
		 			$job["DocketNumber"] = null;
		 			// $job["conversation_logs"] = array();
		 			// $query = "SELECT * FROM DocketChat WHERE DocketNumber=$docket_number";
		 			// $result = runQuery($query);
		 			// if ($result) {
		 			// 	while ($row = mysql_fetch_array($result)) {
		 			// 		array_push($job["conversation_logs"], $row);
		 			// 	}
		 			// }
		 		}
		 	}
		}
	}

	echo json_encode($results);
}

/*
	Given a docket number and a memo, set the DueDate table with the given memo
	where the docket number matches.
*/
function saveMemo($docket_number, $memo) {
	$query = "UPDATE DueDate SET Memo='$memo' WHERE DocketNumber='$docket_number'";
	$result = runQuery($query);
	if ($result) {
		echo json_encode(array("Success" => $query));
	}
}

/*
	Given a docket number and a date, set the DueDate in the table DueDate.
*/
function setDueDate($docket_number, $date) {
	$query = "UPDATE DueDate SET DueDate='$date' WHERE DocketNumber='$docket_number'";
	$result = runQuery($query);
	if ($result) {
		echo json_encode(array("Success" => $query));
	}
}

/*
	Given a memo, get all the open jobs with the matching memo.
*/
function getJobsWithMemo($memo) {
	$query = "SELECT JobName, Customer, DocketNumber, DueDate, Memo
            FROM (Production NATURAL JOIN DueDate)
            WHERE status='open' AND Memo='$memo'
            ORDER By DueDate ASC";
	$result = runQuery($query);
	$results = array();
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			array_push($results, $row);
		}
	}
	echo json_encode($results);
}

/*
	REturn jobs sorted by log date
*/
function getJobsByLogDate() {
	$query = "SELECT JobName, Customer, DocketNumber, DueDate, Memo, QuoteNumber, FinalPrice, ProductionPerson, CustomerPoNo,  Finishing, SpecialInstructions, Quantity, Date
            FROM (Production NATURAL JOIN DueDate)
            WHERE status='open'
            ORDER By DocketNumber DESC";
	$result = runQuery($query);
	$results = array();
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			array_push($results, $row);
		}
	}
	echo json_encode($results);
}

/*
	Output an array of jobs sorted by due date desc
*/
function getJobsSimple() {
	$query = "SELECT * FROM `Production` Natural Join DueDate WHERE Status='open'AND DueDate >= DATE(NOW()) ORDER BY DueDate ASC LIMIT 40";
	$result = runQuery($query);
	$results = array();
	$count = 0;
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			$row["id"] = $count;
			$results[$count] = $row;
			$count++;
		}
	}
	echo json_encode($results);
}

?>
