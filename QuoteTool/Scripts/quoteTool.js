
/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * LUpdated on 8-Aug-2011   
 *  ---------------------------------------------------------------------
 * Governs the actions for the quote tool main page including event handling.
 * 
 * NOTE: This file uses JQuery and expects JQuery imported
 * NOTE: This file uses the Progress class and expects it imported
 * NOTE: This file uses the Menu class and expects it imported
 * NOTE: This file uses the Render class and expects it imported
 * NOTE: This file uses the QuoteLoader class and expects it imported
 ******************************************************************************/

/** 
 * General quote tool utility functions 
 */
var QuoteTool = {
    
    /** The quote number for this application */
    QUOTE_NUMBER: -1,
    
    /** Keeps track of whether changes have been made after saving */
    HAS_CHANGED : true,
    
    /** 
     * Keeps track of tab index to create comfortable and intuitive
     * tabbing through quote. 
     */
    TAB_INDEX: 1,
    
    /**
     * The main method. Call this function on document ready, and it will
     * execute all necessary scripts.
     */
    launch: function() {
        $("#contentPane").hide();
        $("#menuContainer").hide();
        
        setProgress("Preparing the page to receive data from server...");
        this.preparePage();
        
        setProgress("Loading templates...");
        this.loadTemplates();
        
        setProgress("Adding events...");
        this.addEvents();
        
        setProgress("Loading data from server...");
        this.loadData();
        
        setProgress("Rendering data...");
        this.parsePage();
        
        //TODO check if these operations were successfull
                
        setProgress("Looking for past quotes...");
        loadPastQuote();
        
        //once past quotes are loaded
        console.log(this.QUOTE_NUMBER);
        
        setProgress("Loading ...", ProgressBar.COMPLETE);
        setTimeout(function(){
            $("#calculateButton").click();
            $("#contentPane").show();
            $("#menuContainer").show();
        },3000);
    },
    
    /** 
     * Changes have been made to the container since the last save. 
     */
    setChanged: function () {
        if(!this.HAS_CHANGED) {
            console.log("Quote has been changed.");
        }
        
        this.HAS_CHANGED = true;
    },
    
    /** 
     * The quote has just been saved.
     */
    setSaved: function () {
        if(this.HAS_CHANGED) {
            console.log("Quote has been saved.");
        }
        
        this.HAS_CHANGED = false;
    },
    
    /** Parse the input by adding certain properties. */
    parsePage: function() {
        var obj = this;
        
        setProgress("Setting header tab indices...");
        this.addToTab("#headerContainer");
        
        setProgress("Adding saving check...");
        $(":input:not([readonly='readonly'])").not("button").change(function() {
            obj.setChanged();
        });
        
        setProgress("Locking loaded fields...");
        $("#Quote_Number, #Author").attr("readonly", "readonly");
        
        setProgress("Loading complete", ProgressBar.COMPLETE);
    },
    
    /** 
     * Add the given div to the end of the tab queue.
     * This method is used to create intuitive tabbing through forms.
     * @param div The div to add to the queue.
     */
    addToTab: function(div) {
        var obj = this;
        
        if($(div).length > 0) {
            $(div).find(":input:not([readonly='readonly'])").not("button").each(function(i, e) {
                $(e).attr("tabindex", obj.TAB_INDEX++);
            });
            
            //adding to saving check
            $(div).find(":input:not([readonly='readonly'])").not("button").change(function() {
                obj.setChanged();
            });
        }
    },
    
    /**
     * Submit the form to the form that has the given name (don't include
     * '.php'. Forms are assumed to be of type php.
     * If the name is "save", the form will instead be saved.
     * @param name The name of the form.
     * @param print If 1 print the page
     */
    submitForm: function(name, print) {
        var prog, foundError = false, foo;
        
        setProgress("Disabling prototypes...");
        //        $(".quote.prototype").find(":input").attr("disabled", "disabled");
        $(".prototype").find(":input").attr("disabled", "disabled");
        
        //TODO change to Dev to Forms
        $("form").attr("action", "Forms/" + name + ".php");
        
        if(name === "saveNew") {
            setProgress("Loading new quote number...");
            
            if(this.loadData(true)) {
                name = "save";
            } else {
                setProgress("FATAL ERROR: cannot get new quote number", ProgressBar.ERROR);
            }
        }
        
        if(name === "save" || name === "saveAppend") {
            setProgress("Preparing extra fields for saving...");
            ExtraFields.prepareSave();
            
            setProgress("Beginning save...");
            if(name === "save") {
                foo = SaveDev.save();
            } else if (name === "saveAppend") {
                foo = SaveDev.saveAppend();
            }
            
            if(foo) {
                prog = "Quote successfully saved";
                this.setSaved();
            } else {
                prog = "ERROR: Could not save quote";
                foundError = true;
            }
        }else {
            setProgress("Submitting form '" + name + "'...");
            if (print === 1) {
                $("input.print").attr("value", "yes");
            }
            $("form").submit();
            $("input.print").attr("value", "no");
            prog = "Action complete";
        }
        
        setProgress("Enabling prototypes...");
        //        $(".quote.prototype").find(":input").removeAttr("disabled");
        $(".prototype").find(":input").removeAttr("disabled", "disabled");
        
        setProgress("Clearing save preparations from extra fields...");
        ExtraFields.clearSave();
        
        if(foundError) {
            setProgress(prog, ProgressBar.ERROR);
        } else {
            setProgress(prog, ProgressBar.COMPLETE);
        }
        QuoteTool.saveRate();
    },
    
    /**
     * Save the rate for the docket number in the Rate table.
     */
    saveRate: function () {

        $.ajax({
            url: "/Intranet/QuoteTool/Backend/getcustomerrate.php",
            type: "POST",
            async: false,
            data: {
                rate:  $("#Rate").val(),
                quoteNumber: QuoteTool.QUOTE_NUMBER,
                save: "yes"
            },
            success: function() {
                console.log("rate saved");
            },
            error: function() {
                console.log("rate not saved");
            }
        });
        
    },
    
    /** 
     * Add events to the menu items.
     */
    addMenuEvents: function() {
        var obj = this;
        
        $("#worksheetButton").click(function() {
            obj.submitForm("worksheet");
        });
        
        $("#clientsheetButton").click(function() {
            obj.submitForm("clientsheet", 0); 
        });
        $("#clientsheetButtonPDF").click(function() {
            obj.submitForm("clientsheet", 1); 
        });
        
        $("#clearAllButton").click(function() {
            obj.clearAll(); 
        });
        
        $("#calculateButton").click(function() {
            var totalNum = $(".quote.live").length;
                  
            $(".quote.live").each(function(i) {
                setProgress("Updating totals in quote " + i + " of " + totalNum + "...");
                $(this).get(0).updateTotals();
            });
            
            setProgress("Calculation finished", ProgressBar.COMPLETE);
        });
    
        $("#saveButton").click(function() {
            obj.submitForm("save");
        });
        
        $("#saveNewButton").click(function() {
            obj.submitForm("saveNew");
        });
        
        $("#appendToButton").click(function() {
            obj.submitForm("saveAppend"); 
        });
        $("#clientSheetPDF").click(function(){
            $("#clientEmail").toggle();
         
        });

    },
    
    /**
     * Add toggle events to quote container.
     */
    addToggleEvents: function() {
        $("#toggleButton").click(function(){

            $("#toggleThis").toggle(); 
        });
        console.log("addtoggleevents function called")
    },
    
    /**
     * Given a customer and quote, fetch the customer rate for that quote from 
     * the database and return it.  Uses asynchronous request so this will work.
     * If there was an error fetching the customer rate, returns boolean false.
     * If there is no rate for that quote, insert it into the database.
     * @param customerName The customer name.
     * @return The customer rate if fetched, boolean false on failure.
     */
    fetchCustomerRate: function(customerName, quoteNumber) {
        var val = 1;
        
        $.ajax({
            url: "/Intranet/QuoteTool/Backend/getcustomerrate.php",
            type: "POST",
            async: false,
            data: {
                customer: customerName,
                quoteNumber: quoteNumber
            },
            success: function(rate) {
                val = rate.toString().toFloat();
            },
            error: function() {
                val = false;
            }
        });
        
        return val;
    },
    
    /** 
     * After all HTML objects have loaded, bind JQuery events to relevant fields.
     */
    addEvents: function() {
        var obj = this, val;
        
        setProgress("Adding general events...");
        
        if($("#Quote_Number").length > 0) {
            $("#Quote_Number").change(function() {
                val = $(this).val();
                obj.QUOTE_NUMBER = val;
                console.log("Changed quote number to " + val);
            });
        }
        
        //The following lines of code are executed on the selection of a customer.
        //update the customer rate
        if($("#Customer").length > 0) {
            $("#Customer").change(function() {
                var customer = $(this).val();
                var rate = obj.fetchCustomerRate(customer, obj.QUOTE_NUMBER);
                
                if(rate === false) {
                    rate = 1.0;
                    setProgress("Error loading customer rate for " + customer, ProgressBar.ERROR);
                } else {
                    setProgress("Loaded customer rate", ProgressBar.COMPLETE);
                }
                
                //note that toFixed is a number method, not a string method
                $("#Rate").val(rate.toFixed(2));
                
                //Set the email drop down with emails associated with the 
                //selected customer.
                obj.setEmailsForCustomer(customer);
                
            });
        }
        this.addEmailEvent();
                       
        
        //adding confirmation to exit if changes have been made
        $(window).bind("beforeunload", function() {
            return QuoteTool.HAS_CHANGED ? "Changes have been made since the last save. Are you sure you want to exit?" : null;
        });
        
        this.addMenuEvents();
    },
    
    /**
     * Prepare the page for receiving data and for display. 
     */
    preparePage: function () {
        setProgress("Fixing the menu...");
        Menu.fixMenu();
        
        setProgress("Hiding models...");
        $(".prototype").hide();
        
        setProgress("Attaching object to quote container");
        var qPane = jQuery("#quoteContainer").get(0);
        $.extend(qPane, QuoteContainer);
        
        setProgress("Binding JQuery events...");
        $("#addQuoteButton").click(function() {
            qPane.addQuote();
        });
        
        $("#removeAllQuotesButton").click(function() {
            qPane.removeAllQuotes();
        });
        
        $("#genQuotesButton").click(function() {
            if($("#numQuotes").length > 0) {
                qPane.genQuotes($("#numQuotes").val());
            }
        });
    },
    
    /**
     * Load preliminary database data.
     * @param clear True to clear, false otherwise. Defaults to false
     * TODO look into caching, etc.
     */
    loadData: function(clear) {
        var option = "prep";
        
        if(clear !== undefined && clear === true) {
            option = "nprep";
        } else {
            clear = false;
        }
        
        var foundError = false;
        
        $.ajax({
            url: "Backend/quotePrep.php",
            type: "POST",
            async: false,
            data: {
                opt: option
            },
            success: function (xml) {
                Render.renderField(xml, Render.ID_FIELD);
            }, 
            error: function() {
                foundError = true;
            }
        });
        
        var name, opt, field;
        
        if(!clear){
            $("select.general").each(function() {
                name = $(this).attr("name").toString().replace("[]", "");
                opt = name === "Customer" ? "frequencySort" : opt = "";
                field = this;
            
                $.ajax({
                    url: "Backend/getoptions.php",
                    type: "POST",
                    async: false,
                    dataType: "html",
                    data: {
                        field: name,
                        options: opt
                    },
                    error: function() {
                        foundError = true;
                    },
                    success: function(html) {
                        $(field).append(html);
                    }
                })
            });
        }
        
        if(foundError) {
            setProgress("FATAL ERROR: Could not load vital data from the database", ProgressBar.ERROR);
        } else {
            setProgress("Finished loading data from database", ProgressBar.COMPLETE);
        }
        
        return !foundError;
    },
    
    /**
     * Load all templates for the page and add them to the page.
     * Parse XML.
     * 
     * Return true if loading successful, false otherwise.
     */
    loadTemplates : function() {
        var foundError = false;
        var resources = new Array("header", "quote", "prep");
        var file, div, i = 0, isClass;
        
        while(!foundError && i < resources.length) {
            setProgress("Loading resource " + resources[i]);
            
            switch(resources[i]) {
                case "header":
                    file = "header";
                    div = "#header";
                    isClass = false;
                    break;
                case "quote":
                    file = "quote";
                    div = ".quote.prototype";
                    isClass = true;
                    break;
                default:
                    return false;
            }
            
            $.ajax({
                url: "Templates/"  + file + ".xml",
                dataType: "xml",
                async: false,
                success: function(xml) {
                    addAreas(xml, div, isClass);
                },
                error: function() {
                    foundError = true;
                }
            });
            
            i++;
        }
        
        return !foundError;
    },
    
    /**
     * Clear all data from the application and start a new quote.
     * Clear all server application data
     * Remove all GET arguments from the location bar.
     */
    clearAll: function() {
        $.ajax({
            url: "Backend/prepareQuote.php",
            data : {
                opt : 'clear'
            },
            dataType: "html",
            //not asynchronous so all fields are cleared before
            //application starts
            async : false
        });
    
        window.location.href = window.location.href.split("?")[0];
    },
    
    /**
     *For the given customer, set the preloadedEmails tag with corresponding
     *emails.
     */
    setEmailsForCustomer: function(customer) {
        console.log("get emails called");
        $.ajax({
            url: "Backend/getCustomerEmails.php",
            type: "POST",
            async: false,
            dataType: "html",
            data: {
                customer: customer
            },
            success: function(html) {
                $("#preloadedEmails")[0].innerHTML = html;
            }
        });
    },
    
    /**
     * Set the event for the send email button. When this button is clicked,
     * submit the form to the pdf version of the client sheet. This version will
     * take the emails passed to it and email those people the pdf of the client
     * sheet.
     */
    addEmailEvent: function() {
        $("#submitEmail").click(function() {
            
            //Want to add the inputted data into the form before submission.
            var inputEmails =  $("#inputEmail")[0].value;
            var clientEmail = $("#preloadedEmails")[0].value;
            $("#inputtedEmails")[0].value = inputEmails;
            $("#clientEmail")[0].value = clientEmail;
            //Change the action
            QuoteTool.submitForm("clientSheetPDF", 0); 
            
        });
    }
};

/** 
 * The container for the quote, represented as an object.
 * XXX maybe put this in a separate file to avoid confusion
 */
var QuoteContainer = {
    /** The number of quotes ever added to this container */
    TOTAL_NUM_QUOTES: 0,
    
    /** Number of quotes in the currently in the application */
    NUM_ACTIVE_QUOTES: 0,
    
    /** The class for quotes added to this container */
    QUOTE_CLASS: "q",
    
    /** True if container is empty, false otherwise */
    isEmpty: function () {
        return this.NUM_ACTIVE_QUOTES === 0;
    },
    
    /**
     * Make it so that there are a certain number of quotes in total.
     */
    genQuotes: function(num) {
        if(num === undefined || num === null || num === "" ||
            isNaN(num)) {
            num = 0;
        //so no new quotes are generated
        } else {
            num = parseInt(num) - this.NUM_ACTIVE_QUOTES;
        }
        
        var i = 0, phrase;
        
        if (num > 0) {
            phrase = num === 1 ? "quote" : "quotes";
            setProgress("Adding " + num + " new " + phrase);
            
            for(i = num; i > 0; i--) {
                this.addQuote();
            }
            
            setProgress("Added " + num + " new " + phrase, ProgressBar.COMPLETE);
        } else if (num < 0){
            setProgress("ERROR: Cannot remove quotes this way", ProgressBar.ERROR);
        } else {
            //do nothing if num === 0
            setProgress("No new quotes added", ProgressBar.COMPLETE);
        } 
    },
    
    /** 
     * Add new quotes to the container.
     */
    addQuote: function () {
        var obj = this, quote;
        var foo = this.QUOTE_CLASS + this.TOTAL_NUM_QUOTES;
        
        if($("#quoteContainer").length > 0) {
            setProgress("Adding quote to container");
            quote = $(".quote.prototype").clone().show()
            .removeClass("prototype").addClass("live")
            .addClass(foo)
            .appendTo("#quoteContainer");
            
            setProgress("Attaching calculator to quote")
            $.extend(quote.get(0), QuoteCalculator);
            quote.get(0).setQuoteClass(foo);
            
            setProgress("Attaching object to extra fields container");
            var ePane = $(quote).find(".extraFields").get(0);
            ExtraFields.addExtraFields(ePane, foo.replace(this.QUOTE_CLASS, ""));
        
            setProgress("Binding event to remove button");
            //XXX check if removeQuoteButton and quote prototype exist
            $(quote).find(".removeQuoteButton").click(function() {
                setProgress("Removing quote...");
                $(quote).remove();
                obj.NUM_ACTIVE_QUOTES--;
                obj.updateNumQuotes();
                setProgress("Quote removed", ProgressBar.COMPLETE);
            });
            
            setProgress("Binding event to set all button");
            //XXX check if set-all button exists
            $(quote).find(".setAllButton").click(function() {
                setAll(foo);
            });
            
            setProgress("Adding quote to tab queue...");
            QuoteTool.addToTab(quote);
        
            this.TOTAL_NUM_QUOTES++;
            this.NUM_ACTIVE_QUOTES++;
            this.updateNumQuotes();
        
            setProgress("Added a new quote", ProgressBar.COMPLETE);
        } else {
            setProgress("FATAL ERROR: Could not find the container", ProgressBar.ERROR);
        }
    },
    
    /** Remove all quotes currently in the application */
    removeAllQuotes: function () {
        setProgress("Removing all quotes");
        
        if($(".removeQuoteButton").length > 0) {
            //click all removeQuote buttons
            $(".removeQuoteButton").click();
        }
        
        this.NUM_ACTIVE_QUOTES = 0;
        this.TOTAL_NUM_QUOTES = 0;
        this.updateNumQuotes();
        setProgress("Removed all quotes", ProgressBar.COMPLETE);
    },
    
    /** This is a temporary measure. Update the numQuotes field with the current number of quotes */
    updateNumQuotes: function() {
        if($("#numQuotes").length > 0) {
            $("#numQuotes").val(this.NUM_ACTIVE_QUOTES);
        }
    }
};
