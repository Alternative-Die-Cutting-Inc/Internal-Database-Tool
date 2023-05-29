<?php

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/xmlHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";

if (isset($_POST['type'])) {
    ob_start();

    switch ($_POST['type']) {
        case "load":
            if (isset($_POST['DocketNumber']) && is_numeric($_POST['DocketNumber'])) {
                load($_POST['DocketNumber']);
            } else {
                fail("Docket number not properly set", true);
            }

            break;
        case "save":
            if (isset($_POST['DocketNumber']) && is_numeric($_POST['DocketNumber'])
                    && isset($_POST['saveData'])) {
                save($_POST['DocketNumber'], $_POST['saveData']);
            } else {
                fail("Key fields not set", true);
            }

            break;
        default:
            fail("Type not properly set: {$_POST['type']}", true);
            break;
    }

    ob_flush();
} else {
    fail("Type not set", true);
}

/**
 * Save the data given in $saveData.
 * @param number $docketNumber The docket number.
 * @param string $saveData Serialized form to save.
 */
function save($docketNumber, $saveData) {
    if (!isset($docketNumber) || !is_numeric($docketNumber)) {
        fail("Docket number not properly set", true);
    }

    //extract an array from $saveData
    $data = unserializeForm($saveData);
    //translate relevant fields
    $data = translateNames($data);

    $link = connectToDatabase();

    if (is_resource($link)) {
        $val = saveCharges($link, $docketNumber, $data);
        disconnect($link);

        if ($val) {
            echo "Extra charges are saved";
        } else {
            fail("Could not save charges", false);
        }
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Save the charges, given an array mapping field names to values.
 * @param resource $link Link to the database.
 * @param number $docketNumber The docket number.
 * @param array $array Array mapping field names to values.
 * @return True if saving was successful, false otherwise.
 */
function saveCharges($link, $docketNumber, $array) {
    if (!is_resource($link)) {
        fail("Could not connect to database", false);
    }

    $array = getSafeFields($link, $array);

    if (!clearPreviousValues($docketNumber, $link)) {
        return false;
    }

    if (isset($array["Subject"]) && isset($array["Cost"]) && isset($array["Description"])) {
        if (!is_array($array["Subject"]) && !is_array($array["Cost"]) && !is_array($array["Description"])) {
            foreach ($array as $field => $val) {
                //turn each value into a single-element array
                $array[$field] = array($val);
            }
        }

        if (is_array($array["Subject"]) && is_array($array["Cost"]) && is_array($array["Description"]) &&
                count($array["Subject"]) === count($array["Cost"]) && count($array["Subject"]) === count($array["Description"])) {

            for ($i = 0; $i < count($array["Subject"]); $i++) {
                $query = "INSERT INTO ExtraCharges(DocketNumber, Subject, Cost, Description) VALUES(
                {$docketNumber},
                {$array["Subject"][$i]},
                {$array["Cost"][$i]},
                {$array["Description"][$i]}
                )";

                if (!mysql_query($query)) {
                    return false;
                }
            }

            return true;
        } else {
            return false;
        }
    } else {
        echo "Nothing to save";
        return true;
    }
}

/**
 * Remove previous extra charges for this docket number.
 * @param number $docketNumber The docket number.
 * @param resource $link Link to the database.
 */
function clearPreviousValues($docketNumber, $link) {
    if (!is_resource($link) || !is_numeric($docketNumber)) {
        return false;
    }

    $query = "DELETE FROM ExtraCharges WHERE DocketNumber={$docketNumber}";
    return mysql_query($query, $link) !== false;
}

/**
 * Remove fields from the array which are not present in the table.
 * Quote all strings and make sure number fields are numeric.
 * @param resource $link Link to the database.
 * @param array $writeArr Array mapping field names to values.
 * @return array The modified array.
 */
function getSafeFields($link, $writeArr) {
    $tableFields = array();
    //    $query = "DESCRIBE ExtraCharges";
//    
//    if(($result = mysql_query($query))) {
//        while($row = mysql_fetch_array($result)) {
//            $tableFields[ ] = $row['Field'];
//        }
//        
//        foreach($writeArr as $key => $val) {
//            
//        }
//    } else {
//        fail("Could not execute query: {$query}", false);
//    }
    //TODO for now explicitly state this
    $tableFields["Subject"] = "string";
    $tableFields["Cost"] = "number";
    $tableFields["Description"] = "string";
    $tableField["DocketNumber"] = "number";

    foreach ($writeArr as $field => $val) {
        if (isset($tableFields[$field])) {
            switch ($tableFields[$field]) {
                case "string":
                    $writeArr[$field] = quoteStrings($val);
                    break;
                case "number":
                    $writeArr[$field] = makeNum($val);
                    break;
            }
        } else {
            unset($writeArr[$field]);
        }
    }

    return $writeArr;
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

/**
 * Given an associative array where the keys are field names, translate 
 * those keys to column names as they appear in the database.
 * Return the modified array.
 * @param array $formArray The array.
 * @return array The modified array.
 */
function translateNames($formArray) {
    $names = array(
        "chargeName" => "Subject",
        "chargeAmt" => "Cost",
        "chargeNotes" => "Description"
    );

    foreach ($names as $formName => $dbName) {
        if (isset($formArray[$formName])) {
            $formArray[$dbName] = $formArray[$formName];
            unset($formArray[$formName]);
        }
    }

    return $formArray;
}

/**
 * Given a docket number, load the extra charges for that docket number from
 * the database and print it in an XML format.
 * @param number $docketNumber The docket number.
 */
function load($docketNumber) {
    if (!isset($docketNumber) || !is_numeric($docketNumber)) {
        fail("Docket number not properly set", true);
    }

    $link = connectToDatabase();

    if (is_resource($link)) {
        printCharges($link, $docketNumber);
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Given a connection to the database, print the extra charges in a valid XML
 * format.
 * @param resource $link Connection to the database.
 * @param number $docketNumber The docket number.
 */
function printCharges($link, $docketNumber) {
    if (!is_resource($link)) {
        return;
    }

    $query = "SELECT Subject AS chargeName,
                Cost AS chargeAmt, 
                Description AS chargeNotes
                FROM ExtraCharges
                WHERE DocketNumber={$docketNumber}";

    if (($result = mysql_query($query))) {
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

        echo "</parent>"; //close XML wrapper
    } else {
        fail("SQL query failed with query: {$query}", false);
    }
}
?>
