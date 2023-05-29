/*
	This controller allows the user to edit the Production page of a job.

	It should have access to the main Production table.

	It should also display and save forms and extras.

	It should also display a shipment summary.

	It should also have links to:
		-closing the job
		-the work order
		-billing report
		-delivery report
		-new shipment
		-shipment history
*/

//We're checking for the existence of the modules because this controller
// is used on the homepage and on a single page.
if (typeof ProductionModule != 'undefined') {
    ProductionModule.controller(Production);
}
if (typeof HomePageModule != 'undefined') {
    HomePageModule.controller(Production);
}

var Production = ['$scope', '$http', '$location', 'ProductionService', function ($scope, $http, $location, ProductionService) {
	/* This is a row from the Production table.*/
	$scope.production_info = null;
	/* The current Docket Number */
	$scope.docket_number = null;
    $scope.QuoteNumber = null;
    $scope.FinalPrice = null;
    $scope.ProductionPerson = null;
    $scope.CustomerPoNo = null;
    $scope.Customer = null;
    $scope.JobName = null;
    $scope.Finishing = null;
    $scope.SpecialInstructions = null;
    $scope.QuoteQuantities = null;
    $scope.QuoteQuantityID = null;

    /* This is a class used to start and end the saving animation.*/
    $scope.saving = null;

    /* A list of customers to bind the job to. */
    $scope.customers = null;
    
	/*
		For the set docket number, return the matching row from the Production table
	*/
	$scope.getProductionInfo = function() {
		$http.post(
            "../Production/php/WorkOrderHelper.php", 
            { "data" : {
              request: "get_production_info",
              docket_number: $scope.docket_number
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.production_info = data;
                    $scope.QuoteNumber = $scope.production_info.QuoteNumber;
                    $scope.FinalPrice = $scope.production_info.FinalPrice;
                    $scope.ProductionPerson = $scope.production_info.ProductionPerson;
                    $scope.CustomerPoNo = $scope.production_info.CustomerPoNo;
                    $scope.Customer = $scope.production_info.Customer;
                    $scope.JobName = $scope.production_info.JobName;
                    $scope.Finishing = $scope.production_info.Finishing;
                    $scope.SpecialInstructions = $scope.production_info.SpecialInstructions;
                    $scope.QuoteQuantityID = $scope.production_info.QuoteQuantityID;
                    $scope.ExtrasTotal = $scope.production_info.ExtrasTotal;
                    $scope.Quantity = $scope.production_info.Quantity;
                    if ($scope.QuoteNumber > 150000) {
                        $scope.getQuantities();
                    }
                    console.log(data);
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
	}

	/*
        Triggered when user enters a quote number.
    */
    $scope.getQuantities = function() {
        /* We can only bind quantities to the job if it is part of the new quote system which begins at 150 000 */
        if ($scope.QuoteNumber > 150000) { 
            $http.post(
                "../Production/php/ProductionHelper.php", 
                { "data" : {
                  request: "get_quantities",
                  quote_number: $scope.QuoteNumber
                    }
                }).
                success(function(data, status) {
                    if (!data.ERROR) {
                        $scope.QuoteQuantities = data;
                    } else {
                        console.log(data);
                    }
                }).
                error(function(data, status) {
                  console.log("Post failed.");
                });
        }
    }

    /*
        Get the forms for the current Docket Number.
    */
    $scope.getForms = function() {

        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "get_forms",
              docket_number: $scope.docket_number
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.forms_info = data;
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }
    /*
        Get the forms for the current Docket Number.
    */
    $scope.getExtras = function() {

        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "get_extras",
              docket_number: $scope.docket_number
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.extras_info = data;
                    console.log(data);
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }

    /*
        Triggered on add form button, create a new instance in the forms_info object.
    */
    $scope.addForm = function() {
        console.log("Adsfds");
        $scope.forms_info.push({
            Form: "", Quantity: "", Notes:""
        });
    }

    /*
        Triggered on click of the add extra button, create a new instance in the extras_info object.
    */
    $scope.addExtra = function() {
        $scope.extras_info.push({Subject:"", Cost: "", Description: ""});
    }


    /*
        Triggered on input change of form quantities.
        Add up all the quantities and set it as $scope.Quantity.
    */
    $scope.addForms = function() {
        var total = 0;
        for (var i in $scope.forms_info) {
            var quantity = parseInt($scope.forms_info[i].Quantity) || 0;
            total+= quantity;
        }
        $scope.Quantity = total;
    }

    /*
        Trigger on input change of the costs for the extras.
        Add up all the costs and set it as ExtrasTotal
    */
    $scope.addExtras = function() {
        var total = 0;
        for (var i in $scope.extras_info) {
            var extra = parseInt($scope.extras_info[i].Cost) || 0;
            total+= extra;
        }
        $scope.ExtrasTotal = total;
    }

    /*
        Save the production page:
            -production info for the Production table
            -the forms and extras for the Forms table and the ExtraCharges table.
                    
                    $scope.QuoteNumber = $scope.production_info.QuoteNumber;
                    $scope.FinalPrice = $scope.production_info.FinalPrice;
                    $scope.ProductionPerson = $scope.production_info.ProductionPerson;
                    $scope.CustomerPoNo = $scope.production_info.CustomerPoNo;
                    $scope.Customer = $scope.production_info.Customer;
                    $scope.JobName = $scope.production_info.JobName;
                    $scope.Finishing = $scope.production_info.Finishing;
                    $scope.SpecialInstructions = $scope.production_info.SpecialInstructions;
                    $scope.QuoteQuantityID = $scope.production_info.QuoteQuantityID;
                    $scope.ExtrasTotal = $scope.production_info.ExtrasTotal;
                    

    */
    $scope.saveProduction = function() {
        $scope.saving = "state-loading";
        /* Save the Production info.*/
        var query = "UPDATE Production SET QuoteNumber='" + $scope.QuoteNumber + "',"
        + "FinalPrice='" + $scope.FinalPrice + "', "
        + "ProductionPerson='" + $scope.ProductionPerson + "', "
        + "CustomerPoNo='" + $scope.CustomerPoNo + "', "
        + "Customer='" + $scope.Customer + "', "
        + "JobName='" + $scope.JobName + "', "
        + "Finishing='" + $scope.Finishing + "', "
        + "SpecialInstructions='" + $scope.SpecialInstructions + "', "
        + "QuoteQuantityID='" + $scope.QuoteQuantityID + "', "
        + "ExtrasTotal='" + $scope.ExtrasTotal + "', "
        + "Quantity='" + $scope.Quantity + "' "
        + "WHERE DocketNumber=" + $scope.docket_number + ";";

        /* Save the forms */
        for (var i in $scope.forms_info) {
            //These are new forms.
            if (!("FormId" in $scope.forms_info[i])) {
                query += "INSERT INTO Forms "
                        + "(DocketNumber, Notes, Quantity, Form) VALUES "
                        + "('" + $scope.docket_number
                        + "','" + $scope.forms_info[i].Notes
                        + "','" + $scope.forms_info[i].Quantity
                        + "','" + $scope.forms_info[i].Form
                        + "');";
            } else {
            //These forms are existing forms.
            query += " UPDATE Forms SET "
                    + "Quantity=" + $scope.forms_info[i].Quantity + " ," 
                    + "Form='" + String($scope.forms_info[i].Form) + "' ," 
                    + "Notes='"  + String($scope.forms_info[i].Notes)             
                    + "' WHERE FormId=" + String($scope.forms_info[i].FormId) + ";";
            }

        }
        /* Save the Extras */
        for (var i in $scope.extras_info) {
            //These are new forms.
            if (!("ExId" in $scope.extras_info[i])) {
                query += "INSERT INTO ExtraCharges "
                        + "(DocketNumber, Description, Cost, Subject) VALUES "
                        + "('" + $scope.docket_number
                        + "','" + $scope.extras_info[i].Description
                        + "','" + $scope.extras_info[i].Cost
                        + "','" + $scope.extras_info[i].Subject
                        + "');";
            } else {
            //These Extras are existing Extras.
            query += " UPDATE ExtraCharges SET "
                    + "Description='" + $scope.extras_info[i].Description + "' ," 
                    + "Cost='" + String($scope.extras_info[i].Cost) + "' ," 
                    + "Subject='"  + String($scope.extras_info[i].Subject)             
                    + "' WHERE ExId=" + String($scope.extras_info[i].ExId) + ";";
            }

        }

        $scope.runQueries(query);
    }

    /* 
        Delete from the front end the form that was clicked.
        If the form has a FormId (meaning it is in the db already), delete it form the db
    */
    $scope.deleteForm = function(index) {
        //If it is not a new form, delete it from the databsae
        if ("FormId" in $scope.forms_info[index]) {
            query = "DELETE FROM Forms WHERE FormId=" + $scope.forms_info[index].FormId + ";";
            $scope.runQueries(query);
        }
        //Delete it from the frontend
        $scope.forms_info.splice(index, 1);
    }
    /*
        Delete the given index of extra, if it is in the db, delete it there too.
    */
    $scope.deleteExtra = function(index) {
        //If it is not a new form, delete it from the databsae
        if ("ExId" in $scope.extras_info[index]) {
            query = "DELETE FROM ExtraCharges WHERE ExId=" + $scope.extras_info[index].ExId + ";";
            $scope.runQueries(query);
        }
        //Delete it from the frontend
        $scope.extras_info.splice(index, 1);
    }


    /*
        Send a post request to the server to run the given query.
        The query can be a big string of semi-colon separated queries.
    */
    $scope.runQueries = function (query) {
        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "run_queries",
              query: query
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    console.log(data);
                    $scope.saving = null;
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }
    /*
        Get the shipment info.
        Set the summary info to $scope.summary_info
        Set the history info to $scope.history_info
    */
    $scope.getShipmentInfo = function() {
        $http.post(
            "../Shipping/php/DeliveryReportHelper.php", 
            { "data" : {
              request: "get_shipment_info",
              docket_number: $scope.docket_number
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.summary_info = data.summary;
                    $scope.history_info = data.history;
                    console.log(data);
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }

    $scope.getCustomers = function() {
        $http.post(
            "../HomePage/php/DocketLoginHelper.php", 
            { "data" : {
              request: "get_customers"
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.customers = data;
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }


    /* 
        Get all the data for the current docket number.
    */
    $scope.initProduction = function() {

        $scope.getProductionInfo();
        $scope.getForms();
        $scope.getExtras();
        $scope.getShipmentInfo();
        $scope.getCustomers();
    }

    /* Entry point into this production editor: get the job you're editing: */
    if (typeof DocketNumber != 'undefined' && DocketNumber !== null) {
    
        $scope.docket_number = DocketNumber;
        $scope.initProduction();
    }
    /*
        Handler when the duedates field passes in a docket number.
    */
    $scope.$on('docketNumberAvailable', function() {
        console.log("Adsffdsa");
        var new_docket_number = ProductionService.getDocketNumber();
        $scope.docket_number = new_docket_number;
        $scope.initProduction();
    });
    $scope.closeJob = function() {

        var query = "UPDATE Production Set Status='closed' WHERE DocketNumber=" + $scope.docket_number;
        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "run_queries",
              query: query
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.saving = null;
                    window.location.href = "/Intranet/Production/Billing.php?docket_number=" + $scope.docket_number;
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
              console.log(data);
              console.log(status);
            });
    }
}];
