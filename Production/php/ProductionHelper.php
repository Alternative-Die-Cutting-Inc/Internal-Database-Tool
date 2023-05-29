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
		case 'get_quantities':
			if(!isset($objData->data->quote_number)) {
					die(json_encode(array('ERROR' => 'No quote number given.',
						"Received" => $objData->data)));
			} else {
				getQuantities($objData->data->quote_number);
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
		case "run_queries":
			if (!isset($objData->data->query)) {
					die(json_encode(array('ERROR' => 'Query not passed.',
						"Received" => $objData->data)));
			} else {	
				runQueries($objData->data->query);				
			}
			break;
		case "run_query_return":
			if (!isset($objData->data->query)) {
					die(json_encode(array('ERROR' => 'Query not passed.',
						"Received" => $objData->data)));
			} else {	
				runQueryReturn($objData->data->query);				
			}
			break;
		case "close_job":
			if (!isset($objData->data->docket_number) || !isset($objData->data->close_date)) {
					die(json_encode(array('ERROR' => 'Query not passed.',
						"Received" => $objData->data)));
			} else {	
				closeJob($objData->data->docket_number, $objData->data->close_date);				
			}
			break;
		case "save_production":
				saveProduction($objData->data->DocketNumber, $objData->data->QuoteNumber, $objData->data->FinalPrice, $objData->data->ProductionPerson,$objData->data->CustomerPoNo, $objData->data->Customer, $objData->data->JobName, $objData->data->Finishing, $objData->data->SpecialInstructions, $objData->data->QuoteQuantityID, $objData->data->ExtrasTotal, $objData->data->JobType, $objData->data->RequoteMemo, $objData->data->Quantity);				
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
	Given a quote number, get the quantities of it from QT_QuoteQuantities.
	Include the quantity_id, total, total_per_m
*/
function getQuantities($quote_number) {
	$query = "SELECT quantity_id, total, total_per_m, units
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

/*
	Given a docket number, get all the forms.
*/
function getForms($docket_number) {
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



/*
	Given the docket number and a close date, close the job.
	if the close date is NOW(), then use that. Otherwise, convert it into the
	the mysql 
*/
function closejob($docket_number, $close_date) {
    
    $close_date=='CURRENT_TIMESTAMP';
	date_default_timezone_set('America/Toronto');
	checkMessagesResolved($docket_number);
	
	if ($close_date=='CURRENT_TIMESTAMP') {
		$query = "UPDATE Production SET Status='closed', CloseDate='$close_date' WHERE DocketNumber=$docket_number";

	} else {
	    
	    $query = "UPDATE Production SET Status='closed', CloseDate='$close_date' WHERE DocketNumber=$docket_number";
	    
	    

	}
	runQuery($query);
}

/*
	Given a docket number and all variables for a row in production,
	save those values into the database with mysql_real_escape each variable
*/
function saveProduction($DocketNumber, $QuoteNumber, $FinalPrice, $ProductionPerson,$CustomerPoNo, $Customer, $JobName, $Finishing, $SpecialInstructions, $QuoteQuantityID, $ExtrasTotal, $JobType, $RequoteMemo, $Quantity) {
	$link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to databse. ");
    }
    $query = "UPDATE Production SET " .

    			"DocketNumber='" .mysql_real_escape_string($DocketNumber) . "',"  . 
    			"QuoteNumber='" .mysql_real_escape_string($QuoteNumber) . "',"  . 
    			"FinalPrice='" .mysql_real_escape_string($FinalPrice) . "',"  . 
    			"Quantity='" .mysql_real_escape_string($Quantity) . "',"  . 
    				"ProductionPerson='" .mysql_real_escape_string($ProductionPerson) . "',"  .
    				"CustomerPoNo='" .mysql_real_escape_string($CustomerPoNo) . "',"  . 
    				"Customer='" .mysql_real_escape_string($Customer) . "',"  . 
    				"JobName='" .mysql_real_escape_string($JobName) . "',"  . 
    				"Finishing='" .mysql_real_escape_string($Finishing) . "',"  . 
    				"SpecialInstructions='" .mysql_real_escape_string($SpecialInstructions) . "',"  . 
    				"QuoteQuantityID='". mysql_real_escape_string($QuoteQuantityID)  . "'," .
    				"ExtrasTotal='" .mysql_real_escape_string($ExtrasTotal) . "',"  . 
    				"JobType='" .mysql_real_escape_string($JobType) . "',"  .
    			"RequoteMemo='" .mysql_real_escape_string($RequoteMemo) . "'"  
    						. " WHERE DocketNumber=$DocketNumber";
    $result = mysql_query($query, $link);
    if (!$result) {
        die(json_encode(array('ERROR' => 'Query Failed: ' . $query . " " . mysql_error())));
    }
    disconnect($link);

    $isClosed = isClosed($DocketNumber);
    //If QuoteQuantityID is not 0 (someone selected a quote the job connects to) 
    // Then 
    if ($QuoteQuantityID != 0 && !$isClosed) {
    	$query = "SELECT *
    		FROM QT_QuoteQuantities 
    		WHERE quote_number='$QuoteNumber' AND quantity_id='$QuoteQuantityID'";
    		$result = runQuery($query);
    		if ($result) {
    			$row = mysql_fetch_array($result);
    			$press_setup_quoted = $row['press_setup'];
    			if ($row['press_runspeed'] == 0 ) {
    				$press_run_quoted = 0;
    			} else {
    				$press_run_quoted = round_up($row['sheets'] / $row['press_runspeed'],2);
    			
    			}
    			$gluer_setup_quoted = $row['gluer_setup'] ;
    			if ($row['gluer_runspeed'] == 0) {
    				$gluer_run_quoted = 0;
    			} else {
    				$gluer_run_quoted = round_up($row['units'] / $row['gluer_runspeed'],2);
    			}

    			if ($row['strip_runspeed'] == 0) {
    				$strip_run_quoted = 0;
    			} else {
    				$strip_run_quoted = round_up($row['units'] / $row['strip_runspeed'],2);
    			}

    			if ($row['handwork_runspeed'] == 0) {
    				$handwork_run_quoted = 0;
    			} else {
    				$handwork_run_quoted = round_up($row['units'] /$row['handwork_runspeed'],2);
    			}//insert into table (id, name, age) values(1, "A", 19) 
    			//on duplicate key update name=values(name), age=values(age)
    			$query = "INSERT INTO Docket_Variance
    							(docket_number, press_setup_quoted, press_setup, press_run_quoted, press_run, gluer_setup_quoted, gluer_setup,                                gluer_run_quoted, gluer_run,              strip_run_quoted, strip_run,              handwork_run_quoted, handwork_run)
    					VALUES ('$DocketNumber','$press_setup_quoted','$press_setup_quoted', '$press_run_quoted', '$press_run_quoted', '$gluer_setup_quoted', '$gluer_setup_quoted', '$gluer_run_quoted', '$gluer_run_quoted', '$strip_run_quoted', '$strip_run_quoted', '$handwork_run_quoted', '$handwork_run_quoted')
    					ON duplicate key update 
    					press_setup_quoted='$press_setup_quoted',
    					press_setup='$press_setup_quoted', 
    					press_run_quoted='$press_run_quoted',
    					gluer_setup_quoted='$gluer_setup_quoted',
    					gluer_setup='$gluer_setup_quoted', 
    					gluer_run_quoted='$gluer_run_quoted',
    					strip_run_quoted='$strip_run_quoted',
    					handwork_run_quoted='$handwork_run_quoted'";
    			runQuery($query);
    		}
    }
    echo json_encode(array("query" => $query));
}



/*
	Given the query, run it and return the result of hte query
*/
function runQueryReturn($query) {
	$result = runQuery($query);
	$row = mysql_fetch_array($result);
	echo json_encode($row);
}

 function round_up ($value, $places=0) {
  if ($places < 0) { $places = 0; }
  $mult = pow(10, $places);
  return ceil($value * $mult) / $mult;
 }

/*
	Return true if the given docket number is closed.
*/
function isClosed($DocketNumber) {
	$query = "SELECT * FROM Production WHERE DocketNumber=$DocketNumber AND Status='closed'";
	$result = runQuery($query);
	if(mysql_num_rows($result)==0){
	  return false;
	} else {
		return true;
	}
}

?>