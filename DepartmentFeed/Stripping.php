<?php
/* * ***************************************************************************
 * This is the main page for department feeds.
 * This displays all department fields and links to individual department pages.
 * *****************************************************************************
 * Written by Peter Tran for Alternative Die Cutting, Inc.
 * Sept 26th, 2012.
 * 
 * ************************************************************************** */
session_start();
if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    header("Location: /Intranet/index.php");
    exit;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Department Feed</title>

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <link rel="stylesheet" type="text/css" href="Stylesheets/departmentFeed.css" />
        <link rel="stylesheet" type="text/css" href="Stylesheets/departmentPages.css" />
        <link rel="stylesheet" type="text/css" href="Stylesheets/departmentProgressBar.css" />

        <!-- End import of general stylesheets -->

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="../../Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="../../Intranet/DepartmentFeed/Scripts/departmentFeed.js"></script>
        <!-- End import of general scripts -->

        <script type="text/javascript">
            $(document).ready(function() {
                Menu.fixMenu();
                DepartmentFeed.updateDepartmentFeed("Stripping");
            });
        </script><!-- Script: on load script -->
    </head><!-- head -->
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span class="menuButton"><a href="/Intranet/DepartmentFeed/index.php">Department Feed</a></span></li>
                <li><span class="menuButton DieMakingObject"><a href="/Intranet/DepartmentFeed/DieMaking.php">Die Making</a></span></li>
                <li><span class="menuButton PressObject"><a href="/Intranet/DepartmentFeed/Press.php">Press</a></span></li>
                <li><span class="menuButton StrippingObject"><a href="/Intranet/DepartmentFeed/Stripping.php">Stripping</a></span></li>
                <li><span class="menuButton GluingObject"><a href="/Intranet/DepartmentFeed/Gluing.php">Gluing</a></span></li>
                <li><span class="menuButton HandWorkObject"><a href="/Intranet/DepartmentFeed/HandWork.php">Hand Work</a></span></li>
            </ul>
        </div><!--div#menuContainer -->
        <div id="wrapper">
            <div id="contentPane">
                <h1 class="StrippingObject">Stripping</h1>
                <div id="StrippingFeed">
                    <!-- Feed populated by DepartmentFeed.updateDepartmentFeed() -->
                </div><!-- end of div#StrippingFeed -->
            </div> <!-- end content pane-->
        </div> <!-- end wrapper -->
    </body>
</html>