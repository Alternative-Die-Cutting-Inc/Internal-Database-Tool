<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);


/**
 * This is a clnode of index.php. The purpose of this clone is to be linked from
 * the quote search page. This page will automatically open up the client sheet.
 * 
 * This isn't the most efficient way to link to the client sheet but it does the
 * job faster than having to rebuild client sheet to load its data with a POST 
 * from the form of this page which is already populated for you.
 */
/* * ***************************************************************************
 * ****************** AUTHENTICATION *******************************************
 * ************************************************************************** */

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <!-- General import stylesheets -->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Progress/progressBar.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        <!-- End general import stylesheets -->

        <!-- icon -->
        <link rel="icon" type="image/png" href="/Intranet/Resources/Images/penguin_1.png" />

        <link rel="stylesheet" href="Stylesheets/quoteTool.css" type="text/css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <!-- General import scripts -->
        <script type="text/javascript" src="/Intranet/Resources/Progress/progressBar.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/helper.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Scripts/xmlRender.js"></script>
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        <!-- End general import scripts -->

        <!-- TODO move helper.js into general resources -->
        <script type="text/javascript" src="Scripts/extraFields.js"></script>
        <script type="text/javascript" src="Scripts/saveQuote.js"></script>
        <script type="text/javascript" src="Scripts/quoteCalc.js"></script>
        <script type="text/javascript" src="Scripts/setAll.js"></script>
        <script type="text/javascript" src="Scripts/loadQuote.js"></script>
        <script type="text/javascript" src="Scripts/quoteTool.js"></script>
        <title>Quoting Tool 1.0</title>

        <script type="text/javascript">
            $(document).ready(function() {
                QuoteTool.launch();
                $("form").attr("action", "Forms/clientsheet.php");
                $("form").submit();
                window.close();
            });
        </script>
    </head>
    <body>
        <div id="menuContainer">
            <ul id="menu">
                <li><span class="qdButton menuButton" id="saveButton">Save</span></li>
                <li><span class="qdButton menuButton" id="saveNewButton">Save As New</span></li>
                <li><span class="qdButton menuButton" id="appendToButton">Append To Existing</span></li>
                <li><span class="qdButton menuButton" id="calculateButton">Calculate</span></li>
                <li><span class="formButton qdButton menuButton" id="worksheetButton">Worksheet</span></li>
                <li>
                    <span class="formButton qdButton menuButton" id="clientsheetButton">Client Sheet</span>
                    <span class="formButton qdButton menuButton" id="clientsheetButtonPDF"> [Print]</span>
                </li>
                <li><span class="menuButton" id="clearAllButton">Clear</span></li>
                <li><span class="menuButton"><a href="/Intranet/index.php">Home</a></span></li>
            </ul>
        </div> <!-- end menu container -->
        <div id="wrapper">

            <div id="progress">
                <span id="progMsg"><!-- Progress messages go here --></span>
                <img id="loadingImage" alt="loading" 
                     src="/Intranet/Resources/Images/loading_2.gif" height="30" />
            </div> <!-- end progress-->

            <div id="contentPane">
                <form id="quoteForm" method="post" target="_blank" action="/Intranet/Resources/Form/worksheet.php">

                    <div id="controlPanel">
                        <label for="numQuotes">Number of Quotes</label>
                        <input id="numQuotes" name="numQuotes" type="text" size="5" value="0" />
                        <button type="button" id="genQuotesButton">Generate Quotes</button>

                        <!-- XXX This button is for debugging only -->
                        <button type="button" id="addQuoteButton">Add Quote</button>
                        <button type="button" id="removeAllQuotesButton">Remove All Quotes</button>
                    </div> <!-- end control panel -->

                    <div id="quoteContainer">
                        <div class="quote prototype contentContainer">
                            <button type="button" class="removeQuoteButton">Remove</button>
                            <!-- the first quote goes here -->
                            <button type="button" class="setAllButton">Set All</button>
                            <hr />
                            <div class="extraFields">

                                <div>
                                    <button type="button" class="addExtraButton">Add Field</button>
                                    <button type="button" class="removeAllExtraButton">Remove All</button>
                                </div>

                                <table>
                                    <thead>
                                        <tr>
                                            <th>Field</th>
                                            <th>Value</th>
                                            <th>Cost</th>
                                            <th>Per M</th>
                                            <th>Cost</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="extraRow prototype">
                                            <td><input type="text" class="extra extraField" name="Extra_Field[]" /></td>
                                            <td><input type="text" class="extra extraVal input" name="Extra_Val[]" /></td>
                                            <td><input type="radio" class="extra extraType" name="extraType[]" value="cost" checked="checked" /></td>
                                            <td><input type="radio" class="extra extraType" name="extraType[]" value="PerM" /></td>
                                            <td><input type="text" class="extra extraCost costField cost" name="extraCost[]" value="$0.00" /></td>
                                            <td><span class="removeExtraButton"><img src="/Intranet/Resources/Images/delete-icon.png" height="20px" /></span></td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div class="noFields">

                                </div>
                            </div> <!-- end extra fields -->
                        </div> <!-- end quote prototype -->
                        <!-- other quotes copied here -->
                    </div> <!-- end footer -->
                    <div id="headerContainer">

                        <div id="header">
                            <!-- automatically load header from XML to here -->
                        </div> <!-- end header -->

                        <hr />

                    </div> <!-- end header container -->
                    <input id="print" class="print" value ="noo" name="print" type="hidden"/><!--Hidden input to print workorder-->
                    <input id="clientEmail" name="preloadedEmails" type="hidden"/><!--Hidden input to print workorder-->
                    <input id="inputtedEmails" name="inputtedEmails" type="hidden"/><!--Hidden input to print workorder-->

                </form>
                <div id="emailer">
                    Email Client PDF: <input id="inputEmail" type="text" name="clientEmail"/>
                    <select id="preloadedEmails">
                        <option value="" selected="selected" /> 
<!--                         emails populated when customer is selected -->
                    </select>
                    <button id="submitEmail">Send</button>
                </div>

            </div> <!-- end content pane -->
        </div> <!-- end wrapper -->
    </body>
</html>