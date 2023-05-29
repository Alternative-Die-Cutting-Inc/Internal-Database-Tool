<?php
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

$link = connectToDatabase();
if (!is_resource($link)) {
	fail2("could not connect to the database. ");
}

$query = "SELECT * FROM SlipStatus WHERE (
				('DateOut' IS NOT NULL) 
				AND
				(TO_DAYS(DateOut)>=TO_DAYS(NOW())-13)
					)";		
$result = mysql_query($query, $link);
if (!$result) 
	fail2("query failed: " . $query . " " . mysql_error());
}
$table = "<table>";
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
	$Date = $row['DateOut'];
	$Time = $row['TimeOut'];
	$table .= "<tr>";
	$table .= "<td>" . $DocketNumber . "</td>";
	$table .= "<td>" .  . "</td>";
	$table .= "<td>" .  . "</td>";
	$table .= "<td>" . $Date . "</td>";
	$table .= "<td>" . $Time . "</td>";
	$table .= "<td>" .  . "</td>";
	$table .= "</tr>";	
}
$table .= "</table>";
echo $table;
?>