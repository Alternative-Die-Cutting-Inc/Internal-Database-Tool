
/*******************************************************************************
 * Written by Daniel Kats for Alternative Die Cutting, Inc.      
 * Last updated on 15-Aug-2011                                                         
 *******************************************************************************
 * A JQuery-powered calendar.
 * NOTE: Uses JQuery
 ******************************************************************************/

/**
 * The namespace for the calendar.
 */
var Calendar = {
    /***************************************************************************
     ******************************** CONSTANTS ********************************
     **************************************************************************/
    
    /**
     * Full month names as strings.
     */
    MONTHS: ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"],
    /**
     * Abbreviations for days of the week as strings.
     */
    DAYS_OF_WEEK: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    
    /**
     * JQuery selector for the container.
     * Default is div with class calendar
     */
    CONTAINER_SELECTOR: "div.calendar",
    /**
     * JQuery selector for the calendar body (the table with dates)
     * By default, the calendar body should be the only table in the container
     */
    CALENDAR_BODY: "table",
    /**
     * JQuery selector for the tag where the year is displayed.
     * Defaults to span with class calendarYear.
     */
    CAL_YEAR: "span.calendarYear",
    /**
     * JQuery selector for the tag where the month is displayed.
     * Defaults to span with class calendarMonth.
     */
    CAL_MONTH: "span.calendarMonth",
    /**
     * JQuery selector for the button, when clicked, switches the calendar to
     * today's date.
     */
    TODAY_BUTTON: ".todayButton",
    
    /***************************************************************************
     ******************************** VARIABLES ********************************
     **************************************************************************/
    
    /**
     * Month the calendar is set to.
     * Set to invalid month initially so as to detect change when set.
     */
    MONTH: -1,
    /**
     * Day of the month the calendar is set to.
     * Set to invalid date initially so as to detect change when set.
     */
    DATE: 0,
    /**
     * Year the calendar is set to.
     */
    YEAR: 2010,
    
    /***************************************************************************
     ******************************** FUNCTIONS ********************************
     **************************************************************************/
    
    /**
     * Initialize this Calendar by binding it to the given container's DOM.
     */
    init: function(container) {
        if($(container).length > 0) {
            var dom = $(container).get(0);
            
            $.extend(dom, Calendar);
            dom.CONTAINER_SELECTOR = container;
            
            //NOTE: this bit also creates the table
            dom.setTodaysDate();
            
            //this has to be called after the table is created
            dom.addEvents();
        }
    },
    
    /**
     * Add events to the container.
     */
    addEvents: function() {
        var obj = this;
        
        if($(this.CONTAINER_SELECTOR).length > 0) {
            this.addDateEvents();
            
            $(this.CONTAINER_SELECTOR).find(".prevYear").click(function() {
                obj.setPrevYear();
                //re-add onclick events after dates are reloaded
                obj.addDateEvents();
            });
                    
            $(this.CONTAINER_SELECTOR).find(".prevMonth").click(function() {
                obj.setPrevMonth();
                //re-add onclick events after dates are reloaded
                obj.addDateEvents();
            });
                    
            $(this.CONTAINER_SELECTOR).find(".nextYear").click(function() {
                obj.setNextYear();
                //re-add onclick events after dates are reloaded
                obj.addDateEvents();
            });
                    
            $(this.CONTAINER_SELECTOR).find(".nextMonth").click(function() {
                obj.setNextMonth();
                //re-add onclick events after dates are reloaded
                obj.addDateEvents();
            });
            
            if($(this.CONTAINER_SELECTOR).find(this.TODAY_BUTTON).length == 0) {
                $(this.CONTAINER_SELECTOR).append($("<div></div>").addClass("todayButtonContainer")
                .append($("<span></span>").addClass("todayButton").text("Today")));
                this.TODAY_BUTTON = ".todayButton";
            }
            
            $(this.CONTAINER_SELECTOR).find(this.TODAY_BUTTON).click(function() {
                obj.setTodaysDate();
            });
        }
    },
    
    /**
     * Add all events to the calendar dates.
     * Assumes container exists.
     */
    addDateEvents: function() {
        var date;
        var obj = this;
        
        //unbind previous events because this function can 
        //be called multiple times
        $(this.CONTAINER_SELECTOR).find("span.date").unbind().click(function() {
            date = $(this).text().toString().replace(/\s/g, "");
            
            obj.setDate(date);
        });
    },
    
    /**
     * XXX for debugging
     * Log the date the calendar is set to to the console.
     */
    shout: function() {
        var month = "month not set";
        
        if(this.MONTH >= 0 && this.MONTH < this.MONTHS.length) {
            month = this.MONTHS[this.MONTH];
        }
        
        console.log("Calendar date set to " + month + " " + this.DATE + ", " + this.YEAR);
    },
    
    /**
     * Set the date for the calendar.
     * @param day Set the day of the month (default to currently set day)
     * @param month Set the month (default to currently set month)
     * @param year Set the year (default to currently set year)
     */
    setDate: function(day, month, year) {
        if(day === undefined || day === null) {
            day = this.DATE;
        }
        
        if(month === undefined || month === null) {
            month = this.MONTH;
        }
        
        if(year === undefined || year === null) {
            year = this.YEAR;
        }
        
        if(this.MONTH !== month || this.YEAR !== year) {
            this.MONTH = month;
            this.YEAR = year;
            //redraw the calendar
            this.drawCalendar();
        }
        
        this.DATE = day;
        
        //XXX for debugging
        this.shout();
        
        //update the selection on the calendar to reflect changes made
        this.updateGraphics();
    },
    
    /**
     * Reset the year to the next year.
     */
    setNextYear: function() {
        //do not set the instance variables directly here
        //this is done to trigger the redrawing events
        this.setDate(this.DATE, this.MONTH, this.YEAR + 1);
    },
    
    /**
     * Reset the year to the previous year.
     */
    setPrevYear: function() {
        //do not set the instance variables directly here
        //this is done to trigger the redrawing events
        this.setDate(this.DATE, this.MONTH, this.YEAR - 1);
    },
    
    /**
     * Reset the month to the next month.
     */
    setNextMonth: function() {
        //do not set the instance variables directly here
        //this is done to trigger the redrawing events
        var year = this.YEAR;
        var month = this.MONTH + 1;
        
        if(month === 12) {
            month = 0;
            year++;
        }
        
        this.setDate(this.DATE, month, year);
    },
    
    /**
     * Reset the month to the previous month.
     */
    setPrevMonth: function() {
        //do not set the instance variables directly here
        //this is done to trigger the redrawing events
        var year = this.YEAR;
        var month = this.MONTH - 1;
        
        if(month < 0) {
            month = 11;
            year--;
        } 
        
        this.setDate(this.DATE, month, year);
    },
    
    /**
     * Helper class to updateGraphics.
     * This function adds a scroller that allows switching between months/years.
     */
    addScroller: function(type) {
        var scroller = $("<div></div>").addClass(type + "ScrollerContainer")
        .addClass("calendarScroller");
        var prevClass = "", nextClass = "", textClass = "";
        
        switch(type) {
            case "month":
                prevClass = "prevMonth";
                nextClass = "nextMonth";
                textClass = "calendarMonth";
                break;
            case "year":
                prevClass = "prevYear";
                nextClass = "nextYear";
                textClass = "calendarYear";
                break;
            default:
                //do nothing
                break;
        }
        
        $(scroller).append($("<span></span>").addClass("prevButton").addClass(prevClass).text("<<"))
        .append($("<span></span>").addClass(textClass))
        .append($("<span></span>").addClass("nextButton").addClass(nextClass).text(">>"));
        
        //add to the top
        $(this.CONTAINER_SELECTOR).prepend(scroller);
    },
    
    /**
     * Update the graphics to relfect changes made in the model.
     */
    updateGraphics: function() {
        var obj = this;
        
        if($(this.CONTAINER_SELECTOR).length === 0) {
            //cannot do anything if container not set
            return;
        }
        
        if($(this.CONTAINER_SELECTOR).find(this.CAL_MONTH).length === 0) {
            this.addScroller("month");
        }
        
        if($(this.CONTAINER_SELECTOR).find(this.CAL_YEAR).length === 0) {
            this.addScroller("year");
        }
        
        $(this.CONTAINER_SELECTOR).find(this.CAL_YEAR).text(this.YEAR);
        $(this.CONTAINER_SELECTOR).find(this.CAL_MONTH).text(this.MONTHS[this.MONTH]);
        
        if($(this.CONTAINER_SELECTOR).find(this.CALENDAR_BODY).length > 0) {
            $(this.CONTAINER_SELECTOR).find(this.CALENDAR_BODY).find("span.date").removeClass("selected");
             
            $(this.CONTAINER_SELECTOR).find(this.CALENDAR_BODY).find("span.date").filter(function(){
                return $(this).text().toString().replace(/\s/g, "") === obj.DATE.toString();
            }).addClass("selected");
        }
    },
    
    /**
     * Draw the calendar, or redraw it.
     * Return true if draw was successful, false otherwise.
     * @return True if could render, false otherwise.
     */
    drawCalendar: function() {
        if($(this.CONTAINER_SELECTOR).length === 0) {
            //cannot do anything if container not found
            return false;
        }
        
        if($(this.CONTAINER_SELECTOR).find(this.CALENDAR_BODY).length === 0) {
            if($(this.CONTAINER_SELECTOR).find("table")) {
                $(this.CONTAINER_SELECTOR).find("table").remove();
            }
            
            $(this.CONTAINER_SELECTOR).append($("<table></table>").append(this.drawTableHeader())
                .append($("<tbody></tbody>")));
            
            this.CALENDAR_BODY = "table";
        }
        
        if($(this.CONTAINER_SELECTOR).find(this.CALENDAR_BODY).find("tbody").length === 0) {
            $(this.CONTAINER_SELECTOR).find(this.CALENDAR_BODY).empty().append($("<tbody></tbody>"));
        }
        
        //empty the table body and add the days of the month with the correct
        //padding
        this.drawTableDays();
        
        return true;
    },
    
    /**
     * This is a helper function for drawCalendar. It adds the dates to the
     * table body of the calendar. It *assumes* that all selectors are valid.
     */
    drawTableDays: function() {
        var body = $(this.CONTAINER_SELECTOR).find(this.CALENDAR_BODY).find("tbody");
        
        var lastDayOfMonth = this.daysInMonth(this.MONTH, this.YEAR);
        var firstWeekDayOfMonth = this.firstMonthWeekday(this.MONTH, this.YEAR);
        
        
        var date = 0;
        var row, dayOfWeek, elem;
        
        //remove all the dates from the body
        $(body).empty();
        
        row = $("<tr></tr>");
        row = this.padBefore(row);
        
        for(date = 1; date <= lastDayOfMonth; date++) {
            elem = $("<span></span>").addClass("date");
            
            //-1 because dates start at 1, days of week at 0
            dayOfWeek = (date - 1 + firstWeekDayOfMonth) % 7;
            
            if(dayOfWeek === 0) {
                $(body).append(row);
                row = $("<tr></tr>");
            }
            
            if(dayOfWeek === 0 || dayOfWeek === 6) {
                $(elem).addClass("weekendDate");
            } else {
                $(elem).addClass("weekdayDate");
            }
            
            //this is to add extra space for spacing
            if(date < 10) {
                $(elem).html("&nbsp;" + date + "&nbsp;");
            } else {
                $(elem).text(date);
            }
            
            
            
            $(row).append($("<td></td>").append(elem));
        }
        
        $(body).append(row);
    },
    
    /**
     * Return the index of the first day of the week for the given month.
     * @param month The month index.
     * @param year The full year.
     * @return The index of the first day of the week for the given month.
     * 
     */
    firstMonthWeekday : function(month, year) {
        return (new Date(year, month, 1)).getDay();
    },
    
    /**
     * Get the number of days in the given month.
     * @param month The month index.
     * @param year The full year.
     * @return Number of days in the specified month.
     */
    daysInMonth: function (month, year) {
        return 32 - new Date(year, month, 32).getDate();
    },
    
    /**
     * Pad the table with empty columns before the first of the month.
     * @param row The <tr> tag.
     * @return The table row, modified.
     */
    padBefore: function(row) {
        var i, firstWeekDayIndex, firstDayOfMonth;
        
        firstWeekDayIndex = this.firstMonthWeekday(this.MONTH, this.YEAR);
        i = 0;
        
        for(; i < firstWeekDayIndex; i++) {
            $(row).append("<td></td>");
        }
        
        return $(row);
    },
    
    /**
     * This is a helper function for drawCalendar. It returns the head of 
     * the table with added days of the week as table elements. Relevant span
     * tags are included.
     */
    drawTableHeader: function() {
        var headRow = $("<tr></tr>");
        var elem, obj = this;
        
        $.each(this.DAYS_OF_WEEK, function(i) {
            elem = $("<span></span>").addClass("dayHeader");
            
            if(i === 0 || i === 6) {
                $(elem).addClass("weekendHeader");
            } else {
                $(elem).addClass("weekdayHeader");
            }
            
            $(elem).text(obj.DAYS_OF_WEEK[i]);
            headRow.append($("<th></th>").append(elem));
        });
        
        return $("<thead></thead>").append(headRow);
    },
    
    /**
     * Set the date to today's date.
     */
    setTodaysDate: function() {
        var date = new Date();
        
        this.setDate(date.getDate(), date.getMonth(), date.getFullYear());
    }
};
