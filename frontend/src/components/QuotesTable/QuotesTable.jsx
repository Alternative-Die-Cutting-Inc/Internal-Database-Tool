import { PaginationControls } from "../PaginationControls/PaginationControls";
import "./QuotesTable.scss";
import { StatusLabels } from "../StatusLabels/StatusLabels";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import "../../scssStyles/tableStyle.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { quotesSelector } from "../../state/quotes/quoteSlice";
import { getQuotes } from "../../state/quotes/saga";
import { PropTypes } from "prop-types";

/** The quotes table component.
 * @returns a table of quotes
 */
const QuotesTable = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getQuotes());
  }, [dispatch]);

  const { quotes, loading } = useSelector(quotesSelector);

  const columns = useMemo(
    () => [
      {
        header: "Quote Number",
        accessorFn: (row) => row.quoteNumber?.toString(),
        // eslint-disable-next-line react/prop-types
        cell: (value) => (
          <Link to={`/quotetool?quoteNumber=${value.getValue()}`}>
            {value.getValue()}
          </Link>
        ),
        width: "auto",
      },
      {
        header: "Customer",
        accessorFn: (row) => row?.customer?.name,
        cell: (value) => value.getValue(),
      },
      { header: "Job Name", accessorKey: "jobName" },
      { header: "Description", accessorKey: "description" },
      { header: "Notes", accessorKey: "notes" },
      {
        header: "Units + Sheets + Per M + Total",
        accessorFn: (quote) =>
          quote.quoteJobs.reduce((acc, job) => {
            acc.push({
              units: job.units,
              sheets: parseInt(job.units / job.perSheet) || 0,
              perM: job.total / (job.units / 1000) || 0,
              total: job.total,
            });
            return acc;
          }, []),
        cell: (value) => {
          return value.getValue()?.map((val, index) => {
            let options = {
              style: "currency",
              currency: "CAD",
              currencyDisplay: "symbol",
            };
            return (
              <div key={index}>{`${val?.units?.toLocaleString(
                "en-CA"
              )} + ${val?.sheets?.toLocaleString(
                "en-CA"
              )} + ${val?.perM?.toLocaleString(
                "en-CA",
                options
              )} + ${val?.total?.toLocaleString("en-CA", options)}`}</div>
            );
          });
        },
      },
      {
        header: "Date Created",
        accessorFn: (row) => new Date(row.creationDate).toLocaleDateString(),
        id: "creationDate",
        filterFn: (row, columnId, filterValue) => {
          const [startDate, endDate] = filterValue;
          if (startDate == "" && endDate == "") return true;
          return (
            Date.parse(startDate) <= Date.parse(row.getValue(columnId)) &&
            Date.parse(row.getValue(columnId)) <= Date.parse(endDate)
          );
        },
      },
      {
        header: "Status",
        enableColumnFilter: false,
        accessorFn: (row) => row.status.map((status) => status.label).join(","),
        cell: (value) => {
          const labels = value.getValue()?.split(",");
          return (
            <StatusLabels
              values={labels.map((status) => ({
                label: status,
                value: status,
              }))}
            />
          );
        },
      },
    ],
    []
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    previousPage,
    nextPage,
    getPageCount,
    setPageIndex,
    setPageSize,
    getState,
  } = useReactTable({
    columns,
    data: quotes || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      columnFilters,
    },
    autoResetPageIndex: true,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });
  return (
    <>
      <div className="global-search">
        <label htmlFor="globalFilter">
          Search:{" "}
          <input
            name="globalFilter"
            type="text"
            value={globalFilter}
            onChange={(event) => {
              setGlobalFilter(event.target.value);
            }}
          />
        </label>
      </div>
      {!loading ? (
        <table>
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      <div className="header-container">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <TableFilter column={header.column} />
                          </div>
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}

      <PaginationControls
        getCanPreviousPage={getCanPreviousPage}
        getCanNextPage={getCanNextPage}
        previousPage={previousPage}
        nextPage={nextPage}
        getPageCount={getPageCount}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        getState={getState}
      />
    </>
  );
};
function TableFilter({ column }) {
  const columnFilterValue = column.getFilterValue();
  if (column.id == "creationDate") {
    return (
      <>
        <input
          className="filter-input"
          type="date"
          onChange={(event) => {
            column.setFilterValue((old) => [event.target.value, old?.[1]]);
          }}
        />
        <input
          className="filter-input"
          type="date"
          onChange={(event) => {
            column.setFilterValue((old) => [old?.[0], event.target.value]);
          }}
        />
      </>
    );
  } else {
    return (
      <input
        className="filter-input"
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(event) => column.setFilterValue(event.target.value)}
      />
    );
  }
}
TableFilter.propTypes = {
  column: PropTypes.any,
};
export { QuotesTable };
