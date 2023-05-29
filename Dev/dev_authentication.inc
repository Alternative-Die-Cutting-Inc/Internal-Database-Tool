<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on July 27, 2011
 * ----------------------------------------------------------------------------
 * This file is used for the authentication to the DEV portion of the website.
 * Include wherever such authentication is necessary.
 * 
 * NOTE: this also works for regular Intranet authentication because if the
 * userid for the session is not set, false is returned
 * ************************************************************************** */

session_start();

require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Resources/Backend/loginHelper.php';

if (!isset($_SESSION['userId']) || !authenticate($_SESSION['userId'])) {
    header("Location: /Intranet/Dev/trollFace.php");
    exit;
}

/**
 * Return true if the person can access the dev portion of the website, false
 * otherwise.
 * @param int $userID The user ID of the user.
 * @return True if authenticated, false otherwise.
 */
function authenticate($userID) {
    if (!isset($userID) || !is_numeric($userID)) {
        return false;
    }

    if (!is_resource($link = connectToDatabase())) {
        return false;
    }

    $query = "SELECT Dept FROM InterUsers WHERE Id=$userID";

    if (!($result = mysql_query($query, $link))) {
        return false;
    }
    
    if(mysql_num_rows($result) !== 1) {
        return false;
    }
    
    $row = mysql_fetch_array($result);
    return $row['Dept'] === "dev";
}

?>