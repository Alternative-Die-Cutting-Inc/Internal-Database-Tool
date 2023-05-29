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
    </script>
    <script src="../javascripts/QT/app-ck.js"></script>
    <script src="../javascripts/angular.js"></script>
    <script src="../javascripts/QT/QT.js"></script>
    <script src="../javascripts/QT/blur-directives.js"></script>
    <script src="../javascripts/vendor/custom.modernizr.js"></script>
    <link rel="stylesheet" href="../stylesheets/QT/worksheet.css" />
  </head>
  <body ng-controller="QuoteController">
    <div class="row quote-info">
      <div class="columns large-4 quote-details">
        <h3>#{{quoteNumber}}</h3>
        <h3>{{customer}}</h3>
        <h3>Attn:{{attention}}</h3>
        <h3>{{author}}</h3>
        <h3>{{date}}</h3>
      </div>
      <div class="columns quote-describe">
        <h3>{{job_name}}</h3>
        <p ng-bind-html-unsafe="description"></p>
        <p ng-bind-html-unsafe="notes"></p>
      </div>
    </div>
    <div class="row">
      <div class="columns twelve quote-container">
        <div 
         class="quantity-container quantity-{{quantity.quantity_id}}" 
         ng-repeat="quantity in quoteQuantities" 
         ng-include="'templates/worksheet_quantity.html'">
        </div>
      </div>
    </div><!-- .quoteContainer -->
  </div>
  </body>
</html>