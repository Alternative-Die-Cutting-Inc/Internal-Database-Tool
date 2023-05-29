/*******************************************************************************
 * This file is an extension to the quoting system and enables saving a quote
 * at any time during the program execution. It is meant to work seemlessly
 * with the existing framework provided that the main method of this program
 * is called correctly.
 * 
 * NOTE: This file uses JQuery and there must be a JQuery library imported
 * ahead of it.
 * 
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * June 22, 2011
 * 
 ******************************************************************************/

var SaveDev = {
    /** 
     * Save the quote to the database.
     * @param ov (Optional) Override - true if you want to delete all existing data
     * under this quote number, false otherwise. 
     */
    save : function(ov) {
        var foundError = false, writetype;
    
        if(ov !== undefined && ov === false) {
            writetype = "append";
        } else {
            writetype = "override";
            ov = true;
        }
        
        if(ov) {
            if(!this.checkOverride()) {
                foundError = true;
            }
        }
        
        if(!foundError) {
            $.ajax({
                url: "Backend/saveQuote.php",
                type: "POST",
                async: false,
                data: {
                    writeType: writetype,
                    type: "search",
                    QuoteNumber: QuoteTool.QUOTE_NUMBER,
                    saveData: $("form").serialize()
                },
                error: function() {
                    foundError = true;
                }
            });
        }
    
        return !foundError;
    },
    
    /**
     * Main method for the append-to button. Query the user for the quote to which
     * they want to append the data, then save it as part of that quote.
     * Does this by changing the quote number to the one entered.
     */
    saveAppend: function() {
        var qn = window.prompt("Enter the quote number of the existing quote.");
        var obj = this, field;
    
        if(qn && qn !== "" && !isNaN(qn)) {
            field = "#Quote_Number";
            
            if($(field).length > 0) {
                $(field).val(qn).change();
                return obj.save(false);
            }
        }
        
        return false;
    },
    
    /** 
     * Confirm that the user wants to override the existing quotes with this
     * quote number.
     */
    checkOverride: function() {
        //look for other quotes with the same quote number
        //if found, inform the user what they are
        //valid output is XML
        console.log("Checking override");
        
        var qn = QuoteTool.QUOTE_NUMBER;
        console.log(qn);
        var count  = 0;
        
        $.ajax({
            url: "/Intranet/HomePage/Search/search.php",
            data:
            {
                search: qn,
                opt: "Quote Number",
                type: "nq"
            },
            dataType: "xml",
            async: false,
            success: function(xml) {
                if($(xml).find("count").length !== 1) {
                    alert("Count improperly set");
                    count = 1;
                } else {
                    count = parseInt($(xml).find("count").text() + "");
                }
            }
        });
        
        if(count === 0) {
            return true;
        } else {
            return confirm("There are other quotes with this quote number. \n" +
                "Are you sure you want to override them?");
        }
    }
};

/**
 * Namespace for this file. Let's not pollute the static space.
 */
var Saving = { 
    
    /***************************************************************************
     * ************************ CONSTANTS ************************************ *
     **************************************************************************/
    
    //type of data being written
    HEADER: 0,
    FOOTER: 1,
    
    //aliases for tables
    SEARCH: 0,
    DETAILED: 1,
    
    //types of saves
    CLEAN_SAVE: 0,
    OVERRIDE_SAVE: 1,
    
    /***************************************************************************
     * ************************ FUNCTIONS ************************************ *
     **************************************************************************/
    
    /** 
     * Confirm that the user wants to override the existing quotes with this
     * quote number.
     */
    checkOverride: function() {
        //look for other quotes with the same quote number
        //if found, inform the user what they are
        //valid output is XML
        
        var qn = parseInt($("#Quote_Number").val());
        var count  = 0;
        
        $.ajax({
            url: "/Intranet/HomePage/Search/search.php",
            data:
            {
                search: qn,
                opt: "Quote Number",
                type: "nq"
            },
            dataType: "xml",
            async: false,
            success: function(xml) {
                if($(xml).find("count").length !== 1) {
                    alert("Count improperly set");
                    count = 1;
                } else {
                    count = parseInt($(xml).find("count").text() + "");
                    
                }
            }
        });
        
        if(count === 0) {
            return true;
        } else {
            return confirm("There are other quotes with this quote number. \n" +
                "Are you sure you want to override them?");
        }
    }
};