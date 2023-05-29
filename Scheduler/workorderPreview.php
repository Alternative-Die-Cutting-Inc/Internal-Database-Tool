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
require '../ShippingTool/Forms/formHelper.php';
require "../ShippingTool/Backend/workOrderHelper.php";

//TODO replace with authentication include file
if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    header("Location: /Intranet/index.php");
    exit;
}

$DocketNumber = $_GET['DocketNumber'];
$query = "SELECT * FROM Production WHERE DocketNumber=".$DocketNumber;
$result = runQuery($query);
if ($row = mysql_fetch_array($result)) {
	$Customer = $row['Customer'];
	$CustomerPONO = $row['CustomerPoNo'];
	$QuoteNumber = $row['QuoteNumber'];
	$ProductionPerson = $row['ProductionPerson'];
	$Date = $row['Date'];
	$JobName = $row['JobName'];
	$Finishing = $row['Finishing'];
	$SpecialInstructions = $row['SpecialInstructions'];
}


?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Work Order</title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <link href="../ShippingTool/Forms/forms.css" rel="stylesheet" type="text/css" media="screen, print" />
        <link rel="stylesheet" type="text/css" href="../ShippingTool/Stylesheets/workOrder.css" />
    </head>
    <body>
        <div id="wrapper">
             <div class="quoteInfo">
                <div class='Quote_Number' align="right">
                    <?php
                    echo "<br>Docket #";
                    echo $DocketNumber;
                    echo "<br>";
                    ?>
                </div>
                <div class="Customer">
                    <?php echo $Customer; ?>
                </div>
            </div> <!-- end quote info -->
            <div id="banner">
                <h1>Work Order</h1>
                <?php                
                echo "Customer PO Number - " . $CustomerPONO . "<br>";
                echo "Quote Number - " . $QuoteNumber . "<br>";
                echo "Production Person - " . $ProductionPerson . "<br>";                                               
                ?>
            </div> <!-- end banner -->

             <div id="content">

                <h2>Job Summary</h2>

                <div id="jobInfo">
                    <span id="Job_Name">
                        <?php
                        echo $JobName;
                        ?>
                    </span>
                    <br />
                    <?php echo $Finishing; ?>
                    <br />
                    <br /> <!-- for the space that was asked for -->
                    <?php
                    echo $SpecialInstructions;
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
                    <table id="productionTable" style="display: table;">
                        <thead>
                            <tr>
                                <th>Form</th>
                                <th>Qty</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                                <?php
                                 $query = "SELECT * FROM Forms WHERE DocketNumber=" . $DocketNumber . " ORDER BY FormId";
                                 $result = runQuery($query);
                                 while ($row = mysql_fetch_array($result)) {
                                    $Name = $row['Form'];
                                    $Quantity = $row['Quantity'];
                                    $Notes = $row['Notes'];
                                    echo "<tr>
                                            <td>".$Name."
                                            </td>
                                            <td>".$Quantity."
                                            </td>
                                            <td>".$Notes."
                                            </td>
                                          </tr>";

                                 }                                  ?>                     
                        </tbody>
                    </table>
                </div> <!-- end order details -->
            </div> <!-- end content -->
        </div> <!-- end wrapper -->
    </body>
</html>

