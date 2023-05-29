HomePageModule.controller(Analytics);

var Analytics = ['$scope', '$http', function ($scope, $http) {
	$scope.Months = [
						{name: "January", 
						id: 1},
						{name: "February", 
						id: 2},
						{name: "March", 
						id: 3},
						{name: "April", 
						id: 4},
						{name: "May", 
						id: 5},
						{name: "June", 
						id: 6},
						{name: "July", 
						id: 7},
						{name: "August", 
						id: 8},
						{name: "September", 
						id: 9},
						{name: "October", 
						id: 10},
						{name: "November", 
						id: 11},
						{name: "December", 
						id: 12}];

	$scope.closing_data = {};
	
	//Set years (get last year + 3 years?);
	var d = new Date();
	var y = d.getFullYear();
	$scope.selectedYear = y;
	$scope.Years = [y - 1, y, y + 1];

	//Set date
	var n = d.getMonth();
	$scope.selectedMonth = n + 1;
	//Get summary of jobs closed within the selected month and year.
	$scope.getClosingData = function() {
		var yearmonth = $scope.selectedYear + "-" + $scope.selectedMonth +"-"+ "01";
		$http.post(
	        "php/AnalyticsHelper.php", 
	        { "data" : {
	          request: "get_closing_data",
	          yearmonth: yearmonth
	            }
	        }).
	        success(function(data, status) {
	            if (!data.ERROR) {
	            	$scope.closing_data = data;
	            	$scope.sortClosingDataBySales();
	            } else {
	                console.log(data);
	            }
	        }).
	        error(function(data, status) {
	          console.log("Post failed.");
	        });
	}
	$scope.sortClosingDataBySalesDirection = true;

	$scope.sortClosingDataBySales = function() {
		var sort = Array();
		for (var i in $scope.closing_data) {
			sort.push($scope.closing_data[i]);
		}
		sort.sort(function(a,b) {
			if ($scope.sortClosingDataBySalesDirection) {
		    	return parseInt(b.FinalPrice) - parseInt(a.FinalPrice);
			} else {
				return parseInt(a.FinalPrice) - parseInt(b.FinalPrice);
			}
		});
		$scope.sortClosingDataBySalesDirection = !$scope.sortClosingDataBySalesDirection;
		$scope.closing_data = sort;

	}


	$scope.totalPrice = function() {
		    var total = 0, i = 0;
		    for (i = 0; i < $scope.closing_data.length; i++) {
		    	if ($scope.closing_data[i].FinalPrice !== null) {
		    		total += parseInt($scope.closing_data[i].FinalPrice);
		    	}
		    }
		    return total;
		};

	$scope.getAverageQuote = function () {
		var yearmonth = $scope.selectedYear + "-" + $scope.selectedMonth +"-"+ "01";
		$http.post(
	        "php/AnalyticsHelper.php", 
	        { "data" : {
	          request: "get_average_quote",
	          yearmonth: yearmonth
	            }
	        }).
	        success(function(data, status) {
	            if (!data.ERROR) {
	            	$scope.averageQuoteDays = data.average;
	            	$scope.customers_average = data.customers_average;
	            	$scope.sortCustomerByAverage();
	            } else {
	                console.log(data);
	            }
	        }).
	        error(function(data, status) {
	          console.log("Post failed.");
	        });
	}

	$scope.sortCustomerByAverageDirection = true;

	$scope.sortCustomerByAverage = function() {
		var sort = Array();
		for (var i in $scope.customers_average) {
			sort.push($scope.customers_average[i]);
		}
		sort.sort(function(a,b) {
			if ($scope.sortCustomerByAverageDirection) {
		    	return parseInt(b.Difference) - parseInt(a.Difference);
			} else {
				return parseInt(a.Difference) - parseInt(b.Difference);
			}
		});
		$scope.sortCustomerByAverageDirection = !$scope.sortCustomerByAverageDirection;
		$scope.customers_average = sort;

	}
	$scope.getQuoteHits = function() {
		var yearmonth = $scope.selectedYear + "-" + $scope.selectedMonth +"-"+ "01";
		$http.post(
	        "php/AnalyticsHelper.php", 
	        { "data" : {
	          request: "get_quote_hits",
	          yearmonth: yearmonth
	            }
	        }).
	        success(function(data, status) {
	            if (!data.ERROR) {
	            	$scope.customer_hits = data;
	            	$scope.calculateTotalHits();
	            } else {
	                console.log(data);
	            }
	        }).
	        error(function(data, status) {
	          console.log("Post failed.");
	        });
	}
	$scope.getQuoteTotals = function() {
		$http.post(
	        "php/AnalyticsHelper.php", 
	        { "data" : {
	          request: "get_quote_totals"
	            }
	        }).
	        success(function(data, status) {
	            if (!data.ERROR) {
	            	console.log(data);
	            } else {
	                console.log(data);
	            }
	        }).
	        error(function(data, status) {
	          console.log("Post failed.");
	        });
	}

	/* Calculate the totals for # of quotes and # of hits.*/
	$scope.calculateTotalHits = function() {
		var total_hits = 0;
		var total_quotes = 0;
		var total_sales = 0;
		var sort = Array();
		for (var i in $scope.customer_hits) {
			total_hits += parseInt($scope.customer_hits[i].hits);
			total_quotes += parseInt($scope.customer_hits[i].quotes);
			total_sales += parseInt($scope.customer_hits[i].sold);
			sort.push($scope.customer_hits[i]);
		}
		sort.sort(function(a,b) {
		    return parseInt(b.hit_rate) - parseInt(a.hit_rate);
		});
		$scope.customer_hits = sort;
		$scope.total_quotes = total_quotes;
		$scope.total_hits = total_hits;
		$scope.total_sales = total_sales;

	}

	$scope.sortByHitRateDirection = false;

	$scope.sortByHitRate = function() {
		var sort = Array();
		for (var i in $scope.customer_hits) {
			sort.push($scope.customer_hits[i]);
		}
		sort.sort(function(a,b) {
			if ($scope.sortByHitRateDirection) {
		    	return parseInt(b.hit_rate) - parseInt(a.hit_rate);
			} else {
				return parseInt(a.hit_rate) - parseInt(b.hit_rate);
			}
		});
		$scope.sortByHitRateDirection = !$scope.sortByHitRateDirection;
		$scope.customer_hits = sort;

	}	

	$scope.sortBySalesDirection = false;

	$scope.sortBySales = function() {
		var sort = Array();
		for (var i in $scope.customer_hits) {
			sort.push($scope.customer_hits[i]);
		}
		sort.sort(function(a,b) {
			if ($scope.sortBySalesDirection) {
		    	return b.sold - a.sold;
			} else {
				return a.sold - b.sold;
			}
		});
		$scope.sortBySalesDirection = !$scope.sortBySalesDirection;
		$scope.customer_hits = sort;

	}	
	$scope.sortByQuotesDirection = false;

	$scope.sortByQuotes = function() {
		var sort = Array();
		for (var i in $scope.customer_hits) {
			sort.push($scope.customer_hits[i]);
		}
		sort.sort(function(a,b) {
			if ($scope.sortByQuotesDirection) {
		    	return b.quotes - a.quotes;
			} else {
				return a.quotes - b.quotes;
			}
		});
		$scope.sortByQuotesDirection = !$scope.sortByQuotesDirection;
		$scope.customer_hits = sort;

	}	
	$scope.sortbyJobsDirection = false;

	$scope.sortByJobs = function() {
		var sort = Array();
		for (var i in $scope.customer_hits) {
			sort.push($scope.customer_hits[i]);
		}
		sort.sort(function(a,b) {
			if ($scope.sortbyJobsDirection) {
		    	return b.hits - a.hits;
			} else {
				return a.hits - b.hits;
			}
		});
		$scope.sortbyJobsDirection = !$scope.sortbyJobsDirection;
		$scope.customer_hits = sort;

	}

	$scope.getData = function() {
		$scope.getClosingData();
		$scope.getAverageQuote();
		$scope.getQuoteHits();
		$scope.getQuoteTotals();
	}
	

	$scope.getData();
}];