/*
	Creating the controller that will manage the searching of quotes in the new system.
*/
HomePageModule.controller(JobSearch);

var JobSearch = ['$scope', '$http', 'searchService', function ($scope, $http, searchService) {
    $scope.startIndex = 0;

	$scope.search = function () {
		/* Get passed in variables to search by. */
		var values = {
						DocketNumber :"DocketNumber", 
						quote_number :"QuoteNumber", 
						Customer: "Customer",
						CustomerPoNo: "CustomerPO",
						JobName: "JobName",
						Finishing: "Finishing",
						SpecialInstructions: "SpecialInstructions",
						Quantity: "NumberOfUnits"};
		var searchValues = {};
		for (var key in values) {
			if ($scope[values[key]] !== undefined) {
				searchValues[key] = $scope[values[key]];
			}
		};

		//Pass in a date range if from is set.
		if ($scope.from !== undefined) {

			//Set to to today as default.
			var to;
			if ($scope.to !== undefined) {
				to = $scope.to;
			} else {
				/* This in MYSQL will return the current date. */
				to = "DATE(NOW())";
			}
			var range = {from: $scope.from, to: to};
		};

		$http.post(
		    "php/JobSearchHelper.php", 
		    { "data" : {
		      request: "job_search",
		      values: searchValues,
		      range: range,
		      start_index: $scope.startIndex
		  		}
		    }).
		    success(function(data, status) {
		    	if (!data.ERROR) {
		    		console.log(data);
		    		searchService.setJobResults(data);
		    	} else {
		    		console.log(data);
		    	}
		    }).
		    error(function(data, status) {
		      console.log("Post failed.");
		    });
	}
	$scope.$on('jobSearchPrevious',function() {
		if ($scope.startIndex >= 100) {
			$scope.startIndex -= 100;
		}
		$scope.search();
	});

	$scope.$on('jobSearchNext',function() {
		$scope.startIndex += 100;
		$scope.search();
	});

}];