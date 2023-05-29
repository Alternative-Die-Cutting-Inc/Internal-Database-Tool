
/*******************************************************************************
 *  Handle search sheet events. Do not handle searching or search request.
 *  TODO merge with searchButton.js
 *                                                                        
 * Written by Daniel Kats for Alternative Die Cutting, Inc.             
 * 23-Jun-2011

 * Updated by Peter Tran Jan 16th, 2012
 * Only the AdvancedSearch and AdvancedQuoteSearch is in use. These may be merged 
 * for efficiency.
 *                                                                      
 ******************************************************************************/

function addEvents() {
    $(".searchField").each(function() {
        $(this).click(function() {
            Search.parseSearchField(this);
        });
    });
    
    $(".searchTable").each(function() {
        $(this).click(function() {
            Search.parseSearchTable(this);
            Search.fixOptMenus();
        });
    });

    $("#advSearch").click(function() {
        AdvSearch.search();
        scrollToResults();

    });
    //Add adv search on enter link
    $(".advancedSearchContainer input").keypress(function(e) {
        code= (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                AdvSearch.search();
                scrollToResults();
            }
    });

    $("#searchBar").submit(function() {

    });

    //Add advQsearch on enter link
    $("#advQuoteSearch").click(function() {
        AdvQuoteSearch.search();
        scrollToResults();
    });
    $(".advancedQuoteSearchContainer input").keypress(function(e) {
        code= (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                AdvQuoteSearch.search();
                scrollToResults();
            }
    });
    InstantSearch.addEvent();
    
    Search.fixOptMenus();
                
//TODO add calendar
//    var calTable = makeCalendar($("#searchBar"));
//    $("#cal").append(calTable);
}

function scrollToResults() {
    $('html, body').animate({
            scrollTop: $("#bottomPane").offset().top + 'px'
        }, 'fast');
}

/**
 * This class was created to do searching as the user enters text into the 
 * textfield. This was made separate from Search to allow the user to continue
 * to use the current search system (activated by clicking the search button).
 */
var InstantSearch = {

    /** This indicates where a user in the middle of typing in the search box **/
    USER_ENTER_TEXT: false,
    
    /** This is the index in which to display the search results. */
    SEARCH_RESULTS_INDEX: 0,
    
    /** This is the total number of search results found. */
    SEARCH_RESULTS_TOTAL: 0,
    
    /** This is the number of results showed per page*/
    MAX_RESULTS: 100,
    
    /**
     * Add the event for the instant searching.
     */
    addEvent: function() {
        
        $("#searchBar").keypress(function(e) {
            code= (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                console.log("asdfd");
                InstantSearch.initiateSearch();
            }
        });
        $("#searchButton").click(InstantSearch.initiateSearch);
        $("#searchBar").submit(InstantSearch.initiateSearch);
        
    },
    
    /**
     * This function initiates the search.
     */
    initiateSearch: function () {
        InstantSearch.SEARCH_RESULTS_INDEX = 0;
            
        //If the user is entering a text, skip.
        if (InstantSearch.USER_ENTERING_TEXT) {
            return;
                
        //This statement is entered at the first sequence of text being entered.
        } else {
            InstantSearch.USER_ENTERING_TEXT = true;
            $("#bottomLeftPane").toggle(false);
            $("#bottomRightPane").toggle(false);
                
            //Execute the search after 0.2 seconds.
            setTimeout(
                function() {
                    var category = $(".searchTable.searchOptSel").text();
                    var field = $(".searchField.searchOptSel").text();
                    var searchString = $("#searchBar").val() + "";
                    InstantSearch.performSearch(category, field, searchString);
                    $("#results").toggle(true);
                    InstantSearch.USER_ENTERING_TEXT = false;
                }, 2000);                    
        }
    },
    
    /**
     * Given the category, field and input, perform the search and display it.
     */
    performSearch: function(category, field, searchString) {        
        //Set page links (based on number of queries)
        InstantSearch.setUpPages(category, field, searchString);
        InstantSearch.displayCurrentResults(category, field, searchString);
        
    //update results function (to current index?)
    },
    
    /**
     * Given the search information, set up the links and events to the pages
     * that represent the sub set of the search.
     */
    setUpPages: function(category, field, searchString) {
        InstantSearch.setTotalNumberOfResults(category, field, searchString);

        var indexVariable = 0;
        var resultHtmlCode = "";
        while (indexVariable < Math.ceil(InstantSearch.SEARCH_RESULTS_TOTAL/InstantSearch.MAX_RESULTS)) {
            resultHtmlCode += '<span class="pageIndex" name="' + indexVariable + '">&nbsp;&nbsp;' + (indexVariable + 1) + '&nbsp;&nbsp;</span>';
            indexVariable++;
        }
        $(".searchPages").html(resultHtmlCode);
        $(".pageIndex").live("click", function() {
            console.log("clicked");
            InstantSearch.SEARCH_RESULTS_INDEX = $(this).attr("name");
            InstantSearch.displayCurrentResults(category, field, searchString);
        });
    },
    
    /**
     * Given the category field and searchString, return the total number of 
     * rows returned from the query.
     */
    setTotalNumberOfResults: function (category, field, searchString) {
        
        $.ajax({
            url: "Search/InstantSearchHelper.php",
            type: "POST",
            dataType: "html",
            async: false,
            data: {
                type: "get_total",
                Category: category,
                Field: field,
                SearchString: searchString
            },
            success: function(html) {
                InstantSearch.SEARCH_RESULTS_TOTAL = html;
            },
            error : function() {
                $("#searchResults").html("<h2>Could not load search</h2>");
            }
        });
    },
    
    /**
     * Display the search results for the interval matching the current index.
     */
    displayCurrentResults: function (category, field, searchString) {
        $.ajax({
            url: "Search/InstantSearchHelper.php",
            type: "POST",
            dataType: "html",
            async: false,
            data: {
                type: "execute_query",
                Category: category,
                Field: field,
                SearchString: searchString,                
                Start: InstantSearch.SEARCH_RESULTS_INDEX * InstantSearch.MAX_RESULTS,
                Stop: InstantSearch.MAX_RESULTS
            },
            success: function(html) {
                $("#searchResults").html(html);
            },
            error : function() {
                $("#searchResults").html("<h2>Could not load search</h2>");
            }
        });
    }
}

var Search = {
    /***************************************************************************
     ******************* CONSTANTS *********************************************
     **************************************************************************/
    
    //TODO have these auto-generate span instead of hard-coding it
    
    TABLES: ["Quotes", "Jobs", "All"],
    
    FIELDS: ["Quote Number", "Docket Number", "Customer Po. Number", "Job Name",
    "Author"],
    
    /***************************************************************************
     ******************* FUNCTIONS *********************************************
     **************************************************************************/
    
    /** Num is used for recursion. Please do not specify. */
    fixOptMenus: function(num) {
        var containers = ["searchTable", "searchField"];
        
        if(num === undefined || num === null) {
            num = 0;
        } else if (num >= containers.length) {
            //done
            return;
        } 
        
        var container = "#" + containers[num] + "Container";
        var length = $(container).find(".searchOpt:visible").length;
        var width = 100 / length;
        var interval = 0.2;
                
        while(length * width >= 100) {
            width -= interval;
        }
                
        $(container).find("li").each(function() {
            $(this).css("width", width + "%");
        });
            
        this.fixOptMenus(num + 1);
        
    },
    
    selectSearchChoice : function (item, keyClass) {
        $("." + keyClass).each(function() {
            $(this).removeClass("searchOptSel");
        });
        
        $(item).addClass("searchOptSel");
    },
    
    parseSearchTable : function (item) {
        var supported = true;
        var choice = $(item).text();
        
        switch(choice) {
            case "Jobs":
                //show job-only fields
                $(".searchField.jobOnly").each(function() {
                    $(this).show();
                });
                
                //select docket number
                this.parseSearchField($("span:contains('Docket Number')"));
                break;
            case "All":
                
                //show job-only fields
                $(".searchField.jobOnly").each(function() {
                    $(this).show();
                });
                
                supported = !supported;
                break;
            case "Quotes":
                
                //hide job-only fields
                $(".searchField.jobOnly").each(function() {
                    $(this).hide();
                });
                
                //select quote number
                this.parseSearchField($("span:contains('Quote Number')"));
                break;
        }
        
        Search.selectSearchChoice(item, "searchTable");
        
        if(!supported) {
            $("#searchButton").attr('disabled', 'disabled');
        } else {
            $("#searchButton").removeAttr("disabled");
        } 
    },
    
    parseSearchField : function (item) {
        var calField = $("#cal");
        var searchBar = $("#searchBar");
        var supported = true;
        var choice = $(item).text();
        
        switch(choice) {
            case "Date":
                calField.show();
                searchBar.val("").attr('readonly', 'readonly');
                break;
            case "Tags":
            case "Docket Number":
                supported = !supported;
                break;
            default:
                searchBar.removeAttr('readonly');
                calField.hide();
                break;
        }
        
        Search.selectSearchChoice(item, "searchField");
    }
}  

var AdvSearch = {
    numberOfResults: 100,
    startSearch : 0,
    stopSearch : 100,
    search: function() {
        $("#bottomLeftPane").toggle(false);
        $("#bottomRightPane").toggle(false);
        $("#results").toggle(true);
        var Fields = {
            DocketNumber: $("#advDocketNumber").val(),
            QuoteNumber: $("#advQuoteNumber").val(),
            Customer: $("#advCustomer").val(),
            CustomerPoNo: $("#advCustomerPO").val(), 
            JobName: $("#advJobName").val(), 
            Finishing: $("#advFinishing").val(), 
            Quantity: $("#advNumberOfUnits").val(), 
            Form: $("#advFormName").val(),
            SpecialInstructions: $("#advSpecialInstructions").val()
        };
        $.ajax({
            url: "Search/advancedSearchHelper.php",
            type: "POST",
            dataType: "html",
            async: false,
            data: {
                type: "perform_search",
                fields: Fields,
                start: AdvSearch.startSearch,
                stop: AdvSearch.stopSearch
            },
            success: function(html) {
                $("#searchResults").html(html);
                console.log(html);
                $("#searchFooter").html('<button onclick="AdvSearch.prevPage()"class="nextPage">prev 100</button><button onclick="AdvSearch.nextPage()"class="nextPage">next 100</button>');
            }
        });
    },
    nextPage: function () {
        AdvSearch.startSearch += AdvSearch.numberOfResults;
        AdvSearch.stopSearch += AdvSearch.numberOfResults;
        AdvSearch.search();
    },
    prevPage: function () {
        if (AdvSearch.startSearch>0){
            AdvSearch.startSearch -= AdvSearch.numberOfResults;
            AdvSearch.stopSearch -= AdvSearch.numberOfResults;
            AdvSearch.search();
        }
    }
}

var AdvQuoteSearch = {
    numberOfResults: 100,
    startSearch: 0,
    stopSearch: 100,
    search: function() {
        $("#bottomLeftPane").toggle(false);
        $("#bottomRightPane").toggle(false);
        $("#results").toggle(true);
        var Fields = {
            Quote_Number: $("#advQQuoteNumber").val(),
            Customer: $("#advQCustomer").val(), 
            Job_Name: $("#advQJobName").val(), 
            Attention: $("#advQAttention").val(), 
            Description: $("#advQDescription").val(), 
            Notes: $("#advQNotes").val(),
            Author: $("#advQAuthor").val()
        };
        $.ajax({
            url: "Search/advancedSearchHelper.php",
            type: "POST",
            dataType: "html",
            async: false,
            data: {
                type: "perform_quote_search",
                fields: Fields,
                start: AdvQuoteSearch.startSearch,
                stop: AdvQuoteSearch.stopSearch
            },
            success: function(html) {
                console.log(html);
                $("#searchResults").html(html); 
                $("#searchFooter").html('<button onclick="AdvQuoteSearch.prevPage()"class="nextPage">prev 100</button><button onclick="AdvQuoteSearch.nextPage()"class="nextPage">next 100</button>');
            
            }
        });
        AdvQuoteSearch.startSearch += AdvQuoteSearch.numberOfResults;
        AdvQuoteSearch.stopSearch += AdvQuoteSearch.numberOfResults;
    },
    nextPage: function () {
        AdvQuoteSearch.startSearch += AdvQuoteSearch.numberOfResults;
        AdvQuoteSearch.stopSearch += AdvQuoteSearch.numberOfResults;
        AdvQuoteSearch.search();
    },
    prevPage: function () {
        if (AdvQuoteSearch.startSearch>0){
            AdvQuoteSearch.startSearch -= AdvQuoteSearch.numberOfResults;
            AdvQuoteSearch.stopSearch -= AdvQuoteSearch.numberOfResults;
            AdvQuoteSearch.search();
        }
    }
}