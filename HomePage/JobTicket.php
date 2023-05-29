<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

//authenticate user
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";

?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Job Ticket</title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <link rel="stylesheet" type="text/css" href="Stylesheets/docketLogin.css" />
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />
        <script type="text/javascript">
            function printPage() {
                $("input.printButton").attr("style", "visibility:hidden");
                window.print();
                $("form").submit();
            }
        </script>
    </head>

    <style>
        @media print {
            a {display: none; }
            #feedbackDiv {display: none; }
        }
    </style>
    <body>
        <div id="wrapper">
            <input type="button" class="printButton" name="printButton" onclick="printPage();" value="Print + Production Page"/>
            <!-- TODO this forms should be merge with other forms... -->
            <h1>Job Ticket</h1>
            <a href="/Intranet">Home</a>
            <h2>Docket #<?php echo isset($_POST['docketNum']) ? $_POST['docketNum'] : "infinite"; ?></h2>
            <h2>Date Received: <?php date_default_timezone_set("America/Toronto");
echo date("Y-m-d"); ?></h2>
            <h2>Time Received: <?php date_default_timezone_set("America/Toronto");
                echo date("H:i"); ?></h2>
            <h2>Customer: <?php echo isset($_POST['customer']) ? $_POST['customer'] : "Alice, maybe Bob"; ?></h2>
            <h2>Job Name: <?php echo isset($_POST['jobName']) ? $_POST['jobName'] : "Tractor Beam"; ?></h2>

            <?php if ($_POST['custNum'] === "")
                $_POST['custNum'] = "none"; ?>

            <h2>Customer PO Number: <?php echo isset($_POST['custNum']) ? $_POST['custNum'] : 2; ?></h2>
            <h2>Sample: <?php echo isset($_POST["sample"]) ? "Yes" : "None"; ?></h2>
            <h2>Die Line: <?php echo isset($_POST["dieline"]) ? "Yes" : "None"; ?></h2>
            <?php
            if (isset($_POST['dueDate'])) {
                echo "<h2>Due Date: ".$_POST['dueDate']."</h2>";
            }
            ?>
        </div>
        <form method="get" action="Production.php">
            <input id="DocketNumber" name="DocketNumber" value="<?php echo $_POST["docketNum"]; ?>" type="hidden"/><!--Hidden input to production-->
        </form>

    </body>
</html>