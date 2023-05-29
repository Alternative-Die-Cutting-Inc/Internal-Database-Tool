<?php

/* * ***************************************************************************
 * This file governs the live job feed which is displayed in the home screen.
 * Fetch the most recent jobs for today up to some constant, and
 * output them on the screen along with the time they came in, ordering them
 * from most recent to oldest (desc).
 * 
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on July 18, 2011
 * 
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);



//TODO move these into backend folder
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Subscriptions/subscriptionHelper.php";
require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/DepartmentFeed/Backend/departmentProgressBarHelper.php";
define("MAX_NUM_JOBS", 40);
if (isset($_POST['show_jobs']) && isset($_POST['Customer'])) {
    showJobs($_POST['Customer']);
} else if ((isset($_POST['type'])) && ($_POST['type'] == 'subscribe')) {
    if (isset($_POST['DocketNumber']) && isset($_POST['UserEmail'])) {
        subscribe($_POST['DocketNumber'], $_POST['UserEmail'], $_POST["Id"]);
        if (isset($_POST['clientEmail'])) {
            //Allows users to input multiple email addresses separated by commas.
            $emails = explode(",", $_POST['clientEmail']);
            foreach ($emails as $email) {
                    subscribeClient($_POST['DocketNumber'], $email, $_POST["Id"]);
            }
        }
        header('Location: ' . "/Intranet/");
    }
}

/**
 * Fetch up to MAX_NUM_JOBS from the table of jobs, fetching only jobs from
 * today and ordering them by date.
 * @param resource $link The link to the database.
 */
function showJobs($company) {
    if (!is_resource($link = connectToDatabase())) {
        fail("Could not connect to database", false);
    }

    date_default_timezone_set("America/Toronto");
    $today = date("Y-m-d");

    $query = "SELECT JobName, Customer, Date AS Stamp, DocketNumber 
        FROM Production WHERE ((Status='open') AND (Customer LIKE \"%$company%\"))
        ORDER BY Date DESC";
    if (($result = mysql_query($query, $link))) {
        echo "<div id='jobFrame'>";
        echo "<div id='jobs'>";
        echo "<h2>Live Jobs</h2>";

        echo '<a href="JobFeed/printable.php">printer friendly</a>';
        echo "<hr />";

        while ($row = mysql_fetch_array($result)) {

            if (mysql_num_rows($result) === 0) {
                echo "<h3>No jobs to display</h3>";
            } else {
                echo "
                        <div class='job'>";

                //left pane
                echo "<div class='leftPane'>
                    ";
                echo "<span class='date'>" . date("M d", strtotime($row['Stamp'])) . "</span> <br /> ";
                echo "</div>";

                //right pane
                echo "
                        <a href='/Intranet/ShippingTool/Production.php?DocketNumber=" . $row['DocketNumber'] . "'><div class='jobContent'>";
                echo "<span class='jobName'>" . $row['JobName'] . " " . $row["DocketNumber"] . "</span>
                     <br />";
                echo "<span class='customer'>" . $row['Customer'] . "</span>";
                echo "</div></a>";
                echo "<br />";
                displayProgressBar($row["DocketNumber"]);
                echo "
                    <span class='subSpan' value='" . $row['DocketNumber'] . "'>
                        [add to personal feed]
                        <input type='hidden' class='docketNumber' value='" .$row['DocketNumber'] . "'/>
                            <input type='hidden' class='id' value='" . $_POST['Id'] . "'/>
                        </span>";
                echo '<br /><button class="addToPersonalFeedButton">&darr;&darr;</button>';
                echo '<div class="subscriptionBox" style="display: none">'; 
                echo '<form class="subscription" method="post" action="JobFeed/JobFeed.php"><br />';
                echo '<table class="subTable">';
                echo '<tr>';
                echo '<td></td><td>In Shipping</td><td>Shipped</td>';
//                    echo '<td>HandWork In</td><td>HandWork Out</td>';
                echo'</tr>';

                //User row
                echo '<tr>';

                echo '<td>' . $_POST["Email"] . '</td>';
                echo '<td><input name="inShipping" type="checkbox" value="inShipping"';
                if (isSubscribed($row["DocketNumber"], $_POST["Email"], "inShipping")) {
                    echo "checked";
                }
                echo '></input></td>';

                echo' <td><input name="shipped" type="checkbox" value="shipped"';
                if (isSubscribed($row["DocketNumber"], $_POST["Email"], "shipped")) {
                    echo "checked";
                }
                echo '></input></td>';
                echo '</tr>';

                //Client row
                echo '<tr>';
                echo '<td>';
                echo '<input type="textfield" name="clientEmail"/>';
                echo '</td>';
                echo '<td>';
                echo '<input type="checkbox" name="clientinShipping" value="clientinShipping"/>';
                echo '</td>';
                echo '<td>';
                echo '<input type="checkbox" name="clientshipped" value="clientshipped"/>';
                echo '</td>';
                echo '</tr>';

                echo '</table>';

                echo '<input type="submit" value="save"/>';
                echo '<input type="hidden" name="type" value="subscribe"/>';
                echo '<input type="hidden" name="UserEmail" value="' . $_POST["Email"] . '"/>';
                echo '<input type="hidden" name="Id" value="' . $_POST["Id"] . '"/>';
                echo '<input type="hidden" name="DocketNumber" value="' . $row["DocketNumber"] . '"/>';
                echo '</form>';
                echo '</div>
                    ';

                //end class job
                echo "</div>";
                echo "<hr />";
            }
        }

        echo "</div>"; //end jobs
    } else {
        fail("Invalid SQL query: " . $query, false);
    }
}

?>