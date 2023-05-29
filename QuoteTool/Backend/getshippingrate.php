<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 22, 2011
 * ----------------------------------------------------------------
 * Load the rates for shipping from the database and return the total cost of 
 * shipping for the given field.
 * 
 * Required variables:
 * //TODO check exactly what these values should be
 * method - the type of shipping ("pickup" or "delivery")
 * numskids - the number of skids being shipped
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

/* * ***************************************************************************
 * ******************************** IMPORTS ************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/loginHelper.php';
require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/xmlHelper.php';
require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/backendHelper.php';

/* * ***************************************************************************
 * ****************************** MAIN BODY ************************************
 * ************************************************************************** */

if (isset($_POST['method']) && isset($_POST['numskids'])) {
    getRate($_POST['method'], $_POST['numskids']);
} else {
    fail("Key fields not set", true);
}

/**
 * Given the number of skids and the shipping method, load the rate from the
 * database and print out the cost for this shipping.
 * @param string $method The method of shipping.
 * @param number $numskids The number of skids in the shipment.
 */
function getRate($method, $numskids) {
    //TODO error check both and sanitize the input

    if (!is_numeric($numskids) || intval($numskids) === 0) {
        //don't query, just print the rate as 0
        printRate(0);
        return;
    }

    $numskids = intval($numskids);
    $rate = loadRate($numskids, $method);
    printCost($rate);
}

/**
 * Load the rate from the database given the shipping rate and the number
 * of skids, and print out the total cost.
 * @param number $numskids Number of skids being shipped.
 * @param string $method The shipping method.
 * @return number The total cost.
 */
function loadRate($numskids, $method) {
    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
        return;
    }
    
    $query = "SELECT Base, AddCost FROM ShipCost WHERE ShipType='$method'";

    $rate = 0;

    if (($result = mysql_query($query, $link))) {
        if (mysql_num_rows($result) > 0) {
            $row = mysql_fetch_array($result);
            $rate = $row['Base'] + $row['AddCost'] * $numskids;
        } else {
            fail("Could not load rate with method " . $method, true);
        }
    } else {
        fail("Could not execute query: " . $query, false);
    }
    
    disconnect($link);

    return $rate;
}

/**
 * Print the total cost.
 * @param number $rate The cost.
 */
function printCost($cost) {
    echo $cost;
}

?>