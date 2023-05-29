/*
  This service allows for the duedates feed to communicate
  to the production controller to load the new info.
*/
if (typeof HomePageModule != 'undefined') {
	HomePageModule.service("ProductionService", ['$rootScope', function ($rootScope) {
	  var docket_number = null;
	  return {
	      
	    setDocketNumber: function(this_docket_number) {
	    	docket_number = this_docket_number;
	      	$rootScope.$broadcast('docketNumberAvailable');

	    	console.log("received " + this_docket_number + " from ");
	    },

	    getDocketNumber: function() {
	      return docket_number;
	    }
	  };
	}]);
}

if (typeof ProductionModule != 'undefined') {
	ProductionModule.service("ProductionService", ['$rootScope', function ($rootScope) {
	  var docket_number = null;
	  return {
	      
	    setDocketNumber: function(this_docket_number) {
	    	docket_number = this_docket_number;
	    	console.log("received " + this_docket_number + " from ");
	      	$rootScope.$broadcast('docketNumberAvailable');
	    },

	    getDocketNumber: function() {
	    	console.log("passing: " + docket_number);
	      return docket_number;
	    }
	  };
	}]);
}

