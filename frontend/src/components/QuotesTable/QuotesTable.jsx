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
        accessorKey: "customer",
        cell: (value) => value.getValue()?.name,
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
      },
      {
        header: "Status",
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
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                      {header.column.getCanFilter() ? (
                        <div>
                          <TableFilter column={header.column} />
                        </div>
                      ) : null}
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
      ) : (
        <> </>
      )}

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
  if (!["Date Created", "shipping", "Status"].includes(column.id)) {
    return (
      <input
        className="filter-input"
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(event) => column.setFilterValue(event.target.value)}
      />
    );
  } else if (column.id == "Date Created") {
    return (
      <>
        <input className="filter-input" type="date" />
        <input className="filter-input" type="date" />
      </>
    );
  } else {
    return null;
  }
}
export { QuotesTable };
