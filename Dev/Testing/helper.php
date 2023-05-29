<?php

/**
 * A helper function for unit testing. If test strong equals between expected
 * and actual. If they are not equal, print an error message. 
 * For arrays, does a deep comparison.
 * Return true if test succeeded, false otherwise.
 * @param mixed $expected Expected value.
 * @param mixed $actual The actual value after testing.
 * @param string $errorMsg The message to display upon error.
 * @return True if test succeeded, false otherwise.
 */
function assertEquals($expected, $actual, $errorMsg) {
    if ($expected !== $actual) {
        echo "[DEBUG] Expected to get ";
        var_dump($expected);
        echo ". Actually got ";
        var_dump($actual);
        echo ".<br>";

        printLine("[ERROR] {$errorMsg}");
    }

    return $expected === $actual;
}

/**
 * Helper function to print a string on its own line in an HTML document
 * $str string The string
 */
function printLine($str) {
    echo "{$str} <br>";
}

?>
