
/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.                                      
 * Updated August 12, 2011   
 * -------------------------------------------------------------------------
 * Governs the javascript events/event-handling for the production page.
 * 
 * REQUIRED IMPORTS: 
 * + JQuery
 * + Helper class and prototypes in helper.js
 * + ProgressBar class
 * + All forms classes found in forms.js
 ******************************************************************************/

/** 
 * The Production utility function. Governs all actions on this page and
 * acts as a unifier of functionality between diverse imported classes.
 * Namespace for production functions. 
 */
var Production = {
    /***************************************************************************
     ************************* CONSTANTS ***************************************
     **************************************************************************/
    
    /**
     * The row prefix for extra charges.
     * Used for rendering.
     */
    EXTRA_CHARGE_ROW_CLASS: "c",
    /**
     * The row prefix for forms.
     * Used for rendering.
     */
    FORMS_ROW_CLASS: "r",
    
    /***************************************************************************
     ************************* VARIABLES ***************************************
     **************************************************************************/
    /**
     * The docket number.
     * Default (not set) value is -1.
     */
    DOCKET_NUMBER: -1,
    
    /***************************************************************************
     ************************* FUNCTIONS ***************************************
     **************************************************************************/
    
    /**
     * Prepare the production form container by associating it with the 
     * production form object and setting the initial variables.
     */
    prepProductionFormContainer: function() {
        var cont = $("#formContainer").get(0);
        $.extend(cont, ProductionForm);

        //selectors for form class
        cont.SELECTOR = "#formContainer";
        cont.TABLE_SELECTOR = "#formTable";
        cont.INVISIBLE_SELECTOR = "#noForm";
        cont.ROW_CLASS = this.FORMS_ROW_CLASS;

        //selectors for sum amount form class
        cont.AMOUNT_CLASS = ".Qty";
        cont.SUM_FIELD_SELECTOR = "#qty";

        //selectors for production form class
        cont.NUM_FORMS_FIELD = "#numForms";
    },
    
    /**
     * Add events to the buttons in the production form container.
     * Bind the production form events with the relevant object.
     */
    addProductionFormEvents: function() {
        Production.prepProductionFormContainer();

        $("#formContainer").find(".addButton").click(function() {
            $("#formContainer").get(0).addProductionRow();
        });

        $("#formContainer").find(".removeAllButton").click(function() {
            $("#formContainer").get(0).removeAllForms();
        });

        $("#formContainer").find("#genFormsButton").click(function() {
            $("#formContainer").get(0).addProductionRows();
        });
    },
    
    /**
     * Prepare the extra charge container by associating it with the 
     * SumAmountForm object and setting the initial variables.
     */
    prepExtraChargeContainer: function() {
        var cont = $("#extraChargeContainer").get(0);
        $.extend(cont, SumAmountForm);
 
        //selectors for form class
        cont.SELECTOR = "#extraChargeContainer";
        cont.TABLE_SELECTOR = "#extraChargesTable";
        cont.INVISIBLE_SELECTOR = "#noCharge";
        cont.ROW_CLASS = this.EXTRA_CHARGE_ROW_CLASS;

        //selectors for sum amount form class
        cont.AMOUNT_CLASS = ".chargeAmt";
        cont.SUM_FIELD_SELECTOR = "#totalExtraCharges";
        cont.COST = true;
    },
    
    /**
     * Add events to the buttons in the extra charge container.
     * Bind the extra charge container with the relevant object.
     */
    addExtraChargeEvents: function() {
        this.prepExtraChargeContainer();

        $("#extraChargeContainer").find(".addButton").click(function() {
            $("#extraChargeContainer").get(0).addRow();
        });

        $("#extraChargeContainer").find(".removeAllButton").click(function() {
            $("#extraChargeContainer").get(0).removeAllForms();
        });
    },
    
    /** 
     * Add relevant events to the buttons in the form container. 
     */
    addEvents: function() {
        $("#saveButton").click(function() {
            if(Production.save()) {
                setProgress("Successfully saved data", ProgressBar.COMPLETE);
            } else {
                setProgress("Could not save data", ProgressBar.ERROR);
            }
        });
        
        $("#saveClose").click(function () {
            if(Production.save()) {
                setProgress("Successfully saved data", ProgressBar.COMPLETE);
            } else {
                setProgress("Could not save data", ProgressBar.ERROR);
            }
            Summary.closeOrder();
        })
        
        Production.addProductionFormEvents();
        Production.addExtraChargeEvents();
    },
    
    /** 
     * Save the data on the form. Erase previous data. Return true if data
     * was successfully saved, false otherwise.
     * @return True if data was saved, false otherwise.
     */
    save: function() {
        var wasSaved = true;
        
        //disable prototypes
        $(".prototype").find(":input").attr("disabled", "disabled");
        
        $.ajax({
            url: "Backend/productionHelper.php",
            type: "POST",
            async: false,
            data: {
                type: "save",
                DocketNumber: Production.DOCKET_NUMBER,
                saveData: $("form").serialize()
            },
            error: function() {
                wasSaved = false;
            }
        });
        
        $.ajax({
            url: "Backend/extraCharges.php",
            type: "POST",
            async: false,
            data: {
                type: "save",
                DocketNumber: Production.DOCKET_NUMBER,
                saveData: $("form").serialize()
            },
            error: function(error_message) {
                console.log(error_message)
                wasSaved = false;
            }
        });
        
        //Save the department assignments of the given job into the database
        var departmentInformation = this.getDepartmentInformation();
        $.ajax({
            url: "/Intranet/DepartmentFeed/Backend/jobStatusHelper.php",
            type: "POST",
            async: false,
            data: {
                type: "assign_job_to_department",
                DocketNumber: Production.DOCKET_NUMBER,
                departmentInformation: departmentInformation
            },
            error: function() {
                wasSaved = false;
            }
            
        });

        $.ajax({
            url: "/Intranet/Scheduler/Backend/SchedulerHelper.php",
            type: "POST",
            data: {
                type: "update_jobbank",
                departmentInformation: departmentInformation,
                DocketNumber: Production.DOCKET_NUMBER
            },
            success: function(html) {
                console.log(html);
            }
        })
        
        $(".prototype").find(":input").removeAttr("disabled");
        
        return wasSaved;
    },
    
    /**
     * Extract from production.php the values in the Department_Information div.
     * Return the values as an array.
     */
    getDepartmentInformation: function() {
        var div = $("div #Department_Information");
        var dieMakingValue = div.find("input#DieMaking")[0].checked;
        var pressValue = div.find("input#Press")[0].checked;
        var strippingValue = div.find("input#Stripping")[0].checked;
        var gluingValue = div.find("input#Gluing")[0].checked;
        var handWorkValue = div.find("input#HandWork")[0].checked;
        var departmentInformation = {
            "DieMaking":dieMakingValue,
            "Press":pressValue,
            "Stripping":strippingValue,
            "Gluing":gluingValue,
            "HandWork":handWorkValue
        };
        return departmentInformation;
    },
    
    /** 
     * Prepare the form container to accept loaded forms.
     * @param xml The xml representing the forms to be loaded.
     */
    loadForms: function(xml) {
        var numForms = $(xml).find("row").length;
        $("#formContainer").get(0).generateProductionRows(numForms);
    },
    
    /** 
     * Main function. Prepare the page by loading all resources.
     */
    launch: function() {
        var foundError = false;
        
        $("#contentPane").hide();
        
        setProgress("Parsing arguments...");
        var args = Helper.getArguments();
        
        setProgress("Parsing docket number...");
        
        if(args["DocketNumber"] === undefined || args["DocketNumber"] === null 
            || args["DocketNumber"] === "" || isNaN(args["DocketNumber"])) {
            setProgress("Could not parse the docket number", ProgressBar.ERROR);
            return;
        }
        
        this.DOCKET_NUMBER = parseInt(args["DocketNumber"]);
        
        setProgress("Fixing menu styles...");
        Menu.fixMenu();
        
        setProgress("Loading header...");
        $.ajax({
            url: "Templates/shipping_header.xml",
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
        $(".prototype").hide();
                    
        setProgress("Initializing inheritence structure");
        SumAmountForm.init();
        ProductionForm.init();
        
        setProgress("Adding events to forms...");
        this.addEvents();
        
        setProgress("Loading resources from database...");
        
        if(!this.loadResources(this.DOCKET_NUMBER)) {
            setProgress("Could not load docket information from database", ProgressBar.ERROR);
            return;
        }
        
        setProgress("Updating form quantities...");
        $("#extraChargeContainer").get(0).sumAmounts();
        $("#formContainer").get(0).sumAmounts();
        $("#formContainer").get(0).updateNumForms();
        this.setDepartmentAssignments();
        
        
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
        
        setProgress("Loading customers...");
        
        $.ajax({
            url: "Backend/productionHelper.php",
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
            url: "Backend/productionHelper.php",
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
                console.log(xml);
                setProgress("Preparing page for forms...");
                Production.loadForms(xml);
                
                setProgress("Adding forms to page...")
                Render.renderRows(xml, Production.FORMS_ROW_CLASS);
                
                setProgress("Adding loaded data to page...");
                Render.renderField(xml, Render.ID_FIELD);
            }
        });
        
        if(!Production.fetchExtraCharges()) {
            foundError = false;
        }
         
        return !foundError;
    },
    
    /** 
     * Prepare the form for the work order, then submit the form. 
     * TODO can be merged with save function.
     * If the print parameter is passed, submit
     * yes for the print input so that workorder.php will print the page.
     **/
    showWorkOrder: function(print) {
        Production.save();
        //do not submit prototypes
        $(".prototype").find(":input").attr("disabled", "disabled");
        if (print === 1) {
            $("input.print").attr("value", "yes");
   
        }
        $("form").submit();
        $("input.print").attr("value", "no");
        
        //remove disabled attribute so forms that are generated after
        $(".prototype").find(":input").removeAttr("disabled");
    },
    
    /**
     * Fetch the extra charges from the database and render them.
     * Charges are fetched asynchronously, so return has meaning.
     * Return true if executed correctly, false otherwise.
     * @return True if charges were fetched, false otherwise.
     */
    fetchExtraCharges: function() {
        var noError = true;
        
        $.ajax({
            url: "Backend/extraCharges.php",
            dataType: "xml",
            type: "post",
            async: false,
            data: {
                type: "load",
                DocketNumber: Production.DOCKET_NUMBER
            },
            success: function(xml) {
                var numForms = $(xml).find("row").length;
                        
                //remove everything and reset variables
                $("#extraChargeContainer").find(".removeAllButton").click();
                
                //add enough forms to allow for rendering
                $("#extraChargeContainer").get(0).generateForms(numForms);
                        
                //fill added forms with data
                Render.renderRows(xml, Production.EXTRA_CHARGE_ROW_CLASS);
                
                //sum the totals
                $("#extraChargeContainer").get(0).sumAmounts();
            },
            error: function() {
                noError = false;
            }
        });
        
        return noError;
    },
    
    /**
     * Set the checkboxes in the Department_Information div to the corresponding
     * values according to the JobsInDepartment table. If there is an error,
     * do not set the checkboxes.
     */
    setDepartmentAssignments: function() {
        $.ajax({
            url: "/Intranet/DepartmentFeed/Backend/jobStatusHelper.php",
            type: "post",
            dataType: "json",
            async: false,
            data: {
                type: "get_department_info",
                DocketNumber: Production.DOCKET_NUMBER
            },
            success: function(departmentAssignments) {
                //The departmentAssignments is an array of the departments
                //that this job has been assigned to.
                //Set corresponding checkboxes as checked.
                for (var i = 0; i < departmentAssignments.length; i++) { 
                    $("div #Department_Information")
                    .find("input#" + departmentAssignments[i])[0]
                    .setAttribute("checked", "checked");
                    //We rely on the fact that there is only one input under the
                    //department info for each department. Find returns an array,
                    // and since there is only one element, we index the array at 0.
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
}