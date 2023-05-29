<?php

/* * ***************************************************************************
 * * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * * Updated August 9, 2011
 * 
 * * ***************************************************************************
 * 
 * * This file is used as an abstraction for displaying and returning XML from
 * * PHP files. 
 * * All input is parsed so no need to worry about special characters.
 * * It is meant to be paired with a JQuery file which will decode the XML.
 * 
 * * ***************************************************************************
 * 
 * * TODO switch to JSON if/when upgrading to PHP5
 * 
 * 
 * Legend (tags and translations)
 * Tag    | Description
 * ---------------------
 * parent | The wrapper around the XML content.
 * 
 * row    | A row in a MYSQL table. 
 * 
 * field  | A field in the HTML document. Must have exactly one name tag and
 *        | one value tag.
 * 
 * link   | A link. Must have exactly one name tag and one href tag.
 * 
 * name   | The name assigned to the field/link/other. There should only be one
 *        | of these per tag.
 * 
 * value  | The value of a field. There should be exactly one of these per
 *        | field tag.
 * 
 * href   | The URL to which the link links. There should be exactly one of
 *        | these per link tag. 
 * 
 * debug  | Debug message.
 * **************************************************************************** */

/**
 * Given an associative array, assume it maps names to values. Print each
 * key-value pair in a field and wrap all of that in an XML row.
 * @param array $arr Associative array mapping names to values.
 */
function printRow($arr) {
    echo "<row>";

    foreach ($arr as $key => $val) {
        printField($key, $val);
    }

    echo "</row>";
}

/**
 * Return a valid XML string given the input string.
 * @param string $string The input string.
 * @return string A valid string.
 */
function xmlEntities($string) {
    $invalidChars = array("&" => "&amp;", "<" => '', ">" => '');

    foreach ($invalidChars as $char => $replaceChar) {
        if ($replaceChar === "") {
            if (ord($char) < 100) {
                $replace = "&#0" . ord($char) . ";";
            } else {
                $replace = "&#" . ord($char) . ";";
            }
        } else {
            $replace = $replaceChar;
        }

        $string = str_replace($char, $replace, $string);
    }

    return $string;
}

/**
 * The total number of results found in the search.
 * @param number $num The number of results found in the search.
 */
function printNumResults($num) {
    if (isset($num) && is_numeric($num)) {
        echo "<numresults>{$num}</numresults>";
    }
}

/**
 * Print the number of rows returned with this query.
 * @param number $num The number of results returned.
 */
function printRowCount($num) {
    if (isset($num) && is_numeric($num)) {
        echo "<count>{$num}</count>";
    }
}

/**
 * Print the field in XML format which has the given field name and value.
 * @param string $name The field name.
 * @param string $val The field value.
 */
function printField($name, $val) {
    $name = xmlEntities($name);
    $val = xmlEntities($val);

    echo "\t<field><name>{$name}</name><value>{$val}</value></field>\n";
}



/**
 * TODO replace this useless function
 * @param <type> $time
 */
function printTime($time) {
    echo "<time>{$time}</time>";
}

/**
 * Print a link with the given display text and url.
 * @param string $name Display text of the link.
 * @param string $url URL to which the link points.
 */
function printLink($name, $url) {
    $name = xmlEntities($name);
    $url = xmlEntities($url);
    echo "<link><href>{$url}</href><name>{$name}</name></link>";
}

/**
 * Print a debug message with the given data.
 * @param string $data The data to be handed back as debugging data.
 */
function printDebug($data) {
    $data = xmlEntities($data);
    echo "<debug>{$data}</debug>";
}

/**
 * Print a XML that represents a toggle button.
 */
function printToggle($data) {
    echo "<toggle>Notes:$data</toggle>";
}
?>
