import { PaginationControls } from "../PaginationControls/PaginationControls";
import "./QuotesTable.scss";
import { StatusLabels } from "../StatusLabels/StatusLabels";
import { useTable, useSortBy, usePagination } from "react-table";
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
        Header: "Quote Number",
        accessor: "quoteNumber",
        // eslint-disable-next-line react/prop-types
        Cell: ({ cell: { value } }) => (
          <Link to={`/quotetool?quoteNumber=${value}`}>
            <a>{value}</a>
          </Link>
        ),
        width: "auto",
      },
      { Header: "Customer", accessor: "customer" },
      { Header: "Job Name", accessor: "jobName" },
      { Header: "Description", accessor: "description" },
      { Header: "Notes", accessor: "notes" },
      { Header: "Units + Sheets + Per M + Total", accessor: "costs" },
      {
        Header: "Status",
        accessor: "status",
        // eslint-disable-next-line react/prop-types
        Cell: ({ cell: { value } }) => <StatusLabels values={value} />,
      },
      { Header: "Date Created", accessor: "dateCreated" },
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

export { QuotesTable };
