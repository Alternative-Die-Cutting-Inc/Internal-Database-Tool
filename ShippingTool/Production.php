<?php
/* * ***************************************************************************
 * Rewritten by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated August 2, 2011
 * ---------------------------------------------------------------------------
 * The page for filling out production information for a job.
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


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Production</title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End import of general stylesheets -->

        <link rel="stylesheet" type="text/css" href="Stylesheets/production.css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/helper.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>
        <!-- End import of general scripts -->

        <script type="text/javascript" src="Scripts/forms.js"></script>
        <script type="text/javascript" src="Scripts/production.js"></script>

        <script type="text/javascript">
            $(document).ready(function() {
                Production.launch();
            });
        </script>
    </head>

    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span id="saveButton" class="menuButton">Save <a href="<?php echo "JobSummary.php?DocketNumber=" . $_GET['DocketNumber']; ?>">[& close]</a></span></li>
                <li>
                    <span id="workorderButton" class="menuButton" onclick="Production.showWorkOrder(0)">Work Order</span>
                    <span id="workorderButton" class="menuButton" onclick="Production.showWorkOrder(1)"> [Print]</span>
                </li>
                <li><span id="homeButton" class="menuButton"><a href="/Intranet">Home</a></span></li>
                <li><span class="menuButton"><a href="<?php echo "JobSummary.php?DocketNumber=" . $_GET['DocketNumber']; ?>">Order Summary</a></span></li>
                <li>
                    <span class="menuButton">
                        <form method="get" action="../Production/DocketVariance.php">
                            <input placeholder="Variance" type="hidden" name="docket_number" value='<?php echo $_GET['DocketNumber']; ?>'/>
                            <input type="submit" value="Variance">
                        </form>
                    </span>
                </li>
            </ul>
        </div> <!-- end menu -->

        <div id="wrapper">
            <div id="banner">
                <h2>Production</h2>
            </div>

            <div id="progress" class="contentContainer">
                <div id="progMsg"><!-- progress dynamically added here --></div>
                <img id="loadingImage" src="/Intranet/Resources/Images/loading_2.gif" alt="loading" />
            </div>

            <div id="contentPane">
                <form method="post" action="Forms/WorkOrder.php" target="_blank">
                    <div id="header" class="contentContainer">
                        <!-- header automatically loaded into here from XML -->
                    </div>

                    <div id="formContainer" class="contentContainer">
                        <hr />

                        <div class="controlPanel">
                            <div id="qtyContainer">
                                <label for="qty">Quantity</label>
                                <input type="text" name="Quantity" id="qty" readonly="readonly" />
                            </div>

                            <hr />

                            <input type="text" id="numForms" name="numForms" />
                            <button type="button" id="genFormsButton">Generate Forms</button>
                            <button type="button" class="addButton">Add Form</button>
                            <button type="button" class="removeAllButton">Remove All</button>
                        </div>

                        <hr />

                        <div id="noForm">
                            <h3>No forms to display</h3>
                        </div>

                        <table id="formTable" style="display: none;">
                            <thead>
                                <tr>
                                    <th>Form</th>
                                    <th>Qty</th>
                                    <th>Notes</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="formRow prototype">
                                    <td>
                                        <input type="text" class="Form" name="Form[]" />
                                    </td>
                                    <td>
                                        <input type="text" class="Qty" name="Qty[]" />
                                    </td>
                                    <td>
                                        <input type="text" class="Notes" name="Notes[]" />
                                    </td>
                                    <td>
                                        <span class="removeButton">
                                            <img src="/Intranet/Resources/Images/delete-icon.png" alt="X" height="20" width="20" />
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <hr />
                    </div> <!-- end form container -->


                    <div id="extraChargeContainer" class="contentContainer">
                        <hr />

                        <div class="controlPanel">
                            <label for="totalExtraCharges">Total Extra Charges:</label>
                            <input type="text" name="totalExtra" id="totalExtraCharges" />

                            <button type="button" class="addButton">Add Charge</button>
                            <button type="button" class="removeAllButton">Remove All</button>
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
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="chargesRow prototype">
                                    <td><input type="text" class="chargeName" name="chargeName[]" /></td>
                                    <td><input type="text" class="chargeAmt" name="chargeAmt[]" /></td>
                                    <td><input type="text" class="chargeNotes" name="chargeNotes[]" /></td>
                                    <td>
                                        <span class="removeChargeButton">
                                            <img src="/Intranet/Resources/Images/delete-icon.png" class="removeButton" alt="X" height="20" width="20" />
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <hr />
                    </div> <!-- end extra charge container -->
                    <input id="print" class="print" value ="noo" name="print" type="hidden"/><!--Hidden input to print workorder-->
                </form>
            </div> <!-- end content pane -->
        </div> <!-- end wrapper -->
    </body>
</html>
