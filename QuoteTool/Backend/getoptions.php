<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 22, 2011
 * ------------------------------------------------------------------------
 * Load options for option fields and return them in XML format.
 * This is a backend helper for the Quote Application.
 * 
 * XXX Maybe this should go in the general Resources....
 * XXX Maybe XML helper should call this method directly...
 * 
 * Required variables:
 * field - the field for which to fetch the options
 * 
 * Optional variables:
 * options - some options on field parsing
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

/* * ***************************************************************************
 * ******************************** IMPORTS ************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/loginHelper.php';
require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/backendHelper.php';

/* * ***************************************************************************
 * ******************************** MAIN BODY **********************************
 * ************************************************************************** */

if (isset($_POST['field'])) {
    if (isset($_POST['options'])) {
        $options = $_POST['options'] . "";
    } else {
        $options = "";
    }

    getOptions($_POST["field"], $options);
} else {
    fail("Field is not set", true);
}

/**
 * Return the column name in database for the given field.
 * @param string $type Field.
 * @return string Column name in database.
 */
function getColumnName($type) {
    switch ($type) {
        case "Method":
            return "ShipType";
        case "Shipping Type":
        case "Shipping_Type":
            return "ShipVia";
        case "Customer":
        case "Press":
        case "Stock":
        default:
            return $type;
    }
}

/**
 * Table in database for the given field.
 * @param string $type field.
 * @return string Column name in database.
 */
function getTableName($type) {
    switch ($type) {
        case "Shipping Type":
        case "Shipping_Type":
            return "Ship";
        case "Method":
            return "ShipCost";
        case "Customer":
        case "Stock":
            return $type .= "s";
        case "Press":
        default:
            return $type;
    }
}

/**
 * Load the options from the database, then print themin HTML format.
 * @param string $field The field.
 * @param string $opt Possible other options.
 */
function getOptions($field, $opt) {
    if(!isset($field) || !isset($opt)) {
        fail("Required variables not set", true);
    }
    
    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }
    
    $options = loadOptions($field, $opt, $link);

    if ($options === null) {
        fail("Could not load options given opt " . $opt, true);
    }

    printOptions($options, $opt, $link);
    disconnect($link);
}

/**
 * Load options from the database and return them as an array of strings.
 * @param string $field The field.
 * @param string $options Other possible options.
 * @param resource $link A link to the database.
 * @return array Array of options.
 */
function loadOptions($field, $options, $link) {
    if(!is_resource($link)) {
        fail("Invalid link to database given", false);
    }
    
    //sanititize the input
    $field = cleanInput($field);
    $options = cleanInput($options);
    
    $table = getTableName($field);
    $col = getColumnName($field);
    $count = 0;
    $val = array();

    $query = "SELECT $col FROM $table WHERE $col IS NOT NULL ORDER BY $col ASC";

    if (($result = mysql_query($query, $link))) {
        while ($row = mysql_fetch_array($result)) {
            $val[$count] = $row[$col];
            $count++;
        }
    } else {
        fail("SQL query failed: " . $query, false);
    }

    return $val;
}

/**
 * Print out the options in HTML format.
 * @param array $options An array of options.
 * @param string $opt TODO expand on this idea
 * @param resource $link A link to the database.
 */
function printOptions($options, $opt, $link) {
    if (!is_resource($link)) {
        fail("Could not connect to database", false);
    }

    //TODO automatically load customers by frequency
    if ($opt === "frequencySort") {
        $query = "SELECT Customer FROM Customers ORDER BY Frequency DESC LIMIT 0, 20";
        $result = mysql_query($query, $link);

        echo "<optgroup label='Most Used'>";

        while ($row = mysql_fetch_array($result)) {
            $customer = $row['Customer'];
            echo "<option value='$customer'>$customer</option>";
        }

        echo "</optgroup><optgroup label='Customers'>";
    }

    foreach ($options as $option) {
        echo "<option value='$option'>$option</option>";
    }

    if ($opt === "frequencySort") {
        echo "</optgroup>";
    }
}

?>