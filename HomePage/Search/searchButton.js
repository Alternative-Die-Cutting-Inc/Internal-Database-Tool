/*******************************************************************************
 * Link user search selection with backend search mechanism.    
 * Send necessary info to the back end and display the backend  
 * response to the user.                                        
 * 
 * NOTE: This file uses JQuery and there must be a JQuery library imported
 * ahead of it.
 * 
 * Written by Daniel Kats for Alternative Die Cutting, Inc.     
 * June 22, 2011     
 *                                            
 ******************************************************************************/

/**
 * Search through the databases for the string found in the search bar
 * in the field specified by the searchType dropdown.
 */
function search() {
    
    $("#shipFeed").toggle(false);
    $("#jobFeed").toggle(false);
    var searchString = $("#searchBar").val() + "";
    var category = null, field = null;
 
    if($(".searchTable.searchOptSel").length === 1) {
        category = $(".searchTable.searchOptSel").text();
    }
    
    if($(".searchField.searchOptSel").length === 1) {
        field = $(".searchField.searchOptSel").text();
    }
    
    if(category !== null && field !== null && searchString !== "") {
        SearchEngine.prepare(category);
        SearchEngine.saveSearch(searchString, category, field);
        SearchEngine.launch(searchString, category, field);
    }
}

/**
 * Namespace for this file to not pollute static space.
 * Assumptions: 
 * 
 */
var SearchEngine = {
    
    /***************************************************************************
     **************************** CONSTANTS ************************************
     **************************************************************************/
    
    QUOTE_TABLE_HEADINGS : [
    'Quote Number', 
    'Customer', 
    'Attention', 
    'Job Name', 
    'Description', 
    'Notes', 
    'Number of Units', 
    'Total', 
    'Date', 
  //  'Type', 
    'Action'
    ],
    
    JOB_TABLE_HEADINGS: [
    'Docket Number',
    'Quote Number', 
    'Customer PO Number',
    'Customer', 
    'Production Person', 
    'Job Name', 
    'Finishing', 
    'Special Instructions', 
    'Number of Units', 
    'Sold For', 
    'Date', 
   // 'Type', 
    'Action'
    ],
    
    /* 
     * The data which will be displayed in the search results table.
     */
    TABLE_HEADINGS : new Array(),

    /***************************************************************************
     **************************** VARIABLES ************************************
     **************************************************************************/
    
    /* Store the selection from the previous search */
    PREV_SEARCH : {
        searchString: "",
        field: null,
        category: null
    },
    
    DEBUG: false,

    
    /***************************************************************************
     ***************************** FUNCTIONS ***********************************
     **************************************************************************/

    /**
      * Save the user's search.
      */
    saveSearch: function (searchString, category, field) {
        setProgress("Saving the search");
         
        this.PREV_SEARCH.searchString = searchString;
        this.PREV_SEARCH.field = field;
        this.PREV_SEARCH.category = category;
    },

    /**
     * Rerun the previous search but with a different starting index.
     */
    searchPrevious: function (start) {
        alert("starting search with " + start);
        
        if(isNaN(start)) {
            start = 0;
        } else {
            start  = parseInt(start);
        }
    
        if(SearchEngine.PREV_SEARCH.category !== null && 
            SearchEngine.PREV_SEARCH.field !== null && 
            SearchEngine.PREV_SEARCH.searchString !== "") {
        
            SearchEngine.prepare(SearchEngine.PREV_SEARCH.category);
            SearchEngine.launch(SearchEngine.PREV_SEARCH.searchString,
                SearchEngine.PREV_SEARCH.category, 
                SearchEngine.PREV_SEARCH.field, 
                start);
        }
    },

    /**
     * Prepare the page for searching. Creates all necessary containers and
     * resets all values. No other preparation/setup for a search is necessary.
     */
    prepare: function(category) {
        $("#progress").show();
        
        setProgress("Clearing search variables...");
        
        if($("#searchFooter").length === 0) {
            $(document).append($("<div></div>")
                .attr("id", "searchFooter")
                .html("<p>Showing <span id='numRows'></span> out of <span id='numResults'></span> results found. \
    The search completed in <span id='searchTime'></span> seconds. </p>"));
        }
        
        //reset the search time
        $("#searchTime").html("0");
        $("#numRows").html("0");
        $("#numResults").html("0");
        
        setProgress("Setting up results table...");
        
        if($("#searchResults").length === 0) {
            $(document).append($("<table></table>").attr("id", "searchResults"));
        }
    
        //initially empty the table
        var table = $("#searchResults").empty();
    
        var headerRow = $("<tr></tr>"), 
        protoRow = $("<tr></tr>").hide().attr("id", "searchRowPrototype");
    
        //pick the right table headings
        switch(category) {
            case "Quotes":
                this.TABLE_HEADINGS = this.QUOTE_TABLE_HEADINGS;
                break;
            case "Jobs":
            default:
                this.TABLE_HEADINGS = this.JOB_TABLE_HEADINGS;
                break;
        }
    
        $.each(SearchEngine.TABLE_HEADINGS, function(i){
            headerRow.append($("<th></th>").text(SearchEngine.TABLE_HEADINGS[i])); 
            protoRow.append($("<td></td>")
                .addClass((SearchEngine.TABLE_HEADINGS[i] + "").replace(/ /g, "_")));
        });
    
        table.append($("<thead></thead>").append(headerRow));
        table.append($("<tbody></tbody>").append(protoRow));
        
        setProgress("Setting up additional search features");
        
        var proto = $(".pageContainer.prototype");
        
        if($(".pageContainer.live").length < 2) {
            $("#searchResults")
            .before($(proto).clone().show().removeClass("prototype").addClass("live"))
            .after($(proto).clone().show().removeClass("prototype").addClass("live"));
        }
        
        $(".pageContainer.live").each(function() {
            $(this).find(".pages").empty();
        });
        
        setProgress("Setup complete, starting search...");
    },
    
    /**
     * Search for the given search string through the databases by the field
     * specified in opt. The tables are specified by category.
     * @param searchString The string being searched for. 
     * @param category The table being searched through. 
     * @param field The field being searched through.
     * @param start The starting index (optional).
     */
    launch: function (searchString, category, field, start) {
        if(start === undefined || start === null) {
            start = 0;
        }
        
        setProgress("Parsing search parameters");
        
        var dataType, i = 0, foundError = false;
        var translate = {
            "oj" : "Jobs",
            "nq" : "Quotes",
            "as" : "Tables"
        };
        
        switch(category) {
            case "Jobs":
                dataType = ["oj"];
                break;
            case "Quotes":
                dataType = ["nq"];
                break;
            default:
                setProgress("Could not parse category " + category, ProgressBar.ERROR);
                return;
        }
        
        while(i < dataType.length && !foundError) {
            setProgress("Searching through " + translate[dataType[i]] + "...");
            foundError = !this.startSearch(searchString, field, dataType[i], start);
            i++;
        }
        
        $("#beachball").hide();
        
        if(foundError) {
            setProgress("Could not complete the search because an error was found", ProgressBar.ERROR);
        } else {
            setProgress("Setting up further search options");
            this.setupPages();
            setProgress("Search complete", ProgressBar.COMPLETE);
        }
        
    },
    
    setupPages: function() {
        var numResults = parseInt($("#numResults").text());
        var numRows = parseInt($("#numRows").text());
        var numPages = numResults % numRows === 0 ? numResults / numRows : (numResults / numRows) + 1;
        
        //TODO how to find current page???
        
        var i, button;
        
        $(".pageContainer.live").each(function() {
            //add page numbers
            for(i = 1; i <= numPages; i++) {
                button = $("<span></span>")
                .addClass("pageButton")
                .addClass("searchOpt")
                .html(i);
                
                //TODO this 50 should be queried for from PHP file
                
                button = SearchEngine.prevSearchHelper(button, (i - 1) * 50);
                    
                $(this).find(".pages").append(button);
            }
        });
    },
    
    prevSearchHelper: function(item, num) {
        $(item).click(function() {
            //            alert(num);
            SearchEngine.searchPrevious(num);
        });
        
        return item;
    },
    
    /**
     * Start the search by making the AJAX request...
     * TODO maybe remove this method and merge it with its parent method
     * @param searchString The string being searched for.
     * @param searchOpt The column.
     * @param table The table being searched through.
     * @param start The starting index.
     */
    startSearch : function(searchString, searchOpt, table, start) {
        var foundError = false;
        var startTime = (new Date()).getTime();
        var endTime;
        
        $.ajax({
            url: "Search/search.php", 
            data: {
                search : searchString,
                opt : searchOpt,
                type: table,
                start: start
            },
            
            async: false, //so results come in the right order, also to alert of error
            
            success: function(xml) {
                setProgress("Parsing results...");
                makeTable($("#searchResults"), xml, SearchEngine.DEBUG);
                $("#results").show();
            },
            
            error: function(xml) {
                //TODO be more specific with error
                foundError = true;
            },
            
            dataType: "xml"
        });
        
        endTime = (new Date()).getTime();
        console.log(endTime - startTime);
        
        return !foundError;
    }
};

/**
Toggle the advanced search div.
**/
function toggleAdvancedSearch() {
    $(".advancedSearchContainer").toggle(true);
    $("#searchBarContainer").toggle(false);
}
/**
Toggle the advanced search div.
**/
function toggleAdvancedQuoteSearch() {
    $(".advancedQuoteSearchContainer").toggle(true);
    $("#searchBarContainer").toggle(false);
}