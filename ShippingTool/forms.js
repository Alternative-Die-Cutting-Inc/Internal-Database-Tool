
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
     * Number of forms added to this container since last refresh.
     */
    TOTAL_NUM_FORMS: 0,
    /**
     * Number of forms currently visible.
     */
    NUM_ACTIVE_FORMS: 0,
    
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
        
        if($(this.TABLE_SELECTOR).length > 0) {
            row = $(this.TABLE_SELECTOR).find("tr.prototype")
            .clone().show().removeClass("prototype").addClass("live")
            .addClass(this.ROW_CLASS + this.TOTAL_NUM_FORMS);
            
            if($(row).find(".removeButton").length > 0) {
                $(row).find(".removeButton").click(function() {
                    obj.removeForm(row);
                });
            }
            
            $(this.TABLE_SELECTOR).find("tbody").append(row);
            
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
     * Add a new row.
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
                    
    }
};

/**
 * A production form object, subclass of SumAmountForm.
 */
var ProductionForm = {
    /**
     * Field containing the number of forms.
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