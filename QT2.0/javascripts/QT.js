/* ShopRates is a controller. It runs this function to load the stuff within
the scope of ng-controller=ShopRates on index.php */
function ShopRates($scope, $http) {
  /* Get the master rates to be displayed in .shop-rates */
  $http.post(
    "php/QT_helper.php", 
    { "data" : {
      request: "get_table_row"
      ,table: "QT_MasterRates"}
    }).
    success(function(data, status) {
      $scope.status = status;
      $scope.data = data;
      $scope.rates = data;
    }).
    error(function(data, status) {
      console.log("Post failed.");
      $scope.data = data || "Request failed";
      $scope.status = status;
    });

  /* This object is displayed in .press-rates */
  $http.post(
    "php/QT_helper.php",
    { "data" : {
      request: "get_table"
      ,table: "QT_Press"}
    }).
    success(function(data, status) {
      $scope.status = status;
      $scope.data = data;
      $scope.press_rates = data;
    }).
    error(function(data, status) {
      console.log("Post failed.");
      $scope.data = data || "Request failed";
      $scope.status = status;
    });

  /* This object is displayed in .gluer-rates */
  $http.post(
    "php/QT_helper.php",
    { "data" :
      {
        request: "get_table"
        ,table: "QT_Gluer"
      }
    }).
    success(function(data, status) {
      $scope.status = status;
      $scope.data = data;
      $scope.gluer_rates = data;
    }).
    error(function(data, status) {
      console.log("Post failed.");
      $scope.data = data || "Request failed";
      $scope.status = status;
    });
}

function QuoteController($scope) {

  /* Set via ajax on load. */
  $scope.quoteNumber;

  /* Updated via createQuote and createQuantity */
  $scope.quoteQuantities = {};

  /* Available Presses */
  $scope.presses = [];

  /* Rates for each quantity. */
  $scope.quantityRates = {};

  /* Available Stock */
  $scope.stocks = {};

  /* Available Gluers*/
  $scope.gluers = [];

  /* Binded to form in modal. Creates a quuote and a 
  quantity in the db. */
  $scope.createQuote = function() {
    $.ajax({    
      url: "php/QT_helper.php",
      type: "POST",
      dataType: 'json',
      data: {
        request: 'create_quote',
        quote_number: $scope.quoteNumber,
        customer: this.customer,
        job_name: this.job_name,
        description: this.description,
        notes: this.notes,
        author: this.author,
        attention: this.attention
      },
      success: function(data, status) {
        $scope.quoteQuantities[data.quantity_id] = data;
        $scope.getQuantityRates();
        $scope.$apply();
      },
      error: function(data, status) {
        console.log(data.responseText);
      }
    });
  }

  //Set Quote Number
  $.ajax({    
    url: "php/QT_helper.php",
    type: "POST",
    dataType: 'json',
    data: {
      request: 'get_max_quote'
    },
    success: function(data, status) {
      $scope.quoteNumber = data + 1;
    }
  });

  //Set Available Presses.
  $.ajax({
    url: "php/QT_helper.php",
    type: "POST",
    dataType: 'json',
    data: {
      request: 'get_table_visible',
      table: 'QT_Press'
    },
    success: function(data, status) {
      for (var i in data) {
        $scope.presses.push(data[i]);
      }
    }
  });

  //Set Available Gluers.
  $.ajax({
    url: "php/QT_helper.php",
    type: "POST",
    dataType: 'json',
    data: {
      request: 'get_table_visible',
      table: 'QT_Gluer'
    },
    success: function(data, status) {
      for (var i in data) {
        $scope.gluers.push(data[i]);
      }
    }
  });

  //Set available stock
  $.ajax({
    url: "php/QT_helper.php",
    type: "POST",
    dataType: 'json',
    data: {
      request: 'get_table_visible',
      table: 'QT_Stock'
    },
    success: function(data, status) {
      $scope.stocks = data;
    }
  });

  //Set rates for quantities.
  $scope.getQuantityRates = function () {
    $.ajax({
      url: "php/QT_helper.php",
      type: "POST",
      dataType: 'json',
      data: {
        request: 'get_rates',
        quote_number: $scope.quoteNumber
      },
      success: function(data, status) {
        $scope.quantityRates = data;
        console.log($scope.quantityRates);
      }
    });
  }

  /* Create a new quantity for the quote and add it to quoteQuantities. */
  $scope.createQuantity = function () {
    $.ajax({    
      url: "php/QT_helper.php",
      type: "POST",
      dataType: 'json',
      data: {
        request: 'create_quantity',
        quote_number: $scope.quoteNumber
      },
      success: function(data, status) {
        $scope.quoteQuantities[data.quantity_id] = data;
        //Show the quantity objects for this quote.
        console.log($scope.quoteQuantities);
        $scope.getQuantityRates();
        $scope.$apply();
      },
      error: function(data, status) {
        console.log(data.responseText);
      }
    });
  }

  /*
    When the stock drop down is changed, this is called.
    With the given quantity id, set the press id for that quantity.
  */
  $scope.pressChange = function (quantity_id) {
    //Update the quote quantity to the new press.
    var press_id = this.selectedPress;
    QT.updateQuoteQuantityValue($scope.quoteNumber, quantity_id, "press_id", press_id);
    $scope.quoteQuantities[quantity_id].press_id = press_id;

    //Update the rates to the new rate in the frontend and backend.
    var press_rate = $.grep($scope.presses, function(press) {return press.press_id == press_id})[0].rate;
    $scope.quantityRates[quantity_id].press_per_hour = press_rate;
    QT.updateQuantityRateValue($scope.quoteNumber, quantity_id, "press_per_hour", press_rate);

    //TODO: recalculate die/cutter/press steup/press_runspeed totals and then calcualte total.
    $scope.calculateTotal(quantity_id);
  }

  $scope.gluerChange = function (quantity_id) {
    var gluer_id = this.selectedGluer;
    QT.updateQuoteQuantityValue($scope.quoteNumber, quantity_id, "gluer_id", gluer_id);
    $scope.quoteQuantities[quantity_id].gluer_id = gluer_id;

    var gluer_rate = $.grep($scope.gluers, function(gluer) {return gluer.gluer_id == gluer_id})[0].rate;
    $scope.quantityRates[quantity_id].gluer_per_hour = gluer_rate;
    QT.updateQuantityRateValue($scope.quoteNumber, quantity_id, "gluer_per_hour", gluer_rate);
    $scope.calculateTotal(quantity_id);
  }

  $scope.isSelectedPress = function (quantity_id, press_id) {
    if ($scope.quoteQuantities[quantity_id]["press_id"] == press_id) {
      return "selected";
    } else {
      return "not selected";
    }
  }
  $scope.isSelectedStock = function (quantity_id, stock_id) {
    if ($scope.quoteQuantities[quantity_id]["stock_id"] == stock_id) {
      return "selected";
    } else {
      return "not selected";
    }
  }

  $scope.isSelectedGluer = function (quantity_id, gluer_id) {
    if ($scope.quoteQuantities[quantity_id]["gluer_id"] == gluer_id) {
      return "selected";
    } else {
      return "not selected";
    }
  }
  

  /*
    When the press drop down is changed, this is called.
    With the given quantity id, set the stock id
    for that given quantity.
  */
  $scope.stockChange = function (quantity_id) {
    var stock_id = this.selectedStock;
    QT.updateQuoteQuantityValue($scope.quoteNumber, quantity_id, "stock_id", stock_id);
    $scope.calculateTotal(quantity_id);
  }

  /*
    Calculate the totals for the given quantity id and save it in the front end and backend.
    The totals include the subtotal, premiums and per m.
  */
  $scope.calculateTotal = function(quantity_id) {
    /* New values to saved. */
    var saveValues = [];

    /*
      Calculate subtotal
    */
    /* Values that make up the total. */
    var totals = ['die_total', 'cutter_total', 'press_setup_total', 'press_runspeed_total', 'gluer_setup_total', 'gluer_runspeed_total', 'strip_runspeed_total', 'tape_runspeed_total', 'fold_runspeed_total', 'package_total', 'pickup_skids_total', 'delivery_skids_total'];
    var subtotal = 0;

    //Adding the totals
    for (i in totals) {
      subtotal += parseInt($scope.quoteQuantities[quantity_id][totals[i]]);
    }
    //Save new subtotal (backend.)
    saveValues.push({col: 'subtotal', val: subtotal});

    /*
      Calculate the total
    */
    /* The a multiplier specific the customer that will increase or decrease their total. */
    var customer_premium = $scope.quantityRates[quantity_id]['customer_premium'];
    /* A multiplier for the entire shop that will increase or decrease total. */
    var global_premium = $scope.quantityRates[quantity_id]['global_premium'];
    /* The total is the subtotal after premiums are applied. */
    var total = subtotal * customer_premium * global_premium;
    //Save new total in the backend.
    saveValues.push({col: 'total', val: total});
    
    /*
      Calculate the premium
    */
    /* The premium is the extra amount added to the total or the discount amount
    taken from the total. */
    var premium = total - subtotal;
    //Save premium in the backend.
    saveValues.push({col: 'premium', val: premium});

    /*
      Calculate the total per m.
    */
    /* Number of units quoted for. */
    var units = $scope.quoteQuantities[quantity_id]['units'];
    /* Total per m is the cost per thousand units quoted. */
    //If no units, total per m is always zero.
    if (units == 0) {
      var total_per_m = 0;
    } else {
      var total_per_m = total / (units/1000);
    }
    //Save per m in the backend.
    saveValues.push({col: 'total_per_m', val: total_per_m})

    //Save values
    $scope.saveValues(saveValues, quantity_id);
  }

  /*
   Given an array of col, val pairs where the key is the col is column in quotequantity and 
   val is the value, save each of them.
   Update the front end values too.
  */
  $scope.saveValues = function (saveValues, quantity_id) {
    for (var i = 0; i<saveValues.length; i++) {
      $scope.quoteQuantities[quantity_id][saveValues[i].col] = saveValues[i].val;
      QT.updateQuoteQuantityValue($scope.quoteNumber, quantity_id, saveValues[i].col, saveValues[i].val);
    }
  }

  /*
    For the given input, recalculate the total with the new value
    and save it. Also calculcate the per M and save it.
    column can be: fold,tape (handwork), gluer, package, press, strip, 

  */
  $scope.recalculateTotalWithPerM = function (quantity_id, column) {

    /* The rate used to be used to evaluate the new total.*/
    var rate;
    switch (column) {
      case "fold":
      case "tape":
        rate = $scope.quantityRates[quantity_id]["handwork_per_hour"];
        break;
      default:
        rate = $scope.quantityRates[quantity_id][column + "_per_hour"];
        console.log("rate for " + column + " is " + rate);
    }

    if (rate != null) {
      /* Number of units quoted for. */
      var units = $scope.quoteQuantities[quantity_id]['units'];
      /* Total per m is the cost per thousand units quoted. */
      //If no units, total per m is always zero.
      if (units == 0) {
        var runspeed_total = 0;
        var per_m = 0;
      } else {
        //calculate total
        var runspeed_total = QT.inDollars(rate * $scope.quoteQuantities[quantity_id][column + "_runspeed"]);
        //calculate per me
        var per_m = QT.inDollars(runspeed_total / (units/1000));
      }
      console.log([{col: column + "_per_m", val: per_m},
              {col: column + "_runspeed_total", val:runspeed_total}]);
      $scope.saveValues([{col: column + "_per_m", val: per_m},
              {col: column + "_runspeed_total", val:runspeed_total}], quantity_id);
    }
  }

  /*
    Recalculate the given total.
  */
  $scope.recalculateTotal = function (quantity_id, column) {

    var newValue = $scope.quoteQuantities[quantity_id][column];
    var columnTotal = column + "_total";
    switch (column) {
      case "package_per_m_units":
        //Package per m total is calculated by  
        var rate = $scope.quoteQuantities[quantity_id]['units'] / 1000;
        var columnTotal = "package_total";
        console.log(rate);
        break;
      case "die":
      case "cutter":
      case "press_setup":
        var rate = $scope.quantityRates[quantity_id]["press_per_hour"];
        break;
      case "gluer_setup":
        var rate = $scope.quantityRates[quantity_id]["gluer_per_hour"];
        break;
      default:
        break;
    }
    if (rate != null) {
      var newTotal = QT.inDollars(rate * newValue);
      $scope.saveValues([{col: columnTotal, val: newTotal}], quantity_id);
    }
  }

  /*
    recalculate the delivery total. there is a set price for the first skid and
    an additional price for each skid after.
  */
  $scope.recalculateShipmentTotal = function (quantity_id, column) {

    var newValue = $scope.quoteQuantities[quantity_id][column];
    var columnTotal = column + "_total";
    switch (column) {
      case "delivery_skids":
        var first_rate = $scope.quantityRates[quantity_id]["press_per_hour"];
        var second_rate = $scope.quantityRates[quantity_id]["press_per_hour"];
        break;
      case "pickup_skids":
        var first_rate = $scope.quantityRates[quantity_id]["gluer_per_hour"];
        var second_rate = $scope.quantityRates[quantity_id]["press_per_hour"];
        break;
      default:
        break;
    }
    //If there are 0 skids, total is 0.
    if (newValue == 0) {
      var newTotal = 0;

    //If there is at least 1 skid, there is a set cost for that first skid
    // and a different price for each additional skid.
    } else {
      var newTotal = QT.inDollars(first_rate + second_rate(newValue - 1));
    }
    $scope.saveValues([{col: columnTotal, val: newTotal}], quantity_id);
    
  }

}

QT = {};

QT.init = function($http) {
  //Initiate new quote by entering general info
  //$("#infoModal").reveal();
  //For quick startup, focus on client box 
  //(Its the first thing you input when creating a new quote.)
  //$("#customers").focus();

  var availableTags = [];

  $.ajax({    
    url: "php/QT_helper.php",
    type: "POST",
    dataType: 'json',
    data: {
      request: 'get_customers'
    },
    success: function(data, status) {
      availableTags = data;  
    },
    error: function(data, status) {
       // $scope.data = data || "Request failed";
       // $scope.status = status;
    }
  }); 

  //As the user types in a customer, 
  //return a list of customers matching the input
  $("#customers").keyup(function() {

    //Get user input
    var searchThisCustomer = this.value;

    //TODO: Perform query to update availableTags array.

    //Call JQuery's autocomplete to give user options.
    $("#customers").autocomplete({
      source: availableTags
    });
  });

}

QT.cache = function () {
  //Store dom for faster
  QT.dom = {};

  //Store constants used throughout application.
  QT.constants = {};
}

//Modal window on intro
$(document).ready(function($http) {
  Foundation.init();
  QT.init($http);
});


/*
  Given a name of a rate from QT_MasterRates, QT_Gluer, QT_Press,
  update the rate with the given rate.
  Also pass in Angular's $http so we can make the request.
*/
QT.setMasterRate = function (rate, name, table, $http) {

  /* This object is displayed in .gluer-rates */
  $http.post(
    "php/QT_helper.php",
    { "data" :
      {
        request: "set_master_rate",
        rate: rate,
        name: name,
        table: table
      }
    }).
    success(function(data, status) {
      console.log(data);
    }).
    error(function(data, status) {
      console.log("Post failed.");
    }); 
}

QT.updateQuoteQuantityValue = function (quoteNumber, quoteQuantityId, col, val) {
  $.ajax({    
    url: "php/QT_helper.php",
    type: "POST",
    dataType: 'json',
    data: {
        request: "update_quote_quantity",
        quote_number: quoteNumber,
        quantity_id : quoteQuantityId,
        column: col,
        value: val
      },
    success: function(data, status) {
      //Display successful update.
      console.log(data)
    },
    error: function(data, status) {
    }
  }); 
 
}
QT.updateQuantityRateValue = function (quoteNumber, quoteQuantityId, col, val) {
  $.ajax({    
    url: "php/QT_helper.php",
    type: "POST",
    dataType: 'json',
    data: {
        request: "update_quantity_rate",
        quote_number: quoteNumber,
        quantity_id : quoteQuantityId,
        column: col,
        value: val
      },
    success: function(data, status) {
      console.log(data)
    },
    error: function(data, status) {
    }
  }); 
 
}

/*
  Return the given number in dollars (i.e. with only two decimal places.)
*/
QT.inDollars = function (floating_point) {
  return Math.floor(floating_point * 100) / 100;
}

function range(start, stop, step){
    if (typeof stop=='undefined'){
        // one param defined
        stop = start;
        start = 0;
    };
    if (typeof step=='undefined'){
        step = 1;
    };
    var result = [];
    for (var i=start; step>0 ? i<stop : i>stop; i+=step){
        result.push(i);
    };
    return result;
};
