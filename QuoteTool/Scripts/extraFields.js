
/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.                                       
 * Updated July 25, 2011  
 * ----------------------------------------------------------------------------
 * Extra fields functionality.
 * TODO add more comments here
 ******************************************************************************/

/**
 * An extra field object.
 * TODO maybe use this object all the time, so it's easier to save/load
 */
function ExtraField() {
    /**
     * The type of extra field - cost, etc.
     */
    this.type = "";
    
    /**
     * The field name for this extra field.
     */
    this.field = "";
    
    /**
     * The value for this extra field.
     */
    this.value = "";
    
    /**
     * Return a string representation of this object.
     * @return String.
     */
    this.toString = function() {
        return "{type='" + this.type + "', field='" + this.field + "', value='" + this.value + "'}";
    }
}

/** 
 * The utility class for extra fields. 
 */
var ExtraFields = {
    
    /**
     * Given the valString from the hidden input, load it onto the document.
     */
    load: function(xml) {
        var fieldString, obj;
        
        $(xml).find("row").each(function (i){
            $(this).find("field").each(function() {
                if($(this).find("name").length > 0 &&
                    $(this).find("name").text().toString() === "Extra_Field" &&
                    $(this).find("value").length > 0) {
                    
                    fieldString = $(this).find("value").text().toString();
                    return false; //break
                }
        
                return true; //continue
            });
            //decode that extra fields string
            
            if($(".q" + i).length === 0 || $(".q" + i).find(".extraFields").length === 0) {
                return true; //continue;
            } 
            
            obj = $(".q" + i).find(".extraFields").get(0);
            obj.render(fieldString);
            
            return true; //continue
        });
    },
    
    /** 
     * Given a DOM object, bind an extra fields class to it. 
     * @param div The DOM object for the extra fields container.
     * @param quoteClassNum The number for the quote class. TODO explain this better
     */
    addExtraFields: function (div, quoteClassNum) {
        if($(div).length > 0) {
            var foo = quoteClassNum, newName;
        
            //set the name of the input fields for the prototype to reflect the 
            //parent quote
            $(div).find(".extra").each(function() {
                //change the name to a multi-dimensional array where the first parameter is the quote class
                //the second parameter (unknown here) is the order in which its added to container
                newName = $(this).attr("name").toString().replace("[]", "[" + foo + "][]");
                $(this).attr("name", newName);
            });
            
            div = $(div).get(0);
            $.extend(div, ExtraFieldContainer);
            div.setQuoteClass(foo);
            
            $(div).find(".addExtraButton").click(function() {
                div.addField(); 
            });
            
            $(div).find(".removeAllExtraButton").click(function() {
                div.clear();
            });
            
            div.update();
        } else {
            console.log("Could not find div");
        //TODO print error message here
        }
    },
    
    /**
     * Prepare the extra fields for saving by adding a hidden input at the
     * bottom of each extra fields container containing a serialized form
     * of extra fields. 
     * 
     * NOTE: don't forget to delete this after save by calling clearSave.
     */
    prepareSave: function() {
        var name = "extraFieldSum";
        
        //a collection of extra fields is stored here
        var fields = new Array();
        //the string to store in the hidden input value
        var valString = "";
        
        console.log("Saving extra fields");
        
        $(".quote.live").find(".extraFields").each(function() {
            fields = new Array();
            
            $(this).find(".extraRow.live").each(function(i) {
                fields[i] = new ExtraField();
                fields[i].field = $(this).find(".extraField").val().toString();
                fields[i].value = $(this).find(".extraVal").val().toString();
                fields[i].type = $(this).find(".extraType").filter(":checked").val().toString();
                
                $(this).find(":input").attr("disabled", "disabled");
            });
            
            valString = "[" + fields.toString() + "]";

            //disable all non-hidden extra fields
            
            
            $(this).append($("<input></input>").attr("type", "hidden")
                .attr("name", "Extra_Field[]").val(valString).addClass(name));
            
        });
    },
    
    /**
     * Undo everything done during prepareSave.
     */
    clearSave: function() {
        //NOTE: make sure this name is the same as the name in prepareSave
        var name = "extraFieldSum";
        
        //remove all hidden inputs
        $("." + name).remove();
        
        //remove disabled attribute from non-prototype extra fields
        $(".quote.live").find(".extraRow.live").find(":input").removeAttr("disabled");
    }
};

/** 
 * Container for the extra fields. 
 */
var ExtraFieldContainer = {
    
    /**
     * The number of fields currently in this container. 
     */
    NUM_ACTIVE_FIELDS: 0,
    
    /**
     * The number of fields added to this container since last reset.
     * Used for naming.
     */
    TOTAL_NUM_FIELDS: 0,
    
    /** 
     * The number of the parent quote. Needed for naming.
     */
    QUOTE_CLASS_NUM: -1,
    
    /**
     * Given the valString in the hidden input of save, load it into the 
     * extra fields.
     * @param valString the loaded string.
     */
    render: function(valString) {
        var row, param, field;
        var rowRegexp = /\{[^\}]+\}/g;
        var paramRegexp = /\{type=\'(.*)\', field=\'(.*)\', value=\'(.*)\'\}/;
        
        this.clear();
        
        //split rows by curly brace groupings
        while((row = rowRegexp.exec(valString))) {
            field = this.addField();
            
            //get parameters from each row
            param = paramRegexp.exec(row);
            
            //first group is the whole string, next 3 groups are parameters
            if(param.length === 4) {
                if($(field).find(".extraType").filter("[value=" + param[1] + "]").length > 0) {
                    $(field).find(".extraType").filter("[value=" + param[1] + "]").click().change();
                }
                
                $(field).find(".extraField").val(param[2]).change();
                $(field).find(".extraVal").val(param[3]).change();
            }
            
        }
        
        this.update();
    },
    
    /**
     * XXX for debugging */
    shout: function() {
        var nu = $(".live.q" + this.QUOTE_CLASS_NUM).get(0).NUM_UNITS;
        console.log("Number of units here is " + nu);
    },
    
    /** 
     * Set the quote class number. Needed for naming.
     * As one of the classes for quotes should be q(\d), the \d is the 
     * quote class number.
     * @param num The quote class number.
     */
    setQuoteClass: function(num) {
        if(num !== undefined && num !== null && num !== "" && !isNaN(num)) {
            this.QUOTE_CLASS_NUM = num;
        }
    },
    
    /** 
     * Remove all extra fields in this container and reset the counters. 
     * Return the container.
     * @return The container.
     */
    clear: function() {
        if($(this).find(".removeExtraButton").length > 0) {
            $(this).find(".removeExtraButton").click();
        }
        
        this.TOTAL_NUM_FIELDS = 0;
        this.NUM_ACTIVE_FIELDS = 0;
        this.update();
        return this;
    },
    
    /**
     * Return the number of thousands of units for this quote.
     * @return Number of thousands of units as float.
     */
    getPerM: function() {
        var foo = $(".live.q" + this.QUOTE_CLASS_NUM).get(0).NUM_UNITS;
        return (parseFloat(foo) / 1000);
    },
    
    /**
     * Add events to the extra fields in the given row.
     * @param row The row being added.
     */
    addEvents: function(row) {
        var obj = this;
        var val, foo;
        
        $(row).find(".extraType").change(function() {
            val = $(row).find(".extraType").filter(":checked").val().toString();
            foo = $(row).find(".extraVal").val().toString();
                
            if(foo === undefined || foo === null || foo === "" || isNaN(foo)) {
                foo = 0.0;
            } else {
                foo = parseFloat(foo);
            }
                
            if(val === "cost") {
                $(row).find(".extraCost").val("$" + foo.toFixed(2));
            } else if(val === "PerM") {
                foo *= obj.getPerM();
                $(row).find(".extraCost").val("$" + foo.toFixed(2));
            }
        });
        
        //when extra val changes, trigger the event for the checked radio button
        $(row).find(".extraVal").change(function() {
            $(row).find(".extraType").filter(":checked").click().change();
        });
            
        $(row).find(".removeExtraButton").click(function() {
            $(row).remove();
            obj.NUM_ACTIVE_FIELDS--;
            obj.update();
        });
    },
    
    /** 
     * Add an extra row to this container. Return that row.
     * If the container cannot be found, return null.
     * @return The row that was just added. Null if no row was added.
     */
    addField: function() {
        if(this.QUOTE_CLASS_NUM >= 0) {
            var foo = this.TOTAL_NUM_FIELDS;
            var newName;
        
            var row = $(this).find(".extraRow.prototype").clone().show()
            .removeClass("prototype").addClass("live").addClass("e" + foo);
            
            //change the name index to reflect total num fields
            $(row).find(".extra").each(function() {
                $(this).addClass("er" + foo);
                newName = $(this).attr("name").toString().replace("[]", "[" + foo + "]");
                $(this).attr("name", newName);
            });
            
            this.addEvents(row);
        
            $(this).find("table").append(row);
        
            this.TOTAL_NUM_FIELDS++;
            this.NUM_ACTIVE_FIELDS++;
            this.update();
            
            return row;
        } else {
            //TODO print an error message here
            return null;
        }
    },
    
    /**
     * Show or hide the table for extra fields depending on the number
     * of fields currently in the container
     */
    update: function() {
        if(this.NUM_ACTIVE_FIELDS > 0) {
            $(this).find("table").show();
            $(this).find(".noFields").hide();
        } else {
            $(this).find("table").hide();
            $(this).find(".noFields").show();
        }
    },
    
    /** 
     * Perform the set-all action for the extra fields.
     * This is necessary so prototype does not get set, and to not 
     * over-complicate the existing set-all method.
     */
    setAll: function() {
        var selector = "." + $(this).attr("class").toString().replace(/ /g, ".");
        var container, i, val, foo, row;
        
        //---------- this is a fix if fields have been removed from the container (i.e. there are gaps in numbering)
        container = this.QUOTE_CLASS_NUM;
        
        $(this).find(".extraRow.live").each(function(i) {
            row = $(this).attr("class").toString().match(/e\d/);
            
            if(row !== null && row.length > 0) {
                val = row[0];
                //change the row class
                $(this).removeClass(val).addClass("e" + i);
                
                $(this).find(".extra").each(function() {
                    row = $(this).attr("class").toString().match(/er\d/);
                    
                    if(row !== null && row.length > 0) {
                        val = row[0];
                        //change the row class
                        $(this).removeClass(val).addClass("er" + i);
                        val = val.replace("er", "");
                        //in the name, find the row class and update it
                        foo = $(this).attr("name").toString()
                        .replace("[" + container + "][" + val + "]", "[" + container +"][" + i + "]");
                        $(this).attr("name", foo);
                    }
                });
            }
        });
        
        //update total number of fields
        this.TOTAL_NUM_FIELDS = this.NUM_ACTIVE_FIELDS;
        //------------ end fix
        
        var numFields = this.NUM_ACTIVE_FIELDS;
        
        //select every extra field container except this one
        $(".quote.live").not(".q" + this.QUOTE_CLASS_NUM).find(selector).each(function() {
            //clear those containers
            container = $(this).get(0);
            container.clear();
            
            for(i = 0; i < numFields; i++) {
                //add the same number of fields as are present in this container
                container.addField();
            }
        });
        
        //iterate through all text input fields in this container
        $(this).find(".extraRow.live").find("input[type=text]").each(function() {
            val = $(this).val();
            foo = "." + $(this).attr("class").toString().replace(/ /g, ".");
            
            //set the text in all relevant fields to val
            $(".extraFields").find(foo).val(val);
        }); 
        
        //iterate through all checked radio buttons in this container
        $(this).find(".extraRow.live").find("input[type=radio]").filter(":checked").each(function() {
            val = $(this).val();
            foo = "." + $(this).attr("class").toString().replace(/ /g, ".");
            //check the relevant radio buttons
            $(".extraFields").find(foo).filter("[value=" + val + "]").click().change();
        }); 
    }
};