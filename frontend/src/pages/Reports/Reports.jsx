import { useEffect, useMemo, useState } from "react";
import "./Reports.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  docketsSelector, searchDocketsSelector,
} from "../../state/dockets/docketSlice";
import {
  deleteDocket,
searchDockets,
  updateDocket,
} from "../../state/dockets/saga";
import { quotesSelector, searchedQuotesSelector } from "../../state/quotes/quoteSlice";
import { searchQuotes } from "../../state/quotes/saga";
import PropTypes from "prop-types";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { PaginationControls } from "../../components/PaginationControls/PaginationControls";

const PageReports = () => {
  const [planning, setPlanning] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toLocaleDateString(),
    endDate: new Date().toLocaleDateString(),
  });

  return (
    <div className="reports-page-container">
      <div className="report-items-list-container">
        <div className="report-controls">
          <div className="report-tabs">
            <h2
              className={planning ? "selected" : ""}
              onClick={() => {
                setPlanning(planning ? planning : !planning);
              }}
            >
              Planning
            </h2>
            <h2
              className={planning ? "" : "selected"}
              style={{ borderRadius: "0px 15px 0px 0px" }}
              onClick={() => {
                setPlanning(planning ? !planning : planning);
              }}
            >
              Snapshots
            </h2>
          </div>
          {!planning ? (
            <div className="report-date-range">
              <label htmlFor="startDate">
                Start Date:{" "}
                <input
                  type="date"
                  name="Start Date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(event) => {
                    setDateRange({
                      ...dateRange,
                      startDate: event.target.value,
                    });
                  }}
                />
              </label>
              <label htmlFor="endDate">
                End Date:{" "}
                <input
                  type="date"
                  name="End Date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(event) => {
                    setDateRange({
                      ...dateRange,
                      endDate: event.target.value,
                    });
                  }}
                />
              </label>
            </div>
          ) : null}
        </div>
        <div className="report-content-container">
          {planning ? (
            <PlanningReport dateRange={dateRange} />
          ) : (
            <SnapshotReport dateRange={dateRange} />
          )}
        </div>
      </div>
    </div>
  );
};

const PlanningReport = () => {
  const { dockets, loading } = useSelector(docketsSelector);

  const dispatch = useDispatch();

  // filter out closed dockets
  const data = useMemo(() => dockets.filter((docket) => {
    return docket.status.every((stat) => stat.label.toLowerCase() != "closed")
  }), [dockets]);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("docketNumber", {
      header: "Docket Number",
      cell: (value) => (
        <Link to={`/dockettool?docketNumber=${value.getValue()}`}>
          {value.getValue()}
        </Link>
      ),
    }),
    columnHelper.accessor("jobName", {
      header: "Job Name",
    }),
    columnHelper.accessor("closeDate", {
      header: "Close Date",
      cell: function Cell({ getValue, row, column, table }) {
        const initialValue = getValue();
        const tableMeta = table.options.meta;
        const [value, setValue] = useState(initialValue);
        return (
          <input
            value={value?.split("T")[0] || ""}
            onChange={(e) => {
              setValue(e.target.value);
              tableMeta?.updateData(row.index, column.id, e.target.value);
              let statusArray = row.original.status.filter((status) => {
                return status.label.toLowerCase() !== "open";
              });
              statusArray.push({ label: "Closed", value: "Closed" });

              dispatch(
                updateDocket({
                  id: row.original._id,
                  fields: { closeDate: e.target.value, status: statusArray },
                })
              );
            }}
            type="date"
          />
        );
      },
    }),
    columnHelper.accessor("numOfUnits", {
      header: "Number of Units",
    }),
    columnHelper.accessor("soldFor", {
      header: "Sold For",
      cell: (value) =>
        (value.getValue() || 0).toLocaleString("en-CA", {
          style: "currency",
          currency: "CAD",
        }),
    }),
    columnHelper.accessor("extraCharges", {
      header: "Total Extra Charges",
      cell: (value) =>
        value
          .getValue()
          ?.reduce((total, item) => total + item.cost, 0.0)
          .toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
          }),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (value) =>
        value
          .getValue()
          ?.map((item) => item.label)
          .join(", "),
    }),
    columnHelper.accessor("bill", {
      header: "Bill",
      accessorFn: (values) => {
        return { bill: values.bill, id: values._id };
      },
      cell: function Cell({ getValue, row, column, table }) {
        const initialValue = getValue();
        const tableMeta = table.options.meta;
        const [value, setValue] = useState(initialValue);
        return (
          <input
            type="checkbox"
            checked={initialValue.bill}
            onChange={(e) => {
              setValue({ id: initialValue.id, bill: e.target.checked });
              tableMeta?.updateData(row.index, column.id, value);
              dispatch(
                updateDocket({
                  id: initialValue.id,
                  fields: { bill: e.target.checked },
                })
              );
            }}
          />
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Delete",
      cell: (value) => (
        <button
          onClick={() => {
            const id = value.getValue();
            dispatch(deleteDocket({ id }));
          }}
        >
          Delete
        </button>
      ),
    }),
  ];

  const { getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    previousPage,
    nextPage,
    getPageCount,
    setPageIndex,
    setPageSize,
    getState, } = useReactTable({
      columns,
      data: data || [],
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

  if (!data?.length)
    return (
      <div className="planning-container">
        <h2 className="not-found">No Open Dockets Found.</h2>
      </div>
    );

  return (
    <div className="planning-container">
      {loading ? <div className="data-loading">
        <h1>Data is loading</h1><div className="dot-flashing"></div>
      </div> :
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
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
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
    </div>
  );
};

const SnapshotReport = ({ dateRange }) => {
  const { searchedDockets } = useSelector(searchDocketsSelector);
  const { searchedQuotes } = useSelector(searchedQuotesSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    const startDate = new Date(dateRange.startDate).toISOString();
    const endDate = new Date(dateRange.endDate).toISOString();
    dispatch(
      searchDockets({
        query: {
          $or: [
            {
              $and: [
                {
                  creationDate: {
                    $gte: new Date(dateRange.startDate + "EST"),
                  },
                },
                {
                  creationDate: {
                    $lte: new Date(dateRange.endDate + "EST"),
                  },
                },
              ],
            },
            {
              $and: [
                {
                  closeDate: {
                    $gte: startDate,
                  },
                },
                {
                  closeDate: {
                    $lte: endDate,
                  },
                },
              ],
            },
          ],
        },
        filters: {
          closeDate: 1,
          creationDate: 1,
          status: 1,
          bill: 1,
          soldFor: 1,
        },
      })
    );
    dispatch(
      searchQuotes({
        query: {
          $and: [
            {
              creationDate: {
                $gte: startDate,
              },
            },
            {
              creationDate: {
                $lte: endDate,
              },
            },
          ],
        },
        filters: {
          creationDate: 1,
          status: 1,
          "quoteJobs.total": 1,
        },
      })
    );
  }, [dispatch, dateRange]);

  const data = useMemo(() => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setDate(endDate.getDate());
    const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay));
    console.log(searchedDockets.length)

    return [...Array(diffDays)].map((_, index) => {
      const day = new Date(startDate);
      day.setDate(day.getDate() + index);

      let quotesInDay = 0;
      let quoted = 0;
      let docketsInDay = 0;
      let docketsOpened = 0;
      let docketsClosed = 0;

      if (searchedQuotes?.length) {
        searchedQuotes.forEach((quote) => {
          if (
            new Date(quote.creationDate).toLocaleDateString() ===
            day.toLocaleDateString()
          ) {
            quotesInDay++;
            quoted += quote?.quoteJobs[0]?.total;
          }
        });
      }

      if (searchedDockets?.length) {
        searchedDockets.forEach((docket) => {
          if (
            new Date(docket.creationDate).toLocaleDateString() ===
            day.toISOString().split("T")[0]
          ) {
            docketsInDay++;
            docketsOpened += docket?.soldFor || 0;
          }

          if (
            docket?.closeDate &&
            new Date(docket?.closeDate).toISOString().split("T")[0] ==
            day.toISOString().split("T")[0]
          ) {
            docketsClosed += docket?.soldFor || 0;
          }
        });
      }

      return {
        quotesInDay,
        docketsInDay,
        date: day.getUTCMonth() + 1 + "-" + day.getUTCDate(),
        quoted,
        docketsOpened,
        docketsClosed,
      };
    });
  }, [dateRange, searchedQuotes, searchedDockets]);

  const columns = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "date",
        cell: (value) => value.getValue(),
      },
      {
        header: "Quotes",
        accessorKey: "quotesInDay",
      },
      {
        header: "Quoted",
        accessorKey: "quoted",
        cell: (value) =>
          (value.getValue() || 0).toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
          }),
      },
      {
        header: "Dockets Opened",
        accessorKey: "docketsInDay",
      },
      {
        header: "Dockets Opened",
        accessorKey: "docketsOpened",
        cell: (value) =>
          (value.getValue() || 0).toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
          }),
      },
      {
        header: "Dockets Closed",
        accessorKey: "docketsClosed",
        cell: (value) =>
          (value.getValue() || 0).toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
            currencyDisplay: "symbol",
          }),
      },
    ],
    []
  );

  const { getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    previousPage,
    nextPage,
    getPageCount,
    setPageIndex,
    setPageSize,
    getState, } = useReactTable({
      columns,
      data,
      initialState: {
        pagination: {
          pageSize: 31
        }
      },
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });
  return (
    <div className="snapshot-container">
      <div className="report-table-container">
        <table id="report-table">
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
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
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
      </div>

      <table id="summary-table">
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th></th>
              {headerGroup.headers.map((header) => {
                if (header.id === "date") return null;

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
          <tr>
            <td>Average</td>
            <td>
              {(
                data.reduce((total, item) => total + item.quotesInDay, 0) /
                data.length || 0
              ).toFixed(2)}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.quoted, 0) /
                data.length || 0
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.docketsInDay, 0) /
                data.length || 0
              ).toFixed(2)}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.docketsOpened, 0) /
                data.length || 0
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.docketsClosed, 0) /
                data.length || 0
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </td>
          </tr>
          <tr>
            <td>Totals</td>
            <td>
              {data.reduce((total, item) => total + item.quotesInDay, 0) || 0}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.quoted, 0) || 0
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </td>
            <td>
              {data.reduce((total, item) => total + item.docketsInDay, 0) || 0}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.docketsOpened, 0) || 0
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.docketsClosed, 0) || 0
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>All Open Dockets</td>
            <td>
              {searchedDockets?.reduce((open, docket) => {
                if (docket.status.some((status) => status.label === "Open")) {
                  return open + 1;
                }
                return open;
              }, 0)}
            </td>
            <td>Dockets On Floor</td>
            <td>
              {searchedDockets
                ?.reduce((open, docket) => {
                  if (
                    docket.status.some(
                      (status) => status.label === "On The Floor"
                    )
                  ) {
                    return open + docket?.soldFor || 0;
                  }
                  return open;
                }, 0)
                .toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                })}
            </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Billable</td>
            <td>
              {searchedDockets
                ?.reduce((prev, curr) => {
                  if (
                    curr.bill &&
                    curr.status.every((status) => status.label !== "Closed")
                  ) {
                    return prev + curr?.soldFor || 0;
                  }
                  return prev;
                }, 0)
                .toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                })}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>Hit Percentage</td>
            <td>
              {(
                (data.reduce((total, item) => total + item.docketsInDay, 0) /
                  data.reduce((total, item) => total + item.quotesInDay, 0)) *
                100 || 0
              ).toFixed(2) + "%"}
            </td>
            <td></td>
            <td>Projected Billing</td>
            <td>
              {(
                searchedDockets?.reduce((prev, curr) => {
                  if (
                    curr.bill &&
                    curr.status.every((status) => status.label !== "Closed")
                  ) {
                    return prev + curr?.soldFor || 0;
                  }
                  return prev;
                }, 0) +
                data.reduce((total, item) => total + item.docketsClosed, 0) ||
                0
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

PlanningReport.propTypes = {
  dateRange: PropTypes.object,
};

SnapshotReport.propTypes = {
  dateRange: PropTypes.object,
};

export { PageReports };
