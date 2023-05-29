<?php

/* * ***************************************************************************
 * This file governs the shipment job feed which is displayed in the home screen.
 * Fetch the most recent shipments for today up to some constant, and
 * output them on the screen along with the time they came in, ordering them
 * from most recent to oldest (desc).
 * 
 * Written by Peter Tran for Alternative Die Cutting, Inc.
 * Updated on July 15, 2012
 * 
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

//TODO move these into backend folder
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

 


define("MAX_NUM_SHIPMENTS", 20);

if (isset($_POST['show_shipments']) && isset($_POST['Company'])) {
    showShipments($_POST['Company']);
}

/**
 * Fetch up to MAX_NUM_SHIPMENTS from the table ShipStatus, fetching only jobs 
 * that haven't been picked up and jobs that have been picked up but 
 * @param resource $link The link to the database.
 */
function showShipments($company) {

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    date_default_timezone_set("America/Toronto");
    $today = date("Y-m-d");

    //Want outstanding jobs (havent been picked up). Mathwise
    // Its gonna be dateout < datein
    // and also want picked up jobs where the pick up date is within 1
    // days of the current date.
    if ($company == "") {
        $shippedQuery = "SELECT JobName, Customer, CustomerPoNo, TimeIn, DateIn, TimeOut, DateOut, DocketNumber, SessId 
                FROM (Production NATURAL JOIN SlipStatus) 
                WHERE (TO_DAYS(DateOut)>=TO_DAYS(NOW())-1)
                ORDER By DateOut DESC, TimeOut DESC";
        $query = "SELECT JobName, Customer, CustomerPoNo, TimeIn, DateIn, TimeOut, DateOut, DocketNumber, SessId 
                FROM (Production NATURAL JOIN SlipStatus) 
                WHERE ((DateOut IS NULL) AND (DateIn IS NOT NULL))
                ORDER By DateIn DESC, TimeIn DESC";
    } else {
        $shippedQuery = "SELECT JobName, Customer, CustomerPoNo, TimeIn, DateIn, TimeOut, DateOut, DocketNumber, SessId 
                FROM (Production NATURAL JOIN SlipStatus) 
                WHERE ((TO_DAYS(DateOut)>=TO_DAYS(NOW())-1) AND (Customer LIKE \"%$company%\"))
                ORDER By DateOut DESC, TimeOut DESC";
        $query = "SELECT JobName, Customer, CustomerPoNo, TimeIn, DateIn, TimeOut, DateOut, DocketNumber, SessId 
                FROM (Production NATURAL JOIN SlipStatus) 
                WHERE ((DateOut IS NULL) AND (Customer LIKE \"%$company%\")) 
                ORDER By DateIn DESC, TimeIn DESC";
    }

    $readyForSlipQuery = "SELECT DateIn, DocketNumber
                FROM SlipStatus 
                WHERE (DateIn IS NULL)";
    $readyResult = mysql_query($readyForSlipQuery, $link);

    if (($result = mysql_query($query, $link))) {
        echo "<div id='shipFrame'>";
        echo "<h2>Shipping</h2>";
        echo "<hr />";

        //First parse the delivery slip notification
        parseShipSlips($readyResult);

        //Second parse slips that have not been shipped
        parseShipSlips($result);

        //Lastly parse the slips that have been shipped.
        if (($shippedResults = mysql_query($shippedQuery, $link))) {
            parseShipSlips($shippedResults);
        }

        echo "</div>"; //end job frame
    } else {
        fail("Invalid SQL query: " . mysql_error(), false);
    }
}

/**
 * Given the result of the shipment query,
 *  echo the contents.
 */
function parseShipSlips($result) {
    while ($row = mysql_fetch_array($result)) {

        //No Shipments
        if (mysql_num_rows($result) === 0) {
            echo "<h3>No shipments to display</h3>";
        } else {

            //If DateIn is null, then the entry represents a job that is ready for a slip.
            if ($row['DateIn'] == NULL) {
                echoDeliverySlipNotification($row['DocketNumber']);
            } else {
                //If DateIn is not null, the row represents deliveryslips that are either
                //ready for pick up or have already been shipped.


                if ($row['DateOut'] == NULL) {
                    //If DateOut is null, this is an indication that the current delivery slip
                    //being parsed is ready for pick up (hence no value for date out).
                    echo "<div class='ShipmentHolder'>";
                    echoDeliverySlipReadyForPickUp($row);
                } else {
                    //Date out is not null implying this delivery slip has been picked up.
                    echo "<!--date out not null -->";
                    echo "<div class='ShipmentHolder shipDone'>";
                    echoDeliverySlipHasBeenPickedUp($row);
                }
                echo '</div><!-- End of .ShipmentHolder div -->';
                echo "<hr />";
            }
        }
    }
}

/**
 * Given the docket number of a job, echo the delivery slip notification divs
 * that are to be displayed in the shipment feed.
 */
function echoDeliverySlipNotification($docketNumber) {
    echo "<!-- This job is ready for a slip -->";
    echo '<a href="/Intranet/ShippingTool/shipping.php?DocketNumber=' . $docketNumber . '">
               <div class="prepareSlip">
                    <form method="get" action="/Intranet/ShippingTool/shipping.php">
                        <input type="hidden" name="DocketNumber" value="' . $docketNumber . '"/>
                        ' . $docketNumber . '
                    </form>
                </div>
          </a>';
    echo "<hr />";
}

/**
 * Given an array row that is from a mysql query which represents a delivery 
 * slip that is ready for pick up,
 * echo the required div and information that is meant for the shipmentfeed.
 */
function echoDeliverySlipReadyForPickUp($row) {
    //left and centre pane links to the shipment history page.
    echo '<a href="../ShippingTool/shipmentHistory.php?DocketNumber=' . $row["DocketNumber"] . '">';

    //left pane
    echoDeliverySlipTimeDateIn($row);
    //centre pane
    echoDeliverySlipJobInformationWithClass($row, "jobInfoReady");
    echo "</a><!-- End of link to shipment history -->";

    //The right pane for a delivery slip ready for pick up is a reserved div
    //that allows the user to mark the slip as shipped. This will be done through
    //javascript and not within the slip itself. Hence the hidden input.
    echo "<div class='shipThisDivOut'>
            <span class='shipOutSpan'>
                >>
                <input type='hidden' name='docketNumber' class='sessid' value='" . $row['SessId'] . "'/>
            </span>
         </div><!-- End of shipOutSpan -->";
}

/**
 * Given the array $row which is a result of a MYSQL query representing a
 * deilvery slip, echo the left pane of a delivery slip form the shipment feed
 * containing the time and date that the delivery slip was created.
 */
function echoDeliverySlipTimeDateIn($row) {
    echo "  <div class='leftPane'>";
    echo "      <span class='timeIn'>" . date("g:iA", strtotime($row['TimeIn'])) . "</span> <br /> ";
    echo "      <span class='dateIn'>" . date("l, F d", strtotime($row['DateIn'])) . "</span> <br /> ";
    echo "  </div><!--End of .leftPane -->";
}

/**
 * Given the an array $row which is a result of a MYSQL query representing a
 * delivery slip, echo the center pane of a delivery slip from the shipment feed
 * containing general information about the job. The given class is the class
 * this div will have.
 */
function echoDeliverySlipJobInformationWithClass($row, $class) {
    echo "  <div class='" . $class . "'>";
    echo "      <span class='shipName'>" . $row['JobName'] . "</span> <br />";
    echo "      <span class='customer'>" . $row['Customer'] . "</span><br/>";
    echo "      <span class='customerPoNo'>  Customer PoNo:" . $row['CustomerPoNo'] . "</span><br/>";
    echo $row['DocketNumber'];
    echo "  </div>";
}

/**
 * Given the an array $row which is a result of a MYSQL query representing a
 * delivery slip that has been picked up, echo the div and the required information
 * for the representation of a delivery slip within the shipment feed.
 */
function echoDeliverySlipHasBeenPickedUp($row) {
    //This entire div is wrapped in a link to the shipment history page.
    echo '<a href="../ShippingTool/shipmentHistory.php?DocketNumber=' . $row["DocketNumber"] . '">';
    //Echo the date/time in information
    echoDeliverySlipTimeDateIn($row);
    //Echo the job information
    echoDeliverySlipJobInformationWithClass($row, "jobInfoPickedUp");
    //Echo the date/time out information
    echoDeliverySlipTimeDateOut($row);
    echo "</a><!-- End of link to shipment history -->";
}

/**
 * Given the array $row which is a result of a MYSQL query representing a
 * deilvery slip, echo the right pane of a delivery slip for the shipment feed
 * containing the time and date that the order was picked up.
 */
function echoDeliverySlipTimeDateOut($row) {

    echo "<div class='rightPane'>
            <span class='timeOut'>" . date("g:iA", strtotime($row['TimeOut'])) . "</span>
            <br /> ";
    echo "  <span class='dateOut'>" . date("l, F d", strtotime($row['DateOut'])) . "</span>
            <br /> ";
    echo "</div>";
}

?>