<?php
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
?>

<html>
    <head><title>Qty Adder</title></head>
    <body>
        <div id="wrapper">
            <h1>Qty Adder</h1>

            <p>
                <?php
                doWork();

                function doWork() {
                    $link = connectToDatabase();

                    if (!is_resource($link)) {
                        echo "[ERROR] Connection failed <br>";
                        return;
                    }

                    $query = "SELECT DocketNumber AS dn,
                Quantity AS q
                FROM Forms GROUP BY DocketNumber";

                    $result = mysql_query($query);

                    if ($result) {
                        while ($row = mysql_fetch_array($result)) {
                            $q = $row['q'];
                            $dn = $row['dn'];
                            $query = "UPDATE Production SET Quantity=$q WHERE DocketNumber=$dn";

                            echo "[MAIN] Working on docket number $dn <br>";

                            mysql_query($query);
                        }

                        disconnect($link);
                    } else {
                        echo "[ERROR] Could not execute query $query <br>";
                    }
                }
                ?>
            </p>

        </div> <!-- end wrapper -->
    </body>
</html>
