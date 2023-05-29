<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require "{$_SERVER['DOCUMENT_ROOT']}Intranet/Resources/Include/intranet_authentication.inc";
require "intranet_mgmt_auth.php";

authenticateMgmt();
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Administration Main Page</title>

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End import of general stylesheets -->

        <link rel="stylesheet" type="text/css" href="admin.css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/helper.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>
        <!-- End import of general scripts -->

        <!--      TODO add forms to general resources  -->
        <script type="text/javascript" src="/Intranet/ShippingTool/Scripts/forms.js"></script>
        <script type="text/javascript" src="Scripts/mgmtReport.js"></script>

        <script type="text/javascript">
            $(document).ready(function() {
            Management.launch();
            });
        </script>
    </head>
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span class="menuButton"><a href="/Intranet">Home</a></span></li>
                <li><span class="menuButton" onclick="Management.showPrintVersion()">Print-friendly Version</span></li>
            </ul>
        </div> <!-- end menu container -->

        <div id="wrapper">
            <div id="banner">
                <h1>Full Order Summary</h1>
            </div>

            <div id="progress" class="contentContainer">
                <div id="progMsg"><!-- auto-generated progress reports go here --></div>
                <img id="loadingImage" src="/Intranet/Resources/Images/loading_2.gif" alt="loading" />
            </div> <!-- end progress -->

            <div id="contentPane">
                <div id="jobList" class="contentContainer">
                    <hr />

                    <h2>Open Jobs for <span class="month">this month</span></h2>

                    <div id="openJobContainer">
                        <form method="post" action="Forms/adminReport.php" target="_blank">
                            <div id="noJobs">
                                <h3>No jobs to display for <span class="month">this month</span></h3>
                            </div>

                            <table style="display: none;" id="openJobTable">
                                <thead>
                                    <tr>
                                        <th>Docket Number</th>
                                        <th>Date Opened</th>
                                        <th>Customer</th>
                                        <th>Job Name</th>
                                        <th>Sold For</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="prototype">
                                        <td>
                                            <input type="text" class="DocketNumber" name="Docket_Number[]" />
                                        </td>
                                        <td>
                                            <input type="text" class="DateOpened" name="Date_Opened[]" />
                                        </td>
                                        <td>
                                            <input type="text" class="Customer" name="Customer[]" />
                                        </td>
                                        <td>
                                            <input type="text" class="JobName" name="Job_Name[]" />
                                        </td>
                                        <td>
                                            <input type="text" class="Price" name="Price[]" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div> <!-- end open job container -->

                    <hr />

                    <span id="output">Intitial data</span>
                </div> <!-- end job list -->
            </div> <!-- end content pane -->
        </div> <!-- end wrapper -->
    </body>
</html>
