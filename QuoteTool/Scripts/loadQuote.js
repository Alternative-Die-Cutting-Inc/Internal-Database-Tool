/******************************************************************************
 * This file governs loading past quotes. It is meant to extend the existing
 * framework.
 * 
 * NOTE: This file uses JQuery and there must be a JQuery library imported
 * ahead of it.
 * 
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * June 20, 2011
 * 
 ******************************************************************************/

/**
 * Load a past quote, if the URL contains the quote number as one
 * of the get arguments. 
 * If no quote number provided, or set to 'none', don't load a past quote.
 */
function loadPastQuote() {
    var args = Helper.getArguments();
    var qn;
    
    if(args["QuoteNumber"] === undefined || args["QuoteNumber"] === null 
        || args["QuoteNumber"] === "" || isNaN(args["QuoteNumber"])) {
        return;
    }
    
    qn = parseInt(args["QuoteNumber"]);
    Loading.loadOldQuote(qn, Loading.HEADER);
        
    //TODO hacky way to update the rate
    //TODO this might be taking too long
    $("#Customer").change();
    $("#genQuotesButton").click();
    
    if($("#calculateButton").length > 0) {
        console.log("Setting calc button event");
        
        $("#calculateButton").ajaxStop(function() {
            console.log("calculate on ajax stop");
            $(this).unbind('ajaxStop');
            $(this).click();
        });
    
        Loading.loadOldQuote(qn, Loading.FOOTER);
    } else {
        console.log("Could not find calculate button");
        setProgress("FATAL ERROR: Could not find calculate button");
    }
}

/**
 * The file namespace. Let's not pollute the static space.
 */
var Loading = {
    
    /***************************************************************************
     * ******************************* CONSTANTS ***************************** *
     **************************************************************************/
    
    HEADER: "header",
    FOOTER: "footer",
    
    /***************************************************************************
     * ******************************* FUNCTIONS ***************************** *
     **************************************************************************/
    
    /**
     * Load the data for the quote with the given quote number.
     * @param quoteNum The quote number.
     * @param type What type of data to load, defined by constants.
     */
    loadOldQuote: function(quoteNum, type) {
        var foundError = false, obj = this;
        
        $.ajax({
            //TODO loadQuote is for now in Dev
            url :  "Backend/loadQuote.php",
            dataType : "xml",
            type: "POST",
            data : {
                type : type,
                quoteNum : quoteNum
            },
            //asynchronous so all data can be loaded, then calculate can be pressed
            async : false,
            success : function(xml) {
                if(type === obj.HEADER)  {
                    Render.renderField(xml, Render.ID_FIELD);
                } else {
                    Render.renderRows(xml, "q");
                    
                    //render the extra fields
                    ExtraFields.load(xml);
                }
            }, 
            error: function() {
                foundError = true;
            //TODO add some useful message here
            }
        });
        
        return !foundError;
    }
};