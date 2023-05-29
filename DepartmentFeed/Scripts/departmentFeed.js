/* 
 * 
 * Written by Peter Tran Sept 28th, 2012.
 */

var DepartmentFeed = {
    
    /**
     * Given the department, append the department feed.
     */
    updateDepartmentFeed: function(department) {
     
        $.ajax({
            url: "/Intranet/DepartmentFeed/Backend/jobStatusHelper.php",
            type: "POST",
            dataType: "html",
            data: {
                type: "get_department_feed",
                department: department
            },
            success: function(html) {
                $("#" + department + "Feed").html(html);
            },
            error : function() {
                $("#" + department + "Feed").html("<h2>Could not load jobs</h2>");
            }
        });
        
    
    }
}

