<?php

/* * ***************************************************************************
 * This is a collection of helper functions for the shipping page.
 * Return necessary data in XML format.
 * 
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 14, 2011
 * 
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

/* * ***************************************************************************
 * ************************ IMPORTS ********************************************
 * ************************************************************************** */
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/loginHelper.php";
require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/xmlHelper.php";

ob_start(); //to collect output in case there is an error

if (isset($_POST['type'])) {
    switch ($_POST['type']) {
        case "customer_list":
            getCustomerList();
            break;
        case "production_data":
            if (isset($_POST['DocketNumber'])) {
                loadProductionData($_POST['DocketNumber']);
            } else {
                fail("Docket number not set", true);
            }

            break;
        default:
            fail("Incorrect type specified: " . $_POST['type'], true);
            break;
    }
} else {
    fail("Type not set", true);
}

ob_end_flush(); //write everything in buffer

/**
 * Print all the data saved for this docket number in XML format.
 * If an error occurs, redirect appropriately.
 */
function loadProductionData($docketNum) {
    if (!parseDocketNumber($docketNum)) {
        fail("Invalid docket number specified: " . $docketNum, true);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    $query = "SELECT * FROM Production WHERE DocketNumber=" . $docketNum;

    if (($result = mysql_query($query, $link))) {
        if (mysql_num_rows($result) === 0) {
            fail("Could not retrieve any information with docket number " . $docketNum, false);
        }

        $row = mysql_fetch_array($result);

        echo "<parent>"; //open XML wrapper

        foreach ($row as $field => $val) {
            if (is_numeric($field) || $val === "") {
                continue;
            }

            switch ($field) {
                case "FinalPrice":
                    $newField = "SoldFor";
                    break;
                case "CustomerPoNo":
                    $newField = "Customer_PO_Number";
                    break;
                default:
                    $newField = $field;
                    break;
            }

            $newField = oldToNew($newField);
            printField($newField, $val);
        }

        loadForms($docketNum, $link);

        echo "</parent>"; //close XML wrapper
    } else {
        fail("Could not execute SQL query " . $query, false);
    }

    disconnect($link);
}

/**
 * Return true if the input is a valid integer, false otherwise.
 * Used for checking GET/POST variables.
 * TODO maybe make more general and move to another file.
 * @param mixed $num Input.
 */
function parseDocketNumber($num) {
    return isset($num) && $num !== null && $num !== "" &&
    is_numeric($num);
}

/**
 * Print the customer list as a series of HTML option tags.
 * TODO maybe move to general helper page.
 */
function getCustomerList() {
    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    //---- this is the frequency bit
    //XXX arbitrary, set constant somewhere else...
    $numFreqCust = 15;

    $query = "SELECT Customer FROM Customers 
        ORDER BY Frequency DESC, Customer ASC
        LIMIT 0, $numFreqCust";

    if (($result = mysql_query($query, $link))) {
        echo "<optgroup label='Most Used'>";

        while ($row = mysql_fetch_array($result)) {
            $val = $row['Customer'];
            echo "<option value='$val'>$val</option>";
        }

        echo "</optgroup>";
    } else {
        fail("Could not execute SQL query " . $query, false);
    }

    //--- end frequency bit
    //--- this is the normal bit
    $query = "SELECT Customer FROM Customers 
        ORDER BY Customer ASC";

    if (($result = mysql_query($query, $link))) {
        echo "<optgroup label='Customers'>";

        while ($row = mysql_fetch_array($result)) {
            $val = htmlspecialchars($row['Customer']);
            echo "<option value='$val'>$val</option>";
        }

        echo "</optgroup>";
    } else {
        fail("Could not execute SQL query " . $query, false);
    }
}

/**
 * If a fatal error occurs (i. e. user messed up or server is being stupid),
 * return the appropriate code with the correct message and stop the execution
 * of the script. Remove all items from buffer.
 * 
 * TODO move this to general helper file.
 * 
 * @param string $msg The error message.
 * @param boolean $syntaxError true if it's the user's fault, false if it's the
 * server's fault. Optional, defaults to false.
 */
function fail($msg, $syntaxError) {
    if (!isset($syntaxError) || $syntaxError !== true) {
        $syntaxError = false;
    }

    $code = $syntaxError ? 400 : 500;
    ob_clean(); //clear buffer
    header("HTTP/1.1 $code $msg");
    exit(); //how does this affect the header
}

?>
