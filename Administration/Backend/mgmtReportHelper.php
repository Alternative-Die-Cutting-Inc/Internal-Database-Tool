<?php

require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/backendHelper.php";
require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/xmlHelper.php";
require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/loginHelper.php";

ob_start();

if (isset($_POST['type'])) {
    switch ($_POST['type']) {
        case "load_open_dockets":
            loadOpenDockets();
            break;
        default:
            fail("Invalid type set:{$_POST['type']}", true);
            break;
    }
} else {
    fail("Type not set", true);
}

ob_flush();

/**
 * Load the open dockets.
 */
function loadOpenDockets() {
    $link = connectToDatabase();

    if (is_resource($link)) {
//        $openDocketNumbers = getOpenDocketNumbers($link);
        getOpenDocketNumbers($link);
        disconnect($link);
        
//        printDocketInfo($openDocketNumbers);
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Print the docket info.
 * @param array $docketNumbers A numeric array of numbers.
 */
function printDocketInfo($docketNumbers) {
    echo "<parent>";
    
    foreach($docketNumbers as $dn) {
        echo "<row>";
        
        printField("DocketNumber", $dn);
        
        echo "</row>";
    }
    
    echo "</parent>";
}

/**
 * Print out the information about open dockets.
 * @param resource $link The link to the database.
 * @return array Return a numeric array of numbers which are open docket
 * numbers.
 */
function getOpenDocketNumbers($link) {
    $numbers = array();
    $date = date("Y-m");
    $query = "SELECT Customer, Date AS DateOpened, DocketNumber, JobName, FinalPrice AS Price
FROM Production WHERE Status='open' ORDER BY Date DESC";

    //  Date LIKE '{$date}-%' AND 

    if (is_resource($link)) {
        if (($result = mysql_query($query))) {
            echo "<parent>";
            
            while ($row = mysql_fetch_array($result)) {
                echo "<row>";
                
                foreach($row as $key => $val) {
                    if(!is_numeric($key)) {
                        printField($key, $val);
                    }
                }
                
                echo "</row>";
            }
            
            echo "</parent>";
        }
    }

    return $numbers;
}

?>
