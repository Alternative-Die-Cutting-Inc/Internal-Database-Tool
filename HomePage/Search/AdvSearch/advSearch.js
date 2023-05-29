/**
 *
 * This file is made to respond to actions in the advanced search window.
 * --------------------------------------------------------------------
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * July 4, 2011
 * 
 */

var AdvancedSearch = {
    /***************************************************************************
     * ********************** CONSTANTS ****************************************
     **************************************************************************/
    
    STARTING_QUERY: "SELECT * FROM Quote_Information ",
    
    /**
     * Setting an arbitrary limit on the number of filters a person can make
     */
    MAX_FILTERS: 10,
    
    /***************************************************************************
     * ********************** VARIABLES ****************************************
     **************************************************************************/
    
    QUERY: this.STARTING_QUERY,
    
    /**
     * Number of filters currently in the advanced search.
     */
    NUM_ACTIVE_FILTERS: 0,
    
    /**
     * Total number of filters ever added to the advanced search. 
     * Used for unique naming.
     */
    TOTAL_NUM_FILTERS: 0,
    
    /**
     * Keeps track of the number of criteria by which to sort.
     */
    NUM_SORTS: 0,
    
    /***************************************************************************
     * ********************** FUNCTIONS ****************************************
     **************************************************************************/
    
    /**
     * Display the SQL query that results from the filters.
     */
    displayQuery: function() {
        $("#queryPane")
        .empty()
        .append($("<p></p>").html(this.QUERY))
        .append($("<input></input>").attr("type", "hidden").attr("name", "query").val(this.QUERY));
    },
    
    /**
     * Add another filter in its own container to the filter div.
     */
    addFilter: function() {
        if(this.NUM_ACTIVE_FILTERS >= this.MAX_FILTERS) {
            alert("Too many filters already");
            return;
        }
        
        //so the on-click event does not delete the wrong pane
        var currentNumFilters = this.TOTAL_NUM_FILTERS;
        
        var filter = $(".searchFilter.prototype")
        .clone().show()
        .addClass("filter" + currentNumFilters)
        .removeClass("prototype")
        .change(function() {
            AdvancedSearch.processFilterChoice($(this).val(), currentNumFilters);
        });
        
        var filterContainer = $("<div></div>")
        .addClass("filterContainer" + currentNumFilters);
        
        var removeButton = $("<span></span>").addClass("removeButton")
        .html("<img src='/Resources/Images/delete-icon.png' alt='X' height=20 width=20></img>")
        .click(function() {
            AdvancedSearch.NUM_SORTS -= $(filterContainer).find(".searchSort").length;
            
            $(filterContainer).remove();
            AdvancedSearch.NUM_ACTIVE_FILTERS--;
            AdvancedSearch.updateButtons();
        });
        
        $(filterContainer).append(removeButton).append(filter);
        $("#filterPane").append(filterContainer);
        
        this.NUM_ACTIVE_FILTERS++;
        this.TOTAL_NUM_FILTERS++;
    },
    
    /**
     * Add a sorting selection to the filter div.
     */
    addSort: function() {
        var field = null;
        
        if(this.NUM_SORTS > 0) {
            alert("cannot sort by more than one criteria");
        } else {
            field = $(".prototype.searchSort").clone().show()
            .removeClass("prototype").addClass("live");
            
            this.NUM_SORTS++;
        }
        
        return field;
    },
    
    processFilterChoice: function(choice, filterNumber) {
        var field = null;
        var container = ".filterContainer" + filterNumber;
        
        $(container).find(".filterField").each(function() {
            $(this).remove();
        });
        
        $(container).find(".searchSort").each(function() {
            AdvancedSearch.NUM_SORTS--;
            $(this).remove();
        });
        
        switch(choice) {
            case "None":
                //do nothing
                break;
            case "Sort":
                field = this.addSort();
                break;
            case "Author":
            case "Customer":
                field = this.addField(choice, filterNumber);
                break;
            default:
                alert("Not supported yet");
        }
        
        if(field !== null) {
            $(container).append(field);
        }
        
        this.updateButtons();
    },
    
    /**
     * Show/hide buttons based on number of active filters.
     */
    updateButtons: function() {
        //        alert(this.NUM_ACTIVE_FILTERS);
        
        if(this.NUM_ACTIVE_FILTERS > 0) {
            $("#goButton").show();
            $("#buildButton").show();
        } else {
            $("#buildButton").hide();
            $("#goButton").hide();
            $("#queryPane").empty();
        }
    },
    
    /**
     * Create a field with the given name and return it.
     */
    addField: function(name) {
        var field = $("<input></input>")
        .attr("id", name)
        .attr("type", "text")
        .addClass("filterField");
        
        return field;
    },
    
    /**
     * Build a query by processing the input fields and display it.
     */
    buildQuery: function() {
        var filters = new Array(), name;
        
        this.QUERY = this.STARTING_QUERY;
        
        if($(".filterField").length > 0) {
            this.QUERY += "WHERE ";
        }
        
        var fields = new Array();
        
        $(".searchFilter.prototype").find("option").each(function() {
            fields.push($(this).val());
        });
        
        $(".filterField").each(function(i) {
            name = $(this).attr("id");
            
            if($.inArray(name, filters) === -1) {
                filters.push(name);
                
                if(i > 0) {
                    //                    alert(name + " is not in the array");
                    AdvancedSearch.QUERY += "AND ";
                }
            } else {
                //                alert(name + " is in the array");
                AdvancedSearch.QUERY += "OR ";
            }
            
            AdvancedSearch.QUERY += name + ' LIKE "%' +
            $(this).val() + '%" ';
        });
        
        var sort = "";
        
        switch($(".searchSort.live").val() + "") {
            case "Date - Newest First":
                sort = "ORDER BY Date DESC";
                break;
            case "Date - Oldest First":
                sort = "ORDER BY Date ASC";
                break;
            case "Quote Number - Largest First":
                sort = "ORDER BY Quote_Number DESC";
                break;
            case "Quote Number - Smallest First":
                sort = "ORDER BY Quote_Number ASC";
                break;
            default:
                //do nothing
                break;
        }
        
        AdvancedSearch.QUERY += " " + sort;
        
        this.displayQuery();
        $("#goButton").removeAttr("disabled");
    }
}
