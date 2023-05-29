<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require "dev_authentication.inc";

/** True to only test, false to insert */
function updateFields($test) {
    $start = microtime(true);

    $arr = array();

    echo "[SERVER] CONNECTING TO THE DATABASE <br />";

    if (!is_resource($link = connectToDatabase())) {
        echo "Could not connect to db <br />";
        return $arr;
    }

    //my first attempt at extra fields
    $query = "SELECT Quote_Number AS qn, Number_of_Units AS nu, Notes FROM Quote_Information
        WHERE Notes='' JOIN Estimates";

    if (($result = mysql_query($query, $link))) {
        $numChangedRows = 0;
        $numSkippedRows = 0;

        while ($row = mysql_fetch_array($result)) {
            $qn = $row['qn'];
            $nu = $row['nu'];
            
            

            if ($parsed === false) {
                $str = "[SKIPPED]";
                $numSkippedRows++;
            } else {
                $arr[$numChangedRows++] = "UPDATE Saved_Quotes SET Extra_Field=\"$parsed\"
                WHERE Quote_Number=$qn AND Extra_Field=\"$field\"";

                if ($test) {
                    $str = "[WILL UPDATE]";
                } else {
                    $str = "[UPDATED]";
                }

//                echo "$str QN $qn - $field --> $parsed <br />";
            }

            //do only 1000 rows at a time
            if ($numChangedRows > 1000) {
                break;
            }
        }

        echo "[SUMMARY] Total number of updated rows is " . $numChangedRows . "<br>";
        echo "[SUMMARY] Total number of skipped rows is " . $numSkippedRows . "<br>";
        echo "[SUMMARY] Updating took " . (microtime(true) - $start) . " time<br>";
        
        if (!$test) {
            echo "[SERVER] Starting querries <br>";
            
            //now actually do the update
            foreach ($arr as $query) {
//                mysql_query($query, $link);
//                echo "[SERVER][SUCCESS] Finished query <br>";
                echo $query . ";";
            }
            
            echo "[SERVER] Executed " . count($arr) . " querries <br>";
        }
        
    } else {
        echo "[SERVER] Could not load rows<br />";
        echo "[SERVER] Query was " . $query . "<br />";
    }

    disconnect($link);

    return $arr;
}


?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Extra Fields Parser</title>

        <style>
            body {
                font-family: calibri, helvetica, arial, sans-serif;
                color: #1B7AE0;
            }

            #banner {
                margin: 0 auto;
                text-align: center;
            }

        </style>
    </head>
    <body>
        <div id="banner">
            <h1>Parsing extra fields</h1>

            <p>Go to dev home <a href="/Intranet/Dev">here</a></p>
            <p>Go to intranet home <a href="/Intranet">here</a></p>
            <p>Refresh <a href="<?php echo $_SERVER['PHP_SELF']; ?>">here</a></p>

            <div id="input">
                <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
                    <input type="submit" name="update" value="Test" />
                    <input type="submit" name="update" value="Update" />
                </form>
            </div> <!-- end input -->
        </div> <!-- end banner -->

        <div id="results">
            <?php
            if (isset($_POST['update'])) {
                $test = $_POST['update'] === "Test";
                updateFields($test);
            }
            ?>
        </div> <!-- end results -->
    </body>
</html>
