var ShippingModule = angular.module('ShippingModule', []);

/* This controller is used to load required information for the Work Order. */
ShippingModule.controller(DeliveryReport);

var DeliveryReport = ['$scope', '$http', function ($scope, $http) {
    /* The production information for this job.*/
    $scope.production_info = null;
    /* The info for the summary */
    $scope.summary_info = null;
    /* The info for the shipment history */
    $scope.history_info = null;
    /* The current date */
    $scope.date = null;


    /*
        Set the date to the current date.
    */
    $scope.setDate = function() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
        $scope.date = today;
    }

    /*
        Get the production info for the docket number.
    */
    $scope.getProductionInfo = function() {
        $http.post(
            "../Production/php/WorkOrderHelper.php", 
            { "data" : {
              request: "get_production_info",
              docket_number: DocketNumber
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.production_info = data;

                    $scope.ExtrasTotal = $scope.production_info.ExtrasTotal;
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }
    $scope.teest = 2;
    /*
        Get the shipment info.
        Set the summary info to $scope.summary_info
        Set the history info to $scope.history_info
    */
    $scope.getShipmentInfo = function() {
        $http.post(
            "../Shipping/php/DeliveryReportHelper.php", 
            { "data" : {
              request: "get_shipment_info",
              docket_number: DocketNumber
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.summary_info = data.summary;
                    $scope.history_info = data.history;
                    $scope.setTotals();
                    console.log(data);
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }

    /*
        Get the forms for the current Docket Number.
    */
    $scope.getExtras = function() {

        $http.post(
            "../Production/php/ProductionHelper.php", 
            { "data" : {
              request: "get_extras",
              docket_number: DocketNumber
                }
            }).
            success(function(data, status) {
                if (!data.ERROR) {
                    $scope.extras_info = data;
                    console.log(data);
                } else {
                    console.log(data);
                }
            }).
            error(function(data, status) {
              console.log("Post failed.");
            });
    }

    $scope.setTotals = function() {
        var quantity_total = 0;
        var sent_total = 0;
        for (var i in $scope.summary_info) {
            quantity_total += parseInt($scope.summary_info[i].Quantity);
            sent_total += parseInt($scope.summary_info[i].Sent);
            console.log($scope.summary_info[i]);
        }
        $scope.sent_total = sent_total;
        $scope.requested_total = quantity_total;
    }

    $scope.setDate();
    $scope.getProductionInfo();
    $scope.getShipmentInfo();
    $scope.getExtras();


}];