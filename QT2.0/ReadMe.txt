Quote Tool 2.0
Written by Peter Tran Feb 15th, 2013.

/******************************************************
 *               Table of Contents
 * 1) Intro
 * 2) MySQL Tables
 * 3) Trace - How this application is executed.
 * 4)
 *****************************************************/

/******************************************************
 * 					1) Intro
 *****************************************************/

Quote Tool 2.0 was rewritten with a couple of goals in mind:
1) All data within a quote is store in the database instead of being
dynamically generated. The reason being is it accomodates easy portability
of a quote without relying on the JS to create the information. This can help
eliminate front end bugs which can be costly as documents are printed straight
off the webpage.
2) Dynamic changes of rates. Throughout the quaters, rates of materials and
machines go up and down. Also per job, the rates may differ. The MySQL tables
were split up in a way that a master rate is set and allowed to change. When
a quote is created the current state of the master rate is copied and saved for that quote. This allows for the master rate to change without affecting
previous quotes.
3) The new quote system will allow the user to think in terms of the runspeed
of the machines to generate a price or think in terms of the rate per thousand.
The old quote system relied on the user to input a runspeed and users started
to increase or decrease the run speed in order to achieve the "Rate per
thousand" that they wanted. Implementing this was complicated because when the
user changes the rate per thousand, that forces the rate for that quote to 
change. This change occurs for all the quantities within that quote.

/******************************************************
 * 					2) MySQL Tables
 *****************************************************/

 QT_Quote:
 	This table contains the information for one quote.


