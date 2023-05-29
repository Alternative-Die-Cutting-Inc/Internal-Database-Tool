<?php
/**
 * Given a docket number through POST,
 * display the results of the Production table where
 * the docket number appears in the Finishings column
 * of Production.
 *
 * @author Peter Tran July 24th, 2012
 */
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
// This form allows the user to perform a new search
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

        <!-- Import general stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End import of general stylesheets -->

       
        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- Import of general scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>

        <!-- End import of general scripts -->


        <script type="text/javascript">
            $(document).ready(function() {
                //addEvents();
                Menu.fixMenu();     
                //home.launch();
   
            $(".focusHere").focus();
        
            });
        </script>
        <style>
            .statusButton {
                float: right;
                height: 50px;
                width: 150px;
                font-size: 20px;
            }
            table {
                width: 100%;
            }
            form input {
                font-size: 20px;
                height: 30px;
            }

        </style>
    </head>
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span class="menuButton"><a href="/Roswell/Organizers/Phone3.php">Phone Book</a></span></li>
                <li><span class="menuButton"><a href="/Roswell/Include/OldHomePage.php">Old Links</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/QuoteTool/'>New Quote</a></span></li>
                <li><span class="menuButton"><a href='/Intranet/ShippingTool/DocketForm.php'>Docket Login</a></span></li>

            </ul>
        </div>

        <div id="wrapper">

            <br><br><br><table><tr><td><form method="get" action="">
                                        <label>Search Die:</label>
                                        <input type="tel" name="DocketNumber" class="focusHere"/>
                                    </form></td><td>
                                    <form id="" method="POST" action="searchDieHelper.php">
                                        <?php
                                        if (!isset($_GET['DocketNumber'])) {
                                            die("No docket number");
                                        } else {
                                            $DocketNumber = $_GET['DocketNumber'];

                                            if (is_resource($link = connectToDatabase())) {

                                                $query = "SELECT * FROM DieStatus WHERE DocketNumber=" . $DocketNumber;
                                                if (($result = mysql_query($query, $link))) {

                                                    if ($row = mysql_fetch_array($result)) {
                                                        $date = $row["Date"];
                                                        $status = $row["Status"];
                                                        switch ($status) {
                                                            case "instock":
                                                                $status = " is <font color=\"blue\">in stock</font> as of ";

                                                                break;
                                                            case "returned":
                                                                $status = " has been <font color=\"red\">returned</font> as of ";
                                                                break;
                                                            case "thrownout":
                                                                $status = " has been <font color=\"red\">thrown out</font> as of ";
                                                                break;
                                                        }
                                                        date_default_timezone_set("America/Toronto");

                                                        echo "<h1>" . $DocketNumber . "</h1>" . $status . "<h4>" . date("F Y", strtotime($date)) . "</h4>";
                                                    } else {
                                                        echo "There is no information on " . $DocketNumber;
                                                    }
                                                } else {
                                                    echo $query . " failed to execute.";
                                                }
                                                disconnect($link);
                                            } else {
                                                echo "Could not connect to database.";
                                            }
                                        }
                                        echo '<input type="hidden" name="type" value="setStatus">';
                                        echo '<input type="hidden" name="DocketNumber" value="' . $DocketNumber . '">';
                                        ?>
                                </td><td>
                                    <button class="statusButton" type="submit" name="status" value="instock">In Stock</button><Br><Br>
                                            <button class="statusButton" type="submit" name="status" value="returned">Returned</button><Br><Br>
                                                    <button class="statusButton" type="submit" name="status" value="thrownout">Thrown Out</button><Br><Br>
                                                            </form><br></td></tr></table>
                                                                <?php
// The docket number must be set to execute the search
// The search will not execute if connection the databse fails
                                                                if (!is_resource($link = connectToDatabase())) {
                                                                    die("Could not connect to database");
                                                                }

//Select relevant information from the Production table
//Specifically, we want the rows where the docket number is in 
//the finishings column.
                                                                $query = "SELECT  
                p.DocketNumber AS Docket_Number,
                p.QuoteNumber AS Quote_Number,
                p.CustomerPoNo AS Customer_PO_Number,
                p.Customer,
                p.ProductionPerson AS Production_Person,
                p.JobName AS Job_Name,
                p.Finishing AS Finishing,
                p.SpecialInstructions AS Special_Instructions,
                p.Quantity AS Number_of_Units,
                p.FinalPrice AS Sold_For,
                p.Date
                
                FROM Production AS p
                WHERE Finishing LIKE \"%$DocketNumber%\"";
                                                                $firstOccurence = "SELECT  
                p.DocketNumber AS Docket_Number,
                p.QuoteNumber AS Quote_Number,
                p.CustomerPoNo AS Customer_PO_Number,
                p.Customer,
                p.ProductionPerson AS Production_Person,
                p.JobName AS Job_Name,
                p.Finishing AS Finishing,
                p.SpecialInstructions AS Special_Instructions,
                p.Quantity AS Number_of_Units,
                p.FinalPrice AS Sold_For,
                p.Date
                
                FROM Production AS p
                WHERE DocketNumber=$DocketNumber";
                                                                if (($result = mysql_query($query, $link))) {
                                                                    //Initiate the table headers
                                                                    echo "<table border=1px>
            <tr>
                <th>Docket Number</th>
                <th>Quote Number</th>
                <th>Customer PO Number</th>
                <th>Customer</th>
                <th>Production Person</th>
                <th>Job Name</th>
                <th>Finishing</th>
                <th>Special Instructions</th>
                <th>Number of Units</th>
                <th>Date</th>
                <th>Sold For</th>
           </tr>";
                                                                    //Iterate through returned results
                                                                    while ($row = mysql_fetch_array($result)) {
                                                                        echo "<tr>";
                                                                        echo "<td>" . $row['Docket_Number'] . "</td>";
                                                                        echo "<td>" . $row['Quote_Number'] . "</td>";
                                                                        echo "<td>" . $row['Customer_PO_Number'] . "</td>";
                                                                        echo "<td>" . $row['Customer'] . "</td>";
                                                                        echo "<td>" . $row['Production_Person'] . "</td>";
                                                                        echo "<td>" . $row['Job_Name'] . "</td>";
                                                                        echo "<td>" . $row['Finishing'] . "</td>";
                                                                        echo "<td>" . $row['Special_Instructions'] . "</td>";
                                                                        echo "<td>" . $row['Number_of_Units'] . "</td>";
                                                                        echo "<td>" . $row['Date'] . "</td>";
                                                                        echo "<td>" . $row['Sold_For'] . "</td>";
                                                                        echo "</tr>";
                                                                    }
                                                                    if ($firstResult = mysql_query($firstOccurence, $link)) {
                                                                        if ($row = mysql_fetch_array($firstResult)) {
                                                                            echo "<tr>";
                                                                            echo "<td>" . $row['Docket_Number'] . "</td>";
                                                                            echo "<td>" . $row['Quote_Number'] . "</td>";
                                                                            echo "<td>" . $row['Customer_PO_Number'] . "</td>";
                                                                            echo "<td>" . $row['Customer'] . "</td>";
                                                                            echo "<td>" . $row['Production_Person'] . "</td>";
                                                                            echo "<td>" . $row['Job_Name'] . "</td>";
                                                                            echo "<td>" . $row['Finishing'] . "</td>";
                                                                            echo "<td>" . $row['Special_Instructions'] . "</td>";
                                                                            echo "<td>" . $row['Number_of_Units'] . "</td>";
                                                                            echo "<td>" . $row['Date'] . "</td>";
                                                                            echo "<td>" . $row['Sold_For'] . "</td>";
                                                                            echo "</tr>";
                                                                        }
                                                                    }
                                                                    echo "</table>";
                                                                } else {
                                                                    die("Error in executing query" . $query . mysql_error());
                                                                }
                                                                ?>
                                                                </div> <!-- end wrapper -->
                                                                </body>
                                                                </html>

