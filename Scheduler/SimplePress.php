<?php
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
?>
<!DOCTYPE html>
<html>
    <head>
        <title>ADC Press</title>
        <link type="text/css" rel="stylesheet" href="../stylesheets/Scheduler/schedule.css" /> 
        <link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/themes/base/jquery-ui.css" type="text/css" media="all" /> 
        <script src="../javascripts/Schedule/app-ck.js"></script>
        <script type="text/javascript">
        $(function() {
		    $( "#sortable0, #sortable1, #sortable2, #sortable3, #sortable4" ).sortable({
		      connectWith: ".connectedSortable"
		    }).disableSelection();
		  });
        </script>
    </head>
    <body ng-app="ScheduleModule">
    	<div ng-controller="Scheduler">
    		<div class="row top-row">
    			<div class="columns large-3">
    				<h1>{{today}}</h1>
    			</div>
    			<div class="columns large-9">
    				<h1>Any questions call Frank</h1>
    				<h1>416-618-1789</h1>
    			</div>
    		</div>

    		<div class="row top-row hide-on-print">
    			<div class="columns large-12">
		    		<ul id="sortable0" class="connectedSortable small-block-grid-2 large-block-grid-4">
					  <li ng-repeat="job in jobs" class="ui-state-default">
					  	<h6>{{job.Customer}} #{{job.DocketNumber}}</h6>
					  	{{job.JobName}}
					  	<br>
					  	<span class="hide-on-print" ng-click="removeJob(job)">remove</span>
					  </li>
					</ul>
    			</div>
    		</div>

	    	<div class="row top-border">
	    		<div class="border-left-col border-col columns large-3">
		    		<h1>Hiedelberg</h1>
		    		<ul id="sortable1" class="connectedSortable">
						<li class="hide-on-print ui-state-highlight">Item 1</li>
					</ul>
				</div>
				<div class="border-col columns large-3">
					<h1>Ijima (White)</h1>	 
					<ul id="sortable2" class="connectedSortable">
					  <li class="hide-on-print ui-state-highlight">Item 1</li>
					</ul>
				</div>
				<div class=" border-col columns large-3">
					<h1>Ijima (Grey)</h1>	
					<ul id="sortable3" class="connectedSortable">
					  <li class="hide-on-print ui-state-highlight">Item 1</li>
					</ul>
				</div>
				<div class=" border-col columns large-3">
					<h1>Bobst</h1>	
					<ul id="sortable4" class="connectedSortable">
					  <li class="hide-on-print ui-state-highlight">Item 1</li>
					</ul>
				</div>
	    	</div>
    	</div> 
    </body>
</html>
