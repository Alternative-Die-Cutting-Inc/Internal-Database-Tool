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
		case 'get_customers':
			getCustomers();
			break;
		case 'get_quantities':
			if(!isset($objData->data->quote_number)) {
					die(json_encode(array('ERROR' => 'No docket number or date given.',
						"Received" => $objData->data)));
			} else {
				getQuantities($objData->data->quote_number);
			}
			break;
		case 'log_job':
			if(!isset($objData->data->customer_po) ||
				!isset($objData->data->job_name) ||
				!isset($objData->data->customer) ||
				!isset($objData->data->quantity_id) ||
				!isset($objData->data->quote_number)) {
					die(json_encode(array('ERROR' => 'No docket number or date given.',
						"Received" => $objData->data)));
			} else {
				logJob(
					$objData->data->customer_po,
					$objData->data->customer,
					$objData->data->job_name,
					$objData->data->quantity_id,
					$objData->data->quote_number);
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
	Find the current max docket number and return that plus one. 
	This number will be used at the new docket number.	
*/
function getMaxDocket() {
	$query = "SELECT MAX(DocketNumber) as DocketNumber FROM Production";
	$result = runQuery($query);
	if ($result) {
		$row = mysql_fetch_array($result);
		return $row["DocketNumber"] + 1;
	}
}


/*
	Return a list of all the customers
*/
function getCustomers() {
	$query = "SELECT Customer FROM Customers";
	$customers = array();
	$result = runQuery($query);
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			array_push($customers, $row[0]);
		}
		echo json_encode($customers);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/*
	Given a quote number, get the quantities of it from QT_QuoteQuantities.
	Include the quantity_id, total, total_per_m
*/
function getQuantities($quote_number) {
	$query = "SELECT quantity_id, total, total_per_m
				FROM QT_QuoteQuantities
				WHERE quote_number=$quote_number";
	$quantities = array();
	$result = runQuery($query);
	if ($result) {
		while ($row = mysql_fetch_array($result)) {
			array_push($quantities, $row);
		}
		echo json_encode($quantities);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}

}


        //(DocketNumber, CustomerPoNo, Status, Customer, JobName, Order quantity, QuoteQuantityID
            //DueDate: memo, DieNumber, 
/*
	Given the necessary information, log the job into the Production table and the DueDate table.
*/
function logJob( $customer_po, $customer, $job_name, $quantity_id, $quote_number) {
	global $objData;

	$docket_number = getMaxDocket();
	//Log production
	$query = "INSERT INTO Production
			(DocketNumber, 
				CustomerPoNo, 
				Status, 
				Customer, 
				JobName, 
				QuoteQuantityID, 
				QuoteNumber)
			VALUES
			('$docket_number', 
				'$customer_po',
				'open',
				'$customer',
				'$job_name',
				'$quantity_id',
				'$quote_number');";

	runQuery($query);

	//Log due dates
	$query = "INSERT INTO DueDate
			(DocketNumber,
				DueDate,
				Memo)
			VALUES
			('$docket_number',
				NOW(),
				'icon-question-mark')";

	runQuery($query);

	$query = "INSERT INTO Docket_Variance (docket_number) VALUES ('$docket_number')";
	runQuery($query);
	
	echo json_encode(array("docket_number" => $docket_number));
}
?> 
