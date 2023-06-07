import "./Table.scss";

import { useTable, useSortBy, usePagination } from "react-table";
import Multiselect from "multiselect-react-dropdown";

const Table = () => {
  const data = useMemo(() => items, []);

  const columns = useMemo(
    () => [
      { Header: "Docket Number", accessor: "docketNumber" },
      { Header: "Customer", accessor: "customer" },
      { Header: "Job Name", accessor: "jobName" },
      { Header: "Date Created", accessor: "dateCreated" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => <Genres values={value} />,
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
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useSortBy,
    usePagination
  );
  return (
    <>
      <div className="filter-sort-container">
        <div className="filters">
          <select className="filter-field" name="customer-name">
            {customers.map((customer, index) => {
              return (
                <option key={customer.name + index} value={customer.name}>
                  {customer.name}
                </option>
              );
            })}
          </select>
          <Multiselect
            options={
              jobTable
                ? [
                    { name: "Done", id: 1 },
                    { name: "Shipped", id: 2 },
                    { name: "On the floor", id: 3 },
                    { name: "Stopped", id: 4 },
                  ]
                : []
            }
            displayValue="name"
          />
          <select className="filter-field" name="date-filter">
            <option value={"newest"}>newest to oldest</option>
            <option value={"newest"}>oldest to newest</option>
          </select>
        </div>
        <div className="sorter"></div>
      </div>
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
      <PaginationControlls
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

const PaginationControlls = ({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  pageIndex,
  pageSize,
}) => {
  return (
    <>
      <div className="pagination-buttons-container">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>
        <span>
          Page
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <span>
          Go to page:
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export { Table };
