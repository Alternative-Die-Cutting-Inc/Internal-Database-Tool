<?php

/*
 * This file displays all the dies that have not been used within the last X 
 * years where X being the input from the user.
 */

echo "<style>
            .statusButton {
                float: right;
                height: 50px;
                width: 150px;
                font-size: 20px;
            }
            
        </style>";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
echo '<form method="get" action="expiredDies.php">
    <label>Exipred(years):</label>
    <input type="tel" name="years"/>
</form><br>';
if (isset($_GET["years"])) {
    echo "The following are dies that have not been used within the last " .
    $_GET["years"] . " years.";
    $days = $_GET["years"] * 364;

    $query = "SELECT DocketNumber FROM DieStatus WHERE ((Status='instock') AND
    (TO_DAYS(Date)<TO_DAYS(NOW())-" . $days . ") )";
    if (!is_resource($link = connectToDatabase())) {
        echo "could not connecto the database";
    } else {
        if (!($result = mysql_query($query, $link))) {
            echo "Query " . $query . " failed.";
        } else {
            echo "<table>";
            while ($row = mysql_fetch_array($result)) {
                echo '<tr><form method="POST" action="searchDieHelper.php">';
                echo "<td><h1>" . $row["DocketNumber"] ."</h1></td>";
                echo '<input type="hidden" name="type" value="setStatusExpired">';
                            echo '<input type="hidden" name="DocketNumber" value="' . $row["DocketNumber"] . '">';
                            echo '<input type="hidden" name="years" value="' . $_GET["years"] . '">';
                echo '<td><button class="statusButton" type="submit" name="status" value="thrownout">Throw Out</button></td>';
            
                echo "</form></tr>";
            }
        }
    }
}


?>