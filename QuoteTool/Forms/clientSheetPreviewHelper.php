<?php

/*
 * This file takes $html code from post and emails it as a pdf
 * to the provided email addresses. Return the user to the home
 * page afterwards.
 */

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require 'formHelper.php';
require_once("../../Resources/pdfcrowd/pdfcrowd.php");
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/phpmailer/mailHelper.php";


$qn = $_POST["QuoteNumber"];
if (isset($_POST["preloadedEmails"]) ||
        isset($_POST["clientEmail"])) {
    $customer = $_POST['Customer'];
    $deliverySlipCode = html_entity_decode($_POST['deliverySlipCode']);
    $emails = getEmails($_POST["clientEmail"], $_POST["preloadedEmails"], $customer);
    if ($emails[0] != "") {
        $fileName = $customer;
        $fileName = str_replace(" ", "_", $fileName);
        $fileName .= ".pdf";
        $save_directory = 'pdfs/';

        $client = new Pdfcrowd("Petahhh", "adc97e327b8eb0b1e50abe2a348c2083");
        $pdf = $client->convertHtml($deliverySlipCode);


        $out_file = fopen($save_directory . $fileName, "wb");
        $client->convertHtml($deliverySlipCode, $out_file);
        fclose($out_file);

        //Add quote number in title (job name)

        $location = $_SERVER['DOCUMENT_ROOT'] . "/Intranet/QuoteTool/Forms/pdfs/" . $fileName;
        $subject = "Quote for " . $fileName . " (" . $qn . ")";
        $body = "This is an automated message from Alternative Die Cutting, do not reply to this message. 
    Please contact your sales rep for any inquiries or requests.<br><br> 
                Please see attached for your quote.";
        if ($_POST["message"]) {
            $body = str_replace("\n", "<br>", $_POST['message']);
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
                <p>The quote has been sent as a PDF to ';
            foreach ($emails as $email) {
                echo $email . ", ";
            }
            echo '.</p>
                Your message: <blockquote>' . $body . ' </blockquote>
                <a href="/Intranet/">Home</a>
            </div>
        </body>';
        }
    }
}
?>
