<?php
/*
	This workorder is stapled to the docket and is used throughout the entire shop 
	throughout the time the job is in the shop.

	It needs to display the docket information.

	It needs to draw the estimated runspeeds from the quote this job is binded to.
	This cannot always be done for jobs that are binded to an old quote.
	Written by Peter Tran Aug 8th, 2013. 
*/
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
?>
<html ng-app="ShippingModule">
    <head>
        <title>Alternative DC Intranet Delivery Report</title>
        <link type="text/css" rel="stylesheet" href="../stylesheets/Shipping/app.css" />
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
        <script type="text/javascript" src="../javascripts/angular.js"></script>
        <script type="text/javascript" src="../javascripts/Shipping/app-ck.js"></script>
    </head><!-- head -->
    <body ng-controller="DeliveryReport">
      <div class="row">
        <div class="columns small-7">
          <h4 class="title">Billing</h4>
        </div>
        <div class="columns small-5">
          <h4 class="title">{{production_info.Customer}}</h4>
          <ul class="no-bullet">
            <li>{{production_info.ProductionPerson}}</li>
            <li>PO#: {{production_info.CustomerPoNo}}</li>
            <li>Quote#: {{production_info.QuoteNumber}}</li>
          </ul>
        </div>
      </div><!-- Header info - our info, customer info -->
      <div class="row">
        <div class="title-info small-centered large-centered columns small-12 ">
          <div class="title-wrapper">
            <h3>{{production_info.JobName}}</h3>
            <h4>Docket #{{production_info.DocketNumber}}</h4>
            <h4>{{date}}</h4>
          </div>
        </div>
      </div><!-- Title info -->
      <div class="row">
        <div class="columns large-12">
          <h5>Total Charges</h5>
          <table class="shipment-table shipment-summary">
            <tr>
              <td>Price Before Extras</td>
              <td>{{production_info.FinalPrice | currency}}</td>
            </tr>
            <tr>
              <td>Total Extra Charges</td>
              <td>{{ExtrasTotal | currency}}</td>
            </tr>
            <tr>
              <th>Total with Extras</th>
              <th>{{ExtrasTotal*1 + production_info.FinalPrice*1| currency}}</th>
            </tr>
          </table>
        </div>
      </div><!-- Total Charges -->
      <div class="row">
        <div class="columns large-12">
          <h5>Extra Charges</h5>
          <table class="shipment-table shipment-summary">
            <tr>
              <th>Charge</th>
              <th>Cost</th>
              <th>Notes</th>
            </tr>
            <tr ng-repeat="extra in extras_info">
              <td>{{extra.Subject}}</td>
              <td>{{extra.Cost}}</td>
              <td>{{extra.Description}}</td>
            </tr>
            <tr>
              <th>Total Extra Charges</th>
              <th>{{ExtrasTotal | currency}}</th>
              <td></td>
            </tr>
          </table>
        </div>
      </div><!-- Extras -->
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
            <tr>
                <th>Total</th>
                <th></th>
                <th>{{requested_total}}</th>
                <th>{{sent_total}}</th>
                <th>{{sent_total - requested_total}}</th>
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
    </body>
</html>