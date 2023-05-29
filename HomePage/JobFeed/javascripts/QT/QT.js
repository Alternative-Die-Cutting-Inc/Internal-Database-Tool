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

function QuoteController($scope, $http, $location) {

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

  /* Flag to keep track of when a quote is properly created. */
  $scope.quoteCreated = false;

  /* Extra fields for quantities. */
  $scope.quantityExtras = {};

  //Partition the quantities for the worksheet
  $scope.partition = {};

  /* Available customers: sample */
  $scope.customers = [
      "ActionScript","AppleScript","Asp","BASIC","C","C++","Clojure","COBOL","ColdFusion","Erlang","Fortran","Groovy","Haskell","Java","JavaScript","Lisp","Perl","PHP","Python","Ruby","Scala","Scheme"
    ];

  $scope.emaillist = ["sadf"];

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
      }
    });
  }

  //If existingQuote is null, create a new quote.
  if (existingQuote == null) {

    $scope.author = author;
    
  } else {
    $scope.quoteNumber = existingQuote;
    $scope.quoteCreated = true;

    //Get quoteQuantities
    $http.post(
      "php/QT_helper.php", 
      { "data" : 
        {
          request: "get_quantities",
          quote_number: $scope.quoteNumber
        }
      }).
      success(function(data, status) {
        if (!data.ERROR){
          $scope.quoteQuantities = data;
          //Partition off the quanitties for clientsheet
          var j = -1;
          var keys = Object.keys($scope.quoteQuantities)
          for (var i = 0; i < keys.length; i++) {
            if (i % 3 === 0) {
              j++;
              $scope.partition[j] = [];
            }
            $scope.partition[j].push($scope.quoteQuantities[keys[i]]);
          }
        } else {
          console.log(data);
        }
      }).
      error(function(data, status) {
        console.log("Post failed.");
    });

    //Get quantityExtras
    $http.post(
      "php/QT_helper.php", 
      { "data" : 
        {
          request: "get_extras",
          quote_number: $scope.quoteNumber
        }
      }).
      success(function(data, status) {
        if (!data.ERROR){
          $scope.quantityExtras = data;
        }
      }).
      error(function(data, status) {
        console.log("Post failed.");
    });

    //Set Meta
    $http.post(
      "php/QT_helper.php", 
      { "data" : 
        {
          request: "get_quote",
          quote_number: $scope.quoteNumber
        }
      }).
      success(function(data, status) {
        if (!data.ERROR){
          var meta = ["customer", "job_name", "attention", "description", "notes", "date", "author"];
          for (var i = 0; i < meta.length; i++) {
            field = meta[i];
            $scope[field] = (data[field] !== "NULL") ? data[field]: "";
          }
        } else {
          console.log(data);
        }
        $scope.getCustomerEmails();
      }).
      error(function(data, status) {
        console.log("Post failed.");
    });

    //Get rates
    $scope.getQuantityRates();

    $scope.getCustomerEmails = function() {
      //Get customer contact emails
      $http.post(
        "php/QT_helper.php", 
        { "data" : 
          {
            request: "get_customer_emails",
            customer: $scope.customer
          }
        }).
        success(function(data, status) {
          if (!data.ERROR){
            $scope.emaillist = data;
          } else {
            console.log(data);
          }
        }).
        error(function(data, status) {
          console.log("Post failed.");
      });
    }

  }

  /* Binded to form in modal. Creates a quuote and a 
  quantity in the db. */
  $scope.createQuote = function() {
    $("#infoModal").foundation('reveal', 'close');
    if (!$scope.quoteCreated) {
      $.ajax({    
        url: "php/QT_helper.php",
        type: "POST",
        dataType: 'json',
        data: {
          request: 'create_quote',
          customer: $scope.customer,
          job_name: $scope.job_name,
          description: $scope.description,
          notes: $scope.notes,
          author: $scope.author,
          attention: $scope.attention
        },
        success: function(data, status) {
          if (!data.ERROR) {
            console.log(data.quote_number);
            $scope.quoteNumber = data.quote_number;
            $scope.quoteCreated = true;
            $scope.date = data.Date;
            $scope.getQuantityRates();

          } else {
            console.log(data);
          }
        },
        error: function(data, status) {
          console.log(data.responseText);
        }
      });
    } else {
      var meta = ["customer", "job_name", "attention", "description", "notes", "date", "author"];
      for (var i = 0; i < meta.length; i++) {
        field = meta[i];
        $scope.saveQuoteData(field, $scope[field]);
      }
    }
  }

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

  //Set available customers
  $.ajax({    
    asych: false,
    url: "php/QT_helper.php",
    type: "POST",
    dataType: 'json',
    data: {
      request: 'get_customers'
    },
    success: function(data, status) {
      $scope.customers = data;
    },
    error: function(data, status) {
    }
  });

  

  /* Create a new quantity for the quote and add it to quoteQuantities. */
  $scope.createQuantity = function () {
    if ($scope.quoteCreated) {
      $.ajax({    
        url: "php/QT_helper.php",
        type: "POST",
        dataType: 'json',
        data: {
          request: 'create_quantity',
          quote_number: $scope.quoteNumber,
          customer: $scope.customer
        },
        success: function(data, status) {
          $scope.quoteQuantities[data.quantity_id] = data;
          //Show the quantity objects for this quote.
          $scope.$apply();
          $scope.getQuantityRates();
          console.log(data);
        },
        error: function(data, status) {
          console.log(data.responseText);
        }
      });
    }
  }

  /*
    When the stock drop down is changed, this is called.
    With the given quantity id, set the press id for that quantity.
  */
  $scope.pressChange = function (quantity_id) {
    //Update the quote quantity to the new press.
    var press_id = this.selectedPress;
    QT.updateQuoteQuantityValue($scope.quoteNumber, quantity_id, "press_id", press_id);
    $scope.quoteQuantities[quantity_id]["press_id"] = press_id;

    //Update the rates to the new rate in the frontend and backend.
    var press_rate = $.grep($scope.presses, function(press) {return press.press_id == press_id})[0].rate;
    $scope.quantityRates[quantity_id].press_per_hour = press_rate;
    QT.updateQuantityRateValue($scope.quoteNumber, quantity_id, "press_per_hour", press_rate);

    //TODO: recalculate die/cutter/press steup/press_runspeed totals and then calcualte total.
    var pressDependencies = ['die', 'cutter', 'press_setup'];
    for (i in pressDependencies) {
      $scope.recalculateTotal(quantity_id, pressDependencies[i]);
    }
    $scope.recalculateTotalWithPerM(quantity_id, 'press');
    $scope.calculateTotal(quantity_id);


  }

  $scope.gluerChange = function (quantity_id) {
    var gluer_id = this.selectedGluer;
    QT.updateQuoteQuantityValue($scope.quoteNumber, quantity_id, "gluer_id", gluer_id);
    $scope.quoteQuantities[quantity_id]["gluer_id"] = gluer_id;

    var gluer_rate = $.grep($scope.gluers, function(gluer) {return gluer.gluer_id == gluer_id})[0].rate;
    $scope.quantityRates[quantity_id].gluer_per_hour = gluer_rate;
    QT.updateQuantityRateValue($scope.quoteNumber, quantity_id, "gluer_per_hour", gluer_rate);

    //Update gluer dependencies
    $scope.recalculateTotal(quantity_id, "gluer_setup");
    $scope.recalculateTotalWithPerM(quantity_id, "gluer");
    $scope.calculateTotal(quantity_id);
  }

  /*
    When the press drop down is changed, this is called.
    With the given quantity id, set the stock id
    for that given quantity.
  */
  $scope.stockChange = function (quantity_id) {
    var stock_id = this.selectedStock;
    $scope.quoteQuantities[quantity_id]["stock_id"] = stock_id
    QT.updateQuoteQuantityValue($scope.quoteNumber, quantity_id, "stock_id", stock_id);

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
    var totals = ['die_total', 'cutter_total', 'press_setup_total', 'press_runspeed_total', 'gluer_setup_total', 'gluer_runspeed_total', 'strip_runspeed_total', 'handwork_runspeed_total', 'fold_total', 'package_total', 'pickup_skids_total', 'delivery_skids_total'];
    var subtotal = 0;

    //Adding the totals
    for (i in totals) {
      var individual_total = $scope.quoteQuantities[quantity_id][totals[i]];
      if (!isNaN(individual_total)) {
        subtotal += parseFloat(individual_total); 
      }
    }

    //Adding the totals from extras
    for (var key in $scope.quantityExtras[quantity_id]) {
      subtotal += parseFloat($scope.quantityExtras[quantity_id][key].cost);
    }
    subtotal = QT.inDollars(subtotal);
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
    var total = QT.inDollars(subtotal * customer_premium * global_premium);
    //Save new total in the backend.

    saveValues.push({col: 'total', val: total});
    
    /*
      Calculate the premium
    */
    //  The premium is the extra amount added to the total or the discount amount
    // taken from the total. 
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
      var total_per_m = QT.inDollars(total / (units/1000));
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
      QT.updateQuoteQuantityValue($scope.quoteNumber, quantity_id, saveValues[i].col, saveValues[i].val)
    }
  }

  /*
    For the given input, recalculate the total with the new value
    and save it. Also calculcate the per M and save it.
    column can be: fold, handwork, gluer, package, press, strip, 
  */
  $scope.recalculateTotalWithPerM = function (quantity_id, column) {

    /* The rate used to be used to evaluate the new total. */
    var rate;
    /* The number of units processed by the machine. */
    var units;
    switch (column) {
      //Press processes sheets
      case "press":
        units = $scope.quoteQuantities[quantity_id]['sheets'];
        rate = $scope.quantityRates[quantity_id][column + "_per_hour"];
        break;
      //Other machines process units.
      case "fold":
      default:
        rate = $scope.quantityRates[quantity_id][column + "_per_hour"];
        units = $scope.quoteQuantities[quantity_id]['units'];
    }

    if (rate != null) {
      var runspeed = $scope.quoteQuantities[quantity_id][column + "_runspeed"];
      /* Total per m is the cost per thousand sheets quoted. */
      //If no sheets, total per m is always zero.
      if (units == 0 | runspeed == 0) {
        var runspeed_total = 0;
        var per_m = 0;
      } else {
        //calculate total
        var runspeed_total = QT.inDollars((rate * 100 * (units / runspeed) )/ 100);
        //calculate per me
        var per_m = QT.inDollars((runspeed_total * 100 / (units/1000)/100));
      }
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
        break;
      case "fold_per_m_units":
        //fold per m total is calculated by  
        var rate = $scope.quoteQuantities[quantity_id]['units'] / 1000;
        var columnTotal = "fold_total";
        break;
      case "die":

        var rate = $scope.quantityRates[quantity_id]["die_per_hour"];
        break;
      case "cutter":

        var rate = $scope.quantityRates[quantity_id]["cutter_per_hour"];
        break;
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
        var first_rate = $scope.quantityRates[quantity_id]["delivery_first_skid"];
        var second_rate = $scope.quantityRates[quantity_id]["delivery_per_skid"];
        break;
      case "pickup_skids":
        var first_rate = $scope.quantityRates[quantity_id]["pickup_first_skid"];
        var second_rate = $scope.quantityRates[quantity_id]["pickup_per_skid"];
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
      var newTotal = QT.inDollars(parseFloat(first_rate) + second_rate * (newValue - 1));
    }
    $scope.saveValues([{col: columnTotal, val: newTotal}], quantity_id);
  }

  /*
    Recalcualte the rate and the new total.
  */
  $scope.recalculateRate = function (quantity_id, column) {
    /*Declare variables needed.*/
    var sheets = parseFloat($scope.quoteQuantities[quantity_id]['sheets']),
        newPerM = parseFloat($scope.quoteQuantities[quantity_id][column + "_per_m"]),
        runspeed = parseFloat($scope.quoteQuantities[quantity_id][column + "_runspeed"]),
        columnTotal = column + "_runspeed_total",
        rate = parseFloat($scope.quantityRates[quantity_id][column + "_per_hour"]);
 
    var columnRate = column + "_per_hour";
    
    //If sheets are 0, we can't calculate the new rate.
    if (sheets > 0) {
      //Calculate new rate
      var newRate = QT.inDollars(((newPerM * runspeed * 100)/ 1000 )/ 100);
      if (newRate > 0) {
        $scope.quantityRates[quantity_id][columnRate] = newRate;
        /*Set new rate for that machine for this quote. */
        QT.updateQuantityRateValue($scope.quoteNumber, quantity_id, columnRate, newRate);
      }
    }
  }

  /*
    Called on change of sheets. Recalculate all the totals that rely 
    on the sheets: press_runspeed_total/press_per_m, 
    gluer_runspeed_total/per_m,
    strip_runspeed_total/per_m,
    handwork_runspeed_total/per_m,
    fold_runspeed_total/per_m,
    package_total
  */
  $scope.recalculateSheets = function(quantity_id) {
    //Update all numbers dependent on sheets.
    var totals = ["press", "gluer", "strip", "handwork"];
    for (i in totals) {   
      $scope.recalculateTotalWithPerM(quantity_id, totals[i]);
    }
    $scope.recalculateTotal(quantity_id, "package_per_m_units");
    $scope.recalculateTotal(quantity_id, "fold_per_m_units");

  }

  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };

  $scope.addExtra = function(quantity_id) {
    $http.post(
      "php/QT_helper.php", 
      { "data" : 
        {
          request: "add_extra",
          quote_number: $scope.quoteNumber,
          quantity_id: quantity_id
        }
      }).
      success(function(data, status) {
        if ($scope.quantityExtras[quantity_id] === undefined) {
          $scope.quantityExtras[quantity_id] = {};
        }
        $scope.quantityExtras[quantity_id][data.result.extra_id] = data.result;
        console.log($scope.quantityExtras);

      }).
      error(function(data, status) {
        console.log("Post failed.");
    });
  }

  $scope.setExtraField = function (quantity_id, extra_id, column) {
    $http.post(
      "php/QT_helper.php", 
      { "data" : 
        {
          request: "set_extra_field",
          quote_number: $scope.quoteNumber,
          quantity_id: quantity_id,
          extra_id: extra_id,
          column: column,
          val: $scope.quantityExtras[quantity_id][extra_id][column]
        }
      }).
      success(function(data, status) {
        if (data.ERROR) {
          console.log(data);
        }
      }).
      error(function(data, status) {
        console.log("Post failed.");
    });
  }

  $scope.deleteExtra = function(extra_id, quantity_id) {
    console.log("Removing extra id: " + extra_id);
    $http.post(
      "php/QT_helper.php", 
      { "data" : 
        {
          request: "delete_extra_field",
          quote_number: $scope.quoteNumber,
          quantity_id: quantity_id,
          extra_id: extra_id
        }
      }).
      success(function(data, status) {
        if (data.ERROR) {
          console.log(data);
        } else {
          //If delete happens successfully in the backend, remove it from the frontend
          delete $scope.quantityExtras[quantity_id][extra_id];
        }
      }).
      error(function(data, status) {
        console.log("Post failed.");
    });
  }

  /*
    Given a Quantity ID, send a request to the server to remove it from the current quote.
  */
  $scope.deleteQuantity = function(quantity_id) {
    console.log("Removing quantity: " + quantity_id);
    $http.post(
      "php/QT_helper.php", 
      { "data" : 
        {
          request: "delete_quantity",
          quote_number: $scope.quoteNumber,
          quantity_id: quantity_id
        }
      }).
      success(function(data, status) {
        if (data.ERROR) {
          console.log(data);
        } else {
          //If delete happens successfully in the backend, remove it from the frontend
          delete $scope.quoteQuantities[quantity_id];
        }
      }).
      error(function(data, status) {
        console.log("Post failed.");
    });
  }

  /*
    Given the quote column and it's new value, save it in the database for the current quote.
  */
  $scope.saveQuoteData = function (column, value) {
    $http.post(
      "php/QT_helper.php", 
      { "data" : 
        {
          request: "save_quote_data",
          quote_number: $scope.quoteNumber,
          column: column,
          value: value
        }
      }).
      success(function(data, status) {
        if (data.ERROR) {
          console.log(data);
        }
      }).
      error(function(data, status) {
        console.log("Post failed.");
    });
  }

  /*
    With the given quantity_id, set all the values of each quantity with the values of this quantity_id.
  */
  $scope.setAll = function(quantity_id) {
    //Create a copy of the values of the current quantity_id
    var quantity_temp = $scope.quoteQuantities[quantity_id];

    //Store all the new values in a saveValues array.
    var saveValues = [];
    for (var column in quantity_temp) {

      //We only want to set all the inputs and not the units/sheets
      if (column !== "quantity_id" 
        && column !== "units"
        && column !== "sheets"
        && column !== "$$hashKey"
        && column !== "public_notes"
        && column !== "private_notes") {
        saveValues.push({col: column, val: quantity_temp[column]});
      }
    }

    //For each quote quantities
    for (var key in $scope.quoteQuantities) {

      //Set all in the backend
      $scope.saveValues(saveValues, key);
    }

    //Save extras
    //Loop through all the quantities
    for (var key in $scope.quoteQuantities) {
      if ($scope.quantityExtras[key] === undefined) {
        $scope.quantityExtras[key] = {};
      }
      //Loop through all the extra fields
      for (var extra_id in $scope.quantityExtras[quantity_id]) {

        //Loop through the meta data of an extra field
        extraColumns = ["cost", "cost_per_m", "extra_id", "name"];
        for (var i in extraColumns) {
          var column = extraColumns[i];
          if ($scope.quantityExtras[key][extra_id] === undefined) {
            $scope.quantityExtras[key][extra_id] = {}
          }
          $scope.quantityExtras[key][extra_id][column] = $scope.quantityExtras[quantity_id][extra_id][column];
          $scope.setExtraField(key, extra_id, column); 
        }
        //quantity id is one piece of meta data we dont want an exact clone of. Set it to the quantity_id being iterated on.
        $scope.quantityExtras[key][extra_id]["quantity_id"] = key;
        $scope.setExtraField(key, extra_id, "quantity_id"); 
      }

      //Recalculate the totals with the new values and the original units/sheets.
      $scope.recalculateOnSetAll(key);
    }
  }

  $scope.setChecked = function(quantity_id) {
    //Create a copy of the values of the current quantity_id
    var quantity_temp = $scope.quoteQuantities[quantity_id];

    //Store all the new values in a saveValues array.
    var saveValues = [];
    for (var column in quantity_temp) {
      if (column !== "quantity_id" 
        && column !== "units" 
        && column !== "sheets") {
        saveValues.push({col: column, val: quantity_temp[column]});
      }
    }

    //For each quote quantities
    for (var key in $scope.checked) {
      //Set all in the backend

      if ($scope.checked[key].checked) {
        $scope.saveValues(saveValues, key);
      }
    }

    //Save extras
    //Loop through all the quantities
    for (var key in $scope.checked) {
      if ($scope.checked[key].checked) {
        //Once we've identified the checked quantities, set the check to false.
        $scope.checked[key].checked = false;
        if ($scope.quantityExtras[key] === undefined) {
          $scope.quantityExtras[key] = {};
        }
        //Loop through all the extra fields
        for (var extra_id in $scope.quantityExtras[quantity_id]) {

          //Loop through the meta data of an extra field
          extraColumns = ["cost", "cost_per_m", "extra_id", "name"];
          for (var i in extraColumns) {
            var column = extraColumns[i];
            if ($scope.quantityExtras[key][extra_id] === undefined) {
              $scope.quantityExtras[key][extra_id] = {}
            }
            $scope.quantityExtras[key][extra_id][column] = $scope.quantityExtras[quantity_id][extra_id][column];
            $scope.setExtraField(key, extra_id, column); 
          }
          //quantity id is one piece of meta data we dont want an exact clone of. Set it to the quantity_id being iterated on.
          $scope.quantityExtras[key][extra_id]["quantity_id"] = key;
          $scope.setExtraField(key, extra_id, "quantity_id"); 
        }

      $scope.recalculateOnSetAll(key);
      }
    }
  }

  //Manage which quantities are checked.
  $scope.check = function(quantity_id) {
    if ($scope.checked[quantity_id] === undefined) {
      $scope.checked[quantity_id] = {checked: false}
    }
    $scope.checked[quantity_id].checked = !$scope.checked[quantity_id].checked;
    console.log($scope.checked);
  }

  $scope.checked = {};

  //For the given quantity_id recalculate all the totals that are dependent on units and sheets.
  //Don't need to recalculate per m because those are already set, don't need to recalculate setups because they will be the same/do not depend on units/sheets
  $scope.recalculateOnSetAll = function(quantity_id) {

    //Calculate the new sheets
    units = $scope.quoteQuantities[quantity_id]["units"];
    units_per_sheet = $scope.quoteQuantities[quantity_id]["units_per_sheet"];
    var sheets = Math.ceil(units/units_per_sheet);
    $scope.saveValues([{col: "sheets", val: sheets}], quantity_id);

    $scope.recalculateTotal(quantity_id, "package_per_m_units");

    //Recalculate the runspeeds (they depend on units/sheets)
    var runspeeds = ["press", "gluer", "strip", "handwork"];
    for (var i in runspeeds) {
      $scope.recalculateTotalWithPerM(quantity_id, runspeeds[i]);
    }

    $scope.recalculateTotal(quantity_id, "fold_per_m_units");
    $scope.recalculateTotal(quantity_id, "package_per_m_units");

    //Recalculate the extras
    var units = $scope.quoteQuantities[quantity_id].units;
    for (var key in $scope.quantityExtras[quantity_id]) {

      //For each of the extras, we want to set the per m of the source quantity, and evaluate the cost based on the target quantity's units.
      var newValue = $scope.quantityExtras[quantity_id][key].cost;
      $scope.quantityExtras[quantity_id][key].cost_per_m = QT.inDollars(((newValue * 100) / (units/1000) ) / 100);
      $scope.setExtraField(quantity_id, key, "cost");
    }
    $scope.calculateTotal(quantity_id);

    $scope.$apply();
  }

  $scope.loader = "";

  $scope.emailClientPDF = function() {
    $scope.loader = "loader yellow";
    $http.post(
      "php/clientsheet_pdf_helper.php", 
      { "data" : 
        {
          request: "email_client_pdf",
          quote_number: $scope.quoteNumber,
          customer: $scope.customer,
          input_emails: $scope.inputEmails,
          client_email: $scope.clientEmail,
          message: $scope.message
        }
      }).
      success(function(data, status) {
        if (!data.ERROR){
          $scope.notice = data.SUCCESS;
        } else {
          $scope.notice = data.ERROR;
        }
        console.log(data);
        $scope.loader = "";
      }).
      error(function(data, status) {
        console.log("Post failed.");
    });
  }

  $scope.new_quote_number = null;
  /* Request to save the current quote number's values as a new quote number. */
  $scope.setAsNew = function() {
    $http.post(
      "php/QT_helper.php", 
      { "data" : 
        {
          request: "set_as_new",
          quote_number: $scope.quoteNumber
        }
      }).
      success(function(data, status) {
        if (!data.ERROR){
          $scope.new_quote_number = data.new_quote_number;
        }
        console.log(data);
      }).
      error(function(data, status) {
        console.log("Post failed.");
    });
  }

  /*
    Given a value, if it is zero, return "hide".
  */
  $scope.hideOnZero = function(value) {
    if (value == 0) {
      return "hide";
    }
  }

}//QuoteController

QT = {};

QT.init = function($http) {
  if (existingQuote == null) {

    //Initiate new quote by entering general info
    $("#infoModal").foundation('reveal', 'open');
    //For quick startup, focus on client box 
    //(Its the first thing you input when creating a new quote.)
    $("#customers").focus();

  }

}

QT.cache = function () {
  //Store dom for faster
  QT.dom = {};

  //Store constants used throughout application.
  QT.constants = {};
}

//Modal window on intro
$(document).ready(function($http) {
  $(document).foundation();
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
  if (isNaN(val)) {
    //The only time non number values are accepted is for the notes.
    if (col !== "private_notes" && col !== "public_notes") {
      return;
    }
  }
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
      if (data.ERROR) {
        console.log(data.ERROR);
      }
    }, 
    error: function(data, status) {
    }
  }); 


}

QT.updateQuantityRateValue = function (quoteNumber, quoteQuantityId, col, val) {
  if (isNaN(val)) {
  }
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

function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
 
    var temp = obj.constructor(); // give temp the original obj's constructor
    for (var key in obj) {
        temp[key] = cloneObject(obj[key]);
    }
 
    return temp;
}
