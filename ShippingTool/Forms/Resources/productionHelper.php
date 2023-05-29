<?php

/* * ***************************************************************************
 * This is a collection of helper functions for the production page.
 * Return necessary data in XML format.
 * 
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 13, 2011
 * 
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

/* * ***************************************************************************
 * ************************ IMPORTS ********************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/loginHelper.php";
require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/xmlHelper.php";
require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/backendHelper.php";

ob_start(); //to collect output in case there is an error

if (isset($_POST['type'])) {
    switch ($_POST['type']) {
        case "customer_list":
            getCustomerList();
            break;
        case "docket_login_data":
            if (isset($_POST['DocketNumber'])) {
                loadProductionData($_POST['DocketNumber']);
            } else {
                fail("Docket number not set", true);
            }

            break;
        case "save":
            if (isset($_POST['saveData']) && isset($_POST['DocketNumber'])) {
                saveProductionData($_POST['saveData'], $_POST['DocketNumber']);
            } else {
                fail("Invalid save parameters", true);
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
 * Return true if the input is a valid integer, false otherwise.
 * Used for checking GET/POST variables.
 * TODO maybe make more general and move to another file.
 * @param mixed $num Input.
 */
function parseDocketNumber($num) {
    return isset($num) && $num !== null && $num !== "" &&
    is_numeric($num);
}

function saveProductionData($data, $docketNum) {
    if (!parseDocketNumber($docketNum)) {
        fail("Invalid docket number specified: " . $docketNum, true);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    $saveData = array();
    $pairs = explode("&", $data);

    foreach ($pairs as $pair) {
        $temp = explode("=", $pair);

        if (count($temp) === 2) {
            $var = urldecode(str_replace("_", "", $temp[0]));
            $val = $temp[1];

            switch ($var) {
                case "SoldFor":
                    $var = "FinalPrice";
                    break;
                case "CustomerPONumber":
                    $var = "CustomerPoNo";
                    break;
                default:
                    break;
            }

            //not sure how to combine these two switch statements

            switch ($var) {
                case "Finishing":
                case "SpecialInstructions":
                case "JobName":
                case "Customer":
                case "ProductionPerson":
                case "CustomerPoNo":
                case "Form[]":
                case "Notes[]":
                    $val = "\"" . $val . "\"";
                    break;
                default:
                    $val = intval($val);
                    break;
            }

            $val = urldecode($val);

            if (!isset($saveData[$var])) {
                $saveData[$var] = $val;
            } else if (!is_array($saveData[$var])) {
                $temp = $saveData[$var];
                $saveData[$var] = array();
//                echo "Added $temp to array $var";
                $saveData[$var][0] = $temp;
//                echo "Added $val to array $var";
                $saveData[$var][1] = $val;
            } else {
//                echo "Added $val to array $var";
                $saveData[$var][count($saveData[$var])] = $val;
            }
        }
    }
    
    //----here figure out whether to flag it or not
    
    if($saveData['QuoteNumber'] == 1) {
        $saveData['Flagged'] = TRUE;
    }

    //--- end flagging ----
    
    saveForms($saveData, $docketNum, $link);

    //now remove all saveData fields which are not in table

    $query = "DESCRIBE Production";

    if (!($result = mysql_query($query, $link))) {
        fail("Could not execute SQL query: " . $query, false);
    }

    $tableFields = array();
    $i = 0;

    while ($row = mysql_fetch_array($result)) {
        $tableFields[$i++] = $row['Field'];
    }

    $safeFields = array_intersect($tableFields, array_keys($saveData));

    //remove docket number so it cannot be rewritten
    $i = array_search("DocketNumber", $safeFields);

    if ($i !== false) {
        unset($safeFields[$i]);
    }

    //-- end removing fields

    $query = "UPDATE Production SET ";
    $i = 0;

    foreach ($safeFields as $field) {
        if ($i > 0) {
            $query .= ", ";
        }

        $query .= $field . "=" . $saveData[$field];
        $i++;
    }

    $query .= " WHERE DocketNumber=" . $docketNum;

    if (($result = mysql_query($query, $link))) {
        //XXX for debugging
        echo "Data write successful";
        disconnect($link);
    } else {
        disconnect($link);
        fail("Could not execute SQL query: " . $query, false);
    }
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

/** Utility function. XXX comments */
function oldToNew($str) {
    $find = "/([a-z]+)([A-Z])([a-z]+)/";
    $replace = "\\1_\\2\\3";
    return preg_replace($find, $replace, $str);
}

function saveForms($data, $docketNumber, $link) {
    if (!is_resource($link)) {
        fail("Could not connect to database", false);
    }

    if (!isset($data["Qty[]"]) || !isset($data["Form[]"]) || !isset($data["Notes[]"])) {
        fail("Key fields not set", true);
    }

    $query = "DELETE FROM Forms WHERE DocketNumber=" . $docketNumber;

    if (!(mysql_query($query, $link))) {
        fail("Could not execute SQL query: " . $query, false);
    }

    $query = array();
    $start = "INSERT INTO Forms ";
    $tail = " ";
    $fields = array("Form", "Qty", "Notes");

    if (is_array($data["Form[]"])) {
        $i = 0;

        while ($i < count($data["Form[]"])) {
            if ($data["Form[]"][$i] === "\"\"") {
                $query[$i] = null;
            } else {
                $query[$i] = "INSERT INTO Forms (Form, Quantity, Notes, DocketNumber) VALUES (";
                $j = 0;

                foreach ($fields as $field) {
                    if ($j++ > 0) {
                        $query[$i] .= ", ";
                    }

                    $query[$i] .= $data[$field . "[]"][$i];
                }

                $query[$i] .= ", " . $docketNumber . ")";
            }

            $i++;
        }

        foreach ($query as $q) {
            if ($q !== null) {
//                echo "Query is " . $q;
                
                if (!(mysql_query($q, $link))) {
                    fail("Could not execute SQL query: " . $q, false);
                }
            }
        }
    } 
}

//TODO input is not cleaned for this file, I should change that
/*
 * Load the "form", "quantity", "notes" as per given docket number.
 */
function loadForms($docketNumber, $link) {
    if (!is_resource($link)) {
        fail("Could not connect to database", false);
    }

    //XXX maybe error-check docket number

    $query = "SELECT Form, Quantity AS Qty, Notes
        FROM Forms WHERE DocketNumber=" . $docketNumber .
            " ORDERBY FormId ASC";

    if (($result = mysql_query($query, $link))) {
        //don't fail here because 0 forms just means nothing has been logged in
        
//        if (mysql_num_rows($result) === 0) {
//            fail("Could not retrieve any information with docket number " . $docketNumber, false);
//        }

        while ($row = mysql_fetch_array($result)) {
            echo "<row>";

            foreach ($row as $key => $val) {
                if (!is_numeric($key)) {
                    printField($key, $val);
                }
            }

            echo "</row>";
        }
    } else {
        fail("Could not execute SQL query " . $query, false);
    }
}

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

?>
