<?php

/*
 * Written by Peter Tran Oct 11th, 2012.
 * 
 * This file contains helper methods for the personalFeed. It expects calls
 * from Ajax with the "type" set in the post to determine what function to call.
 * Most of these functions will be interaction with the PersonalFeedSubscription
 * table in mysql.
 */

//The following requires are needed to connect to the database and also to raise
//an error message to ajax.
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/DepartmentFeed/Backend/departmentProgressBarHelper.php";

if (!isset($_POST['type'])) {
    fail2("Type not set");
}

$type = $_POST['type'];
switch ($type) {

    //Expect an id and docket number to subscribe user to.
    case "subscribe_job":
        if (!isset($_POST['id']) || !isset($_POST['DocketNumber'])) {
            fail2("User id or docketnumber not set.");
        }
        subscribeUserToJob($_POST['id'], $_POST['DocketNumber']);
        break;

    case "unsubscribe_job":
        if (!isset($_POST['id']) || !isset($_POST['DocketNumber'])) {
            fail2("User id or docketnumber not set.");
        }
        unsubscribeUserToJob($_POST['id'], $_POST['DocketNumber']);
        break;

    //For a given user, get their personal feed.
    case "get_feed":
        if (!isset($_POST['id'])) {
            fail2("No user id.");
        }
        echoPersonalFeedFor($_POST['id']);
        break;
    default:
        fail2($type . " is not a recognized type.");
}

/**
 * Given a user's id and a docketnumber, subscribe the user to the job
 * by adding it into the PersonalFeedSubsciption mysql table.
 */
function subscribeUserToJob($userId, $docketNumber) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to the database");
    }
    $query = "INSERT IGNORE INTO PersonalFeedSubscriptions
                (UserId, DocketNumber) VALUES ({$userId}, {$docketNumber})";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    }
}

/**
 * Given a user's id, echo their personal feed.
 */
function echoPersonalFeedFor($id) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to the database");
    }
    $query = "SELECT * FROM Production NATURAL JOIN (SELECT DISTINCT * FROM PersonalFeedSubscriptions WHERE UserId={$id}) As B";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Could not excute query: " . $query . " " . mysql_error());
    }
    while ($row = mysql_fetch_array($result)) {
        echoJobForPersonalFeed($row);
        echo "<hr />";
    }
}

/**
 * Given an array $row representing a job that is a result of a mysql query, 
 * echo the job information. 
 */
function echoJobForPersonalFeed($row) {

    echo '<div class="personalJob">';
    echo '<input type="hidden" value="' . $row['DocketNumber'] . '"/>';
    echoJobInformation($row);
    echoShippingInformation($row['DocketNumber']);
    echoUnsubscribe($row['DocketNumber']);
    echo '</div>';
}

/**
 * Given the docket number of a job, echo the unsubscribe tags for the
 * personal feed.
 */
function echoUnsubscribe($DocketNumber) {
    echo '<div class="unsubscribeDiv">
            <span class="unsubscribeSpan">[x]</span>
          </div>';
}

/**
 * Given a user id and a docket number, unsubscribe that user to the job
 * by deleting the corresponding entry in PersonalFeedSubscriptions
 */
function unsubscribeUserToJob($id, $docketNumber) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to database. ");
    }
    $query = "DELETE FROM PersonalFeedSubscriptions WHERE UserId={$id} AND DocketNumber={$docketNumber}";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    }
    disconnect($link);
}

/**
 * Given the $row representing a row in the production table,
 * echo the job information needed for the personal feed.
 */
function echoJobInformation($row) {
    echo '<a href="../ShippingTool/Production.php?DocketNumber=' . $row['DocketNumber'] . '">';
    echo "  <div class='personalFeedJobInfo'>";
    echo "      <span class='shipName'>" . $row['JobName'] . "</span><br />";
    echo "      <span class='customer'>" . $row['Customer'] . "</span><br/>";
    echo "      <span class='customerPoNo'>  Customer PoNo:" . $row['CustomerPoNo'] . "</span><br/>";
    echo $row['DocketNumber'];
    displayProgressBar($row["DocketNumber"]);
    echo "  </div>";
    echo "</a>";
}

/**
 * Given a docket number, echo the shipping information.
 */
function echoShippingInformation($docketNumber) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to database. ");
    }
    $query = "SELECT * FROM Production NATURAL JOIN SlipStatus WHERE DocketNumber={$docketNumber}";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    }

    echo '<div class="shippingInformation">';
    echo '<span id="deliveryReport"><a href="../ShippingTool/quickDeliveryReport.php?DocketNumber=' . $docketNumber . '" target="_blank">[delivery report]</a></span>';
    while ($row = mysql_fetch_array($result)) {
        echoSlipInformation($row);
        echo "<hr />";
    }
    echo '</div>';

    disconnect($link);
}

/**
 * Given the $row from the result of a natural join of production and slip
 * status, echo the slip information.
 */
function echoSlipInformation($row) {

    //Some rows represent a job that is completed on the floor. It acts as a
    //notification to create a delivery slip.
    if ($row['DateIn'] == null) {
        echo '<div class="shipReady">Finished production, ready for a delivery slip.</div>';
        return;
    }
    if ($row['DateOut'] == null) {
        echo '<div class="shipReady">';
        $isDone = false;
        $addShipmentOutClass = "";
    } else {
        echo '<div class="shipmentOut">';
        $isDone = true;
        $addShipmentOutClass = "shipmentOut";
    }
    echo '<a href="../ShippingTool/shipmentHistory.php?DocketNumber=' . $row['DocketNumber'] . '">';
    echo '<div class="shipmentTime">';

    date_default_timezone_set("America/Toronto");
    echo "      <span class='timeIn'>" . date("g:iA", strtotime($row['TimeIn'])) . "</span> <br /> ";
    echo "      <span class='dateIn'>" . date("l, F d", strtotime($row['DateIn'])) . "</span> <br /> ";

    if ($isDone) {
        echo " ... <br />";
        echo "<span class='timeOut'>" . date("g:iA", strtotime($row['TimeOut'])) . "</span>
              <br /> ";
        echo "<span class='dateOut'>" . date("l, F d", strtotime($row['DateOut'])) . "</span>
              <br /> ";
    }
    echo '</div><!-- End of .shipmentTime -->';
    echoSlipDetails($row['SessId']);
    echo '</a>';

    echo "<div class='deliverySlipPreview'>";
    echo "<form method='get'  target='_blank' action='../ShippingTool/shipmentHistoryClone.php'>";
    echo "[preview delivery slip]";
    echo "<input type='hidden' value=" . $row['SessId'] . " name='SessId'>";
    echo "<input type='hidden' value=" . $row['DocketNumber'] . " name='DocketNumber'>";
    echo "</form>";
    echo "</div><!--end of delivery slip preview -->";
    echo '</div><!-- End of .shipReady/.shipDone -->';
}

/**
 * Given the SessId that represents a delivery slip, echo the forms, quantity 
 * and totals.
 */
function echoSlipDetails($SessId) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to the database. ");
    }
    $query = "SELECT * FROM Slip WHERE SessId={$SessId}";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    }
    echo '<div class="slipInfo">';
    while ($row = mysql_fetch_array($result)) {
        echo $row['Form'] . ": " . $row['Total'] . " (" . $row['NoOfSkids'] . " skid(s))";
        echo '<br />';
    }
    disconnect($link);


    echo '</div><!-- end of .slipInfo -->';
}

?>
