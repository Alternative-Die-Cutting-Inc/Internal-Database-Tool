/* 
 * Written by Peter Tran Aug 24th, 2012.
 * 
 * This file stores all the functions needed to update/load the job feed in the
 * home page.
 */

var JobFeed = {
   
    IS_FIRST_LOAD: true,
    USER_ENTERING_TEXT: false,
    USER_EMAIL: "notset",
    USER_ID: "0",
    
    /** Update the job feed */
    updateJobFeed: function(email, id, customer) {
        if (JobFeed.IS_FIRST_LOAD) {
            JobFeed.USER_EMAIL = email;
            JobFeed.USER_ID = id;
        }
        console.log("Renewing job feed");
        
        $.ajax({
            url: "/Intranet/HomePage/JobFeed/JobFeed.php",
            type: "POST",
            dataType: "html",
            data: {
                show_jobs: "true",
                Email: email,
                Id: id,
                Customer: customer
            },
            success: function(html) {
                $("#jobFeed").html(html);
                if (JobFeed.IS_FIRST_LOAD) {
                    JobFeed.addFilterEvent(email, id);
                    JobFeed.IS_FIRST_LOAD = false;
                    JobFeed.addSubscriptionsEvent();
                }
            },
            error : function() {
                $("#jobFeed").html("<h2>Could not load jobs</h2>");
            }
        });
        
    },
    
    /*
     * Add the toggle feature to the subscription boxes and other features that
     * I don't know I want yet.
     */
    addSubscriptionsEvent: function() {
        console.log("Adding subscribe to job.");
        //Need to use Live instead of just click because:
        //http://stackoverflow.com/questions/2416200/dynamically-added-html-elements-cant-be-found-using-jquery
        console.log($(".addToPersonalFeedButton"));
        $(".addToPersonalFeedButton").click(function() {
            console.log("adsfdsf");
            //Change the class... Idky
            $(this).toggleClass("trigger_active").next('.subscriptionBox').toggle();
        });
        
        //When someone clicks the ".subSpan" span within the job feed,
        //we want to log the docket number for the job into the 
        //PersonalFeedSubscription table with the user's id.
        $("#jobFeed span.subSpan").click( function(e) {
            var docketNumber = $(this).find("input.docketNumber")[0].value;
            var userId = $(this).find("input.id")[0].value;
            PersonalFeed.subscribeUserToJob(userId, docketNumber)
        });
    },
    
    /**
     * Set the given email and id into the subscription forms as input.
     */
    addSessionInfo: function(email, id) {
        var inputs = '<input type="hidden" name="email" value="' + email + '"/>';
        inputs += '<input type="hidden" name="id" value="' + id + '"/>';
        $("form .subscription").livequery();
    },
    
    /**
     * Called after job feed is loaded to add the event when a user submits
     * a company name to filter the job feed by. 
     */
    addFilterEvent: function(email, id) {
        $("form#jobFilter").keyup(function () {
            if (JobFeed.USER_ENTERING_TEXT) {
                return;
            } else {
                JobFeed.USER_ENTERING_TEXT = true;
                setTimeout(                
                    function() {
                        var companyName = $("form#jobFilter").find("input")[0].value;
                        JobFeed.updateJobFeed(JobFeed.USER_EMAIL, JobFeed.USER_ID, companyName);
                        JobFeed.USER_ENTERING_TEXT = false;
                    }, 200);
            }        
        });
    }
};


