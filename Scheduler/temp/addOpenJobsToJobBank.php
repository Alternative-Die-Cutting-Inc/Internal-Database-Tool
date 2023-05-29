<?php

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
if (!isset($_GET['department'])) {
    fail2("Department not set.");
} else {
    $department = $_GET['department'];
    switch ($department) {
        case "Main":
            $query = "SELECT DocketNumber 
                        FROM Production 
                        WHERE status='open' ORDER BY DocketNumber DESC";
            break;
        default:
            $query = "SELECT DocketNumber FROM (
                            (SELECT DocketNumber 
                                FROM Production 
                                WHERE status='open') as A
                                natural join
                            (SELECT DocketNumber 
                                FROM JobInDepartments 
                                WHERE " . $department . "=true) as B
                        ) ORDER BY DocketNumber DESC";
    }
    echo $query;
    $jobs = array("test");
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Failed to connect to database");
    }

    $result = mysql_query($query, $link);
    if (!$result) {
        fail2("Query failed: ". $query . " " . mysql_error());
    }

    while ($row = mysql_fetch_array($result)) {
        array_push($jobs, $row['DocketNumber']);
    }

    $jsonObject = json_encode($jobs);

    switch ($department) {
        case "main":
            $insertQuery = "INSERT INTO Schedule (Department, Day, Jobs) 
                            VALUES ('Main','JobBank', '" . mysql_real_escape_string($jsonObject) . "')
                            ON DUPLICATE KEY UPDATE Jobs='" .mysql_real_escape_string($jsonObject) . "'";
            break;
        default:
            $insertQuery = "INSERT INTO Schedule (Department, Day, Jobs) 
                            VALUES ('".$department."','JobBank', '" . mysql_real_escape_string($jsonObject) . "')
                            ON DUPLICATE KEY UPDATE Jobs='" .mysql_real_escape_string($jsonObject) . "'";
    }
    echo $insertQuery;

    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Failed to connect to database");
    }

    $result = mysql_query($insertQuery, $link);
    if (!$result) {
        fail2("Query failed: ". $insertQuery . " " . mysql_error());
    }
}
?>
