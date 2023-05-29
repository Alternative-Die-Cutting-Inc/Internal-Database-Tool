function CustomerController($scope) {
	$scope.customers = [];
	$.ajax({    
	    asych: false,
	    url: "../QT/php/QT_helper.php",
	    type: "POST",
	    dataType: 'json',
	    data: {
	      request: 'get_customers'
	    },
	    success: function(data, status) {
	      $scope.customers = data;
	      console.log();
	    },
	    error: function(data, status) {
	    }
	});
}