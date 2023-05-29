<?php
/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on July 27, 2011
 * ----------------------------------------------------------------------------
 * The DEV section of the intranet is written for developers to test portions 
 * of functionality before adding it to the general intranet. Access is
 * strictly restricted to developers. 
 * 
 * This page trolls anyone who tries to gain access without authentication
 * ************************************************************************** */
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>DEV LULZ</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link rel="stylesheet" type="text/css" href="devblog.css" />

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <script type="text/javascript">
            $(document).ready(function() {
                t = new Timer();
                //update the timer every second
                setTimeout("t.setTimer()", 1000);
                
                function Timer () {
                    //time before automatic redirection in seconds
                    this.timeout = 5;
                    
                    /**
                     * Set the timer to a second lower than previous.
                     */
                    this.setTimer = function () {
                        this.timeout--;
                        $("#timeLeft").html(this.timeout);
                        
                        if(this.timeout === 0) {
                            this.kick();
                        } else {
                            //call this function again in a second
                            setTimeout("t.setTimer()", 1000);
                        }
                    }
                    
                    /**
                     * Remove the user from this page.
                     */
                    this.kick = function() {
                        $("#progMsg").html("You have been kicked");
                        $("#result").show();
                        window.location.href = window.location.href.split("Dev")[0];
                        //                        console.log("You have been kicked");
                    }
                }
            });
        </script>
    </head>
    <body>
        <div id="wrapper">
            <h1>UR LACK OF AUTHORIZED ACCESS AMUSES US</h1>

            <img src="Images/trollface.png" alt="Troll Face" />

            <div id="progMsg">
                <p>You will be redirected to the main page in <span id="timeLeft">5</span></p>
            </div> <!-- end progMsg -->

            <div id="result" style="display: none;">
                <p>If you are not automatically redirected, click <a href="/Intranet/index.php">here</a></p>
            </div>


        </div> <!-- end wrapper -->
    </body>
</html>

