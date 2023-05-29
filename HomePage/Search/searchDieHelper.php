<?php

/*
 * This file contains helper functions for the search die feature.
 * 
 * Author: Peter Tran, Sept 6th 2012.
 */

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
if (isset($_POST["type"])) {
    switch ($_POST["type"]) {
        case "setStatus":
            setStatus("searchDie.php?DocketNumber=" . $_POST["DocketNumber"]);
            break;
        case "setStatusExpired":
            setStatus("expiredDies.php?years=" . $_POST["years"]);
            break;
    }
}

/**
 * Set the status for the docket number in the post according to the input 
 * "status button". Store this in the mysql table.
 */
function setStatus($exitLocation) {
    if (is_resource($link = connectToDatabase())) {
        $DocketNumber = $_POST["DocketNumber"];
        $deleteQuery = "DELETE FROM DieStatus WHERE DocketNumber=" . $DocketNumber;
        mysql_query($deleteQuery, $link);
        $status = $_POST["status"];
        $query = "INSERT INTO DieStatus (DocketNumber, Date, Status) VALUES (" . $DocketNumber . ", CURDATE(), '" . $status . "')";
        if (!($result = mysql_query($query, $link))) {

            echo $query . " failed to execute.";
        } else {
            header("Location: /Intranet/HomePage/Search/" . $exitLocation);
        }
        disconnect($link);
    } else {
        echo "Could not connect to database.";
    }
}

/**
 * Return the date if the given docket number was created within the last two years
 * or used in the last two years. false otherwise
 * @param type $DocketNumber 
 */
function usedWithinTwoYears($DocketNumber) {
    //MYSQL: SELECT DATE FROM PRODucTION WEHRE DOCKETNuMbER = DOCKETNUMBER
    //return date > curdate - 2years;
    //MYSQL: SELECT * from Production wehre Finishing LIKE DOCKETNUMBER
    //If not empty, return true.
}

/**
 * Return the dockets between starting/ending that were used int he last two years.
 * @param type $starting
 * @param type $ending 
 */
function getNewDockets($starting, $ending) {
    //For each # from Starting to @ending, call used withint wo years.
    //If not false, return an array (docekt => date);
}

/**
 * Display the table of dockets to keep
 */
function showNewDockets() {
    //CAll get new dockets, echo these dockets in <input forms>
    //Allow for a button to disclude a docket from being saved as in stock.
    //create button to submit (sbumitting saves the dockets as in stock).
}

/**
 * Given an array of docket numbers that point to dates,
 * set those numbers in the diestatus table as in stock with the 
 * given date.
 * @param type $dockets 
 */
function setInStock($dockets) {
    //For each docket number in the given array, set that number as in stock
    //with the corresponding date.
}

?>
