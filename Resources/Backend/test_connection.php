<?php
require_once 'loginHelper.php';

$link = connectToDatabase();
if (!$link) {
    // Connection failed
    echo "Failed to connect to the database.";
} else {
    // Connection successful
    echo "Successfully connected to the database!";
    disconnect($link);
}
?>
