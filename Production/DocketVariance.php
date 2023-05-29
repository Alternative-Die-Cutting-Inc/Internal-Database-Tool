<?php
/*
	This page allows the user to review the given job after it's been closed.

	By default the hours are set to the values that the job was quoted for.

	The user then enters in 
	Written by Peter Tran Sept 4th, 2013.
*/
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
?>
<html ng-app="ProductionModule">
    <head>
        <title>Alternative DC Intranet Production</title>
        <link type="text/css" rel="stylesheet" href="../stylesheets/Production/app.css" />
	    <script>
	      //Load existing quote if GET is set.
	      var DocketNumber = 
	      <?php 
	      if (isset($_GET['docket_number'])) {
	        echo json_encode($_GET['docket_number']);
	      } else {
	        echo json_encode(null);
	      }
	      ?>;
	    </script>
        <script type="text/javascript" src="../javascripts/Production/app-ck.js"></script>
    </head><!-- head -->
    <body ng-controller="Production" ng-class="saving">
    	<nav class="top-bar">
			<ul class="title-area"><!-- Title Area -->
			    <li class="name">
			        <h1>
			            <a href="/Intranet/">Home</a>
			        </h1>
			    </li>
			    <li class="toggle-topbar menu-icon">
			        <a href="#">
			            <span>Menu</span>
			        </a>
			    </li>
			</ul>
			<section class="top-bar-section"><!-- Left Nav Section -->
			    <ul class="left">
			        <li class="divider"></li>
			        <li class="active">
			            <a href='#' ng-click="saveProduction()">Save</a>
			        </li>
			        <li class="divider"></li>
			        <li class="active">
			            <a href='#' ng-click="closeJob()">Close</a>
			        </li>
			        <li class="divider"></li>
			        <li class="active">
			            <a href='#' ng-click="deleteJob()">Delete</a>
			        </li>
			        <li class="divider"></li>
			        <li class="active">
			            <a href='/Intranet/ShippingTool/shipping.php?DocketNumber={{production_info.DocketNumber}}'>New Shipment</a>
			        </li>
			        <li class="divider"></li>
			    </ul>
			    <ul class="right">
			        <li class="divider"></li>
			        <li>
			            <a href="/Intranet/ShippingTool/shipmentHistory.php?DocketNumber={{production_info.DocketNumber}}">Shipment History</a>
			        </li>
			        <li class="divider"></li>
			        <li>
			            <a href="/Intranet/Shipping/DeliveryReport.php?docket_number={{production_info.DocketNumber}}">Delivery Report</a>
			        </li>
			        <li class="divider"></li>
			        <li>
			            <a href="/Intranet/Production/Billing.php?docket_number={{production_info.DocketNumber}}">Billing</a>
			        </li>
			        <li class="divider"></li>
			        <li>
			            <a href="/Intranet/Production/WorkOrder.php?docket_number={{production_info.DocketNumber}}">Work Order</a>
			        </li>
			    </ul>
			</section>
    	</nav>
		<div class="row">
			<div class="columns production-info large-8 large-centered small-centered">
				<ng-include src="'templates/variance.html'"></ng-include>
			</div>
		</div><!-- Main production info -->
    </body>
</html>