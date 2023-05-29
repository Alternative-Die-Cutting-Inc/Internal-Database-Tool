<?php
/**
 * Created Sept 16th, 2015 by Peter Tran
 * This page displays information from Email Logs table.
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
<html ng-app="LogsModule">
    <head>
        <title>Alternative DC Intranet</title>
        <!-- Import minifed stylesheets -->
        <link type="text/css" rel="stylesheet" href="../stylesheets/Analytics/app.css" />

        <script type="text/javascript" src="../javascripts/angular.js"></script>
        <script type="text/javascript" src="../javascripts/Logs/Controllers/main.js"></script>
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
                        <th>Docket Number</th>
                        <th>email</th>
                        <th>date</th>
                        <th>Customer</th>
                    </tr>
                    <tr ng-repeat="row in monthData">
                        <td>{{row.DocketNumber}}</td>
                        <td>{{row.email}}</td>
                        <td>{{row.date}}</td>
                        <td>{{row.customer}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </body>
</html>
