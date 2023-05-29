<?php
/* 
This file was created March 1st, 2013 by Peter Tran.
This file accepts POST requests from $http for calls to
tables in the database with the prefix QT_
*/
/* Connection the database */
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
/* Database query helpers: runQuery */
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/backendHelper.php";

// The request is a JSON request.
// We must read the input.
// $_POST or $_GET will not work! 
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
		case 'get_table_row':
			if (!isset($objData->data->table)) {
				die(json_encode(array('ERROR' => 'No table given.')));
			} else {
				getTableRow($objData->data->table);
			}
			break;
		case 'get_table':
			if (!isset($objData->data->table)) {
				die(json_encode(array('ERROR' => 'No table given.')));
			} else {
				getTable($objData->data->table);
			}
			break;
		case 'set_master_rate':
			if(!isset($objData->data->rate) ||
			 !(isset($objData->data->name)) ||
			 !(isset($objData->data->table))) {
				die(json_encode(array('ERROR' => 'Rate, table or name not given.')));
			} else {
				setMasterRate();
			}
			break;		
		case 'add_extra':
			if(!isset($objData->data->quote_number) ||
			 !(isset($objData->data->quantity_id))) {
				die(json_encode(array('ERROR' => 'Quote Number or Quantity ID or name not given.')));
			} else {
				addExtra($objData->data->quote_number, $objData->data->quantity_id);
			}
			break;
		case 'set_extra_field':
			if( !isset($objData->data->quote_number) ||
			 !isset($objData->data->quantity_id) ||
			 !isset($objData->data->extra_id) ||
			 !isset($objData->data->column) ||
			 !isset($objData->data->val) ) {

				die(json_encode(array('ERROR' => 'Quote number, quantity id, extra id, extra column or value not given.',
									"passed in" => $objData)));
			} else {
				setExtraField($objData->data->quote_number, $objData->data->quantity_id, $objData->data->extra_id, $objData->data->column, $objData->data->val);
			}
			break;
		case 'delete_extra_field':
			if( !isset($objData->data->quote_number) ||
			 !isset($objData->data->quantity_id) ||
			 !isset($objData->data->extra_id)) {

				die(json_encode(array('ERROR' => 'Quote number, quantity id or extra id not given.',
									"passed in" => $objData)));
			} else {
				deleteExtraField($objData->data->quote_number, $objData->data->quantity_id, $objData->data->extra_id);
			}
			break;
		case 'delete_quantity':
			if ( !isset($objData->data->quote_number) ||
			 !isset($objData->data->quantity_id)) {

				die(json_encode(array('ERROR' => 'Quote number or quantity id not given.',
									"passed in" => $objData)));
			} else {
				deleteQuantity($objData->data->quote_number, $objData->data->quantity_id);
			}
			break;
		case 'get_quantities':
			if ( !isset($objData->data->quote_number)) {

				die(json_encode(array('ERROR' => 'Quote number not given.',
									"passed in" => $objData)));
			} else {
				getQuantities($objData->data->quote_number);
			}
			break;
		case 'get_extras':
			if ( !isset($objData->data->quote_number)) {

				die(json_encode(array('ERROR' => 'Quote number not given.',
									"passed in" => $objData)));
			} else {
				getExtras($objData->data->quote_number);
			}
			break;
		case 'get_quote':
			if ( !isset($objData->data->quote_number)) {

				die(json_encode(array('ERROR' => 'Quote number not given.',
									"passed in" => $objData)));
			} else {
				getQuote($objData->data->quote_number);
			}
			break;
		case 'save_quote_data':
			if ( !isset($objData->data->quote_number) ||
				 !isset($objData->data->column) ||
				  !isset($objData->data->value)) {

				die(json_encode(array('ERROR' => 'Quote number, column or value not given.',
									"passed in" => $objData)));
			} else {
				saveQuoteData($objData->data->quote_number,$objData->data->column,$objData->data->value);
			}
			break;
		case 'get_customer_emails':
			if ( !isset($objData->data->customer)) {

				die(json_encode(array('ERROR' => 'Customer not given.',
									"passed in" => $objData)));
			} else {
				getCustomerEmails($objData->data->customer);
			}
			break;
		case 'set_as_new':
			if (!isset($objData->data->quote_number)) {
				die(json_encode(array('ERROR' => 'Quote Number not given.',
									"passed in" => $objData)));
			} else {
				setAsNew($objData->data->quote_number);
			}
			break;
		default:
			die(json_encode(array('ERROR' => '' . $objData->data->request . ' is an unrecognized request.')));
			break;
	}

} else {
	//Handler for regular ajax POST requests.
	if (isset($_POST["request"])) {
		switch ($_POST["request"]) {
			case 'get_table_visible':
				if (!isset($_POST['table'])) {
					die(json_encode(array('ERROR' => 'No table given.')));
				} else {
					getTableVisible($_POST['table']);
				}
				break;
			case "get_customers":
				getCustomers();
				break;
			case "create_quote":
				if (!isset($_POST['customer'])) {
					die(json_encode(array('ERROR' => 'Customer or quote number not submitted.')));
				}
				createQuote();
				break;
			case "create_quantity":
				if (!isset($_POST['customer']) || !isset($_POST['quote_number'])) {
					die(json_encode(array('ERROR' => ' Quote number or customer not submitted.')));
				}
				createQuantity();
				break;
			case 'update_quote_quantity':
				if(
					!isset($_POST["quote_number"]) ||
					 !isset($_POST["quantity_id"]) ||
					 !isset($_POST["value"]) ||
					 !isset($_POST["column"])
					) {				
					die(json_encode(array('ERROR' => 'Quote number, quantity id, value or column not given.')));
				} else {
					updateQuoteQuantity();
				}
			break;
			case 'update_quantity_rate':
				if(
					!isset($_POST["quote_number"]) ||
					 !isset($_POST["quantity_id"]) ||
					 !isset($_POST["value"]) ||
					 !isset($_POST["column"])
					) {				
					die(json_encode(array('ERROR' => 'Quote number, quantity id, value or column not given.')));
				} else {
					updateQuantityRate();
				}
			break;
			case 'get_rates':
				if (!isset($_POST["quote_number"])) {
					die(json_encode(array('ERROR' => 'Quote number not given.')));					
				} else {
					getRates();
				}
				break;
			default:
				die(json_encode(array('ERROR' => '' . $_POST['request'] . ' is an unrecognized post request.')));
				break;
		}
	} else {
		/* If the request was not found, return an error. */
		die(json_encode(array('ERROR' => 'request not passed in.')));}
}

/* 
	Get the one row from the table passed in.
*/
function getTableRow($table) {

	$query = "SELECT * FROM $table";
	if ($row = mysql_fetch_array(runQuery($query), MYSQL_ASSOC)) {
		echo json_encode($row, JSON_FORCE_OBJECT);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/*
	Get an array where each entry is a row from the given table.
*/
function getTable($table) {
	$query = "SELECT * FROM $table WHERE visible=1";
	$result = runQuery($query);
	if ($result) {
		$result_array = array();
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			array_push($result_array, $row);
		}
		echo json_encode($result_array, JSON_FORCE_OBJECT);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/*
	Given a rate int and name string that is an entry within
	QT_MasterRates, QT_Press or QT_Gluer, update that value with
	the given rate.
*/
function setMasterRate() {
	/* Set variables. */
	global $objData;
	$rate = $objData->data->rate;
	$name = $objData->data->name;
	$table = $objData->data->table;

	switch($table) {

		//Master rates is a single entry table
		case "QT_MasterRates":
			$query = "UPDATE QT_MasterRates SET $name=$rate LIMIT 1";
			break;

		//Other tables have multiple entries.
		default:
			$query = "UPDATE $table SET rate=$rate WHERE name='$name'";
			break;
	}
	$result = runQuery($query);
	if ($result) {
		echo "Query Successful: $query";
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/*
	Create a new entry in the QT_Extras table for the given quote and quantity.
	Set id=1 if it doesn't exist in the table, i + 1 if it does where i is the max.
*/
function addExtra($quote_number, $quantity_id) {

	/* The extra id being created. */
	$extra_id = getMaxExtra($quote_number, $quantity_id) + 1;

	//Create an entry in QT_Extras
	$query = "INSERT INTO `QT_Extras` (
							`quote_number`,
							`quantity_id`,
							`extra_id`
												)
					VALUES (
							$quote_number,
							$quantity_id,
							$extra_id
							)";
	$result = runQuery($query);
	if ($result) {
		echo json_encode(array('Success' => 'Query successful: ' . $query,
			'result' => array('quantity_id' => $quantity_id,
							'extra_id' => $extra_id,
							'name' => '',
							'cost_per_m' => 0,
							'cost' => 0)));
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
	}
}

/*
	Given a quote number, a quantity id, an extra id, set the given value and to the given column in the database.
*/
function setExtraField($quote_number, $quantity_id, $extra_id, $column, $value) {
	
	$query = 'INSERT INTO `QT_Extras` (`quote_number`,`quantity_id`,`extra_id`) ' .
			'VALUES (' .$quote_number . ',' .$quantity_id . ',' .$extra_id . ')' .
			 ' ON DUPLICATE KEY UPDATE ' . $column . '="' . $value . '"';
	$result = runQuery($query);
	if ($result) {
		echo json_encode(array('Success' => "Query successful: " . $query));
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
	}

}

/*
	Given a quote number, quantity id and an extra id, remove that extra from the quote.
*/
function deleteExtraField($quote_number, $quantity_id, $extra_id) {
	$query = 'DELETE FROM `QT_Extras` WHERE quote_number=' . $quote_number .
			 ' AND quantity_id='. $quantity_id .
			 ' AND extra_id='. $extra_id;
	$result = runQuery($query);
	if ($result) {
		echo json_encode(array('Success' => "Query successful: " . $query));
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
	}
}
/*
	Given a quote number and quantity id, remove it from the quote.
*/
function deleteQuantity($quote_number, $quantity_id) {

	$returnData = array();

	//Delete from Quote quantities.
	$query = 'DELETE FROM `QT_QuoteQuantities` WHERE quote_number=' . $quote_number .
			 ' AND quantity_id='. $quantity_id;
	$result = runQuery($query);
	if ($result) {
		$returnData['Success'] = "Query successful: " . $query;
	} else {
		$returnData['ERROR'] = 'Query Failed: ' . $query . " " . mysql_error();			
	}

	//Delete from Quote quantities.
	$query2 = 'DELETE FROM `QT_Rates` WHERE quote_number=' . $quote_number .
			 ' AND quantity_id='. $quantity_id;
	$result = runQuery($query2);
	if ($result) {
		$returnData['Success2'] = "Query successful: " . $query2;
	} else {
		$returnData['ERROR2'] = 'Query Failed: ' . $query2 . " " . mysql_error();			
	}
	echo json_encode($returnData);
}

/*
	Return a json array of quote quantities for the given quote
*/
function getQuantities($quote_number) {
	$query = "SELECT * FROM `QT_QuoteQuantities` WHERE `quote_number`=" . $quote_number . " ORDER BY `quantity_id` ASC";
	$result = runQuery($query);
	$quantities = array();
	if ($result) {
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$quantities[$row["quantity_id"]] = $row;
		}
		echo json_encode($quantities);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/*
	Return a json array of quote extras.
*/
function getExtras($quote_number) {
	$query = "SELECT * FROM `QT_Extras` WHERE `quote_number`=" . $quote_number . " ORDER BY `quantity_id` ASC";
	$result = runQuery($query);
	$quantity_id = null;
	$quantities = array();
	if ($result) {
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			if ($quantity_id != $row["quantity_id"]) {
				$quantity_id = $row["quantity_id"];
				$quantities[$quantity_id] = array();
			}
			$quantities[$quantity_id][$row["extra_id"]] = $row;
		}
		echo json_encode($quantities);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/*
	Return a json array of quote quantities for the given quote
*/
function getQuote($quote_number) {
	date_default_timezone_set("America/Toronto");
	$query = "SELECT * FROM `QT_Quote` WHERE `quote_number`=" . $quote_number;
	$result = runQuery($query);
	if ($result) {
		if ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$row['date'] = date("M jS, Y", strtotime($row['date']));
			echo json_encode($row);
		}
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/*
	Given a quote number, update the given column with the given value
*/
function saveQuoteData($quote_number, $column, $value) {

	$query = 'UPDATE `QT_Quote` SET ' . $column . '="' . $value .
			 '" WHERE quote_number=' . $quote_number;
	$result = runQuery($query);
	if (!$result) {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	} else {
		echo json_encode(array('Success' => $query));
	}
}

/*
	Given a customer name, retrieve a list of contact emails for that customer.
*/
function getCustomerEmails($customer) {
	$query = "SELECT Email FROM CustomerContactEmails 
        WHERE Customer='$customer'";
    $result = runQuery($query);
    $emails = array();
	if (!$result) {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	} else {
		while ($row = mysql_fetch_array($result)) {
			array_push($emails, $row[0]);
		}
		echo json_encode($emails);
	}
}

/*
	Given a quote number, for the tables QT_Extras, QT_Quote, QT_QuoteQuantities, QT_Rates,
	Copy all the rows that have the matching quote number and save it into a temp table.
	Set the quote number for the temp table to be the max quote number (from QT_Quote).
	Insert the temp table back into the original table and delete the temp table.
*/
function setAsNew($quote_number) {
	/* The new quote number. */
	
	$new_quote_number = getNextQuoteNumber();

	/* All the tables that store quote informaiton. */
	$tables = array("QT_Extras", "QT_Quote", "QT_QuoteQuantities", "QT_Rates");
	foreach ($tables as $table) {
		$query = "CREATE table temporary_table AS SELECT * FROM " . $table . " WHERE quote_number='" . $quote_number . "';";
		$query2 = "UPDATE temporary_table SET `quote_number`='" . $new_quote_number . "';";
		$query3 = "INSERT INTO " . $table . " SELECT * FROM temporary_table;";
		$query4 = "DROP TABLE temporary_table";
		runQuery(str_replace(array("\r", "\n"), '', $query));
		runQuery(str_replace(array("\r", "\n"), '', $query2));
		runQuery(str_replace(array("\r", "\n"), '', $query3));
		runQuery(str_replace(array("\r", "\n"), '', $query4));
	}

	//Update QT_Quote.date with the current date.
	$query = "UPDATE QT_Quote Set date=now() WHERE quote_number=" . $new_quote_number;
	runQuery($query);
	echo json_encode(array("new_quote_number" => $new_quote_number));
}

/*
	Return a json array of customers from the Customers table.
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
	Return the next quote number that is not used in the database.
*/
function getNextQuoteNumber() {
	$query ="SELECT MAX(quote_number) as max_quote FROM `QT_Quote`";
	$result = runQuery($query);
	if ($result) {
		if ($row = mysql_fetch_array($result)) {
			return $row["max_quote"] + 1;
		}
	} else {
		return 0;
	}
}
/*
	Return the highest quote number in the mysql table
	QT_quote as a value.
*/
function returnMaxQuote() {
	$query ="LOCK TABLES QT_Quote;
START TRANSACTION; SELECT MAX(quote_number) as max_quote FROM `QT_Quote`";
	$result = runQuery($query);
	if ($result) {
		if ($row = mysql_fetch_array($result)) {
			return $row["max_quote"];
		}
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/*
	Create an entry in the QT_Quote with the given quote number and values.
*/
function createQuote() {
	date_default_timezone_set("America/Toronto");

	$quote_number = getNextQuoteNumber();

	$author = (isset($_POST['author'])? $_POST['author'] : 'NULL');
	$job_name = (isset($_POST['job_name'])? $_POST['job_name'] : 'NULL');
	$description = (isset($_POST['description'])? $_POST['description'] : 'NULL');
	$notes = (isset($_POST['notes'])? $_POST['notes'] : 'NULL');
	$attention = (isset($_POST['attention'])? $_POST['attention'] : 'NULL');
	$customer = (isset($_POST['customer'])? $_POST['customer'] : 'NULL');

	$query = 'INSERT INTO QT_Quote (`quote_number`,`author`,`job_name`,`description`,`notes`,`attention`,`customer` , `date` ) Values  (' . $quote_number . ',"' . $author . '","' . $job_name . '","' . $description . '","' . $notes . '","' . $attention . '","' . $customer . '", NOW());';
	$result = runQuery($query);
	if ($result) {
		echo json_encode(array('Success' => "Query successful: " . $query,
								'Date' => date('Y-m-d'),
								'quote_number' => $quote_number ));
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
	}
}

/*
	Create a new quantity.
	Create an entry in QT_QuoteQuantities with quantity +1 the max existing quantities.
	Create an entry in QT_Rates with the corresponding quote, quantity and the current rates in master rates.
*/
function createQuantity () {
	/* The quote number who's quantity is being increased. */
	$quote_number = $_POST['quote_number'];
	/* The rate of the default press */
	$press_per_hour = getPressRate('1');
	/* The rate of the default gluer */
	$gluer_per_hour = getGluerRate('1');
	
	/* The quantity i.d. being created */
	$quantity_id = getMaxQuantity($quote_number) + 1;

	//TODO: Move this to helper function
	//Create an entry in QT_QuoteQuantities
	$query = "INSERT INTO `QT_QuoteQuantities` (
							`quote_number`,
							`quantity_id`,
							`stock_id`
												)
					VALUES (
							$quote_number,
							$quantity_id,
							1
							)";
	$result = runQuery($query);
	if ($result) {
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
	}

	//TODO: Move this into helper function
	//Create an entry in QT_Rates

	$customer_premium = getCustomerPremium($_POST['customer']);

	$rates_result = runQuery("SELECT * FROM `QT_MasterRates`");
	if ($rates = mysql_fetch_array($rates_result)) {
		$set_rate_query = 'INSERT INTO `QT_Rates` (`quote_number`,`quantity_id`,`strip_per_hour`,`die_per_hour`,`cutter_per_hour`,`press_per_hour`,`gluer_per_hour`,`handwork_per_hour`,`pickup_first_skid`,`pickup_per_skid`,`delivery_first_skid`, `delivery_per_skid`, `global_premium`, `customer_premium`) VALUES (' . $quote_number . ',' . $quantity_id . ',' . $rates["strip_per_hour"] . ',' . $rates["die_per_hour"] . ',	' . $rates["cutter_per_hour"] . ',' . $press_per_hour . ',	' . $gluer_per_hour . ',' . $rates["handwork_per_hour"] . ',' . $rates["pickup_first_skid"] . ',' . $rates["pickup_per_skid"] . ',' . $rates["delivery_first_skid"] . ',' . $rates["delivery_per_skid"] .',' . $rates["global_premium"] . ',' . $customer_premium . ')';
		$result = runQuery($set_rate_query);	
		if ($result) {
			//echo "Query successful: " . $set_rate_query;
		} else {
			die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
		}

		//Return the created entry
		$query = 'SELECT * FROM `QT_QuoteQuantities` WHERE `quote_number`=' . $quote_number . ' AND  `quantity_id`=' . $quantity_id;
		$result = runQuery($query);
		if ($result) {
			if ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
				echo json_encode($row, true);
			}
		}
	}	
}

/*
	Given a quote number, return the highest quantity id for the given
	quote number.
*/
function getMaxQuantity($quote_number) {
	$query = "SELECT MAX(`quantity_id`) as M FROM `QT_QuoteQuantities` WHERE `quote_number`=$quote_number";
	$result = runQuery($query);
	if ($row = mysql_fetch_array($result)) {
		$max = ($row["M"] != null ? $row["M"] : 0);
		return $max;
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/* 
	Given a quote number and quantity ID, update the QT_quoteQuantities table.
	Set the column with the given column with the given value.
*/
function updateQuoteQuantity() {

	$query = 'UPDATE `QT_QuoteQuantities` SET ' . $_POST['column'] . '="' . $_POST["value"] .
			 '" WHERE quote_number=' . $_POST["quote_number"] .
			 ' AND quantity_id='. $_POST["quantity_id"];
	$result = runQuery($query);
	if ($result) {
		echo json_encode(array('SUCCESS'=> $query), true);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
	}
}

/*
	Given the quote number, a quantity id, update the QT_Rates table
	with the given value 'val' and column 'col'.
*/
function updateQuantityRate() {
	$query = 'UPDATE `QT_Rates` SET ' . $_POST['column'] . '=' . $_POST["value"] .
			 ' WHERE quote_number=' . $_POST["quote_number"] .
			 ' AND quantity_id='. $_POST["quantity_id"];
	$result = runQuery($query);
	if ($result) {
		echo json_encode(array('SUCCESS'=> $query), true);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
	}
}

/*
	Given a table, return all rows where they are visible.
*/
function getTableVisible ($table) {
	$query = "SELECT * FROM $table WHERE visible=1";
	$result = runQuery($query);
	if ($result) {		
		$result_array = array();
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			array_push($result_array, $row);
		}
		echo json_encode($result_array, JSON_FORCE_OBJECT);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
	}
}

/*
	Given a quote number, return the rates for each quantity.
*/
function getRates() {
	$quoteNumber = $_POST['quote_number'];	
	$query = "SELECT * FROM QT_Rates WHERE quote_number=$quoteNumber";
	$result = runQuery($query);
	if ($result) {		
		$result_array = array();
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$result_array[$row['quantity_id']] = $row;
		}
		echo json_encode($result_array, JSON_FORCE_OBJECT);
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));			
	}
}

/*
	Given a press_id, return the master rate for it..
*/
function getPressRate($press_id) {
	$query = "SELECT rate FROM QT_Press WHERE press_id=$press_id";
	$result = runQuery($query);
	if ($result) {
		$row = mysql_fetch_array($result);
		if ($row) {
			return $row['rate'];
		} else {
			die(json_encode(array('ERROR' => 'Fetch array failed for query: ' . $query . " " . mysql_error())));
		}
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));
	}
}
/*
	Given a gluer_id, return the master rate for it..
*/
function getGluerRate($gluer_id) {
	$query = "SELECT rate FROM QT_Gluer WHERE gluer_id=$gluer_id";
	$result = runQuery($query);
	if ($result) {
		$row = mysql_fetch_array($result);
		if ($row) {
			return $row['rate'];
		} else {
			die(json_encode(array('ERROR' => 'Fetch array failed for query: ' . $query . " " . mysql_error())));
		}
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));
	}
}

/*
	Given a quote number and quantity_id, return the highest extra id for the given
	quote number/quantity id.
*/
function getMaxExtra($quote_number, $quantity_id) {
	$query = "SELECT MAX(`extra_id`) as M FROM `QT_Extras` WHERE `quote_number`=$quote_number and `quantity_id` = $quantity_id";
	$result = runQuery($query);
	if ($row = mysql_fetch_array($result)) {
		$max = ($row["M"] != null ? $row["M"] : 0);
		return $max;
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}

/*
	Given a customer, return their rate, if the customer does not exist in the database, return 1.
	TODO: Add customer to database?
*/
function getCustomerPremium($customer) {
	$query = "SELECT `Rate` as rate FROM `Customers` WHERE `Customer`='$customer'";
	$result = runQuery($query);
	if ($row = mysql_fetch_array($result)) {
		$customer_premium = ($row["rate"] != null ? $row["rate"] : 1);
		return $customer_premium;
	} else {
		die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));	
	}
}
?>