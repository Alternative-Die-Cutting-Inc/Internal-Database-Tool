<?php

/*
 * This file contains the helper methods to generate the department
 * progress bar per job.
 * 
 * Whoever calls these functions must have /Intranet/Resources/Backend/loginHelper.php &
 * /Intranet/Resources/Backend/backendHelper.php
 * 
 * Written by Peter Tran Oct 1st 2012.
 */

//require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
//require $_SERVER["DOCUMENT_ROOT"] . "/Intranet/Resources/Backend/backendHelper.php";

/**
 * Given the docket number, echo the progress bar.
 * If there are no relevant assignments, echo nothing.
 */
function displayProgressBar($DocketNumber) {
    
    //Get the relevant departments first. 
    $relevantDepartmentsArray = getRelevantDepartments($DocketNumber);
    /**
     * Echo the progress bar with only the relevant departments.
     * (Break into helper function)
     */
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Couldn't connect to database.");
    }
    $relevantDepartmentQuery = getRelevantDepartmentQuery($relevantDepartmentsArray, $DocketNumber);
    if (!$relevantDepartmentQuery) {
        return;
    }
    $result = mysql_query($relevantDepartmentQuery, $link);
    if (!$result) {
        fail2("Query Failed: " . $relevantDepartmentQuery . " " . mysql_error());
    }
    $row = mysql_fetch_array($result);

    //Create the table that represents the progress bar.
    //We need to keep track of which jobs are finished and the last one
    //because the styling of the table relies on the last completed job.
    //This code can be simplified if another CSS pattern is adopted.
    $lastDepartmentComplete = getLastFinishedDepartment($row);
    $numberOfCompletedDepartments = numberOfCompletedJobs($row);
    echo '<table width="100%" cellspacing="0"><tr>';
    for ($i = 0; $i < $numberOfCompletedDepartments; $i++) {
        echo '<td class="' . $lastDepartmentComplete . 'Complete" />';
    }
    echoRemainingDepartments($lastDepartmentComplete, $DocketNumber);
    echo '</tr></table>';
}

/**
 * Given a docket number, return the row in JobInDepartments with that docket
 * number.
 */
function getRelevantDepartments($DocketNumber) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Couldn't connect to database.");
    }
    $relevantDepartmentsQuery = "Select * From JobInDepartments Where DocketNumber={$DocketNumber}";
    $relevantDepartmentsResult = mysql_query($relevantDepartmentsQuery, $link);
    if (!$relevantDepartmentsResult) {
        fail2("Query Failed: " . $relevantDepartmentsQuery . " " . mysql_error());
    }
    disconnect($link);
    return mysql_fetch_array($relevantDepartmentsResult);
}

/**
 * Given an array from JobInDepartments and a docket number, 
 * return the query that would extract the
 * relevant job info from JobStatus. Return null if there are no relevant 
 * departments assigned.
 * $RDA = relevant department array
 */
function getRelevantDepartmentQuery($RDA, $DocketNumber) {
    $query = "Select ";
    if (isset($RDA["DieMaking"]) && ($RDA["DieMaking"] == true)) {
        $query .= "DieMakingIn, DieMakingOut, ";
    }
    if (isset($RDA["Press"]) && ($RDA["Press"] == true)) {
        $query .= "PressIn, PressOut, ";
    }
    if (isset($RDA["Stripping"]) && ($RDA["Stripping"] == true)) {
        $query .= "StrippingIn, StrippingOut, ";
    }
    if (isset($RDA["Gluing"]) && ($RDA["Gluing"] == true)) {
        $query .= "GluingIn, GluingOut, ";
    }
    if (isset($RDA["HandWork"]) && ($RDA["HandWork"] == true)) {
        $query .= "HandWorkIn, HandWorkOut, ";
    }
    if ($query == "Select ") {
        return null;
    }

    $query = substr($query, 0, strlen($query) - 2);
    $query .= " FROM JobStatus WHERE DocketNumber={$DocketNumber}";

    return $query;
}

/**
 * Given an array from JobStatus, return the last department that has been
 * finished. If no department is finished, return the string "none".
 */
function getLastFinishedDepartment($jobStatusResult) {
    if (isset($jobStatusResult["HandWorkOut"]) && $jobStatusResult["HandWorkOut"] != NULL) {
        return "HandWork";
    }
    if (isset($jobStatusResult["GluingOut"]) && $jobStatusResult["GluingOut"] != NULL) {
        return "Gluing";
    }
    if (isset($jobStatusResult["StrippingOut"]) && $jobStatusResult["StrippingOut"] != NULL) {
        return "Stripping";
    }
    if (isset($jobStatusResult["PressOut"]) && $jobStatusResult["PressOut"] != NULL) {
        return "Press";
    }
    if (isset($jobStatusResult["DieMakingOut"]) && $jobStatusResult["DieMakingOut"] != NULL) {
        return "DieMaking";
    }
    return "none";
}

/**
 * Given an array from JobStatus, return the number of completed jobs.
 */
function numberOfCompletedJobs($row) {
    $total = 0;
    if (isset($row["HandWorkOut"]) && $row["HandWorkOut"] != NULL) {
        $total++;
    }
    if (isset($row["GluingOut"]) && $row["GluingOut"] != NULL) {
        $total++;
    }
    if (isset($row["StrippingOut"]) && $row["StrippingOut"] != NULL) {
        $total++;
    }
    if (isset($row["PressOut"]) && $row["PressOut"] != NULL) {
        $total++;
    }
    if (isset($row["DieMakingOut"]) && $row["DieMakingOut"] != NULL) {
        $total++;
    }
    return $total;
}

/**
 * Given the last department complete and the docket number,
 * echo the remaining table cells that are not complete.
 */
function echoRemainingDepartments($lastDepartmentComplete, $DocketNumber) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Couldnt connect to database");
    }
    $query = "SELECT DieMaking, Press, Stripping, Gluing, HandWork FROM JobInDepartments WHERE DocketNumber={$DocketNumber}";
    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    }
    $row = mysql_fetch_array($result);
    $reachedLastDepartment = false;
    if ($lastDepartmentComplete == "none") {
        $reachedLastDepartment = true;
    }
    foreach ($row as $department => $value) {
        if (is_numeric($department)) {
            continue;
        }
        if ($department == $lastDepartmentComplete) {
            $reachedLastDepartment = true;
            continue;
        }
        if ($reachedLastDepartment) {
            if ($value) {
                echo '<td class="' . $department . '" />';
            }
        }
    }
}

?>
