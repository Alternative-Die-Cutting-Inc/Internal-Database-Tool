<?php

/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on August 15, 2011
 * *****************************************************************************
 * The authentication for pages which are management-level-access only.
 * ************************************************************************** */

//import connection to database
//import fail method
require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/loginHelper.php";
require "{$_SERVER['DOCUMENT_ROOT']}/Intranet/Resources/Backend/backendHelper.php";

/**
 * Authenticates management by doing nothing.
 * If user is not authenticated, redirect the user to the main Intranet page.
 */
function authenticateMgmt() {
    $link = connectToDatabase();
    
    if(is_resource($link)) {
        $result = authenticateMgmtHelper($link);
        disconnect($link);
        
        if(!$result) {
            header("Location: /Intranet/Dev/trollFace.php");
        }
        
    } else {
        fail("Could not connect to database", false);
    }
}

/**
 * Return true if management is authenticated, false otherwise.
 * @param resource $link Link to the database.
 * @return boolen True if authenticated, false otherwise.
 */
function authenticateMgmtHelper($link) {
    if(!is_resource($link)) {
        return false;
    }
    
    if(!isset($_SESSION['userId']) || !is_numeric($_SESSION['userId'])) {
        return false;
    }
    
    $id = intval($_SESSION['userId']);
    
    //XXX also give access to developers
    $query = "SELECT * FROM InterUsers WHERE Id={$id}
                AND Dept='management'";
    
    if(($result = mysql_query($query))) {
        return mysql_num_rows($result) > 0;
    } else {
        return false;
    }
}

?>
