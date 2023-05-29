<?php
//require $_SERVER['DOCUMENT_ROOT'] . '/Intranet/Dev/dev_authentication.inc';
//already imported in .inc file
//require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
//require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/QuoteTool/Backend/quotePrep.php";
require "helper.php";
session_start();
$_SESSION['name'] = "Daniel";
?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Local Testing</title>

        <!-- link to JQuery -->
        <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
        
        <!-- link to QUnit resources -->
        <link rel="stylesheet" href="http://code.jquery.com/qunit/git/qunit.css" type="text/css" media="screen" />
        <script type="text/javascript" src="http://code.jquery.com/qunit/git/qunit.js"></script>

        <script type="text/javascript" src="/Intranet/Resources/Scripts/helper.js"></script>
        <script type="text/javascript" src="/Intranet/QuoteTool/Scripts/quoteTool.js"></script>

        <script type="text/javascript">
            function getqn() {
                var qn, i;
                
                for(i = 0; i < 10; i++) {
                    $.ajax({
                        dataType: "xml",
                        type: "post",
                        url: "/Intranet/QuoteTool/Backend/quotePrep.php",
                        async: false,
                        data: {
                            opt: "prep"
                        },
                        success: function(xml) {
                            qn = xml;
                        },
                        error: function() {
                            qn = "ERROR";
                        }
                    });
                    
                    console.log("[" + i + "] --> " + qn);
                }
            }
            
            function getcustrate() {
                var rate, customer;
                var customers = new Array("On The Mark Graphics", "Continental Press", "Capital graphics");
                
                $.each(customers, function(i){
                    customer = customers[i];
                    
                    $.ajax({
                        type: "post",
                        url: "/Intranet/QuoteTool/Backend/getcustomerrate.php",
                        async: false,
                        data: {
                            customer: customer
                        },
                        success: function(xml) {
                            rate = xml;
                        },
                        error: function() {
                            rate = "ERROR";
                        }
                    });
                    
                    console.log("[" + i + "] --> " + rate);
                });
            }
            
            function testIt() {
                var str = "Is undefined NAN? ";
                var res = isNaN(undefined);
                console.log(str + " Answer: " + res);
            }
            
            $(document).ready(function() {
                testIt();
                
                module("QuoteTool utility class");
                
                test("fetchCustomerRate method", function() {
//                    var customers = new Array("On The Mark Graphics", "Continental Press", );
                    var customer, rate;
                    
                    customer = "Capital graphics";
                    rate = QuoteTool.fetchCustomerRate(customer);
                    strictEqual(rate, 1.0, "fetched a standard rate");
                    
                    customer = "On The Mark Graphics";
                    rate = QuoteTool.fetchCustomerRate(customer);
                    strictEqual(rate, 0.95, "fetched a lower rate");
                    
                    customer = "Continental Press";
                    rate = QuoteTool.fetchCustomerRate(customer);
                    strictEqual(rate, 1.05, "fetched a lower rate");
                    
                    customer = "0[ih43og";
                    rate = QuoteTool.fetchCustomerRate(customer);
                    //this is because backend should not fail for a customer like this
                    strictEqual(rate, 1.00, "fetched rate for non-existant customer");
                    
                    customer = "'OR 1=1";
                    rate = QuoteTool.fetchCustomerRate(customer);
                    //this is because backend should not fail for a customer like this
                    strictEqual(rate, 1.00, "fetched rate for non-existant customer");
                });
                
                module("QuoteCalculator class");
                
//                test("")
            });
        </script>
    </head>
    <body>
        <h1>Local Testing</h1>
        <form method="post" action="<?php echo $_SERVER['PHP_SELF']; ?>">
            <button type="button" onclick="getqn()">10 QNs</button>
            <button type="button" onclick="getcustrate()">Customer rates</button>
        </form>
        
        <h1 id="qunit-header">QUnit example</h1>
        <h2 id="qunit-banner"></h2>
        <div id="qunit-testrunner-toolbar"></div>
        <h2 id="qunit-userAgent"></h2>
        <ol id="qunit-tests"></ol>
        <div id="qunit-fixture">test markup, will be hidden</div>
    </body>
</html>
