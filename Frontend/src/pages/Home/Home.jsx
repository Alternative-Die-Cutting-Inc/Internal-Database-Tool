/**
 * @fileOverview This file defines the Home page of the application.
 * @author Farbod Mohammadzadeh - https://github.com/Freeassassin
 * @version 1.0
 * @date 2023-06-07
 * @description This file contains a search menu and a list of jobs and quotes.
 * @resource https://github.com/TanStack/table/blob/v7/docs/src/pages/docs/quick-start.md
 */

import { useState } from "react";
import "./Home.scss";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { TableControls } from "../../components/TableControls/TableControls";
import { QuotesTable } from "../../components/QuotesTable/QuotesTable";
import { JobsTable } from "../../components/JobsTable/JobsTable";

/** The home page component. Renders the search menu and the jobs and quotes table.
 * @returns React component
 */
const PageHome = () => {
  const customers = [
    { name: "alternative Die Cutting Inc." },
    { name: "alternative Die Cutting Inc." },
    { name: "alternative Die Cutting Inc." },
    { name: "alternative Die Cutting Inc." },
  ];

  const [searchJobs, setSearchJobs] = useState(false);
  const [searchQuotes, setSearchQuote] = useState(false);
  const [jobsTable, setJobTable] = useState(true);

  return (
    <>
      <div className="homepage-container">
        {/* SEARCH MENU */}
        <div className="search-menu">
          <div className="job-search-container">
            <div
              className="search-header"
              onClick={() => {
                setSearchJobs(!searchJobs);
              }}
            >
              <div className="search-title">
                <h2>Jobs</h2>
              </div>
              <div className="expansion-icon">
                {searchJobs ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </div>
            </div>
            <div
              className="search-fields-container"
              style={searchJobs ? {} : { display: "none" }}
            >
              <form className="job-search-form">
                <input
                  className="search-field"
                  type="search"
                  name="docker-number"
                  placeholder="Docket Number:"
                />
                <select className="search-field" name="customer-name">
                  {customers.map((customer, index) => {
                    return (
                      <option
                        className="search-field"
                        key={customer.name + index}
                        value={customer.name}
                      >
                        {customer.name}
                      </option>
                    );
                  })}
                </select>
                <input
                  className="search-field"
                  type="search"
                  name="docker-number"
                  placeholder="Number of Units:"
                />
                <input
                  className="search-field"
                  type="search"
                  name="quote-number"
                  placeholder="Quote Number:"
                />
                <input className="filter-field" type="submit" value="Search" />
              </form>
            </div>
          </div>
          <div className="quote-search-container">
            <div
              className="search-header"
              onClick={() => {
                setSearchQuote(!searchQuotes);
              }}
              style={searchQuotes ? { borderRadius: "unset" } : {}}
            >
              <div className="search-title">
                <h2>Quotes</h2>
              </div>
              <div className="expansion-icon">
                {searchQuotes ? <AiOutlineMinus /> : <AiOutlinePlus />}
              </div>
            </div>
            <div
              className="search-fields-container"
              style={searchQuotes ? {} : { display: "none" }}
            >
              <form className="quote-search-form">
                <input
                  className="search-field"
                  type="search"
                  name="docker-number"
                  placeholder="Docket Number:"
                />
                <select className="search-field" name="customer-name">
                  {customers.map((customer, index) => {
                    return (
                      <option key={customer.name + index} value={customer.name}>
                        {customer.name}
                      </option>
                    );
                  })}
                </select>
                <input
                  className="search-field"
                  type="search"
                  name="docker-number"
                  placeholder="Number of Units:"
                />
                <input
                  className="search-field"
                  type="search"
                  name="quote-number"
                  placeholder="Quote Number:"
                />
                <input className="filter-field" type="submit" value="Search" />
              </form>
            </div>
          </div>
          <div className="die-search-container">
            <div className="search-header">
              <div className="search-title">
                <h2>Die Search</h2>
              </div>
              <input
                className="search-field"
                type="search"
                name="Die Number"
                placeholder="Die Number:"
              />
            </div>
          </div>
        </div>

        {/* ITEM LIST  */}
        <div className="items-list-container">
          <div className="table-tabs-container">
            <h2
              className={jobsTable ? "selected" : ""}
              onClick={() => {
                setJobTable(jobsTable ? jobsTable : !jobsTable);
              }}
            >
              Jobs
            </h2>
            <h2
              className={jobsTable ? "" : "selected"}
              style={{ borderRadius: "0px 15px 0px 0px" }}
              onClick={() => {
                setJobTable(jobsTable ? !jobsTable : jobsTable);
              }}
            >
              Quotes
            </h2>
          </div>
          <TableControls
            filterCustomers={true}
            customersArray={customers}
            filterStatus={true}
            filterDate={true}
            statusArray={[
              { name: "Done" },
              { name: "Shipped" },
              { name: "On The Floor" },
              { name: "Stopped" },
            ]}
            sortDate={true}
            Table={jobsTable ? JobsTable : QuotesTable}
          />
        </div>
      </div>
    </>
  );
};

export { PageHome };
