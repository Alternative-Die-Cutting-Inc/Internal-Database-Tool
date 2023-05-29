<?php
/**
 *Written by Peter Tran Nov 27th, 2012
 *This file handles ajax requests from search.js for advanced searches.
 **/


require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";
if (!isset($_POST["type"])) {
	fail2("Type not set. ");
}

switch ($_POST["type"]) {
    case "perform_search":
        performSearch($_REQUEST['fields'], $_POST['start'], $_POST['stop']);
        break;  
    case "perform_quote_search":
        performQuoteSearch($_REQUEST['fields'],$_POST['start'], $_POST['stop']);
        break;
	default:
		fail2("Unrecognized type: " . $_POST["type"]);
}

function performSearch($fields, $startSearch, $stopSearch) {

    //Need to natural join with Forms table if searching for forms.
    if ($fields['Form']) {
        $searchForms = "natural left join Forms";
    } else {
        $searchForms = "";
    }

	//Build query
	$query = "SELECT * FROM Production ".$searchForms." WHERE ";
	
	foreach ($fields as $field => $value) {
		if ($value != "") {
			$query .= " (" . $field . " LIKE \"%" . $value. "%\" ) AND";
		}
	}
	$query = substr($query, 0, strlen($query)-3);
	$query .= " ORDER BY DocketNumber DESC Limit ".$startSearch.",".$stopSearch;

	$result = runQuery($query);
	echo "<tr>
            <th>Docket Number</th>
            <th>Quote Number</th>
            <th>Customer PO</th>
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
    echo $query;
	$alternator = true;
	while ($row = mysql_fetch_array($result)) {
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

function performQuoteSearch($fields, $startSearch, $stopSearch) {
        //Build query
    $query = "SELECT * FROM Quote_Information WHERE ";
    
    foreach ($fields as $field => $value) {
        if ($value != "") {
            $query .= " (" . $field . " LIKE \"%" . $value. "%\" ) AND";
        }
    }
    $query = substr($query, 0, strlen($query)-3);
    $query .= " ORDER BY Quote_Number DESC Limit ".$startSearch.",".$stopSearch;
    $result = runQuery($query);
    echo "<tr>
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
    $alternator = true;
    while ($row = mysql_fetch_array($result)) {
        echo '<tr class="';
                if ($alternator) {
                    echo 'searchRow0';
                } else {
                    echo 'searchRow1';
                }
                $alternator = !$alternator;
                echo '"><td><a href="/Intranet/QuoteTool/index.php?QuoteNumber=' . $row['Quote_Number'] . '">' . $row["Quote_Number"] . "</a></td><td>" . $row["Customer"] . "</td><td>" . $row["Attention"] . "</td><td>" . $row["Job_Name"] . "</td><td>" . $row['Description'] . "</td><td>" . $row['Notes'] . "</td><td>" . $row['Number_of_Units'] . "</td><td>" . $row['Total'] . "</td><td>" . $row['Date'] . "</td>" . '<td><a href="/Intranet/QuoteTool/indexClone1.php?QuoteNumber=' . $row['Quote_Number'] . '">Client Sheet</a>
                    <br><a href="/Intranet/QuoteTool/indexClone2.php?QuoteNumber=' . $row['Quote_Number'] . '">Work Sheet</a>' . "</td></tr>";
            
    }
}

?>