<?php
/*
    This file is the new way to log in a job. It differs from
    the ShippingTool/DocketForm.php in that it will pre produce a drop down of different quantities once a quote number is entered in.

    Furthermore, it will require a Quantity which will be saved in the Production table.
    Written by Peter Tran July 30th, 2013
*/
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
?>
<html ng-app="HomePageModule" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Alternative DC Intranet Home</title>

        <!-- Import minifed stylesheets -->
        <link type="text/css" rel="stylesheet" href="../stylesheets/HomePage/app.css" />
        <!-- End import of general scripts -->
        <script type="text/javascript">
            <?php
                echo 'var email = ' . json_encode($_SESSION['email']) . ';';
                echo 'var id = ' . json_encode($_SESSION['userId']) . ';';
                echo 'var user = ' . json_encode($_SESSION['name']) . ';';
            ?>
        </script><!-- Script: on load script -->
        <script type="text/javascript">
            function printPage() {
                $("input.printButton").attr("style", "visibility:hidden");
                window.print();
                $("form").submit();
            }
        </script>
        <script type="text/javascript" src="../javascripts/HomePage/app-ck.js"></script>
    </head><!-- head -->
    <body ng-controller="DocketLogin">
        <nav class="hide-on-print top-bar" ng-include="'templates/navigation.php'"></nav><!-- Menu -->
        <div ng-hide="completed" class="row">
            <form ng-submit="logJob()" class="columns large-12 docket-login">
                <h1>{{DocketNumber}}</h1>                
                <datalist id="customerList">
                    <option ng-repeat="customer in customers track by $index" value="{{customer}}" >
                </datalist>
                <input type="text" ng-model="Customer" name="customer" list="customerList" placeholder="Enter Customer Here" />
                <input type="text" ng-model="JobName" name="JobName" placeholder="Job Name"/>
                <input type="text" ng-model="CustomerPoNo" name="CustomerPoNo" placeholder="Customer PO#"/>
                <label>Sample</label><input type="checkbox" ng-model="Sample" name="Sample"/>
                <label>Die Line</label><input type="checkbox" ng-model="DieLine" name="DieLine"/>
                <input type="text" ng-change="getQuantities()" ng-model="QuoteNumber" name="QuoteNumber" placeholder="Quote Number"/>
                <select ng-model="QuoteQuantityID" name="QuoteQuantityID">
                    <option value="{{QuantityID.quantity_id}}" ng-repeat="QuantityID in QuoteQuantities">{{QuantityID.total | currency}} at {{QuantityID.total_per_m | currency}}/M</option>
                </select>
                <input class="button" type="submit"/>
            </form >
        </div><!-- Docket Login -->
        <div ng-show="completed" class="row">
            <div class="columns large-12 docket-login">
                <h1>Docket #{{DocketNumber}}</h1>
                <h2>Date Received: <?php date_default_timezone_set("America/Toronto");
echo date("Y-m-d"); ?></h2>
                <h2>Time Received: <?php date_default_timezone_set("America/Toronto");
                echo date("H:i"); ?></h2>
                <h2>Customer: {{Customer}}</h2>
                <h2>Job Name: {{JobName}}</h2>
                <h2>Customer PO: {{CustomerPoNo}}</h2>
                <h2 ng-show="Sample">Sample: Yes</h2>
                <h2 ng-show="DieLine">Die Line: Yes</h2>
                <form class="hide-on-print" method="get" action="../Production/index.php">
                    <input id="DocketNumber" name="docket_number" value="{{DocketNumber}}" type="hidden"/><!--Hidden input to production-->
    
                </form>
                <input type="button" class="printButton button" name="printButton" onclick="printPage();" value="Print + Production Page"/>
            </div>
        </div>
    </body>
</html>
