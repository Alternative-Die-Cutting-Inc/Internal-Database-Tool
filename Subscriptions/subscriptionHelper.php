<?php

/*
 * This file holds on the functions needed for the subscription service.
 * Written by Peter Tran Aug 28th, 2012.
 */

//include($_SERVER["DOCUMENT_ROOT"] . '/Intranet/Resources/phpmailer/class.phpmailer.php');
require ($_SERVER["DOCUMENT_ROOT"] . '/Intranet/Resources/phpmailer/mailHelper.php');
/**
 * Given the DocketNumber, action and email, write the corresponding values into
 * the Subscription table.
 */
function subscribe($DocketNumber, $UserEmail, $Id) {

    //Insert values for the number of different subscriptions there are.
    //Need a more efficient way to do this once subscriptions to more 
    //actions become available.
    $subs = array();
    $unsubs = array();
    if (isset($_POST["inShipping"])) {
        array_push($subs, "inShipping");
    } 
    else {
        array_push($unsubs, "inShipping");
    }
    if (isset($_POST["shipped"])) {
        array_push($subs, "shipped");
    }
    else {
        array_push($unsubs, "shipped");
    }

    $link = connectToDatabase();
    if (is_resource($link)) {

        //May be a more efficient way to isolate the cirsumtances where there is a change
        //from subscribe to unsubscribe.
        foreach ($subs as $subType) {
            $query = "INSERT INTO Subscriptions (DocketNumber, Email, SubscriptionType, Id)
                VALUES ($DocketNumber, '$UserEmail', '$subType', $Id)";

            $result = mysql_query($query, $link);

        }
        foreach ($unsubs as $subType) {
            $query = "DELETE FROM Subscriptions
                WHERE (DocketNumber=$DocketNumber AND Email='$UserEmail' AND SubscriptionType='$subType')";

            $result = mysql_query($query, $link);

        }
        disconnect($link);
    } 
    else {
        //fail("Could not connect to database", false);
    }
}

/**
 * Given the docket Number, client email and user id, subscribe email address.
 */
function subscribeClient($DocketNumber, $email, $id) {
    $subs = array();
    if (isset($_POST["clientinShipping"])) {
        array_push($subs, "inShipping");
    } 
    
    if (isset($_POST["clientshipped"])) {
        array_push($subs, "shipped");
    }
    
    $link = connectToDatabase();
    if (is_resource($link)) {

        //May be a more efficient way to isolate the cirsumtances where there is a change
        //from subscribe to unsubscribe.
        foreach ($subs as $subType) {
            $query = "INSERT INTO Subscriptions (DocketNumber, Email, SubscriptionType, Id)
                VALUES ($DocketNumber, '$email', '$subType', $id)";

            $result = mysql_query($query, $link);

        }
        disconnect($link);
    } 
}

/**
 * Return true if the given email address is subscribed to the
 * given docket number under the given subscription type.
 */
function isSubscribed($docketNumber, $email, $subType) {
    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }
    
    $query = "SELECT * FROM Subscriptions
        WHERE (DocketNumber=$docketNumber AND Email='$email' AND  SubscriptionType='$subType')";
    if (($result = mysql_query($query, $link))) {
        if ($row = mysql_fetch_array($result)) {
            return true;
        }
    }
    return false;
}

?>
