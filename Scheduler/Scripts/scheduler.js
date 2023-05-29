 /* 
 * This file manages the events, database calls and all functionality needed
 * to manage the Scheduler application.
 */

var Scheduler = {

    /* The name of the user. */
    NAME: "notSet",
    /* The name of the page being loaded. */
    DEPARTMENT: "notSet",
    
    /**
     * Prepare the page and all events needed.
     **/
    launch: function(name, page) {
        Scheduler.NAME = name;
        Scheduler.DEPARTMENT = page;

        //Populate day conatiners...
        Scheduler.generateContainers();
        Scheduler.updateContainers();
        Scheduler.addEvents();        
        Scheduler.addSortableFunctionality();

        jQuery(".week").hide();
        //toggle the componenet with class msg_body
        jQuery(".weekButton").click(function() {
            var container = $(this).attr("id");
            $("." + container).slideToggle(100);
        });

        //Applies to copying a sortable job
        $( ".draggable" ).draggable({
            connectToSortable: ".sortable",
            helper: "clone",
            revert: "invalid",
            handle: ".copy"
        });
        //Applies to ghost job
        $( "#draggable" ).draggable({
            connectToSortable: ".sortable",
            helper: "clone",
            revert: "invalid",
            stop: function(event, ui) {
                Scheduler.addEvents();
            }
        });
        //Copied from jQueryUI website, not sure why we need it.
         // $("div").disableSelection();

        Scheduler.adjustCSS();

        Scheduler.addNavigation();

    },

    /**
     * Generate the containers that hold the jobs. Generate the divs for 
     * the current week, the days for each day of the current week, and the next week
     * and the week after.
     */
    generateContainers: function () {
        $.ajax({
                url: "/Intranet/Scheduler/Backend/SchedulerHelper.php",
                type: "POST",
                dataType: "html",
                async: false,
                data: {
                    type: "generate_containers",
                    department: Scheduler.DEPARTMENT
                },
                success: function(html) {
                    $("body").append(html);
                },
                error: function(message) {
                    $("body").html(message);
                }
            });
    },

    /**
     * Find the containers to be updated and update them.
     */
    updateContainers: function() {
        $.ajax({
                url: "/Intranet/Scheduler/Backend/SchedulerHelper.php",
                type: "POST",
                async: false,
                dataType: "json",
                data: {
                    type: "get_current_containers",
                },
                success: function(array) {
                    Scheduler.updateContainersHelper(array);  
                },
                error: function(message) {
                    $(body).html(message);
                }
            });
    },

    /**
     * Given an array of days, update the div container with jobs for each day.
     */
    updateContainersHelper: function (days) {
        for (var i = 0; i < days.length; i++) {
            var day = days[i];
            $.ajax({
                url: "/Intranet/Scheduler/Backend/SchedulerHelper.php",
                type: "POST",
                dataType: "html",
                async: false,
                data: {
                    type: "get_jobs_for_day",
                    day: day,
                    department: Scheduler.DEPARTMENT
                },
                success: function(html) {
                    $("#" + day).html(html);
                },
                error: function(message) {
                    $("#" + day).html(message);
                }
            });
        }
    },

    /**
     * Add all the JQuery methods/mini tasks that involve setting events for
     clicking parts of the page. 
     In particular:
        -dismissing job
        -save notes
        -lock notes
        -expand(show more information on a job)
     */
    addEvents: function() {
        $(".dismiss").live("click", function() {
            var JobDiv = $(this).parent();
            var JobContainerDiv = JobDiv.parent();
            JobContainerDiv[0].removeChild(JobDiv[0]);
            //Save change
            Scheduler.saveDayContainer(JobContainerDiv.attr("id"));
        });

        Scheduler.addSaveNotesFunctionality();

        Scheduler.addLockFunctionality();
    },
    
    /**
     * Given the name of a Day, save the current state of its containing div.
     */
    saveDayContainer: function (Day) {

        var jobs = '';
        $("#" + Day + " .DocketNumber").each(function() {
            jobs += $(this).val() + ',';
        });
        jobs = jobs.slice(0, jobs.length-1);
        $.ajax({
            url: "/Intranet/Scheduler/Backend/SchedulerHelper.php",
            type: "POST",
            dataType: 'html',
            data: {
                jsonJobs: jobs,
                type: "save_day_schedule",
                day: Day,
                department: Scheduler.DEPARTMENT
            },
            success: function(response) {
                console.log(response);
                // Scheduler.updateDayContainer(Day);
                
            },
            error : function(response) {
            }
        });
    },

    addSaveNotesFunctionality: function() {

        //Makes textarea clickable?
        $('.notes').bind('click.sortable mousedown.sortable',function(ev){
                ev.target.focus();  
        });

        //Show save button on click of textarea
        $(".notes").click(function () {
            $(this).parent().parent().find(".saveButton").toggle(true);
        });

        //Save notes
        $(".saveButton").click(function() {
            var Notes = $(this).parent().find(".notes").val();
            var DocketNumber = $(this).parent().find(".DocketNumber").val();
        
            $.ajax({
                url: "/Intranet/Scheduler/Backend/SchedulerHelper.php",
                type: "POST",
                dataType: "html",
                data: {
                    type: "save_notes",
                    docketNumber: DocketNumber,
                    notes: Notes,
                    user: Scheduler.NAME
                },
                success: function(html) {
                    console.log(html);
                },
                error: function(html) {
                    console.log(html);
                }
            });

            $(this).toggle();
            var dayContainer = $(this).parent().parent().attr("id");
            Scheduler.updateContainersHelper([dayContainer]); 
        });

        //Save ghost note as "DocketNumber"
        $(".ghostSave").click(function() {
            var notesWithSpace = $(this).parent().find(".notes").val();
            var Notes = notesWithSpace.replace(/\s+/g, '');
            //Add the notes as the class (for identification)
            $(this).parent().find("input").val(Notes);
            
            //save container
            var Day = $(this).parent().parent().attr("id");
            Scheduler.saveDayContainer(Day);
            //Hide save button
            $(this).toggle();
        });
    },

    /**
     * Add the lock/unlock draggable functionality and add and remove
     * classes as needed to make the CSS applicable.
     */
    addLockFunctionality: function () {
        $(".locked").each(function() {
            $(this).find(".unlock").toggle(true);
        });
        $(".unlocked").each(function() {
            $(this).find(".lock").toggle(true);
        });
        //Add lock draggability
        $(".lock").click(function() {
            //Visual stuff
            $(this).parent().removeClass("unlocked");
            $(this).parent().addClass("locked");
            
            //Backend
            var DocketNumber = $(this).parent().find(".DocketNumber").val();
            $.ajax({
                url: "/Intranet/Scheduler/Backend/SchedulerHelper.php",
                type: "POST",
                dataType: "html",
                data: {
                    type: "lock_job",
                    docketNumber: DocketNumber,
                    value: 1
                },
                success: function(html) {
                    console.log(html);
                },
                error: function(html) {
                    console.log(html);
                }
            });
            $(this).toggle(false);
            $(this).parent().find(".unlock").toggle(true);
            Scheduler.launch();
        });

        $(".unlock").click(function() {
            //Visual stuff
            $(this).parent().removeClass("locked");
            $(this).parent().addClass("unlocked");
            
            //Backend
            var DocketNumber = $(this).parent().find(".DocketNumber").val();
            $.ajax({
                url: "/Intranet/Scheduler/Backend/SchedulerHelper.php",
                type: "POST",
                dataType: "html",
                data: {
                    type: "lock_job",
                    docketNumber: DocketNumber,
                    value: 0
                },
                success: function(html) {
                    console.log(html);
                },
                error: function(html) {
                    console.log(html);
                }
            });

            $(this).toggle(false);
            $(this).parent().find(".lock").toggle(true);
        });
    },

    /**
     * Add the sortable functionality to the application.
     * The chunks of code represent different settings.
     */
    addSortableFunctionality: function() {
        //Move the following into helper function
        $('.sortable').sortable(                
        //Allows divs within sortable to be dragged into other "sortable" divs
        //asdfasdfdsfs
        {
            connectWith: '.sortable'
        },
        
        //This function is called when a div with class "sortable"'s 
        //contents change.
        {
            update: function(event, ui) {
                var container = $(this).attr("id");
                Scheduler.saveDayContainer(container);
            }
        },
        //Mix draggable with this
        {revert: true},
        {items: "li:not(.locked)"}
        );
    },

    /**
     * Adjust CSS to make things fit better. (width of JobBank)
     */
    adjustCSS: function()  {
        var numberOfJobs = $('#JobBank li').length;
        var widthOfJob = 180;
        document.getElementById('JobBank').style.width = (numberOfJobs*widthOfJob + 300) + "px";
    },

    /**
     * Add navigation.
     */
     addNavigation: function() {
        $.ajax({
                url: "/Intranet/Scheduler/Backend/SchedulerHelper.php",
                type: "POST",
                dataType: "html",
                data: {
                    type: "get_navigation"
                },
                success: function(html) {
                    $("body").append(html);
                },
                error: function(html) {
                    console.log(html);
                }
            });
     }
}

/**
 * Given the a javascript day object, return the Monday of that day.
 */
function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}


