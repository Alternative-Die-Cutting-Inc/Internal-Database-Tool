<?php
/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on August 8, 2011
 * ----------------------------------------------------------------------------
 * The DEV section of the intranet is written for developers to test portions 
 * of functionality before adding it to the general intranet. Access is
 * strictly restricted to developers.
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Dev/dev_authentication.inc';
//already imported in .inc file
//require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require 'helper.php';

/**
 * Testing the assertEquals method.
 */
function testAssertEquals() {
    assertEquals(true, true, "True is not true");
    assertEquals(true, false, "True is not false");
    assertEquals(true, "true", "String true is not boolean true");

    $arr = array("daniel", "kats");
    $newArr = array("daniel", "kats");

    assertEquals($arr, $newArr, "numeric array does not equal itself");
    assertEquals($arr, array(), "non-empty array does not equal empty array");

    $newArr = array("kats", "daniel");
    assertEquals($arr, $newArr, "order in numeric array matters");

    $arr = array("daniel" => "kats", "alice" => "liu");
    $newArr = array("daniel" => "kats", "alice" => "liu");
    assertEquals($arr, $newArr, "associative array does not equal itself");

    $newArr["alice"] = "lee";
    assertEquals($arr, $newArr, "values in associative array matter");
}



/**
 * Test connecting and disconnecting from the database.
 */
function testConnect($query) {
    if(!isset($query) || !is_string($query) || $query === "") {
        $query = "SELECT * FROM InterUsers";
    }
    
    $link = connectToDatabase();
    
    if(is_resource($link)) {
        if(($result = mysql_query($query, $link))) {
            $n = mysql_num_rows($result);
            
//            printLine("[DEBUG] There are {$n} users");
            printLine("[QUERY] Query was {$query}");
            
            if($n > 0) {
                printLine("[ERROR] Exploit worked!");
            }
        } else {
            printLine("[WARNING] Query failed: {$query}");
        }
        
        disconnect($link);
        
        //execute the same query after connection has closed
        $result = mysql_query($query);
        assertEquals(false, $result, "query should fail after connection closed, actually executed");
        
        //program should not fail here
        disconnect($link);
    } else {
        printLine("Could not connect to database");
    }
}

/**
 * Testing loginHelper's cleanInput method.
 */
function testCleanInput() {
    assertEquals("hello world", cleanInput("hello world"), "clean input changes regular string");
    assertEquals("", cleanInput(""), "empty string changes");
    
    assertEquals("/^(){}[]$1$/", cleanInput("/^(){}[]$1$/"), "clean input changes regex");
    
    testExploits();
}

/**
 * Test exploits and see if cleanInput actually prevents them from
 * getting the result they are after.
 */
function testExploits() {
    $exploits = array();
    
    //tries to comment out rest of string
    $exploits[ ] = "dbkats#";
    $exploits[ ] = "dbkats--";
    //tries to close quote and comment out rest of string
    $exploits[ ] = "dbkats' #";
    $exploits[ ] = "dbkats' --";
    //tries to close quote, end statement, and comment out rest of string
    $exploits[ ] = "dbkats'; #";
    $exploits[ ] = "dbkats'; --";
    //tries to get around escaping single quotes
    $exploits[ ] = "dbkats\''; --";
    //tries to prevent using blacklists
    $exploits[ ] = "SEL/*some chars*/ECT * FR/*more space*/OM InterUsers;";
    //code inside comment should execute in MySQL
    $exploits[ ] = "/*!32302 1/0, */ 1";
    //using certain charsets fakes quote
    $exploits[ ] = chr(0xbf) . chr(0x27) . ' OR username = username /*';
    //executing multiple queries
    $exploits[ ] = "3; SELECT *  FROM InterUsers;";
    
    foreach($exploits as $exploit) {
        testQuery($exploit);
    }
}

/**
 * Given an unescaped exploit for the user name, attempt to escape the exploit
 * and execute the query. If the query returns results, an error message will
 * be displayed.
 * @param string $exploit The escaped exploit.
 */
function testQuery($exploit) {
    $str = cleanInput($exploit);
    
    $query = "SELECT * FROM InterUsers WHERE UserName='{$str}' AND
    Password='quadrant'";
    testConnect($query);
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Program Testing</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

        <!--        <link rel="stylesheet" type="text/css" href="/Intranet/Dev/devblog.css" />-->
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />

        <!-- icon -->
        <link rel="icon" type="image/png" href="/Intranet/Dev/Images/green-gear-icon.png" />

        <!-- link to JQuery -->
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
    </head>
    <body>

        <div id="wrapper">
            <div id="banner" class="bar">
                <h1>Testing starts here</h1>
            </div> <!-- end banner -->

            <p><a href="/Intranet/Dev">Go home</a><br />
                <a href="/Intranet/Dev/Testing/local.php">Local testing</a></p>

            <div id="contentPane">
                <h2>Random testing</h2>
                
                <?php
//                    echo "Is null a string?";
                    printLine("no test cases here");
                    printLine(var_dump(is_string(null)));
                ?>
                
                <h2>Testing for assertEquals</h2>

                <?php 
                ////testAssertEquals(); 
                printLine("no test cases here");
                ?>
                
                <h2>Testing for DB connection</h2>
                
                <?php
                testConnect(null);
                ?>

                <h2>Testing for cleanInput</h2>

                <?php
//                printLine("no test cases here");
                testCleanInput();
                ?>
                
            </div><!-- end content pane -->
        </div> <!-- end wrapper -->
    </body>
</html>

