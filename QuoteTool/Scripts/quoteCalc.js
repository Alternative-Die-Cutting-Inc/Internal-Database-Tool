/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Last updated August 8, 2011
 * ----------------------------------------------------------------------------
 * This file is meant for updating the costs for individual fields as well
 * as the grand totals.
 * Rates are retrieved through AJAX requests.
 * 
 * NOTE: This file uses JQuery and expects JQuery imported
 * NOTE: This file uses the Progress class and expects it imported
 * NOTE: This file uses extended prototype methods from helper class
 * NOTE: This file uses the renderer and expects it as an import
 ******************************************************************************/

/**
 * This object is attached to each quote and is that quote's calculator.
 * Used to calculate cost for each field based on dependant fields and 
 * response from the database. 
 * Also used to calculate totals.
 */ 
var QuoteCalculator = {
    /** 
     * The class selector (period included) for the parent quote of this
     * calculator.
     */
    QUOTE_CLASS: "",
    
    /** The number of units for this quote */
    NUM_UNITS: 0,
    
    /** The number of sheets for this quote */
    NUM_SHEETS: 0,
   
    /** 
     * The constructor-ish method for this class. Set the class for the quote.
     * All fields are contained in this class, and it is unique among all 
     * quotes currently on display.
     * @param newClass The name of the unique class of the parent quote.
     */
    setQuoteClass: function(newClass) {
        this.QUOTE_CLASS = "." + newClass;
        this.addEvents();
    },
    
    /** Add events after the quote class has been set */
    addEvents: function() {
        var obj = this, name;
        
        //put number of units and units per sheet events together
        
        $(this.QUOTE_CLASS).find(".input.Number_of_Units,.input.Units_per_Sheet").change(function() {
            obj.updateNumSheets();
        });
        
        $(this.QUOTE_CLASS).find(".run, .Press").change(function() {
            obj.updateRunCost(); 
        });
        
        $(this.QUOTE_CLASS).find(".Press").change(function() {
            obj.updateHourlyCost("Setup");
        });
        
        $(this.QUOTE_CLASS).find(".hourly").change(function() {
            name = $(this).attr("name").toString().replace("[]", "");
            obj.updateHourlyCost(name); 
        });
        
        $(this.QUOTE_CLASS).find(".speed").change(function() {
            name = $(this).attr("name").toString().replace("[]", "");
            obj.updateSpeedCost(name); 
        });
        
        $(this.QUOTE_CLASS).find(".input.Packaging").change(function() {
            obj.updatePackageCost(); 
        });
        
        $(this.QUOTE_CLASS).find(".shipping").change(function() {
            name = $(this).attr("name").toString().replace("[]", "");
            obj.updateShipCost(name); 
        });
        
        $(this.QUOTE_CLASS).find(".Shipping_Type, .Method").change(function() {
            
            //these update shipping cost for both pickup and delivery
            $(obj.QUOTE_CLASS).find(".input.shipping").each(function() {
                name = $(this).attr("name").toString().replace("[]", "");
                obj.updateShipCost(name); 
            });
        });
    },
    
    /**
     * Check if the string in str is a valid number. Return true if it is,
     * false otherwise.
     * TODO move this to helper
     * @param str (Optional) The variable to be checked.
     * @return True if str is a valid number, false otherwise.
     */
    isNum: function(str) {
        return str !== undefined && str !== null && str !== "" && !isNaN(str);
    },
    
    /** XXX For debugging purposes. Print a message to the console */
    shout: function() {
        console.log("hello from calculator");
    },
    
    /**
     * Update the totals for this quote.
     */
    updateTotals: function() {
        var val = "", obj = this, subtotal = 0.0;
        var field;
        
        //trigger all events to update all fields
        
        //updates all events to do with number of units
        this.updateNumSheets();
        
        //updates the rest
        $(this.QUOTE_CLASS).find(".hourly").change();
        
        $(this.QUOTE_CLASS).find(".cost").each(function() {
            val = $(this).val().toString().replace("$", "");
            
            if(obj.isNum(val)) {
                field = $(this).attr("class").toString().replace("cost ", "").replace("costField ", "");
//                console.log("Adding " + val + " from " + field + " in " + obj.QUOTE_CLASS);
                subtotal += parseFloat(val);
//                console.log("Subtotal is " + subtotal);
            }
        });
        
        var rate = $("#Rate").val();
        rate = this.isNum(rate) ?  parseFloat(rate) : rate = 1.00;
        
        var fields = new Array("Subtotal", "Discount", "Total", "Total_per_Thousand");
        
        $.each(fields, function () {
            field = this.toString();
            
            switch(field) {
                case "Subtotal":
                    val = subtotal;
                    break;
                case "Discount":
                    val = subtotal * (1 - rate);
                    break;
                case "Total":
                    val = subtotal * rate;
                    break;
                case "Total_per_Thousand":
                    if(obj.NUM_UNITS === 0) {
                        val = 0.0;
                    } else {
                        val = (subtotal * rate) / (obj.NUM_UNITS / 1000);
                    }
                    break;
            }
            
            $(obj.QUOTE_CLASS).find("." + field).val("$" + val.toFixed(2));
        });
    },
    
    /** 
     * Update the number of sheets based on the number of units and the
     * units per sheet. Round up to nearest integer. Default to 0.
     */
    updateNumSheets: function () {
        var name, numSheets = 0, obj = this;
        
        if($(this.QUOTE_CLASS).length === 0) {
            setProgress("FATAL ERROR: Quote class not properly set", ProgressBar.ERROR);
            return;
        }
        
        var numUnits = $(this.QUOTE_CLASS).find(".input.Number_of_Units").val();
        var density = $(this.QUOTE_CLASS).find(".input.Units_per_Sheet").val();
        
        this.NUM_UNITS = this.isNum(numUnits) ? parseInt(numUnits) : 0;
        
        if(this.isNum(density) && parseFloat(density) !== 0.0) {
            numSheets = Math.ceil(this.NUM_UNITS / parseFloat(density));
        } 
        
        this.NUM_SHEETS = numSheets;
        $(this.QUOTE_CLASS).find(".Number_of_Sheets").val(numSheets);
        
        //TODO update all related fields
        this.updateRunCost();
        this.updatePackageCost();
        
        
        //TODO can I replace all these with explicit call to change?
        $(this.QUOTE_CLASS).find(".speed").each(function() {
            name = $(this).attr("name").toString().replace("[]", "");
            obj.updateSpeedCost(name); 
        });
        
        $(this.QUOTE_CLASS).find(".shipping").each(function() {
            name = $(this).attr("name").toString().replace("[]", "");
            obj.updateShipCost(name); 
        });
        
        $(this.QUOTE_CLASS).find(".extra").change();
    },
    
    /**
     * Update the running cost based on values in dependant fields.
     */
    updateRunCost: function() {
        var hours = 0, fieldClass = "Run_Speed";
        
        if($(this.QUOTE_CLASS).length === 0) {
            setProgress("FATAL ERROR: Quote class not properly set", ProgressBar.ERROR);
            return;
        }
        
        if($(this.QUOTE_CLASS).find("." + fieldClass).length === 0) {
            setProgress("ERROR: field class improperly set", ProgressBar.ERROR);
            return;
        }
        
        var speed = $(this.QUOTE_CLASS).find(".input." + fieldClass).val();
        
        if(this.isNum(speed) && parseFloat(speed) !== 0.0) {
            hours = this.NUM_SHEETS / parseFloat(speed);
        }
        
        var press = $(this.QUOTE_CLASS).find(".Press").val();
        
        this.loadHourlyRate(hours, fieldClass, press);
    },
    
    /**
     * Update the cost for the hourly cost field with the given class.
     * @param fieldClass The class of the hourly cost field.
     */
    updateHourlyCost: function(fieldClass) {
        var extra = "";
        
        if($(this.QUOTE_CLASS).length === 0) {
            setProgress("FATAL ERROR: Quote class not properly set", ProgressBar.ERROR);
            return;
        }
        
        if($(this.QUOTE_CLASS).find("." + fieldClass).length === 0) {
            setProgress("ERROR: field class improperly set", ProgressBar.ERROR);
            return;
        }
        
        var hours = $(this.QUOTE_CLASS).find(".input." + fieldClass).val();
        
        if(this.isNum(hours) && parseFloat(hours) !== 0.0) {
            hours = parseFloat(hours);
        } else {
            hours = 0.0;
        }
        
        if(fieldClass === "Setup") {
            extra = $(this.QUOTE_CLASS).find(".Press").val().toString();
        }
        
        this.loadHourlyRate(hours, fieldClass, extra);
    },
    
    /**
     * Update the cost for the speed cost field with the given class.
     * @param fieldClass The class of the speed cost field.
     */
    updateSpeedCost: function(fieldClass) {
        var hours = 0;
        
        if($(this.QUOTE_CLASS).length === 0) {
            setProgress("FATAL ERROR: Quote class not properly set", ProgressBar.ERROR);
            return;
        }
        
        if($(this.QUOTE_CLASS).find("." + fieldClass).length === 0) {
            setProgress("ERROR: field class improperly set", ProgressBar.ERROR);
            return;
        }
        
        var speed = $(this.QUOTE_CLASS).find(".input." + fieldClass).val();
        
        if(this.isNum(speed) && parseFloat(speed) !== 0.0) {
            hours = this.NUM_UNITS / parseFloat(speed);
        }
        
        this.loadHourlyRate(hours, fieldClass);
    },
    
    /** 
     * Load the hourly rate from the database and set the cost accordingly.
     * This should only be called by fields which have a purely per hour rate
     * (i.e. not shipping).
     * @param hours The number of hours of work for the given field.
     * @param fieldClass The field for which the data is being loaded.
     * @param extraData (Optional) Extra data that might be needed by the database
     * to complete the calculation.
     */
    loadHourlyRate: function(hours, fieldClass, extraData) {
        var keyField = "", obj = this;
        
        if(extraData ===  undefined || extraData === null) {
            extraData = "";
        }
        
        if(fieldClass === "") {
            setProgress("Could not load rate, field type improperly set", ProgressBar.ERROR);
            return;
        }
        
        if(extraData === "") {
            keyField = fieldClass;
        } else {
            keyField = extraData;
        }
        
        $.ajax({
            url: "Backend/getrate.php",
            type: "POST",
            data: {
                field: keyField,
                val: hours,
                //TODO why is type necessary?
                type: ""
            },
            success: function(rate) {
                rate = rate === "" || isNaN(rate) ? 0 : parseFloat(rate);
                var cost = hours * rate;
                var costPerM = obj.NUM_UNITS === 0 ? 0 : cost / (obj.NUM_UNITS / 1000);
                
                if(fieldClass === "Run_Speed") {
                    //for run, the per thousand is per thousand sheets
                    costPerM = obj.NUM_SHEETS === 0 ? 0 : cost / (obj.NUM_SHEETS / 1000);
                }
        
                if($(obj.QUOTE_CLASS).find(".cost." + fieldClass).length > 0) {
                    $(obj.QUOTE_CLASS).find(".cost." + fieldClass).val("$" + cost.toFixed(2));
                }
        
                if($(obj.QUOTE_CLASS).find(".perM." + fieldClass).length > 0) {
                    $(obj.QUOTE_CLASS).find(".perM." + fieldClass).val("$" + costPerM.toFixed(2));
                }
            },
            error: function() {
                setProgress("Unable to load rate for field type " + fieldClass, ProgressBar.ERROR);
            }
        });
    },
    
    /**
     * Update the packaging cost when the value in the packaging field changes.
     */
    updatePackageCost: function() {
        if($(this.QUOTE_CLASS).length === 0) {
            setProgress("FATAL ERROR: Quote class not properly set", ProgressBar.ERROR);
            return;
        }
        
        var packaging = $(this.QUOTE_CLASS).find(".input.Packaging").val();
        var cost = 0;
        
        
        if(this.isNum(packaging) && this.NUM_UNITS !== 0) {
            cost = parseFloat(packaging) * (this.NUM_UNITS / 1000);
        }
        
        $(this.QUOTE_CLASS).find(".Packaging.costField").val("$" + cost.toFixed(2));
    },
    
    /** 
     * Update the shipping cost of the given field - pickup or delivery.
     * @param fieldClass pickup or delivery
     */
    updateShipCost: function(fieldClass) {
        console.log("Called with " + fieldClass);
        
        if($(this.QUOTE_CLASS).length === 0) {
            setProgress("FATAL ERROR: Quote class not properly set", ProgressBar.ERROR);
            return;
        }
        
        if($(this.QUOTE_CLASS).find(".input." + fieldClass).length === 0) {
            setProgress("ERROR: Field class not properly set: " + fieldClass, ProgressBar.ERROR);
            return;
        }
        
        var type = $(this.QUOTE_CLASS).find(".Shipping_Type").val();
        
        if(type === fieldClass || type === "2 Way shipping") {
            var method = $(this.QUOTE_CLASS).find(".Method").val();
            var numSkids = 0, obj = this;
            var density = $(this.QUOTE_CLASS).find(".input." + fieldClass).val();
        
            if(this.isNum(density)) {
                numSkids = Math.ceil(this.NUM_SHEETS / parseFloat(density));
            }
        
            $.ajax({
                url: "Backend/getshippingrate.php",
                type: "POST",
                data: {
                    numskids: numSkids,
                    method: method
                },
                success: function(cost) {
                    cost = cost === "" || isNaN(cost) ? 0 : parseFloat(cost);
                    $(obj.QUOTE_CLASS).find(".cost." + fieldClass).val("$" + cost.toFixed(2));
                },
                error: function() {
                    setProgress("Failed to load shipping rate", ProgressBar.ERROR);
                }
            });
        } else {
            cost = 0.0;
            $(this.QUOTE_CLASS).find(".cost." + fieldClass).val("$" + cost.toFixed(2));
        }
    }
};

var QuoteCalc = {
    /**
     * Given the number of hours required for a job, fetch the cost to run that
     * job. Also needed is the name of the job, and the field in which to
     * put the cost once it is loaded.
     * @param numHours Number of hours to complete the job.
     * @param jobName The name of the job.
     * @param fieldObj JQuery object for the field into which to post the cost.
     */
    fetchHourlyCost: function(numHours, jobName, fieldObj) {
        var cost = 0;
        
        if($(fieldObj).length === 0) {
            setProgress("Could not find the specified field", ProgressBar.ERROR);
            return;
        }
        
        if(numHours > 0) {
            //fetch the cost
            
            $.ajax({
                type: "post",
                //AJAX request here
                success: function() {
                    
                }
            });
            
        } else {
            this.setCost(fieldObj, cost);
        }
    },
    
    /**
     * Given the cost as a float and a field object, set the field object text
     * to the cost, with a prepended dollar sign.
     * Return true if the field was successfully set, false otherwise.
     * @param fieldObj The field as a JQuery object.
     * @param cost The cost.
     * @return True if field was set, false otherwise.
     */
    setCost: function(fieldObj, cost) {
        if($(fieldObj).length  > 0 && cost !== undefined && cost !== null) {
            var costString = "$" + cost.toString().toFloat().toFixed(2);
            $(fieldObj).val(costString);
            return true;
        } else {
            return false;
        }
    }
};