<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated August 3, 2011
 * --------------------------------------------------------------------------
 * This is a collection of helper functions for the job summary page.
 * Return necessary data in XML format.
 * 
 * Required variables:
 * type: type of action to take
 * actions --> load the next action for this docket
 * shipment_list --> load the list of shipments
 * close_docket --> close the docket
 * shipment_summary --> load a shipment summary
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

/* * ***************************************************************************
 * ************************ IMPORTS ********************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/xmlHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

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
        case "shipment_list_history":
            if (isset($_POST['DocketNumber'])) {
                loadShipmentListHistory($_POST['DocketNumber']);
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
        case "delete_order":
            if (isset($_POST['DocketNumber'])) {
                deleteOrder($_POST['DocketNumber']);
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

/**
 * Delete the order with the given docket number.
 * @param number $docketNumber the docket number.
 */
function deleteOrder($docketNumber) {
    if (isset($docketNumber) && is_numeric($docketNumber)) {
        $link = connectToDatabase();

        if (is_resource($link)) {
            $res = deleteOrderHelper($docketNumber, $link);

            disconnect($link);

            if ($res) {
                echo "Data was deleted";
            } else {
                deny("Permission denied");
            }
        } else {
            fail("Could not connect to database", false);
        }
    } else {
        fail("Docket number incorrectly set", true);
    }
}

/**
 * Return true if order was deleted, false otherwise.
 * @param number $docketNumber The docket number.
 * @param resource $link Connection to the database.
 */
function deleteOrderHelper($docketNumber, $link) {
    if (!isset($docketNumber) || !isset($link) || !is_resource($link)) {
        return false;
    }

    //authenticate admin
    if (!confirmDelete($link)) {
        return false;
    }

    $queries = array("DELETE FROM Production WHERE DocketNumber={$docketNumber}",
        "DELETE FROM Forms WHERE DocketNumber={$docketNumber}",
        "DELETE FROM Slip WHERE DocketNumber={$docketNumber}"
    );

    foreach ($queries as $query) {
        if (!mysql_query($query)) {
            return false;
        }
    }

    return true;
}

/**
 * Checks administrative priveleges. Return true if account does have, 
 * false otherwise.
 */
function confirmDelete($link) {
    if (!isset($_SESSION['userId'])) {
        return false;
    }

    $query = "SELECT IF(Dept='management', 1, 0) AS admin FROM InterUsers WHERE Id={$_SESSION['userId']}";

    if (($result = mysql_query($query))) {
        if (mysql_num_rows($result) > 0) {
            $row = mysql_fetch_array($result);
            return $row['admin'] == 1;
        }
    }

    return false;
}

/**
 * Load the next action for this docket given the docket number.
 * @param number $num The docket number.
 */
function loadActions($num) {
    if (!is_numeric($num)) {
        fail("Invalid docket number given: " . $docketNumber, true);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    //TODO fetch person from database by department

    $query = "SELECT 
        IF(p.Status='open', 1, 0) AS open_status,
        IF(p.QuoteNumber IS NULL, 0, 1) AS qn_set 
        FROM Production AS p
        WHERE p.DocketNumber=$num";

    if (($result = mysql_query($query, $link))) {

        if (mysql_num_rows($result) > 0) {
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
            fail("No action results could be loaded ", false);
        }
    } else {
        fail("Could not execute SQL query: " . $query, false);
    }

    disconnect($link);
}

/**
 * Close the docket with the given docket number.
 * @param number $num The docket number.
 */
function closeDocket($num) {
    if (!is_numeric($num)) {
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
 * Utility function. 
 * TODO I've seen this guy before in another backend file. Maybe move
 * to a general file.
 */
function oldToNew($str) {
    $find = "/([a-z]+)([A-Z])([a-z]+)/";
    $replace = "\\1_\\2\\3";
    return preg_replace($find, $replace, $str);
}

/**
 * Load a complete list of shipments maybe for this docket number.
 * @param number $docketNumber The docket number.
 */
function loadShipmentList($docketNumber) {
    if (!is_numeric($docketNumber)) {
        fail("Invalid docket number given: " . $docketNumber, true);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    $query = "SELECT * FROM Slip 
              WHERE DocketNumber={$docketNumber}
              ORDER BY Date DESC";

    $shipmentNumber = 0;
    $session = 0;

    if (($result = mysql_query($query, $link))) {
        echo "<parent>\n"; //XML wrapper

        while ($row = mysql_fetch_array($result)) {
            echo "\t<row>\n";

            foreach ($row as $field => $val) {
                switch ($field) {
                    case "Total":
                        $var = "Quantity";
                        break;
                    case "NoOfSkids":
                        $var = "Number_of_Skids";
                        break;
                    case "SessId":
                        if ($session != $val) {
                            $shipmentNumber++;
                            $session = $val;
                        }
                        printField("SessId", $val);
                        break;
                    default:
                        $var = $field;
                        break;
                }
                if (!is_numeric($field)) {
                    echo "\t";
                    printField($var, $val);
                }
            }

            printField("ShipmentNumber", $shipmentNumber);

            echo "\t</row>\n";
        }

        echo "</parent>\n"; //end XML wrapper
    } else {
        fail("Could not execute SQL query: " . $query, false);
    }

    disconnect($link);
}

/**
 * Given the docket number, return the xml that represents the
 * delivery slips to the docket number.
 * @param number $docketNumber The docket number.
 */
function loadShipmentListHistory($docketNumber) {
    if (!is_numeric($docketNumber)) {
        fail("Invalid docket number given: " . $docketNumber, true);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    //Iterate through each Session Id that corresponds to the given
    //docket number.
    $query = "SELECT DISTINCT SessId FROM Slip 
              WHERE DocketNumber={$docketNumber}
              ORDER BY SessId";

    if (($result = mysql_query($query, $link))) {
        echo "<parent>\n"; //XML wrapper
        while ($row = mysql_fetch_array($result)) {

            $SessId = $row['SessId'];

            //Echo the SessID?
//            printField("ShipmentNumber", $shipmentNumber);
            echo "\t<SessId value=\"$SessId\">\n";
            loadSlipBySessId($SessId);
            loadSlipHistory($SessId);
            loadTime($SessId);
            echo "\t</SessId>\n";
        }
        echo "</parent>\n"; //end XML wrapper
    } else {
        fail("Could not execute SQL query1: " . $query, false);
    }
    //disconnect($link);
}

/**
 * Given a SessId, load the slip information corresponding to it
 * @param $SessId The session ID to load info for
 */
function loadSlipBySessId($SessId) {
    if (!is_resource($link = connectToDatabase())) {
        fail2("Could not connect to database");
    }

    $query = "SELECT * FROM (Slip natural join SlipStatus) WHERE SessId={$SessId} ORDER BY  `Slip`.`SlipId` ASC";

    if (($result = mysql_query($query, $link))) {

        while ($row = mysql_fetch_array($result)) {

            $slipId = $row["SlipId"];
            echo "<row value=\"$slipId\">\n";
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
                    echo "\t";
                    printField($var, $val);
                }
            }



            echo "</row>\n";
        }
    } else {
        fail2("Could not execute SQL query2: " . $query . mysql_error());
    }

    disconnect($link);
}

/**
 * Given the session ID, return the information from the SlipHistory
 * table in XML format.
 * @param type $SessId The session ID that you want the history info on
 */
function loadSlipHistory($SessId) {

    if (!is_resource($link = connectToDatabase())) {
        fail2("Could not connect to database");
    }

    $query = "SELECT label1, label2, ShippingAddress FROM SlipHistory 
              WHERE SessId={$SessId}";

    echo "<slipHistory>";
    if (($result = mysql_query($query, $link))) {
        $row = mysql_fetch_array($result);
        if ($row) {
            foreach ($row as $field => $value) {
                echo "<field><name>$field</name>
                            <value>$value</value></field>";
            }
        }
    } else {
        fail2("Coudlnt excute: " . $query . mysql_error());
    }

    echo "</slipHistory>";
}

/**
 * Given the MySql result holding the information for a slip, extract the time and 
 * echo the xml storing the time info about a slip.
 * @param type $row The MySql result holding the information about a slip
 */
function loadTime($SessId) {
    if (!is_resource($link = connectToDatabase())) {
        fail2("Could not connect to database");
    }

    $query = "SELECT * FROM SlipStatus WHERE SessId={$SessId}";

    if (($result = mysql_query($query, $link))) {

        $row = mysql_fetch_array($result);
        if ($row) {
            date_default_timezone_set("America/Toronto");
            $dateIn = date("l, F d", strtotime($row['DateIn']));
            $timeIn = date("g:i", strtotime($row['TimeIn']));

            //the date function returns an actual date if the input is null
            //In order to return null to the xmlRender, we need to 
            // manually give it null. This is because we depend on the null
            // value to decide to display nothing in xmlRender.renderTime
            if ($row["DateOut"] != null) {
                date_default_timezone_set("America/Toronto");
                $dateOut = date("l, F d", strtotime($row['DateOut']));
                $timeOut = date("g:i", strtotime($row['TimeOut']));
            } else {
                $dateOut = "null";
                $timeOut = "null";
            }

            echo "<slip>
                    <field>
                        <name>dateIn</name>
                        <value>{$dateIn}</value>
                    </field>
                    <field>
                        <name>timeIn</name>
                        <value>{$timeIn}</value>
                    </field>
                    <field>
                        <name>dateOut</name>
                        <value>{$dateOut}</value>
                    </field>
                    <field>
                        <name>timeOut</name>
                        <value>{$timeOut}</value>
                    </field>
                </slip>";
        }
    };
}

/**
 * Load a summary of the shipments made.
 * @param number $docketNum The docket number.
 */
function loadShipmentSummary($docketNum) {
    if (!is_numeric($docketNum)) {
        fail("Docket number not properly set", false);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to the database", false);
    }

    $query = "SELECT f.DocketNumber AS DocketNumber,
    f.Form AS summary_form, 
    f.Quantity AS qty_req,
    SUM(s.Total) AS qty_ship,
    MAX(s.Date) AS last_ship_date
    FROM Forms AS f 
    RIGHT OUTER JOIN Slip AS s
    ON s.Form=f.Form AND
    s.DocketNumber=f.DocketNumber
    WHERE f.DocketNumber=$docketNum 
    GROUP BY s.Form
    ORDER BY FormId ASC;";

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

?>
