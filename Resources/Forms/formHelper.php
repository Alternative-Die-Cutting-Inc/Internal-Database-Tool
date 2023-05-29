<?php

/*
 * These are functions that are used commonly by the forms in the QuoteTool.
 */

function stripId($field, $id) {
    $id = strval($id);
    return substr($field, 0, strlen($field) - strlen($id));
}

function getId($field) {
    $tail = "";
    $id = null;
    $length = strlen($field);

    for ($i = 1; $i < strlen($field); $i++) {
        $tail = substr($field, $length - $i);

        if (is_numeric($tail)) {
            $id = $tail;
        } else {
            break;
        }
    }

    return $id;
}

function format_string($string) {
    return str_replace(" ", "_", $string);
}

?>
