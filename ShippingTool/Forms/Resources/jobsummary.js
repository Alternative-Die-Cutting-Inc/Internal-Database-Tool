/*******************************************************************************
 * Governs the events and actions for the job summary page.
 * 
 * NOTE: this script uses JQuery.
 *                                                                       
 * Written by Daniel Kats for Alternative Die Cutting, Inc. 
 * Updated on 15-Jul-2011                           
 *       
 ******************************************************************************/

/** Namespace for job summary to not pollute static space */
var Summary = {
    DOCKET_NUMBER: -1,
    
    /** Close the docket. Confirm first. */
    closeOrder: function () {
        var foundError = false;
        var dn = this.DOCKET_NUMBER;
        
        if(confirm("Are you sure you want to close this docket?")) {
            setProgress("Closing docket...");
            
            $.ajax({
                url: "Resources/summaryHelper.php",
                dataType: "html",
                type: "POST",
                async: false,
                data: {
                    DocketNumber: Summary.DOCKET_NUMBER,
                    type: "close_docket"
                },
                success: function () {
                    $("#Status").removeClass("open").addClass("closed").html("closed");
                },
                error: function() {
                    foundError = true;
                }
            });
            
            setProgress("Reloading actions...");
        
            $.ajax({
                url: "Resources/summaryHelper.php",
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
            
            if(foundError) {
                setProgress("Error: could not close docket", ProgressBar.ERROR);
            } else {
                setProgress("Docket closed", ProgressBar.COMPLETE);
            }
        } else {
            setProgress("Cancelled closing docket", ProgressBar.ERROR);
        }
    },
    
    /** Prep the form, then submit it to the delivery report page */
    showDeliveryReport: function() {
        //disable all prototype input fields
        
        $(".prototype").find("input").attr("disabled", "disabled");
        $(".prototype").find("select").attr("disabled", "disabled");
    
        $("form").submit();
        
        //remove disabled attribute so forms that are generated after
        //submit will not be readonly
        
        $(".prototype").find("input").removeAttr("disabled");
        $(".prototype").find("select").removeAttr("disabled");
    },
    
    launch: function () {
        $("#contentPane").hide();
        $("#actions").hide();
        
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
        
        setProgress("Preparing the page");
        if(!this.preparePage()) {
            setProgress("ERROR: Could not load key fields", ProgressBar.ERROR);
            return;
        }
        
        setProgress("Loading shipments...");
        if(!this.loadResources(this.DOCKET_NUMBER)) {
            setProgress("Could not load shipments from database", ProgressBar.ERROR);
            return;
        }
        
        setProgress("Loading shipping summary...");
        if(!this.loadSummary(this.DOCKET_NUMBER)) {
            setProgress("Could not load shipping summary from database", ProgressBar.ERROR);
            return;
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
        } else {
            $("#Status").addClass("closed");
            $("#closeJobButton").hide();
        }
        
        
        setProgress("Locking all fields...");
        $("input, textarea").attr("readonly", "readonly");
       
        setProgress("Loading complete", ProgressBar.COMPLETE);
        $("#contentPane").show();
        $("#actions").show();
    },
    
    prepareTable: function (xml, type) {
        var row = "", rowClass = "x", table = "";
        
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
        
        var numRows = $(xml).find("row").length, i = 0;
        
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
            
            //XXX for debugging purposes
            console.log("no results found");
        }
    },
    
    loadSummary: function(dn) {
        var foundError = false;
        
        $.ajax({
            url: "Resources/summaryHelper.php",
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
     */
    loadResources: function(dn) {
        var foundError = false;
        
        $.ajax({
            url: "Resources/summaryHelper.php",
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
                foundError = true;
            }
        });
        
        $.ajax({
            url: "Resources/productionHelper.php",
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
                foundError = true;
            }
        });
        
        setProgress("Loading actions...");
        
        $.ajax({
            url: "Resources/summaryHelper.php",
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
        
        return !foundError;
    },
    
    preparePage: function() {
        setProgress("Hiding models...");
        
        $(".prototype").each(function() {
            $(this).hide();
        });
        
        setProgress("Fetching header...");
        
        var foundError = false;
        
        $.ajax({
            url: "Resources/jobsummary_header.xml",
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