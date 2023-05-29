
/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.  
 * Last update on 10-Aug-2011
 * ------------------------------------------------------------------------
 * This is an abstraction for a container of forms. All typical methods are
 * here. Extend as needed by prototyping, and add to those methods that are
 * expected to be extended (ex. sum)
 * 
 * REQUIRED IMPORTS: JQuery, helper.js (in Intranet/Resources/Scripts)
 *   
 ******************************************************************************/

/**
 * A form container object.
 */
var FormContainer = {
    /**
     * The unique selector for this container.
     */
    SELECTOR: "",
    /**
     * The unique selector for the table.
     */
    TABLE_SELECTOR: "",
    /**
     * When there are no forms, the selector for the dialog to show.
     */
    INVISIBLE_SELECTOR: "",
    /**
     * The letter identifier for the row class in naming.
     * Goes together with TOTAL_NUM_FORMS for naming.
     */
    ROW_CLASS: "",
    /**
     * The identifier for the form row in the slip table.
     */
    FORM_CLASS: "",
    /**
     * Number of forms added to this container since last refresh.
     */
    TOTAL_NUM_FORMS: 0,
    /**
     * Number of slips added to this container.
     */
    TOTAL_NUM_SLIPS: 0,
    /**
     * Number of forms currently visible.
     */
    NUM_ACTIVE_FORMS: 0,    
    /**
     * Number of forms per SessId
     */
    NUM_FORMS_PER_SESSID: 0,
    
    updateContainer: function() {
        //note that table selector is mandatory, invisible selector is not
        
        if($(this.TABLE_SELECTOR).length > 0) {
            if(this.NUM_ACTIVE_FORMS === 0) {
                if($(this.INVISIBLE_SELECTOR).length > 0) {
                    $(this.INVISIBLE_SELECTOR).show();
                }
                
                $(this.TABLE_SELECTOR).hide();
            } else {
                if($(this.INVISIBLE_SELECTOR).length > 0) {
                    $(this.INVISIBLE_SELECTOR).hide();
                }                
                $(this.TABLE_SELECTOR).show();
            }
        }
        
    },
    
    /*
     * If there is at least one form hide the prototype
     */
    updateForm: function() {
        //note that table selector is mandatory, invisible selector is not

        if($(this.TABLE_SELECTOR).length > 0) {
            if(this.NUM_FORMS_PER_SESSID > 0) {  
                //Hide the prototype
                $("#slipTable tbody .formPrototype").hide();
            //Remove slipTable ID
            }
        }
        
},
    
/*
     * If there is at least one slip, hide the prototype and show the slip
     */
updateSlipContainer: function() {
    //note that table selector is mandatory, invisible selector is not
        
    if($(this.SELECTOR).length > 0) {
        if(this.TOTAL_NUM_SLIPS > 0) {
//            console.log("\t\tupdate slip container execute..")
            $("#slipContainer .liveSlip #slipTable" ).show();
            $("#slipContainer .slipPrototype #slipTable").hide();
        } 
    }
        
},
    
    
/**
     * Given a number of forms that should be displayed on the page, add forms
     * until that number is reached. If there are already that number or more
     * forms, do nothing.
     * @param num The number of forms to be displayed on the page.
     */
generateForms: function(num) {
    num = num.toString().toInt();
        
    while(this.NUM_ACTIVE_FORMS < num) {
        this.addForm();
    }
},
    
/**
     * Add a new row to the table in the container and update the state
     * of the container.
     * Return the class the row object if the row was successfully added,
     * return boolean false otherwise.
     * @return JQuery object representing the row if it was created,
     * boolean false on error.
     */
addForm: function() {
    var obj = this, row;
        
    //Clone the protoype row of the table and give it a new class
    if($(this.TABLE_SELECTOR).length > 0) {
        row = $(this.TABLE_SELECTOR).find("tr.prototype")
        .clone().show().removeClass("prototype").addClass("live")
        .addClass(this.ROW_CLASS + this.TOTAL_NUM_FORMS);
            
        if($(row).find(".removeButton").length > 0) {
            $(row).find(".removeButton").click(function() {
                obj.removeForm(row);
            });
        }
        //make sure only immediate child tbody is selected
        $(this.TABLE_SELECTOR + " > tbody").append(row);
            
        this.NUM_ACTIVE_FORMS++;
        this.TOTAL_NUM_FORMS++;
        this.updateContainer();
            
        return row;
    } else {
        return false;
    }
},
    
clean: function() {
    var name, obj = this;
        
    this.TOTAL_NUM_FORMS = 0;
    this.NUM_ACTIVE_FORMS = 0;
        
    $(this.TABLE_SELECTOR).find("tr.live").each(function(i) {
        $(this).find(":input").each(function(){
            if($(this).hasAttr("name")) {
                name = $(this).attr("name").toString().replace("[]", "[" + i + "]");
                $(this).attr("name", name);
            }
        });
            
        obj.TOTAL_NUM_FORMS++;
        obj.NUM_ACTIVE_FORMS++;
    });
        
    this.updateContainer();
},
    
/**
     * Remove the given form, and update the state of the container.
     * @param form The form to be removed.
     */
removeForm: function(form) {
    if($(form).length > 0) {
        this.NUM_ACTIVE_FORMS--;
        $(form).remove();
        this.updateContainer();
    }
},
    
/**
     * Remove all forms from this container.
     */
removeAllForms: function() {
    $(this.TABLE_SELECTOR).find(".removeButton").each(function() {
        $(this).click();
    });
        
    //for simplicity
    this.TOTAL_NUM_FORMS = 0;
        
    this.updateContainer();
},
    
/**
     * Add a new "shipment div" to the table in the container and update the state
     * of the container.
     * Return the class the "shipment" object if the shipment was successfully added,
     * return boolean false otherwise.
     * @return JQuery object representing the row if it was created,
     * boolean false on error.
     */
addFormPerSessId: function(slipNumber, slipId) {
    var obj = this, shipment;
        
    //This is doing this for all forms?
    //Clone the formPrototype row of the slipTable and rename it.
    if($(this.TABLE_SELECTOR).length > 0) {
        shipment = $(this.TABLE_SELECTOR).find("tr.formPrototype")
        .clone().show().removeClass("formPrototype").addClass("liveForm")
        .addClass(this.FORM_CLASS + slipId );
//        console.log("\tcreated:" + this.FORM_CLASS + this.NUM_FORMS_PER_SESSID);
        //make sure only immediate child tbody is selected
        
        shipment.find("input#slipId").val(slipId);
        //TODO: how to select diff ones?
        $(".slipTable" + slipNumber + " > tbody").append(shipment);
            
        this.NUM_FORMS_PER_SESSID++;
        this.updateForm();
        return shipment;
    } else {
        return false;
    }
},
    
/**
     * Add new slipContainers to the contentPane.
     * Return the class the row object if the row was successfully added,
     * return boolean false otherwise.
     * @return JQuery object representing the row if it was created,
     * boolean false on error.
     */
cloneSlipContainer: function(SessId) {
    var obj = this, row;
    //Clone the protoype row of the table and give it a new class
    if($(this.SELECTOR).length > 0) {
        row = $(this.SELECTOR).find("form.slipPrototype")
        .clone().show().removeClass("slipPrototype").addClass("liveSlip")
        .addClass(this.ROW_CLASS + this.TOTAL_NUM_SLIPS).attr("id", SessId)
        //row.find("#" + SessId).find("#SessId").val(SessId);
//        console.log("creating slip: " + this.ROW_CLASS + this.TOTAL_NUM_SLIPS);

        row.find("table:first").addClass("slipTable" + SessId);
        row.find("#SessId").val(SessId);
        //make sure only immediate child tbody is selected
        $(this.SELECTOR).append(row);
            
        this.TOTAL_NUM_SLIPS++;
        //TODO: update the container so that the 
        //"no shipments is removed"
        this.updateSlipContainer();
            
        return row;
    } else {
        return false;
    }
}
};

/**
 * A subclass of the general forms class, representing the
 * extra charges. 
 * NOTE: init must be called first, to instantiate
 * this as a subclass.
 */
var SumAmountForm = {
    /**
     * A selector for the field where the amount are summed.
     */
    SUM_FIELD_SELECTOR: "",
    /**
     * A selector for EVERY field that should be summed EXCLUDING
     * the total field.
     */
    AMOUNT_CLASS: "",
    /**
     * True to prepend a dollar sign in the total field,
     * false otherwise.
     */
    COST: false,
                
    /**
     * Declare this as a subclass of FormContainer.
     */
    init: function() {
        jQuery.extend(SumAmountForm, FormContainer);
    },
                
    /**
     * Sum the amounts and set their sum into the total field.
     */
    sumAmounts: function() {
        var total = 0, val, obj = this;
                
        if($(this.SELECTOR).length > 0) {
            if($(this.SELECTOR).find(this.AMOUNT_CLASS).length > 0) {
                $(this.SELECTOR).find(this.AMOUNT_CLASS).each(function() {
                    val = $(this).val().toString();
                                
                    if(obj.COST) {
                        val = val.replace("$", "");
                    }
                                
                    total += val.toFloat();
                });
            }
            
            if(obj.COST) {
                total = "$" + total.toFixed(2);
            }
                        
            if($(this.SELECTOR).find(this.SUM_FIELD_SELECTOR).length > 0) {
                $(this.SELECTOR).find(this.SUM_FIELD_SELECTOR).val(total);
            }
        }
    },
                
    /**
     * Add a new row and return it.
     * If a new row was not added, return false.
     * @return The row that was added. Boolean false on error.
     */
    addRow: function() {
        var obj = this;
        var row = this.addForm();
                    
        if(row !== false && $(row).length > 0) {
            $(row).find(".removeButton").click(function() {
                obj.sumAmounts();
            });
                        
            $(row).find(this.AMOUNT_CLASS).change(function() {
                obj.sumAmounts();
            });
        }

        if($(row).length > 0) {
            return row;
        } else {
            return false;
        }
    }
};

/**
 * A shipping form object, subclass of FormContainer.
 */
var ShippingForm = {
    /**
     * Establish this as subclass of FormContainer.
     */
    init: function() {
        $.extend(ShippingForm, FormContainer);
        this.COST = false;
    },

    /**
     * Given a number of shipments that should be displayed on the page, add shipments until that number is reached.
     * If there are already that number or more shipments, do nothing.
     * @param num The number of shipments to be displayed on the page.
     */
    addShipments: function(num) {
        num = num.toString().toInt();

        while(this.NUM_ACTIVE_FORMS < num) {
            //Clone rows to the table and link the dropdown "type"
            //to the proper function.
            this.addShipment();
        }
    },

    /**
     * Add a new shipment to the shipment container by cloning the prototype.
     * Add a link to switch fields to correspond with the "type" dropdown.
     */
    addShipment: function() {
        var obj = this, type;
        
        //Clone a new row in the shipmentTable
        var row = this.addForm();

        //Link the selection the "type dropdown" to display its 
        // corresponding field. (Sheets/Cartons/Pieces)
        $(row).find(".Type").change(function() {
            type = $(this).val().toString();
            //Hide all fields and show the field corresponding to
            //the type given.
            obj.switchType(row, type);
        });

        //trigger event to only show default options
        $(row).find(".Type").change();
    },

    /** 
     * Switch the type of data being entered in the given row. 
     * Clear set fields and only show relevant fields.
     * @param row The JQuery row object.
     * @param type The type of data being entered in the row.
     */
    switchType: function(row, type) {
        $(row).find(".typeSwitch").hide();
       //on change, reset the input text fields
        $(row).find(".typeSwitch").find("input[type=text]").val('0');

        switch(type) {
            case "Cartons":
                $(row).find(".cartonsOnly").show();
                break;
            case "Pieces":
                $(row).find(".piecesOnly").show();
                break;
            case "Sheets":
                $(row).find(".sheetsOnly").show();
                break;
        }
    },
    
    /**
     * Given the number of forms required, create the forms and add the js link
     * so that they perform the dropdown options for the "Type" input.
     * @param slipNumber The number of rrepsenting the Slip (SessId)
     */
    setForms: function(slipNumber, slipIdArray) {
        numForms = slipIdArray.length;
        while(this.NUM_FORMS_PER_SESSID < numForms) {
            //Clone rows to the table and link the dropdown "type"
            //to the proper function.
            this.cloneForm(slipNumber, slipIdArray[this.NUM_FORMS_PER_SESSID]);
        }
        this.NUM_FORMS_PER_SESSID = 0;
    },
    
    cloneForm: function(slipNumber, slipId) {
        var obj = this, type;
        //Clone a new row in the shipmentTable
        var row = this.addFormPerSessId(slipNumber, slipId);
        //Link the selection the "type dropdown" to display its 
        // corresponding field. (Sheets/Cartons/Pieces)
        $(row).find(".Type").change(function() {
            if ($(this).val() === null) {
                type = "Cartons";
            } else {
                type = $(this).val().toString();
            }
            //Hide all fields and show the field corresponding to
            //the type given.
            obj.switchType(row, type);
        });
        //trigger event to only show default options
        $(row).find(".Type").change();
    },
    
    /**
     * Given a number of slips that should be displayed on the page, 
     * add "slipContainer"s until that number is reached.
     * If there are already that number or more shipments, do nothing.
     * @param SessIdArray An array with the SessIds.
     */
    addSlips: function(SessIdArray) {
        numSlips = SessIdArray.length;
        while(this.TOTAL_NUM_SLIPS < numSlips) {
            //Clone rows to the table and link the dropdown "type"
            //to the proper function.
//            console.log("add slips inner while loop");
            this.cloneSlipContainer(SessIdArray[this.TOTAL_NUM_SLIPS]);
        }
    }
    
    
};

/**
 * A production form object, subclass of SumAmountForm.
 */
var ProductionForm = {
    /**
     * JQuery selector for the field containing the number of forms currently shown.
     */
    NUM_FORMS_FIELD: "",
                
    /**
     * Establish this as subclass of SumAmountForm.
     */
    init: function() {
        $.extend(ProductionForm, SumAmountForm);
        this.COST = false;
    },
                
    /**
     * Get the number of forms to generate from the NUM_FORMS_FIELD
     * field.
     * If the number is greater than the current number of forms, 
     * make the number of forms equal to num.
     * If the number is less or equal, do nothing.
     */
    addProductionRows: function() {
        var num, obj = this;
                    
        if($(this.SELECTOR).length > 0 && $(this.SELECTOR).find(this.NUM_FORMS_FIELD).length > 0) {
            num = $(this.SELECTOR).find(this.NUM_FORMS_FIELD).val().toString().toInt();
                    
            obj.generateProductionRows(num);
        }
    },
    
    /**
     * Given the number of forms to generate, do the following:
     * If the number is greater than the current number of forms, 
     * make the number of forms equal to num.
     * If the number is less or equal, do nothing.
     */
    generateProductionRows: function(num) {
        while(num > this.NUM_ACTIVE_FORMS) {
            this.addProductionRow();
        }
    },
                
    /**
     * Add a row.
     */
    addProductionRow: function() {
        var obj = this;
        this.addRow();
                    
                        
        $(this.SELECTOR).find('.removeButton').click(function() {
            obj.updateNumForms();
        });
                    
        this.updateNumForms();
    },
                
    /**
     * Update the value of the field where the number of forms is shown.
     */
    updateNumForms: function() {
        if($(this.SELECTOR).length > 0 && $(this.SELECTOR).find(this.NUM_FORMS_FIELD).length > 0) {
            $(this.SELECTOR).find(this.NUM_FORMS_FIELD).val(this.NUM_ACTIVE_FORMS);
        }
    }
};