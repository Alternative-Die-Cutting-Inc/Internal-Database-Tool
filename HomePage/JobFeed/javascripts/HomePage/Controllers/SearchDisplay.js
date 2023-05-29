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
}];