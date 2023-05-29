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

// require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
// require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
require "../JobFeed/JobFeed.php";

if (!isset($_SESSION['valid']) || $_SESSION['valid'] !== true) {
    header("Location: /Intranet/index.php");
    exit;
}

function totalOpenJobs() {
    $query = "SELECT COUNT(*) as C FROM Production WHERE status='open'";
    $result = runQuery($query);
    if ($result) {
        $row = mysql_fetch_array($result);
        if ($row) {
            return $row['C'];
        }
    }
}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Printable Job Feed</title>

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <link rel="stylesheet" type="text/css" href="printable.css" />


        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>
        <!-- End import of general scripts -->


        <script type="text/javascript" src="jobFeed.js"></script>

        <script type="text/javascript">
        <?php
        echo 'var email = ' . json_encode($_SESSION['email']) . ';';
        echo 'var id = ' . json_encode($_SESSION['userId']) . ';';
        ?>
                $(document).ready(function() {
                    JobFeed.updateJobFeed(email, id, "");
                });
        </script>
    </head>
    <body>
        <div id="wrapper">
            <div id="jobFeed" class="contentContainer">
                <!-- job feed automatically goes here -->
            </div> <!-- end job feed -->
            <div>
                <?php echo "Total open jobs: ".totalOpenJobs()?>
            </div>
        </div> <!-- end wrapper -->

    </body>
</html>
