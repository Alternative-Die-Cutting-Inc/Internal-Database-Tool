<?php
/*
	This file responds to a request from the client sheet. It 
	creates a pdf of the given quote number, saves it on the server,
	and emails it to the given email.
*/

/* Connection the database */
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
/* Database query helpers: runQuery */
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/backendHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/phpmailer/mailHelper.php";
require_once("../../Resources/pdfcrowd/pdfcrowd.php");
$data = file_get_contents("php://input");
 
/* Give all functions access to the request object. */
global $objData;
$objData = json_decode($data);
if (isset($objData->data->request)) {
	switch($objData->data->request) {
		case 'email_client_pdf':
			if  (!isset($objData->data->input_emails) && !isset($objData->data->client_email)) {

				die(json_encode(array('ERROR' => 'Emails not given.',
									"passed in" => $objData)));
			} else if (!isset($objData->data->quote_number)) { 
				die(json_encode(array('ERROR' => 'Quote Number not given.',
									"passed in" => $objData)));
			} else if (!isset($objData->data->customer)) {

				die(json_encode(array('ERROR' => 'Customer not given.',
									"passed in" => $objData)));
			} else {
				emailClientPdf($objData);
			}
			break;

		default:
			die(json_encode(array('ERROR' => '' . $objData->data->request . ' is an unrecognized request.')));
			break;
	}
} else {
	/* If the request was not found, return an error. */
	die(json_encode(array('ERROR' => 'request not passed in.')));
}

/*
	Create a pdf and save on the server, email it to the input emails.
	If there are/is input emails, save them to the server.
*/
function emailClientPdf($objData) {
	$input_emails = isset($objData->data->input_emails) ? $objData->data->input_emails : "";
	$client_email = isset($objData->data->client_email) ? $objData->data->client_email : "";
	$emails = getEmails($input_emails, $client_email, $objData->data->customer);
    if ($emails[0] != "") {
        $fileName = $objData->data->customer;
        $fileName = str_replace(" ", "_", $fileName);
        $fileName .= ".pdf";
        $save_directory = 'pdfs/';
        try {
	        $client = new Pdfcrowd("Petahhh", "adc97e327b8eb0b1e50abe2a348c2083");
	        // $pdf = $client->convertHtml();

	        $out_file = fopen($save_directory . $fileName, "wb");
	        $client->convertURI("http://$_SERVER[HTTP_HOST]/Intranet/QT/clientsheet.php?quote_number=" . $objData->data->quote_number . "&pdf=true", $out_file);
	        fclose($out_file);
	        
	        //Add quote number in title (job name)
	        $location = $_SERVER['DOCUMENT_ROOT'] . "/Intranet/QT/php/pdfs/" . $fileName;
	        $subject = "Quote for " . $fileName . " (" . $objData->data->quote_number . 
	        $body = isset($objData->data->message)? $objData->data->message . "<br/><br/>": "";
	        $body .= "This is an automated message from Alternative Die Cutting.<br/><br/> 
	                Please see attached for your quote.";
	        emailFile($location, $emails, $subject, nl2br($body));
	        unlink($location);

	        $success_message = "Emails sent to:<br/><ul>";
	        foreach ($emails as $email) {
	        	$success_message .= "<li>" . $email . "</li>";
	        }
	        $success_message .= "</ul><br/>";
	        $success_message .= "Message: <p class='message'>" . nl2br($body) . "</p>";
			echo json_encode(array('SUCCESS' => $success_message));
		} catch(PdfcrowdException $why) {
			die(json_encode(array('ERROR' => "Pdfcrowd Error: " . $why)));
		}
    } else {
    	die(json_encode(array('ERROR' => 'No email addresses passed in.')));
    }
}
?>