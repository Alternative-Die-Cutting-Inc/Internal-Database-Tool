<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 11, 2011
 * ----------------------------------------------------------------------------
 * This file is used to run searches. Extend as necessary.
 * Parses the search options and returns relevant search results in an XML
 * format.
 * 
 * Required variables:
 * search - The search string
 * opt - The column being searched through
 * type - the table types being searched through (see constants):
 * nq - quoting system
 * oj - job system
 * as - direct query
 * 
 * Optional arguments:
 * start - The starting index for the search
 * 
 * TODO rewrite this bearing in mind that each part of the site
 * actually already has a search function and this class just messhes them together
 * 
 * ************************************************************************** */

/* * ***************************************************************************
 * ************************ IMPORTS ********************************************
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/xmlHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

/* * ***************************************************************************
 * ************************ CONSTANTS ******************************************
 * ************************************************************************** */

//TODO PHP4 does not support constants inside classes. I hate you, PHP4
//system types
define("SEARCH_QUOTE", 0);
//TODO maybe add something like searching for shipments???
define("SEARCH_JOB", 2);
define("SEARCH_DIRECT_QUERY", 3); //TODO this is very dangerous
//field types
//TODO use these
define("SEARCH_QUOTENUM", 0);
define("SEARCH_DOCKETNUM", 1);

//maximum number of results to return
define("MAX_NUM_RESULTS", 500);

/* * ***************************************************************************
 * *************************** MAIN BODY ***************************************
 * ************************************************************************** */

ob_start(); //to collect output in case there is an error

echo "<parent>"; //begin XML wrapper

if (isset($_GET['search']) && isset($_GET['opt']) && isset($_GET['type'])) {
    if (isset($_GET['start']) && $_GET['start'] !== "" && is_numeric($_GET['start'])
            && $_GET['start'] > 0) {
        $start = intval($_GET['start']);
    } else {
        $start = 0;
    }

    switch ($_GET["type"]) {
        case "oj":
            $type = constant("SEARCH_JOB");
            break;
        case "nq":
            $type = constant("SEARCH_QUOTE");
            break;
        case "as":
            //TODO for now
            $type = constant("SEARCH_DIRECT_QUERY");
            break;
        default:
            $type = null;
            break;
    }

    if ($type === null) {
        fail("Could not parse type " . $_GET['type'], true);
    } else {
        doWork($_GET["search"], $_GET["opt"], $type, $start);
    }
} else {
    fail("Crucial arguments not set", true);
}

echo "</parent>"; //end XML wrapper
ob_end_flush(); //write everything in buffer

/**
 * Given a search string and a search option, search for the search string
 * in the specified field and print the results in an XML format.
 * 
 * @param string $searchString The search string (i.e. what is being searched for).
 * @param string $opt The search option (i.e. what column and table to
 * search).
 * @param int $dataType The quoting system used to generate the quote.
 * @param int $start The index from which to start searching. Used for 
 * multiple-page searching.
 */
function doWork($searchString, $opt, $dataType, $start) {
    $startTime = microtime(true);
    $link = connectToDatabase();

    if (!is_resource($link)) {
        fail("Could not connect to MySQL Server ", false);
        return;
    }

    switch ($dataType) {
        case constant("SEARCH_JOB") :
            $keyField = "Docket_Number";
            break;
        case constant("SEARCH_QUOTE") :
        case constant("SEARCH_DIRECT_QUERY"):
            $keyField = "Quote_Number";
            break;
        default:
            fail("Could not parse data type " . $dataType, true);
    }

    if ($dataType === constant("SEARCH_DIRECT_QUERY")) {
        $query = $searchString;
    } else if (($query = buildQuery($dataType, $opt, $searchString, $start)) === null) {
        fail("Could not build query given search string " . $searchString . ", option " . $opt . " and data type " . $dataType, true);
    }

    $pattern = array('/ ORDER BY.*/', '/ LIMIT.*/', '/\r\n/', '/\n/', '/(SELECT)(.*)(FROM.*)/');
    $replace = array('', '', '', '', '\1 COUNT(*) AS count \3');
    $countQuery = preg_replace($pattern, $replace, $query);

    if (!($result = mysql_query($countQuery, $link))) {
        fail("Invalid SQL COUNT query: " . $countQuery, false);
    } else {
        $row = mysql_fetch_array($result);
        printNumResults($row['count']);
    }

    if (!is_resource($result = mysql_query($query, $link))) {
        fail("Invalid SQL query: " . $query, false);
        return;
    }

    printRowCount(mysql_num_rows($result));

    switch ($dataType) {
        case constant("SEARCH_JOB") :
            $type = "job";
            break;
        case constant("SEARCH_QUOTE") :
            $type = "quote";
            break;
        case constant("SEARCH_DIRECT_QUERY") :
            $type = "advanced";
            break;
        default:
            $type = "unknown";
            break;
    }


    while ($row = mysql_fetch_array($result)) {
        echo "<row>";

        //printField("Type", $type);

        foreach ($row as $field => $val) {
            if ($field === $keyField) {
                addActions($dataType, $val);
            }
            if (!is_numeric($field)) {

                //For the docket number column, wrap the xml with
                //linking information.
                if ($field == "Docket_Number") {
                    addLink($field, $val);
                //For the quote number column, wrap xml with linking info
                } else if ($field == "Quote_Number") {
                    addLink($field, $val);
                } else {
                    printField($field, $val);
                }
            }
        }

        echo "</row>";
    }

    //XXX maybe this is more useful on the client side
    //maybe remove support for this method...
    printTime(round(microtime(true) - $startTime, 4));

    disconnect($link);
}

/* * ***************************************************************************
 * *************************** HELPER FUNCTIONS ********************************
 * ************************************************************************** */

/**
 * Build the query and return it.
 * @param int $dataType
 * @param string $opt
 * @param string $searchString
 * @param int $start Starting index.
 * @return string SQL query or null on failure.
 */
function buildQuery($dataType, $opt, $searchString, $start) {
//    printDebug("building query");

    switch ($dataType) {
        case constant("SEARCH_JOB") :
            $query = "SELECT p.Date, 
                p.DocketNumber AS Docket_Number,
                p.QuoteNumber AS Quote_Number,
                p.Customer,
                p.JobName AS Job_Name,
                p.CustomerPoNo AS Customer_PO_Number,
                p.ProductionPerson AS Production_Person,
                p.Finishing AS Finishing,
                p.SpecialInstructions AS Special_Instructions,
                p.Quantity AS Number_of_Units,
                p.FinalPrice AS Sold_For
                FROM Production AS p";

            break;
        case constant("SEARCH_QUOTE") :
            $query = "SELECT q.Quote_Number,
                q.Date,
                q.Attention,
                q.Author,
                q.Customer,
                q.Job_Name,
                q.Description,
                q.Notes,
                q.Total,
                q.Number_of_Units
                FROM Quote_Information AS q";
            break;
        default:
            $query = null;
    }

//    printDebug("started building query " . $query);

    if ($query !== null) {
        if (($searchOpt = getSearchOpt($dataType, $opt, $searchString)) === null) {
            return null;
        } else {
            $query .= " WHERE " . $searchOpt;
        }
    }

    $query .= " LIMIT $start, " . constant("MAX_NUM_RESULTS");

    return $query;
}

/**
 * Return a part of the SQL query representing the option to search by.
 * @param int $dataType The type of data being searched through.
 * @param string $opt Search option given.
 * @param string $searchString Search string entered by user.
 * @return string String added to WHERE clause of SQL query. 
 */
function getSearchOpt($dataType, $opt, $searchString) {
//    printDebug("getting options");

    $searchString = cleanInput($searchString);

    switch ($dataType) {
        case constant("SEARCH_JOB") :
            $order = " ORDER BY Docket_Number DESC";
            $foo = "p.";
            break;
        case constant("SEARCH_QUOTE") :
            $foo = "q.";
            $order = " ORDER BY Quote_Number DESC";
            break;
        default:
            return null;
    }

//    printDebug("Started building opts: " . $foo);

    switch ($opt) {
        case "Customer":
            $foo .= $opt . " LIKE '%$searchString%'";
            break;
        case "Author":
            if ($dataType === constant("SEARCH_QUOTE")) {
                $opt = "Author";
            } else {
                $opt = "Name";
            }

            $foo .= $opt . " LIKE '%$searchString%'";

            break;

        case "Job Name":
            if ($dataType === constant("SEARCH_QUOTE")) {
                $opt = "Job_Name";
            } else {
                $opt = "JobName";
            }

            $foo .= $opt . " LIKE '%$searchString%'";

            break;
        case "Docket Number":
            //TODO error check number
            $foo .= "DocketNumber=$searchString";
            break;
        case "Quote Number":

            if ($dataType === constant("SEARCH_QUOTE")) {
                $opt = "Quote_Number";
            } else {
                $opt = "QuoteNumber";
            }

            $foo .= $opt . "=" . $searchString;

            break;

        case "Customer PO Number":
            $foo .= "CustomerPoNo=$searchString";
            break;
        default:
            return null;
    }

//    printDebug("finished building opts: " . $foo);

    return $foo . $order;
}

/**
 * Print the actions associated with this dataType.
 * TODO maybe this would be better client-side
 * @param int $dataType Which tables the search is being conducted through.
 * @param int $num The quote or docket number.
 */
function addActions($dataType, $num) {

    echo "<action>";

    switch ($dataType) {
        case constant("SEARCH_QUOTE"):
            printLink("Client Sheet", "/Intranet/QuoteTool/indexClone1.php?QuoteNumber=$num");
            printLink("Work Sheet", "/Intranet/QuoteTool/indexClone2.php?QuoteNumber=$num");
            break;
        case constant("SEARCH_JOB"):
            printLink("Production", "/Intranet/ShippingTool/Production.php?DocketNumber=" . $num);
            printLink("Shipping", "/Intranet/ShippingTool/shipping.php?DocketNumber=" . $num);
            printLink("Summary", "/Intranet/ShippingTool/JobSummary.php?DocketNumber=" . $num);
            break;
    }

    echo "</action>";
}

/**
 * Print the links associated with this dataType.
 * @param int $numberType Which tables the search is being conducted through.
 * @param int $num The quote or docket number.
 */
function addLink($numberType, $num) {

    switch ($numberType) {
        case "Quote_Number":
            echo "<quote>";
            printLink("$num", "/Intranet/QuoteTool/index.php?QuoteNumber=$num");
            echo "</quote>";
            break;
        case "Docket_Number":
            echo "<docket>";
            printLink("$num", "/Intranet/ShippingTool/Production.php?DocketNumber=" . $num);
            echo "</docket>";
            break;
    }
}

?>