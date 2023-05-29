HomePageModule.controller(ShipFeed);
var ShipFeed = ['$scope', '$http', function ($scope, $http) {
    $scope.shipFeed = null;
    //Request ship feed stuff, set $scope.shipFeed
    $http.post(
	    "php/ShipFeedHelper.php", 
	    { "data" : {
	      request: "get_ship_feed"
	  		}
	    }).
	    success(function(data, status) {
	    	if (!data.ERROR) {
	    		$scope.shipFeed = data;
	    		console.log(data);
	    	} else {
	    		console.log(data);
	    	}
	    }).
	    error(function(data, status) {
	      console.log("Post failed.");
	    });
	
	/*
		Triggered on click of the ship out button on the shipfeed.
		Requests a shipout for the given docket number and sessId.
	*/
	$scope.shipOut = function() {
		$http.post(
		    "php/ShipFeedHelper.php", 
		    { "data" : {
		      request: "ship_out",
              sess_id: this.shipment.SessId,
              docket_number: this.shipment.DocketNumber,
              job_name: this.shipment.JobName
		  		}
		    }).
		    then(function(data, status) {
		    	if (data.data.SUCCESS) {
		    		document.location.reload(true);
		    	} else {
		    		console.log(data);
		    	}
		    })
	}
}];