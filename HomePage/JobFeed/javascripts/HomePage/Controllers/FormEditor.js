HomePageModule.controller(FormEditor);

/*
	This controller handles the viewing and editing of the 
*/
var FormEditor = ['$scope', '$http', function ($scope, $http) {
    $scope.showForms = false;

    $scope.getForms = function() {
        $scope.showForms = true;

        $http.post(
            "php/ProductionEditor.php", 
            { "data" : {
              request: "get_forms",
              docket_number: this.job.DocketNumber
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.forms = data;
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }
}];