/******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 25, 2011
 * --------------------------------------------------------------------------
 * The set-all button extension designed for setting fields. 
 * 
 * NOTE: This file uses JQuery and there must be a JQuery library imported
 * ahead of it.
 * 
 *****************************************************************************/

/**
 * Namespace for the button, which prevents pollution of static space.
 */
var SetAll = {
    /**
     * The class which should not be set.
     */
    BLACKLIST_FIELDS: ["Number_of_Units"],
    /**
     * The types of fields which should be set.
     * TODO should textarea be added here?
     */
    FIELD_TYPES: ["input[type=radio]", "input[type=text]", "select"]
};

/**
 * Set the values of all quote input fields to the values of those in the 
 * specified quote. Also updates totals by calculating at the end. Ignores
 * some fields that are on a blacklist (i. e. Number of Units and Units per
 * Sheet).
 * 
 * @param quoteClass The class of the quote from which this function was called.
 */
function setAll(quoteClass) {
    var name, val, selector, ePane;
    quoteClass = "." + quoteClass;
    
    if($(quoteClass).length > 0) {
        //prepare all the extra fields
        ePane = $(quoteClass).find(".extraFields").get(0);
        ePane.setAll();
    
        $.each(SetAll.FIELD_TYPES, function() {
            $(quoteClass).find(this.toString()).not(".costField,.extra").each(function() {
                name = $(this).attr("name").toString().replace("[]", "");
            
                if($.inArray(name, SetAll.BLACKLIST_FIELDS) === -1) {
                    selector = "." + $(this).attr("class").toString().replace(/ /g, ".");
                    val = $(this).val();
            
                     $(".quote.live").find(selector).each(function() {
                         //trigger on-change event
                        $(this).val(val).change();
                    });
                }
            });
        });
        
        $("#calculateButton").click();
        setProgress("Action completed", ProgressBar.COMPLETE);
    } else {
        setProgress("Could not complete action", ProgressBar.ERROR);
    }
}
