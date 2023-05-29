var AppModule = angular.module('app', []);

// override the default input to update on blur
AppModule.directive('ngModelOnblur', function($http) {
  return {
    restrict: 'A',

    //ngModelCtrl is all the things that have ngModelOnblur
    link: function(scope, elm, attr, ngModelCtrl) {
      elm.unbind('input').unbind('keydown').unbind('change');
      //This is called when an input with ng-model-onblur is blurred.
      elm.bind('blur', function() {
        scope.$apply(function() {
          //Name of input to be blurred.
          var blurredInput = elm[0].name;
          var newRate = elm[0].value;
          var table = attr.ngTable;
          QT.setMasterRate(newRate, blurredInput, table, $http);
        });
      });
    }
  };
});

/* This directive manages any blurring that occurs on inputs
with user-input as an attribute. */
AppModule.directive('userInput', function($http) {
  return {
    restrict: 'A',
    link: function(scope, elm, attr, ngModelCtrl) {
      elm.unbind('input').unbind('keydown').unbind('change');
      var calculateQuote = function() {
        /* This is the column with QT_QuoteQuantities that is being changed. */
        var column = attr.column;
        /* This identifies which quantity is changed. */
        var quantity_id = attr.quantityId;

        /* The new value entered by the user. */
        var newValue = elm[0].value;

        /* An array of key value pairs to be updated in the database. */
        var saveValues = [{col: column, val: newValue}];

        scope.quoteQuantities[quantity_id][column] = newValue;

        switch (column) {
          case "units":

            var units = newValue;
            var units_per_sheet = scope.quoteQuantities[quantity_id]["units_per_sheet"];
            
            if (units_per_sheet != 0) {

              var sheets = Math.ceil(units/units_per_sheet);
              scope.saveValues([{col: "sheets", val: sheets}], quantity_id);
              scope.recalculateSheets(quantity_id);
            }
            break;
          case "units_per_sheet":
            var units = scope.quoteQuantities[quantity_id]["units"];
            var units_per_sheet = newValue;
            if (units != 0 && units_per_sheet != 0) {
              var sheets = Math.ceil(units/units_per_sheet);
              scope.saveValues([{col: "sheets", val: sheets}], quantity_id);
              scope.recalculateSheets(quantity_id);
            }
            break;

          //The following inputs are all calculated by the press_per_hour.
          case "die":
          case "cutter":
          case "press_setup":
          case "gluer_setup":
          case "package_per_m_units":
            scope.recalculateTotal(quantity_id, column);
            break;

          case "press_runspeed":
            scope.recalculateTotalWithPerM(quantity_id, "press");
            break;
          case "gluer_runspeed":
            scope.recalculateTotalWithPerM(quantity_id, "gluer");
            break;
          case "strip_runspeed":
            scope.recalculateTotalWithPerM(quantity_id, "strip");
            break;
          case "handwork_runspeed":
            scope.recalculateTotalWithPerM(quantity_id, "handwork");
            break;
          case "pickup_skids":
          case "delivery_skids":
            scope.recalculateShipmentTotal(quantity_id, column);
            break;
          case "press_per_m":
            scope.recalculateRate(quantity_id, "press");
            scope.recalculateTotalWithPerM(quantity_id, "press");
            //The following are dependent on the rate so if we're 
            //changing the rate we need to update these as well.
            scope.recalculateTotal(quantity_id, "die");
            scope.recalculateTotal(quantity_id, "cutter");
            scope.recalculateTotal(quantity_id, "press_setup");
            break;
          case "gluer_per_m":
            scope.recalculateRate(quantity_id, "gluer");
            scope.recalculateTotalWithPerM(quantity_id, "gluer");
            scope.recalculateTotal(quantity_id, "gluer_setup");
            break;
          case "strip_per_m":
            scope.recalculateRate(quantity_id, "strip");
            scope.recalculateTotalWithPerM(quantity_id, "strip");
            break;

          //handwork and fold use the same rate so if the rate is changing,
          //recalc the other's.
          case "handwork_per_m":
            scope.recalculateRate(quantity_id, "handwork");
            scope.recalculateTotalWithPerM(quantity_id, "handwork");
            scope.recalculateTotalWithPerM(quantity_id, "fold");
            break;
          case "fold_per_m_units":
            scope.recalculateTotal(quantity_id, "fold_per_m_units");
            break;
        }
        scope.saveValues(saveValues, quantity_id);
        scope.calculateTotal(quantity_id);
      };
      //Trigger calculation when you unfocus on an input (i.e. tab out or click off)
      elm.bind('blur', function() {
        scope.$apply(calculateQuote());
      });
      //Trigger calculation when you hit enter.
      elm.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          scope.$apply(calculateQuote());

          //Do not prevent default for private and public notes.
          if (attr.column !== "private_notes" && attr.column !== "public_notes") { 
            event.preventDefault();
          }
        };
      });
    }
  };
});

/* This directive manages blurring that occurs on inputs
with extra-field as an attribute. */
AppModule.directive('extraField', function($http) {
  return {
    restrict: 'A',
    link: function(scope, elm, attr, ngModelCtrl) {
      elm.unbind('input').unbind('keydown').unbind('change');
      var setValue = function() {

        var column = attr.column;

        var quantity_id = attr.quantityId;

        var extra_id = attr.extraId;

        var newValue = elm[0].value;

        var units = scope.quoteQuantities[quantity_id].units;

        //Save the new input in the data structure.
        scope.quantityExtras[quantity_id][extra_id][column] = newValue;

        scope.setExtraField(quantity_id, extra_id, column);

        //If units is 0, we can't make any calculations.
        if (units != 0) {
          switch (column) {
            case "cost":
              //When cost is manually set, readjust cost per m
              scope.quantityExtras[quantity_id][extra_id].cost_per_m = QT.inDollars(((newValue * 100) / (units/1000) ) / 100);
              scope.setExtraField(quantity_id, extra_id, "cost_per_m");
              break;
            case "cost_per_m":
              //when cost per m is set, recalculate the total cost.
              scope.quantityExtras[quantity_id][extra_id].cost = QT.inDollars((100 * newValue * (units/1000))/ 100);
              scope.setExtraField(quantity_id, extra_id, "cost");
              break;
          }
        }
        scope.calculateTotal(quantity_id);
      };

      //Trigger calculation when you unfocus on an input (i.e. tab out or click off)
      elm.bind('blur', function() {
        scope.$apply(setValue());
      });
      //Trigger calculation when you hit enter.
      elm.bind("keydown keypress", function(event) {
        if(event.which === 13) {
          scope.$apply(setValue());
          event.preventDefault();
        }
      });
    }
  };
});

AppModule.directive('selectOnClick', function () {
  // Linker function
  return function (scope, element, attrs) {
    element.click(function () {
        element.select();
    });
  };
});