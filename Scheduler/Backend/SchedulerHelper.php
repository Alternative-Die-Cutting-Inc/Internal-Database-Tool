<?php

/*
 * This file handles all the ajax requests to the database in regards
 * to the scheduler appdivcation.
 * */
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

if (!isset($_POST['type'])) {
    fail2("Type not set");
}

switch ($_POST['type']) {
    case "get_navigation":
        getNavigation();
        break;
    case "generate_containers":
        if (!isset($_POST['department'])) {
            fail2("Department is not set");
        }
        generateContainers($_POST['department']);
        break;
    case "get_current_containers":
        getCurrentContainers();
        break;    
    case "get_jobs_for_day":
        if (!isset($_POST['day']) || !isset($_POST['department'])) {
            fail2("Day is not set");
        }
        getJobsForDay($_POST['day'], $_POST['department']);
        break;    
    case "save_day_schedule":
        if (!isset($_POST["day"]) 
            || !isset($_POST["jsonJobs"])
            || !isset($_POST["department"])) {
            fail2("day or jsonjobs or department not set");
        }
        saveDaySchedule($_POST["day"], $_POST["jsonJobs"], $_POST['department']);
        break;
    case "save_notes":
        if (!isset($_POST["docketNumber"]) 
            || (!isset($_POST['notes']))
            || (!isset($_POST['user']))) {
            fail2("Docket number, user or notes not set. ");
        }
        saveNotes($_POST['docketNumber'], $_POST['notes'], $_POST['user']);
        break;
    case "lock_job":
        if (!isset($_POST["docketNumber"]) || !isset($_POST['value'])) {
            fail2("Docket number or value not set. ");
        }
        lockJob($_POST['docketNumber'], $_POST['value']);
        break;
    case "update_jobbank":
        if(!isset($_POST['DocketNumber']) || (!isset($_POST['departmentInformation']))) {
            fail2("Department Info not set or Docket Number not set. ");
        }
        updateJobBank($_POST['DocketNumber'], $_POST['departmentInformation']);
        break;
    default:
        fail2("Type not recognized: " . $_POST['type']);
}

/*
 Get navigation.
 */
function getNavigation() {
    $html = '';
    $html .= '<div id="navigation">';
    $html .= '<a href="index.php"><div id="Main" class="navigationButton">Main</div></a>';
    $html .= '<a href="DieMaking.php"><div id="DieMaking" class="navigationButton">Die Making</div></a>';
    $html .= '<a href="Press.php"><div id="Press" class="navigationButton">Press</div></a>';
    $html .= '<a href="Gluing.php"><div id="Gluing" class="navigationButton">Gluing</div></a>';
    $html .= '<a href="Stripping.php"><div id="Stripping" class="navigationButton">Stripping</div></a>';
    $html .= '<a href="HandWork.php"><div id="HandWork" class="navigationButton">HandWork</div></a>';
    $html .= '</div>';
    echo $html;
}

/**
 * Echo the containers for the scheduler:
 *   -job bank
 *   -this weeks jobs
 *   -next week, next^2 week, next^3 week
 *   -monday-saturday for the current week
 */
function generateContainers($department) {

    $thisWeek = get_week_n(0);
    $nextWeek = get_week_n(1);
    $next2Week = get_week_n(2);
    $html = '<div class="weekButton" id="jobBank">Job Bank</div>';
    $html .= '<div class="weekButton" id="thisWeek">This Week</div>';
    $html .= '<div class="weekButton" id="nextWeek">Next Week</div>';
    $html .= '<div class="weekButton" id="next2Week">Next Next Week</div>';
    $html .= '<li id="draggable" class="ghostJob">
    <input type="hidden" class="DocketNumber">
        <span class="dismiss">
        <div class="icomoon" aria-hidden="true" data-icon=""></div>
        </span>';
    $html .= '<br />';
    $html .= '<div class="nodocket">
    <textarea class="notes"></textarea>
    </div>';
    $html .= '<div class="ghostSave" aria-hidden="true" data-icon=""></div>
    </li>';
    $html .= '<div class="weekButton" id="refreshJobBank">';
    $html .= '  <form target="_blank" action="temp/addOpenJobsToJobBank.php" type="POST">';
    $html .= '      <input type="hidden" name="department" value="' . $department . '">';
    $html .= '      <input type="submit" value="Refresh Job Bank">';
    $html .= '  </form>';
    $html .= '</div>';

    $html .= '<div id="JobBankContainer"><div id="JobBank" class="sortable jobBank"></div></div>';
    $html .= '<div id="' . $thisWeek . '" class="sortable week thisWeek"></div>';
    $html .= '<div id="' . $nextWeek . '" class="sortable week nextWeek"></div>';
    $html .= '<div id="' . $next2Week . '" class="sortable week next2Week"></div>';

    $html .= '<div id="daysOfWeek">
                    <div id="innerDaysOfWeek">';
    $html .= '<div id="'.$thisWeek.'Monday" class="sortable monday sortableDay">Monday</div>';
    $html .= '<div id="'.$thisWeek.'Tuesday" class="sortable tuesday sortableDay"></div>';
    $html .= '<div id="'.$thisWeek.'Wednesday" class="sortable wednesday sortableDay"></div>';
    $html .= '<div id="'.$thisWeek.'Thursday" class="sortable thursday sortableDay"></div>';
    $html .= '<div id="'.$thisWeek.'Friday" class="sortable friday sortableDay"></div>';
    $html .= '<div id="'.$thisWeek.'Saturday" class="sortable saturday sortableDay"></div>';
    $html .= '      </div>
            </div>';
    echo $html;
}

/**
 * Return a javascript array of containers to be updated.
 */
function getCurrentContainers() {
    $containers = array();
    array_push($containers, 'JobBank');
    $thisWeek = get_week_n(0);
    array_push($containers, $thisWeek);
    array_push($containers, get_week_n(1));
    array_push($containers, get_week_n(2));
    array_push($containers, get_week_n(3));
    array_push($containers, $thisWeek.'Monday');
    array_push($containers, $thisWeek.'Tuesday');
    array_push($containers, $thisWeek.'Wednesday');
    array_push($containers, $thisWeek.'Thursday');
    array_push($containers, $thisWeek.'Friday');
    array_push($containers, $thisWeek.'Saturday');
    echo json_encode($containers);
}

/**
 * Given a day, echo the job divs for the jobs saved in that day.
 */
function getJobsForDay($day, $department) {

    echo '<span class="date">'.formatDay($day)."</span>";
    $query = "SELECT * FROM Schedule WHERE Day='" . $day . "' AND Department='" . $department . "'";
    $row = mysql_fetch_array(runQuery($query));
    if ($row) {
        $jobArray = json_decode($row['Jobs']);
        foreach ($jobArray as $job) {
            if ($job != "") {
                if (is_numeric($job)) {
                    echoJobDiv($job);                    
                } else {
                    echoGhostDiv($job);
                }                                
            }
        }
    }
}

/**
 * Given a docket number, echo the div representing the job
 */
function echoJobDiv($DocketNumber) {
    // $query = "SELECT * From Production WHERE DocketNumber='" . $DocketNumber . "'";
    $query = "SELECT * FROM (SELECT * From Production WHERE DocketNumber='" . $DocketNumber . "') as A LEFT JOIN SchedulerInfo ON A.DocketNumber = SchedulerInfo.DocketNumber";
    $row = mysql_fetch_array(runQuery($query));
    if ($row['Locked']) {
        $locked = "locked";
    } else {
        $locked = "unlocked";
    }
    $div = '';
    $div .= '<li class="draggable sortableJob '.$locked.'">
    <input type="hidden" value="'.$DocketNumber.'" class="DocketNumber">
        <span class="dismiss"><div class ="icomoon" aria-hidden="true" data-icon=""></div></span>
        <div class="unlock" aria-hidden="true" data-icon=""></div>
        <div class="lock" aria-hidden="true" data-icon=""></div>
        <div class="copy" aria-hidden="true" data-icon=""></div>
        <a href="workorderPreview.php?DocketNumber='.$DocketNumber.'" rel="ibox" title="Loading External HTML File using AJAX" >
            <div class="expand" aria-hidden="true" data-icon="&#xe006;"></div>
        </a>
        <br>
        <span class="company">'.$row['Customer'].'</span><br>
        <span class="jobName">' . $row['JobName']
            . '</span><br />' . $DocketNumber;
    $div .= '<br />';
    $div .= '<div class="'.$DocketNumber.'">
    '.loadNotes($DocketNumber).'
    <br>
    <input type="test" class="notes"></input>
    </div>';
    $div .= '<div class="saveButton" aria-hidden="true" data-icon=""></div>
    </li>';
    echo $div;
}

/**
 * Given the string representing the ghost div, echo it.
 */ 
function echoGhostDiv($Notes) {
    $div = '';
    $div .= '<li class="draggable ghostJob sortableJob">
    <input type="hidden" class="DocketNumber" value="'.$Notes.'">
        <span class="dismiss"><div class="icomoon" aria-hidden="true" data-icon=""></div></span>
        <div class="copy" aria-hidden="true" data-icon=""></div>
        <br>';
    $div .= '<div class="'.$Notes.'">
    <textarea class="notes">' . $Notes . '</textarea>
    </div>';
    $div .= '<div class="ghostSave" aria-hidden="true" data-icon=""></div>
    </li>';
    echo $div;
}

/**
 * Given the a day and a json array, insert it into the mysql table
 * or update if an entry for that day already exists.
 */
function saveDaySchedule($day, $docketNumbers, $department) {
    $jsonArray = explode(",", $docketNumbers);
    $jsonEncoded = json_encode($jsonArray);
    $divnk = connectToDatabase();
    if (!is_resource($divnk)) {
        fail2("Could not connect to database. ");
    }
    $query = "INSERT INTO Schedule (Department, Day, Jobs) VALUES ('" . $department . "','" . $day . "', '" . $jsonEncoded . "')
        ON DUPLICATE KEY Update Jobs='" . $jsonEncoded . "'";
    $result = mysql_query($query, $divnk);
    if (!$result) {
        fail2("Query failed: " . $query . " " . mysql_error());
    } else {
        echo "Query successful: " . $query;
    }
}

/**
 * Given a docket number and notes, save that note to the database
 */
function saveNotes($docketNumber, $notes, $user) {
    $query = "INSERT INTO DocketChat (DocketNumber, Date, Time, User, Message) VALUES (".$docketNumber.", CURRENT_DATE(), NOW(), '".$user."','".$notes."')";
    $result = runQuery($query);
    if ($result) {
        echo $query;
        echo $docketNumber;
    } else {
        echo mysql_error();
    }
}

/**
 * Given a docket number, set the job as locked if value is 1,
 * set unlocked if 0.
 */
function lockJob($docketNumber, $value) {
    $query = "INSERT INTO SchedulerInfo (DocketNumber, Locked) VALUES (" . $docketNumber . ", ".$value.")
    ON DUPLICATE KEY UPDATE Locked=" . $value;
    if (runQuery($query)) {
        echo $query;
    } else {
        echo "nope.";
    }
}

/**
 * Given an array representing department assignments for a given docket number,
 * update the corresponding job bank for that job.
 */
function updateJobBank($DocketNumber, $departmentInformation) {
    $departments = array("DieMaking", "Press", "Stripping", "Gluing", "HandWork");
    foreach($departments as $department) {
        if ($departmentInformation[$department] == "true") {
            addDocketToJobBank($DocketNumber, $department);
        }
    }
}

// Stand alone helper functions not called by AJAX.
/**
 * Given a docket number, add it to the job bank of the givne department.
 */
function addDocketToJobBank($docketNumber, $department) {
    $getJobBankQuery = "SELECT Jobs FROM Schedule WHERE Day='JobBank' AND Department='" . $department . "'";
    $jobBankResult = runQuery($getJobBankQuery);
    $row = mysql_fetch_array($jobBankResult);
    if (!$row) {
        echo "No results from query: " . $getJobBankQuery;
    }
    $jobs = json_decode($row['Jobs']);
    array_unshift($jobs, $docketNumber);
    $jsonObject = json_encode($jobs);
    $link = connectToDatabase();
    if (!is_resource($link)) {
        echo "Could not connect to database. ";
    }
    $insertQuery = "UPDATE Schedule Set Jobs='" . mysql_real_escape_string($jsonObject) . "'
    WHERE Day='JobBank' AND Department='".$department."'";
    $result = mysql_query($insertQuery, $link);
    if (!$result) {
        echo "Query failed: " . $insertQuery . " " . mysql_error();
    } else {
        echo "Query success: " . $insertQuery;
    }
}

/**
 * Get the YEARWEEK value of the week n weeks from now.
 * I.E. 0 = this week, 1 = next week, 2 = next next week.
 */
function get_week_n($n) {
    if ($n == 0) {
        $query = "SELECT YEARWEEK(CURRENT_DATE) as Week";
    } else {
        $query = "SELECT YEARWEEK(CURRENT_DATE + INTERVAL " . 7 * $n ." DAY) as Week";
    }    
    $result = runQuery($query);
    $row = mysql_fetch_array($result);
    if ($row) {
        return $row['Week'];
    }
}

/**
 * Return the formatted version of the given day.
 * Example: 201246Monday returns "Monday, Nov 16th"
 **/
function formatDay($day) {
    if ($day == "JobBank") {
        return "Job Bank";
    }
    $dayOfWeek = substr($day, 6, strlen($day)); // E {monday, tuesday, wednesday ..}
    $year = (int) substr($day, 0, 4); // E {2012, 2013}
    $week = substr($day, 4, 5); // E {1, 2, ..., 52}
    date_default_timezone_set("America/Winnipeg");  

    $day1=mktime(0,0,0,1,1,$year)+(($week-1)*7*86400);
    $count = 0;
    if (strlen($day) == 6) {
        $string= strftime("%A, %b %e %Y",$day1+(1*86400)) . " - " . 
                 strftime("%A, %b %e %Y",$day1+(6*86400));
    } else {
        switch ($dayOfWeek) {
            case "Monday":
                $count=1;
                break;
            case "Tuesday":
                $count=2;       
                break;
            case "Wednesday":
                $count=3;   
                break;
            case "Thursday":
                $count=4;
                break;
            case "Friday":
                $count=5;
                break;
            case "Saturday":
                $count=6;
                break;
            case "Sunday":
                $count=7;
                break;
    }
    $string=strftime("%A, %b %e %Y",$day1+($count*86400));}
    return "$string";
}

/*
 * Given a docket number, return the notes for that job.
 */
function loadNotes($docketNumber) {
    $query = "SELECT * FROM DocketChat WHERE DocketNumber=" . $docketNumber;
    $result = runQuery($query);
    $answer = "";
        date_default_timezone_set("America/Winnipeg");
    while($row = mysql_fetch_array($result)) {
        $answer .= "<div class='messageBox'>
        <span class='message'>".$row['Message']."</span>
        <br>
        <span class='user'>".$row['User']."</span><br>
        <span class='messageTime'>".date("g:ia", strtotime($row['Time']))."</span>
        <span class='messageDate'>".date("D dS", strtotime($row['Date']))."</span>
        </div>";
    }
    return $answer;
}

/**
 * Given a docket number and a department, update that department's job bank
 * with the given docket number.
 */
?>