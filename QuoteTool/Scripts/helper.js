/**
 * Create a variable name out of the given string and the given quote ID.
 * Return the variable name
 * @param string Field name.
 * @param id ID of parent quote.
 * @return Variable name.
 */
function makeVar(string, id) {
    return string.replace(/ /g, "_") + id;
}

/**
 * Given the name of a field, return the quote index to which that field
 * belongs. If the name ends in the word 'cost', remove that word. After
 * processing, the ID should be at the end of the string.
 * @param name The name of the field.
 * @return The ID of the quote to which the field belongs. If there is no
 * associated ID, return null.
 */
function getId(name) {
    var id = null, index = 1, tail;

    if (name.substring(name.length - 4) === "cost") {
        name = name.substring(0, name.length - 4);
    }

    while (index < name.length) {
        tail = name.substring(name.length - index);

        if (isNaN(tail)) {
            break;
        } else {
            id = parseInt(tail);
            index++;
        }
    }

    return id;
}

/**
 * Remove the given ID from the given field name. The ID is assumed to be at the 
 * end of the field name.
 * @param field The field name from which the ID is to be removed.
 * @param id The id that is to be removed.
 * @return The name of the field without the ID.
 */
function stripId(field, id) {
    id = id + ""; //convert id to string
	
    return field.substring(0, field.length - id.length);
}

/**
 * Return the value of a field on the form, given its name as it appears on the
 * form and the ID of the associated quote. This function is an abstraction,
 * allowing several different elements to be grouped together when retrieving
 * their values (most notably columns and text fields).
 * @param name The name of the field exactly as it appears on the form.
 * @param id The ID of the quote to which the field belongs.
 * @return The value of the element if it exists, null otherwise.
 */
function getValue(name, id) {
    var elem = $("#" + makeVar(name, id));
    
    if(elem === undefined) {
        alert("element undefined: " + name);
        return null;
    }
    
    //seems like this solves the issue...
    if(elem.nodeName === undefined && elem[0] !== undefined && elem[0].nodeName !== undefined) {
        elem = elem[0];
    } else {
        alert("Still undefined for " + name + " with id " + id);
        return null;
    }
    
    //apparently you need to do elem[0] to get the nodeName
    //JQuery is pretty stupid sometimes
    
    switch(elem.nodeName.toLowerCase()) {
        case "td" :
        case "label":
            return $(elem).text();
        default:
            return $(elem).val();
    }
} 

/**
 * Relic method, replaced by setField.
 * TODO remove references to this and delete
 */
function setLabel(name, val) {
    var label = document.getElementById(name);
    
    if(label === null) alert("Tried setting " + name);
    label.innerHTML = val;
}

/**
 * Sets a column, textarea, or label to a specified value.
 * NOTE: does not work for text fields.
 * @param name The name of the field as it appears on the quote.
 * @param value The value which should be assigned to the field.
 * @param id The quote ID to which the field belongs.
 */
function setField(name, value, id) {
    $("#" + makeVar(name, id)).html(value);
}

/**
 * Return true if the given item has a given attribute, false otherwise.
 * @param item The item as a JQuery DOM element.
 * @param attribute The attribute being check for, as a string.
 * @return True if item has attribute, False otherwise.
 */
function hasAttr(item, attribute) {
    return $(item).attr(attribute) !== undefined && $(item).attr(attribute) !== false;
}

/**
 * Return true if the source string(haystack) starts with needle.
 * @param needle The starting string.
 */
String.prototype.startsWith = function(needle) {
    return (this.indexOf(needle) === 0);
}