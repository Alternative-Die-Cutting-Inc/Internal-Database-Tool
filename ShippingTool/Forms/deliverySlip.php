<?php

/* * ***************************************************************************
 * Rewritten by Peter Tran for Alternative Die Cutting, Inc.
 * Last updated Aug 31st, 2012 by Peter Tran
 * *****************************************************************************
 * This file creates the Delivery Slip information as a PDF.
 * It will do the following: prompt user to download, or email it to a the
 * email address given. It will always delete the PDF from the server.
 * ************************************************************************** */
ini_set('display_errors', 1);
error_reporting(0);
session_start();

/* * ***************************************************************************
 * ************************ IMPORTS ********************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require 'formHelper.php';
require_once("../../Resources/pdfcrowd/pdfcrowd.php");
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/phpmailer/mailHelper.php";


/* * ***************************************************************************
 * **************************** CONSTANTS **************************************
 * ************************************************************************ * */

if (parseDocketNumber($_POST['Docket_Number'])) {
    $dn = intval($_POST['Docket_Number']);
} else {
    $dn = -1;
}

if (isset($_POST['Customer'])) {
    $customer = $_POST['Customer'];
} else {
    $customer = "";
}

if (isset($_POST['Form']) && is_array($_POST['Form'])) {
    $numForms = count($_POST['Form']);
} else {
    $numForms = 0;
}

define("DocketNum", $dn);
define("Customer", $customer);
define("numForms", $numForms);

/* * ***************************************************************************
 * ******************************** FUNCTIONS **********************************
 * ************************************************************************** */

/**
 * Return true if the input is a valid integer, false otherwise.
 * Used for checking GET/POST variables.
 * TODO maybe make more general and move to another file.
 * @param mixed $num Input.
 */
function parseDocketNumber($num) {
    return isset($num) && $num !== null && $num !== "" &&
            is_numeric($num);
}

/**
 * Return the emails associated with the given company(via docket number) in html form as options
 * within a select.
 */
function returnEmails($docketNumber) {

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
    return $returnVal;
}

/**
 * Check the POST variable for the customer's name and the way in which to
 * display the shipping address. Print the address out accordingly.
 */
function printDeliveryAddress() {
    $customer = constant("Customer") === "" ? "unknown customer" : constant("Customer");
    $address = "";

    if (isset($_POST['showShipping'])) {
        switch ($_POST['showShipping']) {
            case "Load":
                $address = "{$customer}\n";
                $address .= loadCustomerAddress($customer);
                break;
            case "Other":
                if (isset($_POST["Shipping_Address"])) {
                    $address = $_POST["Shipping_Address"];
                }
                break;
            case "None":
            default:
                break;
        }
    }

    $address = str_replace("\n", "<br />", $address);

    return "$address<br />";
}

/**
 * Load the customer`s address from the database.
 * @param string $customer The customer's name.
 * @return string The customer's address.
 */
function loadCustomerAddress($customer) {
    $address = "";

    if (is_resource($link = connectToDatabase())) {
        $query = "SELECT CONCAT(Address, '\n', 
                City, ' ', Province, '\n', 
                PostalCode) 
                AS address 
                FROM Customers WHERE Customer='{$customer}'";


        if (($result = mysql_query($query))) {
            if (mysql_num_rows($result) > 0) {
                $row = mysql_fetch_row($result);
                $address = $row[0];
            }
        }

        disconnect($link);
    }

    return $address;
}

/* * ***************************************************************************
 * ************************** ECHO THE WEB PAGE ********************************
 * ************************************************************************** */
$HtmlCode = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" 
    \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";
$HtmlCode .= "<html xmlns=\"http://www.w3.org/1999/xhtml\">";

$HtmlCode .= '<head>
                <style>
                #mainInfo, #jobInfo, #shipmentDetails {
                border: 1px solid black;
                width: 100%;
                margin-bottom:20px;
                }
                
                #jobInfo {
                border: 1px solid black;
                text-align: center;
                padding-bottom: 5px;
                }
                
                #jobName {
                font-size: 16pt;
                font-weight: bold;
                }
                
                tr.row > td {
                padding-bottom: 1em;
                text-align: center;
                }
                </style>
                        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Stylesheets/previewEmailer.css" />
                <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
                <script type="text/javascript">
                $(document).ready(function() {
                $(".addMessageSpan").click(function () {
             
                    $("#addMessageToEmail").toggle();
                 });
                 window.open("../quickDeliveryReport.php?DocketNumber='.$dn.'", "_blank"); 
          });
            
        </script>
              </head>';

$HtmlCode .= "<body>";

// Echo the barcodes
if (isset($_POST['SessId'])) {
    $HtmlCode .= "<IMG SRC=\"../../Resources/Barcode/barcode.php?barcode=" . $_POST['SessId'] . "&width=320&height=50\">";
    $var = format_string("Docket Number");
    $HtmlCode .= "<IMG SRC=\"../../Resources/Barcode/barcode.php?barcode=" . $_POST[$var] . "&width=320&height=50\">";
}

$HtmlCode .= '<div id="wrapper">';

$showLogo = "";
if (isset($_POST['hideAddress']) &&
        ($_POST['hideAddress'] == 'Yes')) {
    $showLogo = "style=\"display:none\"";
}



$HtmlCode .= '  <div id="alternativeInfo"' . $showLogo . '>';
$HtmlCode .= '                          <table width="100%">
                        <tr>
                            <td>
                                <b>Alternative Die Cutting, Inc.</b>
                    <p>132 Alexdon Rd. Toronto ON M3J2B3 <br />
                        Tel: 416-748-6868 <br />
                        Fax: 416-748-0737 <br />
                        www.altdiecutting.com <br />
                    </p>
                                              
                            </td>
                            <td><h1>' . $dn . '<br>' . $customer . '</h1></td>
                        </tr>
                     </table>';
$HtmlCode .= '  </div>';




$qn = isset($_POST['Quote_Number']) ? "#{$_POST['Quote_Number']}" : " number not set";
date_default_timezone_set("America/Toronto");
$date = date("Y-m-d");
if (isset($_POST["setDate"])) {
    $date = $_POST['setDate'];
}
$contact = isset($_SESSION['name']) ? $_SESSION['name'] : " none set";
$shipAddress = printDeliveryAddress();
$customer = isset($_POST['Customer']) ? $_POST['Customer'] : "";
$HtmlCode .= '  <div id="mainInfo">
                    <table width="100%">
                        <tr>
                            <td>
                                Docket # ' . $dn . ' <br>
                                Company: ' . $customer . '<br>
                                Quote ' . $qn . '<br>
                                Date: ' . $date . '<br>
                                Contact: ' . $contact . '<br>
                            </td>
                            <td>';
if ($shipAddress != "<br />") {
    $HtmlCode .= 'Ship to:<br>' . $shipAddress;
}
$HtmlCode .= '              </td>
                        </tr>
                     </table>
                  </div>';
                  
                
 

$jobName = isset($_POST["Job_Name"]) ? $_POST["Job_Name"] : "";
$customerPoNo = isset($_POST["Customer_PO_Number"]) ? $_POST["Customer_PO_Number"] : "";
$additionalNotes = isset($_POST["Additional"]) ? $_POST["Additional"] : "";
$HtmlCode .= '  <div id="jobInfo">
                <div id="jobName">' . $jobName . '</div>
                    <br>Customer Po No: ' . $customerPoNo .
        '<br>';

                    
if ($additionalNotes != "") {
    $HtmlCode .= 'Notes:' . $additionalNotes;
}
$HtmlCode .= '
                </div>';

$HtmlCode .= '  <div id="shipmentDetails">
                    <table>
                        <thead>
                            <tr class="row">';
if (constant("numForms") > 0) {
    $headings = array("Form", "Qty", "No of Skids", "Notes", "Total");
    foreach ($headings as $label) {
        $HtmlCode .= "<th>{$label}</th>";
    }
}

$HtmlCode .= '              </tr>
                        </thead>
                        <tbody>';
$headings = array("Form", "Qty", "Skids", "Notes", "Total");
for ($i = 0; $i < $numForms; $i++) {
    if (!isset($_POST['Form']) || !is_array($_POST['Form']) || $_POST['Form'][$i] === "") {
        continue;
    }
    $HtmlCode .= "<tr class=\"row\">";

    $total = 0;
    foreach ($headings as $label) {
        switch ($label) {
            case "Qty":
                if (isset($_POST['Type'][$i])) {
                    $type = $_POST['Type'][$i];

                    if (isset($_POST[$type]) && is_array($_POST[$type]) && isset($_POST[$type][$i])
                            && parseDocketNumber($_POST[$type][$i])) {
                        $val = intval($_POST[$type][$i]);
                    } else {
                        $val = 0;
                    }

                    $total = intval($val);
                    $val .= " " . $type;

                    if ($type === "Cartons") {
                        if (parseDocketNumber($_POST['CartonPcs'][$i])) {
                            $pcPerCarton = intval($_POST['CartonPcs'][$i]);
                        } else {
                            $pcPerCarton = 0;
                        }

                        if (parseDocketNumber($_POST['CartonPtl'][$i])) {
                            $ptl = intval($_POST['CartonPtl'][$i]);
                        } else {
                            $ptl = 0;
                        }

                        $total = $total * $pcPerCarton + $ptl;
                        $val .= " $pcPerCarton pieces per carton";

                        if ($ptl !== 0) {
                            $val .= " and 1 partial of $ptl piece";

                            if ($ptl !== 1) {
                                $val .= "s";
                            }
                        }
                    }
                } else {
                    $val = "unknown type";
                }

                break;
            case "Total":
                $_POST["Total"][$i] = $total; //add total to post so I can pass POST as arg into database-writing function
                $val = $total;
                break;
            default:
                $var = format_string($label);

                if (isset($_POST[$var][$i])) {
                    $val = $_POST[$var][$i];
                } else {
                    $val = "";
                }

                break;
        } //end switching over labels
        $HtmlCode .= "<td>" . $val . "</td>";
    }
    $HtmlCode .= "              </tr>";
}
$HtmlCode .= '
                        </tbody>
                    </table>
                </div>';

if (($_POST["label1"] != "") || ($_POST["label2"] != "")) {

    $HtmlCode .='<div id="labels">
                <table border="1px solid black">
                    <tr>';
    if ($_POST["label1"] != "") {
        $HtmlCode .='
                        <td>' . nl2br($_POST["label1"]) . '
                        </td>';
    } 
    if ($_POST['label2'] != "") {
        $HtmlCode .='
                    
                        <td> ' . nl2br($_POST["label2"]) . '
                        </td>';
    }
    $HtmlCode .='</tr>
                </table>
                            </div>';
}
$HtmlCode .= '</div>';
$deliverySlipCode = $HtmlCode . "</body></html>";
$HtmlCode .= '<div id="emailer">
                    <form method="post" action="deliverySlipPreviewHelper.php">
                    Email Client PDF: <input id="inputEmail" type="text" name="clientEmail"/>
                    <select id="preloadedEmails" name="preloadedEmails">
                                            <option value="" selected="selected" /> 
                        ' . returnEmails($dn) . '
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
$HtmlCode .= "</body>
    </html>";
echo $HtmlCode;
?>  