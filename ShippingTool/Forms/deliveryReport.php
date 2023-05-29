<?php



ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start(); //this seems to fix anonymous bug on feedback page

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
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
            fail2("Could not execute SQL query: " . $query);
        }
        disconnect($link);
    } else {
        fail2("Could not connect to database");
    }
    return $returnVal;
}
/**
 * Return the emails associated with the given company(via docket number) in html form as options
 * within a select.
 */
function returnEmail($docketNumber) {

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
            fail2("Could not execute SQL query: " . $query);
        }
        disconnect($link);
    } else {
        fail2("Could not connect to database");
    }
    return $returnVal;
}

require 'formHelper.php';
$HtmlCode = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Delivery Report</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <style>
        yHeader p {
    font-size: 0.8em;
    font-style: italic;
}

#content {
    clear: both;
    margin-top: 10px;
    padding-top: 10px;
}

#quoteInfo {
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
        </style>
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Stylesheets/previewEmailer.css" />
    </head>
    <body>
        <div id="wrapper">
            <div id="header">
                <div id="logo">
                    <img src="http://www.alternativedc.com/Intranet/Resources/Images/alt_logo.gif" alt="Alternative Logo" />
                </div>
    

                <div id="companyHeader">
                    <h1>Alternative Die Cutting, Inc.</h1>
                    <p>132 Alexdon Rd. Toronto ON M3J2B3 <br />
                        Tel: 416-748-6868 <br />
                        Fax: 416-748-0737 <br />
                        www.alternativedc.com <br />
    

                    </p>
                </div>
 
            </div> <!-- end header -->

            <div id="content">
                <h2 class="bar">Your Order</h2>
                
   


                <div id="customerInfo">
                    <h3 class="bar">Created For</h3>';
$HtmlCode .= '<p>';
$customer = $_POST['Customer'];
$arr = array('Production Person', 'Customer');
foreach ($arr as $item) {
    $var = format_string($item);
    $val = isset($_POST[$var]) ? $_POST[$var] : "ERROR - NOT SET";
    $HtmlCode .= "$val<br />";
}

$HtmlCode .= '</p>
</div>



<div id="quoteInfo">
    <h3 class="bar">Order Information</h3>
    <p>';

$qn = isset($_POST[format_string("Docket Number")]) ? $_POST[format_string("Docket Number")] : "number not set";
$dn = isset($_POST[format_string("Docket Number")]) ? $_POST[format_string("Docket Number")] : "number not set";
date_default_timezone_set("America/Toronto");
$date = date("Y-m-d");
$HtmlCode .= "Docket $dn <br />";
$HtmlCode .= "$date<br />";

$HtmlCode .= '</p>
</div>

<div id="jobInfo">
    <p>';

$arr = array('Job Name');
foreach ($arr as $item) {
    $var = format_string($item);
    $val = isset($_POST[$var]) ? $_POST[$var] : "ERROR - NOT SET";
    $HtmlCode .= "$val<br />";
}

$HtmlCode .= '</p>
</div>

<div id="orderDetails">
    <div id="shipSummary">';

$var = format_string("Summary Form");

if (isset($_POST[$var]) && is_array($_POST[$var])) {
    $numForms = count($_POST[$var]);
} else {
    $numForms = 0;
}

$HtmlCode .= '<h2 class="bar" style="';
$HtmlCode .= $numForms === 0 ? "display: none;" : "display: block;";
$HtmlCode .= '">Shipment Summary</h2>';
$HtmlCode .= '<table style="';
$HtmlCode .= $numForms === 0 ? "display: none;" : "display: table;";
$HtmlCode .= '">';
$headings = array("Summary Form",
    "Last Shipment Date",
    "Quantity Requested",
    "Quantity Shipped",
    "Difference");

$errorString = "not set";

$HtmlCode .= '<thead>
    <tr>';

foreach ($headings as $heading) {
    if ($heading === "Summary Form") {
        $heading = "Form";
    }

    $HtmlCode .= "<th>$heading</th>";
}

$HtmlCode .= '</tr>
</thead>
<tbody>';
for ($i = 0; $i < $numForms; $i++) {
    $HtmlCode .= "<tr>";

    foreach ($headings as $heading) {
        $var = format_string($heading);

        if (isset($_POST[$var]) && is_array($_POST[$var]) && isset($_POST[$var][$i])) {
            $val = $_POST[$var][$i];
        } else {
            $val = $errorString;
        }

        $HtmlCode .= "<td>$val</td>";
    } //end listing column rows

    $HtmlCode .= "</tr>";
} //end counting forms

$HtmlCode .= '</tbody>
</table>
</div><!--  end shipment summary -->
<div id="shipDetails">';
$var = format_string("Form");

if (isset($_POST[$var]) && is_array($_POST[$var])) {
    $numForms = count($_POST[$var]);
} else {
    $numForms = 0;
}

$HtmlCode .= '<h2 class="bar" style="';
$HtmlCode .= $numForms === 0 ? "display: none;" : "display: block;";
$HtmlCode .= '">Shipment Details</h2>';

$HtmlCode .= '<table style="';
$HtmlCode .= $numForms === 0 ? "display: none;" : "display: table;";
$HtmlCode .= '">';

$headings = array("Form",
    "Date",
    "Quantity",
    "Number of Skids");

//XXX maybe say type here as well (carton, pcs, etc.)

$errorString = "not set";

$HtmlCode .= '<thead>
    <tr>';

foreach ($headings as $heading) {
    $HtmlCode .= "<th>$heading</th>";
}

$HtmlCode .= '</tr>
</thead>
<tbody>';
for ($i = 0; $i < $numForms; $i++) {
    $HtmlCode .= "<tr>";

    foreach ($headings as $heading) {
        $var = format_string($heading);

        if (isset($_POST[$var]) && is_array($_POST[$var]) && isset($_POST[$var][$i])) {
            $val = $_POST[$var][$i];
        } else {
            $val = $errorString;
        }

        $HtmlCode .= "<td>$val</td>";
    } //end listing column rows

    $HtmlCode .= "</tr>";
} //end counting forms

$HtmlCode .= '</tbody>
</table>
</div> <!-- end shipment details -->
</div> <!-- end order details -->
</div> <!-- end content -->
</div> <!-- end wrapper -->';


$deliverySlipCode = $HtmlCode . "</body></html>";
$HtmlCode .= '<div id="emailer">
                    <form method="post" action="deliveryReportPreviewHelper.php">
                        Email Client PDF: <input id="inputEmail" type="text" name="clientEmail"/>
                        <select id="preloadedEmails" name="preloadedEmails">
                                            <option value="" selected="selected" /> 
                        ' .  returnEmail($dn)  . '
                        </select>
                    <input type="submit" id="submitEmail" ></input>
                    <input type="hidden" name="deliverySlipCode" value="' . htmlentities($deliverySlipCode) . '"></input>
                    <input type="hidden" name="DocketNumber" value=' . $dn . ' ></input>
                    <input type="hidden" name="Customer" value="' . $customer . '"></input>
                    <input type="hidden" name="userEmail" value=' . json_encode($_SESSION['email']) . ' ></input>
                        <span class="addMessageSpan">[add message]</span>
                    <div id="addMessageToEmail" style="display: none;">
                    <textarea class="messageTextArea" name="message"></textarea>
                    </div>
                    </form>
              </div>';

echo $HtmlCode;
?>