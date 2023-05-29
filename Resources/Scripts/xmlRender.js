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
            varName = makeVar(name);
            
            if(prototype) {
                area.addClass(varName);
            } else {
                area.attr('id', varName);
            }
            
            //TODO maybe later stop using tables for layout
            table = $("<table></table>");
            
            if(hasAttr(xml, "headings")) {
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
            //$(main).append($("<hr />"));
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
    
    
    //NOTE this is also the only function that calls render search numbers
    
    //TODO for now assume destination
    //    setProgress("Rendering numbers");
    //    Render.renderSearchNumbers(xml);
    
    setProgress("Rendering time");
    Render.renderSearchTime(xml);
    
    //NOTE also the only guy who calls render table

    
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
     * These headers were removed to save space.
     */
    HOURLY_HEADINGS: ["", "", ""],
    //    HOURLY_HEADINGS: ["Field", "Number of Hours", "Cost"],
    /**
     * Headings for speed cost table. 
     * These headers were removed to save space.
     **/
    SPEED_HEADINGS: ["", "", "", ""],
    //        SPEED_HEADINGS: ["Field", "Units per Hour", "Cost per M", "Cost"],
    /**
     * Headings for the run cost table.
     */
    RUN_HEADINGS: ["Field", "Sheets per Hour", "M", "Cost"],
    /**
     * Headings for the packaging table.
     */
    PACKAGE_HEADINGS: ["", "", ""],
    //    PACKAGE_HEADINGS: ["Field", "Cost per Thousand", "Cost"],
    /**
     * Headings for the shipping table.
     * These headers were removed to save space.
     */
    SHIP_HEADINGS: ["", "", ""],
    //        SHIP_HEADINGS: ["Field", "Sheets per Skid", "Cost"],
    
    
    
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
            
            if($(this).find("name").length !== 1) {
                setProgress("Skipping field with no name");
                return true;
            }
            
            //XXX maybe parse the name with makeVar?
            name = $(this).find("name").text();
            setProgress("Found field with name " + name);
            
            if($(this).find("value").length !== 1) {
                setProgress("Skipping field " + name + " with no value");
                return true;
            }
            
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
    ACTIVE_SUBFIELDS : ["textfield", "dropdown", "dropdown2", "output", "textarea", "total", "checkbox"],
    

    
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
                varName = makeVar(name, "");
                
                row = $("<tr></tr>");
                
                label = $("<td></td>").append($("<label></label>")
                    .attr("for", varName)
                    .text(name + ":"));
                

                
                //If the field to be rendered at drop down menus,
                // they need to be in columns to save space.
                if (Render.ACTIVE_SUBFIELDS[i] == "dropdown2") {
                                    
                    // Add a cell to the row for each option (a subfield of downdown)
                    $(xml).find("option").each(function() {
                                        
                        elem = $("<td></td>")
                        .append(Render.renderElement(Render.ACTIVE_SUBFIELDS[i], this, prototype));
                        row.append(elem);
                    })
                                    
                //Otherwise, add a cell to the row
                } else {
                    elem = $("<td></td>")
                    .append(Render.renderElement(Render.ACTIVE_SUBFIELDS[i], this, prototype));
                    row.append(label).append(elem);
                }

                //-- add extra columns to the row
                
                //add perM column where necessary
                
                cost = $(this).attr("perM");
                
                if (typeof cost !== 'undefined' && cost !== false && 
                    cost === "true") {
                    
                    elem = $("<td></td>").append(
                        $("<input></input>").attr("type", "text")
                        .addClass("costField")
                        .attr("readonly", "readonly")
                        .addClass(varName)
                        .addClass("perM").val("$0.00")
                        .attr("name", varName + "_PerM[]"));
                    
                    row.append(elem);
                }
                
                //-- add cost column where necessary
                
                cost = $(this).attr("cost");
                
                if (typeof cost !== 'undefined' && cost !== false && 
                    cost !== "false" && cost !== "none" && cost !== "total") {
                    
                    elem = $("<td></td>").append(
                        $("<input></input>").attr("type", "text")
                        .addClass("costField")
                        .attr("readonly", "readonly")
                        .val("$0.00").addClass("cost")
                        .addClass(varName)
                        .attr("name", varName + "_Cost[]"));
                        
                    row.append(elem);
                }
                
                //--- end adding extra columns to row
                
                $(body).append(row);
                
                return true; //continue, to make IDE shut up
            });
        });
        
        return $(table).append(body);
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
        
        if (typeof nullVal !== 'undefined' && nullVal !== false) {
            nullVal = $(xml).attr("default");
        } else {
            nullVal = "";
        }
        
        switch(tag) {
            case "textfield":
                var cost = $(xml).attr("cost");
        
                if (typeof cost !== 'undefined' && cost !== false && cost !== "none"
                    && cost !== "false") {
                    cost = $(xml).attr("cost");
                } else {
                    cost = "";
                }
                
                elem = $("<input></input>").attr("type", "text")
                .addClass("input").val(nullVal).addClass(cost);
                break;
            case "total":
                if(nullVal === "") {
                    nullVal = "$0.00";
                }
                
                elem = $("<input></input>").attr("type", "text").addClass("costField")
                .attr("readonly", "readonly").val(nullVal).addClass("total");
                break;
            case "output":
                elem = $("<input></input>").attr("type", "text").addClass("costField")
                .attr("readonly", "readonly").val(nullVal);
                break;
            case "dropdown":
                if(nullVal === "") {
                    nullVal = "---SELECT " + ($(xml).text() + "").toUpperCase() + " ---";
                }
                
                elem = $('<select class="general"></select>')
                .append($("<option value=''></option>")
                    .text(nullVal));
                break;
            case "dropdown2":
                if(nullVal === "") {
                    nullVal = "---SELECT " + ($(xml).text() + "").toUpperCase() + " ---";
                }
                
                elem = $('<select class="general"></select>')
                .append($("<option value=''></option>")
                    .text(nullVal));
                break;
            case "textarea":
                elem = $("<textarea></textarea>")
                .html(nullVal);
                
                if(hasAttr(xml, "display")) {
                    $(elem).addClass($(xml).attr("display"));
                }
                
                break;
            case "checkbox":
                elem = $("<input type=\"checkbox\"></input>")
                .html(nullVal);
                
                if(hasAttr(xml, "display")) {
                    $(elem).addClass($(xml).attr("display"));
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
        $(xml).find("row").each(function(i) {
            var className = rowName.toString() + i;
            if($("." + className).length > 0) {
                Render.renderField(this, Render.CLASS_FIELD, className);
               
            } else {
                setProgress("Could not find " + className + ", continuing...");
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
                   
                row.find("." + name).text(text);
                
                //add the row
                
                return true; //makes IDE shut up
            });

            /*
                 * Find the field element, find the link element.
                 * Add to the Docket_number the link with url and name from
                 * the xml. This adds a link from the docket number to the
                 * production page.
                 **/
            $(this).find("docket").find("link").each(function() {

                row.find(".Docket_Number")
                .append($("<a></a>")
                    .attr("href", $(this).find("href").text())
                    .html($(this).find("name").text()));
                return true;
            });
            
            /*
                 * Find the field element, find the link element.
                 * Add to the quote_number the link with url and name from
                 * the xml. This adds a link from the docket number to the
                 * production page.
                 **/
            $(this).find("quote").find("link").each(function() {

                row.find(".Quote_Number")
                .append($("<a></a>")
                    .attr("href", $(this).find("href").text())
                    .html($(this).find("name").text()));
                return true;
            });
            
            /*
                 * The XML has been generated. For the "action" elements, create the
                 * html needed to render the table. In particular, the following lines
                 * generate the "action" column. 
                 */
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
    },
    /**
     * Render the Shipment History Forms with the given XML.
     * Fill the Tables by SessId and the tables' rows by SlipId
     * @param xml The xml represnting the delivery slip information
     * generated by summaryHelper.
     */
    renderShipmentHistory: function(xml) {
        $(xml).find("SessId").each(function() {
            Render.renderSlip(this);
            var SessId = $(this).attr("value");
            Render.renderSlipHistory($(this).find("slipHistory"), SessId);
            Render.renderTime($(this).find("slip"), SessId);
            //$("input#SessId").val(SessId);
        });
    },
    
    /**
     * Render the given XML representing one delivery slip
     */
    renderSlip: function(xml) {
        var SessId = $(xml).attr("value");
        $(xml).find("row").each(function() {
            Render.renderForm(this, SessId);
            
        });
    },
    
    /**
     * Given the XML respresenting a slip, extract the status
     * info and populate the slip with the data.
     */
    renderTime: function(xml, SessId) {
        
        $(xml).find("field").each(function() {
            
            var name = $(this).find("name").text();
            var value = $(this).find("value").text();
            if (value != "null") {
            $(".slipTable" + SessId + " ." + name).html(value);
            }
            if (name == "timeOut" && value != "null") {
                $(".slipTable" + SessId + " .ship").removeClass("ship").addClass("shipDone");
            }
        });
    },
    
    /**
     * Given the XML representing a slip, extract the misc
     * pieces of information that corresponds to it.
     * Specifically, labels and ShippingAddress.
     * Populate the slip with the corresponding SessId.
     * @param xml The xml with the slip information
     * @param SessId The session id correpsonding to the slip being populated.
     */
    renderSlipHistory: function(xml, SessId) {
        $(xml).find("field").each(function() {
            var field = $(this).find("name").text();
            var value = $(this).find("value").text();
            if (value != "") {
                
                $(".slipTable" + SessId + " ." + field).html(value);
            }
        })
    },
    
    /**
     * Given the XML representing a form within a slip
     * and the Slip number, populate the page with data
     * in the xml.
     */
    renderForm: function(xml, SessId) {
        var slipId = $(xml).attr("value");
        var tagTarget = ".slipTable" + SessId + " tr.form" + slipId
        $(xml).find("field").each(function() {
            var name = $(this).find("name").text();
            var value = $(this).find("value").text();
            // .val is for inputs
            // .html is for spans?
            switch(name) {
                case "Form":
                    $(tagTarget + " .FormHistory").val(value);
                case "Type":
                    $(tagTarget + " .Type").val(value).change();                    
                case "Qty":
                    $(tagTarget + " .Qty").val(value);
                case "Ctns":
                    $(tagTarget + " .Ctns").val(value);
                case "NoOfSheets":
                    $(tagTarget + " .NoOfSheets").val(value);
                case "Number_of_Skids":
                    $(tagTarget + " .Number_of_Skids").val(value);
                case "Notes":
                    $(tagTarget + " .Notes").val(value);
                case "Part":
                    $(tagTarget + " .Part").val(value);
                case "NoOfPcs":
                    $(tagTarget + " .NoOfPcs").val(value);
                    
            }
        });
    }
};