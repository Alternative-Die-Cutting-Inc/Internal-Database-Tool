<?php
/* * ***************************************************************************
 * This is a copy and past of JobSummary.php but Summary.showDeliveryReport is 
 * shown immediately on load. This was made to quickly access the delivery report
 * from pages besides job summary. 
 * ******************************************************************************
 * This page is responsible for keeping track of an order.
 * Shipment are summarized here.
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

//authenticate user
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";

//this is used later
if (!isset($_GET['DocketNumber'])) {
    $_GET['DocketNumber'] = -1;
}
?>

<!DOCTYPE html PUBLIC "-//W3C//Dth XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/Dth/xhtml1-transitional.dth">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Job Summary</title>

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End import of general stylesheets -->

        <link rel="stylesheet" type="text/css" href="Stylesheets/jobsummary.css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/helper.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>
        <!-- End import of general scripts -->

        <script type="text/javascript" src="Scripts/forms.js"></script>
        <script type="text/javascript" src="Scripts/jobsummary.js"></script>

        <script type="text/javascript">
            $(document).ready(function() {
                Summary.launch();
                Summary.showDeliveryReport(0);
                setTimeout(
                    function() 
                    {
                        window.close();
                    }, 1000);
                // window.close();
            });
            
            function closeDocket() {
                Summary.closeOrder();
                Summary.showReport('billingPrint');
            }
            
            
        </script>
    </head>
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span class="menuButton"><a href="/Intranet">Home</a></span></li>
                <li>
                    <span class="menuButton" onclick="Summary.showDeliveryReport(0)">Delivery Report</span>
                    <span class="menuButton" onclick="Summary.showDeliveryReport(1)"> [Print]</span>
                </li>
                <li>
                    <span class="menuButton" onclick="Summary.showReport('billing')">Billing Report</span>
                    <span class="menuButton" onclick="Summary.showReport('billingPrint')">[Print]</span>
                </li>
                <li><span class="menuButton"><a href="<?php echo "Production.php?DocketNumber=" . $_GET['DocketNumber']; ?>">Production</a></span></li>
                <li><span class="menuButton"><a href="<?php echo "shipping.php?DocketNumber=" . $_GET['DocketNumber']; ?>">New Shipment</a></span></li>
                <li><span class="menuButton"><a href="<?php echo "editShipments.php?DocketNumber={$_GET['DocketNumber']}"; ?>">Edit Shipments</a></span></li>
                <li><span class="menuButton"><a href="<?php echo "shipmentHistory.php?DocketNumber={$_GET['DocketNumber']}"; ?>">Shipment History</a></span></li>
            </ul>
        </div> <!-- end menu container -->

        <div id="wrapper">
            <div id="banner">
                <h1>Job Summary</h1>
            </div><!-- End of banner -->

            <div id="progress" class="contentContainer">
                <div id="progMsg"><!-- auto-generated progress reports go here --></div>
                <img id="loadingImage" src="/Intranet/Resources/Images/loading_2.gif" alt="loading" />
            </div> <!-- end progress -->

            <div id="contentPane">
                <form method="post" action="Forms/deliveryReport.php" target="_blank">
                    <div id="header" class="contentContainer">
                        <div id="orderInfo">
                            <h2>Order Information</h2>
                            <div id="flagPanel" style="display: none;">
                                <h3 class="warning">This quote has been flagged</h3>
                            </div>

                            <!-- auto-generated fields go here -->
                        </div> 
                    </div> <!-- end header -->

                    <div id="extraChargeContainer" class="contentContainer">
                        <hr />

                        <div class="controlPanel">
                            <label for="totalExtraCharges">Total Extra Charges:</label>
                            <input type="text" name="totalExtra" id="totalExtraCharges" />
                        </div> <!-- end control panel -->

                        <hr />

                        <div id="noCharge">
                            <h3>No extra charges to display</h3>
                        </div>

                        <table id="extraChargesTable" style="display: none;">
                            <thead>
                                <tr>
                                    <th>Charge</th>
                                    <th>Amount</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="chargesRow prototype">
                                    <td><input type="text" class="chargeName" name="chargeName[]" /></td>
                                    <td><input type="text" class="chargeAmt" name="chargeAmt[]" /></td>
                                    <td><input type="text" class="chargeNotes" name="chargeNotes[]" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div> <!-- end extra charge container -->

                    <div id="shipments" class="contentContainer">
                        <h2>Shipments</h2>

                        <h3>Summary</h3>
                        <hr />

                        <div class="noship">
                            <h4>No shipments to display</h4>
                        </div>

                        <table id="summaryTable">
                            <thead>
                                <tr>
                                    <th>Form</th>
                                    <th>Last Shipment Date</th>
                                    <th>Quantity Requested</th>
                                    <th>Quantity Shipped</th>
                                    <th>Difference</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="summaryRow prototype">
                                    <td><input type="text" class="summary_form" name="Summary_Form[]" /></td>
                                    <td><input type="text" class="last_ship_date" name="Last_Shipment_Date[]" /></td>
                                    <td><input type="text" class="qty_req" name="Quantity_Requested[]" /></td>
                                    <td><input type="text" class="qty_ship" name="Quantity_Shipped[]" /></td>
                                    <td><input type="text" class="ship_diff" name="Difference[]" /></td>
                                </tr>
                                <!-- this template is copied here -->
                            </tbody>
                        </table>

                        <hr />

                        <h3>Details</h3>

                        <div>
                            <span id="hideShipDetails">
                                Shipment details are hidden.
                            </span>

                            <span id="toggleDetailsButton" onclick="Summary.toggleShipDetails()">Show</span>
                        </div>

                        <div id="shipDetails" style="display: none;">
                            <div class="noship">
                                <h4>No shipments to display</h4>
                            </div>

                            <table id="shipmentsTable" style="display: none;">
                                <thead>
                                    <tr>
                                        <th>Form</th>
                                        <th>Date</th>
                                        <th>Quantity</th>
                                        <th>Number of Skids</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="shipRow prototype">
                                        <td><input type="text" class="Form" name="Form[]" /></td>
                                        <td><input type="text" class="Date" name="Date[]" /></td>
                                        <td><input type="text" class="Quantity" name="Quantity[]" /></td>
                                        <td><input type="text" class="Number_of_Skids" name="Number_of_Skids[]" /></td>
                                    </tr>

                                    <!-- above row is copied further here -->
                                </tbody>
                            </table>
                        </div> <!-- end shipment details -->

                        <hr/>
                    </div> <!-- end shipments -->
                    <input id="print" class="print" value ="noo" name="print" type="hidden"/><!--Hidden input to print workorder-->

                </form>
            </div> <!-- end content pane -->

            <div id="actions" class="contentContainer">
                <h2>Actions</h2>
                <hr />
                <div id="closeOrder">
                    <p>This docket is <span id="Status">unknown....</span>

                        <span id="closeJobButton" onclick="closeDocket()">Close</span>
                        <span id="deleteJobButton" onclick="Summary.deleteOrder()">Delete</span>
                    </p>
                </div>

                <p>Next step: <span id="nextStep">incinirator</span></p>
                <p>The person responsible for this job is <span id="respPerson">Jesus</span></p>
                <hr />
            </div> <!-- end actions -->
        </div><!-- end wrapper -->
    </body>
</html>
