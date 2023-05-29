<?php
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
?>
<html ng-app='app'>
  <head>
    <script>
      //Load existing quote if GET is set.
      var existingQuote = 
      <?php 
      if (isset($_GET['quote_number'])) {
        echo json_encode($_GET['quote_number']);
      } else {
        echo json_encode(null);
      }
      ?>;
      var author = <?php echo  "'" . $_SESSION['name'] . "'";?>
    </script>
    <script src="../javascripts/QT/app-ck.js"></script>
    <script src="../javascripts/angular.js"></script>
    <script src="../javascripts/QT/QT.js"></script>
    <script src="../javascripts/QT/blur-directives.js"></script>
    <link rel="stylesheet" href="../stylesheets/QT/normalize.css" />
    <link rel="stylesheet" href="../stylesheets/QT/app.css" />
    <script src="../javascripts/vendor/custom.modernizr.js"></script>
  </head>
  <body ng-controller="QuoteController">
    <nav class="top-bar">
      <ul class="title-area">
        <!-- Title Area -->
        <li class="name">
          <h1><a href="../../Intranet">Home</a></h1>
        </li>
      </ul>
      <section class="top-bar-section">
        <!-- Left Nav Section -->
        <ul class="left">
          <li class="divider"></li>
          <li class="active"><a href="#" ng-click="createQuantity()">Add Quantity</a></li>
          <li class="divider"></li>
          <li class="active"><a href="#" ng-click="setAsNew()">Set As New</a></li>
          <li class="divider"></li>
          <li class=""><a href="worksheet.php?quote_number={{quoteNumber}}" target="_blank" class="open-quote">Work Sheet</a></li>
          <li class="divider"></li>
          <li class=""><a href="clientsheet.php?quote_number={{quoteNumber}}" target="_blank" class="open-quote">Client Sheet</a></li>
          <li class="divider"></li>
        </ul>
        <ul class="center">
          <li><a class="quote-number"  data-reveal-id="infoModal" href="#">{{quoteNumber}}</a></li>
        </ul>
        <!-- Right Nav Section -->
        <ul class="right">
          <li class="divider"></li>
          <li>
            <a href="../QuoteTool/index.php">Old Quote System</a></li>
          <li class="divider"></li>
          <li>
            <a href="index.php">New Quote</a>
          </li>
          <li class="divider"></li>
          <li>
            <a href="#" class="open-rates" data-reveal-id="ratesModal">Change Rates</a></li>
          </li>
        </ul>
      </section>
    </nav>
    <div class="row">
      <div class="columns large-12">
        <a href="index.php?quote_number={{new_quote_number}}" ng-show="new_quote_number">
          <h1>View {{new_quote_number}}</h1>
        </a>
      </div>
    </div>
    <div class="row">
      <div class="columns twelve quote-container">
        <ul class="large-block-grid-3">
          <li 
           class="quantity-container quantity-{{quantity.quantity_id}}" 
           ng-repeat="quantity in quoteQuantities" 
           ng-include="'templates/quote_quantity.html'">
          </li>
        </ul>
      </div>
    </div><!-- .quoteContainer -->
    <div id="ratesModal" class="reveal-modal">
      <a class="close-reveal-modal">&#215;</a>
      <div class="row" ng-controller="ShopRates" ng-include="'templates/shop_rates.html'"></div>
    </div><!-- Shop rates. -->
    <div id="infoModal" class="reveal-modal large">
      <form ng-submit="createQuote()">
        <h2>Quote # {{quoteNumber}}</h2>     
        <div class="ui-widget">
          <datalist id="customerList">
            <option ng-repeat="customer in customers track by $index" value="{{customer}}" >
          </datalist>
          <input type="text" ng-model="customer" name="customerList" list="customerList" placeholder="Enter Customer Here" />
          <input type="text" ng-model="job_name" placeholder="Enter Job name"/>
          <input type="text" ng-model="attention" placeholder="Attention"/>
          <textarea class="modal-input" type="text" ng-model="description" placeholder="Description"></textarea>
          <textarea class="modal-input" type="text" ng-model="notes" placeholder="Add notes"></textarea>
        </div>
        <a class="close-reveal-modal">&#215;</a>
        <input class="button" type="submit"/>
      </form>
    </div>
  </body>
</html>