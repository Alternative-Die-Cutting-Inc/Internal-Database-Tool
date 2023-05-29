<?php
/* * ***************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated on July 27, 2011
 * ----------------------------------------------------------------------------
 * The DEV section of the intranet is written for developers to test portions 
 * of functionality before adding it to the general intranet. Access is
 * strictly restricted to developers.
 * ************************************************************************** */

ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'dev_authentication.inc';
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <title>Developer's Blog</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        
        <link rel="stylesheet" type="text/css" href="devblog.css" />
        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Menu/menu.css" />
        
        <!-- icon -->
        <link rel="icon" type="image/png" href="Images/green-gear-icon.png" />
        
        <!-- link to JQuery -->
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
        
        <script type="text/javascript" src="/Intranet/Resources/Menu/menu.js"></script>
        
        <script type="text/javascript">
            $(document).ready(function() {
                console.log("Hello world");
                Menu.fixMenu();
            });
        </script>
    </head>
    <body>
        <div id="menuContainer">
                <ul id="menu">
                    <li><span class="menuButton"><a href="Moving/extra_parser.php">Extra Fields Parser</a></span></li>
                    <li><span class="menuButton"><a href='/Intranet'>Intranet Home</a></span></li>
                    <li><span class="menuButton"><a href='Moving/qty_adder.php'>Qty Adder</a></span></li>
                    <li><span class="menuButton"><a href="Testing">Testing</a></span></li>
                </ul>
            </div> <!-- end menu container -->
        
        <div id="wrapper">
            <div id="banner" class="bar">
                <h2>Welcome to the Developer's Blog!</h2>
            </div>

            <div id="feature">
                <h3>Development Segment</h3>

                <p>This section of the site is now isolated from the rest of ADC - access
                is limited to developers.</p>
            </div>

            <div id="content">
                <div id="leftCol">
                    <div>
                        <h3>New Home Page</h3>

                        <h4>New features</h4>
                        <ul>
                            <li>Integrated Search</li>
                            <li>Live Jobs Feed (auto-refreshes)</li>
                        </ul>

                        <h4>Removed features</h4>
                        <ul>
                            <li>Messages/Message Pad</li>
                            <li>Tasks</li>
                            <li>Calendar</li>
                            <li>Perspective Clients</li>
                            <li>Quick Select</li>
                        </ul>

                        <h4>Soon to be removed:</h4>
                        <ul>
                            <li>Phone Book - will be merged into search</li>
                        </ul>

                        <h4>Search features</h4>

                        <p>The following searches have been merged into the
                            integrated search:</p>

                        <ul>
                            <li>Past Quotes</li>
                            <li>Past Orders</li>
                            <li>Quick Select docket search</li>
                            <li>[Coming soon] Dies</li>
                        </ul>
                    </div>
                    <div>

                        <h3>New Shipping Application</h3>

                        <h4>New features</h4>
                        <ul>
                            <li>Add unlimited number of forms</li>
                            <li>New, better-formatted delivery slip</li>
                        </ul>

                    </div>

                </div>

                <div id="rightCol">
                    <div>
                        <h3>Quoting System Patch 1</h3>

                        <h4>Quoting System - Main</h4>
                        <ul>
                            <li>Setup now gets price based on the press</li>
                            <li>Menu bar has replaced buttons</li>
                            <li>Menu bar is always at the top of the page</li>
                            <li>Can clear quote without leaving the application</li>
                        </ul>

                        <h4>Extra Fields</h4>
                        <ul>
                            <li>Unlimited number of extra fields</li>
                        </ul>

                        <h4>Search Engine</h4>
                        <ul>
                            <li>Can search through quotes made with both the new and the old
                                quoting systems</li>
                            <li>Search quotes by date</li>
                            <li>Progress updates during search</li>
                            <li>Faster search due to indexing</li>
                        </ul>

                        <h4>Saving</h4>
                        <ul>
                            <li>Quote can be saved at any time</li>
                            <li>Edited old quote can be saved as a new quote with the <i>Save As New</i> button</li>
                            <li>New quote can be added onto an old quote with the <i>Append To Existing</i> button</li>
                        </ul>

                        <h4>Client Sheet and Worksheet</h4>
                        <ul>
                            <li>The client sheet and the worksheet are now styled the same</li>
                            <li>Viewed in a new tab</li>
                            <li>Can be loaded any number of times, in any order,
                                without affecting the program flow</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>

