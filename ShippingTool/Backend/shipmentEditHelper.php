<?php

require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/backendHelper.php";
require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/xmlHelper.php";
require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/loginHelper.php";
//require_once($_SERVER["DOCUMENT_ROOT"] . '/Intranet/Resources/phpdebugger/PhpConsole.php');
//PhpConsole::start();

ob_start();
//debug($_POST);
if (isset($_POST['type'])) {
    switch ($_POST['type']) {
        case "change_shipments":
            if (isset($_POST['saveData'])) {
                changeShipments($_POST['DocketNumber'], $_POST['saveData']);
            } else {
                fail("Key fields not set", true);
            }

            break;
        case "update_slip":
            if (isset($_POST['DocketNumber']) && isset($_POST['saveData'])) {
                updateSlip($_POST['DocketNumber'], $_POST['saveData']);
            } else {
                fail("Key fields not set", true);
            }

            break;

        case "delete_slip":
            if (isset($_POST['saveData'])) {
                deleteSlip($_POST['saveData']);
            } else {
                fail("Key fields not set", true);
            }
            break;
        default:
            fail("Invalid type set:{$_POST['type']}", true);
            break;
    }
} else {
    fail("Type not set", true);
}

ob_flush();

function getQuoteNumber($link, $docketNumber) {
    $quoteNumber = -1;

    if (!isset($docketNumber) || !is_numeric($docketNumber) || !isset($link)
            || !is_resource($link)) {
        return $quoteNumber;
    }

    $query = "SELECT QuoteNumber FROM Slip WHERE DocketNumber={$docketNumber}";
    $result = mysql_query($query);

    if ($result) {
        if (mysql_num_rows($result) > 0) {
            $row = mysql_fetch_row($result);
            $quoteNumber = $row[0];
        }
    }

    return $quoteNumber;
}

function changeShipments($docketNumber, $saveData) {
    if (!isset($docketNumber) || !is_numeric($docketNumber) || !isset($saveData)) {
        fail("Key fields set incorrectly", false);
    }

    $link = connectToDatabase();

    if (is_resource($link)) {
        $qn = getQuoteNumber($link, $docketNumber);
        $cleared = removePreviousShipments($link, $docketNumber);
//        $cleared = true;

        if (!$cleared) {
            fail("Could not clear existing data", false);
        }

        $saveArray = unserializeForm($saveData);
        $saveArray['QuoteNumber'] = $qn;

        $result = makeChanges($link, $docketNumber, $saveArray);
        disconnect($link);

        if ($result === false) {
            fail("saving failed", false);
        }
    } else {
        fail("Could not connect to database", false);
    }
}

function makeChanges($link, $docketNumber, $saveArray) {
    if (!isset($link) || !is_resource($link) || !isset($docketNumber) ||
            !is_numeric($docketNumber) || !isset($saveArray)) {
        return false;
    }

    $numShipments = 0;

    if (isset($saveArray['Form'])) {
        if (is_array($saveArray['Form'])) {
            $numShipments = count($saveArray['Form']);
        } else {
            $numShipments = 1;
        }
    }

    $saveArray = cleanVars($saveArray);
    $saveArray = getSafeInput($saveArray, "Slip");
    $saveArray['DocketNumber'] = $docketNumber;
    $saveArray = getQuantity($saveArray);

    for ($shipment = 0; $shipment < $numShipments; $shipment++) {
        $query = buildQuery($saveArray, $shipment);
        if (!mysql_query($query, $link)) {
            return false;
        }
    }

    return true;
}

/**
 * Given the data to be saved, make sure the TOTAL field is set.
 * @param array $data The data to be saved.
 * @return array The data to be saved, with added total fields.
 */
function getQuantity($data) {
    if (isset($data['Type'])) {
        if (is_array($data['Type'])) {
            $numForms = count($data['Type']);

            for ($i = 0; $i < $numForms; $i++) {
                $total = getQty($data, $i);
                $data['Total'][$i] = $total;
            }
        } else {
            $total = getQty($data);
            $data['Total'] = $total;
        }
    }
    return $data;
}

function getQty($data, $index = -1) {
    $total = 0;
    $type = getFormType($data, $index);

    if ($type === false) {
        return $total;
    }

    switch ($type) {
        case "'Sheets'":
            $sheets = 0;

            if (isset($data['NoOfSheets'])) {
                if ($index >= 0 && is_array($data['NoOfSheets']) && isset($data['NoOfSheets'][$index])) {
                    $sheets = $data['NoOfSheets'][$index];
                } else if ($index < 0) {
                    $sheets = $data['NoOfSheets'];
                }
            }
            if (is_numeric($sheets)) {
                $total = $sheets;
            }
            break;
        case "'Pieces'":
            $pieces = 0;

            if (isset($data['NoOfPcs'])) {
                if ($index >= 0 && is_array($data['NoOfPcs']) && isset($data['NoOfPcs'][$index])) {
                    $pieces = $data['NoOfPcs'][$index];
                } else if ($index < 0) {
                    $pieces = $data['NoOfPcs'];
                }
            }

            if (is_numeric($pieces)) {
                $total = $pieces;
            }

            break;
        case "'Cartons'":
            $cartons = 0;
            $pcsPerCarton = 1;
            $extra = 0;

            if (isset($data['Ctns'])) {
                if ($index >= 0 && is_array($data['Ctns']) && isset($data['Ctns'][$index])) {
                    $cartons = $data['Ctns'][$index];
                } else if ($index < 0) {
                    $cartons = $data['Ctns'];
                }
            }

            if (is_numeric($cartons)) {
                $total = $cartons;
            }

            if (isset($data['Qty'])) {
                if ($index >= 0 && is_array($data['Qty']) && isset($data['Qty'][$index])) {
                    $pcsPerCarton = $data['Qty'][$index];
                } else if ($index < 0) {
                    $pcsPerCarton = $data['Qty'];
                }
            }

            if (is_numeric($pcsPerCarton)) {
                $total *= $pcsPerCarton;
            }

            if (isset($data['Part'])) {
                if ($index >= 0 && is_array($data['Part']) && isset($data['Part'][$index])) {
                    $extra = $data['Part'][$index];
                } else if ($index < 0) {
                    $extra = $data['Part'];
                }
            }

            if (is_numeric($extra)) {
                $total += $extra;
            }

            break;
    }

    return $total;
}

function getFormType($data, $index = -1) {
    $type = false;

    if (isset($data) && is_array($data) && isset($data['Type'])) {
        if ($index >= 0 && is_array($data['Type']) && isset($data['Type'][$index])) {
            $type = $data['Type'][$index];
        } else if ($index < 0) {
            $type = $data['Type'];
        }
    }

    return $type;
}

function buildQuery($data, $index) {
    $cols = "";
    $vals = "";

    $j = 0;

    foreach ($data as $field => $val) {
        if ($j++ > 0) {
            $cols .= ", ";
            $vals .= ", ";
        }

        $cols .= $field;

        if (is_array($val)) {
            if (isset($val[$index])) {
                $vals .= $val[$index];
            } else {
                $vals .= "0";
            }
        } else {
            $vals .= $val;
        }
    }

    return "INSERT INTO Slip({$cols}) VALUES({$vals})";
}

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
            case "Quantity":
                $var = "Total";
                break;
        }

        if ($field !== $var) {
            $arr[$var] = $val;
            unset($arr[$field]);
        }
    }

    return $arr;
}

function getSafeInput($data) {
    $safeFields = array();

//TODO load all this info from database
    $safeFields = array(
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
        "Total" => "number",
        "QuoteNumber" => "number",
        //for now treat dates like strings
        "Date" => "date"
    );

    foreach ($data as $field => $val) {
        if (isset($safeFields[$field])) {
            switch ($safeFields[$field]) {
                case "string":
                    $data[$field] = quoteStrings($val);
                    break;
                case "number":
                    $data[$field] = makeNum($val);
                    break;
                case "date":
                    if (isSQLTime($data[$field])) {
                        $data[$field] = quoteStrings($val);
                    } else {
                        unset($data[$field]);
                    }

                default:
                    //do nothing
                    break;
            }
        } else {
            unset($data[$field]);
//            echo "{$field} is unsafe\n";
        }
    }

    return $data;
}

/**
 * Return true if the string represents a MySQL timestamp, false otherwise.
 * @param string $str The string.
 * @return True if is valid timestamp, false otherwise.
 */
function isSQLTime($str) {
    if (is_array($str)) {
        $good = true;

        //note here that ALL timestamps have to be valid to return true

        foreach ($str as $field => $val) {
            $good = $good && isSQLTime($val);
        }

        return $good;
    } else if (is_string($str)) {
        return preg_match("/^\d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d/", $str) === 1;
    } else {
        return false;
    }
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
 * Delete previous shipments for this docket number.
 * Return true on sucess, false on error.
 * @param resource $link Link to the database.
 * @param number $docketNumber The docket number.
 * @return boolean True on success, false on error.
 */
function removePreviousShipments($link, $docketNumber) {
    if (!isset($link) || !isset($docketNumber) || !is_resource($link) || !is_numeric($docketNumber)) {
        return false;
    }

    $query = "DELETE FROM Slip WHERE DocketNumber={$docketNumber}";
    $result = mysql_query($query, $link);

    return $result !== false;
}

/**
 * Given the docket number and the SessId, update SlipHistory
 * and Slip tables with the serialized data.
 * @param type $docketNumber The docket the slip is for
 * @param $SessId the session Id the data is for
 * @param type $saveData The serialized data.
 */
function updateSlip($docketNumber, $saveData) {
    if (!isset($saveData)) {
        fail("Key fields set incorrectly", false);
    }
    $link = connectToDatabase();

    if (is_resource($link)) {

        $saveArray = unserializeForm($saveData);
        $result = updateSlipHelper($link, $docketNumber, $saveArray['SessId'], $saveArray);
        disconnect($link);

        if ($result === false) {
            fail("saving failed", false);
        }
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Given the link to the database, docket number of a slip, a SessId and 
 * unserialized data in an array, create and execute a query. Return true if
 * it is executed without problem, false otherwise.
 * @param type $link
 * @param type $docketNumber
 * @param type $slipArray
 * @return type 
 */
function updateSlipHelper($link, $docketNumber, $SessId, $saveArray) {
    if (!isset($link) || !is_resource($link) || !isset($docketNumber) ||
            !is_numeric($docketNumber) || !isset($saveArray)) {
        fail("fields not set", true);
        return false;
    }

    if (!updateForms($link, $docketNumber, $SessId, $saveArray)) {
        return false;
    }
    $slipHistoryArray = getSlipHistoryArray($saveArray);
    $slipHistoryQuery = buildUpdateQuery($slipHistoryArray, $docketNumber, $SessId, "SlipHistory", false);
    if (strlen($slipHistoryQuery) != false) {
        if (!mysql_query($slipHistoryQuery, $link)) {
            fail("Could not execute sliphistory query:" . $slipHistoryQuery . mysql_error(), false);
            return false;
        }
    }

    return true;
}

/**
 * Extract from the given array the data needed for the sliphistory
 * table and return it in an array.
 * @param type $saveArray The array representing information about a slip.
 * @return type $slipHistoryArray The array with data needed for the sliphistory table
 */
function getSlipHistoryArray($saveArray) {

    $slipHistoryArray = array();
    if ($saveArray["label1"]) {
        $slipHistoryArray["label1"] = $saveArray["label1"];
    }
    if ($saveArray["label2"]) {
        $slipHistoryArray["label2"] = $saveArray["label2"];
    }
    if ($saveArray["Shipping_Address"]) {
        $slipHistoryArray["ShippingAddress"] = $saveArray["Shipping_Address"];
    }
    return $slipHistoryArray;
}

/**
 * Building and return the string to update the given table where the 
 * row matches the given docket number and slip with the given array.
 * If slip ID is false, return a modified query without the slidid requirement
 * @param $values The array with values to be updated
 * @param $docketNumber The docket number corresponding to the row to be updated
 * @param $SessId The SessId corresponding to the row to be updated
 * @param string $table The table to be updated to.
 */
function buildUpdateQuery($values, $docketNumber, $SessId, $table, $SlipId) {

    $fieldValue = "";
    foreach ($values as $field => $val) {

        $addValue = "";
        if (strlen($fieldValue) != 0) {
            $addValue .= ", ";
        }

        $addValue .= $field . "=";
        if (is_array($val)) {
            if (isset($val[0])) {
                $addThisValue = $val[0];
            } else {
                break;
            }
        } else {
            $addThisValue = $val;
        }

        if ($addThisValue != "") {
            $fieldValue .= $addValue . "'" . $addThisValue . "'";
        }
    }
    if (strlen($fieldValue) == 0) {
        return "";
    } else {
        if ($SlipId === false) {
            $query = "UPDATE {$table} SET {$fieldValue} WHERE (DocketNumber={$docketNumber}
        AND SessId={$SessId})";
            return $query;
        } else {
            $query = "UPDATE {$table} SET {$fieldValue} WHERE (DocketNumber={$docketNumber}
        AND SlipId={$SlipId} AND SessId={$SessId})";
            return $query;
        }
    }
}

/**
 * Given the serialized data of a slip, delete all entries from SlipHistory
 * and Slip tables with the matching SessId
 * @param type $saveData The serialized data.
 */
function deleteSlip($saveData) {
    if (!isset($saveData)) {
        fail("Key fields set incorrectly", false);
    }

    $link = connectToDatabase();

    if (is_resource($link)) {

        $saveArray = unserializeForm($saveData);
        $result = deleteSlipHelper($link, $saveArray);
        disconnect($link);

        if ($result === false) {
            fail("delete failed", false);
        }
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Given the link to the database and
 * unserialized data in an array, create and execute the delete a query. 
 * Return true if
 * it is executed without problem, false otherwise.
 * @param type $link
 * @param type $saveArray
 * @return type 
 */
function deleteSlipHelper($link, $saveArray) {
    if (!isset($link) || !is_resource($link) || !isset($saveArray)) {
        fail("fields not set", true);
        return false;
    }

    $SessId = $saveArray["SessId"];
    $deleteSlipQuery = "DELETE FROM Slip WHERE SessId={$SessId}";
    if (!mysql_query($deleteSlipQuery, $link)) {
        fail("Could not execute slip query:" . $deleteSlipQuery . mysql_error(), true);
        return false;
    }

    $deleteSlipHistoryQuery = "DELETE FROM SlipHistory WHERE SessId={$SessId}";
    if (!mysql_query($deleteSlipHistoryQuery, $link)) {

        fail("Could not execute sliphistory query:" . $deleteSlipHistoryQuery . mysql_error(), true);
        return false;
    }

    $deleteSlipStatusQuery = "DELETE FROM SlipStatus WHERE SessId={$SessId}";
    if (!mysql_query($deleteSlipStatusQuery, $link)) {

        fail("Could not execute sliphistory query:" . $deleteSlipStatusQuery . mysql_error(), true);
        return false;
    }

    return true;
}

/**
 * Given a link to the database, the docket number, session id and 
 * the array holding the form information, make updates per set of forms.
 * @param type $link
 * @param type $docketNumber
 * @param type $SessId
 * @param type $saveArray
 * @return type 
 */
function updateForms($link, $docketNumber, $SessId, $saveArray) {

    $numberOfRows = count($saveArray["Form"]);
    //Start from 1 because the first set of the Forms is the prototype
    $i = 1;
    while ($i < $numberOfRows) {
        $SlipId = $saveArray["SlipId"][$i];

        $slipArray = getFormArray($saveArray, $i);

        $slipQuery = buildUpdateQuery($slipArray, $docketNumber, $SessId, "Slip", $SlipId);

        if (strlen($slipQuery) != 0) {
            if (!mysql_query($slipQuery, $link)) {
                fail("Could not execute slip query:" . $slipQuery . mysql_error(), true);
                return false;
            }
        } else {
            return false;
        }
        $i++;
    }
    return true;
}

/**
 * Given an index and the saveArray of forms to save,
 * generate an array for the i'th form form saveArray. Generate the
 * arrays with the corresponding names that buildUpdateQuery can use.
 */
function getFormArray($saveArray, $i) {
    $formArray = array();

    $formArray["Type"] = $saveArray["Type"][$i];
    $formArray["Ctns"] = $saveArray["Cartons"][$i];
    $formArray["NoOfSheets"] = $saveArray["Sheets"][$i];
    $formArray["NoOfSkids"] = $saveArray["Skids"][$i];
    $formArray["Notes"] = $saveArray["Notes"][$i];
    $formArray["Part"] = $saveArray["CartonPtl"][$i];
    $formArray["Qty"] = $saveArray["CartonPcs"][$i];
    $formArray["NoOfPcs"] = $saveArray["Pieces"][$i];

    switch ($saveArray["Type"][$i]) {
        case "Sheets":
            $sheets = 0;
            if (isset($saveArray['NoOfSheets'])) {
                if ($i >= 0 && is_array($saveArray['NoOfSheets']) && isset($saveArray['NoOfSheets'][$i])) {
                    $sheets = $data['NoOfSheets'][$i];
                } else if ($i < 0) {
                    $sheets = $data['NoOfSheets'];
                }
            }
            if (is_numeric($sheets)) {
                $total = $sheets;
            }
            break;
        case "Pieces":
            $pieces = 0;

            if (isset($saveArray['NoOfPcs'])) {
                if ($i>= 0 && is_array($saveArray['NoOfPcs']) && isset($saveArray['NoOfPcs'][$i])) {
                    $pieces = $saveArray['NoOfPcs'][$i];
                } else if ($i < 0) {
                    $pieces = $saveArray['NoOfPcs'];
                }
            }

            if (is_numeric($pieces)) {
                $total = $pieces;
            }

            break;
        case "Cartons":
            $cartons = 0;
            $pcsPerCarton = 1;
            $extra = 0;

            if (isset($saveArray['Cartons'])) {
                if ($i >= 0 && is_array($saveArray['Cartons']) && isset($saveArray['Cartons'][$i])) {
                    $cartons = $saveArray['Cartons'][$i];
                } else if ($i < 0) {
                    $cartons = $saveArray['Cartons'];
                }
            }

            if (is_numeric($cartons)) {
                $total = $cartons;
            } else {
                $total = intval($cartons);
            }

            if (isset($saveArray['CartonPcs'])) {
                if ($i >= 0 && is_array($saveArray['CartonPcs']) && isset($saveArray['CartonPcs'][$i])) {
                    $pcsPerCarton = $saveArray['CartonPcs'][$i];
                } else if ($i < 0) {
                    $pcsPerCarton = $saveArray['CartonPcs'];
                }
            }

            if (is_numeric($pcsPerCarton)) {
                $total *= $pcsPerCarton;
            } else {
                $total *= intval($pcsPerCarton);
            }

            if (isset($saveArray['CartonPtl'])) {
                if ($i >= 0 && is_array($saveArray['CartonPtl']) && isset($saveArray['CartonPtl'][$i])) {
                    $extra = $saveArray['CartonPtl'][$i];
                } else if ($i < 0) {
                    $extra = $saveArray['CartonPtl'];
                }
            }

            if (is_numeric($extra)) {
                $total += $extra;
            } else {
                $total += intval($extra);
            }

            break;
    }
    $formArray["Total"] = $total;
    return $formArray;
}

?>
