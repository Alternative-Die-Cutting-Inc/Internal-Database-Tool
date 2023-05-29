<?php
/* * ***************************************************************************
 * Rewritten by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated August 3, 2011
 * ---------------------------------------------------------------------------
 * This is the docket login page. When a skid comes in, this allows
 * anyone in shipping to add the job to the queue of jobs and create a brand 
 * new docket number for the job.
 * ************************************************************************** */

ini_set('display_errors', 0);
error_reporting(E_ALL);

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";

//authenticate user
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";

/**
 * Load and return a new docket number from the database.
 * Make sure no one can claim that docket number in the future. 
 * If the number cannot be loaded, return -1.
 * @return int The docket number if loaded, -1 otherwise. 
 */
function loadDocketNum() {
    if (!is_resource($link = connectToDatabase())) {
        return -1;
    }

    $query = "INSERT INTO Dockets (Docket) VALUES(0)";

    if (mysql_query($query, $link)) {
        $query = "SELECT MAX(DocketNumber) AS dn FROM Dockets";

        if (!($result = mysql_query($query, $link))) {
            return -1;
        }

        if (mysql_num_rows($result) > 0) {
            $row = mysql_fetch_array($result);
            $number = $row['dn'];
        } else {
            $number = -1;
        }
    } else {
        $number = -1;
    }

    disconnect($link);

    return $number;
}

/**
 * Print out the list of customers as HTML option tags where the value of each
 * tag is the customer name. Print them out in alphabetical order.
 */
function loadCustomers() {
    if (!is_resource($link = connectToDatabase())) {
        return;
    }

    $query = "SELECT DISTINCT Customer FROM Customers ORDER BY Customer ASC";

    if (($result = mysql_query($query, $link))) {
        while ($row = mysql_fetch_array($result)) {
            echo "<option value='" . $row['Customer'] . "'>" . $row['Customer'] . "</option>";
        }
    }

    disconnect($link);
}

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html ng-app xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Docket Login</title>
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />

        <!-- Icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End import of general stylesheets -->

        <link rel="stylesheet" type="text/css" href="Stylesheets/docketLogin.css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>

        <script src="../javascripts/angular.js"></script>

        <script src="customers.js"></script>

        <!-- End import of general scripts -->
    </head>

    <body ng-controller="CustomerController">
        <div id="wrapper">
            <h2>Docket Login</h2>

            <p><a href="/Intranet">Home</a></p>

            <form method="post" action ="JobTicket.php">
                <table border="1">
                    <tr>
                        <td><label for="docketNum">Docket Number</label></td>
                        <td>
                            <input type="text" name="docketNum" id="docketNum" value="<?php echo loadDocketNum(); ?>" />
                        </td>
                    </tr>
                    <tr>
                        <td><label for="customer">Customer</label></td>
                        <td>
                            <datalist id="customerList">
                                <option ng-repeat="customer in customers" value="{{customer}}" >
                            </datalist>
                            <input type="text" ng-model="customer" name="customer" list="customerList" placeholder="Enter Customer Here" />
                        </td>
                    </tr>
                    <tr>
                        <td><label for="jobname">Job Name</label></td>
                        <td>
                            <input type="text" size="45" id="jobname" name="jobName" />
                        </td>
                    </tr>
                    <tr>
                        <td><label for="custNum">Customer PO No.</label></td>
                        <td>
                            <input type="text" id="custNum" name="custNum" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label for="sample">Sample:</label>
                        </td>
                        <td>
                            <input type="checkbox" id="sample" name="sample" />
                        </td>

                    </tr>
                    <tr>
                        <td>
                            <label for="dieline">Die Line:</label>
                        </td>
                        <td>
                            <input type="checkbox" id="dieline" name="dieline" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label>Die Number</label>
                        </td>
                        <td>
                            <input type="text" id="dieNumber" name="dieNumber" value="0"></input>
                        </td>
                    </tr>
                </table>
                Pick a due date:<input type="date" name="dueDate">
                <br />
                <input type="submit" name="submit" value="Submit" />
            </form>
        </div> <!-- end wrapper -->
    </body>
</html>
