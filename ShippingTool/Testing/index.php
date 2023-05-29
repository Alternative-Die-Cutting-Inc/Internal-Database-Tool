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

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/helper.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>
        <!-- End import of general scripts -->

        <script type="text/javascript" src="/Intranet/ShippingTool/Scripts/forms.js"></script>

        <script type="text/javascript" src="/Intranet/ShippingTool/Scripts/shipmentEditor.js"></script>

        <script type="text/javascript">
            $(document).ready(function() {
                ShipEdit.launch();
            });
        </script>

        <style>
            #wrapper {
                display: block;
                clear: both;
            }

            .checkboxCol {
                width: 100px;
                text-align: center;
            }

            #shipments {
                width: 1000px;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span class="menuButton" onclick="ShipEdit.save()">Save</span></li>
                <li><span class="menuButton" onclick="ShipEdit.showDeliverySlip()">Delivery Slip</span></li>
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
                    <input type="hidden" name="Docket_Number" value="<?php echo $_GET['DocketNumber']; ?>" />

                    <div id="shipments" class="contentContainer">
                        <h2>Shipments</h2>

                        <div id="controlPanel">
                            <button type="button" class="addButton">Add Shipment</button>
                            <button type="button" class="removeAllButton">Delete All Shipments</button>
                        </div>

                        <hr />

                        <div id="noShip">
                            <h3>No shipments have been made for this order</h3>
                        </div>

                        <div id="shipmentTable">
<!--             class="prototype"                -->
                            <div>
                                <div class="sideShipBox">
                                    <input type="checkbox" class="Include" name="Include[]" checked="checked" />
                                    <span class="removeButton">
                                        <img src="/Intranet/Resources/Images/delete-icon.png" alt="X" height="20" width="20" />
                                    </span>
                                </div>

                                <div class="topShipBox">
                                    <select class="Type" name="Type[]" class="Type">
                                        <option value="Cartons" selected="selected">Cartons</option>
                                        <option value="Sheets">Sheets</option>
                                        <option value="Pieces">Pieces</option>
                                    </select>
                                    <input type="text" class="Form" name="Form[]" />
                                    <input type="text" class="Number_of_Skids" name="Skids[]" />

                                </div> <!-- end ship top box -->

                                <div class="bottomShipBox">
                                    <input type="text" class="Quantity" name="Quantity[]" />
                                </div> <!-- end bottom ship box-->
                            </div> <!-- end prototype div -->
                        </div> <!-- end shipment table -->

                        <hr />
                    </div> <!-- end shipments -->
                </form>
            </div> <!-- end content pane -->
        </div> <!-- end wrapper -->
    </body>
</html>
