<?php

/* * ***************************************************************************
 * This is a collection of helper functions for the job summary page.
 * Return necessary data in XML format.
 * 
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 15, 2011
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
        case "actions":
            if (isset($_POST['DocketNumber'])) {
                loadActions($_POST['DocketNumber']);
            } else {
                fail("Docket number not set", true);
            }
            break;

        case "shipment_list":
            if (isset($_POST['DocketNumber'])) {
                loadShipmentList($_POST['DocketNumber']);
            } else {
                fail("Docket number not set", true);
            }

            break;

        case "close_docket":
            if (isset($_POST['DocketNumber'])) {
                closeDocket($_POST['DocketNumber']);
            } else {
                fail("Docket number not set", true);
            }

            break;

        case "shipment_summary":
            if (isset($_POST['DocketNumber'])) {
                loadShipmentSummary($_POST['DocketNumber']);
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

function loadActions($num) {
    if (!parseDocketNumber($num)) {
        fail("Invalid docket number given: " . $docketNumber, true);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    //TODO fetch person from database by department
    //TODO print links

    $query = "SELECT 
        IF(p.Status='open', 1, 0) AS open_status,
        IF(p.QuoteNumber IS NULL, 0, 1) AS qn_set 
        FROM Production AS p
        WHERE p.DocketNumber=$num";

    if (($result = mysql_query($query, $link))) {
        $row = mysql_fetch_array($result);

        if ($row['open_status'] == 1 && $row['qn_set'] == 1) {
            $query = "SELECT IF(Complete='Complete', 1, 0) AS q FROM Slip WHERE DocketNumber=$num";

            if (($result = mysql_query($query, $link))) {
                if (mysql_num_rows($result) === 0) {
                    $stage = "shipping";
                } else {
                    while ($row = mysql_fetch_array($result)) {
                        if ($row['q'] == 0) {
                            $stage = "shipping";
                            break;
                        }
                    }
                }



                if (!isset($stage)) {
                    $stage = "close docket";
                }
            } else {
                fail("Could not execute SQL query: " . $query, false);
            }
        } else if ($row['open_status'] == 0) {
            $stage = "book keeping";
        } else if ($row['qn_set'] == 0) {
            $stage = "production";
        } else {
            $stage = "wtf is going on";
        }

        switch ($stage) {
            case "production":
                $person = "Rob";
                $url = "Production.php";
                break;
            case "shipping":
                $person = "Stan";
                $url = "shipping.php";
                break;
            case "close docket":
                $person = "Rob";
                break;
            case "book keeping":
                //XXX what is the person's name???
                $person = "Accountant";
                break;
        }

        echo "<parent>"; //start XML wrapper

        if (isset($url)) {
            printField("nextStep", "<a href='/Intranet/ShippingTool/$url?DocketNumber=$num'>$stage</a>");
        } else {
            printField("nextStep", $stage);
        }

        printField("respPerson", $person);

        echo "</parent>"; //end XML wrapper
    } else {
        fail("Could not execute SQL query: " . $query, false);
    }

    disconnect($link);
}

function closeDocket($num) {
    if (!parseDocketNumber($num)) {
        fail("Invalid docket number given: " . $docketNumber, true);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    $query = "UPDATE Production SET Status='closed' WHERE DocketNumber=$num";

    if (mysql_query($query, $link)) {
        echo "Data write successful";
    } else {
        fail("Could not execute SQL query: " . $query, false);
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

/** Utility function. XXX comments */
function oldToNew($str) {
    $find = "/([a-z]+)([A-Z])([a-z]+)/";
    $replace = "\\1_\\2\\3";
    return preg_replace($find, $replace, $str);
}

function loadShipmentList($docketNumber) {
    if (!parseDocketNumber($docketNumber)) {
        fail("Invalid docket number given: " . $docketNumber, true);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    $query = "SELECT * FROM Slip 
        WHERE DocketNumber=$docketNumber
    ORDER BY Date DESC";

    if (($result = mysql_query($query, $link))) {
        //roar?

        echo "<parent>"; //XML wrapper

        while ($row = mysql_fetch_array($result)) {
            echo "<row>";

            foreach ($row as $field => $val) {
                switch ($field) {
                    case "Total":
                        $var = "Quantity";
                        break;
                    case "NoOfSkids":
                        $var = "Number_of_Skids";
                        break;
                    default:
                        $var = $field;
                        break;
                }

                if (!is_numeric($field)) {
                    printField($var, $val);
                }
            }

            echo "</row>";
        }

        echo "</parent>"; //end XML wrapper
    } else {
        fail("Could not execute SQL query: " . $query, false);
    }

    disconnect($link);
}

function loadShipmentSummary($docketNum) {
    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to the database", false);
    }

    $query = "SELECT MAX(s.Date) AS last_ship_date,
        s.Form AS summary_form, 
        SUM(s.Total) AS qty_ship,
        SUM(f.Quantity) AS qty_req
        FROM Slip AS s
        LEFT OUTER JOIN Forms AS f ON s.Form=f.Form
        AND s.DocketNumber=f.DocketNumber
        WHERE s.DocketNumber=$docketNum
        GROUP BY s.Form";

    if (($result = mysql_query($query, $link))) {
        echo "<parent>"; //start XML wrapper

        while ($row = mysql_fetch_array($result)) {
            echo "<row>";

            foreach ($row as $field => $val) {
                if (!is_numeric($field)) {
                    printField($field, $val);
                }
            }

            echo "</row>";
        }

        echo "</parent>"; //end XML wrapper
    } else {
        fail("Could not execute SQL query " . $query, false);
    }

    disconnect($link);
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
