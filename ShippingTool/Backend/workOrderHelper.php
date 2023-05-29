<?php

/*
 * Written by Peter Tran Aug 17th, 2012
 * This file contains functions needed to display information need on the
 * workorder.
 */

//require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/loginHelper.php";
require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/backendHelper.php";

/**
 * Given the docket number return the value of the given field of the corresponding
 * row from the DueDate table.
 */
function echoFromDueDate($docketNumber, $field) {
    $link = connectToDatabase();
    if (is_resource($link)) {
        if (!isset($link) || !is_resource($link)) {
            fail("fields not set", true);
            return false;
        } else {
            $query = "SELECT * FROM DueDate WHERE DocketNumber={$docketNumber}";
            $result = mysql_query($query, $link);
            if ($result) {
                if ($row = mysql_fetch_array($result)) {
                    if ($field == "DueDate") {
                        if (!($row[$field] == "0000-00-00")) {
                        echo date("l, F d", strtotime($row[$field]));}
                    } else {
                        echo $row[$field];
                    }
                }
            } else {
                fail("Could not execute duedate query:" . $query . mysql_error(), false);
                return false;
            }
        }
        disconnect($link);
    } else {
        fail("Could not connect to database", false);
    }
}

?>
