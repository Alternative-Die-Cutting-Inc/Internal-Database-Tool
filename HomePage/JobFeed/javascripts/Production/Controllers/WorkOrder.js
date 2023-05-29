/* 
	This Prodution module is used for all pages within the Production directory:
	-Work Order
	-Production Editor
	-Forms Editor
	-Extras Editor
*/
var ProductionModule = angular.module('ProductionModule', []);

/* This controller is used to load required information for the Work Order. */
ProductionModule.controller(WorkOrder);

var WorkOrder = ['$scope', '$http', function ($scope, $http) {
	
	/* This is the main production info.*/
	$scope.production_info = null;
	/* This is the quote info for this job.*/
	$scope.quote_info = null;
	/* This stores the forms for this job.*/
	$scope.forms_info = null;

	/*
		Get the production info for the docket number.
	*/
	$scope.getProductionInfo = function() {
		$http.post(
            "php/WorkOrderHelper.php", 
            { "data" : {
              request: "get_production_info",
              docket_number: $scope.docket_number
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.production_info = data;
					$scope.getQuoteInfo();
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
	}

	/*
		Get the quote info for the docket if production_info.QuoteNumber is > 150, 000
	*/
	$scope.getQuoteInfo = function() {
		if ($scope.production_info.QuoteNumber > 150000) {
			$http.post(
	            "php/WorkOrderHelper.php", 
	            { "data" : {
	              request: "get_quote_info",
	              quote_number: $scope.production_info.QuoteNumber,
	              quote_quantity_id: $scope.production_info.QuoteQuantityID
	                }
	            }).
	            success(function(data, status) {
	                if (!data.ERROR) {
	                    $scope.quote_info = data;
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
		Get the forms for the job.
	*/
	$scope.getForms = function() {
		$http.post(
            "php/WorkOrderHelper.php", 
            { "data" : {
              request: "get_forms",
              docket_number: DocketNumber
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.forms_info = data;
                    console.log(data);
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
	}

	//If docket number is set
	if (DocketNumber !== null) {
		$scope.docket_number = DocketNumber;
		//Get the main Production info
		$scope.getProductionInfo();
		$scope.getForms();
	}
}];