/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc. 
 * Updated on 10-Aug-2011
 * -------------------------------------------------------------
 * Governs the events and actions for the job summary page.
 * 
 * REQUIRED IMPORTS: JQuery, helper (/Intranet/Resouces/Script/helper.js),
 * xmlRender, progress, forms
 ******************************************************************************/

/** Namespace for job summary to not pollute static space */
var Summary = {
    /**
     * @var int The docket number. If not set, is set at -1.
     */
    DOCKET_NUMBER: -1,
    /**
     * Keeps track if this order is open or not.
     * XXX this is not used right now
     * I want to use this to manage the close order button,
     * among other things
     */
    OPEN: true,
    
    /**
     * Delete the order from all systems. Confirm first. If successful, 
     * redirect to home page. If not successful, display an error message. 
     */
    deleteOrder: function() {
        if(confirm("Are you sure you want to delete this docket? The docket will be deleted from all records.")) {
            setProgress("Deleting docket...");
            
            $.ajax({
                url: "Backend/summaryHelper.php",
                type: "post",
                data: {
                    DocketNumber: Summary.DOCKET_NUMBER,
                    type: "delete_order"
                },
                success: function() {
                    setProgress("Order deleted.", ProgressBar.COMPLETE);
                    
                    $("#closeJobButton").remove();
                    $("#deleteJobButton").remove();
                    $("#Status").text("DELETED").removeClass("closed").addClass("open");
                    Summary.OPEN = false;
                    
                    Summary.showReport('billing');
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    if(errorThrown !== undefined && errorThrown !== null && errorThrown !== "") {
                        setProgress("ERROR: " + errorThrown, ProgressBar.ERROR);
                    }
                }
            });
        } else {
            setProgress("Canceled deletion", ProgressBar.ERROR);
        }
    },
    
    /** 
     * Close the docket. Confirm first.
     * On close, refresh relevant data and reload some fields.
     * If failed, display error message. Return false.
     * @return Return true if the docket was successfully closed, false 
     * otherwise.
     */
    closeOrder: function () {
        var foundError = false;
        var dn = this.DOCKET_NUMBER;
        var obj = this;
        
        if(confirm("Are you sure you want to close this docket?")) {
            setProgress("Closing docket...");
            
            $.ajax({
                url: "Backend/summaryHelper.php",
                dataType: "html",
                type: "POST",
                async: false,
                data: {
                    DocketNumber: Summary.DOCKET_NUMBER,
                    type: "close_docket"
                },
                success: function () {
                    //change the appearance of the status
                    $("#Status").removeClass("open").addClass("closed").html("closed");
                    //remove the close button
                    $("#closeJobButton").remove();
                    obj.OPEN = false;
                    
                },
                error: function() {
                    foundError = true;
                }
            });
            
            if(!foundError) {
                setProgress("Reloading actions...");
        
                $.ajax({
                    url: "Backend/summaryHelper.php",
                    dataType: "xml",
                    type: "POST",
                    async: false,
                    data: {
                        DocketNumber: dn,
                        type: "actions"
                    },
                    success: function (xml) {
                        setProgress("Got actions, parsing");
                        Render.renderField(xml, Render.ID_FIELD);
                    },
                    error: function() {
                        foundError = true;
                    }
                });
            }
            
            if(foundError) {
                setProgress("Error: could not close docket", ProgressBar.ERROR);
            } else {
                setProgress("Docket closed", ProgressBar.COMPLETE);
            }
        } else {
            setProgress("Cancelled closing docket", ProgressBar.ERROR);
            foundError = true;
        }
        
        return !foundError;
    },
    
    /**
     * Show the delivery report.
     * For compatibility.
     */
    showDeliveryReport: function(print) {
        this.showReport("deliveryReport", print);
    },
    
    /** 
     * Prep the form, then submit the form to the appropriate report page,
     * finally un-prep the form.
     * @param reportName The name of the report.
     * @param print If 1, print
     */
    showReport: function(reportName, print) {
        var showReport = true;
        
        //disable all prototype input fields
        $(".prototype").find("input").attr("disabled", "disabled");
        $(".prototype").find("select").attr("disabled", "disabled");
    
        //set the submit location
        $("form").attr("action", "Forms/" + reportName + ".php");
        
        if(reportName === "billing" && this.OPEN) {
            showReport = confirm("This job is still open. Show billing report anyway?");
        }
        
        if(showReport) {
            if (print === 1) {
                $("input.print").attr("value", "yes");
            }
            $("form").submit();
            $("input.print").attr("value", "no");
        }
        
        //remove disabled attribute so forms that are generated after
        //submit will not be disabled
        
        //XXX why not disable all input fields?
        
        $(".prototype").find("input").removeAttr("disabled");
        $(".prototype").find("select").removeAttr("disabled");
    },
    
    /**
     * Call this function on page load. Prepare the page and load required
     * resources Return true if the page loaded successfully, false otherwise.
     * @return True if page loaded successfully, false otherwise.
     */
    launch: function () {
        var foundError = false;
        
        $("#contentPane").hide();
        $("#actions").hide();
        $("#menuContainer").hide();
        
        setProgress("Fixing the menu styling...");
        Menu.fixMenu();
        
        setProgress("Reading arguments...");
        var args = Helper.getArguments();
        
        setProgress("Parsing for docket number...");
        
        if(args["DocketNumber"] === undefined || args["DocketNumber"] === null 
            || args["DocketNumber"] === "" || isNaN(args["DocketNumber"])) {
            setProgress("Could not parse the docket number", ProgressBar.ERROR);
            return false;
        } else {
            this.DOCKET_NUMBER = args["DocketNumber"];
        }
        
        setProgress("Preparing the page");
        if(!this.preparePage()) {
            setProgress("ERROR: Could not load key fields", ProgressBar.ERROR);
            return false;
        }
        
        setProgress("Preparing extra charges...");
        this.addExtraChargeEvents();
        
        setProgress("Loading extra charges...");
        if(!this.fetchExtraCharges()) {
            setProgress("Could not load extra charges from database", ProgressBar.ERROR);
            return false;
        }
        
        setProgress("Loading shipments...");
        if(!this.loadResources(this.DOCKET_NUMBER)) {
            setProgress("Could not load shipments from database", ProgressBar.ERROR);
            return false;
        }
        
        setProgress("Loading shipping summary...");
        if(!this.loadSummary(this.DOCKET_NUMBER)) {
            setProgress("Could not load shipping summary from database", ProgressBar.ERROR);
            return false;
        }
        
        setProgress("Calculating differences...");
        
        $(".summaryRow.live").each(function() {
            var req = parseInt($(this).find(".qty_req").val());
            var ship = parseInt($(this).find(".qty_ship").val());
            $(this).find(".ship_diff").val(ship - req);
        });
        
        setProgress("Parsing dates...");
        $("#Date").val($("#Date").val().split(" ")[0]);
        $(".Date").each(function() {
            $(this).val($(this).val().split(" ")[0]);
        });
        $(".last_ship_date").each(function() {
            $(this).val($(this).val().split(" ")[0]); 
        });
        
        setProgress("Parsing job status...");
        if($("#Status").text().toString() === "open") {
            $("#Status").addClass("open");
            $("#closeJobButton").show();
            this.OPEN = true;
        } else {
            $("#Status").addClass("closed");
            $("#closeJobButton").hide();
            this.OPEN = false;
        }
        
        setProgress("Locking all fields...");
        $("input,textarea").attr("readonly", "readonly");
       
        setProgress("Loading complete", ProgressBar.COMPLETE);
        $("#contentPane").show();
        $("#actions").show();
        $("#menuContainer").show();
        
        return !foundError;
    },
    
    /**
     * Fetch the extra charges from the database and render them.
     * Charges are fetched asynchronously, so return has meaning.
     * Return true if executed correctly, false otherwise.
     * @return True if charges were fetched, false otherwise.
     */
    fetchExtraCharges: function() {
        var noError = true, obj = this;
        
        $.ajax({
            url: "Backend/extraCharges.php",
            dataType: "xml",
            type: "post",
            async: false,
            data: {
                type: "load",
                DocketNumber: obj.DOCKET_NUMBER
            },
            success: function(xml) {
                var numForms = $(xml).find("row").length;
                        
                //remove everything and reset variables
                $("#extraChargeContainer").get(0).removeAllForms();
                        
                //prepare the container for influx of forms
                while(numForms > 0) {
                    $("#extraChargeContainer").get(0).addForm();
                    numForms--;
                }
                        
                Render.renderRows(xml, "c");
                        
                //now update the charges
                obj.sumCharges();
            },
            error: function() {
                noError = false;
            }
        });
        
        return noError;
    },
    
    /**
     * Sum the extra charges and output the charges into the total field,
     * formatted appropriately.
     */
    sumCharges: function () {
        var total = 0;
        var val;
                
        $("#extraChargeContainer").find(".chargeAmt").each(function() {
            var val = $(this).val().toString().replace("$", "").toFloat();
            total += val;
        });
                
        $("#extraChargeContainer").find("#totalExtraCharges").val("$" + total.toFixed(2));
    },
    
    /**
     * Add events to the buttons in the extra charge container.
     * Bind the extra charge container with the relevant object.
     */
    addExtraChargeEvents: function() {
        this.prepExtraChargeContainer();
    },
    
    /**
     * Extend the extra charge container with the formContainer object
     * and set all necessary variables.
     */
    prepExtraChargeContainer: function() {
        var cont = $("#extraChargeContainer").get(0);
        $.extend(cont, FormContainer);
        cont.SELECTOR = "#extraChargeContainer";
        cont.TABLE_SELECTOR = "#extraChargesTable";
        cont.INVISIBLE_SELECTOR = "#noCharge";
        cont.ROW_CLASS = "c";
    },
    
    /**
     * Prepare the table to received loaded resources.
     */
    prepareTable: function (xml, type) {
        var row = "", rowClass = "x", table = "";
        var numRows = $(xml).find("row").length, i = 0;
        
        switch(type) {
            case "summary":
                row = "summaryRow";
                rowClass = "l";
                table = "summaryTable";
                break;
            case "list":
                row = "shipRow";
                rowClass = "r";
                table = "shipmentsTable";
                break;
            default:
                return;
        }
        
        for(i = 0; i < numRows; i++) {
            $("." + row + ".prototype").clone()
            .show()
            .removeClass("prototype").addClass("live").addClass(rowClass + i)
            .appendTo("#" + table);
        }
        
        if(numRows > 0) {
            $("#" + table).show();
            $(".noship").hide();
        } else {
            $(".noship").show();
            $("#" + table).hide();
        }
    },
    
    /**
     * Given the docket number, load the shipment summary.
     * Return true if the summary was loaded, return false otherwise.
     * @param dn The docket number.
     * @return True if load was successfull, false otherwise.
     */
    loadSummary: function(dn) {
        var foundError = false;
        
        $.ajax({
            url: "Backend/summaryHelper.php",
            dataType: "xml",
            type: "POST",
            async: false,
            data: {
                DocketNumber: dn,
                type: "shipment_summary"
            },
            success: function (xml) {
                setProgress("Preparing page for shipment summary...");
                Summary.prepareTable(xml, "summary");
                
                setProgress("Got shipment summary, parsing...");
                Render.renderRows(xml, "l");
            },
            error: function() {
                foundError = true;
            }
        });
        
        return !foundError;
    },
    
    /**
     * Load resources from database with given docket number.
     * Return true if the load was successful, false otherwise.
     * @param dn The docket number.
     * @return True if load was successful, false otherwise.
     */
    loadResources: function(dn) {
        var noError = true;
        
        $.ajax({
            url: "Backend/summaryHelper.php",
            dataType: "xml",
            type: "POST",
            async: false,
            data: {
                DocketNumber: dn,
                type: "shipment_list"
            },
            success: function (xml) {
                setProgress("Preparing page for shipment list...");
                Summary.prepareTable(xml, "list");
                
                setProgress("Got shipment list, parsing...");
                Render.renderRows(xml, "r");
            },
            error: function() {
                noError = false;
                console.log("Could not load shipment list");
            }
        });
        
        $.ajax({
            url: "Backend/productionHelper.php",
            dataType: "xml",
            type: "POST",
            async: false,
            data: {
                DocketNumber: dn,
                type: "docket_login_data"
            },
            success: function (xml) {
                setProgress("Got shipment list, parsing...");
                Render.renderField(xml, Render.ID_FIELD);
                
                $(xml).find("field").each(function() {
                    if($(this).find("name:contains('Flagged')").length > 0 &&
                        $(this).find("value").length > 0) {
                        var flagged = $(this).find("value").text();
                        
                        if(!isNaN(flagged) && parseInt(flagged) === 1) {
                            $("#flagPanel").show();
                        }
                    }
                });
            },
            error: function() {
                console.log("Could not load production data");
                noError = false;
            }
        });
        
        setProgress("Loading actions...");
        
        $.ajax({
            url: "Backend/summaryHelper.php",
            dataType: "xml",
            type: "POST",
            async: false,
            data: {
                DocketNumber: dn,
                type: "actions"
            },
            success: function (xml) {
                setProgress("Got actions, parsing");
                Render.renderField(xml, Render.ID_FIELD);
            },
            error: function() {
                console.log("Could not load actions");
                noError = false;
            }
        });
        
        return noError;
    },
    
    /**
     * Prepare the page for initial resource load.
     * Load templates and process them.
     * Return true if page is prepared, false otherwise.
     * @return True if page is prepared, false otherwise.
     */
    preparePage: function() {
        setProgress("Hiding models...");
        
        $(".prototype").each(function() {
            $(this).hide();
        });
        
        setProgress("Fetching header...");
        
        var foundError = false;
        
        $.ajax({
            url: "Templates/jobsummary_header.xml",
            dataType: "xml",
            async: false,
            success: function (xml) {
                setProgress("Got header, parsing...");
                addAreas(xml, "#orderInfo");
            },
            error: function() {
                foundError = true;
            }
        });
        
        //this is very hacky way...
        setProgress("Adjusting names...");
        $("#Date_Received").attr("id", "Date");
        
        return !foundError;
    },
    
    /**
     * Toggle the visibility of the shipping details on button press.
     */
    toggleShipDetails: function() {
        $("#shipDetails").toggle();
        
        if($("#shipDetails").is(":visible")) {
            $("#hideShipDetails").text("Showing shipment details.");
            $("#toggleDetailsButton").text("Hide");
        } else {
            $("#hideShipDetails").text("Shipment details are hidden.");
            $("#toggleDetailsButton").text("Show");
        }
    }
};