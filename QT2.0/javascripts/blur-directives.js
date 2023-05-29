var AppModule = angular.module('app', []);

// override the default input to update on blur
AppModule.directive('ngModelOnblur', function($http) {
  return {
    restrict: 'A',
    require: 'ngModel',

    //ngModelCtrl is all the things that have ngModelOnblur
    link: function(scope, elm, attr, ngModelCtrl) {
      elm.unbind('input').unbind('keydown').unbind('change');
      //This is called when an input with ng-model-onblur is blurred.
      elm.bind('blur', function() {
        scope.$apply(function() {
          //Name of input to be blurred.
          var blurredInput = elm[0].name;
          var newRate = elm[0].value;
          var table = attr.ngModel;
          QT.setMasterRate(newRate, blurredInput, table, $http);

          // ngModelCtrl.$setViewValue(elm.val());
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
      elm.bind('blur', function() {
        scope.$apply(function() {
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
                saveValues.push({col: "sheets", val: sheets});
              }
              break;
            case "units_per_sheet":
              var units = scope.quoteQuantities[quantity_id]["units"];
              var units_per_sheet = newValue;
              if (units != 0 && units_per_sheet != 0) {
                var sheets = Math.ceil(units/units_per_sheet);
                saveValues.push({col: "sheets", val: sheets});
              }
              break;

            //The following inputs are all calculated by the press_per_hour.
            case "die":
            case "cutter":
            case "press_setup":
            case "gluer_setup":
            case "package_per_m_units":
              scope.recalculateTotal(quantity_id, "package_per_m_units");
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
            case "tape_runspeed":
              scope.recalculateTotalWithPerM(quantity_id, "tape");
              break;
            case "fold_runspeed":
              scope.recalculateTotalWithPerM(quantity_id, "fold");
              break;
          }

          scope.saveValues(saveValues, quantity_id);

        });
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