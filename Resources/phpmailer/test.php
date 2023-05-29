<?php


include('class.phpmailer.php');

ini_set('display_errors', 1);
error_reporting(E_ALL);

//authenticate user
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";

$mail = new PHPMailer();
$mail->IsSMTP();
$mail->SMTPAuth = true;

//Where the email is being sent from
$mail->Username = "info@alternativedc.com";
$mail->Password = "pass17ADC";

//The email the recipient will reply to
$webmaster_email = "pete.tran02@gmail.com";

//The recipient email
$email = "petah.tran@utoronto.ca";

//The name of recipient
$name = "customerpeter";
$mail->From = $webmaster_email;
$mail->FromName = "ADC";
        
$mail->AddAddress($email, $name);
$mail->AddReplyTo($webmaster_email, $mail->FromName);

//Adding a BCC
//$mail->AddBCC('recipience2@email.com', 'name of sales rep');
        
//Add attachments:
//$mail->AddAttachment("file.jpg");
$mail->IsHTML(true);

$mail->Subject = "This is the subject";
$mail->Body = "This is the email. Your order is done yo.";

if(!$mail->Send())
{
echo "Mailer Error: " . $mail->ErrorInfo;
}
else
{
echo "Message has been sent";
}

?>
