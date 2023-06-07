/**
 * @fileOverview This file defines the Home page of the application. 
 * @author Farbod Mohammadzadeh - https://github.com/Freeassassin
 * @version 1.0
 * @date 2023-06-07
 * @description This file contains a search menu and a list of jobs and quotes.
 * @resource https://github.com/TanStack/table/blob/v7/docs/src/pages/docs/quick-start.md
 */

import { useState, useMemo } from "react";
import "./Home.scss";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { useTable, useSortBy, usePagination } from "react-table";
import Multiselect from "multiselect-react-dropdown";
import fakeData from "./data.json";
import PropTypes from "prop-types";

/** This function defines the status labels for the table.
 * @param {string[]} values - The values of the status labels.
 * @returns custom status labels element
 */
const StatusLabels = ({ values }) => {
  return (
    <>
      {values.map((status, idx) => {
        if (status === "Done") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "green" }}
            >
              {status}
            </span>
          );
        } else if (status === "Shipped") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "blue" }}
            >
              {status}
            </span>
          );
        }
      })}
    </>
  );
};

StatusLabels.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string),
};

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
          <div className="filter-sort-container">
            <div className="filters">
              <select className="filter-field" name="customer-name">
                {customers.map((customer, index) => {
                  return (
                    <option key={customer.name + index} value={customer.name}>
                      {customer.name}
                    </option>
                  );
                })}
              </select>
              <Multiselect
                style={{
                  multiselectContainer: {
                    backgroundColor: "var(--dark-grey)",
                    border: "1px solid var(--light-accent)",
                    borderRadius: "15px",
                    color: "var(--light-accent)",
                    padding: "0.5vh 1vw",
                    marginRight: "1vw",
                  },
                  searchBox: {
                    // To change search box element look
                    border: "none",
                    justifyContent: "center",
                  },
                  optionContainer: {
                    backgroundColor: "var(--dark-grey)",
                  },
                  inputField: {
                    fontSize: "16px",
                  },
                }}
                options={
                  jobsTable
                    ? [
                        { name: "Done", id: 1 },
                        { name: "Shipped", id: 2 },
                        { name: "On the floor", id: 3 },
                        { name: "Stopped", id: 4 },
                      ]
                    : []
                }
                displayValue="name"
              />
              <select className="filter-field" name="date-filter">
                <option value={"newest"}>Newest to oldest</option>
                <option value={"newest"}>Oldest to newest</option>
              </select>
            </div>
            <div className="sorter">
              <select className="sort-field" name="sorter">
                <option value={"newToOld"}>Newest to oldest</option>
                <option value={"oldToNew"}>Oldest to newest</option>
                <option value={"docketNumber"}>Docket Number</option>
              </select>
            </div>
          </div>
          {jobsTable ? (
            <JobsTable items={fakeData} />
          ) : (
            <QuotesTable items={fakeData} />
          )}
        </div>
      </div>
    </>
  );
};

/** The jobs table component.
 * @param {Object[]} items an array of items to be displayed in the table
 * @returns a table of jobs
 */
const JobsTable = ({ items }) => {
  const data = useMemo(() => items, []);

  const columns = useMemo(
    () => [
      { Header: "Docket Number", accessor: "docketNumber" },
      { Header: "Customer", accessor: "customer" },
      { Header: "Job Name", accessor: "jobName" },
      { Header: "Date Created", accessor: "dateCreated" },
      {
        Header: "Status",
        accessor: "status",
        // eslint-disable-next-line react/prop-types
        Cell: ({ cell: { value } }) => <StatusLabels values={value} />,
      },
    ],
    []
  );

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useSortBy,
    usePagination
  );
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  // eslint-disable-next-line react/jsx-key
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <PaginationControls
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageOptions={pageOptions}
        pageCount={pageCount}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </>
  );
};

JobsTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

/** The quotes table component.
 * @param {Object[]} items an array of items to be displayed in the table
 * @returns a table of quotes
 */
const QuotesTable = ({ items }) => {
  const data = useMemo(() => items, []);

  const columns = useMemo(
    () => [
      { Header: "Quote Number", accessor: "docketNumber" },
      { Header: "Customer", accessor: "customer" },
      { Header: "Job Name", accessor: "jobName" },
      { Header: "Date Created", accessor: "dateCreated" },
      {
        Header: "Status",
        accessor: "status",
        // eslint-disable-next-line react/prop-types
        Cell: ({ cell: { value } }) => <StatusLabels values={value} />,
      },
    ],
    []
  );

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useSortBy,
    usePagination
  );
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  // eslint-disable-next-line react/jsx-key
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <PaginationControls
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageOptions={pageOptions}
        pageCount={pageCount}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
        setPageSize={setPageSize}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </>
  );
};

QuotesTable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

/** The pagination controls component.
 * @returns controls for pagination
 */
const PaginationControls = ({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  pageSize,
}) => {
  return (
    <>
      <div className="pagination-buttons-container">
        <button
          className="pagination-control"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className="pagination-control"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>
        <button
          className="pagination-control"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>
        <button
          className="pagination-control"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
        <span>
          Page
          <strong>
            {" "}
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span>
          Go to page:{" "}
          <input
            className="pagination-number"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>
        <select
          className="pagination-pages"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

PaginationControls.propTypes = {
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  pageOptions: PropTypes.any,
  pageCount: PropTypes.number,
  gotoPage: PropTypes.any,
  nextPage: PropTypes.any,
  previousPage: PropTypes.any,
  setPageSize: PropTypes.any,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
};

export { PageHome };
