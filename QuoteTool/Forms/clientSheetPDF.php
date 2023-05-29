<?php

ob_start();
require 'formHelper.php';
session_start();

function toEuroNumNotation($str) {
    $match = "/(\d)(?=(\d{3})+(\.\d\d)?($))/";
    return preg_replace($match, "$1,", $str);
}

//some constants
define("QUOTES_ON_FIRST_PAGE", 1);
define("QUOTES_ON_OTHER_PAGES", 2);
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/phpmailer/mailHelper.php";
require_once("../../Resources/pdfcrowd/pdfcrowd.php");
$HtmlCode = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Client Sheet</title>
        
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <link href="forms.css" rel="stylesheet" type="text/css" media="screen, print" />
        <link href="clientsheet.css" rel="stylesheet" type="text/css" media="screen, print" />

        <style>
        body {
    width: 100%;
    padding: 0;
    margin: 0;
    font-family: Calibri, Helvetica;
}

#generalInfo {
    text-align: center;
}

/*
* Centers everything
*/
#wrapper {
    width: 750px;
    margin-left: auto;
    margin-right: auto;

    page-break-after: avoid; /* printing formatting */
}

#header {
    text-align: center;
    padding: 0;
    display: block;
    height: 100%;
    width: 100%;
}

#logo, .logo {
    display: inline-block;
    margin: 0;
    float: left;
    padding: 0;
    height: 100px;
    width: 150px;
}

img {
    padding: 0;
    margin: 0;
}

#companyHeader, #companyHeader p, .companyHeader, .companyHeader p {
    display: inline-block;
    float: left;
    margin: 0;
    padding: 0;

    font-family: sans-serif;
}

#companyHeader h1, .companyHeader h1 {
    font-size: 1.2em;
    color: blue;
}

#companyHeader p, .companyHeader p {
    font-size: 0.8em;
    font-style: italic;
}

#content {
    clear: both;
    margin-top: 10px;
    padding-top: 10px;
}

#quoteInfo, .quoteInfo {
    float: right;
    display: inline-block;
    text-align: right;
}

a {
    text-decoration: none; /* removes underline */
}

.bar {
    clear: both;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    background-color: #0093FC;
    color: #fff;
    padding: 0 10px;
}

#customerInfo {
    display: inline-block;
    margin: 0;
    padding: 0;
}

#jobInfo {
    /*    display: inline-block;*/
    clear: both; /* clears floating of previous div (i.e. quoteInfo) */
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}

/** Format for printing */
#orderDetails {
    page-break-after: avoid;
}

table {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
}


#orderDetails table {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}

#orderDetails tr, td {
    text-align: left;
    padding-left: 10px;
    padding-right: 6px;
    padding-top: 2px;
}

.heading {
    font-weight: bold;
}

h5 {
    padding: 0;
    margin: 0;
}

#feedback {
    display: inline-block;
    float: right;
    margin-right: auto;
    margin-left: auto;
    padding-top: 50px;
    text-align: center;
}

#feedback h6 {
    font-size: 1.5em;
    color: #C43363;
    margin: 0;
    padding: 0;
}

#feedback button {
    display: inline-block;
    background-color: #f5f5f5;

    margin-left: auto;
    margin-right: auto;
    text-align: center;

    border: 1px solid #dedede;
    border-top:1px solid #eee;
    border-left:1px solid #eee;

    font-family: Calibri, Helvetica, sans-serif;
    font-size: 0.9em;
    line-height: 130%;
    text-decoration: none;
    font-weight: bold;
    color: #565656;
    cursor: pointer;
    padding: 4px 10px 3px 7px; 

    width: auto;
    overflow:visible;
}

@media print {
    #feedback{ display: none; }
    #wrapper{ width: 100%; }
}
.Total {
    font-weight: bold;
}

#Job_Name {
    font-size: 1.3em;
    font-weight: bold;
}

.quoteInfo {
    margin-top: 5px;
    font-weight: bold;
    font-size: 1.4em;
}

.Quote_Number {
    font-size: 1.3em;
}

#Customer {
    font-weight: bold;
}

#jobInfo {
    font-size: 1.1em;
}

#propaganda {
    font-weight: bold;
    font-size: 1.2em;
    text-align: center;
}

.bar {
    background-color: #fff;
    color: #000;
}

#jobInfo, #orderDetails table {
    border: 1px solid #000;
}

#jobInfo {
    margin-bottom: 0px;
    
}

#contentPane {
    padding-top: 0px;
    clear: both;
}

.header {
    height: 100%;
    font-style: italic;
/*    padding-bottom: 160px;*/
}

body {
/*    font-family: brush script mt;*/
/*    font-style: italic;*/

}

#attention {
    clear: both;
    display: block;
    padding-top: 10px;
/*    font-style:italic;*/
/*    float: left;*/
}

#wrapper {
/*    width: 70%;*/
}

.ClientSheetBar {
    clear: both;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    padding: 0 0px;
}

/*******************************************************************************
*********************************** PRINTING ***********************************
*******************************************************************************/

@media print {
    .continued {page-break-before: always; }
    .header {display: block !important; }
/*    #*/
}
        </style>
    </head>
    <body>
        <div id="wrapper">';

$customer = isset($_POST['Customer']) ? $_POST['Customer'] : "ERROR - NOT SET";
$qn = isset($_POST[format_string("Quote Number")]) ? "#" . $_POST[format_string("Quote Number")] : " number not set";
$attention = isset($_POST['Attention']) ? $_POST['Attention'] : "not specified";

$header =
        '<div class="header">
                <div class="logo">
                    <img src="/Intranet//Resources/Images/alt_logo.gif" alt="Alternative Logo" />
                </div>

                <div class="companyHeader">
                    <h1>Alternative Die Cutting, Inc.</h1>
                    <p>132 Alexdon Rd. Toronto ON M3J2B3 <br />
                        Tel: 416-748-6868 <br />
                        Fax: 416-748-0737 <br />
                        www.alternativedc.com <br />
                    </p>
                </div>

                <div class="quoteInfo">
                     <span class=\'Quote_Number\'>Quote' . $qn . "</span>
                     <br />$customer<br />
                </div>

                <span id='attention'>
                    Attention: {$attention}
                </span>
            </div>";

$HtmlCode .= $header;


$HtmlCode .= '<div id="contentPane">
                <h2 class="bar">Quote Summary</h2>

                <div id="jobInfo">
                    <p>';
date_default_timezone_set("America/Toronto");
$date = date("l, F j, Y");
$contact = isset($_SESSION['name']) ? $_SESSION['name'] : "unknown";
$customer = isset($_POST['Customer']) ? $_POST['Customer'] : "ERROR - NOT SET";
$HtmlCode .= "Quoted for <span id='Customer'>$customer</span> by $contact on $date<br />";
$arr = array('Job Name', 'Description', 'Notes');
foreach ($arr as $item) {
    $var = format_string($item);
    $val = isset($_POST[$var]) ? $_POST[$var] : "ERROR - NOT SET";
    $HtmlCode .= "<span id='$var'>$val</span><br />";
}

$HtmlCode .= '</p>
                </div>

                <div id="orderDetails">';

if (isset($_POST['numQuotes']) && is_numeric($_POST['numQuotes'])) {
    $numQuotes = intval($_POST['numQuotes']);
} else {
    $numQuotes = 0;
}

//number of quotes in a single block
$step = 3;

$headings = array('Number of Units',
    'Total',
    'Total per Thousand',
    'Units per Sheet',
    'Number of Sheets',
    'Shipping Type',
    'Notes');
$error_string = "ERROR - NOT SET";

for ($i = 0; $i < $numQuotes; $i += $step) {

    //page break before every odd-numbered block
    if (($i + 1) % 2 === 0) {
        $str = "continued";
    } else {
        $str = "";
    }

    $HtmlCode .= "<div class='$str'>";

    $header = '<div class="header" style="display:none;">
                

                <div class="companyHeader">
                    <h1>Alternative Die Cutting, Inc.</h1>
                    <p>132 Alexdon Rd. Toronto ON M3J2B3 <br />
                        Tel: 416-748-6868 <br />
                        Fax: 416-748-0737 <br />
                        www.alternativedc.com <br />
                    </p>
                </div>
                <div class="quoteInfo">
                     <span class=\'Quote_Number\'>Quote' . $qn . "</span><br />" .
            "$customer<br /></div></div>";

//                        if ($i > 0) {
//                            $HtmlCode .= $header;
//                        }



    $HtmlCode .= "<h2 class='bar'>Quote Details $str</h2>";
    $HtmlCode .= "<table>";

    foreach ($headings as $label) {
        $HtmlCode .= "<tr>";

        switch ($label) {
            case "Total per Thousand":
                $foo = "Cost per Thousand";
                break;
            case "Shipping Type":
                $foo = "Shipping";
                break;
            default:
                $foo = $label;
                break;
        }

        $HtmlCode .= "<td class='heading'>$foo</td>";

        $num = min($numQuotes, $i + $step);


        for ($j = $i; $j < $num; $j++) {

            if ($label === "Notes") {
                $var = format_string("Public Notes");
            } else {
                $var = format_string($label);
            }

            if (isset($_POST[$var]) && is_array($_POST[$var]) && isset($_POST[$var][$j])) {
                $val = $_POST[$var][$j];
                if (is_numeric(str_replace("$", "", $val))) {
                    $val = toEuroNumNotation($val);
                }
            } else {
                $val = $error_string;
            }

            $HtmlCode .= "<td><span class='$var'>$val</span></td>";
        }

        $HtmlCode .= "</tr>";
    }

    $HtmlCode .= "</table>";
    $HtmlCode .= "<div>";
//}

$HtmlCode .= '</div> <!-- end order details -->

                <div id="propaganda">
                    <p>Thank you for quoting with Alternative Die Cutting Inc.</p>
                </div> <!-- end propaganda -->
            </div> <!-- end content -->
        </div> <!-- end wrapper -->
    </body>
</html>';
}
$emails = getEmails($_POST["inputtedEmails"], $_POST["preloadedEmails"], $customer);
    if ($emails[0] != "") {
        $fileName = $customer;
        $fileName = str_replace(" ", "_", $fileName);
        $fileName .= ".pdf";
        $save_directory = 'pdfs/';

        $client = new Pdfcrowd("Petahhh", "adc97e327b8eb0b1e50abe2a348c2083");
        $pdf = $client->convertHtml($HtmlCode);


        $out_file = fopen($save_directory . $fileName, "wb");
        $client->convertHtml($HtmlCode, $out_file);
        fclose($out_file);
        
        //Add quote number in title (job name)

        $location = $_SERVER['DOCUMENT_ROOT'] . "/Intranet/QuoteTool/Forms/pdfs/" . $fileName;
        $subject = "Quote for " . $fileName . " (" . $qn . ")";
        $body = "This is an automated message from Alternative Die Cutting.<br><br> 
                Please see attached for your quote.";
        emailFile($location, $emails, $subject, $body);
        unlink($location);
    
    }
echo $HtmlCode;
?>