
/*******************************************************************************
 * Governs the javascript events/event-handling for the production page.   
 * 
 * NOTE: uses JQuery
 * -------------------------------------------------------------------------
 * Written by Daniel Kats for Alternative Die Cutting, Inc.                                      
 * Updated July 12, 2011                                                      
 *                                                                         
 ******************************************************************************/

/** Namespace for production functions. */
var Production = {
    
    LOCKED_FIELDS: {
        name: ""
    },
    
    NUM_ACTIVE_FORMS: 0,
    
    TOTAL_NUM_FORMS: 0,
    
    DOCKET_NUMBER: -1,
    
    update: function() {
        if(this.NUM_ACTIVE_FORMS === 0) {
            $("#formTable").hide();
            $("#removeAllFormsButton").attr("disabled", "disabled");
            this.toggleLastRule(false);
        } else {
            $("#formTable").show();
            $("#removeAllFormsButton").removeAttr("disabled");
            this.toggleLastRule(true);
        }
        
        $("#numForms").val(this.NUM_ACTIVE_FORMS);
    },
    
    updateQty: function() {
        var cost = 0;
        
        $(".formRow.live").find(".Qty").each(function() {
            if($(this).val().toString() !== "" && !isNaN($(this).val())) {
                cost += parseInt($(this).val());
            }
        });
        
        $("#qty").val(cost);
    },
    
    /** 
     * Prepare the form for the work order, then submit the form. 
     * TODO these preparing functions are basically all the same,
     * they can be merged. If the print parameter is passed, submit
     * yes for the print input so that workorder.php will print the page.
     **/
    showWorkOrder: function(print) {
        $(".prototype").find("input").attr("disabled", "disabled");
        $(".prototype").find("select").attr("disabled", "disabled");
        if (print) {
            $("input").find("print").attr("value", "yes");
            console.log("printed");
        }
        $("form").submit();
        
        //remove disabled attribute so forms that are generated after
        //submit will not be readonly
        
        $(".prototype").find("input").removeAttr("disabled");
        $(".prototype").find("select").removeAttr("disabled");
    },
    
    /** Add relevant events to the buttons in the form container. */
    addEvents: function() {
        var obj = this;
        
        $("#addFormButton").click(function() {
            obj.addForm();
        });
        
        $("#removeAllFormsButton").click(function() {
            $(".removeFormButton").each(function() {
                $(this).click(); 
            });
            
            Production.update();
        });
        
        $("#saveButton").click(function() {
            if(Production.save()) {
                setProgress("Successfully saved data", ProgressBar.COMPLETE);
            } else {
                setProgress("Could not save data", ProgressBar.ERROR);
            }
        });
        
        $("#genFormsButton").click(function() {
            var foo = $("#numForms").val().toString();
            
            if(foo === "" || isNaN(foo)) {
                foo = 0;
            } else {
                foo = parseInt(foo);
            }
            
            if(foo < obj.NUM_ACTIVE_FORMS) {
                alert("You cannot delete forms this way"); 
            } else {
                while(foo > obj.NUM_ACTIVE_FORMS) {
                    obj.addForm();
                }
            } 
        });
    },
    
    addForm: function() {
        var temp = Production.TOTAL_NUM_FORMS;
            
        var row = $(".formRow.prototype").clone().show()
        .addClass("r" + temp).removeClass("prototype").addClass("live")
        .appendTo("#formTable");
            
        $(row).find(".Qty").change(function() {
            obj.updateQty();
        });
            
        $(row).find(".removeFormButton").click(function() {
            $(".formRow.r" + temp).remove();
            Production.NUM_ACTIVE_FORMS--;
            Production.update();
        });
            
        Production.NUM_ACTIVE_FORMS++;
        Production.TOTAL_NUM_FORMS++;
            
        Production.update();
    },
    
    /** 
     * Hacky way to show/hide the last hr based on number of forms.
     * @param visible True to show the last hr, false to hide it.
     */
    toggleLastRule: function (visible) {
        var len = $("#formContainer").find("hr").length;
        
        $("#formContainer").find("hr").each(function(i) {
            if(i === len - 1) {
                if(visible) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        });
    },
    
    /** Save the data on the form. Erase previous data. */
    save: function() {
        var foundError = false;
        
        $.ajax({
            url: "Resources/productionHelper.php",
            type: "POST",
            async: false,
            data: {
                type: "save",
                DocketNumber: Production.DOCKET_NUMBER,
                saveData: $("form").serialize()
            },
            error: function() {
                foundError = true;
            }
        });
        
        
        //copy the information succinctly, then... WHAM!
        
        return !foundError;
    },
    
    /** Prepare for the forms */
    loadForms: function(xml) {
        var numRows = $(xml).find("row").length;
        
        for(; numRows > 0; numRows--) {
            $("#addFormButton").click();
        }
    },
    
    /** Main function. Prepare the page by loading all resources */
    launch: function() {
        var foundError = false;
        
        $("#contentPane").hide();
        //TODO have a loading wheel thing
        
        setProgress("Parsing arguments...");
        var args = this.getArguments();
        
        setProgress("Parsing docket number...");
        
        if(args["DocketNumber"] === undefined || args["DocketNumber"] === null 
            || args["DocketNumber"] === "" || isNaN(args["DocketNumber"])) {
            setProgress("Could not parse the docket number", ProgressBar.ERROR);
            return;
        }
        
        this.DOCKET_NUMBER = parseInt(args["DocketNumber"]);
        
        setProgress("Loading header...");
        $.ajax({
            url: "Resources/shipping_header.xml",
            dataType: "xml",
            async: false,
            success: function(xml) {
                setProgress("Parsing header");
                addAreas(xml, "#header");
            },
            error: function() {
                foundError = true;
            }
        });
        
        if(foundError) {
            setProgress("Could not load header", ProgressBar.ERROR);
            return;
        }
        
        setProgress("Hiding models...");
        $(".prototype").each(function(){
            $(this).hide();
        });
        
        setProgress("Adding events to forms...");
        this.addEvents();
        
        setProgress("Loading resources from database...");
        
        if(!this.loadResources(this.DOCKET_NUMBER)) {
            setProgress("Could not load docket information from database", ProgressBar.ERROR);
            return;
        }
        
        this.update();
        this.updateQty();
        
        setProgress("Loading Complete", ProgressBar.COMPLETE);
        $("#contentPane").show();
    },
    
    /** 
     * Load the resources and perform relevant actions
     * with them. If resource loads successfully return true. Return false
     * othewise.
     * @param docketNumber (required only for docket_login_data)
     * @return True if data was successfully retrieved, false otherwise.
     */
    loadResources: function(docketNumber) {
        var foundError = false;
        
        setProgress("Loading customers...")
        
        $.ajax({
            url: "Resources/productionHelper.php",
            dataType: "html",
            type: "POST",
            data: {
                type: "customer_list"
            },
            async: false,
            error: function() {
                foundError = true;
            },
            
            success: function(html) {
                setProgress("Loaded customers, adding to form...")
                $("#Customer").append(html);
            }
        });
        
        setProgress("Loading docket information...");
        
        $.ajax({
            url: "Resources/productionHelper.php",
            dataType: "xml",
            async: false,
            type: "POST",
            data: {
                type: "docket_login_data",
                DocketNumber: docketNumber
            },
            error: function() {
                foundError = true;
            },
            success: function(xml) {
                setProgress("Preparing page for forms...");
                Production.loadForms(xml);
                setProgress("Adding forms to page...")
                Render.renderRows(xml, "r");
                setProgress("Adding loaded data to page...");
                Render.renderField(xml, Render.ID_FIELD);
            }
        });
        
        //TODO add functionality
         
        return !foundError;
    },
    
    /**
     * Return an associative array of key-value pairs that represent the GET
     * arguments. If there are no arguments, return an empty array.
     * TODO put this into a general resource file.
     */
    getArguments: function() {
        var foo, bar, i, argstrings;
        var args = new Array();
        
        foo = window.location.href.split("?");
        
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