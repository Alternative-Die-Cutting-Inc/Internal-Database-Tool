/* 
 * Written by Peter Tran Oct 11th, 2012.
 * 
 * This file contains the PersonalFeed Class who's methods
 * are do everything required for the personal feed.
 */

var PersonalFeed = {
    
    /**
     * Given a userId and a docket number, subscribe the user to the job
     * by adding the pair into the PersonalFeedSubscription mysql table.
     */
    subscribeUserToJob: function(userId, docketNumber) {
        $.ajax({
            url: "/Intranet/HomePage/PersonalFeed/Backend/personalFeedHelper.php",
            type: "POST",
            data: {
                type: "subscribe_job",
                id:  userId,
                DocketNumber: docketNumber
            },
            success: function() {
                $("#personalFeed").toggle(true);
            $("#personalDownArrows").toggle(false);
            $("#personalUpArrows").toggle(true);
            PersonalFeed.updatePersonalFeed(userId);
            window.scrollTo(0, 0);
            }
            
        });
    },
     
    /**
      * Given the userId, set the personal feed in the personalfeed div.
      */
    updatePersonalFeed: function(userId) {
        $.ajax({
            url: "/Intranet/HomePage/PersonalFeed/Backend/personalFeedHelper.php",
            type: "POST",
            data: {
                type: "get_feed",
                id: userId
            },
            success: function(html) {
                $("#personalFeed").html(html);
                PersonalFeed.addEvents(userId);
            }
        })
    },
     
    /**
      * Add all the "onclick" events for the personal feed.
      * Events: Unsubscribe button.
      */
    addEvents: function(userId) {
        PersonalFeed.addUnsubscribeEvent(userId);
        PersonalFeed.addDeliverySlipPreviewEvent();
    },
     
    /**
      * Add the unsubscribe functionality to the ".unsubscribeSpan" within
      * the personal feed.
      */
    addUnsubscribeEvent: function(userId) {
        $("#personalFeed .personalJob span.unsubscribeSpan").live("click", function(e) {
            var docketNumber = $(this).parent().parent().find("input")[0].value;
            $.ajax({
                url: "/Intranet/HomePage/PersonalFeed/Backend/personalFeedHelper.php",
                type: "POST",
                data: {
                    type: "unsubscribe_job",
                    id: userId,
                    DocketNumber: docketNumber
                }
            });
            PersonalFeed.updatePersonalFeed(userId);
        });
    },
    
    /**
     * Add an event to the deliery slip preview. Once clicked, submit
     * the form the div is in. 
     */
    addDeliverySlipPreviewEvent: function() {
        $("#personalFeed .personalJob > div .deliverySlipPreview").live("click", function() {
            $(this).find("form").submit();
        })
    }
    
}

