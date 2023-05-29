/*******************************************************************************
 * This file helps the home page to establish JQuery actions and fix some 
 * stylings dynamically.
 *                                                                         
 *                                                                    
 * Written by Daniel Kats for Alternative Die Cutting, Inc.                                       
 * Updated July 12, 2011                                                             
 *                                                                       
 ******************************************************************************/

/** Namespace for home page actions */
var Home = {
    
    IS_FIRST_LOAD: true,
    USER_ENTERING_TEXT: false,

    /** Prepare the home page */
    launch: function(email, id) {
        // setInterval(JobFeed.updateJobFeed, this.JOB_FEED_REFRESH_TIME * 1000);
        JobFeed.updateJobFeed(email, id, "");
        JobFeed.addSubscriptionsEvent();
        // setInterval(this.updateShipFeed(email, id, ""), this.JOB_FEED_REFRESH_TIME * 1000);
        this.updateShipFeed(email, id, "");
        this.setHiddenEvents(id);
        
    },
    
    /** Update the Shipment Feed: Move to its own js file? */
    updateShipFeed: function(email, id, company) {
        if (JobFeed.IS_FIRST_LOAD) {
            JobFeed.USER_EMAIL = email;
            JobFeed.USER_ID = id;
        }
        console.log("Renewing shipping feed");
        $.ajax({
            url: "ShipFeed/ShipFeed.php",
            type: "POST",
            dataType: "html",
            data: {
                show_shipments: "true",
                Company: company
            },
            success: function(html) {
                console.log('succes');
                $("#shipFeed").html(html);
                $(".shipThisDivOut").hover(
                    //Function to be called on hover of this div within the shipment feed.
                    function() {
                        //Make the div containing this div's entire background grey
                        $(this).parent().css('background-color', '#E5E5E5');
                    },
                    //Function to be called on hover off of this div witin the shipemnt feed.
                    function() {
                        //Make the div containing this div to have a white background
                        $(this).parent().css('background-color', '#FFFFFF');
                    })
                    
                //Call ship out method when this div is clicked.
                .click( function () {
                    var SessId = $(this).find("input")[0].value;
                    console.log(SessId);
                    ShipEdit.shipOutHelperWithSessId(SessId);
                    //Refresh page
                    Home.updateShipFeed(email, id, "");
                });
                if (Home.IS_FIRST_LOAD) {
                    Home.addFilterEvent(email, id);
                    Home.IS_FIRST_LOAD = false;
                }

            },
            error : function() {
                $("#shipFeed").html("<h2>Could not load shipments</h2>");
            }
        });
    },
    
    /**
     * Set the link to toggle the hidden links.
     */
    setHiddenEvents: function (id) {
        
        //Hide and show the quick input boxes
        $("#showLinks").click(function () {
            $("#hiddenLinks").toggle();
            $("#downArrows").toggle();
            $("#upArrows").toggle();
            $("#totalBox").toggle();
        }); 
        
        //Hide and show the personal Feed
        $("#personalFeedArrows").click(function () {
            $("#personalFeed").toggle();
            $("#personalDownArrows").toggle();
            $("#personalUpArrows").toggle();
            PersonalFeed.updatePersonalFeed(id);
        }); 
    },
    
    /**
     * Called after ship feed is loaded to add the event when a user submits
     * a company name to filter the ship feed by.
     */
    addFilterEvent: function(email, id) {
        $("form#shipFilter").keyup(function () {
            
            if (Home.USER_ENTERING_TEXT) {
                return;
            } else {
                Home.USER_ENTERING_TEXT = true;
                setTimeout(
                    function() {
                        var companyName = $("form#shipFilter").find("input")[0].value;
                        Home.updateShipFeed(email, id, companyName);
                        Home.USER_ENTERING_TEXT = false;
                    }, 200);
            }
        });
    }
};