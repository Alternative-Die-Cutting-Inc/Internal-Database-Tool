HomePageModule.controller(SearchDisplay);

var SearchDisplay = ['$scope', '$http', 'searchService', function ($scope, $http, searchService) {
    
    /*Quote Search*/
	$scope.quoteSearchResults = {};
    $scope.quoteResultsAvailable = false;
	//Listen for broadcast and set available search results.
	$scope.$on('quoteSearchResultsAvailable', function() {
        $scope.quoteSearchResults = searchService.getQuoteResults();
        $scope.quoteResultsAvailable = true;
    });

    $scope.quoteSearchPrevious = function() {
    	searchService.broadcast("quoteSearchPrevious");
    }

    $scope.quoteSearchNext = function() {
    	searchService.broadcast("quoteSearchNext");

    }

	/* Job Search*/
	$scope.jobSearchResults = {};
    $scope.jobResultsAvailable = false;
	//Listen for broadcast and set available search results.
	$scope.$on('jobSearchResultsAvailable', function() {
        $scope.jobSearchResults = searchService.getJobResults();
        $scope.jobResultsAvailable = true;
    });

    $scope.jobSearchPrevious = function() {
    	searchService.broadcast("jobSearchPrevious");
    }

    $scope.jobSearchNext = function() {
    	searchService.broadcast("jobSearchNext");

    }

    /*Old Quote Search*/
	$scope.oldQuoteSearchResults = {};
    $scope.oldQuoteResultsAvailable = false;
	//Listen for broadcast and set available search results.
	$scope.$on('oldQuoteSearchResultsAvailable', function() {
        $scope.oldQuoteSearchResults = searchService.getOldQuoteResults();
        $scope.oldQuoteResultsAvailable = true;
    });

    $scope.oldQuoteSearchPrevious = function() {
    	searchService.broadcast("oldQuoteSearchPrevious");
    }

    $scope.oldQuoteSearchNext = function() {
    	searchService.broadcast("oldQuoteSearchNext");

    }

    $scope.setAsNew = function(quote_number) {
        $http.post(
          "../QT/php/QT_helper.php", 
          { "data" : 
            {
              request: "set_as_new",
              quote_number: quote_number
            }
          }).
          success(function(data, status) {
            if (!data.ERROR){
                window.location.href = "/Intranet/QT/?quote_number=" + data.new_quote_number;
            }
          }).
          error(function(data, status) {
            console.log("Post failed.");
        });
    }
}];