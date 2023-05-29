/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated August 3, 2011
 * 
 * *****************************************************************************
 * 
 * This file is a JQuery renderer of XML content. Some default conventions have
 * been established in the corresponding PHP file which renders XML content.
 * Together, these two files provide a framework to seemlessly bind the front
 * and back end by sending data using PHP.
 * 
 * NOTE: This file uses JQuery and there must be a JQuery library imported
 * ahead of it.
 * NOTE: This file uses methods defined in Helper and expects it as an import
 * 
 * XXX Switching to JSON is recommended after an upgrade to PHP5
 *
 * Legend (tags and translations)
 * Tag    | Description
 * ---------------------
 * parent | The wrapper around the XML content.
 * 
 * row    | The contents of a single row from the SQL table. 
 * 
 * field  | A field in the HTML document. Must have exactly one name tag and
 *        | one value tag.
 * 
 * link   | A link. Must have exactly one name tag and one href tag.
 * 
 * name   | The name assigned to the field/link/other. There should only be one
 *        | of these per tag.
 * 
 * value  | The value of a field. There should be exactly one of these per
 *        | field tag.
 * 
 * href   | The URL to which the link links. There should be exactly one of
 *        | these per link tag.
 * 
 * time   | The time.
 * 
 * count  | The number of rows.
 * 
 * area   | Defines a div. Has to have a name tag.
 * 
 ******************************************************************************/

/**
 * The class in charge of rendering XML templates into HTML.
 */
function TemplateRenderer () {
    
    /**
     * Render an XML template area into HTML and return it.
     * @param xml The xml for the area.
     * @param prototype True if this HTML is meant for copying 
     * (i.e. used as template), false if it will be unique.
     * @return JQuery object representing the template area.
     */
    this.renderArea = function(xml, prototype) {
        var area = $("<div></div>");
        var name, varName;
        var table, headings, row, headingType;
        var obj = this;
        
        if($(xml).find("name").length > 0) {
            name = $(xml).find("name").text().toString();
            varName = Helper.makeVar(name);
            
            if(prototype) {
                area.addClass(varName);
            } else {
                area.attr('id', varName);
            }
            
            //TODO maybe later stop using tables for layout
            table = $("<table></table>");
            
            if($(xml).hasAttr("headings")) {
                setProgress("Adding headings to table...");
                
                headingType = $(xml).attr("headings");
                
                switch(headingType) {
                    case "hourly":
                        headings = Render.HOURLY_HEADINGS;
                        break;
                    case "speed":
                        headings = Render.SPEED_HEADINGS;
                        break;
                    case "run":
                        headings = Render.RUN_HEADINGS;
                        break;
                    case "packaging":
                        headings = Render.PACKAGE_HEADINGS;
                        break
                    case "shipping":
                        headings = Render.SHIP_HEADINGS;
                        break;
                    default:
                        headings = new Array();
                        break;
                }
                
                row = $("<tr></tr>");
                
                $.each(headings, function() {
                    $(row).append($("<th></th>").append(this.toString()));
                });
                
                $(table).prepend($("<thead></thead>").append(row));
            }
            
            table = Render.addSubfields(xml, table, prototype);
            
            $(area).append(table);
        } else {
            setProgress("Key field not found", ProgressBar.ERROR);
        }
        
        return area;
    }
    
    /**
     * Render a full XML template into HTML and return the container.
     * @param xml The xml template.
     * @param prototype (Optional) True if this HTML is meant for copying 
     * (i.e. used as template), false if it will be unique.
     * @return JQuery object representing the div containing the template.
     */
    this.renderTemplate = function (xml, prototype) {
        var area;
        var obj = this;
        
        if(prototype !== true) {
            prototype = false;
        }
        
        //the container for everything
        setProgress("Creating div");
        var main = $("<div></div>");
        
        if($(xml).find("area").length > 0) {
            //add divider to top of div
            $(main).append($("<hr />"));
            
            $(xml).find("area").each(function(j){
                area = obj.renderArea(this, prototype);
                
                $(area).addClass("area" + (j % 2));
                
                $(main).append(area);
                
                //add divider after every area
                $(main).append($("<hr />"));
            });
        } else {
            setProgress("No areas found");
        }
        
        return main;
    }
}

/**
 * Load areas from an XML template file and add them to the source div.
 * @param xml The xml template.
 * @param source The html object to which the extracted content will be added.
 * @param prototype (Optional) XXX comment later
 */
function addAreas(xml, source, prototype) {
    if(prototype === undefined || prototype !== true) {
        prototype = false;
    }
    
    if($(source).length === 0) {
        return;
    }
    
    var obj = new TemplateRenderer();
    
    setProgress("Loading areas");
    var div = obj.renderTemplate(xml, prototype)
    
    setProgress("Adding areas");
    $(source).append(div);
    
    setProgress("Rendering template complete", ProgressBar.COMPLETE);
}


/**
 * TODO improperly named
 * Make a table, render the errors, and set various fields based on some search
 * results.
 * @param table The html table where the search results go.
 * @param xml The xml document containing the search results.
 * TODO maybe merge with render 
 * @param debug True if I want to debug.
 */
function makeTable(table, xml, debug) {
    //NOTE this is only called by search
    //also this is the only function that calls render search time
    
    //    setProgress("checking for errors");
    //    Render.renderErrors(xml);
    //    
    //    if(debug) {
    //        setProgress("Debugging");
    //        Render.showDebug(xml);
    //    }
    
    console.log("Here");
    
    //NOTE this is also the only function that calls render search numbers
    
    //TODO for now assume destination
    //    setProgress("Rendering numbers");
    //    Render.renderSearchNumbers(xml);
    
    setProgress("Rendering time");
    Render.renderSearchTime(xml);
    
    //NOTE also the only guy who calls render table
    
    console.log("Rendering table");
    
    setProgress("Rending table");
    Render.renderTable(table, xml);
}

/**
 * Namespace to not pollute static space.
 */
var Render = {
    
    /***************************************************************************
     * ********************** TABLE HEADINGS************************************
     **************************************************************************/
    
    /** 
     * Headings for hourly cost table.
     */
    HOURLY_HEADINGS: ["Field", "Number of Hours", "Cost"],
    /**
     * Headings for speed cost table. 
     **/
    SPEED_HEADINGS: ["Field", "Units per Hour", "Cost per M", "Cost"],
    /**
     * Headings for the run cost table.
     */
    RUN_HEADINGS: ["Field", "Sheets per Hour", "Cost per M", "Cost"],
    /**
     * Headings for the packaging table.
     */
    PACKAGE_HEADINGS: ["Field", "Cost per Thousand", "Cost"],
    /**
     * Headings for the shipping table.
     */
    SHIP_HEADINGS: ["Field", "Sheets per Skid", "Cost"],
    
    
    
    CLASS_FIELD: 0,
    ID_FIELD: 1,
    
    /**
     * Render a field depending on the method.
     * The method specifies "class" or "id", which is the defining factor
     * of finding the right place to put the data. Optional, defaults to
     * CLASS_FIELD.
     * @param xml The xml document.
     * @param method The method of rendering. Optional.
     * @param className The name of the class. Only required when method is CLASS_FIELD.
     */
    renderField: function (xml, method, className) {
        var name, val;
        
        if(method === undefined || method === null || method !== this.ID_FIELD) {
            method = this.CLASS_FIELD;
        }
        
        if(className === undefined || className === null || className === "") {
            className = "r0";
        }
        
        $(xml).find("field").each(function() {
            
            if($(this).find("name").length !== 1 || 
            $(this).find("value").length !== 1) {
                console.log("Skipping incorrect XML field");
                return true;
            }
            
            name = $(this).find("name").text();
            
            val = unescape($(this).find("value").text()).replace(/\+/g, " ");
            setProgress("Field " + name + " has value " + val);
            
            var item = "";
            
            if(method === Render.ID_FIELD) {
                item = $("#" + name);
            } else {
                item = $("." + className).find("." + name);
            }
            
            if($(item).length === 0) {
                setProgress("Could not find html element with name " + name + ", skipping");
            } else {
                if(item.get(0).nodeName.toLowerCase() === "span") {
                    $(item).html(val);
                } else {
                    $(item).val(val);
                }
                
                try {
                    $(item).change();
                } catch (err) {
                    //TODO when does this happen and how do I fix it?
                    console.log(err);
                }
                
            }
            
            return true; //so IDE shuts up
        });
    },
    
    /**
     * Defines tags for the time.
     */
    SEARCH_TIME: [{
        name: "time",
        xmlTag: "time",
        htmlTag: "searchTime"
    }],
    
    renderSearchTime: function(xml) {
        var i = 0, obj, oldVal, newVal;
        
        for(i = 0; i < Render.SEARCH_TIME.length; i++) {
            obj = Render.SEARCH_TIME[i];
            
            setProgress("Processing " + obj.name);
            
            if ($(xml).find(obj.xmlTag).length === 1) {
                newVal = $(xml).find(obj.xmlTag).text();
                
                if(newVal === undefined || newVal === null || newVal === ""
                    || isNaN(newVal)) {
                    newVal = 0.0;
                } else {
                    newVal = parseFloat(newVal);
                }
            } else {
                setProgress("Unable to find " + obj.name + "in xml, moving on");
                continue;
            }
            
            if($("#" + obj.htmlTag).length === 1) {
                oldVal = $("#" + obj.htmlTag).text();
                
                if(newVal === undefined || newVal === null || newVal === ""
                    || isNaN(newVal)) {
                    setProgress("Could not load previous value for " + obj.name);
                //assume 0
                } else {
                    newVal += parseFloat(oldVal);
                }
                
                $("#" + obj.htmlTag).text(newVal);
            } else {
                setProgress("Unable to find html container for " + obj.name);
            }
        }
    },
    
    /**
     * A very convoluted way to avoid an even more convoluted system of
     * switch statements.
     * This is an array of objects. Each object is a reference to a search
     * number that needs to be processed.
     */
    SEARCH_NUMBERS: [
    {
        name: "numRows", 
        xmlTag: "count", 
        htmlTag: "numRows"
    },
        
    {
        name: "numResults",
        xmlTag: "numresults",
        htmlTag: "numResults"
    }
    ],
    
    /**
     * Render some numbers from the search.
     * @param xml The xml document containing the search results.
     * TODO don't treat every field as float
     */
    renderSearchNumbers: function(xml) {
        var i, oldVal, newVal, obj;
        
        for(i = 0; i < Render.SEARCH_NUMBERS.length; i++) {
            obj = Render.SEARCH_NUMBERS[i];
            
            setProgress("Processing " + obj.name);
                
            if ($(xml).find(obj.xmlTag).length === 1) {
                newVal = $(xml).find(obj.xmlTag).text();
                
                if(newVal === undefined || newVal === null || newVal === ""
                    || isNaN(newVal)) {
                    newVal = 0;
                } else {
                    newVal = parseInt(newVal);
                }
            } else {
                setProgress("Unable to find " + obj.name + " in xml, moving on");
                continue;
            }
            
            if($("#" + obj.htmlTag).length === 1) {
                oldVal = $("#" + obj.htmlTag).text();
                
                if(newVal === undefined || newVal === null || newVal === ""
                    || isNaN(newVal)) {
                    setProgress("Could not load previous value for " + obj.name);
                } else {
                    newVal += parseFloat(oldVal);
                }
                
                $("#" + obj.htmlTag).text(newVal);
                setProgress("Setting " + obj.htmlTag + " to " + newVal);
            } else {
                setProgress("Unable to find html container for " + obj.name);
            }
        }
    },
    
    /**
     * These are the subfields which will be rendered. Other subfields will be
     * ignored. The subfields are also rendered in the order they are put
     * in this array.
     */
    ACTIVE_SUBFIELDS : ["textfield", "dropdown", "output", "textarea", "total"],
    
    /**
     * Render debug messages in the progress pane. Alert when there are no 
     * debug messages, and alert after every debug message.
     */
    showDebug: function(xml) {
        if($(xml).find("debug").length === 0) {
            console.log("No debug messages");
        }
        
        $(xml).find("debug").each(function() {
            console.log("Found debug message - " + $(this).text());
        });
    },
    
    /**
     * Add rows to the given table. Rows are extracted from the given XML
     * template.
     * @param xml The xml template.
     * @param table The parent table.
     * @param prototype True if this HTML is meant for copying 
     * (i.e. used as template), false if it will be unique.
     * TODO maybe don't use table to facilitate layout.
     */
    addSubfields : function (xml, table, prototype) {
        var label, row, name, varName, elem, cost;
        
        setProgress("Rendering subfields");
        var body = $("<tbody></tbody>");        
        
        //iterate through all recognizable tags
        $.each(Render.ACTIVE_SUBFIELDS, function(i) {
            $(xml).find(Render.ACTIVE_SUBFIELDS[i]).each(function() {
                name = $(this).text().toString();
                varName = makeVar(name);
                
                row = $("<tr></tr>");
                
                label = $("<td></td>")
                .append(Render.addCaption(name + ":", varName));
                
                elem = $("<td></td>")
                .append(Render.renderElement(Render.ACTIVE_SUBFIELDS[i], this, prototype));
                
                row.append(label).append(elem);
                
                //--- start extra columns ---
                
                cost = $(this).attr("perM");
                
                //TODO use hasAttr here
                if (typeof cost !== 'undefined' && cost !== false && 
                    cost === "true") {
                    elem = Render.addExtraColumn("perM", varName);
                    row.append(elem);
                }
                
                cost = $(this).attr("cost");
                
                //TODO use hasAttr here
                if (typeof cost !== 'undefined' && cost !== false && 
                    cost !== "false" && cost !== "none" && cost !== "total") {
                    elem = Render.addExtraColumn("cost", varName);
                    row.append(elem);
                }
                
                //--- end extra columns ---
                
                $(body).append(row);
                
                return true; //continue, to make IDE shut up
            });
        });
        
        return $(table).append(body);
    },
    
    /**
     * Create and return a column of the given type. Return an empty column
     * if the type is unknown or improperly set.
     * @param type The type of column to make.
     * @param baseName The root name from which this column comes.
     * @return The column.
     */
    addExtraColumn: function(type, baseName) {
        var inputField = Render.renderTextfield("$0.00");
        $(inputField).attr("readonly", "readonly");
        
        switch(type) {
            case "cost":
                $(inputField).addClass("cost")
                .addClass("costField")
                .addClass(baseName)
                .attr("name", baseName + "_Cost[]");
                break;
            case "perM":
                $(inputField).addClass("perM")
                .addClass("costField")
                .addClass(baseName)
                .attr("name", baseName + "_PerM[]");
                break;
            default:
                //do nothing
                break;
        }
        
        var col = $("<td></td>").append(inputField);
        
        return col;
    },
    
    /**
     * Create and return a new text field. Set the value to the given default
     * value and add the classes given in classArray, where each element is
     * a distinct class.
     * @param defaultVal The default value for this text field.
     * @return The text field.
     */
    renderTextfield: function(defaultVal) {
        var elem = $("<input></input>").attr("type", "text")
        .addClass("input").val(defaultVal);
            
        return elem;
    },
    
    /**
     * Create and return a new dropdown list. Set the value to the given
     * default value and add the classes given in classArray, where each item
     * is a distinct class.
     * @param defaultVal The default value for this dropdown list.
     * @param name The name of the dropdown list.
     * @return A dropdown list.
     */
    renderDropdown: function(defaultVal, name) {
        if(defaultVal === "") {
            defaultVal = "--- PLEASE SELECT A " + name.toUpperCase() + " ---";
        }
        
        var elem = $("<select></select>")
        .append($("<option value=''></option>")
            .text(defaultVal));
            
        return elem;
    },
    
    /**
     * Create and return an HTML caption with the given name, and targetting
     * the given object.
     * @param captionText The text appearing in the caption.
     * @param targetObjName The name of the object that the caption is captioning.
     * @return The caption.
     */
    addCaption: function(captionText, targetObjName) {
        var elem = $("<label></label>").attr("for", targetObjName)
        .text(captionText);
                    
        return elem;
    },
    
    /**
     * Render an individual, base element. Base elements do not have sub-nodes.
     * @param tag The xml tag of the element to be rendered.
     * @param xml The xml document which contains the given tag.
     * TODO handle cases where tag is a child node of xml or is not contained
     * at all
     * @param prototype (optional) true to set the name as class, false to set as id.
     * Defaults to false
     */
    renderElement: function (tag, xml, prototype) {
        if(prototype !== true) {
            prototype = false;
        }
        
        var elem = null, nullVal = "";
        var id = makeVar($(xml).text().toString(), "");
        
        nullVal = $(xml).attr("default");
        
        //TODO replace with hasAttr
        if (typeof nullVal !== 'undefined' && nullVal !== false) {
            nullVal = $(xml).attr("default");
        } else {
            nullVal = "";
        }
        
        switch(tag) {
            case "textfield":
                var cost = $(xml).attr("cost");
        
                //TODO replace with hasAttr
                if (typeof cost !== 'undefined' && cost !== false && cost !== "none"
                    && cost !== "false") {
                    cost = $(xml).attr("cost");
                } else {
                    cost = "";
                }
                
                elem = Render.renderTextfield(nullVal);
                $(elem).addClass(cost);
                
                break;
            case "total":
                if(nullVal === "") {
                    nullVal = "$0.00";
                }
                
                elem = Render.renderTextfield(nullVal);
                $(elem).attr("readonly", "readonly").addClass("total")
                .addClass("costField");
                
                break;
            case "output":
                
                elem = Render.renderTextfield(nullVal);
                $(elem).attr("readonly", "readonly").addClass("costField");
                break;
            case "dropdown":
                elem = Render.renderDropdown(nullVal, $(xml).text().toString());
                
                break;
            case "textarea":
                elem = $("<textarea></textarea>")
                .html(nullVal);
                
                if($(xml).hasAttr("display")) {
                    $(elem).addClass($(xml).attr("display").toString());
                }
                
                break;
        }
        
        if(prototype) {
            $(elem).addClass(id).attr("name", id + "[]");
        } else {
            $(elem).attr("id", id).attr("name", id);
        } 
        
        return elem;
    },
    
    /** 
     * Render a template simlution provided by the backend.
     * @param xml The xml template
     * @param rowName The class used in conjunction with a number to 
     * uniquely identify the rows.
     */
    renderRows: function(xml, rowName) {
        console.log("Rendering rows...");
        
        $(xml).find("row").each(function(i) {
            var className = rowName.toString() + i;
            
            if($("." + className).length > 0) {
                Render.renderField(this, Render.CLASS_FIELD, className);
                console.log("done row " + className);
            } else {
                setProgress("Could not find " + className + ", continuing...");
                console.log("Could not find " + className + ", continuing...");
            }
        });
    },
    
    /**
     * Render a table based on returned xml.
     * @param table The html table into which the results are inserted.
     * @param xml The xml document containing the table contents.
     * TODO maybe have the xml return the whole table and extract the table
     * itself as needed.
     * TODO change this to be a bit more general.
     */
    renderTable: function(table, xml) {
        var row, text, name, numRows;
        setProgress("Rendering table");
        
        if ($(xml).find("row").length == 0) {
            setProgress("Did not find any rows.")
        } else {
            setProgress("Found rows");
        }
        
        $(xml).find("row").each(function(i) {
            setProgress("Parsing row " + i);
            
            if($(this).find("field").length === 0) {
                setProgress("Found no columns in row " + i);
                return true; //continue
            }
            
            row = $("#searchRowPrototype").clone().show()
            .attr("id", "searchRow" + i)
            .addClass("searchRow" + (i % 2));
            
            $("#searchRowPrototype").before(row);
            
            $(this).find("field").each(function(j) {
                setProgress("Parsing field " + j);
                
                if($(this).find("name").length !== 1 || 
                    $(this).find("value").length !== 1) {
                    setProgress("Found invalid field, skipping.");
                    return true;
                }
                
                name = $(this).find("name").text();
                text = $(this).find("value").text();
                
                console.log("found field " + name + " with value " + text);
                row.find("." + name).text(text);
                
                //add the row
                
                return true; //makes IDE shut up
            });
            
            $(this).find("action").find("link").each(function() {
                if($(this).find("name").length !== 1 || $(this).find("href").length !== 1) {
                    return true;
                }
                
                row.find(".Action")
                .append($("<a></a>")
                    .attr("href", $(this).find("href").text())
                    .html($(this).find("name").text()))
                .append($("<br />"));
                
                return true;
            });
            
            return true; //make IDE shut up
        });
        
        setProgress("Finished adding rows");
        return table;
    }
};