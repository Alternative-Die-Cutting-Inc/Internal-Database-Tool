<?php
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

function getSkidTotal($SessId) {
	$link = connectToDatabase();
	if (!is_resource($link)) {
		fail2("could not connect to the database. ");
	}
	$query = "Select * From Slip WHERE SessId=" . $SessId;
	$result = mysql_query($query, $link);
	if (!$result) {
		echo "fail";
		fail2("query failed: " . $query . " " . mysql_error());
	}
	$total = 0;
	while ($row = mysql_fetch_array($result)) {
		$total += $row['NoOfSkids'];
	}
	return $total;
}

$link = connectToDatabase();
if (!is_resource($link)) {
	fail2("could not connect to the database. ");

}
$query = "SELECT * FROM 
				(SELECT * FROM SlipStatus WHERE (
				('DateOut' IS NOT NULL) 
				AND
				(TO_DAYS(DateOut)>=TO_DAYS(NOW())-13)
					)) as A
				NATURAL join
				Production ORDER BY DateOut";
$result = mysql_query($query, $link);
if (!$result) {
	echo "fail";
	fail2("query failed: " . $query . " " . mysql_error());
}
$table = "<table border=1px>";
	$table .= "<tr>";
	$table .= "<th>Docket</th>";
	$table .= "<th>Job Name</th>";	
	$table .= "<th>Company</th>";
	$table .= "<th>PickUp Date</th>";
		$table .= "<th>PickUp Time</th>";
	$table .= "<th># Of Skids</th>";
	$table .= "</tr>";
while($row = mysql_fetch_array($result)) {
	$DocketNumber = $row['DocketNumber'];
	$JobName = $row['JobName'];
	$Company = $row['Customer'];
	$Date = $row['DateOut'];
	$Time = $row['TimeOut'];
	$Skids = getSkidTotal($row['SessId']);
	$table .= "<tr>";
	$table .= '<td><a href="/Intranet/ShippingTool/Production.php?DocketNumber=' . $DocketNumber . '">' . $DocketNumber . '</a></td>';
	$table .= "<td>" . $JobName . "</td>";
	$table .= "<td>" . $Company . "</td>";
	$table .= "<td>" . $Date . "</td>";
	$table .= "<td>" . $Time . "</td>";
	$table .= "<td>" . $Skids . "</td>";
	$table .= "</tr>";	
}
$table .= "</table>";
echo $table;
?>