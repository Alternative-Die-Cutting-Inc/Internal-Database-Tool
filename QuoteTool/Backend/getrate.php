<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 29, 2011
 * -------------------------------------------------------------------------
 * Load the hourly rate for various fields in the quoting application and print 
 * them.
 * 
 * Required fields:
 * field - the field for which to load the rate
 * val - the number of hours
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

if (isset($_POST['field']) && isset($_POST['val'])) {
    $field = $_POST["field"];
    $hours = $_POST["val"];
    getRate($field, $hours);
} else {
    echo 0;
}

/**
 * Load the hourly rate for the given field and print it as plain text.
 * @param string $field The field for which to get the rate.
 * @param number $hours The number of hours for which to fetch the rate.
 */
function getRate($field, $hours) {
    if (!is_numeric($hours) || floatval($hours) === 0.0) {
        printRate(0);
        return;
    }

    //sanitize input
    $field = cleanInput($field);
    $hours = floatval($hours);

    $rate = loadRate($field, $hours);
    printRate($rate);
}

/**
 * Get the rate for which the customer will be billed.
 * This is basically a flour to the nearest gradient value.
 * @param number $hours The number of hours actually required.
 * @param array $gradient The gradient of pricing sorted in order of smallest
 * number of hours to largest number of hours.
 * @return number The rate at which we will bill.
 */
function getBillingRate($hours, $gradient) {
    $i = 0;
    $rate = $gradient[$i];

    while ($i < count($gradient) && $hours >= $gradient[$i]) {
        $rate = $gradient[$i];
        $i++;
    }

    return $rate;
}

/**
 * Load the rate from the database given the number of hours for the work.
 * @param string $field The field being billed for.
 * @param number $hours Number of hours for the work.
 * @return number The hourly rate for the work. 
 */
function loadRate($field, $hours) {
    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    $gradient = getGradient($link);
    $billHr = getBillingRate($hours, $gradient);
    $col = getColumnName($field);

    $query = "SELECT * FROM Specs WHERE Hours=" . $billHr;
    $result = mysql_query($query, $link);

    disconnect($link);

    if ($result) {
        if (mysql_num_rows($result) > 0) {
            $row = mysql_fetch_array($result);
            return $row[$col];
        } else {
            fail("Could not load rate for column " . $col, true);
        }
    } else {
        fail("Query failed: " . $query, false);
    }
}

/**
 * Given the name of the field, return the column name in the database.
 * @param string $field The name of the field.
 * @return string The name of the column in the database table. 
 */
function getColumnName($field) {
    $field = str_replace("_", " ", $field);

    switch ($field) {
        case 'Heidelberg':
            $var = 'HeidHr';
            break;
        case 'Cutter' :
        case 'Strip' :
        case 'Die' :
        case 'Iijima':
            $var = $field . 'Hr';
            break;
        case 'Glue' :
        case 'Gluer Setup':
        case 'Setup':
            $var = 'GluerHr';
            break;
        case 'Tape':
        case 'Final Fold':
            $var = 'HandworkHr';
            break;
        default:
            $var = $field;
            break;
    }

    return $var;
}

/**
 * Load the pricing gradient from the database and return it.
 * TODO maybe cache this, or keep in some kind of PHP storage...
 * @param resource $link Link to the database.
 * @return array The pricing gradient, in order from smallest to largest.
 */
function getGradient($link) {
    if (!is_resource($link)) {
        fail("Could not connect to the database", false);
        return;
    }

    $query = "SELECT Hours FROM Specs ORDER BY Hours ASC";

    $result = mysql_query($query, $link);
    $count = 0;
    $val = array();

    if (is_resource($result)) {
        while ($row = mysql_fetch_array($result)) {
            $val[$count] = $row["Hours"];
            $count++;
        }
    } else {
        fail("Could not execute query:" . $query, false);
    }

    return $val;
}

/**
 * Print the rate.
 * @param number $rate The hourly rate.
 */
function printRate($rate) {
    echo $rate;
}

?>