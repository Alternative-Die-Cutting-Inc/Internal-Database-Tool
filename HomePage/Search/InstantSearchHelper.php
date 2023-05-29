<?php

/* Used for searching in the main search box, not advanced search. May not need this file
much longer.
 * This file takes ajax requests to instant search related tasks.
 * 
 */

require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
require_once $_SERVER["DOCUMENT_ROOT"] . "/Intranet/DepartmentFeed/Backend/departmentProgressBarHelper.php";

if (!isset($_POST['type'])) {
    fail2("Type not set");
}

$type = $_POST['type'];
if (!isset($_POST['Category']) || !isset($_POST['Field']) || !isset($_POST['SearchString'])) {
    fail2("category/field/search string not set");
}

$header = "";

switch ($_POST['Category']) {
    case 'Quotes':
        $category = "Quote_Information";
        $header = "<tr>
            <th>Quote Number</th>
            <th>Customer</th>
            <th>Attention</th>
            <th>Job Name</th>
            <th>Description</th>
            <th>Notes</th>
            <th>Number of Units</th>
            <th>Total</th>
            <th>Date</th>
            <th>Action</th>
            </tr>";
        break;
    case 'Jobs':
        $category = "Production";
        $header = "<tr>
            <th>Docket Number</th>
            <th>Quote Number</th>
            <th>Customer PO Number</th>
            <th>Customer</th>
            <th>Production Person</th>
            <th>Job Name</th>
            <th>Finishing</th>
            <th>Special Instructions</th>
            <th>Number of Units</th>
            <th>Sold For</th>
            <th>Date</th>
            <th>Action</th>
            </tr>";
        break;
    default:
        fail2("unrecgonized category" . $_POST['Category']);
}
switch ($_POST['Field']) {
    case 'Quote Number':
        if ($category != "Production") {
            $field = "Quote_Number";
        } else {
            $field = "QuoteNumber";
        }
        break;
    case 'Customer':
        $field = "Customer";
        break;
    case 'Job Name':
        if ($category != "Production") {
            $field = "Job_Name";
        } else {
            $field = "JobName";
        }
        break;
    case 'Author':
        $field = "Author";
        break;
    case 'Docket Number':
        $field = "DocketNumber";
        break;
    case 'Customer PO Number':
        $field = "CustomerPoNo";
        break;
    default:
        fail2("unrecgonized field" . $_POST['Field']);
}
switch ($type) {

    //Expect an id and docket number to subscribe user to.
    case "get_total":
        echoTotalForQuery($category, $field, $_POST['SearchString']);
        break;
    case "execute_query":
        echo $header;
        echoQuery($category, $field, $_POST['SearchString']);
        break;
    default:
        fail2($type . " is not a recognized type.");
}

/**
 * Execute a search in the corresponding table with the given inputs
 * and return the total number of results.
 */
function echoTotalForQuery($category, $field, $searchString) {
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to database. ");
    }
    $query = "SELECT count(*) FROM {$category} WHERE {$field} LIKE '%{$searchString}%'";
    $result = mysql_query($query, $link);
    $row = mysql_fetch_array($result);
    echo $row["count(*)"];
    disconnect($link);
}

/**
 * Echo the query results in html form (for a table table)
 */
function echoQuery($category, $field, $searchString) {
    $start = $_POST['Start'];
    $stop = $_POST['Stop'];
    $link = connectToDatabase();
    if (!is_resource($link)) {
        fail2("Could not connect to database. ");
    }
    if ($category != "Production") {
        $number = "Quote_Number";
    } else {
        $number = "DocketNumber";
    }
    $query = "SELECT * FROM {$category} WHERE {$field} LIKE '%{$searchString}%' ORDER BY $number DESC Limit {$start}, {$stop}";
    echo $query;
    $result = mysql_query($query, $link);

    if ($result) {
        $alternator = true;
        while ($row = mysql_fetch_array($result)) {
            if ($category != "Production") {
                echo '<tr class="';
                if ($alternator) {
                    echo 'searchRow0';
                } else {
                    echo 'searchRow1';
                }
                $alternator = !$alternator;
                echo '"><td><a href="/Intranet/QuoteTool/index.php?QuoteNumber=' . $row['Quote_Number'] . '">' . $row["Quote_Number"] . "</a></td><td>" . $row["Customer"] . "</td><td>" . $row["Attention"] . "</td><td>" . $row["Job_Name"] . "</td><td>" . $row['Description'] . "</td><td>" . $row['Notes'] . "</td><td>" . $row['Number_of_Units'] . "</td><td>" . $row['Total'] . "</td><td>" . $row['Date'] . "</td>" . '<td><a href="/Intranet/QuoteTool/indexClone1.php?QuoteNumber=' . $row['Quote_Number'] . '">Client Sheet</a>
                    <br><a href="/Intranet/QuoteTool/indexClone2.php?QuoteNumber=' . $row['Quote_Number'] . '">Work Sheet</a>' . "</td></tr>";
            } else {
                echo '<tr class="';
                if ($alternator) {
                    echo 'searchRow0';
                } else {
                    echo 'searchRow1';
                }
                $alternator = !$alternator;
                echo '"><td>
                    <a href="/Intranet/ShippingTool/Production.php?DocketNumber=' . $row['DocketNumber'] . '">' . $row["DocketNumber"]
                . "</a></td>" . "<td><a href='/Intranet/QuoteTool/index.php?QuoteNumber=".$row['QuoteNumber']."'>" . $row['QuoteNumber'] . "</a></td>" . "<td>" . $row['CustomerPoNo'] . "</td>" . "<td>" . $row['Customer'] . "</td>" . "<td>" . $row['ProductionPerson'] . "</td>" . "<td>" . $row['JobName'] . "</td>" . "<td>" . $row['Finishing'] . "</td>" . "<td>" . $row['SpecialInstructions'] . "</td>" . "<td>" . $row['Quantity'] . "</td>" . "<td>" . $row['FinalPrice'] . "</td>" . "<td>" . $row['Date'] . "</td>";
                //Action
                echo '<td>
                        <a href="/Intranet/ShippingTool/Production.php?DocketNumber=' . $row['DocketNumber'] . '">Production</a>
                        <a href="/Intranet/ShippingTool/shipping.php?DocketNumber=' . $row['DocketNumber'] . '">Shipping</a>
                        <a href="/Intranet/ShippingTool/JobSummary.php?DocketNumber=' . $row['DocketNumber'] . '">Summary</a>
                        ' . "</td></tr>";
            }
        }
    } else {
        echo "Could not execute query:" . $query . " " . mysql_error();
    }
    disconnect($link);
}

?>
