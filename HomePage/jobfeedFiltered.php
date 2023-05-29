<?php
/* * ***************************************************************************
 * Rewritten by Peter Tran for Alternative Die Cutting, Inc.
 * Updated on August 21st, 2012
 * ---------------------------------------------------------------------------
 * This displays the shipping feed but filtered by the company name submitted.
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

//authenticate user
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/HomePage/JobFeed/JobFeed.php";
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Home</title>

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End import of general stylesheets -->

        <link rel="stylesheet" type="text/css" href="../HomePage/home.css" />
        <link rel="stylesheet" type="text/css" href="../HomePage/Search/search.css" />
        <link rel="stylesheet" type="text/css" href="../HomePage/JobFeed/jobFeed.css" />
        <link rel="stylesheet" type="text/css" href="../HomePage/ShipFeed/shipFeed.css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>
        <!-- End import of general scripts -->


        <script type="text/javascript" src="../HomePage/home.js"></script>
        <script type="text/javascript" src="../HomePage/Search/search.js"></script>
        <script type="text/javascript" src="../HomePage/Search/searchButton.js"></script>

        <script type="text/javascript">
            $(document).ready(function() {
                addEvents();
                Menu.fixMenu();                
            });
        </script>
    </head>
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span class="menuButton"><a href="/Roswell/Organizers/Phone3.php">Phone Book</a></span></li>
                <li><span class="menuButton"><a href="/Roswell/Include/OldHomePage.php">Old Links</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/HomePage/Home.php'>Home</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/QuoteTool/'>New Quote</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/ShippingTool/DocketForm.php'>Docket Login</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/Administration'>Administration</a></span></li>
            </ul>
        </div>

        <div id="wrapper">                  
            <div id="shipFeed" class="contentContainer"> 
                <!--                 ship feed automatically goes here -->
                <?php
                if (isset($_POST['jobFilter'])) {
                    showJobs($_POST['jobFilter']);
                }
                ?>
            </div><!-- end ship feed -->

        </div> <!-- end wrapper -->
    </body>
</html>