<?php

/*
 * *****************************************************************************
 * This file contains all the helper methods for worksheet.php.
 * The functions in this file display the data need in worksheet.
 * They have been placed here to keep the worksheet clean.
 * *****************************************************************************
 * Created by Peter Tran for Alternative Die Cutting Inc.
 * Created on Aug 15th, 2012
 * *****************************************************************************
 */

/**
 * Given an array of headings, iterate through the post with each
 * string in the array and echo it and its value in a span.
 * @param array $headings The array of headings in the post.
 */
function echoByHeading($headings) {
    foreach ($headings as $heading) {
        $var = format_string($heading);
        echo "<span id='$var'>";
        echo $heading . " - ";
        if (isset($_POST[$var]) && $_POST[$var] !== "") {
            echo $_POST[$var];
        } else {
            echo "not set";
        }
        echo "</span><br />";
    }
}

/**
 * Echo the quote form the POST at the given index.
 * @param int $index
 */
function echoQuote($index) {

    //The third is not a suffix we need. It is to add an extra column
    //in the table so everything is lined up nicely.
    $suffixes1 = array("", "third", "_Cost");
    $suffixes2 = array("", "_PerM", "_Cost");

    echo "<div class=\"quote\">";
    //echo order infromation: num of units, sheets, units per sheet
    echoHeadersInARow(array('Number of Units'), $index);
    echoHeadersInARow(array('Units per Sheet'), $index);
    echoHeadersInARow(array('Number of Sheets'), $index);
    echoHeadersInARow(array('Press', 'Stock'), $index);
    // echo press info: press and stock

    echoHeadersAndSuffixes(array('Run Speed'), $suffixes2, $index);
    // echo run info: run speed
    // echo hourly costs
    // setup gluer setup die cutter
    echoHeadersAndSuffixes(array('Setup', 'Gluer Setup', 'Die', 'Cutter'), $suffixes1, $index);

    // echo speed costs
    echoHeadersAndSuffixes(array('Glue', 'Tape', 'Strip', 'Final Fold'), $suffixes2, $index);

    //echo packaging
    echoHeadersAndSuffixes(array('Packaging'), $suffixes1, $index);

    //echo shipping info
    echoHeadersInARow(array('Shipping Type', 'Method'), $index);

    //echo shipping costs
    echoHeadersAndSuffixes(array('Pickup', 'Delivery'), $suffixes1, $index);

    //echo totals
    echoHeaders(array('Total', 'Total per Thousand', 'Discount'), $index);

    //echo notes
    echoHeaders(array('Private Notes', 'Public Notes'), $index);
   
    //Extra Fields
    $numExtraFields = 0;
    if (isset($_POST['Extra_Field'])) {
        if (array_key_exists($index, $_POST['Extra_Field'])){
            $numExtraFields = count($_POST['Extra_Field'][$index]);}
        
    }
    $extraFieldIndex = 0;
    
    while ($extraFieldIndex < $numExtraFields) {
        echoExtraField($index, $extraFieldIndex);
        $extraFieldIndex++;
    }
    echo "</div><!-- div .quote -->";
}

/**
 * For the given index of the POST, echo the order information for the quote.
 */
function echoOrderInfo($index) {
    $fields = array('Number of Units', 'Units per Sheet', 'Number of Sheets');
    echoHeaders($fields, $index);
}

/**
 * Given an array and an index, for all the headers in the array, extract the
 * data from the POST at the given index.
 */
function echoHeaders($headers, $index) {
    echo "<table>";
    foreach ($headers as $heading) {
        echo "<tr>";
        echo "<td class=\"tdHeader\">";
        echo $heading . ": ";
        echo "</td><td class=\"col1\">";
        if (isset($_POST[str_replace(" ", "_", $heading)])) {

            echo $_POST[str_replace(" ", "_", $heading)][$index];
        }
        echo "</td>";
        echo "<td class=\"col2\"></td>";
        echo "<td class=\"col3\"></td>";
        echo "</tr>";
    }
    echo "</table>";
}

/**
 * Given an array, echo the headers in the array at the index given but
 * in a row.
 */
function echoHeadersInARow($headers, $index) {
    echo "<table>";
    echo "<tr>";
    $columnIndex = 1;
    foreach ($headers as $heading) {
        echo "<td class=\"tdHeader\">";
        echo $heading . ": ";
        echo "</td><td class=\"col$columnIndex\">";
        if (isset($_POST[str_replace(" ", "_", $heading)])) {

            echo $_POST[str_replace(" ", "_", $heading)][$index];
        }
        echo "</td>";
        $columnIndex++;
    }
    echo "</tr>";
    echo "</table>";
}

/**
 * Given an array of headers, array of suffix-headers, and an index, for all the headers in the array,
 *  extract the data from the POST at the given index for each suffix in the 
 * suffix header array. 
 */
function echoHeadersAndSuffixes($headers, $suffixes, $index) {
    echo "<table>";
    foreach ($headers as $heading) {
        $columnIndex = 1;
        echo "<tr><td class=\"tdHeader\">";
        echo $heading . ": ";
        echo "</td>";
        foreach ($suffixes as $suffix) {
            echo "<td class=\"col$columnIndex\">";
            if (isset($_POST[str_replace(" ", "_", $heading) . $suffix])) {

                echo $_POST[str_replace(" ", "_", $heading) . $suffix][$index];
            }
            echo "</td>";
            $columnIndex++;
        }
        echo "</tr>";
    }
    echo "</table>";
}

/**
 * Given the quote index and the field index, echo the specified extra field for the
 * specified quote.
 */
function echoExtraField($quoteIndex, $fieldIndex) {
    echo "<table>";
    echo "<tr>";
    echo "<td class=\"tdHeader\">";
    echo $_POST['Extra_Field'][$quoteIndex][$fieldIndex];
    echo "</td>";
    echo "<td class=\"col1\">";
    echo $_POST['Extra_Val'][$quoteIndex][$fieldIndex];
    echo "</td>";
    echo "<td class=\"col3\">";
    echo $_POST['extraCost'][$quoteIndex][$fieldIndex];
    echo "</td>";
    echo "<td class=\"col2\">";
    echo "(" . $_POST['extraType'][$quoteIndex][$fieldIndex] . ")";
    echo "</td>";
    echo "</tr>";
    echo "</table>";
}

?>
