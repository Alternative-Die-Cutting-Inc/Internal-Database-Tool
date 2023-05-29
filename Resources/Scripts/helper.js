/**
 * Return true if the source string(haystack) starts with needle.
 * @param needle The starting string.
 * @return True if the string starts with needle, false otherwise.
 */
String.prototype.startsWith = function(needle) {
    return (this.indexOf(needle) === 0);
}

/**
 * Return true if the JQuery object has the given attribute,
 * false otherwise.
 * @return True if JQuery object has the attribute, false otherwise.
 */
$.fn.hasAttr = function(attr) {
    return $(this).attr(attr) !== undefined && $(this).attr(attr) !== false;
};

/**
 * Convert the given string to an integer, if the string represents an integer.
 * Otherwise, return 0.
 * @return Integer representation of string. 
 */
String.prototype.toInt = function() {
    if(isNaN(this) || this.length === 0) {
        return 0;
    } else {
        return parseInt(this);
    }
}

/**
 * Convert the given string to a float, if the string represents an integer.
 * Otherwise, return 0.0.
 * @return Float representation of string. 
 */
String.prototype.toFloat = function() {
    if(isNaN(this) || this.length === 0) {
        return 0;
    } else {
        return parseFloat(this);
    }
}

/**
 * The namespace for the helper functions.
 */
var Helper = {
    
    /**
     * Create a variable name out of the given string and the given quote ID.
     * Return the variable name.
     * @param fieldName Field name.
     * @param parentQuoteId ID of parent quote. (Optional)
     * @return Variable name.
     */
    makeVar: function(fieldName, parentQuoteId) {
        if(parentQuoteId === undefined || parentQuoteId === null) {
            parentQuoteId = "";
        }
    
        return fieldName.toString().replace(/ /g, "_") + parentQuoteId;
    },
    
    /**
     * Return an associative array of key-value pairs that represent the GET
     * arguments for the URL of this page. 
     * If there are no arguments, return an empty array.
     * @return Associative array of arguments.
     */
    getArguments: function() {
        var url = window.location.href;
        return Helper.getArgsHelper(url);
    },
    
    /**
     * This function is a helper function to getArguments. The reason
     * for this function is easy testing - getArguments cannot be 
     * tested except by altering the url, but this function can.
     * Return an associative array of key-value pairs that represent the GET
     * arguments for the given URL. 
     * If there are no arguments, return an empty array.
     * @param url The URL.
     * @return Associative array of arguments.
     */
    getArgsHelper: function(url) {
        var foo = url.toString().split("?");
        var bar, i, argstrings;
        var args = new Array();
        
        if(foo.length === 2) {
            argstrings = (foo[1]).split("&");
        
            for(i = 0; i < argstrings.length; i++) {
                bar = (argstrings[i]).split("=");
                
                if(bar.length === 2) {
                    args[bar[0]] = bar[1];
                }
            }
        }
        
        return args;
    }
}

/**
* Create a variable name out of the given string and the given quote ID.
* Return the variable name.
* @param fieldName Field name.
* @param parentQuoteId ID of parent quote. (Optional)
* @return Variable name.
* @deprecated Alias for Helper.makeVar
*/
function makeVar(fieldName, parentQuoteId) {
    return Helper.makeVar(fieldName, parentQuoteId);
}

/**
 * Return true if the JQuery object has the given attribute,
 * false otherwise.
 * @return True if JQuery object has the attribute, false otherwise.
 */
function hasAttr(item, attr) {
    return $(item).hasAttr(attr);
}