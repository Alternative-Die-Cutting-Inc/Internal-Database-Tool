import { PaginationControls } from "../PaginationControls/PaginationControls";
import { StatusLabels } from "../StatusLabels/StatusLabels";
import {
  useTable,
  useSortBy,
  usePagination,
} from "react-table";
import { useMemo } from "react";
import "../../scssStyles/tableStyle.scss";
import { faker } from "@faker-js/faker";
import { Link } from "react-router-dom";

/** The jobs table component.
 * @returns a table of jobs
 */
const JobsTable = () => {
  const fakeData = [
    ...[...Array(200)].map(() => ({
      customer: faker.company.name(),
      dateCreated: faker.date.past().toString(),
      description: faker.lorem.sentence(),
      quoteNumber: faker.number.int({ min: 184000, max: 185000 }),
      docketNumber: faker.number.int({ min: 44000, max: 45000 }),
      jobName: faker.lorem.words(),
      notes: faker.lorem.paragraph(),
      costs: faker.number.int({ min: 200, max: 3000 }),
      customerPO: faker.number.int({ min: 10000, max: 30000 }),
      productionPerson: faker.person.fullName(),
      status: faker.lorem.words().split(" "),
      instructions: faker.lorem.paragraph(),
      numOfUnits: faker.number.int({ min: 100, max: 4000 }),
      soldFor: faker.number.int({ min: 100, max: 4000 }),
      finishing: faker.lorem.words(),
      shipping: faker.lorem.words(),
    })),
  ];
  const data = useMemo(() => fakeData, []);

  const columns = useMemo(
    () => [
      {
        Header: "Docket Number",
        accessor: "docketNumber",
        // eslint-disable-next-line react/prop-types
        Cell: ({ cell: { value } }) => (
          <Link to={`/dockettool?docketNumber=${value}`}>{value}</Link>
        ),
        maxWidth: 150,
        minWidth: 50,
        width: 100,
      },
      {
        Header: "Quote Number",
        accessor: "quoteNumber",
        // eslint-disable-next-line react/prop-types
        Cell: ({ cell: { value } }) => (
          <Link to={`/quotetool?quoteNumber=${value}`}>{value}</Link>
        ),
      },
      {
        Header: "Customer",
        accessor: "customer",
      },
      {
        Header: "Customer PO",
        accessor: "customerPO",
      },
      {
        Header: "Production Person",
        accessor: "productionPerson",
        minWidth: 110,
        width: 110,
        maxWidth: 150,
      },
      { Header: "Job Name", accessor: "jobName" },
      {
        Header: "Finishing",
        accessor: "finishing",
        minWidth: 120,
        width: 120,
        maxWidth: 150,
      },
      {
        Header: "Special Instructions",
        accessor: "instructions",
        minWidth: 140,
        width: 140,
        maxWidth: 150,
      },
      {
        Header: "Number of Units",
        accessor: "numOfUnits",
        minWidth: 100,
        width: 100,
        maxWidth: 150,
      },
      { Header: "Sold For", accessor: "soldFor" },
      { Header: "Date Created", accessor: "dateCreated" },
      {
        Header: "Status",
        accessor: "status",
        // eslint-disable-next-line react/prop-types
        Cell: ({ cell: { value } }) => <StatusLabels values={value} />,
        minWidth: 140,
        width: 140,
        maxWidth: 175,
      },
      {
        Header: "Shipping",
        accessor: "shipping",
        minWidth: "1vw",
        width: "1vw",
        maxWidth: 150,
      },
    ],
    []
  );

  const defaultColumn = useMemo(
    () => ({
      minWidth: 30,
      width: 100,
      maxWidth: 150,
    }),
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
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
    // useBlockLayout
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

export { JobsTable };
