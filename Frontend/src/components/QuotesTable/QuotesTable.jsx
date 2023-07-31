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
import { faker } from "@faker-js/faker";

/** The quotes table component.
 * @returns a table of quotes
 */
const QuotesTable = () => {
  const fakeData = [
    ...[...Array(200)].map(() => ({
      customer: faker.company.name(),
      dateCreated: faker.date.past().toString(),
      description: faker.lorem.sentence(),
      quoteNumber: faker.number.int({ min: 184000, max: 185000 }),
      jobName: faker.lorem.words(),
      notes: faker.lorem.paragraph(),
      costs: faker.number.int({ min: 200, max: 3000 }),
      status: faker.lorem.words().split(" "),
    })),
  ];
  // generate fake data using faker
  const data = useMemo(() => fakeData, []);

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
      { header: "Customer", accessorKey: "customer" },
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
      { header: "Date Created", accessorKey: "dateCreated" },
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
    data,
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
