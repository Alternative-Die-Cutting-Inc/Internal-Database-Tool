<?php

//require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";

require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/phpmailer/mailHelper.php";
require_once("../Resources/pdfcrowd/pdfcrowd.php");
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
    <link rel="stylesheet" href="../stylesheets/QT/clientsheet.css" />
    <script src="../javascripts/vendor/custom.modernizr.js"></script>
  </head>
  <body ng-controller="QuoteController">
    <?php if (!isset($_GET['pdf'])) { ?>
    <div id="emailer">
      <form ng-submit="emailClientPDF()">
        <input ng-model="inputEmails" type="text" name="clientEmail"/>
        <select ng-model="clientEmail" ng-options="email for email in emaillist">
        </select>
        <input type="submit" value="Email PDF"></input>
        <div id="addMessageToEmail">
          <textarea  placeholder="Enter custom email message here." ng-model="message" ng-trim='false'></textarea>
        </div>
      </form>
    </div>
    <div class="notice">
      <div ng-class="loader">
      </div>
      <p ng-bind-html-unsafe="notice"></p>
    </div>
    <?php } ?>
    <header>
      <div class="company-logo">
        <img src="../Resources/Images/alt_logo.gif" alt="Alternative Logo" />
      </div>
      <div class="company-header">
        <h4>Alternative Die Cutting, Inc.</h4>
        <p>132 Alexdon Rd. Toronto ON M3J2B3 <br />
            Tel: 416-748-6868 <br />
            Fax: 416-748-0737 <br />
            www.alternativedc.com <br />
        </p>
      </div>
      <div class="quote-info" align="right">
        <h1>#{{quoteNumber}}</h1> 
        <h3>{{customer}}</h3>
        <h3>Attention: {{attention}}</h3>
      </div>
    </header>
    <div class="summary" align="center">
      <p>Quote for <b>{{customer}}</b> by {{author}} on {{date}}</p>
      <h2>{{job_name}}</h2>
        <p ng-bind-html-unsafe="description"></p>
        <p ng-bind-html-unsafe="notes"></p>
    </div>
    <div class="columns twelve quote-container"
      ng-repeat="row in partition" 
       ng-include="'templates/client_quote.html'">
    </div>
  </body>
</html>