<?php
/* * *****************************************************************************
 * This is the billing report file.
 * **************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
require 'formHelper.php';

function toEuroNumNotation($str) {
    $match = "/(\d)(?=(\d{3})+(\.\d\d)?($))/";
    return preg_replace($match, "$1,", $str);
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link href="forms.css" rel="stylesheet" type="text/css" media="screen, print" />
        <title>Billing Report</title>
        <!-- TODO add icon -->

        <style>
            #productionTable td {
                border: 1px solid #000;
            }

            #Job_Name {
                font-size: 1.3em;
                font-weight: bold;
            }

            .Quote_Number {
                font-size: 1.5em;
            }

            .Customer {
                font-size: 1.4em;
            }

            #jobInfo, table {
                border: 1px solid #000;
            }

            #jobInfo, #orderDetails {
                margin-bottom: 10px;
                padding: 10px;
            }

            .quoteInfo {
                margin-top: 30px;
                font-weight: bold;
                font-size: 1.4em;
                display: inline-block;
                float: right;
            }

            #banner {
                float: left;
                display: inline-block;
            }

            h2 {
                width: 100%;
                text-align: center;
            }

            .input {
                /*                border-bottom: 2px solid black;*/
            }

            #productionTable td, #productionTable th {
                text-align: center;
            }

            .total {
                font-weight: bold;
            }

            .noTable {
                display: block;
                text-align: center;
            }

            .Price {
                font-size: 1.4em;
                font-weight: bold;
                display: block;
                text-align: center;
                margin: 10px auto;
            }

            @media print {
                #shippingDetails{ page-break-before: always; }
            }


        </style>

    </head>
    <body>
        <div id="wrapper">
            <div class="quoteInfo">
                <div class='Quote_Number'>
                    <?php
                    $var = format_string("Docket Number");
                    echo isset($_POST[$var]) ? "Docket #$_POST[$var]" : "Docket number not set";
                    ?>
                </div>
                <div class="Customer">
                    <?php echo isset($_POST['Customer']) ? $_POST['Customer'] : ""; ?>
                </div>
            </div> <!-- end quote info -->

            <div id="banner">
                <h1>Billing</h1>
                <?php
                $arr = array("Customer PO Number", "Quote Number");

                foreach ($arr as $item) {
                    $var = format_string($item);
                    echo "$item - ";
                    echo isset($_POST[$var]) ? $_POST[$var] : "not set";
                    echo "<br>";
                }
                date_default_timezone_set("America/Toronto");
                echo date("Y-m-d");
                ?>
            </div> <!-- end banner -->

            <div id="content">
                <h2>Job Summary</h2>

                <div id="jobInfo">
                    <span id="Job_Name">
                        <?php
                        $var = format_string("Job Name");
                        echo isset($_POST[$var]) ? $_POST[$var] : "";
                        ?>
                    </span>
                    <br />
                    <?php echo isset($_POST['Finishing']) ? $_POST['Finishing'] : ""; ?>
                    <br />
                    <br /> <!-- for the space that was asked for -->
                    <?php
                    $var = format_string("Special Instructions");
                    echo isset($_POST[$var]) ? $_POST[$var] : "";
                    ?>
                </div><!-- end order summary -->

                <div id="shipmentSummary">
                    <h2>Shipment Summary</h2>

                    <?php
                    $reqTotal = 0;
                    $shipTotal = 0;
                    $diffTotal = 0;

                    if (isset($_POST["Summary_Form"]) && is_array($_POST["Summary_Form"])) {
                        $numForms = count($_POST["Summary_Form"]);
                    } else {
                        $numForms = 0;
                    }
                    ?>

                    <table>
                        <thead>
                            <tr>
                                <th>Form</th>
                                <th>Quantity Requested</th>
                                <th>Quantity Shipped</th>
                                <th>Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $arr = array("Summary_Form", "Quantity_Requested", "Quantity_Shipped", "Difference");

                            if ($numForms > 0) {
                                for ($i = 0; $i < $numForms; $i++) {
                                    echo "<tr>";

                                    foreach ($arr as $field) {
                                        switch ($field) {
                                            case "Quantity_Requested":

                                                if (isset($_POST[$field][$i]) && is_numeric($_POST[$field][$i])) {
                                                    $reqTotal += $_POST[$field][$i];
                                                }

                                                break;
                                            case "Quantity_Shipped":

                                                if (isset($_POST[$field][$i]) && is_numeric($_POST[$field][$i])) {
                                                    $shipTotal += $_POST[$field][$i];
                                                }

                                                break;
                                            case "Difference":
                                                if (isset($_POST[$field][$i]) && is_numeric($_POST[$field][$i])) {
                                                    $diffTotal += $_POST[$field][$i];
                                                }

                                                break;
                                        }

                                        echo "<td>{$_POST[$field][$i]}</td>";
                                    }

                                    echo "</tr>";
                                }
                            }
                            ?>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td class="total">Total</td>
                                <td class="total"><?php echo $reqTotal; ?></td>
                                <td class="total"><?php echo $shipTotal; ?></td>
                                <td class="total"><?php echo $diffTotal; ?></td>
                            </tr>
                        </tfoot>
                    </table>
                </div> <!-- end shipment summary -->

                <div class="Price">
                    <?php
                    $price = isset($_POST['Sold_For']) ? $_POST['Sold_For'] : 0;

                    $price = str_replace("$", "", $price);

                    if (is_numeric($price)) {
                        $price = round($price, 2);
                    } else {
                        $price = 0;
                    }

                    echo "Price before extras: $" . toEuroNumNotation($price);
                    ?>
                </div> <!-- end price -->

                <div id="extraCharges">
                    <h2>Extra Charges</h2>

                    <?php
                    if (isset($_POST["chargeName"]) && is_array($_POST["chargeName"])) {
                        $numCharges = count($_POST['chargeName']);
                    } else {
                        $numCharges = 0;
                        echo "";
                    }
                    ?>

                    <h3 class="noTable" style="<?php echo $numCharges > 0 ? "display: none;" : ""; ?>">No extra charges to display</h3>

                    <table style="<?php echo $numCharges === 0 ? "display: none;" : ""; ?>">
                        <thead>
                            <tr>
                                <th>Charge</th>
                                <th>Amount</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $arr = array("chargeName", "chargeAmt", "chargeNotes");

                            if ($numCharges > 0) {
                                for ($i = 0; $i < $numCharges; $i++) {
                                    echo "<tr>";

                                    foreach ($arr as $field) {
                                        $val = "not set";

                                        if (isset($_POST[$field]) && is_array($_POST[$field]) && isset($_POST[$field][$i])) {
                                            $val = $_POST[$field][$i];
                                        }

                                        echo "<td>{$val}</td>";
                                    }

                                    echo "</tr>";
                                }
                            }
                            ?>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td class="total">Total</td>
                                <td class="total">
                                    <?php
                                    $price = isset($_POST['totalExtra']) ? $_POST['totalExtra'] : 0;

                                    $price = str_replace("$", "", $price);

                                    if (is_numeric($price)) {
                                        $price = round($price, 2);
                                    } else {
                                        $price = 0;
                                    }

                                    echo "$" . $price;
                                    ?>
                                </td>
                                <td><!-- for spacing --></td>
                            </tr>
                        </tfoot>
                    </table>
                </div> <!-- end extra charges -->

                <div id="shippingDetails">
                    <h2>All Shipments</h2>

                    <?php
                    if (isset($_POST["Form"]) && is_array($_POST["Form"])) {
                        $numShipments = count($_POST["Form"]);
                    } else {
                        $numShipments = 0;
                    }
                    ?>

                    <h3 class='noTable' style="<?php echo $numShipments > 0 ? "display: none;" : ""; ?>">No shipments have been made</h3>

                    <table style="<?php echo $numShipments === 0 ? "display: none;" : ""; ?>">
                        <thead>
                            <tr>
                                <th>Form</th>
                                <th>Date</th>
                                <th>Quantity</th>
                                <th>Number of Skids</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $arr = array("Form", "Date", "Quantity", "Number_of_Skids");

                            for ($i = 0; $i < $numShipments; $i++) {
                                echo "<tr>";

                                foreach ($arr as $field) {
                                    $val = "not set";

                                    if (isset($_POST[$field]) && is_array($_POST[$field]) && isset($_POST[$field][$i])) {
                                        $val = $_POST[$field][$i];
                                    }

                                    echo "<td>{$val}</td>";
                                }

                                echo "</tr>";
                            }
                            ?>
                        </tbody>
                    </table>
                </div> <!-- end shipping details -->

                <span style="font-size: 0.4em; margin-top: 10px; display: block; text-align: center;">Albatross'd</span>
            </div><!-- end content -->
        </div><!-- end wrapper -->
    </body>
    <script type="text/javascript">
        window.print();
    </script><!-- End of auto print script -->
</html>
