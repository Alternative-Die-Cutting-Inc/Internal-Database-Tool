HomePageModule.controller(ProductionEditor);

/*
	This controller handles all the editing the can happen within the
	Produciton Editor template.
*/
var ProductionEditor = ['$scope', '$http', function ($scope, $http) {
    $scope.fields = [
    					{name: "Quote:",
    					 value:"QuoteNumber",
    					 show:false,
    					 link: "../QT/index.php?quote_number="},
    					 
    					{name: "Sold For:",
    					 value:"FinalPrice",
    					 show:false},
    					 
    					{name: "Customer PO:",
    					 value:"CustomerPoNo",
    					 show:false},    					 
    					 
    					{name: "Production Person:",
    					 value:"ProductionPerson",
    					 show:false},   					 
    					 
    					{name: "Die:",
    					 value:"Die",
    					 show:false},   					 
    					 
    					{name: "Finishing:",
    					 value:"Finishing",
    					 show:false},   					 
    					 
    					{name: "Special Instructions:",
    					 value:"SpecialInstructions",
    					 show:false}
    				];

    $scope.saveField = function () {
        $http.post(
    	    "php/ProductionEditor.php", 
    	    { "data" : {
    	      request: "save_field",
    	      field: this.field.value,
    	      value: this.job[this.field.value],
    	      docket_number: this.job.DocketNumber
    	  		}
    	    }).
    	    success(function(data, status) {
    	    	if (!data.ERROR) {
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