<?php
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
?>
<html ng-app='app'>
  <head>
    <script src="javascripts/quote-ck.js"></script>
    <script src="javascripts/QT.js"></script>
    <script src="javascripts/blur-directives.js"></script>
    <link rel="stylesheet" href="stylesheets/app.css">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.0/themes/base/jquery-ui.css">
  </head>
  <body ng-controller="QuoteController">
    <div class="row">
      <div class="columns twelve">
        <button class="button" ng-click="createQuantity()">Add Quantity</button>
        <a class="button" data-reveal-id="ratesModal"> Change Rates</a>
        <li ng-repeat="t in test">{{t}}</li>
      </div>
    </div><!-- Control panel -->
    <div class="row">
      <div class="columns twelve quote-container">
        <ul class="block-grid three-up mobile">
          <li class="quantity-container" ng-repeat="quantity in quoteQuantities" ng-include="'templates/quote_quantity.html'">
          </li>
        </ul>
      </div>
    </div><!-- .quoteContainer -->
    <div id="ratesModal" class="reveal-modal xlarge">
      <button class="close-reveal-modal">&#215;</button>
      <div class="row" ng-controller="ShopRates">
        <div class="columns four">
          <h4>Shop Rates</h4>
          <ul class="shop-rates">
            <li>
              <span>Die</span>
              <input type="text" name="die_per_hour" value="{{rates.die_per_hour}}" ng-model="QT_MasterRates" ng-model-onblur/>
            </li>
            <li>
              <span>Cutter</spam>
              <input type="text" name="cutter_per_hour" value="{{rates.cutter_per_hour}}" ng-model="QT_MasterRates" ng-model-onblur/>
            </li>
            <li>
              <span>Stripping</span>
              <input type="text" name="strip_per_hour" value="{{rates.strip_per_hour}}"  ng-model="QT_MasterRates" ng-model-onblur/>
            </li>
            <li>
              <span>Handwork</span>
              <input type="text" name="handwork_per_hour" value="{{rates.handwork_per_hour}}"  ng-model="QT_MasterRates" ng-model-onblur/>
            </li>
            <li>
              <span>Pick Up First Skid</span>
              <input type="text" name="pickup_first_skid" value="{{rates.pickup_first_skid}}"  ng-model="QT_MasterRates" ng-model-onblur/>
            </li>
            <li>
              <span>Pick Up Per Skid </span>
              <input type="text" name="pickup_per_skid" value="{{rates.pickup_per_skid}}"  ng-model="QT_MasterRates" ng-model-onblur/>
            </li>
            <li>
              <span>Delivery First Skid</span>
              <input type="text" name="delivery_first_skid" value="{{rates.delivery_first_skid}}"  ng-model="QT_MasterRates" ng-model-onblur/>
            </li>
            <li>
              <span>Delivery Per Skid </span>
              <input type="text" name="delivery_per_skid" value="{{rates.delivery_per_skid}}"  ng-model="QT_MasterRates" ng-model-onblur/>
            </li>
          </ul>
        </div>
        <div class="columns four">
          <h4>Press Rates</h4>
          <ul class="press-rates">
            <li ng-repeat="press in press_rates">
              {{press.name}}<input type="text" name="{{press.name}}" value="{{press.rate}}" ng-model="QT_Press" ng-model-onblur/>
            </li>
          </ul>
        </div>
        <div class="columns four">
          <h4>Gluer Rates</h4>
          <ul class="gluer-rates">
            <li ng-repeat="gluer in gluer_rates">
              {{gluer.name}}<input type="text" name="{{gluer.name}}" value="{{gluer.rate}}" ng-model="QT_Gluer" ng-model-onblur/>
            </li>
          </ul>
        </div>
      </div><!-- Shop rates. -->
    </div>
    <div id="infoModal" class=" reveal-modal xlarge">
      <form ng-submit="createQuote()">
        <h2>Quote # {{quoteNumber}}</h2>
        <div class="ui-widget">
          <input type="text" ng-model="customer" ui-keypress="{'enter':'loadCustomers($event)'}" placeholder="Enter customer here" id="customers"/>
          <input type="text" ng-model="job_name" placeholder="Enter job name"/>
          <input type="text" ng-model="attention" placeholder="Attention"/>
          <input type="text" ng-model="description" placeholder="Description"/>
          <input type="text" ng-model="notes" placeholder="Add notes"/>
        </div>
        <button class="close-reveal-modal">&#215;</button>
      </form>
    </div>
  </body>
</html>