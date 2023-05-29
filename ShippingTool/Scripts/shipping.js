
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
    /** 
     * Number of forms inserted since last load. Used for unique naming.
     */
    TOTAL_NUM_FORMS: 0,
    
    /** 
     * Number of forms currently showing.
     */
    NUM_ACTIVE_FORMS: 0,
    
    /** 
     * The docket number. Starts out as -1. 
     */
    DOCKET_NUMBER: -1,
    
    SAVED_ONCE: false,
    
    /* Tracks whether or not current session is new relative to slipHistory table */
    SAVED_ONCE_HISTORY: false,
    
    /**
     *
     */
    save: function() {
        var type = "save", obj = this;
        
        if(!this.SAVED_ONCE) {
            type = "saveNew";
        }
        
        $(".prototype").find(":input").attr("disabled", "disabled");
        
        $.ajax({
            url: "Backend/shippingHelper.php",
            type: "post",
            data: {
                type: type,
                DocketNumber: obj.DOCKET_NUMBER,
                saveData: $("form").serialize()
            },
            dataType: "text",
            async: false,
            success: function(theSession) {
                console.log("The Session ID is:" + theSession);
                console.log("saved once? " + obj.SAVED_ONCE);
                obj.SAVED_ONCE = true;
                
                //Pass the Session ID over.
                $("input.SessId").attr("value", theSession);
            },
            error: function() {
                console.log("saving fail");
            }
        });
        
        $(".prototype").find(":input").removeAttr("disabled");
        this.historySave();
    },
        
    /**
     * Save the slip data into slipHistory and slipStatus table. These tables
     * are used by slipHistory.php.
     */
    historySave: function () {
        var type = "saveHistory", obj = this;
       
        
        $(".prototype").find(":input").attr("disabled", "disabled");
        
        $.ajax({
            url: "Backend/shippingHelper.php",
            type: "post",
            data: {
                type: type,
                DocketNumber: obj.DOCKET_NUMBER,
                saveData: $("form").serialize()
            },
            dataType: "text",
            async: false,
            success: function(session) {
                
                console.log("saved once? " + obj.SAVED_ONCE_HISTORY);
                obj.SAVED_ONCE_HISTORY = true;
            },
            error: function() {
                console.log("saving fail");
            }
        });
        
        $(".prototype").find(":input").removeAttr("disabled");
    },
    
    /** 
     * Prepare the page and load all necessary resources. Bind
     * all JQuery events.
     */
    launch: function () {
        $("#contentPane").hide();
        
        setProgress("Fixing menu...");
        Menu.fixMenu();
        
        //Extract POST values
        setProgress("Parsing arguments...");
        var args = Helper.getArguments();
        
        //Setting Docket Number
        setProgress("Parsing docket number...");
        if(args["DocketNumber"] === undefined || args["DocketNumber"] === null 
            || args["DocketNumber"] === "" || isNaN(args["DocketNumber"])) {
            setProgress("Could not parse the docket number", ProgressBar.ERROR);
            return;
        } else {
            this.DOCKET_NUMBER = args["DocketNumber"];
        }
        
        //Generate divs for Production Information
        //set the buttons
        setProgress("Preparing page...");
        if(!this.preparePage()) {
            setProgress("ERROR: key resource missing", ProgressBar.ERROR);
            return;
        }
        
        //Populate the pre-loaded forms and "forms (for current slip)"
        setProgress("Loading forms...");
        if(!this.loadResources(this.DOCKET_NUMBER)) {
            setProgress("Could not load database data ", ProgressBar.ERROR);
            return;
        }
        
        //Extract form preloaded forms to 
        setProgress("Generating shipping forms...");
        this.copyFormNames();
        
        //Set Production Information box to be read only
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
            url: "Templates/shipslip_header.xml",
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
    addEvents:  function () {
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
            Shipping.showForm(0);
        });
        
        $("#printDeliverySlipButton").click(function() {
            Shipping.showForm(1);
        });
    },
    
    showForm:  function(print) {
        $(".prototype").find(":input").attr("disabled", "disabled");
        this.save();
        if (print === 1) {
            $("input.print").attr("value", "yes");
        } else if (print === 2) {
            $("form").attr("action", "Forms/deliverySlipPDF.php");
        }
        $("form").submit();
        $("form").attr("action", "Forms/deliverySlip.php");
        $("input.print").attr("value", "no");
        
        $(".prototype").find(":input").removeAttr("disabled");
    },
    
    /**
     * Load data from the database given the docket number.
     * Data to be loaded: list of customers, header, forms.
     * Return true if resources were loaded successfully, false otherwise.
     * @return True if resources loaded, false otherwise.
     */
    loadResources: function(dn) {
        var foundError = false;
        
        setProgress("Loading customers...");
        
        $.ajax({
            url: "Backend/productionHelper.php",
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
            url: "Backend/productionHelper.php",
            dataType: "xml",
            async: false,
            type: "POST",
            data: {
                DocketNumber: dn,                
                order: "DESC",
                type: "docket_login_data"
            },
            success: function(xml) {
                console.log(xml);
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
     * Return true if the table was prepared, false otherwise.
     */
    prepareFormTable: function(xml) {
        var numRows = $(xml).find("row").length, i = 0;
        var prepared = true;
        
        var proto = $(".formRow.prototype");
        
        if($(proto).length > 0) {
        
            for(; i < numRows; i++) {
                $(proto).clone().show().removeClass("prototype")
                .addClass("l" + i).addClass("live").insertAfter(proto);
            }
        } else {
            setProgress("Could not find the prototype row", ProgressBar.ERROR);
            prepared = false;
        }
        
        return prepared;
    }
};