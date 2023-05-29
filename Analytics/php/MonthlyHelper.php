<?php
/*
	This helper file serves the Monthly Analytics Controller.
	Written May 28th, 2014 by Peter Tran
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
		case 'get_monthly':
			if(!isset($objData->data->yearmonth)) {
					die(json_encode(array('ERROR' => 'year-month not given.',
						"Received" => $objData->data)));
			} else {
				getMonthly($objData->data->yearmonth,$objData->data->year,$objData->data->month );
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
	Get reports for the given month.	
*/
function getMonthly($yearmonth, $year, $month) {

	$results = array(); //Store the results
	$days_in_month = range(1, days_in_month($month, $year));
	foreach ($days_in_month as $day) {

		$result = array("day" => $day); /* Array to store the day's data*/

		/* Quote info */
		$result["total_quotes"] = getTotalQuotes($yearmonth, $day);
		$result["total_quotes_dollars"] = getTotalQuotesDollars($yearmonth, $day);

		$result["total_orders"] = getTotalOrders($yearmonth, $day);
		$result["total_orders_dollars"] = getTotalOrdersDollars($yearmonth, $day);

		$result["total_invoice"] = getTotalInvoice($yearmonth, $day);
		$result["total_invoice_dollars"] = getTotalInvoiceDollars($yearmonth, $day);
		array_push($results, $result); 
	}
	echo json_encode($results);
}

/* Given a year month and specific day, get the total quotes made that day. */
function getTotalQuotes($yearmonth, $day) {
	$date = $yearmonth . "-" . $day;
	$query = "SELECT count(*) as total
	FROM QT_Quote 
	WHERE date = '$date'";
	$result = runQuery($query);
	if ($result) {
		$row = mysql_fetch_array($result);
		return $row['total'];

	} else {
		return -1;
	}
}

/* Given a year month and specific day, get the total dollar amount quoted
 that day. 

The total will be the sum of hte average quote quantities per quote_id.
 */
function getTotalQuotesDollars($yearmonth, $day) {
	$date = $yearmonth . "-" . $day;
	$query = "SELECT SUM(total) as total from 
	(SELECT AVG(total) as total
			FROM 
				(SELECT * 
					FROM QT_Quote 
					WHERE date='$date') as A 
				NATURAL JOIN 
				QT_QuoteQuantities
			GROUP BY quote_number) as B
	
";
	$result = runQuery($query);
	$results_array = array();
	if ($result) {
		if ($row = mysql_fetch_array($result)) {
			return floor($row["total"]);

		}
	}
}


/* Given a year month and specific day, get the total orders made that day. */
function getTotalOrders($yearmonth, $day) {
	$date = $yearmonth . "-" . $day;
	$query = "SELECT count(*) as total
	FROM Production 
	WHERE DATE(Date)='$date'";
	$result = runQuery($query);
	if ($result) {
		$row = mysql_fetch_array($result);
		return $row['total'];

	} else {
		return -1;
	}
}

/* Given a year month and specific day, for all the 
orders made that day, get the total dollars */
function getTotalOrdersDollars($yearmonth, $day) {
	$date = $yearmonth . "-" . $day;
	$query = "SELECT SUM(total) as total FROM
	(SELECT QuoteNumber as quote_number, QuoteQuantityID as quantity_id
	FROM Production 
	WHERE DATE(Date)='$date') as A
	NATURAL JOIN
	QT_QuoteQuantities
";
	$result = runQuery($query);
	if ($result) {
		if ($row = mysql_fetch_array($result)) {
			if (empty($row)) {
				return 0;
			} else {
				return $row['total'];
			}
		}

	} else {
		return -1;
	}
}


/* Given a year month and specific day, 
get the total number of jobs closed that day.. */
function getTotalInvoice($yearmonth, $day) {
	$date = $yearmonth . "-" . $day;
	$query = "SELECT count(*) as total
	FROM Production 
	WHERE DATE(CloseDate)='$date'";
	$result = runQuery($query);
	if ($result) {
		$row = mysql_fetch_array($result);
		return $row['total'];

	} else {
		return -1;
	}
}


/* Given a year month and specific day, for all the 
orders that were closed that day, get the total dollar amount quote. */
function getTotalInvoiceDollars($yearmonth, $day) {
	$date = $yearmonth . "-" . $day;
	$query = "SELECT SUM(total) as total FROM
	(SELECT QuoteNumber as quote_number, QuoteQuantityID as quantity_id
	FROM Production 
	WHERE DATE(CloseDate)='$date') as A
	NATURAL JOIN
	QT_QuoteQuantities
";
	$result = runQuery($query);
	if ($result) {
		$row = mysql_fetch_array($result);
		return $row['total'];

	} else {
		return -1;
	}
}

function days_in_month($month, $year) 
{ 
// calculate number of days in a month 
return $month == 2 ? ($year % 4 ? 28 : ($year % 100 ? 29 : ($year % 400 ? 28 : 29))) : (($month - 1) % 7 % 2 ? 30 : 31); 
} 
?>