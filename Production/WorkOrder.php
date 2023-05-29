<?php
/*
	This workorder is stapled to the docket and is used throughout the entire shop 
	throughout the time the job is in the shop.

	It needs to display the docket information.

	It needs to draw the estimated runspeeds from the quote this job is binded to.
	This cannot always be done for jobs that are binded to an old quote.
	Written by Peter Tran Aug 2nd, 2013.
*/
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Include/intranet_authentication.inc";
?>
<html ng-app="ProductionModule">
  <head>
    <title>Alternative DC Intranet Docket</title>
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
  <body ng-controller="WorkOrder">
    <div class="row">
      <div class="columns large-6">
        <h1 class="header-info">{{production_info.Customer}}</h1>
        <p class="header-info">PO#:{{production_info.CustomerPoNo}}</p>
        <p class="header-info">Quote#: {{production_info.QuoteNumber}}</p>
        <p class="header-info">Production Person: {{production_info.ProductionPerson}}</p>
        <p class="header-info">{{production_info.Date}}</p>
      </div>
      <div class="columns large-6" align="right">
        <?php echo '<IMG SRC="../Resources/Barcode/barcode.php?barcode=' . $_GET['docket_number'] . '&width=320&height=50">';?> 
        <h1 class="docket-number">Docket#{{production_info.DocketNumber}}</h1>
      </div>
    </div><!-- Document header info -->
    <div class="row">
      <div class="columns-12">
        <div class="job-info">
          <h4>{{production_info.JobName}}</h4>
          <p>{{production_info.Finishing}}</p>
          <p>{{production_info.SpecialInstructions}}</p>
        </div>
      </div>
    </div><!-- Main Job Info -->
    <div class="row">
      <div class="columns large-12">
        <table class="forms-table">
          <tr>
            <th>Form</th>
            <th>Quantity</th>
            <th>Notes</th>
            <th>Quantity Run</th>
          </tr>
          <tr ng-repeat="form in forms_info">
            <td>{{form.Form}}</td>
            <td>{{form.Quantity}}</td>
            <td>{{form.Notes}}</td>
            <td></td>
          </tr>
        </table>
      </div>
    </div><!-- Forms -->
    <div class="row">
      <div class="columns large-12 notes">
        <label>Press: ____________ Operator: ____________ Die: ____________ Due Date: ____________ </label>
        <label>Notes: __________________________________________________________________________________________</label>
      </div>
    </div>
    <div class="row">
      <div class="columns large-12">
        <div class="row runtimes">
          <div class="columns large-3">
            <table class="runtimes-table">
              <tr>
                <th colspan="2">Press</th>
              </tr>
              <tr>
                <th>Setup</th>
                <td width="100px">{{quote_info.press_setup}}</td>
              </tr>
              <tr>
                <th>Speed</th>
                <td width="100px">{{quote_info.press_runspeed}}</td>
              </tr>
              <tr>
                <th>Hours</th>
                <td width="100px">{{quote_info.sheets / quote_info.press_runspeed | number:2}}</td>
              </tr>
              <tr>
                <th>Setup</th>
                <td width="100px"></td>
              </tr>
              <tr>
                <th>Speed</th>
                <td width="100px"></td>
              </tr>
              <tr>
                <th>Hours</th>
                <td width="100px"></td>
              </tr>
            </table>
          </div>
          <div class="columns large-3">
            <table class="runtimes-table">
              <tr>
                <th colspan="2">Gluing</th>
              </tr>
              <tr>
                <th>Setup</th>
                <td width="100px">{{quote_info.gluer_setup}}</td>
              </tr>
              <tr>
                <th>Speed</th>
                <td width="100px">{{quote_info.gluer_runspeed}}</td>
              </tr>
              <tr>
                <th>Hours</th>
                <td width="100px">{{quote_info.units / quote_info.gluer_runspeed | number:2}}</td>
              </tr>
              <tr>
                <th>Setup</th>
                <td width="100px"></td>
              </tr>
              <tr>
                <th>Speed</th>
                <td width="100px"></td>
              </tr>
              <tr>
                <th>Hours</th>
                <td width="100px"></td>
              </tr>
            </table>
          </div>
          <div class="columns large-3">
            <table class="runtimes-table">
              <tr>
                <th colspan="2">Stripping</th>
              </tr>
              <tr>
                <th>Speed</th>
                <td width="100px">{{quote_info.strip_runspeed}}</td>
              </tr>
              <tr>
                <th>Hours</th>
                <td width="100px">{{quote_info.units / quote_info.strip_runspeed | number:2}}</td>
              </tr>
              <tr>
                <th>Hours</th>
                <td width="100px"></td>
              </tr>
            </table>
          </div>
          <div class="columns large-3">
            <table class="runtimes-table">
              <tr>
                <th colspan="2">Handwork</th>
              </tr>
              <tr>
                <th>1</th>
                <td width="100px">{{quote_info.handwork_runspeed}}</td>
              </tr>
              <tr>
                <th>2</th>
                <td width="100px">{{quote_info.handwork_runspeed / 2 |number:0}}</td>
              </tr>
              <tr>
                <th>3</th>
                <td width="100px">{{quote_info.handwork_runspeed / 3 |number:0}}</td>
              </tr>
              <tr>
                <th>4</th>
                <td width="100px">{{quote_info.handwork_runspeed / 4 |number:0}}</td>
              </tr>
              <tr>
                <th>5</th>
                <td width="100px">{{quote_info.handwork_runspeed / 5 |number:0}}</td>
              </tr>
              <tr>
                <th>6</th>
                <td width="100px">{{quote_info.handwork_runspeed / 6 |number:0}}</td>
              </tr>
              <tr>
                <th>7</th>
                <td width="100px">{{quote_info.handwork_runspeed / 7 |number:0}}</td>
              </tr>
              <tr>
                <th>Hours</th>
                <td width="100px">{{quote_info.units / quote_info.handwork_runspeed | number:2}}</td>
              </tr>
              <tr>
                <th>Hours</th>
                <td width="100px"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div><!-- Statistics on job performance / quote -->
  </body>
</html>