<?php

/*
 * This file takes the html code from a post and turns it into a pdf and mails it
 * out to the provided emails.
 */
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require 'formHelper.php';
require_once("../../Resources/pdfcrowd/pdfcrowd.php");
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/phpmailer/mailHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
if (isset($_POST["preloadedEmails"]) ||
        isset($_POST["clientEmail"])) {
    $dn = $_POST['DocketNumber'];
    $customer = $_POST['Customer'];
    $deliverySlipCode = html_entity_decode($_POST['deliverySlipCode']);
    $emails = getEmails($_POST["clientEmail"], $_POST["preloadedEmails"], $customer);
    if ($emails[0] != "") {
        $fileName = "Delivery Report for " . $customer . " (#" . $dn . ")";
        $fileName = str_replace(" ", "_", $fileName);
        $fileName = str_replace("", ".", $fileName);
        $fileName .= ".pdf";
        $save_directory = 'pdfs/';

        $client = new Pdfcrowd("Petahhh", "adc97e327b8eb0b1e50abe2a348c2083");
        $pdf = $client->convertHtml($deliverySlipCode);


        $out_file = fopen($save_directory . $fileName, "wb");
        $client->convertHtml($deliverySlipCode, $out_file);
        fclose($out_file);

        $location = $_SERVER['DOCUMENT_ROOT'] . "/Intranet/ShippingTool/Forms/pdfs/" . $fileName;
        $subject = $fileName;
        $body = "This is an automated message from Alternative Die Cutting, do not reply to this message. 
    Please contact your sales rep for any inquiries or requests.  
            <br><br>Attached is the delivery report for your order: " . $dn;
        if ($_POST["message"]) {
            $body = str_replace("\n","<br>",$_POST['message']);
            $result = emailFile($location, $emails, $subject, $body, $_POST['userEmail']);
        } else {
            $result = emailFile($location, $emails, $subject, $body);
        }
        unlink($location);
        if ($result) {
            echo '<head>
        </head>
        <body>
         <div id="result">
                <p>The delivery report has been sent as a PDF to ';
            foreach ($emails as $email) {
                echo $email . ", ";
            }
            echo '.</p>
                Your message: <blockquote>' . $body .  ' </blockquote>
                <a href="/Intranet/">Home</a>
            </div>
        </body>';
        }
    }

    //Log email history.
    foreach ($emails as $email) {
        $query = "INSERT INTO Email_Log (DocketNumber, email, customer, type) VALUES ($dn, '$email', '$customer', 'delivery report')";
        runQuery($query);
    }

}
?>
