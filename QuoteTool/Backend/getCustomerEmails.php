<?php

/* * ***************************************************************************
 * Written by Peter Tran for Alternative Die Cutting, Inc.
 * Updated October 9th, 2012
 * ------------------------------------------------------------------------
 * This file expects an Ajax call from quoteTool.js. It expects a customer name
 * to be passed and in return will output the emails in "<option></option>" form.
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

/* * ***************************************************************************
 * ******************************** IMPORTS ************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/loginHelper.php';
require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/backendHelper.php';

/* * ***************************************************************************
 * ******************************** MAIN BODY **********************************
 * ************************************************************************** */

if (isset($_POST['customer'])) {
    echoEmailsForCustomer($_POST["customer"]);
} else {
    fail("Field is not set", true);
}

/**
 * Return the emails associated with the given company(via docket number) in html form as options
 * within a select.
 */
function echoEmailsForCustomer($customer) {
    $link = connectToDatabase();
    if (is_resource($link)) {

        $query = "SELECT Email FROM CustomerContactEmails 
        WHERE Customer='$customer'";
        if (($result = mysql_query($query, $link))) {
            while ($row = mysql_fetch_array($result)) {
                $email = $row['Email'];
                echo '<option value="' . $email . '">' . $email . '</option>';
            }
        } else {
            fail("Could not execute SQL query: " . $query, false);
        }
        disconnect($link);
    } else {
        fail("Could not connect to database", false);
    }
    echo '<option value=""> -- </option>';
}
?>