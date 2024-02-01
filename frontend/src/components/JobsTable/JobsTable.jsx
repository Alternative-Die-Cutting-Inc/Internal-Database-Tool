import { PaginationControls } from "../PaginationControls/PaginationControls";
import { StatusLabels } from "../StatusLabels/StatusLabels";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useMemo, useEffect, useState } from "react";
import "../../scssStyles/tableStyle.scss";
import { useDispatch, useSelector } from "react-redux";
import { docketsSelector } from "../../state/dockets/docketSlice";
import { getDockets } from "../../state/dockets/saga";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";


/**
 * The jobs table component.
 * @returns a table of jobs
 */
const JobsTable = () => {
  const dispatch = useDispatch();


  const { dockets, loading } = useSelector(docketsSelector);

  const columns = useMemo(
    () => [
      {
        header: "Docket Number",
        accessorFn: (row) => row.docketNumber?.toString(),
        // eslint-disable-next-line react/prop-types
        cell: (value) => (
          <Link to={`/dockettool?docketNumber=${value.getValue()}`}>
            {value.getValue()}
          </Link>
        ),
      },
      {
        header: "Quote Number",
        accessorFn: (row) => row.quoteNumber?.toString(),
        cell: (value) => (
          <Link to={`/quotetool?quoteNumber=${value.getValue()}`}>
            {value.getValue()}
          </Link>
        ),
      },
      {
        header: "Customer",
        accessorFn: (row) => row.customer.name,
      },
      {
        header: "Customer PO",
        accessorKey: "customerPO",
      },
      {
        header: "Production Person",
        accessorKey: "productionPerson",
      },
      {
        header: "Job Name",
        accessorKey: "jobName",
      },
      {
        header: "Finishing",
        accessorFn: (row) =>
          row.finishing?.reduce((a, b) => b.label + ", " + a, ""),
      },
      {
        header: "Special Instructions",
        accessorFn: (row) => row?.specialInstructions?.toString(),
      },
      {
        header: "Number of Units",
        accessorFn: (row) => row?.numOfUnits?.toString(),
      },
      {
        header: "Sold For",
        accessorFn: (row) => row?.soldFor?.toString(),
        cell: (value) =>
          (parseFloat(value.getValue()) || 0).toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
            currencyDisplay: "symbol",
          }),
      },
      {
        header: "Date Created",
        id: "creationDate",
        accessorFn: (row) => new Date(row.creationDate).toLocaleDateString(),
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
      {
        header: "Shipping",
        accessorKey: "docketNumber",
        id: "shipping",
        enableColumnFilter: false,
        cell: (value) => (
          <Link to={`/shipments?docketNumber=${value.getValue()}`}>
            Make New Shipment
          </Link>
        ),
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
    data: dockets || [],
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
          Search All:{" "}
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
      {loading ? <div className="data-loading">
        <h1>Data is loading</h1><div class="dot-flashing"></div>
      </div> : <table>
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
                    <td
                      key={cell.id}
                      style={
                        cell.column.columnDef.accessorKey == "jobName"
                          ? {
                              wordBreak: "break-all",
                            }
                          : {}
                      }
                    >
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
      </table>}
      

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
export { JobsTable };
