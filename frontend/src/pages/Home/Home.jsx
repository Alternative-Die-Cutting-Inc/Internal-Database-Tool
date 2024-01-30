/**
 * @fileOverview This file defines the Home page of the application.
 * @author Farbod Mohammadzadeh - https://github.com/Freeassassin
 * @version 1.0
 * @date 2023-06-07
 * @description This file contains a search menu and a list of jobs and quotes.
 * @resource https://github.com/TanStack/table/blob/v7/docs/src/pages/docs/quick-start.md
 */

import { customerNamesSelector } from "../../state/customers/customerSlice";
import { QuotesTable } from "../../components/QuotesTable/QuotesTable";
import { JobsTable } from "../../components/JobsTable/JobsTable";
import { getCustomerNames } from "../../state/customers/saga";
import NewDocket from "../../components/NewDocket/NewDocket";
import NewQuote from "../../components/NewQuote/NewQuote";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.scss";

/** The home page component. Renders the search menu and the jobs and quotes table.
 * @returns React component
 */
const PageHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerNames } = useSelector(customerNamesSelector);
  const [jobsTable, setJobTable] = useState(true);


  return (
    <div className="homepage-container">
      {/* MENU */}
      <div className="menus-container">
        <NewQuote
          customerNames={customerNames}
          navigate={navigate}
          dispatch={dispatch}
        />
        <NewDocket
          customerNames={customerNames}
          navigate={navigate}
          dispatch={dispatch}
        />
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
        {jobsTable ? <JobsTable /> : <QuotesTable />}
      </div>
    </div>
  );
};

export { PageHome };
