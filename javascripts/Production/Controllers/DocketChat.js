if (typeof ProductionModule != 'undefined') {
    ProductionModule.controller(DocketChat);
}
if (typeof HomePageModule != 'undefined') {
    HomePageModule.controller(DocketChat);
}

var DocketChat = ['$scope', '$http', 'ProductionService', function ($scope, $http, ProductionService) {

	/*  */
	$scope.conversationlogs = {};

	//Get summary of jobs closed within the selected month and year.
	$scope.getConversationLogs = function() {
		$http.post(
	        "../Production/php/DocketChatHelper.php", 
	        { "data" : {
	          request: "get_conversation_logs",
	          docket_number: $scope.docket_number
	            }
	        }).
	        success(function(data, status) {
	            if (!data.ERROR) {
	            	$scope.conversation_logs = data;
	            	console.log(data);
	            } else {
	                console.log(data);
	            }
	        }).
	        error(function(data, status) {
	          console.log("Post failed.");
	        });
	}

	$scope.logMessage = function(message) {
		$http.post(
	        "../Production/php/DocketChatHelper.php", 
	        { "data" : {
	          request: "log_message",
	          message: message,
	          user: user,
	          docket_number: $scope.docket_number
	            }
	        }).
	        success(function(data, status) {
	            if (!data.ERROR) {
	            	$scope.getConversationLogs();
	            } else {
	                console.log(data);
	            }
	        }).
	        error(function(data, status) {
	          console.log("Post failed.");
	        });
	}

	/*
		Update the status of the message with the given date.
	*/
	$scope.toggleStatus = function(status, chat_id) {
		switch(status) {
			case "icon-checkmark":
				status = "icon-spam";
				break;
			case "icon-spam":
				status = "icon-checkmark";
				break;
		}
		var query = "UPDATE DocketChat SET Status='" + status + "' WHERE DocketNumber=" + $scope.docket_number + " AND Chat_ID='" + chat_id + "'";
		console.log(query);
		$http.post(
	        "../Production/php/DocketChatHelper.php", 
	        { "data" : {
	          request: "run_queries",
	          query: query
	            }
	        }).
	        success(function(data, status) {
	            if (!data.ERROR) {

	            	$scope.getConversationLogs();
	            } else {
	                console.log(data);
	            }
	        }).
	        error(function(data, status) {
	          console.log("Post failed.");
	        });

	}

	$scope.initDocketChat = function() {
		$scope.getConversationLogs();
	}

    /*
        Handler when the duedates field passes in a docket number.
    */
    // $scope.$on('docketNumberAvailable', function() {
    //     var new_docket_number = ProductionService.getDocketNumber();
    //     $scope.docket_number = new_docket_number;
    //     $scope.initDocketChat();
    // });


    $scope.toggleLog = function() {
    	if (this.log.hover == undefined) {
    		this.log.hover = false;
    	}
    	this.log.hover = !this.log.hover;
    }
    $scope.deleteLog = function() {
    	var query = "DELETE FROM DocketChat WHERE Chat_ID =" + this.log.Chat_ID;
    	$http.post(
	        "../Production/php/DocketChatHelper.php", 
	        { "data" : {
	          request: "run_queries",
	          query: query
	            }
	        }).
	        success(function(data, status) {
	            if (!data.ERROR) {
	            	$scope.getConversationLogs();
	            } else {
	                console.log(data);
	            }
	        }).
	        error(function(data, status) {
	          console.log("Post failed.");
	        });
    }
    console.log(this);
	
}];