<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start(); //this seems to fix anonymous bug on feedback page
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Delivery Report</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link href="forms.css" rel="stylesheet" type="text/css" media="screen, print" />

        <?php require 'formHelper.php'; ?>

    </head>
    <body>
        <div id="wrapper">
            <div id="header">
                <div id="logo">
                    <img src="/Intranet/Resources/Images/alt_logo.gif" alt="Alternative Logo" />
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
                    <h3 class="bar">Created For</h3>
                    <p>
                        <?php
                        $arr = array('Production Person', 'Customer');
                        foreach ($arr as $item) {
                            $var = format_string($item);
                            $val = isset($_POST[$var]) ? $_POST[$var] : "ERROR - NOT SET";
                            echo "$val<br />";
                        }
                        ?>
                    </p>
                </div>

                <div id="quoteInfo">
                    <h3 class="bar">Order Information</h3>
                    <p>
                        <?php
                        $qn = isset($_POST[format_string("Docket Number")]) ? "#" . $_POST[format_string("Docket Number")] : "number not set";
                        date_default_timezone_set("America/Toronto");
                        $date = date("Y-m-d");
                        echo "Docket $qn <br />";
                        echo "$date<br />";
                        ?>
                    </p>
                </div>

                <div id="jobInfo">
                    <p><?php
                        $arr = array('Job Name');
                        foreach ($arr as $item) {
                            $var = format_string($item);
                            $val = isset($_POST[$var]) ? $_POST[$var] : "ERROR - NOT SET";
                            echo "$val<br />";
                        }
                        ?>
                    </p>
                </div>

                <div id="orderDetails">
                    <div id="shipSummary">
                        <?php
                        $var = format_string("Summary Form");

                        if (isset($_POST[$var]) && is_array($_POST[$var])) {
                            $numForms = count($_POST[$var]);
                        } else {
                            $numForms = 0;
                        }
                        ?>

                        <h2 class="bar" style="<?php echo $numForms === 0 ? "display: none;" : "display: block;" ?>">Shipment Summary</h2>

                        <table style="<?php echo $numForms === 0 ? "display: none;" : "display: table;" ?>">
                            <?php
                            $headings = array("Summary Form",
                                "Last Shipment Date",
                                "Quantity Requested",
                                "Quantity Shipped",
                                "Difference");

                            $errorString = "not set";
                            ?>

                            <thead>
                                <tr>
                                    <?php
                                    foreach ($headings as $heading) {
                                        if ($heading === "Summary Form") {
                                            $heading = "Form";
                                        }

                                        echo "<th>$heading</th>";
                                    }
                                    ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                for ($i = 0; $i < $numForms; $i++) {
                                    echo "<tr>";

                                    foreach ($headings as $heading) {
                                        $var = format_string($heading);

                                        if (isset($_POST[$var]) && is_array($_POST[$var]) && isset($_POST[$var][$i])) {
                                            $val = $_POST[$var][$i];
                                        } else {
                                            $val = $errorString;
                                        }

                                        echo "<td>$val</td>";
                                    } //end listing column rows

                                    echo "</tr>";
                                } //end counting forms
                                ?>

                            </tbody>
                        </table>
                    </div><!--  end shipment summary -->



                    <div id="shipDetails">
                        <?php
                        $var = format_string("Form");

                        if (isset($_POST[$var]) && is_array($_POST[$var])) {
                            $numForms = count($_POST[$var]);
                        } else {
                            $numForms = 0;
                        }
                        ?>
                        <h2 class="bar" style="<?php echo $numForms === 0 ? "display: none;" : "display: block;" ?>">Shipment Details</h2>

                        <table style="<?php echo $numForms === 0 ? "display: none;" : "display: table;" ?>">
                            <?php
                            $headings = array("Form",
                                "Date",
                                "Quantity",
                                "Number of Skids");

//XXX maybe say type here as well (carton, pcs, etc.)

                            $errorString = "not set";
                            ?>
                            <thead>
                                <tr>
                                    <?php
                                    foreach ($headings as $heading) {
                                        echo "<th>$heading</th>";
                                    }
                                    ?>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                for ($i = 0; $i < $numForms; $i++) {
                                    echo "<tr>";

                                    foreach ($headings as $heading) {
                                        $var = format_string($heading);

                                        if (isset($_POST[$var]) && is_array($_POST[$var]) && isset($_POST[$var][$i])) {
                                            $val = $_POST[$var][$i];
                                        } else {
                                            $val = $errorString;
                                        }

                                        echo "<td>$val</td>";
                                    } //end listing column rows

                                    echo "</tr>";
                                } //end counting forms
                                ?>
                            </tbody>
                        </table>
                    </div> <!-- end shipment details -->
                </div> <!-- end order details -->
            </div> <!-- end content -->
            <?php
            if ($_POST["print"] === "yes") {
                echo "<script>window.print();window.close();</script>";
            }
            ?>
        </div> <!-- end wrapper -->
    </body>
</html>
