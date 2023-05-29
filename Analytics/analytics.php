<?php
/**
 * This file was created Nov 29th, 2012 by Peter Tran.
 * This was written to display analytical information about Quotes and how many of
 * them become jobs within a given period. Data taken into consideration are totals 
 * (careful for outliers skewing data).
 */
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/loginHelper.php";
require $_SERVER['DOCUMENT_ROOT'] . "/Intranet/Resources/Backend/backendHelper.php";

// Month
$month = 10;
//Does the month have 30 or 31 days?
$last_day_of_month = 31;
//Year
$year = 2012;

// displayTotalsFor($month, $year, $last_day_of_month);
echo "<br>";
displayCustomerTotals($month, $year, $last_day_of_month);

//Want:
//Total number of quotes in the month
//Total dollar value of quotes in the month
//Total number of converted quotes (and "hit rate" i.e. % of quotes converted into jobs)

/**
 * Display totals:
 * 				1) Total number of quotes in the month
 * 				2) Total dollar value of quotes in the month
 *					2b) Average
 * 				3) Total number of jobs
 * 				4) % of converted jobs
 */
function displayTotalsFor($month, $year, $last_day_of_month) {
	echo "The following is for the month of October, 2012<br>";
	$query = "SELECT Count(*) as Total, SUM(Total) as TotalValue, AVG(Total) as AverageValue
				FROM Quote_Information
				WHERE Date BETWEEN '$year-$month-1' AND '$year-$month-$last_day_of_month' ";
	$result = runQuery($query);
	echo "<table>";
	if ($row = mysql_fetch_array($result)) {
		$totalQuotes = $row["Total"];
		echo "
				<tr>
					<td>Total number of Quotes</td>
					<td>" . $totalQuotes . "</td>
				<tr>
				<tr>
					<td>Total dollar value of Quotes</td>
					<td>$" . number_format(strtok($row["TotalValue"], ".")) . "</td>
				<tr>
				<tr>
					<td>Average dollar value of Quotes</td>
					<td>$" . number_format(strtok($row["AverageValue"], ".")) . "</td>
				<tr>
			";
 	}
 	$query2 = "SELECT Count(*) as ConvertedJobs
 				FROM Quote_Information as Q CROSS JOIN Production as P
 				WHERE 	(Q.Date BETWEEN '$year-$month-1' AND '$year-$month-$last_day_of_month')
 						AND 
 						(P.QuoteNumber = Q.Quote_Number)";
 	$result2 = runQuery($query2);
 	if ($row2 = mysql_fetch_array($result2)) {
 		$convertedJobs =$row2["ConvertedJobs"];
 		echo "
 				<tr>
					<td>Total Jobs Converted</td>
					<td>" . $convertedJobs . "</td>
				<tr>
 		";
 	}
 	echo "
 	<tr>
					<td>Hit Rate (%)</td>
					<td>" . strtok(($convertedJobs/$totalQuotes)*100, ".") . "%</td>
				<tr>
 			";
 	echo "</table>";
}


//For each customer x) # of quotes made
//					2) total $ value 
//					x) # of jobs (and % of quotes to jobs)
//					4) total $ value of jobs
//					x) display in descending order by number of jobs.

// SELECT Customer, Count(*) as TotalQuoted From Quote_Information  WHERE Date BETWEEN '2012-10-1' AND '2012-10-31' Group By Customer


// SELECT P.Customer, SUM(Q.Total) as TotalValue, Count(*) as ConvertedJobs
//  				FROM Quote_Information as Q CROSS JOIN Production as P
//  				WHERE 	(Q.Date BETWEEN '2012-10-1' AND '2012-10-31')
//  						AND 
//  						(P.QuoteNumber = Q.Quote_Number)
// Group By P.Customer Order By ConvertedJobs Desc

// SELECT * FROM 

// (SELECT Customer, Count(*) as TotalQuoted From Quote_Information  WHERE Date BETWEEN '2012-10-1' AND '2012-10-31' Group By Customer) as A

// natural join

// (SELECT P.Customer, Count(*) as ConvertedJobs, SUM(P.FinalPrice) as TotalPaid
//  				FROM ((SELECT Quote_Number, Date FROM Quote_Information Group By Quote_Number) as Q CROSS JOIN Production as P)
//  				WHERE 	(Q.Date BETWEEN '2012-10-1' AND '2012-10-31')
//  						AND 
//  						(P.QuoteNumber = Q.Quote_Number)
// Group By P.Customer Order By ConvertedJobs Desc) as B

// order by ConvertedJobs DESC

function displayCustomerTotals($month, $year, $last_day_of_month) {
	$totalQuery = "SELECT SUM(TotalPaid) as Total, SUM(TotalQuoted) as TotalQ, SUM(ConvertedJobs) as TotalJobs 
					FROM 

						(
							SELECT Customer, Count(*) as TotalQuoted 
							From (
								SELECT Customer, Date, Quote_Number 
								FROM Quote_Information
								WHERE Date BETWEEN '$year-$month-1' AND '$year-$month-$last_day_of_month' 
								Group By Quote_Number
								) as W  
							Group By Customer
						) as A

							natural join

						(
							SELECT P.Customer, Count(*) as ConvertedJobs, SUM(P.FinalPrice) as TotalPaid
	 						FROM (
		 							(
		 								SELECT Quote_Number, Date 
		 								FROM Quote_Information 
		 								Group By Quote_Number) as Q 
											CROSS JOIN 
										Production as P
									)
	 						WHERE 	(Q.Date BETWEEN '$year-$month-1' AND '$year-$month-$last_day_of_month')
	 									AND 
	 								(P.QuoteNumber = Q.Quote_Number)
							Group By P.Customer 
							Order By ConvertedJobs Desc
						) as B

					Order by ConvertedJobs DESC ";
	$tresult = runQuery($totalQuery);
	if ($row = mysql_fetch_array($tresult)) {
		$dollarTotal = $row["Total"];
		$totalNumberOfQuotes = $row["TotalQ"];
		$totalJobs = $row["TotalJobs"];

	}
	// echo "Dollar value totaled this month: $" . number_format($dollarTotal);

	$query = 
			"SELECT * 
			FROM 
				(
					SELECT Customer, Count(*) as TotalQuoted 
					From 
						(
							SELECT Customer, Quote_Number 
							FROM Quote_Information 
							WHERE Date BETWEEN '$year-$month-1' AND '$year-$month-$last_day_of_month' 
							Group By Quote_Number
						) as W  
					Group By Customer
				) as A

					natural join

				(
					SELECT P.Customer, Count(*) as ConvertedJobs, SUM(P.FinalPrice) as TotalPaid
	 				FROM 
	 					(
	 						(
	 							SELECT Quote_Number, Date 
	 							FROM Quote_Information 
	 							Group By Quote_Number
	 						) as Q 
								CROSS JOIN 
							
							Production as P
							
						)
	 				WHERE 	
	 					(Q.Date BETWEEN '$year-$month-1' AND '$year-$month-$last_day_of_month')
	 						AND 
	 					(P.QuoteNumber = Q.Quote_Number)
					Group By P.Customer 
					Order By ConvertedJobs Desc
				) as B

			Order by ConvertedJobs DESC ";
	$result = runQuery($query);

	echo '<table border="1px">';
	echo "<tr>
			<th>Customer</th>
			<th>Total Quoted</th>
			<th>Total Converted</th>
			<th>% Converted</th>
			<th>Total Job Value</th>
			<th>% of Business</th>
		  </tr>";
	while ($row = mysql_fetch_array($result)) {
		echo "<tr>";
		echo "<td>" . $row["Customer"] . "</td>";
		echo "<td>" . $row["TotalQuoted"] . "</td>";
		echo "<td>" . $row["ConvertedJobs"] . "</td>";
		echo "<td>" . number_format(($row["ConvertedJobs"] / $row ["TotalQuoted"]), 2, ".", "") * 100 . "</td>";
		echo "<td>$" . number_format($row["TotalPaid"]) . "</td>";
		echo "<td>" .number_format(($row["TotalPaid"] / $dollarTotal), 8, ".", "") * 100 . "</td>";
		echo "</tr>";
	}
	echo "<tr>";
	echo "<td><b>Totals</b></td>";
	echo "<td><b>".$totalNumberOfQuotes."</b></td>";
	echo "<td><b>".$totalJobs."</b></td>";
	echo "<td><b>".number_format(($totalJobs / $totalNumberOfQuotes),2,".", "") * 100 . "</b></td>";
	echo "<td><b>$".number_format($dollarTotal)."</b></td>";
	echo "<td><b>"."</b></td>";
	echo "</tr>";
	echo "</table>";
}
?>