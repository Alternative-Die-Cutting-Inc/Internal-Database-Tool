<?php
/* * *
 * Edit shipments for the given quote number.
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);

//require "{$_SERVER['DOCUMENT_ROOT']}Intranet/Resources/Include/intranet_authentication.inc";

if (!isset($_GET['DocketNumber'])) {
    $_GET['DocketNumber'] = -1;
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Edit Shipment for Docket Number <?php echo $_GET['DocketNumber']; ?></title>

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End import of general stylesheets -->

        <link rel="stylesheet" type="text/css" href="/Intranet/ShippingTool/Stylesheets/shipping.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/ShippingTool/Stylesheets/shippingForm.css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/helper.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>
        <!-- End import of general scripts -->

        <script type="text/javascript" src="Scripts/forms.js"></script>
        <script type="text/javascript" src="Scripts/shipmentEditor.js"></script>

        <script type="text/javascript">

            $(document).ready(function() {
                ShipEdit.launch();
            });
        </script>
    </head>
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span class="menuButton" onclick="ShipEdit.save()">Save</span></li>
                <li>
                    <span class="menuButton" onclick="ShipEdit.showDeliverySlip(0)">Delivery Slip</span>
                    <span class="menuButton" onclick="ShipEdit.showDeliverySlip(1)"> [print]</span>
                </li>
                <li><span id="homeButton" class="menuButton"><a href="/Intranet">Home</a></span></li>
                <li><span class="menuButton"><a href="<?php echo "JobSummary.php?DocketNumber={$_GET['DocketNumber']}"; ?>">Order Summary</a></span></li>
            </ul>
        </div>

        <div id="wrapper">
            <div id="banner">
                <h2>Shipment Editor</h2>
            </div> <!-- end banner -->

            <div id="progress" class="contentContainer">
                <div id="progMsg"><!-- auto-generated progress updates go here --></div>
                <img id="loadingImage" src="/Intranet/Resources/Images/loading_2.gif" alt="loading"></img>
            </div>

            <div id="contentPane">
                <form method="post" action="Forms/deliverySlip.php" target="_blank">

                    <div id="productionData">
                        <input type="hidden" name="Docket_Number" value="<?php echo $_GET['DocketNumber']; ?>" />
                        <input type="hidden" id="Customer" name="Customer" />
                        <input type="hidden" id="Quote_Number" name="Quote_Number" />
                        <input type="hidden" id="Job_Name" name="Job_Name" />
                        <input type="hidden" id="Additional" name="Additional" />
                    </div>
                    <div id="shipmentContainer">
                        <div id="controlPanel" class="contentContainer">
                            <hr />

                            <button type="button" class="addButton">Add Shipment</button>
                            <button type="button" class="removeAllButton">Delete All Shipments</button>

                            <hr />

                            <!--                            <h3>Select the Slip you wish to see</h3>
                            
                                                        <div id="showSlipButtons">
                                                            <label for="showSlip">Show shipment 1</label>
                                                            <input type="radio" class="showSlip" name="showSlip" value="1" />
                                                            <label for="showSlip">Show shipment 2</label>
                                                            <input type="radio" class="showSlip" name="showSlip" value="2" />
                                                            <label for="showSlip">Show shipment 3</label>
                                                            <input type="radio" class="showSlip" name="showSlip" value="3" />
                                                        </div>  end show slip buttons 
                            
                                                        <hr />-->
                        </div> <!-- end control panel -->

                        <div id="noShip" class="contentContainer">
                            <hr />
                            <h2>There are no shipments to display</h2>
                            <hr />
                        </div>

                        <table id="shipmentTable">
                            <tbody>
                                <tr class="prototype">
                                    <td>
                                        <div class="shipment contentContainer">
                                            <hr />

                                            <div class="panelContainer">
                                                <div class="topPanel">
                                                    <div class="topMiddlePanel">
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td><label for="Form">Form</label></td>
                                                                    <td><input type="text" class="Form" name="Form[]" /></td>
                                                                </tr>
                                                                <tr>
                                                                    <td><label for="Date">Delivered On</label></td>
                                                                    <td><input type="text" class="Date" name="Date[]" /></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div> <!-- end top middle panel -->

                                                    <div class="topRightPanel">
                                                        <label for="shipmentNumber">Shipment Number</label>
                                                        <input type="text" name="ShipmentNumber" class="ShipmentNumber" />
                                                    </div> <!-- end top right panel -->
                                                </div>

                                                <hr />

                                                <div class="leftPanel">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <label for="include">Show in Delivery Slip</label>
                                                                </td>
                                                                <td>
                                                                    <input type="checkbox" class="include" checked="checked"/>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <label for="delete">Delete</label>
                                                                </td>
                                                                <td>
                                                                    <span class="removeButton">
                                                                        <img src="/Intranet/Resources/Images/delete-icon.png" alt="X" height="20" width="20" />
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div> <!-- left panel -->

                                                <div class="centerPanel">
                                                    <table>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <label for="type">Type</label>
                                                                </td>
                                                                <td>
                                                                    <select class="Type" name="Type[]">
                                                                        <option value="Sheets">Sheets</option>
                                                                        <option value="Cartons" selected="selected">Cartons</option>
                                                                        <option value="Pieces">Pieces</option>
                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <label for="numSkids"># of Skids</label>
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="Number_of_Skids" name="Skids[]" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <label for="notes">Notes</label>
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="Notes" name="Notes[]" />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div> <!-- end center panel -->

                                                <div class="rightPanel">
                                                    <table>
                                                        <tbody>
                                                            <tr class="piecesOnly typeSwitch">
                                                                <td>
                                                                    <label for="numPieces"># of Pieces</label>
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="NoOfPcs" name="Pieces[]" />
                                                                </td>
                                                            </tr>
                                                            <tr class="sheetsOnly typeSwitch">
                                                                <td>
                                                                    <label for="numSheets"># of Sheets</label>
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="NoOfSheets" name="Sheets[]" />
                                                                </td>
                                                            </tr>
                                                            <tr class="cartonsOnly typeSwitch">
                                                                <td>
                                                                    <label for="cartonPcs">Pieces per Carton</label>
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="Qty" name="CartonPcs[]" />
                                                                </td>
                                                            </tr>
                                                            <tr class="cartonsOnly typeSwitch">
                                                                <td>
                                                                    <label for="numCartons"># of Cartons</label>
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="Ctns" name="Cartons[]" />
                                                                </td>
                                                            </tr>
                                                            <tr class="cartonsOnly typeSwitch">
                                                                <td>
                                                                    <label for="partial">Partial</label>
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="Part" name="CartonPtl[]" />
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div> <!-- end right panel -->
                                            </div> <!-- end panel container -->

                                            <hr />
                                        </div> <!-- end shipment -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div> <!-- end shipment container -->
                    <input id="print" class="print" value ="noo" name="print" type="hidden"/><!--Hidden input to print workorder-->
                </form>
            </div> <!-- end content pane -->
        </div> <!-- end wrapper -->
    </body>
</html>
