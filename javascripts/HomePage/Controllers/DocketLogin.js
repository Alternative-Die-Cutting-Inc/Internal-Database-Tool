HomePageModule.controller(DocketLogin);

/*
	This controller handles the creation of a new job.
*/
var DocketLogin = ['$scope', '$http', function ($scope, $http) {

    /* The new docket number for the job we're creating. */
    $scope.DocketNumber = null;
    /* A list of customers to bind the job to. */
    $scope.customers = null;
    /* Once a job is created, set this to true. */
    $scope.completed = false;

    $scope.count = 0;

    /* Once the user enters a Quote Number, this is populated with quantities matching that quote.
    Only triggered for quotes > 150 000*/
    $scope.QuoteQuantities = null;

    $http.post(
        "php/DocketLoginHelper.php", 
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

    /*
        Triggered when user enters a quote number.
    */
    $scope.getQuantities = function() {
        /* We can only bind quantities to the job if it is part of the new quote system which begins at 150 000 */
        if ($scope.QuoteNumber > 150000) { 
            $http.post(
                "php/DocketLoginHelper.php", 
                { "data" : {
                  request: "get_quantities",
                  quote_number: $scope.QuoteNumber
                    }
                }).
                success(function(data, status) {
                    if (!data.ERROR) {
                        $scope.QuoteQuantities = data;
                        console.log(data);
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
        Triggered when form is submitted.
        Save the neccessary info into the Production table and DueDates table.
    */
    $scope.logJob = function() {
        $scope.count += 1;
        if ($scope.count === 1) {
            $http.post(
                    "php/DocketLoginHelper.php", 
                    { "data" : {
                      request: "log_job",
                      quote_number: $scope.QuoteNumber === undefined ? "":$scope.QuoteNumber,
                      customer_po: $scope.CustomerPoNo === undefined ? "": $scope.CustomerPoNo,
                      customer: $scope.Customer === undefined ? "": $scope.Customer,
                      job_name: $scope.JobName === undefined ? "": $scope.JobName,
                      quantity_id: $scope.QuoteQuantityID === undefined ? "": $scope.QuoteQuantityID
                        }
                    }).
                    success(function(data, status) {
                        if (!data.ERROR) {
                            console.log(data);
                            $scope.DocketNumber = data.docket_number;
                            $scope.completed = true;
                        } else {
                            console.log(data);
                        }
                    }).
                    error(function(data, status) {
                      console.log("Post failed.");
                    });

        }
    }



}];