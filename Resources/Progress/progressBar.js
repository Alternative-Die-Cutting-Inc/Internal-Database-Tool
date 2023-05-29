/******************************************************************************
 * This is an extension made to provide feedback during some loading process.
 * Only call the main method directly, as the rest are helper methods.
 * No additional modifications are required to the existing code.
 * 
 * NOTE: This file uses JQuery and there must be a JQuery library imported
 * ahead of it.
 * 
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * June 20, 2011
 * 
 ******************************************************************************/

/**
 * Set the progress message to the given message. Optionally, specify the step
 * number. By default, adds one to the current step number.
 * @param msg The progress message.
 * @param type TODO comment here
 */
function setProgress(msg, type) {
    if ($("#progress").length === 0) {
        //add a progress div to the top of body if it does not exist
        ProgressBar.createDiv(ProgressBar.MAIN_DIV);
    }
    
    ProgressBar.setMsg(msg, type);
    
    if($("#loadingImage").length > 0) {
        if(type === ProgressBar.ERROR || type === ProgressBar.COMPLETE) {
            $("#loadingImage").hide();
        } else {
            $("#loadingImage").show();
        }
    }
}

/**
 * Set the number of steps for the process to the given number.
 * TODO not used, maybe useless
 * @param num The number of steps.
 */
function setNumSteps(num) {
    if(num !== "" && !isNaN(num)) {
        ProgressBar.NUMSTEPS = num;
    }
}

/**
 * Add more steps to the loading process. 
 * This will result in the progress bar going backwards.
 * TODO not used, maybe useless
 * @param num The number of steps.
 */
function addSteps(num) {
    if(num !== "" && !isNaN(num)) {
        ProgressBar.NUMSTEPS += num;
    }
}

/**
 * Namespace for this file.
 */
var ProgressBar = {
    
    /**************************************************************************
     * *************************** CONSTANTS ******************************** *
     **************************************************************************/
    
    //constants denoting the different divs
    MAIN_DIV: 0,
    MSG_DIV: 1,
    PERCENT_DIV: 2,
    
    //constants denoting the different types of messages
    LOADING: 0,
    COMPLETE: 1,
    ERROR: 2,
    
    /**************************************************************************
     * *********************** VARIABLES / FUNCTIONS ************************ *
     **************************************************************************/
    
    /**
     * The status of the loading process. Whether an error has been found,
     * if stuff is still loading, etc.
     */
    PROGRESS_STATUS: this.LOADING,
    
    /** 
     * The number of steps that the process requires.
     * TODO kinda random...
     * TODO not used, don`t know if useful
     */
    NUMSTEPS: 10,
    
    /**
     * The step number which we are currently on.
     * TODO not used
     */
    CURRENT_STEP_NUM: 0,
    
    /**
     * Create the container for the given item and add it to the document in
     * the appropriate place.
     * @param item The item for which to create the container.
     */
    createDiv: function(item) {
        var div = $("<div></div>");
        
        switch(item) {
            case ProgressBar.MAIN_DIV:
                $("body").prepend($(div).attr('id', 'progress'));
                ProgressBar.createDiv(ProgressBar.MSG_DIV);
                
                //                ProgressBar.createDiv(ProgressBar.PERCENT_DIV);
                break;
            case ProgressBar.MSG_DIV:
                $("#progress").append(div.attr('id', 'progMsg'));
                break;
            case ProgressBar.PERCENT_DIV:
                $("#progress").append(div.attr('id', 'progContainer'));
                $("#progContainer").append($("<span></span>").attr("id", "progBars"));
                break;
                    
        }
    },
    
    /**
     * Set the progress message to the given message. If a type is given,
     * set the type as well.
     * @param msg The progress message.
     * @param type The type of message.
     */
    setMsg: function(msg, type) {
        if(type === undefined || type === null || isNaN(type) || 
            type < 0) {
            type = ProgressBar.LOADING;
        } 
        
        if($("#progress").find("#progMsg").length === 0) {
            ProgressBar.createDiv(ProgressBar.MSG_DIV);
        }
        
        var foo;
        
        switch(type) {
            case ProgressBar.COMPLETE:
                foo = "complete";
                break;
            case ProgressBar.ERROR:
                foo = "error";
                break;
            case ProgressBar.LOADING:
            default:
                foo = "loading";
                break;
        }
        
        $("#progMsg").html(msg)
        .removeClass("loading")
        .removeClass("error")
        .removeClass("complete")
        .addClass(foo);
        
        
    },
    
    /**
     * TODO not used...
     */ 
    setBars: function() {
        if($("#progContainer").length === 0) {
            ProgressBar.createDiv(ProgressBar.PERCENT_DIV);
        } else {
            $("#progBars").html("");
        }
        
        var width = $("#progContainer").attr('width');
        
        if(width === undefined || width === null) {
            width = "10";
        }
        
        //note that you cannot have more than 100 percent
        var percent = Math.min(this.CURRENT_STEP_NUM / this.NUMSTEPS, 1);
        
        var i;
        
        for(i = 0; i < percent * width; i++) {
            $("#progBars").text($("#progBars").text() + "|");
        }
    }
};
