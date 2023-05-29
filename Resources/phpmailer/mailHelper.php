<?php

/*
 * This file was created to store all the functions related to sending 
 * out emails. So far it is used for subscription and emailing clients
 * pdfs of delivery slips.
 * 
 * Written by Peter Tran Aug 31st, 2012.
 */

include($_SERVER["DOCUMENT_ROOT"] . '/Intranet/Resources/phpmailer/class.phpmailer.php');
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";

/**
 * Given a docket number and subscription type, email all the people who have 
 * subscribed to that job and the corresponding event.
 */
function sendEmailNotifications($docketNumber, $subscriptionType, $jobName) {

    switch ($subscriptionType) {
        case "inShipping":
            $status = "Order Ready";
            $status2 = " is ready to be picked up.";
            break;
        case "shipped":
            $status = "Order Shipped";
            $status2 = " has been picked up.";
            break;
        case "DieMakingIn":
            $status = "Die Making Started";
            $status2 = " has entered Die Making.";
            break;
        case "DieMakingOut":
            $status = "Die Making Complete";
            $status2 = " has been completed in Die Making.";
            break;
        case "PressIn":
            $status = "Press Started";
            $status2 = " has been started on the Press.";
            break;
        case "PressOut":
            $status = "Press Complete";
            $status2 = " has been completed on the Press.";
            break;
        case "GluingIn":
            $status = "Gluing Started";
            $status2 = " has entered Gluing.";
            break;
        case "GluingOut":
            $status = "Gluing Complete";
            $status2 = " has been completed in Gluing.";
            break;
        case "StrippingIn":
            $status = "Stripping Started";
            $status2 = " has entered Stripping.";
            break;
        case "StrippingOut":
            $status = "Stripping Complete";
            $status2 = " has finished in Stripping.";
            break;
        case "HandWorkIn":
            $status = "Hand Work Started";
            $status2 = " has entered Hand Work.";
            break;
        case "HandWorkOut":
            $status = "Hand Work Complete";
            $status2 = " has finished in Hand Work.";
            break;
    }

    //email info
    $subject = "No Reply:" . $status . ": " . $jobName;
    $body = "This is an automated message from Alternative Die Cutting, do not reply to this message. 
    Please contact your sales rep for any inquiries or requests.<br>" .
            "Your order $jobName $status2<br>";
//    $body = "This is an automated message from Alternative Die Cutting\n" .
//            "Your order $jobName $status2\n" .
//            "\n\n If you've requested to pre-approve your delivery slip, ignore this message. Please ask your sales rep about the status of your job. ";


    $mail = setUpMailer($subject, $body);
    $link = connectToDatabase();
    if (is_resource($link)) {

        $query = "SELECT Email FROM Subscriptions 
        WHERE (DocketNumber=$docketNumber AND SubscriptionType='$subscriptionType')";

        if (($result = mysql_query($query, $link))) {
            $at_least_one = false;
            while ($row = mysql_fetch_array($result)) {
                $at_least_one = true;
                $email = $row['Email'];
                $mail->AddAddress($email);
            }
            $mail->IsHTML(true);
            if ($at_least_one) {
                if (!$mail->Send()) {
                    echo "Mailer Error: " . $mail->ErrorInfo;
                } else {
                    echo "Message has been sent";
                }
            }
            
        } else {
            echo "Could not execute SQL query: " . $query . $mysql_error();
        }
        disconnect($link);
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Return the mailer with the proper inputs such as login info, sender info.
 * Add the given subject and body.
 */
function setUpMailer($subject, $body, $webmaster_email="info@alternativedc.com") {
    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->SMTPAuth = true;

    //Where the email is sent from
    $mail->Username = "info@alternativedc.com";
    $mail->Password = "subpass80F";

    //The sender info
    //The email the recipient will reply to 
    $mail->From = $webmaster_email;
    $mail->FromName = "ADC";
    $mail->AddReplyTo($webmaster_email, $mail->FromName);

    $mail->Subject = $subject;
    $mail->Body = $body;
    return $mail;
}

/**
 * Send an email to the given email address and attached the file at the given
 * location. Return whether or not 
 * @param type $location The file to attach.
 * @param type $email The email address to be emailed.
 * @param string $subject The subject of the email
 * @param string $body the body of the email.
 */
function emailFile($location, $emails, $subject, $body, $returnEmail = "info@alternativedc.com") {

    $mail = setUpMailer($subject, $body, $returnEmail);
    $mail->IsHTML(true);
    $mail->AddAttachment($location);
    foreach ($emails as $email) {
        $mail->AddAddress($email, $email);
    }
    return $mail->Send();
}

/**
 * Return the emails associated with the given company(via docket number) in html form as options
 * within a select.
 */
function echoEmails($docketNumber) {

    $returnVal = "";
    $customer = getCustomer($docketNumber);

    $link = connectToDatabase();
    if (is_resource($link)) {

        $query = "SELECT Email FROM CustomerContactEmails 
        WHERE Customer='$customer'";
        if (($result = mysql_query($query, $link))) {
            while ($row = mysql_fetch_array($result)) {
                $email = $row['Email'];
                $returnVal .= '<option value="' . $email . '">' . $email . '</option>';
            }
        } else {
            fail("Could not execute SQL query: " . $query, false);
        }
        disconnect($link);
    } else {
        fail("Could not connect to database", false);
    }
    echo $returnVal;
}

/**
 * Given a docket number, return the customerId associated with it.
 */
function getCustomer($docketNumber) {
    $link = connectToDatabase();
    if (is_resource($link)) {

        $query = "SELECT Customer FROM Production 
        WHERE DocketNumber=$docketNumber";

        if (($result = mysql_query($query, $link))) {
            if ($row = mysql_fetch_array($result)) {
                $returnVal = $row["Customer"];
            }
        } else {
            fail("Could not execute SQL query: " . $query, false);
        }
        disconnect($link);
    } else {
        fail("Could not connect to database", false);
    }
    return $returnVal;
}

/**
 * Given an array of emails and the customer name, add those emails under that 
 * customer to the database.
 */
function addEmailsToDB($emails, $customer) {
    $link = connectToDatabase();
    if (is_resource($link)) {

        $query = "INSERT INTO CustomerContactEmails (Customer, Email) VALUES ";
        foreach ($emails as $email) {
            if ($email != "") {
                $query .= "('" . $customer . "','" . $email . "'),";
            }
        }
        $query = substr($query, 0, strlen($query) - 1);

        if (!($result = mysql_query($query, $link))) {


            //echo "Could not execute SQL query: " . $query . mysql_error();
        }
        disconnect($link);
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Given POST variables of clientEmail and preloadedEmail, add the clientEmail
 * to the database (or client emailS if there is more than one separated by commas)
 * in respect to the given customer.
 * Return an array of email addresses as a combination of client email and preloaded
 * email in respect to whether they are set or not.
 */
function getEmails($clientEmailPOST, $preloadedEmailPOST, $customer) {
    if (isset($preloadedEmailPOST) && $preloadedEmailPOST != "") {

        $emails = array($preloadedEmailPOST);
        if (isset($clientEmailPOST) && $clientEmailPOST != "") {
            $newEmails = explode(",", $clientEmailPOST);
            addEmailsToDB($newEmails, $customer);
            $emails = array_merge($newEmails, $emails);
        }
    } else {
        $emails = explode(",", $clientEmailPOST);
        if ($emails != "") {
            addEmailsToDB($emails, $customer);
        }
    }
    return $emails;
}

?>
