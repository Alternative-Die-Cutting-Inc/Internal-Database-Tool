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
    $scope.jobtype = null;
    $scope.quote = null;

    $scope.jobtypes = [
        "commercial", "packaging", "nflute"
    ];

    /* This is a class used to start and end the saving animation.*/
    $scope.saving = null;

    /* A list of customers to bind the job to. */
    $scope.customers = null;

    $scope.CloseDate = "NOW()";
    
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
                    $scope.something=data.Customer;
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
                    $scope.RequoteMemo = $scope.production_info.RequoteMemo;
                    $scope.jobtype = $scope.production_info.JobType;
                    
                    $scope.quantitySelected();
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
        $scope.saveProduction();
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
        Triggered on add form button, create a new instance in the forms_info object.
    */
    $scope.addForm = function() {

        $scope.saving = "state-loading";

        //Create a new entry
        var query = "INSERT INTO Forms "
                        + "(DocketNumber, Notes, Quantity, Form) VALUES "
                        + "('" + $scope.docket_number
                        + "','','','');";
        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "run_queries",
              query: query
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.getForms();
                } else {
                    console.log(status)
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
        //reset forms_info
    }

    /*
        Triggered on click of the add extra button, create a new instance in the extras_info object.
    */
    $scope.addExtra = function() {
        $scope.saving = "state-loading";
        query = "INSERT INTO ExtraCharges "
                        + "(DocketNumber, Description, Cost, Subject) VALUES "
                        + "('" + $scope.docket_number
                        + "','', '','');";$http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "run_queries",
              query: query
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.getExtras();
                } else {
                    console.log(status)
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
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

        $scope.saveProduction();
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
        $scope.saveProduction();
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
        /* Save the Production info.*/
        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "save_production",
              QuoteNumber: ($scope.QuoteNumber !== '' && typeof $scope.QuoteNumber !== "undefined"? $scope.QuoteNumber: ""),
              FinalPrice: ($scope.FinalPrice !== '' && typeof $scope.FinalPrice !== "undefined"? $scope.FinalPrice: ""),
              ProductionPerson: ($scope.ProductionPerson !== '' && typeof $scope.ProductionPerson !== "undefined"? $scope.ProductionPerson: ""),
              CustomerPoNo: ($scope.CustomerPoNo !== '' && typeof $scope.CustomerPoNo !== "undefined"? $scope.CustomerPoNo: ""),
              Customer: ($scope.Customer !== '' && typeof $scope.Customer !== "undefined"? $scope.Customer: ""),
              JobName: ($scope.JobName !== '' && typeof $scope.JobName !== "undefined"? $scope.JobName: ""),
              Finishing: ($scope.Finishing !== '' && typeof $scope.Finishing !== "undefined"? $scope.Finishing: ""),
              SpecialInstructions: ($scope.SpecialInstructions !== '' && typeof $scope.SpecialInstructions !== "undefined"? $scope.SpecialInstructions: ""),
              QuoteQuantityID: ($scope.QuoteQuantityID !== '' && typeof $scope.QuoteQuantityID !== "undefined"? $scope.QuoteQuantityID: ""),
              ExtrasTotal: ($scope.ExtrasTotal !== '' && typeof $scope.ExtrasTotal !== "undefined"? $scope.ExtrasTotal: ""),
              Quantity: ($scope.Quantity !== '' && typeof $scope.Quantity !== "undefined"? $scope.Quantity: ""),
              JobType: ($scope.jobtype !== '' && typeof $scope.jobtype !== "undefined"? $scope.jobtype: ""),
              RequoteMemo: ($scope.RequoteMemo !== '' && typeof $scope.RequoteMemo !== "undefined"? $scope.RequoteMemo: ""),
              DocketNumber: ($scope.docket_number !== '' && typeof $scope.docket_number !== "undefined"? $scope.docket_number: "")   
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    console.log(data);
                } else {
                    console.log('error saving');
                    console.log(status)
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
        var query = "";
        /* Save the forms */
        for (var i in $scope.forms_info) {

            //These forms are existing forms.
            query += " UPDATE Forms SET "
                    + "Quantity=" + $scope.forms_info[i].Quantity + " ," 
                    + "Form='" + String($scope.forms_info[i].Form) + "' ," 
                    + "Notes='"  + String($scope.forms_info[i].Notes)             
                    + "' WHERE FormId=" + String($scope.forms_info[i].FormId) + ";";


        }
        /* Save the Extras */
        for (var i in $scope.extras_info) {
            query += " UPDATE ExtraCharges SET "
                    + "Description='" + $scope.extras_info[i].Description + "' ," 
                    + "Cost='" + String($scope.extras_info[i].Cost) + "' ," 
                    + "Subject='"  + String($scope.extras_info[i].Subject)             
                    + "' WHERE ExId=" + String($scope.extras_info[i].ExId) + ";";

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
                    $scope.saving = null;
                } else {
                    console.log('error saving');
                    console.log(status)
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
        Triggered when quantity selected. Save production and get 
        the quoted values for sheets/pcs/press/gluer make ready and strip/handwork run.
    */
    $scope.quantitySelected = function() {
        $scope.saveProduction();
        var query = "SELECT * FROM QT_QuoteQuantities WHERE quote_number=" + $scope.QuoteNumber + " AND quantity_id=" + $scope.QuoteQuantityID;

        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "run_query_return",
              query: query
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.quote = data;
                } else {
                    console.log(status)
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }

    $scope.getDocketVariance = function() {
        var query = "SELECT * FROM Docket_Variance WHERE docket_number=" + $scope.docket_number;
        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "run_query_return",
              query: query
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.variance = data;
                    console.log(data);
                } else {
                    console.log(status)
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
        $scope.getDocketVariance();
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
        var new_docket_number = ProductionService.getDocketNumber();
        $scope.docket_number = new_docket_number;
        $scope.initProduction();
    });

    $scope.closeJob = function() {

        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "close_job",
              docket_number: $scope.docket_number,
              close_date: $scope.CloseDate
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.saving = null;
                    window.open("/Intranet/Production/DocketVariance.php?docket_number=" + $scope.docket_number, "_blank");
                    window.open("/Intranet/Production/Billing.php?docket_number=" + $scope.docket_number);
                } else {
                    alert(data.ERROR);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
              console.log(data);
              console.log(status);
            });
    }

    $scope.deleteJob = function() {
        var query = "DELETE FROM Production WHERE DocketNumber=" + $scope.docket_number +
         ";DELETE FROM Forms WHERE DocketNumber=" + $scope.docket_number +
        ";DELETE FROM Slip WHERE DocketNumber=" + $scope.docket_number + ";";
        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "run_queries",
              query: query
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    document.location.href="/Intranet";
                } else {
                    console.log(status)
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }

    /*
        For each set of variances in $scope.variance, calculated the variance then save them into the db.
    */
    $scope.calculateVariance = function() {
        var entries = [
            { quoted:"press_setup_quoted", value:"press_setup", variance: "press_setup_variance"},
            { quoted:"press_run_quoted", value:"press_run", variance: "press_run_variance"},
            { quoted:"gluer_setup_quoted", value:"gluer_setup", variance: "gluer_setup_variance"},
            { quoted:"gluer_run_quoted", value:"gluer_run", variance: "gluer_run_variance"},
            { quoted:"strip_run_quoted", value:"strip_run", variance: "strip_run_variance"},
            { quoted:"handwork_run_quoted", value:"handwork_run", variance: "handwork_run_variance"}];
        for (var i in entries) {
            var entry = entries[i];
            $scope.variance[entry.variance] = $scope.variance[entry.value] - $scope.variance[entry.quoted];
        }
        $scope.saveVariance();
    }

    /*
        For each set of variances, save them in the db.
    */
    $scope.saveVariance = function() {

        var entries = [
            { quoted:"press_setup_quoted", value:"press_setup", variance: "press_setup_variance"},
            { quoted:"press_run_quoted", value:"press_run", variance: "press_run_variance"},
            { quoted:"gluer_setup_quoted", value:"gluer_setup", variance: "gluer_setup_variance"},
            { quoted:"gluer_run_quoted", value:"gluer_run", variance: "gluer_run_variance"},
            { quoted:"strip_run_quoted", value:"strip_run", variance: "strip_run_variance"},
            { quoted:"handwork_run_quoted", value:"handwork_run", variance: "handwork_run_variance"}];        
        for (var i in entries) {
            var entry = entries[i];
            $scope.variance[entry.variance];
            $scope.variance[entry.value];
            var query = "UPDATE Docket_Variance SET " + entry.variance + "=" + $scope.variance[entry.variance] + " WHERE docket_number=" + $scope.docket_number
            + "; UPDATE Docket_Variance SET " + entry.value + "=" + $scope.variance[entry.value] + " WHERE docket_number=" + $scope.docket_number
            $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "run_queries",
              query: query
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {

                } else {
                    console.log(status)
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
        }
    }


}];
