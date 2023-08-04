import { PaginationControls } from "../PaginationControls/PaginationControls";
import { StatusLabels } from "../StatusLabels/StatusLabels";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo, useEffect } from "react";
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
        accessorKey: "docketNumber",
        // eslint-disable-next-line react/prop-types
        cell: (value) => (
          <Link to={`/dockettool?docketNumber=${value.getValue()}`}>
            {value.getValue()}
          </Link>
        ),
      },
      {
        header: "Quote Number",
        accessorKey: "quoteNumber",
        cell: (value) => (
          <Link to={`/quotetool?quoteNumber=${value.getValue()}`}>
            {value.getValue()}
          </Link>
        ),
      },
      {
        header: "Customer",
        accessorKey: "customerName",
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
        accessorKey: "finishing",
        cell: (info) =>
          info.getValue().reduce((a, b) => b.label + ", " + a, ""),
      },
      {
        header: "Special Instructions",
        accessorKey: "specialInstructions",
      },
      {
        header: "Number of Units",
        accessorKey: "numOfUnits",
      },
      { header: "Sold For", accessorKey: "soldFor" },
      {
        header: "Date Created",
        accessorKey: "creationDate",
        cell: (value) => new Date(value.getValue()).toLocaleDateString(),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (value) => <StatusLabels values={value.getValue()} />,
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
    autoResetPageIndex: true,
  });

  return (
    <>
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

export { JobsTable };
