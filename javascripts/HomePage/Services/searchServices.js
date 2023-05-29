/*
  Creating the module for the homepage functionality.
*/
var HomePageModule = angular.module('HomePageModule', []);

HomePageModule.service("searchService", ['$rootScope', function ($rootScope) {
  var quoteSearchResults = {};
  var jobSearchResults = {};
  return {
      
    /*Quote Search*/
    setQuoteResults: function(data) {
      quoteSearchResults = data;
      $rootScope.$broadcast('quoteSearchResultsAvailable');
    },

    getQuoteResults: function() {
      return quoteSearchResults;
    },  

    /* Old Quote Search*/
    setOldQuoteResults: function(data) {
      oldQuoteSearchResults = data;
      $rootScope.$broadcast('oldQuoteSearchResultsAvailable');
    },

    getOldQuoteResults: function() {
      return oldQuoteSearchResults;
    },
  
    /*Job Search*/
    setJobResults: function(data) {
      jobSearchResults = data;
      $rootScope.$broadcast('jobSearchResultsAvailable');
    },

    getJobResults: function() {
      return jobSearchResults;
    },

    /* Allow controllers to broadcast to eachother via this service. */
    broadcast: function(broadcast) {
      $rootScope.$broadcast(broadcast);
    }
  };
}]);