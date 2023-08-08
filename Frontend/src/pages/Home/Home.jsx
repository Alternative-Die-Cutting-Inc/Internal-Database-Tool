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
import { TableControls } from "../../components/TableControls/TableControls";
import { QuotesTable } from "../../components/QuotesTable/QuotesTable";
import { JobsTable } from "../../components/JobsTable/JobsTable";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerNames } from "../../state/customers/saga";
import { customerNamesSelector } from "../../state/customers/customerSlice";
import Select from "react-select";
import { createDocket } from "../../state/dockets/saga";
import { createQuote } from "../../state/quotes/saga";
import { useNavigate } from "react-router-dom";

/** The home page component. Renders the search menu and the jobs and quotes table.
 * @returns React component
 */
const PageHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerNames } = useSelector(customerNamesSelector);
  const [jobCustomer, setJobCustomer] = useState();
  const [quoteCustomer, setQuoteCustomer] = useState();
  const [jobsTable, setJobTable] = useState(true);

  useEffect(() => {
    dispatch(getCustomerNames());
  }, [dispatch]);

  return (
    <>
      <div className="homepage-container">
        {/* MENU */}
        <div className="menus-container">
          <div className="search-menu">
            <div className="search-container">
              <div className="search-header">
                <div className="search-title">
                  <h2>Jobs</h2>
                </div>
              </div>
              <div className="search-fields-container">
                <form className="job-search-form">
                  <input
                    className="search-field"
                    type="search"
                    name="docker-number"
                    placeholder="Docket Number:"
                  />
                  <Select
                    className="search-field-customer-select"
                    classNamePrefix="search-field-customer-select"
                    options={customerNames}
                  />
                  <input
                    className="search-field"
                    type="search"
                    name="quote-number"
                    placeholder="Quote Number:"
                  />
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
                  <input
                    className="search-submit"
                    type="submit"
                    value="Search"
                  />
                </form>
              </div>
            </div>
            <div className="search-container">
              <div className="search-header">
                <div className="search-title">
                  <h2>Quotes</h2>
                </div>
              </div>
              <div className="search-fields-container">
                <form className="quote-search-form">
                  <input
                    className="search-field"
                    type="search"
                    name="quote-number"
                    placeholder="Quote Number:"
                  />
                  <Select
                    className="search-field-customer-select"
                    classNamePrefix="search-field-customer-select"
                    options={customerNames}
                  />
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
                  <input
                    className="search-field"
                    type="search"
                    name="key-word"
                    placeholder="Key Word:"
                  />
                  <input
                    className="search-submit"
                    type="submit"
                    value="Search"
                  />
                </form>
              </div>
            </div>
            <div className="search-container">
              <div className="search-header">
                <div className="search-title">
                  <h2>Die Search</h2>
                </div>
              </div>
              <input
                className="search-field"
                type="search"
                name="Die Number"
                placeholder="Die Number:"
              />
            </div>
          </div>
          <div id="homepage-new-quote" className="new-quote-menu-container">
            <header className="new-quote-title">
              <h1>New Quote</h1>
            </header>
            <div className="new-quote-fields-container">
              <form
                action=""
                className="new-quote-fields"
                onSubmit={(e) => {
                  e.preventDefault();
                  const quote = {
                    customer: {
                      name: quoteCustomer.label,
                      customerID: quoteCustomer.value,
                    },
                    jobName: e.target.jobName.value,
                    attention: e.target.attention.value,
                    description: e.target.description.value,
                    notes: e.target.notes.value,
                    status: [{ value: "Created", label: "Created" }],
                  };
                  dispatch(createQuote({ quote, navigate }));
                }}
              >
                <Select
                  className="new-quote-customer-select"
                  unstyled
                  classNamePrefix="new-quote-customer-select"
                  options={customerNames || []}
                  required
                  onChange={(option) => {
                    setQuoteCustomer(option);
                  }}
                />
                <input
                  type="text"
                  className="new-quote-field"
                  placeholder="Job Name"
                  name="jobName"
                  required="required"
                />
                <input
                  type="text"
                  className="new-quote-field"
                  placeholder="Attention"
                  name="attention"
                />
                <input
                  type="text"
                  className="new-quote-field"
                  placeholder="Description"
                  name="description"
                />
                <input
                  type="text"
                  className="new-quote-field"
                  placeholder="Notes"
                  name="notes"
                />
                <input
                  type="submit"
                  className="new-quote-submit"
                  value="Create"
                />
              </form>
            </div>
          </div>
          <div id="homepage-new-docket" className="new-docket-menu-container">
            <header className="new-docket-title">
              <h1>New Docket</h1>
            </header>
            <div className="new-docket-fields-container">
              <form
                action=""
                className="new-docket-fields"
                onSubmit={(e) => {
                  e.preventDefault();
                  const docket = {
                    customer: {
                      name: jobCustomer.label,
                      customerID: jobCustomer.value,
                    },
                    jobName: e.target.jobName.value,
                    customerPO: e.target.customerPO.value,
                    quoteNumber: e.target.quoteNumber.value,
                    status: [{ value: "Created", label: "Created" }],
                  };
                  dispatch(createDocket({ docket, navigate }));
                }}
              >
                <Select
                  required
                  className="new-docket-customer-select"
                  unstyled
                  classNamePrefix="new-docket-customer-select"
                  onChange={(option) => {
                    setJobCustomer(option);
                  }}
                  name="customer"
                  options={customerNames || []}
                />
                <input
                  type="text"
                  className="new-docket-field"
                  placeholder="Job Name"
                  name="jobName"
                  required="required"
                />
                <input
                  type="text"
                  className="new-docket-field"
                  placeholder="Customer PO#"
                  name="customerPO"
                />
                <input
                  type="text"
                  className="new-docket-field"
                  placeholder="Quote Number"
                  name="quoteNumber"
                />
                <input
                  type="submit"
                  className="new-docket-submit"
                  value="Create"
                />
              </form>
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
            customersArray={customerNames}
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
