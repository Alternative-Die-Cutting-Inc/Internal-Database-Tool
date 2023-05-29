
var AnalyticsModule = angular.module('AnalyticsModule', []);

AnalyticsModule.controller(Monthly);

var Monthly = ['$scope', '$http', function ($scope, $http ) {

	/* Set the dates for analytics*/
	$scope.setDates = function() {
		//Get the available months and years
		$scope.Months = getMonths();
		$scope.Years = getYears();

		//Set dates to current month and year.
		$scope.selectedMonth = getCurrentMonth();
		$scope.selectedYear = getCurrentYear();
	}

	/* Get the data for the selected Month and Year. */
	$scope.getMonthData = function() {
		var yearmonth = $scope.selectedYear + "-" + $scope.selectedMonth +"-"+ "01";
		$http.post(
	        "php/MonthlyHelper.php", 
	        { "data" : {
	          request: "get_monthly",
	          year: $scope.selectedYear,
	          month: $scope.selectedMonth,
	          yearmonth: yearmonth
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

	/* Wrapper for all the functions in this module. */
	$scope.init = function() {
		$scope.setDates();
		$scope.getMonthData();
	}

	$scope.init();	/* Entry point into module*/
}];

/* Return a list of the 12 months of the year with their month number.*/
function getMonths() {
	return [
			{name: "January",	id: 1},
			{name: "February",		id: 2},
			{name: "March",		id: 3},
			{name: "April",		id: 4},
			{name: "May",		id: 5},
			{name: "June",		id: 6},
			{name: "July",		id: 7},
			{name: "August",		id: 8},
			{name: "September",		id: 9},
			{name: "October",		id: 10},
			{name: "November",		id: 11},
			{name: "December",		id: 12}];
}

/* Return the current year. */
function getYears() {
	var y = getCurrentYear();
	return [y - 2, y -1, y];
}

function getCurrentYear() {
	var d = new Date();
	var y = d.getFullYear();
	return y;
}
/* Return the # representing the current month */
function getCurrentMonth() {
	var d = new Date();
	return d.getMonth() + 1;
}