<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

$link = mysqli_connect("localhost", "alterna_morgan", "alternativetaipan", "alterna_area51");
if (!$link) {
    die("Connection failed: " . mysqli_connect_error());
}

function getOpenJobSummary() {
    date_default_timezone_set("America/Toronto");
    
    global $link;

    $total = 0;

    $query = "SELECT * FROM Production WHERE Status='open' ORDER BY Date DESC";
    $result = mysqli_query($link, $query);

    echo "<table>";
    while ($row = mysqli_fetch_array($result)) {
        $date = $row['Date'];
        $docket_number = $row['DocketNumber'];
        $customer = $row['Customer'];
        $job_name = $row['JobName'];
        $amount = $row['FinalPrice'];
    ?>
        <tr>
            <td class="sumDate"><?php echo date("M d, y", strtotime($date));?></td>
            <td class="sumDockNum"><?php echo $docket_number;?></td>
            <td><?php echo $customer;?></td>
            <td><?php echo $job_name;?></td>
            <td class="sumAmount"><?php echo number_format($amount);?></td>           
        </tr>
    <?php
        $total += $amount;
    }
    echo "</table>";

    return $total;
}

function getTotals() {
    global $total;
    $total = getOpenJobSummary();
    ?>
    <table >
        <tr>
            <td>
                <h3 class="totalsTable">Total:<h3/>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <h3 class="totalsTable"><?php echo number_format($total);?></h3>
            </td>
        </tr>
    </table>
    <?php
}

$total = 0;
getOpenJobSummary();
getTotals();

mysqli_close($link);
?>

