HomePageModule.controller(ExtrasEditor);

/*
	This controller handles the viewing and editing of the 
*/
var ExtrasEditor = ['$scope', '$http', function ($scope, $http) {
    $scope.showExtras = false;

    $scope.getExtras = function() {
        $scope.showExtras = true;

        $http.post(
            "php/ProductionEditor.php", 
            { "data" : {
              request: "get_extras",
              docket_number: this.job.DocketNumber
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.extras = data;
                    console.log(data);
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }
}];