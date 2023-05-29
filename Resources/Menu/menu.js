
/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.
 * Updated July 25, 2011    
 * --------------------------------------------------------------------------
 * Used to dynamically style the menu. It is assumed that the menu is styled
 * as described in menu.css.
 * 
 * NOTE: This file uses JQuery and expects it to be imported
 ******************************************************************************/

/** Namespace for menu to not pollute static space. */
var Menu = {
    /**
     * The main method. Dynamically style the menu.
     */
    fixMenu: function() {
        this.fixMenuItemWidth();
        this.fixWrapperMargin();
    },
    
    /** Style all menu items so they are equally wide. */
    fixMenuItemWidth: function() {
        var length = $(".menuButton").length;
        var width = 100 / length;
        var interval = 0.2;
                
        while(length * width >= 100) {
            width -= interval;
        }
                
        $("#menu").find("li").each(function() {
            //set all li widths to be equal
            $(this).css("width", width + "%");
            //set the span width equal to the LI width
            $(this).find("span").css("width", width + "%").height(0);
        });
    },
    
    /** Style the wrapper (immediately below menu) to not overlap with menu. */
    fixWrapperMargin: function() {
        var height = $(".menuButton").height();
        $("#wrapper").css("margin-top", (height + 20) + "px");
    }
};
