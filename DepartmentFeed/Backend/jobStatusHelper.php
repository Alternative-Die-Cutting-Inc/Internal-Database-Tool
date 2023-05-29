<?php

/*
 * This file contains all the helper methods for interacting with the 
 * JobInDepartments and JobStatus tables.
 * JobStatus tells you for the given docket number, what time it started or 
 * stopped in each department it was assigned to.
 * JobInDepartments tells you for a given job, which departments it is assigned to.
 * 
 * Written by Peter Tran Sept 27th, 2012.
 */
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/backendHelper.php";
require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/DepartmentFeed/Backend/departmentProgressBarHelper.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/phpmailer/mailHelper.php";
//require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/ShippingTool/Backend/shippingHelper.php";

//This page is used by passing the "type" through the post.
//Initially this is passed through Ajax.
//Check for a passed docket number because both tables JobStatus and JobInDepartments
//have a Docket Number as a primary key.
if (isset($_POST["type"])) {
    switch ($_POST["type"]) {
        case "assign_job_to_department":
            if (!isset($_POST["DocketNumber"])) {
                fail2("Docket number is not set");
            }
            assignJobs($_POST["DocketNumber"], $_POST["departmentInformation"]);
            break;
        case "get_department_info":
            if (!isset($_POST["DocketNumber"])) {
                fail2("Docket number is not set");
            }
            getJobAssignmentsFor($_POST["DocketNumber"]);
            break;
        case "get_department_feed":
            if (!isset($_POST["department"])) {
                fail2("department not set");
            }
            getDepartmentFeed($_POST["department"]);
            break;
        case "log_job_time":
            if (!isset($_POST["department"]) || !isset($_POST["DocketNumber"])) {
                fail2("department or docekt number not set");
            }
            logJob($_POST["DocketNumber"], $_POST["department"], $_POST["status"]);
            break;
        default:
            fail2("Type set not recognized.");
            break;
    }
} else {
    fail2("Typenot set.");
}

/*
 * Given the docket number and a JSON array of department assignments,
 * save the information into JobsInDepartments table.
 */

function assignJobs($DocketNumber, $departmentInfo) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to database.");
    } else {
        $query = createJobInDepartmentQuery($DocketNumber, $departmentInfo);
        if (!mysql_query($query, $link)) {
            fail2("Query failed: " . $query . mysql_error());
        }
        $query = "INSERT IGNORE INTO JobStatus (DocketNumber) VALUES ({$DocketNumber})";
        if (!mysql_query($query, $link)) {
            fail2("Query failed: " . $query . mysql_error());
        }
    }
    disconnect($link);
}

/**
 * Given the docket number and a JSON array of department assignment,
 * create a MySQL query that inserts into JobsInDepartments table or
 * updates if the docket number is already in the table.
 */
function createJobInDepartmentQuery($DocketNumber, $departmentAssignments) {
    $query = "INSERT INTO JobInDepartments";
    $query .= "(DocketNumber, DieMaking, Press, Stripping, Gluing, Handwork) VALUES";
    $query .= "({$DocketNumber},
                {$departmentAssignments['DieMaking']},
                {$departmentAssignments['Press']},
                {$departmentAssignments['Stripping']},
                {$departmentAssignments['Gluing']},
                {$departmentAssignments['HandWork']}
                ) ON DUPLICATE KEY UPDATE ";
    $query .= "DieMaking={$departmentAssignments['DieMaking']},
                Press={$departmentAssignments['Press']},
                Stripping={$departmentAssignments['Stripping']},
                Gluing={$departmentAssignments['Gluing']},
                HandWork={$departmentAssignments['HandWork']}";
    return $query;
}

/**
 * Given a docket number, echo a JSON object of the department
 * the docket was assigned to. Echo an empty object if the docket number is not
 * found in the JobsInDepartment table.
 */
function getJobAssignmentsFor($docketNumber) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to DB");
    }
    $query = "SELECT DieMaking, Press, Stripping, Gluing, HandWork FROM JobInDepartments WHERE DocketNumber={$docketNumber}";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: {$query} " . mysql_error());
    }
    $assignments = array();
    $row = mysql_fetch_array($result);
    $departments = array("DieMaking", "Press", "Stripping", "Gluing", "HandWork");
    foreach ($departments as $department) {
        //If the value in the department is true, add it to the array.
        if ($row[$department]) {
            array_push($assignments, $department);
        }
    }
    echo json_encode($assignments);
}

/**
 * Given the department, echo the relevant jobs for that department.
 */
function getDepartmentFeed($department) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to DB");
    }
    //Select the jobs that have been assigned to this department that
    //are not finished or were finished within the last day.
    $query = "  SELECT * FROM (SELECT * FROM
                    (
                        (SELECT DocketNumber 
                        FROM JobInDepartments 
                        WHERE {$department}=1) as AssignedJob
                        NATURAL JOIN
                        JobStatus as JobLog
                    )
                    WHERE
                        (
                            ({$department}Out IS NULL)
                            OR
                            (TO_DAYS({$department}Out) >= TO_DAYS(NOW()))
                        
                        )) As B
                            
                 NATURAL JOIN Production
                 ORDER BY DocketNumber DESC";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    }
//    echo '<a href="/Intranet/DepartmentFeed/' . $department . '.php"><h1 class="' . $department . 'Object">' . $department . '</h1></a>';
    while ($row = mysql_fetch_array($result)) {
        echo '<form method="post" action="/Intranet/DepartmentFeed/Backend/jobStatusHelper.php">';
        //Hidden inputs to update database
        echo '<input type="hidden" name="type" value="log_job_time"/>';
        echo '<input type="hidden" name="DocketNumber" value="' . $row["DocketNumber"] . '"/>';
        echo '<input type="hidden" name="department" value="' . $department . '"/>';
        echo '<span class="docketNumber">' . $row["DocketNumber"] . '</span><br />
            <span>' . $row['JobName'] . '</span><br />
                <span>' . $row['Customer'] . '</span>';
        //If start time is null, show start button only.
        displayProgressBar($row["DocketNumber"]);
        if ($row[$department . "In"] == NULL) {
            echo '<button class="statusButton" type="submit" name="status" value="In">Start</button>';
        } else {
            //If FinishIn is null, show cancel start button and finish button.
            if ($row[$department . "Out"] == NULL) {
                echo '<button class="cancelButton" type="submit" name="status" value="cancelIn">Cancel Start</button>';
                echo '<button class="statusButton" type="submit" name="status" value="Out">Finish</button>';
            } else {
                //If out is not null, show cancel finish button.
                echo '<button class="cancelButton" type="submit" name="status" value="cancelOut">Cancel Finish</button>';
            }
        }
        echo '</form><hr />';
    }
    disconnect($link);
}

/**
 * Given the job, department and the status, log the status of that job for that
 * department in jobStatus.
 */
function logJob($docketNumber, $department, $status) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Couldn't connect to database.");
    }
    //If cancel query is requested, set null
    switch ($status) {
        case "cancelIn":
            $value = "NULL";
            $status = "In";
            break;
        case "cancelOut":
            $value = "NULL";
            $status = "Out";
            break;
        default:
            $value = "NOW()";
            //If we're loggin a job as complete and it is in the last department,
            //call send notification.
            if (isLastDepartment($docketNumber, $department) && $status == "Out") {
              
                readyForDeliverySlip($docketNumber);
            }
            //If we are not cancelling a job, send out notifications.
//            $jobName = getJobNameFrom($docketNumber);
//            sendEmailNotifications($docketNumber, $department . $status, $jobName);
    }
    $query = "UPDATE JobStatus SET {$department}{$status}={$value} WHERE DocketNumber={$docketNumber}";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    }
    //To return to the department page
//    header("Location: /Intranet/DepartmentFeed/{$department}.php");
//    To return to the departmentfeed page
    header("Location: /Intranet/DepartmentFeed/index.php");
    disconnect($link);
}

/**
 * Return true if the given department for the given docket number is the final
 * stage of the job's production.
 */
function isLastDepartment($docketNumber, $department) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Couldnt connect to DB");
    }

    $query = "SELECT * FROM JobInDepartments WHERE DocketNumber={$docketNumber}";

    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    }
    $row = mysql_fetch_array($result);
    $departments = array("DieMaking", "Press", "Stripping", "Gluing", "HandWork");
    /* The index in $departments where we want to check for whether it is assigned
     * to the job. */
    $startIndex = 0;
    switch ($department) {
        case "DieMaking":
            $startIndex = 1;
            break;
        case "Press":
            $startIndex = 2;
            break;
        case "Stripping":
            $startIndex = 3;
            break;
        case "Gluing":
            $startIndex = 4;
            break;
        case "HandWork":
            $startIndex = 5;
            break;
        default:
            fail2("Unrecognized department: " . $department);
    }
    //Check all the departments after the given department. If any of them is 
    //set to true then the given department isn't the last department.
    while ($startIndex < count($departments)) {
        if ($row[$departments[$startIndex]]) {
            return false;
        }        
        $startIndex++;
    }
    return true;
    disconnect($link);
}

/**
 * Given a Docket Number, log a blank entry into SlipStatus table.
 * This will be received by the Job Feed as a job ready for delivery slip.
 */
function readyForDeliverySlip($docketNumber) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Couldn't connect to database");
    }
    $query = "INSERT INTO SlipStatus (DocketNumber) VALUES ({$docketNumber})";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    }
}

?>
