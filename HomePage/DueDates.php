<?php
/* * ***************************************************************************
 * This page will temporarily be host to the due date feed.
 * 
 * Created July 22nd, 2013
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

require "JobFeed/JobFeed.php";

/* This file contains the function to return the open job summary
viewable only to Carmine. */
require "quickStats.php";

//if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
//    header("Location: /Intranet/index.php");
//    exit;
//}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html ng-app="HomePageModule" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Due Dates</title>
        <link type="text/css" rel="stylesheet" href="../stylesheets/HomePage/app.css" />
        <script type="text/javascript" src="../javascripts/HomePage/app-ck.js"></script>
    </head><!-- head -->
    <body>
        <div ng-controller="DueDates" class="row">
            <div class="columns large-12">
                <table class="due-dates">
                    <tr>
                        <th>Docket Number</th>
                        <th>Customer</th>
                        <th>Job Name</th>
                        <th>Due Date</th>
                        <th>Set Status</th>
                    </tr>
                    <tbody>
                        <tr>
                            <td colspan="3">
                                <input type="text" placeholder="Filter by Customer" ng-model="customerFilter"/>
                            </td>
                            <td colspan="2">
                                <div ng-click="getJobs('icon-checkmark')" class="icon-click icon-checkmark">
                                </div>
                                <div ng-click="getJobs('icon-question-mark')" class="icon-click icon-question-mark">
                                </div>
                                <div ng-click="getJobs('icon-spam')" class="icon-click icon-spam">
                                </div>
                                <div ng-click="getJobs('icon-busy')" class="icon-click icon-busy">
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody ng-show="filteredJobs.length">
                        <tr ng-repeat="job in filteredJobs">
                            <td>
                                <a href="../ShippingTool/Production.php?DocketNumber={{job.DocketNumber}}">{{job.DocketNumber}}</a>
                            </td>
                            <td>{{job.Customer}}</td>
                            <td>{{job.JobName}}</td>
                            <td>
                                <input 
                                 type="date" 
                                 ng-model="job.DueDate"
                                 ng-change="setDueDate()"
                                 />
                            </td>
                            <td ng-click="rotateMemo()" class="icon" ng-class="job.Memo"></td>
                        </tr><!-- One row of a job. -->
                    </tbody>
                    <tbody ng-show="customerFilter.length" ng-repeat="date_range in jobs" ng-hide="date_range.jobs.length == 0">
                        <tr>
                            <th colspan="5">{{date_range.name}}</th>
                        </tr>
                        <tr ng-repeat="job in date_range.jobs | filter:customerFilter">
                            <td>
                                <a href="../ShippingTool/Production.php?DocketNumber={{job.DocketNumber}}">{{job.DocketNumber}}</a>
                            </td>
                            <td>{{job.Customer}}</td>
                            <td>{{job.JobName}}</td>
                            <td>
                                <input 
                                 type="date" 
                                 ng-model="job.DueDate"
                                 ng-change="setDueDate()"
                                 />
                            </td>
                            <td ng-click="rotateMemo()" class="icon" ng-class="job.Memo"></td>
                        </tr><!-- One row of a job. -->
                    </tbody>
                </table>
            </div>
        </div><!-- Wrapper -->
    </body>
</html>