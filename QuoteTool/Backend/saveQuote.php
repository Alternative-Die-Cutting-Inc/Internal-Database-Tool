<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 29, 2011
 * ----------------------------------------------------------------
 * This file is used for saving quotes.
 * Parses the information given and saves it into the database.
 * 
 * Required variables:
 * QuoteNumber - the quote number
 * saveData - a serialized PHP form
 * writeType - 'override' (replace all data with this quote number) or not
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

define("SAVE_SEARCH", 0);
define("SAVE_DETAILS", 1);

/* * ***************************************************************************
 * *************************** MAIN BODY ***************************************
 * ************************************************************************** */

echo "<parent>"; //begin XML wrapper

if (isset($_POST['QuoteNumber']) && isset($_POST['saveData']) && isset($_POST['writeType'])) {
    $override = $_POST['writeType'] == "override";
    doWork($_POST['QuoteNumber'], $_POST['saveData'], $override);
} else {
    fail("Key parameters are not set", true);
}

echo "</parent>"; //end XML wrapper

/**
 * Parses the fieldString and valString and writes them to the database.
 * @param qn The quote number for the quote.
 * @param saveData The quotes and the header, as serialized by JQuery.
 * @param override Delete existing data with the same quote number if set to
 * true, ignore existing data otherwise.
 */
function doWork($qn, $saveData, $override) {
    if(!is_numeric($qn)) {
        fail("Quote number is not numeric: " . $qn, true);
    }
    
    if (!is_bool($override)) {
        $override = false;
    }

    $pairs = explode("&", $saveData);
    $data = array();

    foreach ($pairs as $pair) {
        $keyVal = explode("=", $pair);

        if (count($keyVal) !== 2) {
            continue;
        }

        //url decode down here or else splitting with & and = doesn't work
        $var = str_replace("[]", "", urldecode($keyVal[0]));
        $val = urldecode($keyVal[1]);

        if (is_numeric($var)) {
            continue;
        }

        if (isset($data[$var])) {
            if (is_array($data[$var])) {
                $data[$var][count($data[$var])] = $val;
            } else {
                $foo = $data[$var];
                $data[$var] = array();
                $data[$var][0] = $foo;
                $data[$var][1] = $val;
            }
        } else {
            $data[$var] = $val;
        }
    }

    $data = quoteStrings($data);

    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to the server", false);
        return;
    }

    $types = array(SAVE_SEARCH, SAVE_DETAILS);

    //TODO the data being written is not sanitized - i.e. there needs to be something like MYSQL_REAL_INPUT on the query or on some of the strings

    foreach ($types as $type) {
        $writeData = array();

        switch ($type) {
            case constant("SAVE_SEARCH"):
                $table = "Quote_Information";

                //XXX unquote this when everything is working
//            if (isset($data['Customer'])) {
//                updateCustomerFrequency($data['Customer'], $link);
//            }
                break;
            case constant("SAVE_DETAILS") :
                $table = "Saved_Quotes";
                break;
            default:
                //do nothing
                continue;
        }

        if (count($writeData = getWritableFields($data, $table, $link)) === 0) {
            fail("Did not find any data to save", true);
        }

        //delete everything that has that quote number from that table
        if ($override) {
            $query = "DELETE FROM $table WHERE Quote_Number=" . $qn;

            if (!(mysql_query($query, $link))) {
                fail("Could not override existing data", false);
            }
        }

        if (!isset($data['numQuotes']) || !is_numeric($data['numQuotes'])) {
            fail("Number of quotes not set", true);
        } else {
            $numQuotes = intval($data['numQuotes']);
        }

        for ($i = 0; $i < $numQuotes; $i++) {
            //array of data to be saved
            $foo = array();

            foreach ($writeData as $key => $val) {
                if (is_array($val)) {
                    if (isset($val[$i])) {
                        $foo[$key] = $val[$i];
                    }
                } else {
                    $foo[$key] = $val;
                }
            }

            $fields = implode(", ", array_keys($foo));
            $vals = implode(", ", array_values($foo));

            $query = "INSERT INTO $table (" . $fields . ") VALUES(" . $vals . ")";

            if (mysql_query($query, $link)) {
                echo "Quote " . ($i + 1) . " was successfully written into table " . $table . ". ";
            } else {
                fail("Failed to write data to the database", false);
            }
        }
    }

    disconnect($link);
}

/* * ***************************************************************************
 * ********************* HELPER FUNCTIONS **************************************
 * ************************************************************************** */

/**
 * Given an array of fields which the user wants to write, return the portion
 * of the array which can actually be written.
 * @param array $fields Fields to be written.
 * @param string $table The table for the fields.
 * @param link $link Link to the database.
 * @return array Fields which can be written.
 */
function getWritableFields($fields, $table, $link) {
    if (!is_resource($link)) {
        return array();
    }

    if (!($result = mysql_query("DESCRIBE " . $table, $link))) {
        return array();
    }

    $i = 0;

    while ($row = mysql_fetch_array($result)) {
        $tableFields[$i++] = $row['Field'];
    }

    $keys = array_keys($fields);

    for ($i = 0; $i < count($keys); $i++) {
        if (!in_array($keys[$i], $tableFields)) {
            unset($fields[$keys[$i]]);
        } 
    }

    return $fields;
}

/**
 * Quote all columns which correspond to string fields.
 * 
 * TODO fields to be quoted are defined explicitly but should be loaded from
 * the database
 * 
 * Assume that anything else is an integer
 * TODO rename this function
 * NOTE: this is not fool-proof. Integers can still get messed up by inserting floats
 * 
 * @param array $fields An associative array of fields to values.
 * @return array The array with all string fields quoted. 
 */
function quoteStrings($fields) {
    foreach ($fields as $key => $val) {
        switch ($key) {
            case "Notes":
            case "Author":
            case "Private_Notes":
            case "Public_Notes":
            case "Stock":
            case "Press":
            case "Shipping_Type":
            case "Method":
            case "Customer":
            case "Attention":
            case "Job_Name":
            case "Description":
            case "Extra_Field":
            case "Extra_Val":
                //TODO what if string is already quoted???
                if (is_array($val)) {
                    for ($i = 0; $i < count($val); $i++) {
                        $fields[$key][$i] = "\"" . $val[$i] . "\"";
                    }
                } else {
                    $fields[$key] = "\"" . $val . "\"";
                }
                break;
            default:

                if (is_array($val)) {
                    for ($i = 0; $i < count($val); $i++) {
                        $num = str_replace("$", "", $val[$i]);

                        if ($num === "" || !is_numeric($num)) {
                            $fields[$key][$i] = intval($num);
                        } else {
                            $fields[$key][$i] = $num;
                        }
                    }
                } else {
                    $num = str_replace("$", "", $val);

                    if ($num === "" || !is_numeric($num)) {
                        $fields[$key] = intval($num);
                    } else {
                        $fields[$key] = $num;
                    }
                }

                break;
        }
    }

    return $fields;
}

/**
 * Update the frequency for the given customer by adding 1 to the existing
 * frequency. 
 *
 * @param string $customer The customer name.
 * @param resource $link Link to the database.
 */
function updateCustomerFrequency($customer, $link) {
    if (!is_resource($link)) {
        fail("Could not connect to database", false);
    }

    $query = "UPDATE Customers SET Frequency=Frequency+1 WHERE Customer='$customer'";
    
    if(!(mysql_query($query, $link))) {
        fail("Could not update the customer rate", false);
    }
}

?>
