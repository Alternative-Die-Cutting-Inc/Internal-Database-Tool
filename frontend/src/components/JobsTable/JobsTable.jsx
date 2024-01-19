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

/**
 * The jobs table component.
 * @returns a table of jobs
 */
const JobsTable = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDockets());
  }, [dispatch]);
  const { dockets } = useSelector(docketsSelector);

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
        accessorFn: (row) => row.specialInstructions?.toString(),
      },
      {
        header: "Number of Units",
        accessorFn: (row) => row.numOfUnits?.toString(),
      },
      {
        header: "Sold For",
        accessorKey: "soldFor",
        cell: (value) =>
          value.getValue()?.toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
            currencyDisplay: "symbol",
          }),
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
      {
        header: "Shipping",
        accessorKey: "docketNumber",
        id: "shipping",
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
      </table>

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

export { JobsTable };
