<?php
/*
  This helper file serves the Log Controller.
  Created Sept 16th, 2015
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
        get_email_log($objData->data->yearmonth);
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
  Get the logs for the given month.  
*/
function get_email_log($yearmonth) {
  $start_date = $yearmonth . "-1";
  $end_date = $yearmonth . "-31";
  $query = "SELECT * FROM Email_Log WHERE date BETWEEN '$start_date' AND '$end_date'";
  $result = runQuery($query);

  $results = array();
  while ($row = mysql_fetch_array($result)) {
    
    array_push($results, $row);
  }
  echo json_encode($results);
}

?>