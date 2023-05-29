<?php

/**
 * Location on server: /var/www/vhosts/alternativedc.com/httpdocs/Intranet/QuoteTool/Backend
 * Carmine's local copy: C:\wamp\www\Intranet\QuoteTool\Backend\
 */

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on August 8, 2011
 * ----------------------------------------------------------------
 * Load the customer rate for the given customer.
 * TODO maybe merge with getrate.php and getshippingrate.php
 * 
 * Required variables:
 * customer - the customer name
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
 * ******************************** MAIN BODY **********************************
 * ************************************************************************** */

ob_start();

if (isset($_POST['customer'])) {
    printRate($_POST['customer'], $_POST['quoteNumber']);
} else if (isset($_POST['save'])) {
    setRate($_POST['quoteNumber'], $_POST['rate']);
} else {
    fail("Customer name is not set", true);
}


ob_flush();

/**
 * Load the rate for the given quote from the Rate table.. If there is none, 
 * load the current rate from the Customers table and insert that into Rate.
 * @param string $customer The customer name.
 * @param string $quoteNumber The quote number.
 */
function printRate($customer, $quoteNumber) {
    $link = connectToDatabase();
    if (is_resource($link)) {
        $rate = loadRate($link, $quoteNumber);
        if ($rate == -1) {
            $rate = getCurrentRate($link, $customer);
            //setRate($link, $quoteNumber, $rate);
        }
        echo $rate;
    } else {
        fail("Could not connect to the database", false);
    }
    disconnect($link);
}

/**
 * Given a QuoteNumber, return the rate for the given quote number. If there was
 * no rate for that quote, return -1.
 * @param resource $link The connection to the database.
 * @param string $customer A customer.
 * @return The customer rate (as float).
 */
function loadRate($link, $quoteNumber) {
    $rate = -1;
    if (is_resource($link)) {
        $query = "SELECT Rate FROM Rate WHERE QuoteNumber='{$quoteNumber}'";
        if (($result = mysql_query($query, $link))) {
            if (mysql_num_rows($result) > 0) {
                $row = mysql_fetch_row($result);
                $rate = floatval($row[0]);
            } else {
                return -1;
            }
        }
    }
    return $rate;
}

/**
 * Given a customer, return the current rate.
 * @param resource $link The connection to the database.
 * @param string $customer The customer to find the rate for.
 */
function getCurrentRate($link, $customer) {
    $globalRate = 1.03;
    $rate = 1.0;
    if (is_resource($link)) {
        $customer = cleanInput($customer);
        $query = "SELECT Rate FROM Customers WHERE Customer='{$customer}'";
        if (($result = mysql_query($query, $link))) {
            if (mysql_num_rows($result) > 0) {
                $row = mysql_fetch_row($result);
                $rate = floatval($row[0]);
            }
        }
    }
    return $rate * $globalRate;
}

/**
 * Given a quote number and a rate, set them into the Rate table. Delete the rate
 * first so that if it is actually an update, it can update with no error.
 */
function setRate($quoteNumber, $rate) {
    $link = connectToDatabase();
    if (is_resource($link)) {
        $deleteQuery = "DELETE FROM Rate WHERE QuoteNumber={$quoteNumber}";
        $insertionQuery = "INSERT INTO Rate (QuoteNumber, Rate) VALUES ('{$quoteNumber}','{$rate}')";
        mysql_query($deleteQuery, $link);
        mysql_query($insertionQuery, $link);
    }
    disconnect($link);
}

?>