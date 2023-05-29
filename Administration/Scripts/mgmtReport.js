
/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Last updated 16-Aug-2011            
 *******************************************************************************
 * The utility class for the management report.
 ******************************************************************************/

/**
 * Utility class for managemenet
 */
var Management = {

    /**
     * The names of the months.
     */
    MONTH_NAMES: ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"],

    launch: function() {
        //hide everything before load
        $("#contentPane").hide();
        $("#menuContainer").hide();
        
        setProgress("Fixing menu...");
        Menu.fixMenu();
        
        setProgress("Hiding models...");
        $(".prototype").hide();
        
        setProgress("Binding objects to DOM elements...");
        this.bindObjects();
        
        setProgress("Loading open dockets...");
        this.loadDockets();

        setProgress("Setting up the rest of the page...");
        //set the date
        var monthIndex = (new Date()).getMonth();
        $(".month").text(Management.MONTH_NAMES[monthIndex]);
        
        $("#contentPane").show();
        $("#menuContainer").show();
        
        setProgress("Loading complete", ProgressBar.COMPLETE);
    },
    
    bindObjects: function() {
        var dom = $("#openJobContainer").get(0);
        $.extend(dom, FormContainer);
        dom.SELECTOR = "#openJobContainer";
        dom.TABLE_SELECTOR = "#openJobTable";
        dom.INVISIBLE_SELECTOR = "#noJobs";
        dom.ROW_CLASS = "r";
    },
    
    /**
     * Load a list of open dockets from the database
     */
    loadDockets: function() {
        $.ajax({
            url: "Backend/mgmtReportHelper.php",
            dataType: "xml",
            type: "post",
            data: {
                type: "load_open_dockets"
            },
            success: function(xml) {
                var numForms = $(xml).find("row").length;
               
                for(; numForms > 0; numForms--) {
                    $("#openJobContainer").get(0).addForm();
                }
               
                //               $("#output").text("success");
                Render.renderRows(xml, "r");
                
                setProgress("Loading complete", ProgressBar.COMPLETE);
            },
            error: function() {
                $("#output").text("error");
            }
        });
    },

    /**
     * Show a printer-friendly version of the report.
     */
    showPrintVersion: function() {
        $(".prototype").find(":input").attr("disabled", "disabled");
        $("form").submit();
        $(".prototype").find(":input").removeAttr("disabled");
    }
};