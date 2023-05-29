<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated August 3, 2011
 * -------------------------------------------------------------------------
 * This is a collection of helper functions for the production page.
 * Return necessary data in XML format.
 * 
 * Required variables:
 * type - type of action to take
 * 1. customer_list --> load the list of customers in HTML
 * 2. docket_login_data --> load the data from docket login
 *  --> this actually loads the data saved in production as well
 * 3. save --> save the data
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

/* * ***************************************************************************
 * ************************ IMPORTS ********************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/xmlHelper.php";
require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/backendHelper.php";
ob_start(); //to collect output in case there is an error

if (isset($_POST['type'])) {
    switch ($_POST['type']) {
        case "customer_list":
            getCustomerList();
            break;
        case "docket_login_data":
            if (isset($_POST['DocketNumber'])) {
                if (isset($_POST["order"])) {
                    loadProductionData($_POST['DocketNumber'], $_POST['order']);
                } else {
                    loadProductionData($_POST['DocketNumber']);
                }
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
 * Save the production data.
 * @param array $data Data to be saved.
 * @param number $docketNum The docket number.
 */
function saveProductionData($data, $docketNum) {
    if (!is_numeric($docketNum)) {
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

            $val = cleanInput(urldecode($val));
            //not sure how to combine these two switch statements

            switch ($var) {
                case "Die":
               // $val = intal($val);
//                    fail($var . $val , false);
                    $saveData["Dies"] = explode(",", $val);
//                break;    
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

            if (!isset($saveData[$var])) {
                $saveData[$var] = $val;
            } else if (!is_array($saveData[$var])) {
                $temp = $saveData[$var];
                $saveData[$var] = array();
                $saveData[$var][0] = $temp;
                $saveData[$var][1] = $val;
            } else {
                $saveData[$var][count($saveData[$var])] = $val;
            }
        }
    }

    //----here figure out whether to flag it or not

    if ($saveData['QuoteNumber'] == 1) {
        $saveData['Flagged'] = TRUE;
    }

    //--- end flagging ----

    saveForms($saveData, $docketNum, $link);

    //now remove all saveData fields which are not in table

    $query = "DESCRIBE Production";

    if (!($result = mysql_query($query, $link))) {
        fail("Could not execute SQL query: ". $query, false);
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
    } else {
        fail("Could not execute SQL query: " . $query . mysql_error(), false);
    }
    
    if (isset($saveData["Dies"])) {
        $dies = $saveData["Dies"];
        foreach ($dies as $die) {
            $dieStatusQuery = 'INSERT INTO DieStatus (DocketNumber, Date, Status) 
            VALUES (' . intval($die) . ', CURDATE(), "instock")
            ON DUPLICATE KEY UPDATE Date=CURDATE()';
            mysql_query($dieStatusQuery, $link);
        }
    }
    disconnect($link);
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

/**
 * Utility function. Converting old field to new fields by replacing 
 * camel case with pothole case.
 */
function oldToNew($str) {
    $find = "/([a-z]+)([A-Z])([a-z]+)/";
    $replace = "\\1_\\2\\3";
    return preg_replace($find, $replace, $str);
}

/**
 * Save the forms contained in the associative array data, given the docket
 * number.
 * @param array $data Array containing forms to be saved.
 * @param number $docketNumber
 * @param resource $link Link to the database.
 */
function saveForms($data, $docketNumber, $link) {
    if (!is_numeric($docketNumber)) {
        fail("Docket number not properly set", true);
    }

    if (!is_resource($link)) {
        fail("Could not connect to database", false);
    }

    if (!isset($data["Qty[]"]) || !isset($data["Form[]"]) || !isset($data["Notes[]"])) {
//        fail("Key fields not set", true);
        //means there are no forms to save
        return;
    }

    $query = "DELETE FROM Forms WHERE DocketNumber=" . $docketNumber;

    if (!(mysql_query($query, $link))) {
        fail("Could not execute SQL query: " . $query, false);
    }

    $query = array();
    $start = "INSERT INTO Forms ";
    $tail = " ";
    $fields = array("Form", "Qty", "Notes");

    if (isset($data["Form[]"])) {
        if (!is_array($data["Form[]"]) && !is_array($data["Qty[]"]) && !is_array($data["Notes[]"])) {
            foreach ($fields as $field) {
                $data[$field . "[]"] = array($data[$field . "[]"]);
            }
        }

        $numForms = count($data["Form[]"]);

        for ($i = 0; $i < $numForms; $i++) {
            if ($data["Form[]"][$i] === "\"\"") {
                $query[$i] = null;
            } else {
                $query = "INSERT INTO Forms (Form, Quantity, Notes, DocketNumber) VALUES (";
                $j = 0;

                foreach ($fields as $field) {
                    //do not add comma on first one
                    if ($j++ > 0) {
                        $query .= ", ";
                    }

                    $query .= $data[$field . "[]"][$i];
                }

                $query .= ", " . $docketNumber . ")";

                if (!(mysql_query($query, $link))) {
                    fail("Could not execute SQL query: " . $query, false);
                }
            }
        }
    }
}

/**
 * 
 * Load the forms with the given docket number.
 * Depending on the caller, you want different order of the forms
 * due to the inconsistency of how the xml is parsed/display
 * @param number $docketNumber The docket number.
 * @param Resource $link Link the the database.
 * @param $order Tells us which javascript is calling this function.
 */
function loadForms($docketNumber, $link, $order) {
    if (!is_numeric($docketNumber)) {
        fail("Docket number is invalid", true);
    }

    if (!is_resource($link)) {
        fail("Could not connect to database", false);
    }
    $query = "SELECT Form, Quantity AS Qty, Notes
        FROM Forms WHERE DocketNumber=" . $docketNumber .
            " ORDER BY FormID " . $order;

    if (($result = mysql_query($query, $link))) {
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
function loadProductionData($docketNum, $order = "ASC") {
    if (!is_numeric($docketNum)) {
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

        loadForms($docketNum, $link, $order);

        echo "</parent>"; //close XML wrapper
    } else {
        fail("Could not execute SQL query " . $query, false);
    }

    disconnect($link);
}

?>
