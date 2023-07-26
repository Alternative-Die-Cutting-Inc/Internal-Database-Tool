import { PaginationControls } from "../PaginationControls/PaginationControls";
import { StatusLabels } from "../StatusLabels/StatusLabels";
import { useTable, useSortBy, usePagination } from "react-table";
import { useMemo } from "react";
import "../../scssStyles/tableStyle.scss";
import { useSelector } from "react-redux";
import { docketsSelector } from "../../state/dockets/docketSlice";

import { Link } from "react-router-dom";

/**
 * The jobs table component.
 * @returns a table of jobs
 */
const JobsTable = () => {
  const { dockets, loading } = useSelector(docketsSelector);

  const data = useMemo(() => {
    if (dockets) return dockets;
    return [];
  }, [dockets]);

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
        accessor: "customerName",
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
        Cell: ({ cell: { value } }) =>
          value.reduce((a, b) => b.label + ", " + a, ""),
        minWidth: 120,
        width: 120,
        maxWidth: 150,
      },
      {
        Header: "Special Instructions",
        accessor: "specialInstructions",
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
      {
        Header: "Date Created",
        accessor: "creationDate",
        Cell: ({ cell: { value } }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Status",
        accessor: "status",
        // eslint-disable-next-line react/prop-types
        Cell: ({ cell: { value } }) => <StatusLabels values={value} />,
      },
      {
        Header: "Shipping",
        accessor: "docketNumber",
        id: "shipping",
        Cell: ({ cell: { value } }) => (
          <Link to={`/shipments?docketNumber=${value}`}>Make New Shipment</Link>
        ),
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
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <>
      {dockets && !loading && (
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
      )}
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
