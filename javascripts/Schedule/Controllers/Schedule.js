var ScheduleModule = angular.module('ScheduleModule', []);

/* This controller is used to load required information for the Work Order. */
ScheduleModule.controller(Scheduler);

var Scheduler = ['$scope', '$http', function ($scope, $http) {

	$scope.getJobs = function() {
		$http.post(
		    "../HomePage/php/DueDatesHelper.php", 
		    { "data" : {
		      request: "get_jobs_simple"
		  		}
		    }).
		    success(function(data, status) {
		    	if (!data.ERROR) {
		    		$scope.jobs = data;	    	
		    		console.log(data);
		    	} else {
		    		console.log(data);
		    	}
		    }).
		    error(function(data, status) {
		      console.log("Post failed.");
		    });
	}

	$scope.removeJob = function(job) {
		var index = $scope.jobs.indexOf(job);
        $scope.jobs.splice(index, 1);
        console.log($scope.jobs);
	}
	$scope.getJobs();
}];