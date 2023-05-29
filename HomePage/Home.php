<?php
/* * ***************************************************************************
 * This is the home page for the Alternative Die Cutting, Inc. itranet.
 * There should be a redirect from the login screen to here after authentication
 * and a redirect to the login screen if no authentication is present.
 * 
 * This page contains all the primary links to other intranet subpages.
 * Change this page on an as-needed basis.
 * 
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 11, 2011
 * 
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();

require "JobFeed/JobFeed.php";

/* This file contains the function to return the open job summary
viewable only to Carmine. */
require "quickStats.php";

if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    header("Location: /Intranet/index.php");
    exit;
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html ng-app="HomePageModule" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Home</title>

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import minifed stylesheets -->
        <link type="text/css" rel="stylesheet" href="/Intranet/Resources/minify/min/b=Intranet&amp;f=DepartmentFeed/Stylesheets/departmentProgressBar.css,HomePage/home.css,HomePage/JobFeed/jobFeed.css,Resources/Menu/menu.css,HomePage/PersonalFeed/Stylesheets/personalFeed.css,Resources/Progress/progressBar.css,HomePage/Search/search.css,HomePage/ShipFeed/shipFeed.css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <!--        Import minifed JS-->
        <script type="text/javascript" src="/Intranet/Resources/minify/min/b=Intranet&amp;f=HomePage/home.js,HomePage/JobFeed/jobFeed.js,Resources/Menu/menu.js,HomePage/PersonalFeed/Scripts/personalFeed.js,Resources/progress/progressBar.js,HomePage/Search/search.js,HomePage/Search/searchButton.js,ShippingTool/Scripts/shipmentEditor.js,Resources/Scripts/xmlRender.js"></script>
        <!-- End import of general scripts -->

        <script type="text/javascript" src="../javascripts/HomePage/app-ck.js"></script>
        <script type="text/javascript">
<?php
echo 'var email = ' . json_encode($_SESSION['email']) . ';';
echo 'var id = ' . json_encode($_SESSION['userId']) . ';';
?>
    $(document).ready(function() {
        addEvents();
        Menu.fixMenu();
        Home.launch(email, id);
    });

        </script><!-- Script: on load script -->
    </head><!-- head -->
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span class="menuButton"><a href="/Roswell/Organizers/Phone3.php">Phone Book</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/HomePage/DocketLogin.php'>Docket Login</a></span></li>
                <li><span class="menuButton"><a href="/Roswell/Include/OldHomePage.php">Old Links</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/QuoteTool/'>New Quote</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/QT/'>[QuoteTool 2.0]</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/DepartmentFeed/index.php'>Department Feed</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/HomePage/index.php'>Due Dates</a></span></li>
                <!-- <li><span class="menuButton"><a href='/Intranet/Scheduler/index.php'>Scheduler</a></span></li> -->
            </ul>
        </div><!--div#menuContainer -->
        <div id="wrapper">
            <div id="personalFeedArrows" class="contentContainer">
                <span id="personalDownArrows">&darr;&darr; Show Personal Feed &darr;&darr;</span>
                <span id="personalUpArrows">&uarr;&uarr; Hide Personal Feed &uarr;&uarr;</span>
            </div>
            <div id="personalFeed" class="contentContainer">
                Loading ...
            </div>
            <div id="topPane">
                <div id="topLeftPane">
                    <div id="search" class="contentContainer">
                        <div id="header">
                            <img id="logo" src="/Intranet/Resources/Images/penguin-owl.png" alt="Alternative Penguin" onmouseover="$('#penguinPane').css('visibility', 'visible')" onmouseout="$('#penguinPane').css('visibility', 'hidden')" />
                            <h2 id="title">Alternative Search</h2>
                        </div>

                        <table>
                            <tr><td>
                                <h2>Job Search</h2>
                            <div class="advancedSearchContainer">
                               
                                <input type="text" id="advDocketNumber" placeholder="Docket Number" /><br />
                                <input type="text" id="advQuoteNumber" placeholder="Quote Number" /><br />
                                <input type="text" id="advCustomer" placeholder="Customer" /><br />
                                <input type="text" id="advCustomerPO" placeholder="Customer PO" /><br />
                                <input type="text" id="advJobName" placeholder="Job Name" /><br />
                                <input type="text" id="advFinishing" placeholder="Finishing" /><br />
                                <input type="text" id="advSpecialInstructions" placeholder="Special Instructions" /><br />
                                <input type="text" id="advNumberOfUnits" placeholder="Number of Units" /><br />
                                <input type="text" id="advFormName" placeholder="Name of a Form" /><br />

                                <button id="advSearch">Search</button>
                            </div></td><td>
                            <h2>Quote Search</h2>
                            <div class="advancedQuoteSearchContainer">

                                <input type="text" id="advQQuoteNumber" placeholder="Quote Number" /><br />
                                <input type="text" id="advQCustomer" placeholder="Customer" /><br />
                                <input type="text" id="advQAttention" placeholder="Attention" /><br />
                                <input type="text" id="advQJobName" placeholder="Job Name" /><br />
                                <input type="text" id="advQDescription" placeholder="Description" /><br />
                                <input type="text" id="advQNotes" placeholder="Notes" /><br />
                                <input type="text" id="advQAuthor" placeholder="Author" /><br />   
                                <button id="advQuoteSearch">Search</button>
                            </div></td>


                                <td>
                                    <h2>New Quote Search</h2>
                                    <div ng-controller="QuoteSearch" class="new-quote-search-container">
                                        <input type="text" ng-model="quoteNumber" placeholder="Quote Number"/>
                                        <input type="text" ng-model="customer" placeholder="Customer"/>
                                        <input type="text" ng-model="attention" placeholder="Attention"/>
                                        <input type="text" ng-model="jobName" placeholder="Job Name"/>
                                        <input type="text" ng-model="description" placeholder="Description"/>
                                        <input type="text" ng-model="notes" placeholder="Notes"/>
                                        <input type="text" ng-model="author" placeholder="Author"/>
                                        <input type="date" ng-model="from" placeholder="From"/>
                                        <input type="date" ng-model="to" placeholder="To"/>
                                        <button ng-click="searchPrevious()">Previous 100</button>
                                        <button ng-click="search()">Search</button>
                                        <button ng-click="searchNext()">Next 100</button>
                                    </div>
                                </td>
                            </tr></table>
                    </div> <!-- end search -->
                </div><!--end of top left pane-->
                <div id="topRightPane">
                    <div id="userInfo" class="contentContainer">
                        Signed in as 
                        <span id="loginName">
                            <?php echo isset($_SESSION['name']) ? $_SESSION['name'] : "Anonymous"; ?>
                            . You're email is: <?php echo $_SESSION['email'] ?>
                        </span>
                        <a href="<?php echo "/Intranet/logout.php"; ?>">Logout</a>
                        <?php  
                        if ($_SESSION['name'] == "Carmine") {
                        ?>
                        <div id="totalBox">
                        <table>
                            <tr>
                                <th class="sumDate">Date</th>
                                <th class="sumDockNum">Docket Number</th>
                                <th>Customer</th>
                                <th>Job Name</th>
                                <th class="sumAmount">Amount</th>
                            </tr>
                        </table>
                        <div style="height: 200px; overflow: scroll;">
                            
                        <?php
                            getOpenJobSummary();
                        ?>
                        </div>

                        <?php
                            getTotals();
                            echo "</div>";
                        }
                        ?>
                        

                    </div> <!-- end user info -->

                    <div id="shipDocket" class="contentContainer">
                        <form method="get" action="../ShippingTool/shipping.php">
                            <input placeholder="New Delivery Slip" type="tel" name="DocketNumber"/>
                        </form>
                    </div><!--end of ship docket -->

                    <div id="shipOut" class="contentContainer">
                        <form method="post" action="../ShippingTool/Backend/shippingHelper.php">
                            <input placeholder="Shipped Out" type="tel" id="SessId" name="SessId"/>
                            <input type="hidden" name="setDate" value="true"/>
                            <input id="shipOut" class="shipOut" value ="shipOut" name="type" type="hidden"/><!--Hidden input to direct php-->
                        </form>
                    </div><!--end of ship docket -->
                    <div id="hiddenLinks">
                        <div id="orderSummary" class="contentContainer">
                            <form method="get" action="../ShippingTool/JobSummary.php">
                                <input placeholder="Order Summary" type="tel" name="DocketNumber"/>
                            </form>
                        </div><!--end of job summary -->

                        <div id="closeDocket" class="contentContainer">
                            <form method="get" action="../ShippingTool/shipmentHistory.php">
                                <input placeholder="Shipment History" type="tel" name="DocketNumber"/>
                            </form>
                        </div> <!-- end of close docket -->

                        <div id="searchDie" class="contentContainer">
                            <form method="get" action="Search/searchDie.php">
                                <input placeholder="Search Die" type="tel" name="DocketNumber"/>
                            </form>
                        </div> <!-- end of search die -->
                        <div id="expiredDies" class="contentContainer">
                            <form method="get" action="Search/expiredDies.php">
                                <input placeholder="Expired(years)" type="tel" name="years"/>
                            </form>
                        </div> <!-- end of search die -->
                    </div><!-- end of hidden links -->
                    <div id="showLinks" class="contentContainer">
                        <span id="downArrows">&darr;&darr;</span>
                        <span id="upArrows">&uarr;&uarr;</span>
                    </div>
                </div><!-- end of top right pane -->
            </div><!-- End of top pane (full width of top of page) -->
            <div ng-controller="SearchDisplay" ng-show="resultsAvailable == true">
                <table border="1px solid black">
                    <tr>
                        <th>Quote Number</th>
                        <th>Customer</th>
                        <th>Attention</th>
                        <th>Job Name</th>
                        <th>Description</th>
                        <th>Notes</th>
                        <th width="30%">Units + Sheets + Per M + Total</th>
                        <th>Date</th>
                    </tr>
                    <tr ng-repeat="result in quoteSearchResults">
                        <td>
                            <a href="../QT/?quote_number={{result.quote_number}}">{{result.quote_number}}</a><br/>
                            <a href="../QT/clientsheet.php?quote_number={{result.quote_number}}">Client Sheet</a><br/>
                            <a href="../QT/worksheet.php?quote_number={{result.quote_number}}">Work Sheet</a><br/>
                        </td>
                        <td>{{result.customer}}</td>
                        <td>{{result.attention}}</td>
                        <td>{{result.job_name}}</td>
                        <td>{{result.description}}</td>
                        <td>{{result.notes}}</td>
                        <td>
                            <table>
                                <tr ng-repeat="quantity in result.quantities">
                                    <td>{{quantity.units | number}}</td>
                                    <td>{{quantity.sheets | number}}</td>
                                    <td>{{quantity.total_per_m | currency}}</td>
                                    <td>{{quantity.total | currency}}</td>
                                </tr>
                            </table>
                        </td>
                        <td>{{result.date}}</td>
                    </tr>
                </table>
            </div>
            <div id="bottomPane">

                <div id="results" class="contentContainer" style="display: none;">
                    <div class="searchPages">
                        <!-- page numbers generated here -->
                    </div><!-- end of #searchPages -->
                    <div id="searchFooter">
                        <p>The search took <span id="searchTime">0</span> seconds. 
                            Displaying <span id="numRows">0</span> out of
                            <span id="numResults">0</span> results found. </p>
                    </div>
                    <table id="searchResults" border="1"></table>
                    <div class="searchPages">
                        <!-- page numbers generated here -->
                    </div><!-- end of #searchPages -->
                </div> <!-- end of search results -->

                <div id="bottomLeftPane">                    
                    <div id="jobFeedContainer" class="contentContainer">
                        <form id="jobFilter" class="contentContainer">
                            <label>Filter: </label>
                            <input name="jobFilter" type="text" />
                        </form>
                        <div id="jobFeed">
                            <!-- job feed automatically goes here -->
                        </div>
                    </div> <!-- end job feed -->
                </div><!-- End of bottom left pane -->
                <div id="bottomRightPane">
                    <div id="shipFeedContainer" class="contentContainer"> 
                        <form id="shipFilter" class="contentContainer">
                            <label>Filter: </label>
                            <input name="shipFilter" type="text" />
                        </form>
                        <div id="shipFeed">
                            <!--                 ship feed automatically goes here -->
                        </div>
                    </div><!-- end ship feed -->
                </div><!-- End of Bottom Right Pane -->
            </div><!-- End of Bottom Pane -->
        </div> <!-- end wrapper -->
    </body>
</html>