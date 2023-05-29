<?php
/*
	This is the main production editor page for a job.
	
	You should be able to:
		-edit the Production table with this,
		-add forms
		-add extras
		-close the job

	It should also have links to:
		-closing the job
		-the work order
		-billing report
		-delivery report
		-new shipment
		-shipment history
	Written by Peter Tran Aug 6th, 2013.
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
			            <a href='#' ng-click="openJob()">ReOpen</a>
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
			<div class="columns production-info large-8 small-8 small-centered large-centered">
		    	<div class="row">
			        <div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Docket Number</label>
			        </div>
			        <div class="large-9 small-9 columns">

			        	<input type="text" id="right-label" ng-model="docket_number">
			        </div>
			    </div>
		    	<div class="row">
			        <div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Quote Number</label>
			        </div>
			        <div class="large-9 small-9 columns">
			        	<input ng-change="getQuantities()" type="text" ng-model="QuoteNumber"/>
			        </div>
			    </div>
		    	<div class="row">
			        <div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Sold For</label>
			        </div>
			        <div class="large-9 small-9 columns">
			        	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="FinalPrice">
			        </div>
			    </div>
		    	<div class="row">
			        <div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Production Person</label>
			        </div>
			        <div class="large-9 small-9 columns">
			        	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="ProductionPerson">
			        </div>
			    </div>
		    	<div class="row">
			        <div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Customer PO</label>
			        </div>
			        <div class="large-9 small-9 columns">
			        	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="CustomerPoNo">
			        </div>
			    </div>
		    	<div class="row">
			        <div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Customer</label>
			        </div>
			        <div class="large-9 small-9 columns">
			        	<datalist id="customerList">
		                    <option ng-repeat="customer in customers track by $index" value="{{customer}}" >
		                </datalist>
		               	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="Customer" list="customerList">
			        </div>
			    </div>
		    	<div class="row">
			        <div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Job Name</label>
			        </div>
			        <div class="large-9 small-9 columns">
			        	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="JobName">
			        </div>
			    </div>
		    	<div class="row">
			        <div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Finishing</label>
			        </div>
			        <div class="large-9 small-9 columns">
			        	<textarea type="text" id="right-label" ng-change="saveProduction()" ng-model="Finishing"></textarea>
			        </div>
			    </div>
		    	<div class="row">
			        <div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Special Instructions</label>
			        </div>
			        <div class="large-9 small-9 columns">
			        	<textarea type="text" id="right-label" ng-change="saveProduction()" ng-model="SpecialInstructions"></textarea>
			        </div>
			    </div>
			    <div class="row">
			    	<div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Per M</label>
			    	</div>
			    	<div class="large-9 small-9 columns">
					    <select ng-model="QuoteQuantityID" ng-change="quantitySelected()" name="QuoteQuantityID">
		                    <option ng-selected="QuoteQuantityID == QuantityID.quantity_id"  value="{{QuantityID.quantity_id}}" ng-repeat="QuantityID in QuoteQuantities">{{QuantityID.units}} units, ${{QuantityID.total }} at ${{QuantityID.total_per_m}}/M</option>
		                </select>
			    	</div>
			    </div>
			    <div class="row">
			    	<div class="large-3 small-3 columns">
			        	<label for="right-label" class="right inline">Type</label>
			    	</div>
			    	<div class="large-9 small-9 columns">
					    <select ng-model="jobtype" ng-change="saveProduction()" name="jobtype">
		                    <option ng-selected="job == jobtype" ng-repeat="job in jobtypes">{{job}}</option>
		                </select>
			    	</div>
			    </div>
			</div>
		</form><!-- Main production info -->
		<div class="row">
			<div class="columns large-8  small-8 form-info small-centered large-centered">
				<div class="row">
					<div class="columns small-12 large-12">
						<h3>Forms</h3>
					</div>
				</div>
				<div class="row">
					<div class="columns small-12 large-12 add-form icon-plus" ng-click="addForm()">
					</div>
				</div>
				<div class="row">
					<div class="columns  small-4 large-4">
			        	<label for="right-label center" class="">Name</label>
					</div>
					<div class="columns large-3 small-3">						
			        	<label for="right-label" class="">Quantity</label>
					</div>
					<div class="columns large-5 small-5">						
			        	<label for="right-label" class="">Notes</label>
					</div>
				</div>
				<div class="row" ng-repeat="form in forms_info">
					<div class="columns large-4  small-4">
			        	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="form.Form">
					</div>
					<div class="columns large-3 small-3">						
			        	<input type="text" id="right-label" ng-change="addForms()" ng-model="form.Quantity">
					</div>
					<div class="columns large-4 small-4">					
			        	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="form.Notes">
					</div>
					<div class="columns large-1 small-1 icon-cancel-circle"  ng-click="deleteForm($index)">			
					</div>
				</div>
				<div class="row">
					<div class="columns large-4 small-4">
			        	<label for="right-label" class="right inline">Total Quantity</label>
					</div>
					<div class="columns large-3 small-3">						
			        	<input type="text" id="right-label" ng-model="Quantity">
					</div>
					<div class="columns large-5 small-5">
			        	<label for="left-label" class="left inline"></label>
					</div>
				</div>
			</div>
		</div><!-- Forms -->
		<div class="row">
			<div class="columns large-8 small-8 form-info small-centered large-centered">
				<div class="row">
					<div class="columns large-12 small-12">
						<h3>Extras</h3>
					</div>
				</div>
				<div class="row">
					<div class="columns large-12 small-12 add-form icon-plus" ng-click="addExtra()">
					</div>
				</div>
				<div class="row">
					<div class="columns large-4 small-4">
			        	<label for="right-label center" class="">Charge</label>
					</div>
					<div class="columns large-3 small-3">						
			        	<label for="right-label" class="">Cost</label>
					</div>
					<div class="columns large-5 small-5">						
			        	<label for="right-label" class="">Notes</label>
					</div>
				</div>
				<div class="row" ng-repeat="extra in extras_info">
					<div class="columns large-4 small-4">
			        	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="extra.Subject">
					</div>
					<div class="columns large-3 small-3">						
			        	<input type="text" id="right-label" ng-model="extra.Cost" ng-change="addExtras()">
					</div>
					<div class="columns large-4 small-4">					
			        	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="extra.Description">
					</div>
					<div class="columns large-1 small-1 icon-cancel-circle" ng-click="deleteExtra($index)">			
					</div>
				</div>
				<div class="row">
					<div class="columns large-4 small-4">
			        	<label for="right-label" class="right inline">Total Cost</label>
					</div>
					<div class="columns large-3 small-3">						
			        	<input type="text" id="right-label" ng-model="ExtrasTotal">
					</div>
					<div class="columns large-5 small-5">
			        	<label for="left-label" class="left inline"></label>
					</div>
				</div>
			</div>
		</div><!-- Extras -->
		<div class="row">
			<div class="columns large-8 small-8 small-centered large-centered form-info">
				<div class="row">
					<div class="columns large-6 small-6">
						<h3>Shipping</h3>
					</div>
					<a href="/Intranet/ShippingTool/shipping.php?DocketNumber={{production_info.DocketNumber}}">			
						<div style="font-color:black" class="add-form columns large-6 small-6 icon-plus">
						</div>
					</a>
				</div><!-- Shipping Summary -->
				<div class="row">
					<div class="columns large-12">
					  <h5>Shipment Summary</h5>
					  <table class="shipment-table shipment-summary">
					    <tr>
					      <th>Form</th>
					      <th>Last Ship Date</th>
					      <th>Quantity Requested</th>
					      <th>Quantity Shipped</th>
					      <th>Difference</th>
					    </tr>
					    <tr ng-repeat="form in summary_info">
					      <td>{{form.Name}}</td>
					      <td>{{form.Date | date:'medium'}}</td>
					      <td>{{form.Quantity}}</td>
					      <td>{{form.Sent}}</td>
					      <td>{{form.Sent - form.Quantity}}</td>
					    </tr>
					  </table>
					</div>
					</div><!-- Summary -->
					<div class="row">
					<div class="columns large-12">
					  <h5>Shipment History</h5>
					  <table class="shipment-table shipment-summary">
					    <tbody ng-repeat="slip in history_info">
					      <tr>
					        <th colspan="3">{{slip[0].Date}}</th>
					      </tr>
					      <tr>
					        <th>Form</th>
					        <th>Quantity</th>
					        <th>Skids</th>
					      </tr>
					      <tr ng-repeat="form in slip">
					        <td>{{form.Form}}</td>
					        <td>{{form.Total}}</td>
					        <td>{{form.NoOfSkids}}</td>
					      </tr>
					    </tbody>
					  </table>
					</div>
				</div><!-- History -->
			</div>
		</div><!-- Shipping -->

		<div class="row">
			<div class="columns production-info large-8 large-centered small-centered">
				<h3>Variance</h3>
				<ng-include src="'templates/variance.html'"></ng-include>
			</div>
		</div><!-- Variance info -->
		<div class="row">
			<div class="columns large-12 small-12 small-centered large-centered form-info">
				<div class="row">
					<div class="columns large-4 small-4">
			        	<label for="right-label" class="right inline">Requote Memo</label>
					</div>
					<div class="columns large-8 small-8">						
			        	<input type="text" id="right-label" ng-change="saveProduction()" ng-model="RequoteMemo">
					</div>
				</div>
				<div class="row">
					<div class="columns large-4 small-4">
			        	<label for="right-label" class="right inline">Close Date</label>
					</div>
					<div class="columns large-8 small-8">						
			        	<input type="date" id="right-label" ng-change="closeJob()" ng-model="CloseDate"></input>
					</div>
				</div>
			</div>
		</div><!-- Requote Memo -->
		<div class="row">
			<div class="columns large-12 printable-card">
				<p class="customer">{{Customer}} #{{docket_number}}</p>
				<p class="job-name">{{JobName}}</p>
				<p class="finishing">{{Finishing}}</p>
				<p class="special">{{SpecialInstructions}}</p>
				<table class="runspeeds">
					<tr>
						<td>{{quote.sheets}} sheets</td>
						<td>{{quote.units}}pcs</td>
					</tr>
					<tr>
						<td>Press: {{quote.press_setup}}, {{quote.sheets / quote.press_runspeed|number:1}}</td>
						<td>Stripping: {{quote.units / quote.strip_runspeed |number:1}}</td>
					</tr>
					<tr>
						<td>Gluer: {{quote.gluer_setup}}, {{quote.units / quote.gluer_runspeed|number:1}}</td>
						<td>Handwork: {{quote.units / quote.handwork_runspeed |number:1}}</td>
					</tr>
				</table>
			</div>
		</div><!-- Rob's copy and paste -->
    </body>
</html>

