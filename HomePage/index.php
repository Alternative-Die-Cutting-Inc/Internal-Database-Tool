<?php
/* * ***************************************************************************
 * This is the new Home Page for Alternative DC.
    The objective of this page is to centralize all activity and operations needed to
    be performed on all open jobs. 
    Regular links to different parts of the system will persist however the job feed
    will be replaced by the due date feed and the functionality of the production page,
    job summary page and closing the docket can all be done off the main page.
 * Written by Peter Tran for Alternative DC Inc. on July 17th, 2013.
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
/* This file contains the function to return the open job summary
viewable only to Carmine. */
//require "quickStats.php";

/*
    If not logged in, send the user to the log in page.
*/
if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    header("Location: /Intranet/index.php");
    exit;
}
?>
<html ng-app="HomePageModule">
    <head>
        <title>Alternative DC Intranet Home</title>
        <!-- Import minifed stylesheets -->
        <link type="text/css" rel="stylesheet" href="../stylesheets/HomePage/app.css" />
        <script type="text/javascript">
            <?php
                echo 'var email = ' . json_encode($_SESSION['email']) . ';';
                echo 'var id = ' . json_encode($_SESSION['userId']) . ';';
                echo 'var user = ' . json_encode($_SESSION['name']) . ';';
            ?>
        </script><!-- Script: on load script -->
        <script type="text/javascript" src="../javascripts/HomePage/app-ck.js"></script>
    </head><!-- head -->
    <body ng-controller="Main">
        <nav class="hide-on-print top-bar" ng-include="'templates/navigation.php'"></nav><!-- Menu -->
        <div class="row hide-on-print"> 
            <div class="columns large-8">
                <div ng-hide="showCorner" id="search" class="contentContainer">
                    <div class="row">
                        <div class="columns large-6" ng-include="'templates/JobSearch.html'"></div><!-- Job Search -->
                      <!--  <div class="columns large-4" ng-include="'templates/OldQuoteSearch.html'"></div> Old Quote Search -->
                        <div class="columns large-6" ng-include="'templates/QuoteSearch.html'"></div><!-- New Quote Search -->
                    </div>
                </div>
                
                <div ng-show="showCorner" ng-include="'templates/analytics.html'"></div>
            </div><!-- Search -->
            <div class="columns large-4">
                <div class="row">
                    <div class="columns large-12">
                        <div id="userInfo" class="contentContainer">
                            <!-- Remove Carmine's Corner -->
                        </div> <!-- end user info -->
                    </div>
                </div><!-- Carmine's Corner -->
                
                <div class="row">
                    <div class="columns large-12" ng-hide="showCorner" ng-include="'templates/QuickLinksSideBar.html'">
                    </div>
                </div><!-- Quick links -->
            </div><!-- Sidebar -->
        </div><!-- Top row -->
        <div class="row hide-on-print" ng-controller="SearchDisplay">
            

            <div class="columns large-12" ng-include="'templates/QuoteSearchResults.html'"  ng-show="quoteResultsAvailable == true"></div>
            <div class="columns large-12" ng-include="'templates/JobSearchResults.html'"  ng-show="jobResultsAvailable == true"></div>
         
        </div><!-- Search Results -->
        <div ng-controller="DueDates" class="row">
            <div class="columns" ng-class="duedatesWidth" ng-include="'DueDates.html'">
            </div><!-- End of bottom left pane -->
            <div class="hide-on-print columns large-4 ship-feed-container" ng-hide="hideShip" ng-include="'ShipFeed.html'">
            </div>
            <div class="row" ng-show="hideShip">
                <div class="columns large-5" ng-include="'templates/Production.html'">
                </div>
            </div>
        </div><!-- End of Feeds -->
    </body>
</html>
