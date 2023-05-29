<?php
/*
 * WorkSheet rewritten by Peter Tran for Alternative Die Cutitng Inc.
 * Updated: Aug 16th, 2012
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);
require 'formHelper.php';
require 'worksheetHelper.php';
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Work Sheet</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link rel="stylesheet" type="text/css" href="../Stylesheets/worksheet.css" />
        <style>
        </style>
    </head><!-- header -->
    <body>
        <div id="wrapper">
            <div id="contentPane">
                <!--                <h2 id="workSheetTitle">Work Sheet</h2>-->

                <div id="generalInfoContainer">
                    <div id="quoteInfo" class="generalInfo">
                        <?php
                        $headings = array("Quote Number", "Author");
                        echoByHeading($headings);
                        date_default_timezone_set("America/Toronto");
                        echo date("Y-m-d");
                        ?>
                    </div><!-- div#quoteInfo .generalInfo -->
                    <div id="customerInfo" class="generalInfo">
                        <?php
                        $headings = array("Customer", "Attention");
                        echoByHeading($headings);
                        ?>
                    </div><!-- div#customerInfo .generalInfo -->
                    <div id="jobInfo" class="generalInfo">
                        <?php
                        $headings = array("Job Name", "Description", "Notes");
                        echoByHeading($headings);
                        ?>
                    </div><!-- div#jobInfo .generalInfo -->
                </div><!-- div#generalInfoContainer -->
                <div id="quoteContainer">
                    <?php
                    if (isset($_POST['numQuotes']) && is_numeric($_POST['numQuotes'])) {
                        $numQuotes = intval($_POST['numQuotes']);
                    } else {
                        $numQuotes = 0;
                    }
                    $quoteIndex = 0;
                    //For every two quotes, display them and surround the pair
                    //with a div. This div will act as an index for page break
                    //for printing.
                    while ($quoteIndex < $numQuotes) {
                        
                        //There are line breaks applied after each quotePair.
                        //Do not need one for the last quote pair.
                        if ($quoteIndex != $numQuotes - 1) {
                            echo "<div id=\"quotePair\">";
                        } else {
                            echo "<div id=\"quotePairLast\">";
                        }

                        echoQuote($quoteIndex);
                        $quoteIndex++;
                        if ($quoteIndex < $numQuotes) {
                            echoQuote($quoteIndex);
                            $quoteIndex++;
                        }
                        echo "</div><!-- div#quotePair -->";
                    }
                    ?>
                </div><!-- div#quoteContainer -->
            </div><!-- div#content pane -->
        </div><!-- div#wrapper -->
    </body><!-- body -->
</html>