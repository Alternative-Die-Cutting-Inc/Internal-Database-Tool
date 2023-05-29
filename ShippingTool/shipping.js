
/*******************************************************************************
 * Governs actions for the shipping page.
 * 
 * NOTE: uses JQuery
 *
 * Written by Daniel Kats for Alternative Die Cutting, Inc.     
 * Updated 14-Jul-2011                                                               
 *                                                                        
 ******************************************************************************/

/** Namespace for shipping */
var Shipping = {
    /** Number of forms inserted since last load. Used for unique naming */
    TOTAL_NUM_FORMS: 0,
    
    /** Number of forms currently showing */
    NUM_ACTIVE_FORMS: 0,
    
    /** The docket number. Starts out as -1. */
    DOCKET_NUMBER: -1,
    
    /** 
     * Prepare the page and load all necessary resources. Bind
     * all JQuery events.
     */
    launch: function () {
        $("#contentPane").hide();
        
        setProgress("Parsing arguments...");
        var args = this.getArguments();
        
        setProgress("Parsing docket number...");
        
        if(args["DocketNumber"] === undefined || args["DocketNumber"] === null 
            || args["DocketNumber"] === "" || isNaN(args["DocketNumber"])) {
            setProgress("Could not parse the docket number", ProgressBar.ERROR);
            return;
        } else {
            this.DOCKET_NUMBER = args["DocketNumber"];
        }
        
        setProgress("Preparing page...");
        
        if(!this.preparePage()) {
            setProgress("ERROR: key resource missing", ProgressBar.ERROR);
            return;
        }
        
        setProgress("Loading forms...");
        
        if(!this.loadResources(this.DOCKET_NUMBER)) {
            setProgress("Could not load database data ", ProgressBar.ERROR);
            return;
        }
        
        setProgress("Generating shipping forms...");
        this.copyFormNames();
        
        setProgress("Parsing loaded info...");
        
        $(".loadedInfo").each(function() {
            $(this).find("input").each(function() {
                $(this).attr("readonly", "readonly");
            });
            
            $(this).find("")
        });
        
        $("#contentPane").show();
        setProgress("Loading complete", ProgressBar.COMPLETE);
    },
    
    /** 
     * Copy the form names from the table of pre-loaded forms to the 
     * shipping forms.
     */
    copyFormNames: function () {
        var numForms = $(".formRow.live").length, i = 0;
        var names = new Array();
        
        for(; i < numForms; i++) {
            $("#addFormButton").click();
        }
        
        i = 0;
        
        $(".formRow.live").each(function() {
            names[i++] = $(this).find(".Form").val(); 
        });
        
        for(i = 0; i < names.length; i++) {
            $(".shippingForm.live.r" + i).find(".Form").val(names[i]);
        }
    },
    
    /**
     * Bind all JQuery events to buttons, and load all XML documents.
     * Make sure the page is ready to render the database data.
     */
    preparePage: function() {
        var foundError = false;
        
        setProgress("Loading production header...");
        
        $.ajax({
            url: "Resources/shipslip_header.xml",
            dataType: "xml",
            async: false,
            success: function(xml) {
                setProgress("Rendering production pane...");
                addAreas(xml, "#productionOrderInfo");
            },
            error: function() {
                foundError = true;
            }
        });
        
        setProgress("Hiding models...");
        
        $(".prototype").each(function() {
            $(this).hide();
        });
        
        setProgress("Adding events...");
        this.addEvents();
        
        return !foundError;
    },
    
    /**
     * Show or hide the text area for the optional shipping address depending
     * on the user's choice of radio buttons.
     * @param visible True to show the text area, false otherwise. Optional,
     * defaults to false.
     */
    toggleShippingAddress: function(visible) {
        if(visible === undefined || visible === null || visible !== true) {
            visible = false;
        }
        
        var foo = $("#Shipping_Address");
        
        if($(foo).length > 0) {
            if(visible) {
                $(foo).show();
            } else {
                $(foo).hide();
            }
        }
    },
    
    /**
     * Toggle the type for a given form.
     * @param row The row identity number of the form.
     * @param type The new type for that form.
     */
    toggleType: function(row, type) {
        var container = $(".shippingForm.r" + row);
        
        if($(container).length > 0) {
            $(container).find(".formOpt").each(function() {
                $(this).hide();
            });
            
            $(container).find("." + type).show();
        }
    },
    
    /**
     * Bind all JQuery events to appropriate items.
     */
    addEvents: function () {
        $("#addFormButton").click(function() {
            var rule = $("<hr />").appendTo("#formContainer");
            
            var temp = Shipping.TOTAL_NUM_FORMS;
            
            var row = $(".shippingForm.prototype").clone().show()
            .removeClass("prototype").addClass("live")
            .addClass("r" + temp)
            .appendTo("#formContainer");
            
            //--- form type event ---
            var select = $(row).find(".formType");
            
            $(select).change(function() {
                Shipping.toggleType(temp, $(this).val());
            });
            
            $(select).change();
            
            //--- end form type event ---
            
            $(row).find(".removeFormButton").click(function() {
                $(row).remove();
                $(rule).remove();
                
                Shipping.NUM_ACTIVE_FORMS--;
            });
            
            Shipping.NUM_ACTIVE_FORMS++;
            Shipping.TOTAL_NUM_FORMS++;
        });
        
        $("#removeAllFormsButton").click(function() {
            $(".removeFormButton").each(function() {
                $(this).click();
            });
        });
        
        $("#deliverySlipButton").click(function() {
            $("form").submit();
        });
    },
    
    /**
     * Load data from the database:
     * Customer list, header, forms.
     */
    loadResources: function(dn) {
        //TODO have this be more than loading forms; load all resources
        //through here
        
        var foundError = false;
        
        setProgress("Loading customers...");
        
        $.ajax({
            url: "Resources/productionHelper.php",
            dataType: "html",
            async: false,
            type: "POST",
            data: {
                type: "customer_list"
            },
            success: function(html) {
                $("#Customer").append(html);
            },
            error: function() {
                foundError = true;
            }
        });
        
        setProgress("Loading production information...");
        
        $.ajax({
            url: "Resources/productionHelper.php",
            dataType: "xml",
            async: false,
            type: "POST",
            data: {
                DocketNumber: dn,
                type: "docket_login_data"
            },
            success: function(xml) {
                Shipping.prepareFormTable(xml);
                setProgress("Rendering loaded data...");
                Render.renderField(xml, Render.ID_FIELD);
                setProgress("Rendering forms...");
                Render.renderRows(xml, "l");
                $("#productionFormInfo").show();
            },
            error: function() {
                foundError = true;
            }
        });
        
        return !foundError;
    },
    
    /**
     * Prepare the form table for insertion of form rows.
     */
    prepareFormTable: function(xml) {
        var numRows = $(xml).find("row").length, i = 0;
        
        var proto = $(".formRow.prototype");
        
        if($(proto).length > 0) {
        
            for(; i < numRows; i++) {
                $(proto).clone().show().removeClass("prototype")
                .addClass("l" + i).addClass("live").insertAfter(proto);
            }
        } else {
            alert("Did not find proto-row =(");
        }
        
        
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
};