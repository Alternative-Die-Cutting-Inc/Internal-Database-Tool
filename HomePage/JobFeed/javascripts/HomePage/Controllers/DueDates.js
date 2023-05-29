HomePageModule.controller(DueDates);

var DueDates = ['$scope', '$http', 'ProductionService', function ($scope, $http, ProductionService) {
    $scope.jobs = null;

    //Request jobs and set dates $scope.shipFeed
    $http.post(
	    "php/DueDatesHelper.php", 
	    { "data" : {
	      request: "get_jobs"
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

	/*
		This function is triggered on click of the side column of the table.
		Save the memo as the next part of the following rotation
		icon-checkmark > icon-question-mark > icon-spam > icon-busy>icon-checkmark
		green > yellow > red > blue > green
	*/
	$scope.rotateMemo = function() {
		/* The docket number. */
		var docket_number = this.job.DocketNumber;
		/* The current status. */
		var current_memo = this.job.Memo;
		/* The new memo to be saved. */
		var new_memo;

		/* 
			According to the current memo, rotate it to the next one. 
			May be able to replace it with an array and indexing.
		*/
		switch (current_memo) {
			case "icon-checkmark":
				new_memo = "icon-question-mark";
				break;
			case "icon-question-mark":
				new_memo = "icon-spam";
				break;
			case "icon-spam":
				new_memo = "icon-busy";
				break;
			case "icon-busy":
				new_memo = "icon-checkmark";
				break;
			default:
				new_memo = "icon-question-mark";
				break;
		}

		//Set the new value in the front end.
		this.job.Memo = new_memo;
		$http.post(
		    "php/DueDatesHelper.php", 
		    { "data" : {
		      request: "save_memo",
		      docket_number: docket_number,
		      memo: new_memo
		  		}
		    }).
		    success(function(data, status) {
		    	if (data.ERROR) {
		    		console.log(data);
		    	}
		    }).
		    error(function(data, status) {
		      console.log("Post failed.");
		    });	
	};

	$scope.setDueDate = function() {
		var docket_number = this.job.DocketNumber;
		var due_date = this.job.DueDate;
		$http.post(
		    "php/DueDatesHelper.php", 
		    { "data" : {
		      request: "set_due_date",
		      docket_number: docket_number,
		      date: due_date
		  		}
		    }).
		    success(function(data, status) {
		    	console.log(data);
		    }).
		    error(function(data, status) {
		      console.log("Post failed.");
		    });	
	};

	/*
		Called on click of one the icon, get all the jobs with the matching memo
	*/
	$scope.getJobs = function(memo) {
		$http.post(
	    "php/DueDatesHelper.php", 
	    { "data" : {
	      request: "get_jobs_with_memo",
	      memo: memo
	  		}
	    }).
	    success(function(data, status) {
	    	if (!data.ERROR) {
	    		$scope.filteredJobs = data;
	    	} else {
	    		console.log(data);
	    	}
	    }).
	    error(function(data, status) {
	      console.log("Post failed.");
	    });
	};

	/*
		This is the click event when expanding a row on the due dates list.
		Set job.hovered = 'true'
		Call Production's controller's initProduction with the given docket number.
	*/
	$scope.openProduction = function(docket_number) {
		$scope.hideShip = true;
		$scope.duedatesWidth = "large-7";
		ProductionService.setDocketNumber(docket_number);

	};

	$scope.duedatesWidth = "large-8";

}];