<?php
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/xmlHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";

if(isset($_POST['type'])) {
    ob_start();
    
    switch($_POST['type']) {
        case "load":
            if(isset($_POST['DocketNumber']) && is_numeric($_POST['DocketNumber'])) {
                load($_POST['DocketNumber']);
            } else {
                fail("Docket number not properly set", true);
            }
            
            break;
        case "save":
            break;
        default:
            fail("Type not properly set: {$_POST['type']}", true);
            break;
    }
    
    ob_flush();
} else {
    fail("Type not set", true);
}


function load($dn) {
    if (!isset($dn) || !is_numeric($dn)) {
        fail("Docket number not properly set", true);
    }

    $link = connectToDatabase();

    if (is_resource($link)) {
        printCharges($link, $dn);
    } else {
        fail("Could not connect to database", false);
    }
}

function printCharges($link, $dn) {
    if (!is_resource($link)) {
        return;
    }

    $query = "SELECT Subject AS chargeName,
                Cost AS chargeAmt, 
                Description AS chargeNotes
                FROM ExtraCharges
                WHERE DocketNumber={$dn}";

    if (($result = mysql_query($query))) {
        echo "<parent>"; //start XML wrapper

        while ($row = mysql_fetch_array($result)) {
            echo "<row>";

            foreach ($row as $field => $val) {
                if (!is_numeric($field)) {
                    printField($field, $val);
                }
            }

            echo "</row>";
        }

        echo "</parent>"; //close XML wrapper
    } else {
        fail("SQL query failed with query: {$query}", false);
    }
}

?>
