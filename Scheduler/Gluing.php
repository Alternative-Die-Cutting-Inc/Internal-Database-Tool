<?php
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
?>
<!DOCTYPE html>
<html>
    <head>
        <title>ADC Scheduling</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link type="text/css" rel="stylesheet" href="Stylesheets/Gluing.css" /> 
        <link type="text/css" rel="stylesheet" href="Stylesheets/navigation.css" /> 
        <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/base/jquery-ui.css" type="text/css" media="all" /> 
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js" type="text/javascript"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>
        <script src="/Intranet/Resources/Scripts/jquery.ui.touch-punch.min.js" type="text/javascript"></script>
        <script src="Scripts/scheduler.js" type="text/javascript"></script>
        <script type="text/javascript" src="Resources/mybox.js"></script>       
        <script type="text/javascript">
        var name = <?php echo json_encode($_SESSION['name']);?>;
        $(document).ready(function(){
                Scheduler.launch(name, "Gluing");
            });
        </script>
    </head>
    <body>   
    </body>
</html>
