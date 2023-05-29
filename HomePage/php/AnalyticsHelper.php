<?php
/*
	This helper file serves the Analytics Controller.
	Written Aug 23rd, 2013 by Peter Tran
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
		case 'get_closing_data':
			if(!isset($objData->data->yearmonth)) {
					die(json_encode(array('ERROR' => 'year-month not given.',
						"Received" => $objData->data)));
			} else {
				getClosingData($objData->data->yearmonth);
			}
			break;
		case 'get_average_quote':
			if(!isset($objData->data->yearmonth)) {
					die(json_encode(array('ERROR' => 'year-month not given.',
						"Received" => $objData->data)));
			} else {
				getAverageQuote($objData->data->yearmonth);
			}
			break;
		case 'get_quote_hits':
			if(!isset($objData->data->yearmonth)) {
					die(json_encode(array('ERROR' => 'year-month not given.',
						"Received" => $objData->data)));
			} else {
				getQuoteHits($objData->data->yearmonth);
			}
			break;
		case 'get_daily_quote_jobs':
				getDailyQuoteJobs();			
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
	Find the current max docket number and return that plus one. 
	This number will be used at the new docket number.	
*/
function getClosingData($yearmonth) {
	$query = "SELECT *  
    FROM Production 
    WHERE CloseDate BETWEEN '$yearmonth' 
                   AND LAST_DAY( '$yearmonth' ) ORDER BY CloseDate ASC";
	$result = runQuery($query);
	$results_array = array();
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			array_push($results_array, $row);
		}
	}
	echo json_encode($results_array);
}

/*
	Given yearmonth (a month for a given year), find the variance between when 
	quotes for jobs that month were created and when the job comes through.
*/
function getAverageQuote($yearmonth) {

	$query = "
		SELECT AVG(DATEDIFF( AcceptedDate, EnteredDate )) as Difference FROM 
		(SELECT QuoteNumber as quote_number, Date as AcceptedDate 
	    FROM Production 
	    WHERE Date BETWEEN '$yearmonth' 
	                   AND LAST_DAY( '$yearmonth' )) as A
			NATURAL JOIN 

		(SELECT quote_number, date as EnteredDate 
			FROM QT_Quote
			WHERE date BETWEEN '$yearmonth' 
	                   AND LAST_DAY( '$yearmonth' )
			) as B
		";
	$result = runQuery($query);
	if ($result) {
		if ($row = mysql_fetch_array($result)) {
			$average = $row['Difference'];
		}
	}

	$query = "
		SELECT AVG(DATEDIFF( AcceptedDate, EnteredDate )) as Difference, Customer FROM 
		(SELECT QuoteNumber as quote_number, Date as AcceptedDate, Customer  
	    FROM Production 
	    WHERE Date BETWEEN '$yearmonth' 
	                   AND LAST_DAY( '$yearmonth' )) as A
			NATURAL JOIN 

		(SELECT quote_number, date as EnteredDate 
			FROM QT_Quote
			WHERE date BETWEEN '$yearmonth' 
	                   AND LAST_DAY( '$yearmonth' )
			) as B

		GROUP BY Customer
		";	
	$result = runQuery($query);
	$customerAverage = array();
	if ($result) {

		while ($row = mysql_fetch_array($result)) {
			array_push($customerAverage, $row);
		}
	}

	echo json_encode(array("average" => $average, "customers_average" => $customerAverage));

}
/*
	Given the yearmonth, get the hit rate per customer and overall hit rate.
	Hit rate is defined by of all quote created this month,
	how many turn into jobs.
*/
function getQuoteHits($yearmonth) {

	$query = "SELECT Customer, Count(*) as quotes
			FROM QT_Quote
			WHERE date BETWEEN '$yearmonth' 
	                   AND LAST_DAY( '$yearmonth' )
				GROUP BY Customer DESC";
	$result = runQuery($query);
	$customer_hits = array();
	if ($result) {

		while ($row = mysql_fetch_array($result)) {
			$customer_hits[$row['Customer']] = array("quotes" => $row['quotes'], "Customer" => $row['Customer'], "hits" => 0, "hit_rate" => 0, "sold" => 0);
		}
	}
	$query = "SELECT COUNT(*) as hit, Customer, SUM(A.FinalPrice) as sold
			 FROM 

				(SELECT QuoteNumber as quote_number, Customer, FinalPrice
				FROM Production) as A

					NATURAL JOIN 

				(SELECT quote_number 
				FROM QT_Quote
				WHERE date BETWEEN '$yearmonth' 
					AND LAST_DAY( '$yearmonth' )) AS B
			GROUP BY Customer";
	$result = runQuery($query);
	if ($result) {

		while ($row = mysql_fetch_array($result)) {
			$customer_hits[$row['Customer']]['hits'] = $row['hit'];
			$customer_hits[$row['Customer']]['sold'] = $row['sold'];
			$customer_hits[$row['Customer']]['hit_rate'] = floor(($row['hit'] / $customer_hits[$row['Customer']]['quotes']) * 100);
		}
	}
	echo json_encode($customer_hits);

}	

/*
	Return the number of quotes created and jobs entered per day for the last 30 days.
*/
function getDailyQuoteJobs() {
	$counts = array();
	
	/*
		Get number of quotes created for each day in the past 30 days.
	*/
	$query = "SELECT DATE(date) as date, Count(*) as quotes
			FROM QT_Quote
			WHERE date BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE()
	        GROUP BY DATE(date)";
	$result = runQuery($query);

	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			$counts[$row['date']] = array('quotes' => $row['quotes'],
										'date' => $row['date']);
		}
	}

	/*
		Get number of jobs opened for each day in the past 30 days.
	*/
	$query = "SELECT DATE(Date) as date, Count(*) as opened
			FROM Production
			WHERE Date BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE()
	        GROUP BY DATE(Date)";
	$result = runQuery($query);

	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			$counts[$row['date']]["opened"] = $row['opened'];
		}
	}

	/*
		Get the number of jobs closed for each day in the past 30 days.
	*/
	$query = "SELECT DATE(CloseDate) as date, Count(*) as closed
			FROM Production
			WHERE Date BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE()
				AND Status='closed'
	        GROUP BY DATE(Date)";
	$result = runQuery($query);

	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			$counts[$row['date']]["closed"] = $row['closed'];
		}
	}

	echo json_encode($counts);
}

?>