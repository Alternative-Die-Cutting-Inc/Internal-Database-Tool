<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

        <link rel="stylesheet" type="text/css" href="admin.css" />

        <link rel="stylesheet" type="text/css" href="/Intranet/Resources/Calendar/calendar.css" />

        <title>Administration Main Page</title>

        <!-- link to Google-hosted version of JQuery -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>

        <script type="text/javascript" src="/Intranet/Resources/Calendar/calendar.js"></script>


        <script type="text/javascript">
            var Temp = {
                initCalendar: function() {
                    var container = "#startDate";
                    Calendar.init(container);
                    
                    container = "#endDate";
                    Calendar.init(container);
                }
            };
            
            $(document).ready(function() {
                Temp.initCalendar();
            });
        </script>

        <style>


        </style>
    </head>
    <body>
        <div id="wrapper">
            <h1>Search Testing</h1>

            <div id="searchPane">
                <input type="text" name="searchBar" />
                <button type="button">Go</button>
                <button type="button" onclick="$('#advancedSearchPane').show()">Advanced Search</button>
            </div>

            <div id="advancedSearchPane" style="display: none;">
                <button type="button" onclick="$('#advancedSearchPane').hide()">Hide</button>
                
                <div id="leftPane">
                    <h2>Start</h2>

                    <!-- automatically filled in -->
                    <div id="startDate" class="calendar"></div>

                </div>

                <div id="rightPane">
                    <h2>End</h2>
                    
                     <!-- automatically filled in -->
                    <div id="endDate" class="calendar"></div> 
                </div>
            </div>
        </div> <!-- end wrapper -->
    </body>
</html>
