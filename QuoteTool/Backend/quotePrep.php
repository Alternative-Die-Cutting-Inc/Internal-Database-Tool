<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated August 8, 2011
 * ----------------------------------------------------------------------------
 * Load primary data for the quoting application and return it in valid
 * XML format.
 * 
 * Required variables:
 * opt - what to load, values are "clear", "prep", "nprep"
 * "clear" - clear all cached data TODO is this ever used?
 * "prep" - print primary data for the quoting application
 * "nprep" - same as prep TODO can this be deleted?
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

/* * ***************************************************************************
 * ******************************** IMPORTS ************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/loginHelper.php';
require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/xmlHelper.php';
require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/backendHelper.php';

/* * ***************************************************************************
 * ******************************* MAIN BODY ***********************************
 * ************************************************************************** */

ob_start();

if (isset($_POST['opt'])) {
    switch ($_POST['opt']) {
        case 'nprep':
        case 'prep':
            loadPrepData();
            break;
        case 'clear':
            //does nothing...
            break;
        default:
            fail("Opt incorrectly set: " . $_POST['opt'], true);
    }
} else {
    fail("Opt not set", true);
}

ob_flush();

/**
 * Print a quote number if not set, and print the name.
 */
function loadPrepData() {
    echo "<parent>";
    printAuthor();
    printQuoteNum();
    echo "</parent>";
}

/**
 * If the author's name is stored in the session, print it in an XML format.
 * If the author's name is not found, redirect to an HTML compliant 
 * failure page.
 */
function printAuthor() {
    if (isset($_SESSION['name']) && is_string($_SESSION['name']) && $_SESSION['name'] !== "") {
        printField("Author", $_SESSION['name']);
    } else {
        fail("Could not load name from session", false);
    }
}

/**
 * Print out a NEW quote number, or fail if quote number could not be loaded
 */
function printQuoteNum() {
    $link = connectToDatabase();

    if (is_resource($link)) {
        $qn = loadQuoteNum($link);

        if ($qn < 0) {
            fail("Could not load a new quote number", false);
        } else {
            printField("Quote_Number", $qn);
        }
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Load a new quote number from the database and return it. If none could
 * be loaded, return -1.
 * @param resource Link to the database
 * @return A new quote number if it could be loaded, -1 otherwise.
 */
function loadQuoteNum($link) {
    $qn = -1;

    if (is_resource($link)) {
        //the Quote column is junk, so QuoteNumber can auto-increment
        $query = "INSERT INTO QuoteNumbers (Quote) VALUES (0)";

        if (($result = mysql_query($query, $link))) {
            $query = "Select MAX(QuoteNumber) FROM QuoteNumbers";

            if (($result = mysql_query($query, $link))) {
                if (mysql_num_rows($result) > 0) {
                    $row = mysql_fetch_row($result);
                    $qn = intval($row[0]);
                }
            }
        }

        disconnect($link);
    }

    return $qn;
}

?>
