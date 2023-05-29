<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated August 3, 2011
 * ---------------------------------------------------------------------------
 * This is a collection of helper functions for the shipping page.
 * Return necessary data in XML format.
 * 
 * Required variables:
 * Type: the type of data
 * customer_list --> print the customer list in HTML format
 * production_data --> the data from the production page
 * --> also loads existing shipping data
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

//to keep track of session id
session_start();

/* * ***************************************************************************
 * ************************ IMPORTS ********************************************
 * ************************************************************************** */
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/xmlHelper.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/backendHelper.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Subscriptions/subscriptionHelper.php";

ob_start(); //to collect output in case there is an error

if (isset($_POST['type'])) {
    switch ($_POST['type']) {

        //If this is a new save, set the ShippingSession cause it will not be set
        //then follow through to the save case
        case "saveNew":
            unset($_SESSION["ShippingSession"]);
            $id = loadShippingSessionNumber();


            if ($id === false) {
                fail("Could not load session id", false);
                break;
            } else {
                $_SESSION["ShippingSession"] = $id;
                $_POST["type"] = "save";
            }

        //do not break, fall through

        case "save":
            if (!isset($_POST['DocketNumber']) || !is_numeric($_POST['DocketNumber']) || !isset($_POST['saveData'])) {
                fail("Key parameters not set", true);
            }
            echo $_SESSION["ShippingSession"];

            save($_POST['DocketNumber'], $_POST['saveData']);

            break;

        //newSave for history
        case "saveNewHistory":
            unset($_SESSION["ShippingSession"]);
            $id = loadShippingSessionNumber();

            if ($id === false) {
                fail("Could not load session id", false);
                break;
            } else {
                $_SESSION["ShippingSession"] = $id;
                $_POST["type"] = "saveHistory";
            }

        //Write into the history tables (sliphistory and slipstatus)
        case "saveHistory":
            if (!isset($_POST['DocketNumber']) || !is_numeric($_POST['DocketNumber']) || !isset($_POST['saveData'])) {
                fail("Key parameters not set", true);
            }
            saveHistory($_POST['DocketNumber'], $_POST['saveData']);

            break;
        case "customer_list":
            getCustomerList();
            break;
        case "production_data":
            if (isset($_POST['DocketNumber'])) {
                loadProductionData($_POST['DocketNumber']);
            } else {
                fail("Docket number not set", true);
            }
            break;
        case "production_data_history":
            if (isset($_POST['DocketNumber'])) {
                loadProductionDataHistory($_POST['DocketNumber']);
            } else {
                fail("Docket number not set", true);
            }
            break;
        case "shipOut":
            if (isset($_POST['SessId'])) {
                shipOut($_POST["SessId"], $_POST['setDate']);
            } else {
                fail("Invalid shipment number", true);
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
 * Return a new session id, which is unique. It is kept unique by inserting
 * a new (blank) row into the database with the new session id.
 * @return mixed The session id if it can be retrieved, false if there was an
 * error.
 */
function loadShippingSessionNumber() {
    $link = connectToDatabase();
    $session = false;

    if (is_resource($link)) {
        $query = "SELECT (MAX(SlipId) + 1) AS session FROM Slip";

        if (($result = mysql_query($query))) {
            if (mysql_num_rows($result) > 0) {
                $row = mysql_fetch_row($result);
                $session = $row[0];

                $query = "INSERT INTO Slip(SlipId) VALUES({$session})";

                if (!mysql_query($query)) {
                    //could not insert the new row
                    $session = false;
                }
            }
        }

        disconnect($link);
    }

    return $session;
}

/**
 * Given a docket number and the data to be saved, override everything in the
 * current shipping session and write the given shipping data.
 * @param number $docketNumber The docket number.
 * @param string $saveData Serialized form of data to save.
 */
function save($docketNumber, $saveData) {
    if (!isset($_SESSION["ShippingSession"]) || !is_numeric($_SESSION["ShippingSession"])) {
        fail("Session id not properly set", false);
    }

    if (!isset($docketNumber) || !is_numeric($docketNumber) || !isset($saveData)) {
        fail("Key parameters not set", true);
    }

    $link = connectToDatabase();
    $id = $_SESSION["ShippingSession"];
    //Shipping.echoSomething($id);
    //TODO load stuff into this array
    $writeArr = array();

    $writeArr = unserializeForm($saveData);

    if (is_resource($link)) {
        $result = saveShippingData($link, $id, $docketNumber, $writeArr);
        disconnect($link);

//        if ($result) {
//            echo "Save successful";
//        } else {
//            fail("Saving failed", false);
//        }
    } else {
        fail("Could not connect to database");
    }
}

/**
 * Given a docket number and the data to be saved, override everything in the
 * current shipping session and write the given shipping data.
 * @param number $docketNumber The docket number.
 * @param string $saveData Serialized form of data to save.
 */
function saveHistory($docketNumber, $saveData) {
    if (!isset($_SESSION["ShippingSession"]) || !is_numeric($_SESSION["ShippingSession"])) {
        fail("Session id not properly set", false);
    }
    if (!isset($docketNumber) || !is_numeric($docketNumber) || !isset($saveData)) {
        fail("Key parameters not set", true);
    }

    $link = connectToDatabase();
    $id = $_SESSION["ShippingSession"];

    //TODO load stuff into this array
    $writeArr = array();

    $writeArr = unserializeForm($saveData);

    if (is_resource($link)) {
        $result = saveShippingDataHistory($link, $id, $docketNumber, $writeArr);
        disconnect($link);
        $jobName = getJobNameFrom($docketNumber);
        sendEmailNotifications($docketNumber, "inShipping", $jobName);
    } else {
        fail("Could not connect to database");
    }
}

function sumTotal($data, $index) {
    $total = 0;

    if (isset($data["Type"]) && is_array($data["Type"]) && isset($data["Type"][$index])) {
        $type = $data["Type"][$index];

        if ($type === "'Sheets'" && isset($data["NoOfSheets"]) && is_array($data["NoOfSheets"]) && isset($data["NoOfSheets"][$index])) {
            $total = $data["NoOfSheets"][$index];
        } else if ($type === "'Pieces'" && isset($data["NoOfPcs"]) && is_array($data["NoOfPcs"]) && isset($data["NoOfPcs"][$index])) {
            $total = $data["NoOfPcs"][$index];
        } else if ($type === "'Cartons'" && isset($data["Qty"]) && is_array($data["Qty"]) && isset($data["Qty"][$index]) && isset($data["Ctns"]) && is_array($data["Ctns"]) && isset($data["Ctns"][$index])) {
            $total = $data["Ctns"][$index] * $data["Qty"][$index];

            if (isset($data["Part"]) && is_array($data["Part"]) && isset($data["Part"][$index])) {
                $total += $data["Part"][$index];
            }
        }
    }

    $data["Total"] = $total;

    return $data;
}

/**
 * Save the shipping data. Remove shipping data with the same session id
 * as the data being inserted.
 * @param resource $link Link to the database.
 * @param number $docketNumber The docket number.
 * @param array $writeData The array to save.
 * @return True if save successful, false otherwise.
 */
function saveShippingData($link, $id, $docketNumber, $writeData) {
    if (!isset($link) || !is_resource($link) || !isset($id) || !is_numeric($id)
            || !isset($docketNumber) || !is_numeric($docketNumber)) {
        return false;
    }

    //here I delete the old
    shipmentInsert($link, $id, $writeData);


    //$id is the session number.
    //If the session number is in the table, then this is going to be an update
    // therefore we need to delete it. If this is a new session, deleteOldSlips does nothing.
    $error = !deleteOldSlips($link, $id);

    if ($error) {
        return false;
    }

    $writeData = cleanVars($writeData);
    $writeData = getSafeInput($writeData, "Slip");

    //now...
    $writeData['DocketNumber'] = $docketNumber;
    $writeData['SessId'] = $id;

    for ($i = 0; $i < count($writeData["Form"]); $i++) {
        $writeData = sumTotal($writeData, $i);
        $query = buildQuery($writeData, $i, "Slip");
        $sucess = mysql_query($query, $link);
    }

    return $sucess;
}

/**
 * Save the shipping data into slipHistory tables.
 * @param resource $link Link to the database.
 * @param number $docketNumber The docket number.
 * @param array $writeData The array to save.
 * @return True if save successful, false otherwise.
 */
function saveShippingDataHistory($link, $id, $docketNumber, $writeData) {
    if (!isset($link) || !is_resource($link) || !isset($id) || !is_numeric($id)
            || !isset($docketNumber) || !is_numeric($docketNumber)) {
        return false;
    }

    //$id is the session number.
    //If the session number is in the table, then this is going to be an update
    // therefore we need to delete it. If this is a new session, deleteOldSlips does nothing.
    $error = !deleteOldSlipsHistory($link, $id);
    if ($error) {
        return false;
    }

    $writeData = cleanVars($writeData);
    $writeData = getSafeInput($writeData, "SlipHistory");

    //now...
    $writeData['DocketNumber'] = $docketNumber;
    $writeData['SessId'] = $id;

    $i = 0;
    
    //If a slip is created, delete the null row in slipstatus
    $deleteNotificationQuery = 'Delete from SlipStatus where ((DocketNumber=' . $docketNumber . ') and (DateIn is NULL))';
    mysql_query($deleteNotificationQuery, $link);
    //Insert into SlipHistory
    $query = buildQuery($writeData, $i, "SlipHistory");
    $sucess = mysql_query($query, $link);
    if (!$sucess) {
        die('invalid query ' . mysql_error());
    }

    //Insert into SlipStatus
    $statusQuery = buildStatusQuery(true, $writeData);
    $sucess = mysql_query($statusQuery, $link);
    if (!$sucess) {
        die('invalid query ' . mysql_error());
    }

    return $sucess;
}

function shipmentInsert($link, $id, $data) {
    if (!is_resource($link) || !is_numeric($id)) {
        return false;
    }

    if (!isset($data['Customer']) || !is_string($data['Customer'])) {
        $data['Customer'] = "not set";
    } else {
        $data['Customer'] = cleanInput($data['Customer']);
    }

    $address = "";

    if (!isset($data['showShipping']) || !is_string($data['showShipping'])) {
        $data['showShipping'] = "not set";
    } else {
        switch ($data['showShipping']) {
            case "Load":
                $type = "loaded from database";
                break;
            case "Other":
                $type = "custom input";

                if (isset($data['Shipping_Address']) && is_string($data['Shipping_Address'])) {
                    $address = $data['Shipping_Address'];
                }

                break;
            case "None":
                $type = "no address";
                break;
            default:
                $type = "not set";
        }
    }

    $query = array();
    $result = true;

    $query[] = "DELETE FROM Shipments WHERE ShipmentID={$id}";

    if ($type === "custom input") {
        $query[] = "INSERT INTO Shipments (ShipmentID, Customer, AddressType, Address)
    VALUES({$id}, '{$data['Customer']}', '{$type}', '{$address}')";
    } else {
        $query[] = "INSERT INTO Shipments (ShipmentID, Customer, AddressType)
    VALUES({$id}, '{$data['Customer']}', '{$type}')";
    }

    foreach ($query as $q) {
        $result = mysql_query($q, $link) && $result;
    }

    return $result === true;
}

/**
 * Return the query that inserts into SlipStatus the current date for incoming 
 * or updates Slip Status with the current date for out going.
 * @param data The array with the DocketNumber and SessId
 * @param in True if this is an incoming slip, False if outgoing.
 */
function buildStatusQuery($in, $data) {
    date_default_timezone_set("America/Winnipeg");
    $currentTime = date("g:iA");
    $docketNumber = $data["DocketNumber"];
    $SessId = $data["SessId"];
    if ($in) {
        $query = "INSERT INTO SlipStatus (SessId, DateIn, TimeIn, DocketNumber) VALUES
            ({$SessId}, CURDATE(), NOW(), {$docketNumber})";
    } else {
        $query = "UPDATE SlipStatus
            SET DateOut={}, TimeOut={}
            WHERE DocketNumber={$docketNumber} and SessId={$SessId}";
    }

    return $query;
}

/**
 * Return the query that inserts the given data into the given table.
 * @param type $data
 * @param type $index
 * @param $SQLTable the table to build the query for
 * @return type 
 */
function buildQuery($data, $index, $SQLTable) {
    $start = "INSERT INTO $SQLTable(";
    $tail = ") VALUES(";

    $j = 0;

    foreach ($data as $field => $val) {
        if ($j++ > 0) {
            $start .= ", ";
            $tail .= ", ";
        }

        $start .= $field;

        //Some forms pass on values from shipping.php through arrays
        //These forms dont have unique names cause it wouldnt make sense such as Sheets because 
        //that can belong to different forms
        if (is_array($val)) {
            if (isset($val[$index])) {
                $tail .= $val[$index];
            } else {
                $tail .= "0";
            }
        } else {
            $tail .= $val;
        }
    }

    return "{$start}{$tail})";
}

/**
 * Parse the array and remove elements that are not part of the table you want to insert to.
 * @param table The table you want to insert into
 */
function getSafeInput($data, $table) {
    $safeFields = array();
    $cleanData = array();

    //TODO add total
//TODO load all this info from database
    if ($table == "Slip") {
        $safeFields = array(
            "QuoteNumber" => "number",
            "Form" => "string",
            "Qty" => "number",
            "Ctns" => "number",
            "NoOfSheets" => "number",
            "NoOfSkids" => "number",
            "Notes" => "string",
            "Additional" => "string",
            "Part" => "number",
            "NoOfPcs" => "number",
            "Type" => "string",
        );
    } else if ($table == "SlipHistory") {
        $safeFields = array(
            "SessId" => "number",
            "label1" => "string",
            "label2" => "string",
            "ShippingAddress" => "string",
            "DocketNumber" => "number",
        );
    }

    foreach ($data as $field => $val) {
        if (isset($safeFields[$field])) {
            switch ($safeFields[$field]) {
                case "string":
                    $cleanData[$field] = quoteStrings($val);
                    break;
                case "number":
                    $cleanData[$field] = makeNum($val);
                    break;
                default:
                    //do nothing
                    break;
            }

            //If we're creating a new array, this condition may never be met.
        } else {
            // //unset($data[$field]);
//            echo "{$field} is unsafe\n";
        }
    }

    return $cleanData;
}

/**
 * Quote all the strings in the given variable.
 * @param mixed $var The variable.
 * @return mixed Variable with strings quoted.
 * TODO move this to backendHelper after the other copies of this are found and DESTROYED!!!!
 */
function quoteStrings($var) {
    if (is_array($var)) {
        foreach ($var as $key => $val) {
            $var[$key] = quoteStrings($val);
        }
    } else {
        //assumed string
        $var = "'{$var}'";
    }

    return $var;
}

/*
 * Change the array names to match the ones in the SQL table
 */

function cleanVars($arr) {
    //change the names of any variables to correspond to names in the 
    //field

    foreach ($arr as $field => $val) {
        $var = str_replace("_", "", $field);

        switch ($var) {
            case "Cartons":
                $var = "Ctns";
                break;
            case "CartonPcs":
                $var = "Qty";
                break;
            case "CartonPtl":
                $var = "Part";
                break;
            case "Sheets":
                $var = "NoOfSheets";
                break;
            case "Pieces":
                $var = "NoOfPcs";
                break;
            case "Skids":
                $var = "NoOfSkids";
                break;
        }

        //If the index name of the array is not the result of str replace,
        //Set it as so and delete the original.
        if ($field !== $var) {
            $arr[$var] = $val;
            unset($arr[$field]);
        }
    }

    return $arr;
}

/**
 * Delete all old shipments recorded during this session.
 * @param resource $link Connection to the database.
 * @param number $id The Session id.
 * @return boolean True if the shipments were deleted, false otherwise. 
 */
function deleteOldSlips($link, $id) {
    if (!isset($link) || !is_resource($link) || !isset($id) || !is_numeric($id)) {
        return false;
    }

    $query = "DELETE FROM Slip WHERE SessId={$id}";
    $res = mysql_query($query, $link) !== false;

    if ($res) {
        //echo "Deleted old slips \n";
    }

    return $res;
}

/**
 * Delete all old shipments recorded during this session form SlipHistory
 * @param resource $link Connection to the database.
 * @param number $id The Session id.
 * @return boolean True if the shipments were deleted, false otherwise. 
 */
function deleteOldSlipsHistory($link, $id) {
    if (!isset($link) || !is_resource($link) || !isset($id) || !is_numeric($id)) {
        return false;
    }

    $query = "DELETE FROM SlipHistory WHERE SessId={$id}";
    $res = mysql_query($query, $link) !== false;

    if ($res) {
        //echo "Deleted old slips from SlipHistory\n";
    }

    return $res;
}

/**
 * Print all the data saved for this docket number in XML format.
 * If an error occurs, redirect appropriately.
 * TODO can some of this be loaded from production?
 */
function loadProductionData($docketNum) {
    if (!is_numeric($docketNum)) {
        fail("Invalid docket number specified: " . $docketNum, true);
    }

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    $query = "SELECT Customer, QuoteNumber as Quote_Number, JobName as Job_Name FROM Production WHERE DocketNumber=" . $docketNum;

    if (($result = mysql_query($query, $link))) {
        if (mysql_num_rows($result) === 0) {
            fail("Could not retrieve any information with docket number " . $docketNum, false);
        }

        $row = mysql_fetch_array($result);

        echo "<parent>\n"; //open XML wrapper

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

//        loadForms($docketNum, $link);

        echo "</parent>"; //close XML wrapper
    } else {
        fail("Could not execute SQL query " . $query, false);
    }

    disconnect($link);
}

/**
 * Print all the data saved for this docket number in XML format.
 * If an error occurs, redirect appropriately.
 * TODO can some of this be loaded from production?
 */
function loadProductionDataHistory($docketNum) {
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

        echo "<parent>\n"; //open XML wrapper

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

//        loadForms($docketNum, $link);

        echo "</parent>"; //close XML wrapper
    } else {
        fail("Could not execute SQL query " . $query, false);
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
 * For the given SessId, log the out time of in SlipStatus
 */
function shipOut($SessId, $setDate) {
    date_default_timezone_set("America/Winnipeg");
    $currentTime = date("g:iA");
    $link = connectToDatabase();
    if ($setDate === "true") {
        $statusQuery = "UPDATE SlipStatus
            SET DateOut=CURDATE(), TimeOut=NOW()
            WHERE SessId={$SessId}";
    } else {
        $statusQuery = "UPDATE SlipStatus
            SET DateOut=NULL, TimeOut=NULL
            WHERE SessId={$SessId}";
    }
    $sucess = mysql_query($statusQuery, $link);
    if (!$sucess) {
        die('Could not ship out.\n' . mysql_error());
    }
    $docketNumber = getDocketNumberFrom($SessId);
    $jobName = getJobNameFrom($docketNumber);
    if ($setDate === "true") {
        sendEmailNotifications($docketNumber, "shipped", $jobName);
    }

    header("Location: /Intranet/HomePage/");
    exit;
}

/**
 * Given the SessId, return the docket number that it belongs to.
 */
function getDocketNumberFrom($SessId) {
    $link = connectToDatabase();
    if (is_resource($link)) {

        $query = "SELECT DocketNumber FROM Slip WHERE SessId=$SessId";

        $result = mysql_query($query, $link);
        if ($result === false) {
            fail("could not execute query.", false);
        }
        if ($row = mysql_fetch_array($result)) {
            return $row['DocketNumber'];
        }

        disconnect($link);
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Given the docketnumber, get the name of the job.
 */
function getJobNameFrom($DocketNumber) {
    $link = connectToDatabase();
    if (is_resource($link)) {

        $query = "SELECT JobName FROM Production WHERE DocketNumber=$DocketNumber";

        $result = mysql_query($query, $link);
        if ($result === false) {
            fail("could not execute query.", false);
        }
        if ($row = mysql_fetch_array($result)) {
            return $row['JobName'];
        }

        disconnect($link);
    } else {
        fail("Could not connect to database", false);
    }
}

?>
