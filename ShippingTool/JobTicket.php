<?php
/* * ***************************************************************************
 * Rewritten by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated August 3, 2011
 * ---------------------------------------------------------------------------
 * This is the form for a job ticket. The job ticket is the first piece of
 * paper to be stamped onto a job. Also inserts very basic job details
 * into the production table.
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

//authenticate user
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";

/**
 * Insert the posted information into the database. Return a confirmation
 * or error message where appropriate.
 * @param int $docketNum The docket number.
 * @param string $customer The customer.
 * @param string $jobName The job name.
 * @param string $custNum The customer's internal number for the order.
 * Empty string if not set.
 * @return string Message regarding the insert. 
 */
function makeInserts($docketNum, $customer, $jobName, $custNum) {
    if (!is_numeric($docketNum) || intval($docketNum) < 0) {
        return "Docket number is not valid";
    }

    //clean the input
    $customer = cleanInput($customer);
    $jobName = cleanInput($jobName);
    $custNum = cleanInput($custNum);

    if (!is_resource($link = connectToDatabase())) {
        return "Could not connect to database";
    }

    $query = "DELETE FROM Production WHERE DocketNumber=$docketNum";

    if (!mysql_query($query)) {
        disconnect($link);
        return "Could not delete previous production data";
    }

    $query = "INSERT INTO Production
                (DocketNumber, CustomerPoNo, Status, Customer, JobName)
                VALUES(" .
            $docketNum . ", '$custNum', 'open', '$customer', '$jobName'
    )";

    if (($result = mysql_query($query, $link))) {
        $str = "Data write complete";
    } else {
        $str = "Data write failed. ";
    }

//     $getJobBankQuery = "SELECT Jobs FROM Schedule WHERE Day='JobBank'";
//     $jbResult = mysql_query($getJobBankQuery, $link);
//     if (!$jbResult) {
//         echo "Query failed: " . $getJobBankQuery . " " . mysql_error();
//     }
//     $row = mysql_fetch_array($jbResult);
//     if (!$row) {
//         echo "No results from query " . $getJobBankQuery;
//     }
//     $jobs = json_decode($row["Jobs"]);
// //    print_r($jobs);
//     array_push($jobs, $docketNum);
// //    print_r($jobs);
//     $jsonObject = json_encode($jobs);
//     $insertQuery = "UPDATE Schedule Set Jobs= '" . mysql_real_escape_string($jsonObject) . "'
//         WHERE Day='JobBank'";
//     $result = mysql_query($insertQuery, $link);
//     if (!$result) {
//         echo "Query failed: " . $insertQuery;
//     }

//     disconnect($link);
    return $str;
}

/**
 * Given a docket number, insert into DueDate that docket number with the given
 * due date and dienumber.
 * @param int $docketNum
 * @param int $date 
 */
function setDueDate($docketNum, $date, $dieNumber, $memo) {
    if ($date == null) {
        $date = "0000-00-00";
    } else {
        $date = date('Y-m-d', strtotime(str_replace('-', '/', $date)));
    }
    if (!is_resource($link = connectToDatabase())) {
        return "Could not connect to database";
    }

    $query = "INSERT INTO DueDate (DocketNumber, DueDate, Memo, DieNumber) VALUES ($docketNum, '$date', $memo, $dieNumber)";

    if (($result = mysql_query($query, $link))) {
        $str = "Data write complete";
    } else {
        $str = "Data write failed. ";
    }

    disconnect($link);
}

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

            <div id="feedbackDiv">
                <?php
                if (isset($_POST['docketNum']) && isset($_POST['customer']) && isset($_POST['jobName']) &&
                        isset($_POST['custNum'])) {

                    $msg = makeInserts($_POST['docketNum'], $_POST['customer'], $_POST['jobName'], $_POST['custNum']);
                } else {
                    echo "Could not write to database because parameters were not set.";
                }

                //Save the due date  
                if (isset($_POST['dieNumber'])) {
                    $dieNumber = $_POST['dieNumber'];
                } else {
                    $dieNumber = null;
                }
                setDueDate($_POST['docketNum'], $_POST['dueDate'], $dieNumber, "memo");
                ?>
            </div>
        </div>
        <form method="get" action="Production.php">
            <input id="DocketNumber" name="DocketNumber" value="<?php echo $_POST["docketNum"]; ?>" type="hidden"/><!--Hidden input to production-->
        </form>

    </body>
</html>
