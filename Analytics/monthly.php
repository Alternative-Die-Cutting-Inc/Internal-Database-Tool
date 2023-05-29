<?php
/**
 * Created May 28th, 2014.
 * Objective: A breakdown for each day of a given month.
 * Includes:
 * 1) # of Quotes Created 
 * 2) $ of Quotes Created
 * 3) # of Jobs Created
 * 4) $ of Jobs Created
 * 5) # of Jobs Closed
 * 6) $ of Jobs Closed
 */
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

session_start();
/*
    If not logged in, send the user to the log in page.
*/
if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    header("Location: /Intranet/index.php");
    exit;
}
?>
<html ng-app="AnalyticsModule">
    <head>
        <title>Alternative DC Intranet Monthly Analytics</title>
        <!-- Import minifed stylesheets -->
        <link type="text/css" rel="stylesheet" href="../stylesheets/Analytics/app.css" />

        <script type="text/javascript" src="../javascripts/angular.js"></script>
        <script type="text/javascript" src="../javascripts/Analytics/app.min.js"></script>
    </head><!-- head -->
    <body ng-controller="Monthly">
        <nav class="hide-on-print top-bar" ng-include="'../HomePage/templates/navigation.php'"></nav><!-- Menu -->
        <div class="row">
    		<div class="columns large-6">
    			<select ng-change="getMonthData()" ng-model="selectedMonth" >
    				<option ng-selected="month.id == selectedMonth" value="{{month.id}}" ng-repeat="month in Months">{{month.name}}</option>
    			</select>
    		</div>
    		<div class="columns large-6">
    			<select ng-change="getMonthData()" ng-model="selectedYear" >
    				<option ng-selected="year == selectedYear" value="{{year}}" ng-repeat="year in Years">{{year}}</option>
    			</select>
    		</div>
    	</div>
        <div class="row">
            <div class="columns large-12">
                <table>
                    <tr>
                        <th>Date</th>
                        <th># of Quotes</th>
                        <th>$ of Quotes</th>
                        <th># of Orders</th>
                        <th>$ of Orders</th>
                        <th># of Invoice</th>
                        <th>$ of Invoice</th>
                    </tr>
                    <tr ng-repeat="day in monthData">
                        <td>{{day.day}}</td>
                        <td>{{day.total_quotes}}</td>
                        <td>{{day.total_quotes_dollars | currency}}</td>
                        <td>{{day.total_orders}}</td>
                        <td>{{day.total_orders_dollars | currency}}</td>
                        <td>{{day.total_invoice}}</td>
                        <td>{{day.total_invoice_dollars | currency}}</td>
                    </tr>
<!--                     <tr>
                        <td><b>Totals</b></td>
        <td>{{quote_number}}</td>
        <td>{{quote_dollar | currency}}</td>
        <td>{{orders_number}}</td>
        <td>{{orders_dollar | currency}}</td>
        <td>{{invoice_number}}</td>
        <td>{{invoice_dollar | currency}}</td>
                    </tr>
 -->                </table>
            </div>
        </div>
    </body>
</html>
