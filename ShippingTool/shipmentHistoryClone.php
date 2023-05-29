<?php
/* * *
 * This clone of shipment history is the seque from the perosnal feed to the
 * delivery slip preview.
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/phpmailer/mailHelper.php";

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
        <title>Shipment History for Docket Number <?php echo $_GET['DocketNumber']; ?></title>

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End import of general stylesheets -->

        <link rel="stylesheet" type="text/css" href="/Intranet/ShippingTool/Stylesheets/shipping.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/ShippingTool/Stylesheets/shippingForm.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/HomePage/ShipFeed/shipFeed.css" />

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
        <script type="text/javascript" src="Scripts/shipping.js"></script>
        <script type="text/javascript">
            $(document).ready(function() {
                ShipEdit.launchHistory();
                var args = Helper.getArguments();
                SessId = parseInt(args["SessId"]);
                var target = $("form#" + SessId);
                console.log(target);
                console.log(SessId);
                target.submit();
        
            });
        </script>
    </head>
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span id="homeButton" class="menuButton"><a href="/Intranet">Home</a></span></li>
                <li><span class="menuButton"><a href="<?php echo "JobSummary.php?DocketNumber={$_GET['DocketNumber']}"; ?>">Order Summary</a></span></li>
                <li><span id="deliveryReportButton" class="menuButton">
                        <a href="<?php echo "quickDeliveryReport.php?DocketNumber={$_GET['DocketNumber']}"; ?>" target="_new">Delivery Report</a></span>
                </li>
            </ul>
        </div><!-- End of Menu Container -->
        <div id="wrapper">
            <div id="banner">
                <h2>Shipment Editor</h2>
            </div> <!-- end banner -->
            <div id="contentPane">
                <div id="slipContainer">
                        <form class="slipPrototype contentContainer" action="Forms/deliverySlip.php" method="post" style="display: none;">
                        <div id="productionData">
                            <input type="hidden" name="Docket_Number" value="<?php echo $_GET['DocketNumber']; ?>" />
                            <input type="hidden" id="Customer" name="Customer" />
                            <input type="hidden" id="Quote_Number" name="Quote_Number" />
                            <input type="hidden" id="Job_Name" name="Job_Name" />
                            <input type="hidden" id="Additional" name="Additional" />
                        </div><!-- end production data -->
                        <table id="slipTable">
                            <tbody>
                                <tr class="statusInfo">
                                    <td>
                                        <div id="shipFeed">
                                            <div id="shipFrame">
                                                <div id="ship">
                                                    <div class="ship">
                                                        <div class="leftPane">
                                                            <span class="timeIn"></span><br />
                                                            <span class="dateIn"></span>
                                                        </div>
                                                        <div class="rightPane">
                                                            <span class="timeOut"></span><br />
                                                            <span class="dateOut"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr/>
                                            <button onclick="ShipEdit.shipOutHelper(this.form, true)">Shipment Out</button>
                                            <button onclick="ShipEdit.shipOutHelper(this.form, false)">Unship</button>
                                            <hr/>
                                        </div>
                                    </td>

                                </tr><!-- End of status info (time in/out)-->
                                <tr class="formPrototype">
                                    <td>
                                        <input id="slipId" value="" name="SlipId[]" type="hidden"/>
                                        <div class="panelContainer">
                                            <div class="topPanel">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td><label for="Form">Form</label></td>
                                                            <td><input type="text" class="FormHistory" name="Form[]" /></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div><!-- end of top panel -->
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
                                        <hr/>
                                    </td>
                                </tr><!-- end of form prototype -->
                                <tr class="slipHistory">
                                    <td>
                                        <h4>Shipping Address</h4>
                                        <input name="showShipping" type="radio" value="Load" checked="checked" onclick="Shipping.toggleShippingAddress(false)" /> Load address from database<br/>
                                        <input name="showShipping" type="radio" value="Other" onclick="Shipping.toggleShippingAddress(true)" /> Other address<br/>
                                        <input name="showShipping" type="radio" value="None" onclick="Shipping.toggleShippingAddress(false)" /> Do not show<br/>
                                        <textarea name="Shipping_Address" id="Shipping_Address" class="ShippingAddress"></textarea><br/>
                                        <hr />
                                        <div id="ourAddress">
                                            <input name="hideAddress" type="checkbox" value="Yes"/>Hide ADC Address
                                        </div>
                                        <hr />
                                        <div id="labelPanel">
                                            <table>
                                                <tr>
                                                    <td>Label 1</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <textarea class="labelArea label1" name="label1"></textarea>
                                                    </td>                                          
                                                </tr>
                                                <tr>
                                                    <td>Label 2</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <textarea class="labelArea label2" name="label2"></textarea>
                                                    </td> 
                                                </tr>
                                            </table>
                                        </div><!-- end of label panel -->

                                        <hr />
                                    </td>                                         
                                </tr><!-- end of slip History row -->
                            </tbody>
                        </table><!-- end of slip table -->
                        <input id="print" class="print" value ="noo" name="print" type="hidden"/><!--Hidden input to print workorder-->
                        <input id="SessId" value="" type="hidden" name="SessId"></input><br/><!-- SessId Input-->
                        <input type="button" name="delete" value="Delete" id="deleteSlip" onclick="ShipEdit.deleteSlip(this.form)"></input><br/>
                        <input type="text" class="setDate" name="setDate" value="<?php date_default_timezone_set("America/Toronto");
echo date("Y-m-d"); ?>"/><br/>
                        Email Client PDF: <input type="text" name="clientEmail"/><br />
                        <select name="preloadedEmails">
                            <option value="" selected="selected"></option> 
                            <?php echoEmails($_GET['DocketNumber']); ?> 
                        </select>
                        <input type="submit" name="deliverySlip" value="Delivery Slip" id="deliverySlipButton" onclick="ShipEdit.showDeliverySlipHistory(this.form, 0)"></input>
                        <input type="submit" name="deliverySlip" value="Print Slip" id="deliverySlipButton" onclick="ShipEdit.showDeliverySlipHistory(this.form, 1)"></input>
                    </form><!-- end of slip form -->
                </div><!-- End of slip container -->
            </div> <!-- end content pane -->
        </div> <!-- end wrapper -->
    </body>
</html>
