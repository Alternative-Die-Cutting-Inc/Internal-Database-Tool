import { PaginationControls } from "../PaginationControls/PaginationControls";
import "./QuotesTable.scss";
import { StatusLabels } from "../StatusLabels/StatusLabels";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useMemo } from "react";
import "../../scssStyles/tableStyle.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { quotesSelector } from "../../state/quotes/quoteSlice";

/** The quotes table component.
 * @returns a table of quotes
 */
const QuotesTable = () => {
  const { quotes, loading } = useSelector(quotesSelector);

  const columns = useMemo(
    () => [
      {
        header: "Quote Number",
        accessorKey: "quoteNumber",
        // eslint-disable-next-line react/prop-types
        cell: (value) => (
          <Link to={`/quotetool?quoteNumber=${value.getValue()}`}>
            {value.getValue()}
          </Link>
        ),
        width: "auto",
      },
      { header: "Customer", accessorKey: "customerName" },
      { header: "Job Name", accessorKey: "jobName" },
      { header: "Description", accessorKey: "description" },
      { header: "Notes", accessorKey: "notes" },
      { header: "Units + Sheets + Per M + Total", accessorKey: "costs" },
      {
        header: "Status",
        accessorKey: "status",
        // eslint-disable-next-line react/prop-types
        cell: (value) => <StatusLabels values={value.getValue()} />,
      },
      {
        header: "Date Created",
        accessorKey: "creationDate",
        cell: (value) => new Date(value.getValue()).toLocaleDateString(),
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
    data: quotes || [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
  });
  return (
    <>
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

export { QuotesTable };
