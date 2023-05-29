<?php
/* * ***************************************************************************
 * Rewritten by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on August 3, 2011
 * ---------------------------------------------------------------------------
 * This page processes outgoing shipments and allows for editing those shipments
 * later, in case of error.
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

//authenticate user
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/phpmailer/mailHelper.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Shipping</title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End import of general stylesheets -->

        <link rel="stylesheet" type="text/css" href="Stylesheets/shipping.css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/helper.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>
        <!-- End import of general scripts -->

        <script type="text/javascript" src="Scripts/shipping.js"></script>

        <script type="text/javascript">
            $(document).ready(function() {
                Shipping.launch();
            });
        </script>
    </head>
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li>
                    <span id="deliverySlipButton" class="menuButton">Delivery Slip</span>
                    <span id="printDeliverySlipButton" class="menuButton"> [Print]</span>
                </li>
                <li><span id="homeButton" class="menuButton"><a href="/Intranet">Home</a></span></li>
                <li><span class="menuButton"><a href="<?php echo "JobSummary.php?DocketNumber={$_GET['DocketNumber']}"; ?>">Order Summary</a></span></li>
                <li><span class="menuButton" id="saveButton" onclick="Shipping.save()">Save</span></li>
                 <li><span id="deliveryReportButton" class="menuButton">
                        <a href="<?php echo "quickDeliveryReport.php?DocketNumber={$_GET['DocketNumber']}"; ?>" target="_new">Delivery Report</a></span>
               </li>
            </ul>
        </div>
        <div id="wrapper">
            <div id="banner">
                <h2>Shipping</h2>
            </div> <!-- end banner -->`
            <div id="progress" class="contentContainer">
                <div id="progMsg"><!-- auto-generated progress updates go here --></div>
                <img id="loadingImage" src="/Intranet/Resources/Images/loading_2.gif" alt="loading"></img>
            </div>

            <div id="contentPane">
                <form method="post" action="Forms/deliverySlip.php" target="_blank">
                    <div id="shipping" class="contentContainer">
                        <!-- all shipping input data goes here -->
                        <h2>Shipping Information</h2>
                        <div id="header" >
                            Email Client PDF: <input type="text" name="clientEmail"/>
                            <select name="preloadedEmails">
                                <option value="" selected="selected"></option> 
                                <?php echoEmails($_GET['DocketNumber']); ?> 
                            </select>
                            <hr />
                            <div id="address">
                                <h4>Shipping Address</h4>
                                <input name="showShipping" type="radio" value="Load" checked="checked" onclick="Shipping.toggleShippingAddress(false)" /> Load address from database
                                <input name="showShipping" type="radio" value="Other" onclick="Shipping.toggleShippingAddress(true)" /> Other address
                                <input name="showShipping" type="radio" value="None" onclick="Shipping.toggleShippingAddress(false)" /> Do not show
                                <textarea name="ShippingAddress" id="Shipping_Address" style="display: none;"></textarea>
                            </div>
                            <hr />
                            <div id="ourAddress">
                                <input name="hideAddress" type="checkbox" value="Yes"/>Hide ADC Address
                            </div>
                            <hr/>
                            <div id="notes">
                                <h4>Additional Notes</h4>
                                <textarea name="Additional" id="Additional"></textarea>
                            </div>
                            <hr />
                        </div> <!-- end header -->

                        <div id="formContainer">
                            <div id="labelPanel">
                                <table>
                                    <tr>
                                        <td>Label 1</td>
                                        <td>Label 2</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <textarea class="labelArea" name="label1"></textarea>
                                        </td>                                          
                                        <td>
                                            <textarea class="labelArea" name="label2"></textarea>
                                        </td>                                          
                                    </tr>
                                </table>
                            </div> <!-- end of label panel -->
                            <hr/>
                            <div id="controlPanel">
                                <button type="button" id="addFormButton">Add Form</button>
                                <button type="button" id="removeAllFormsButton">Remove All</button>
                            </div>

                            <div class="shippingForm prototype">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Form</th>
                                            <th># of Skids</th>
                                            <th>Notes</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <select name="Type[]" class="formType">
                                                    <option value="Cartons" selected="selected">Cartons</option>
                                                    <option value="Sheets">Sheets</option>
                                                    <option value="Pieces">Pieces</option>
                                                </select>
                                            </td>
                                            <td><input type="text" class="Form" name="Form[]" /></td>
                                            <td><input type="text" name="Skids[]" /></td>
                                            <td><input type="text" class="Notes" name="Notes[]" /></td>
                                            <td>
                                                <span class="removeFormButton">
                                                    <img src="/Intranet/Resources/Images/delete-icon.png" alt="X" height="20" width="20" />
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table> <!-- basic table -->

                                <div id="formInputs">
                                    <span class="Cartons formOpt">
                                        <span>Number of cartons:</span><input type="text" name="Cartons[]" size="6" /> 
                                        <span>Pcs per carton:</span><input type="text" name="CartonPcs[]" size="6" />
                                        <span>Partial:</span><input type="text" name="CartonPtl[]" size="5" />
                                    </span> 
                                    <span class="Sheets formOpt">
                                        <span>Number of sheets:</span><input type="text" name="Sheets[]" size="6" />
                                    </span>
                                    <span class="Pieces formOpt">
                                        <span>Number of pieces:</span><input type="text" name="Pieces[]" size="6" />
                                    </span>
                                </div>
                            </div> <!-- end shipping form prototype -->
                        </div> <!-- end form container -->
                        <hr />
                    </div> <!-- end shipping -->                    

                    <div id="production" class="contentContainer">
                        <h2>Production Information</h2>

                        <!-- all production loaded info goes here -->
                        <div id="productionOrderInfo" class="loadedInfo">
                            <!-- Production information goes here.
                            This includes docket number, job name, customer, etc.
                            Everything then becomes readonly. -->
                        </div>

                        <div id="productionFormInfo" class="loadedInfo" style="display: none;">
                            <h2>Pre-loaded Forms</h2>

                            <!-- Forms go in here and become readonly -->
                            <table>
                                <thead>
                                    <tr>
                                        <th>Form</th>
                                        <th>Qty</th>
                                        <th>Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="formRow prototype">
                                        <td>
                                            <input type="text" class="Form" name="Form[]" disabled="disabled" />
                                        </td>
                                        <td>
                                            <input type="text" class="Qty" name="Qty[]" disabled="disabled" />
                                        </td>
                                        <td>
                                            <input type="text" class="Notes" name="Notes[]" disabled="disabled" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <hr />
                        </div>
                    </div> <!-- end production -->                 
                    <input id="print" class="print" value ="noo" name="print" type="hidden"/><!--Hidden input to print-->
                    <input id="SessId" class="SessId" value ="0" name="SessId" type="hidden"/><!--Hidden input to add barcode of SessId-->
                </form>
            </div> <!-- end content pane -->
        </div> <!-- end wrapper -->
    </body>
</html>