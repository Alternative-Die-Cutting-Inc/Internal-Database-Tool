<?php
/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on August 18, 2011
 * ---------------------------------------------------------------------------
 * This page allows editing of shipments
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

//other imports
require "{$_SERVER['DOCUMENT_ROOT']}Intranet/Resources/Backend/loginHelper.php";
require "{$_SERVER['DOCUMENT_ROOT']}Intranet/Resources/Backend/backendHelper.php";
require "{$_SERVER['DOCUMENT_ROOT']}Intranet/Resources/Backend/xmlHelper.php";

ob_start();

if(isset($_POST['type'])) {
    switch($_POST['type']) {
        case "load":
            if(isset($_POST['DocketNumber'])) {
                fetchShipments($_POST['DocketNumber']);
            } else {
                fail("Docket number not set", true);
            }

            break;
        case "delete":
            if(isset($_POST['ShipmentId'])) {
                deleteShipment($_POST['DocketNumber']);
            } else {
                fail("Docket number not set", true);
            }

            break;
        default:
            fail("Invalid type: {$_POST['type']}", true);
            break;
    }

    
}
else {
    fail("Type not set", true);
}

ob_flush();

function deleteShipment($id) {
    echo "complete";
}

function fetchShipments($docketNumber) {
    if(!isset($docketNumber) || !is_numeric($docketNumber)) {
        fail("Docket number incorrectly set", true);
    }

    $link = connectToDatabase();

    if(is_resource($link)) {
        $result = printShipments($link, $docketNumber);
        disconnect($link);

        if($result === false) {
            fail("Could not fetch a shipment list", false);
        }


    } else {
         fail("Could not connect to database", false);
    }
}

//each slip will be bound to an id

function printShipments($link, $docketNumber) {
    if(!isset($link) || !isset($docketNumber) || !is_resource($link) ||
            !is_numeric($docketNumber)) {
        return false;
    }

    $query = "SELECT * FROM Slip WHERE DocketNumber={$docketNumber}";
    $result = mysql_query($query, $link);

    if($result) {
        echo "<parent>\n";

        while($row = mysql_fetch_array($result)) {
            echo "\t<row>\n";

            foreach($row as $key => $val) {
                if(!is_numeric($key)) {
                    echo "\t";
                    printField($key, $val);
                }
            }

            echo "\t</row>\n";
        }

        echo "</parent>\n";
    } else {
        return false;
    }
}

?>
