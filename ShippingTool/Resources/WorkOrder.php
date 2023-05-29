<?php
/* * ***************************************************************************
 * Rewritten by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated August 2, 2011
 * ----------------------------------------------------------------------------
 * This is a work order form. It displays the work order for printing to send
 * to production.
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
require 'formHelper.php';
require "../Backend/workOrderHelper.php";

//TODO replace with authentication include file
if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    header("Location: /Intranet/index.php");
    exit;
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Work Order</title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <link href="forms.css" rel="stylesheet" type="text/css" media="screen, print" />

        <!-- TODO add icon -->

        <link rel="stylesheet" type="text/css" href="../Stylesheets/workOrder.css" />
    </head>

    <body>
        <div id="wrapper">
            <div class="quoteInfo">
                <div class='Quote_Number' align="right">
                    <?php
                    $var = format_string("Docket Number");
                    echo isset($_POST[$var]) ? "<IMG SRC=\"../../Resources/Barcode/barcode.php?barcode=$_POST[$var]&width=320&height=50\">" : "Docket number not set";
                    echo "<br>Docket #";
                    echo $_POST[$var];
                    echo "<br>";
                    ?>
                </div>
                <div class="Customer">
                    <?php echo isset($_POST['Customer']) ? $_POST['Customer'] : ""; ?>
                </div>
            </div> <!-- end quote info -->

            <div id="banner">
                <h1>Work Order</h1>
                <?php
                $arr = array("Customer PO Number", "Quote Number", "Production Person");

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

                <?php
                if (isset($_POST['Form']) && is_array($_POST['Form'])) {
                    $numForms = count($_POST['Form']);
                } else {
                    $numForms = 0;
                }

                $headings = array('Form', 'Qty', 'Notes', 'Qty Run', 'Pressman');
                $error_string = "ERROR - NOT SET";
                ?>

                <h2 style="<?php echo $numForms === 0 ? "display: none;" : ""; ?>">Order Specs</h2>

                <div id="orderDetails">
                    <table id="productionTable" style="<?php echo $numForms === 0 ? "display: none;" : "display: table;"; ?>">
                        <thead>
                            <tr>
                                <?php
                                foreach ($headings as $label) {
                                    echo "<th>$label</th>";
                                }
                                ?>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            for ($i = 0; $i < $numForms; $i++) {
                                echo "<tr>";

                                foreach ($headings as $label) {
                                    if ($label === 'Qty Run' || $label === "Pressman") {
                                        //for the quantity run, I want to leave a good amt. of room
                                        $space = 20;
                                        $val = "";

                                        for (; $space > 0; $space--) {
                                            $val .= "&nbsp";
                                        }

                                        $class = "class='input'";
                                    } else {
                                        $var = format_string($label);

                                        if (isset($_POST[$var]) && is_array($_POST[$var]) && isset($_POST[$var][$i])) {
                                            $val = $_POST[$var][$i];
                                        } else {
                                            $val = "$var [$i] - " . $error_string;
                                        }

                                        $class = "";
                                    }

                                    echo "<td $class>$val</td>";
                                }

                                echo "</tr>";
                            }
                            ?>
                        </tbody>
                    </table>
                </div> <!-- end order details -->
                <div id="extraInformation">
                    <div id="dueDate">
                        <label>Due Date:</label>
                        <?php echoFromDueDate($_POST["Docket_Number"], "DueDate"); ?>
                    </div>
                    <div id="dieNumber">
                        <label>Die Number:</label>
                        <?php echoFromDueDate($_POST['Docket_Number'], "DieNumber") ?>
                    </div><!-- div#dieNumber-->
                    <div id="memo">
                        <label>Memo:</label>
                        <?php echoFromDueDate($_POST['Docket_Number'], "Memo") ?>
                    </div><!-- div#dieNumber-->
                    <table width=100%>
                        <tr>
                            <td width=10%>Operator:</td>
                            <td width=40% style='border-bottom:solid 2px #000;'>&nbsp;</td>
                        </tr>
                        <tr>
                            <td width=10%>Press:</td>
                            <td width=40% style='border-bottom:solid 2px #000;'>&nbsp;</td>
                        </tr>
                    </table>
                    <table width=100%>
                        <tr>
                            <td width=10%>Notes:</td>
                        </tr>
                        <tr>
                            <td width=90% style='border-bottom:solid 2px #000;'>&nbsp;</td>
                        </tr>
                        <tr>
                            <td width=90% style='border-bottom:solid 2px #000;'>&nbsp;</td>
                        </tr>
                        <tr>
                            <td width=90% style='border-bottom:solid 2px #000;'>&nbsp;</td>
                        </tr>
                        <tr>
                            <td width=90% style='border-bottom:solid 2px #000;'>&nbsp;</td>
                        </tr>
                    </table>
                    <!-- Add Operator, Press and Notes with lines. -->
                </div><!-- div#extraInformation -->
            </div> <!-- end content -->


            
        </div> <!-- end wrapper -->
        <?php
        if ($_POST["print"] === "yes") {
            echo "<script>window.print();window.close();</script>";
        }
        ?>
    </body>
</html>

