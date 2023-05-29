
/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Last updated 16-Aug-2011            
 *******************************************************************************
 * The utility class for the shipment editor.
 ******************************************************************************/

/**
 * Utility class for shipment editor.
 */
var ShipEdit = {

    /**
     * The docket number.
     * Default -1 to check if valid docket number is set.
     */
    DOCKET_NUMBER: -1,

    /**
     * The main function to call on load.
     * Bind all relevant events to the buttons.
     * Load all resources from database.
     */
    launch: function() {
        //hide everything before load
        $("#contentPane").hide();
        $("#menuContainer").hide();
        
        setProgress("Fixing menu...");
        Menu.fixMenu();
        
        setProgress("Hiding models...");
        $(".prototype").hide();

        setProgress("Parsing arguments...");
        var args = Helper.getArguments();

        setProgress("Parsing docket number...");

        if(args["DocketNumber"] === undefined || args["DocketNumber"] === null
            || args["DocketNumber"] === "" || isNaN(args["DocketNumber"])) {
            setProgress("Could not parse the docket number", ProgressBar.ERROR);
            return;
        }

        this.DOCKET_NUMBER = parseInt(args["DocketNumber"]);

        //Link the "Add Shipment"/"Delete All Shipments" button to the corresponding
        //JS functions.
        setProgress("Adding JQuery events to the page...");
        this.addEvents();

        //Load the production data.
        setProgress("Loading production data...");
        this.loadProductionData();

        setProgress("Loading shipment list...");
        this.loadShipments();

        //show everything after load
        $("#contentPane").show();
        $("#menuContainer").show();
        
        setProgress("Loading complete", ProgressBar.COMPLETE);
    },
    /**
     * The main function to call on load for the ShipmentHistory
     * Bind all relevant events to the buttons.
     * Load all resources from database.
     */
    launchHistory: function() {
        //hide everything before load
        $("#contentPane").hide();
        $("#menuContainer").hide();
        
        setProgress("Fixing menu...");
        Menu.fixMenu();
        
        setProgress("Hiding models...");
        $(".prototype").hide();

        setProgress("Parsing arguments...");
        var args = Helper.getArguments();

        setProgress("Parsing docket number...");

        if(args["DocketNumber"] === undefined || args["DocketNumber"] === null
            || args["DocketNumber"] === "" || isNaN(args["DocketNumber"])) {
            setProgress("Could not parse the docket number", ProgressBar.ERROR);
            return;
        }

        this.DOCKET_NUMBER = parseInt(args["DocketNumber"]);

        //Link the "Add Shipment"/"Delete All Shipments" button to the corresponding
        //JS functions.
        //Bind html to forms.JS
        setProgress("Adding JQuery events to the page...");
        this.bindObjectsHistory()

        //Load the production data. 
        setProgress("Loading production data...");
        this.loadProductionData();

        setProgress("Loading shipment list...");
        this.loadShipmentsHistory();

        //show everything after load
        $("#contentPane").show();
        $("#menuContainer").show();
        
        setProgress("Loading complete", ProgressBar.COMPLETE);
    },

    confirm: function() {
        console.log("========= Confirming data ================");
        console.log("Quote number is: " + $("#Quote_Number").val().toString());
        console.log("Job name is: " + $("#Job_Name").val().toString());
        console.log("Additional is: " + $("#Additional").val().toString());
    },

    /**
     * Load data about this docket from the production page.
     * Return true on success, false on failure.
     * @return True on success, false on failure.
     */
    loadProductionData: function() {
        var noError = true;

        $.ajax({
            url: "Backend/shippingHelper.php",
            async: false,
            dataType: "xml",
            type: "POST",
            data: {
                type: "production_data",
                DocketNumber: this.DOCKET_NUMBER
            },
            success: function(xml) {
                console.log("The following is the xml returned from shippingHelper\n\
with production_date as the type");
                console.log(xml);
                Render.renderField(xml, Render.ID_FIELD);
            },
            error: function() {
                noError = false;
            }
        });

        return noError;
    },

    addEvents: function() {
        this.bindObjects();

        $("#shipmentContainer").find(".addButton").click(function() {
            $("#shipmentContainer").get(0).addShipment();
        });

        $("#shipmentContainer").find(".removeAllButton").click(function() {
            $("#shipmentContainer").get(0).removeAllForms();
        });
    },
      

    /**
     * Bind JQuery objects to DOM elements.
     */
    bindObjects: function() {
        ShippingForm.init();

        var dom = $("#shipmentContainer").get(0);
        $.extend(dom, ShippingForm);

        dom.SELECTOR = "#shipmentContainer";
        dom.TABLE_SELECTOR = "#shipmentTable";
        dom.INVISIBLE_SELECTOR = "#noShip";
        dom.ROW_CLASS = "q";
    },
    /**
     * Bind JQuery objects to DOM elements.
     */
    bindObjectsHistory: function() {
        ShippingForm.init();

        var dom = $("#slipContainer").get(0);
        $.extend(dom, ShippingForm);

        dom.SELECTOR = "#slipContainer";
        dom.TABLE_SELECTOR = "#slipTable";
        dom.INVISIBLE_SELECTOR = "#noShip";
        dom.ROW_CLASS = "slip";
        dom.FORM_CLASS = "form";        
             
        var subDom = $("#slipTable").get(0);
        $.extend(subDom, ShippingForm);
        subDom.SELECTOR = "#slipContainer";
        subDom.TABLE_SELECTOR = "#slipTable";
        subDom.INVISIBLE_SELECTOR = "#noShip";
        subDom.ROW_CLASS = "slip";
        subDom.FORM_CLASS = "form";
        
    },

    /**
     * Load the shipments with xml from summary helper with post type "shipment_list".
     */
    loadShipments: function() {
        var obj = this;

        $.ajax({
            url: "/Intranet/ShippingTool/Backend/summaryHelper.php",
            dataType: "xml",
            type: "post",
            async: false,
            data: {
                DocketNumber: obj.DOCKET_NUMBER,
                type: "shipment_list"
            },
            success: function(xml) {
                console.log("The following is the xml returned from summaryHelper with post type shipment_list");
                console.log(xml);
                var numShipments = $(xml).find("row").length;
                
                //Given the number of shipments to load, generate more shipments
                //for the shipment container.
                $("#shipmentContainer").get(0).addShipments(numShipments);
                
                //Populate the shipments in the shipment container.
                Render.renderRows(xml, "q");
            },
            error: function(error) {
                console.log("asdf");
                console.log(error);
                console.log("Error on load");
            }
        });
    },
    /**
     * Load the shipments with xml from summary helper with post type "shipment_list".
     */
    loadShipmentsHistory: function() {
        var obj = this;

        $.ajax({
            url: "/Intranet/ShippingTool/Backend/summaryHelper.php",
            dataType: "xml",
            type: "post",
            async: false,
            data: {
                DocketNumber: obj.DOCKET_NUMBER,
                type: "shipment_list_history"
            },
            success: function(xml) {
                console.log("The following is the xml returned\n\
 from summaryHelper with post type shipment_list_history");
                console.log(xml);
                
                /*An Array with SessId's stored*/
                var SessIdArray = []
                $(xml).find("SessId").each(function () {  
                    SessIdArray.push(this.getAttribute("value"));
                });
                //Given the number of slips to load,
                //generate more "slipContainer" divs.
                $("#slipContainer").get(0).addSlips(SessIdArray);
                
                var slipNumber = 0;
                //Process each slip seperately.
                $(xml).find("SessId").each(function() {
                    
                    var slipIdArray = []
                    $(this).find("row").each(function() {
                        slipIdArray.push(this.getAttribute("value"));
                        
                    });
                    //For the number of forms, add forms
                    $("#slipTable").get(0).setForms(SessIdArray[slipNumber],
                        slipIdArray);
                    slipNumber++;
                });
                
                //Populate the shipments in the shipment container.
                Render.renderShipmentHistory(xml);
            },
            error: function(error) {
                var xml = error.responseText;
                console.log("The following is the xml returned\n\
 from summaryHelper with post type shipment_list_history");
                console.log(xml);
                
                /*An Array with SessId's stored*/
                var SessIdArray = []
                $(xml).find("SessId").each(function () {  
                    SessIdArray.push(this.getAttribute("value"));
                });
                //Given the number of slips to load,
                //generate more "slipContainer" divs.
                $("#slipContainer").get(0).addSlips(SessIdArray);
                
                var slipNumber = 0;
                //Process each slip seperately.
                $(xml).find("SessId").each(function() {
                    
                    var slipIdArray = []
                    $(this).find("row").each(function() {
                        slipIdArray.push(this.getAttribute("value"));
                        
                    });
                    //For the number of forms, add forms
                    $("#slipTable").get(0).setForms(SessIdArray[slipNumber],
                        slipIdArray);
                    slipNumber++;
                });
                
                //Populate the shipments in the shipment container.
                Render.renderShipmentHistory(xml);
            }
        });
    },

    showDeliverySlip: function(print) {
        $(".prototype").find(":input").attr("disabled", "disabled");

        //disable all shipments where the checkbox is not checked
        $(".live").each(function() {
            console.log("Checking " + $(this).attr("class"));
            if($(this).find(".include:checked").length === 0) {
                $(this).find(":input").attr("disabled", "disabled");
            } else {
                console.log("Row has checked checkbox");
            }
        });

        if (print === 1) {
            $("input.print").attr("value", "yes");
   
        }
        $("form").submit();
        $("input.print").attr("value", "no");

        //re-enable all shipments
        $(".live").find(":input").removeAttr("disabled");
        $(".prototype").find(":input").removeAttr("disabled");
    },

    /**
     * Save the form, as it is.
     * Return true if save was successful, false on error.
     * Acts as a helper function to save.
     * @return True if save completed, false otherwise.
     */
    saveHelper: function() {
        var goodSave = true;
        var obj = this;
        $.ajax({
            url: "/Intranet/ShippingTool/Backend/shipmentEditHelper.php",
            type: "post",
            async: false,
            data: {
                type: "change_shipments",
                DocketNumber: obj.DOCKET_NUMBER,
                saveData: $("form").serialize()
            },
            success: function() {
            //do nothing...
            },
            error: function() {
                goodSave = false;
            }
        });

        return goodSave;
    },

    /**
     * Serialize the form and send it to the backend for saving.
     */
    save: function() {
        $(".prototype").find(":input").attr("disabled", "disabled");
        var goodSave = this.saveHelper();
        $(".prototype").find(":input").removeAttr("disabled");

        if(goodSave) {
            setProgress("Data was saved", ProgressBar.COMPLETE);
        } else {
            setProgress("There was an error during saving. Data was not saved.", ProgressBar.ERROR);
        }
    },
    
    /**
     * Save the slip.
     * Serialize the form and send it to the backend for saving. 
     */
    saveSlip: function(form) {
        var goodSave = this.saveSlipHelper(form);
   
        if(goodSave) {
            setProgress("Data was saved", ProgressBar.COMPLETE);
        } else {
            setProgress("There was an error during saving. Data was not saved.", ProgressBar.ERROR);
        }
    },
    
    /**
     * Save the form, as it is.
     * Return true if save was successful, false on error.
     * Acts as a helper function to save.
     * @return True if save completed, false otherwise.
     */
    saveSlipHelper: function(form) {
        var goodSave = true;
        var obj = this;
        var SessId = form.id;
        console.log($("form#" + SessId));
        $.ajax({
            url: "/Intranet/ShippingTool/Backend/shipmentEditHelper.php",
            type: "post",
            async: false,
            data: {
                type: "update_slip",
                DocketNumber: obj.DOCKET_NUMBER,
                saveData: $("#" + SessId).serialize()
            },
            success: function() {
                console.log("save successful");
            },
            error: function() {
                console.log("failed to save");
                goodSave = false;
            }
        });

        return goodSave;
    },
    
    /**
     * Given a form, delete the slip the form represents from the database.
     */
    deleteSlip: function(form) {
        var deleted = this.deleteSlipHelper(form);
        if(deleted) {
            setProgress("Slip deleted", ProgressBar.COMPLETE);
        } else {
            setProgress("There was an error during saving. Data was not saved.", ProgressBar.ERROR);
        }
    },
    
    /**
     * Given a form that represents a slip, use the backend shipmentEditHelper.php
     * to remove the slip data from the database.
     */
    deleteSlipHelper: function(form) {
        var deleted = false;
        var obj = this;
        var SessId = form.id;
        $.ajax({
            url: "/Intranet/ShippingTool/Backend/shipmentEditHelper.php",
            type: "post",
            async: false,
            data: {
                type: "delete_slip",
                DocketNumber: obj.DOCKET_NUMBER,
                saveData: $("form#" + SessId).serialize()
            },
            success: function() {
                console.log("deleted slip successfully");
                deleted = true;
            },
            error: function() {
                console.log("failed to detele slip");
            }
        });

        return deleted;
    },
    
    /**
     * Given a form, and a print value, set the action attribute of the form
     * to point to the delivery slip. Set the print value of the form
     * according to the print passed in.
     */
    showDeliverySlipHistory: function(form, print) {
        console.log("a");
        this.saveSlip(form);
        var SessId = form.id;
        var target = $("form#" + SessId);
        console.log("b");

        if (print === 1) {
            target.find("input.print").attr("value", "yes");
   
        } else {
            //This is not working for some reason
            target.find("input.print").attr("value", "no");
        }
        target.attr("action", "Forms/deliverySlip.php");
        //target.submit();

        console.log("d");
        
        //target.attr("action", "");
    },  
    
    /**
     * Given the form that holds the SessId of a slip,
     * call the php function that sets the slip as shipped out.
     */
    shipOutHelper: function(form, set) {
        $.ajax({
            url: "/Intranet/ShippingTool/Backend/shippingHelper.php",
            type: "post",
            async: false,
            data: {
                type: "shipOut",
                SessId: form.id,
                setDate: set
            },
            success: function() {
                console.log("shipped out success");
            },
            error: function() {
                console.log("failed to ship out");
            }
        });
    },  
    
    /**
     * Given the SessId of a slip,
     * call the php function that sets the slip as shipped out.
     */
    shipOutHelperWithSessId: function(SessId) {
        $.ajax({
            url: "/Intranet/ShippingTool/Backend/shippingHelper.php",
            type: "post",
            async: false,
            data: {
                type: "shipOut",
                SessId: SessId,
                setDate: true
            },
            success: function() {
                console.log("shipped out success");
            },
            error: function() {
                console.log("failed to ship out");
            }
        });
    }
};