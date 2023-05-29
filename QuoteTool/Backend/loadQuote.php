<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 27, 2011
 * --------------------------------------------------------------------------
 * This file is a utility class to load existing quotes into the quote tool.
 * Data is returned in valid XML format. 
 * 
 * Required variables:
 * quoteNum - the quote number to load
 * type - the type of data to load ("header" or "footer")
 * 
 * XML Structure (for header)
 * <parent>
 * <field><name>Name</name><value>Val</value></field>
 * (more fields here)
 * </parent>
 * 
 * XML Structure (for footer)
 * <parent>
 * <row>
 * <field><name>Name</name><value>Val</value></field>
 * (more fields here)
 * </row>
 * (more rows here)
 * </parent>
 * 
 * Each row in the footer represents a quote.
 * 
 * TODO is it possible to load both the header and footer at the same time
 * and save an AJAX request?
 * TODO maybe this file should be referenced by the search when looking 
 * through old quotes?
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

/* * ***************************************************************************
 * ************************ IMPORTS ********************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/loginHelper.php';
require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/xmlHelper.php';
require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/backendHelper.php';

/* * ***************************************************************************
 * ************************ CONSTANTS ******************************************
 * ************************************************************************** */

define("header", "Quote_Information");
define("footer", "Saved_Quotes");

/* * ***************************************************************************
 * *************************** MAIN BODY ***************************************
 * ************************************************************************** */

if (isset($_POST['quoteNum'])) {
    if (isset($_POST['type'])) {
        loadQuote($_POST['quoteNum'], $_POST['type']);
    } else {
        loadQuote($_POST['quoteNum']);
    }
} else {
    fail("Quote number not set", true);
}

/* * ***************************************************************************
 * *************************** FUNCTIONS ***************************************
 * ************************************************************************** */

/**
 * Load an existing quote and output the results as XML.
 * @param int $quoteNum The quote number.
 * @param string $type (Optional) The type of data to retrieve.
 * If not set, retrieve both types.
 * Possible values are "header", "footer", "both"
 */
function loadQuote($quoteNum, $type) {
    //if basic error-checking on quote number fails, stop script
    if (!isset($quoteNum) || !is_numeric($quoteNum)) {
        fail("Improper quote number", true);
    }

    if (!isset($type)) {
        $type = "both";
    }

    switch ($type) {
        case "header":
            $types = array("header");
            break;
        case "footer":
            $types = array("footer");
            break;
        case "both":
            $types = array("header", "footer");
            break;
        default:
            fail("Type improperly set:" . $type, true);
            break;
    }

    
    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    echo "<parent>"; //start XML wrapper

    foreach ($types as $type) {
        echo "<" . $type . ">"; //start XML wrapper about type
        
        $query = "SELECT * FROM " . constant($type) . " WHERE Quote_Number=$quoteNum ORDER BY ID";

        if (!($result = mysql_query($query))) {
            //fail if a single query fails
            fail("Invalid query: $query", false);
        }
        
        if ($type === "header") {
            printField("numQuotes", mysql_num_rows($result));
        }

        while ($row = mysql_fetch_array($result)) {
            if ($type === "footer") {
                echo "<row>";
            }

            foreach ($row as $field => $val) {
                printField($field, $val);
            }

            if ($type === "footer") {
                echo "</row>";
            }
        } //end iteration over rows
        
        echo "</" . $type . ">"; //start XML wrapper about type
    } //end iteration over tables

    echo "</parent>";

    disconnect($link);
}

?>
