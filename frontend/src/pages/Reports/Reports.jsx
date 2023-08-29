import { useEffect, useMemo, useState } from "react";
import "./Reports.scss";
import { useDispatch, useSelector } from "react-redux";
import { docketsSelector } from "../../state/dockets/docketSlice";
import { searchDockets } from "../../state/dockets/saga";
import { quotesSelector } from "../../state/quotes/quoteSlice";
import { searchQuotes } from "../../state/quotes/saga";
import PropTypes from "prop-types";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

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

const PlanningReport = ({ dateRange }) => {
  const { dockets } = useSelector(docketsSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      searchDockets({
        query: {
          "status.value": "Open",
        },
        filters: {
          docketNumber: 1,
          "customer.name": 1,
          jobName: 1,
          closeDate: 1,
          status: 1,
          soldFor: 1,
          "extraCharges.cost": 1,
          bill: 1,
        },
      })
    );
  }, [dispatch, dateRange]);

  const data = useMemo(() => dockets, [dockets]);

  const columns = useMemo(
    () => [
      {
        header: "Docket Number",
        accessorKey: "docketNumber",
      },
      {
        header: "Customer",
        accessorKey: "customer.name",
      },
      {
        header: "Job Name",
        accessorKey: "jobName",
      },
      {
        header: "Close Date",
        accessorKey: "closeDate",
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (value) =>
          value
            .getValue()
            ?.map((item) => item.label)
            .join(", "),
      },
      {
        header: "Sold For",
        accessorKey: "soldFor",
      },
      // {
      //   header: "Extra Charges",
      //   accessorKey: "extraCharges.cost",
      // },
      {
        header: "Bill",
        accessorKey: "bill",
      },
    ],
    []
  );
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="planning-container">
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
      </table>
    </div>
  );
};

const SnapshotReport = ({ dateRange }) => {
  const { dockets } = useSelector(docketsSelector);
  const { quotes } = useSelector(quotesSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      searchDockets({
        query: {
          $or: [
            {
              $and: [
                {
                  creationDate: {
                    $gte: dateRange.startDate,
                  },
                },
                {
                  creationDate: {
                    $lte: dateRange.endDate,
                  },
                },
              ],
            },
            {
              $and: [
                {
                  closeDate: {
                    $gte: dateRange.startDate,
                  },
                },
                {
                  closeDate: {
                    $lte: dateRange.endDate,
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
          soldFor: 1,
        },
      })
    );
    dispatch(
      searchQuotes({
        query: {
          $or: [
            {
              $and: [
                {
                  creationDate: {
                    $gte: dateRange.startDate,
                  },
                },
                {
                  creationDate: {
                    $lte: dateRange.endDate,
                  },
                },
              ],
            },
            {
              $and: [
                {
                  closeDate: {
                    $gte: dateRange.startDate,
                  },
                },
                {
                  closeDate: {
                    $lte: dateRange.endDate,
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
          "quoteJobs.total": 1,
        },
      })
    );
  }, [dispatch, dateRange]);

  const data = useMemo(() => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(dateRange.startDate);
    firstDate.setDate(firstDate.getDate() + 1);
    const secondDate = new Date(dateRange.endDate);
    secondDate.setDate(secondDate.getDate() + 2);

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return [...Array(diffDays)].map((_, index) => {
      const day = new Date(firstDate);
      day.setDate(day.getDate() + index);

      let quotesInDay = 0;
      let quoted = 0;
      let docketsInDay = 0;
      let docketsOpened = 0;
      let docketsClosed = 0;

      if (quotes.length) {
        quotes.forEach((quote) => {
          if (
            new Date(quote.creationDate).toLocaleDateString() ===
            day.toLocaleDateString()
          ) {
            quotesInDay++;
            quoted += quote?.quoteJobs[0]?.total;
          }
        });
      }

      if (dockets.length) {
        dockets.forEach((docket) => {
          if (
            new Date(docket.creationDate).toLocaleDateString() ===
            day.toLocaleDateString()
          ) {
            docketsInDay++;
            docketsOpened += docket?.soldFor || 0;
          }
          if (
            new Date(docket.closeDate).toLocaleDateString() ===
            day.toLocaleDateString()
          ) {
            docketsClosed += docket?.soldFor || 0;
          }
        });
      }

      return {
        quotesInDay,
        docketsInDay,
        date: day.toLocaleDateString(),
        quoted,
        docketsOpened,
        docketsClosed,
      };
    });
  }, [dateRange, quotes, dockets]);

  const columns = useMemo(
    () => [
      {
        header: "Date",
        accessorKey: "date",
      },
      {
        header: "Quotes",
        accessorKey: "quotesInDay",
      },
      {
        header: "Quoted",
        accessorKey: "quoted",
        cell: (value) =>
          value.getValue()?.toLocaleString("en-CA", {
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
          value.getValue()?.toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
          }),
      },
      {
        header: "Dockets Closed",
        accessorKey: "docketsClosed",
        cell: (value) =>
          value.getValue()?.toLocaleString("en-CA", {
            style: "currency",
            currency: "CAD",
            currencyDisplay: "symbol",
          }),
      },
    ],
    []
  );

  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="snapshot-container">
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
      </table>
      <table>
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
                data.length
              ).toFixed(2) || 0}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.quoted, 0) /
                data.length
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              }) || 0}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.docketsInDay, 0) /
                data.length
              ).toFixed(2) || 0}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.docketsOpened, 0) /
                data.length
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              }) || 0}
            </td>
            <td>
              {(
                data.reduce((total, item) => total + item.docketsClosed, 0) /
                data.length
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              }) || 0}
            </td>
          </tr>
          <tr>
            <td>Totals</td>
            <td>
              {data
                .reduce((total, item) => total + item.quotesInDay, 0)
                .toFixed(2) || 0}
            </td>
            <td>
              {data
                .reduce((total, item) => total + item.quoted, 0)
                .toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                }) || 0}
            </td>
            <td>
              {data
                .reduce((total, item) => total + item.docketsInDay, 0)
                .toFixed(2) || 0}
            </td>
            <td>
              {data
                .reduce((total, item) => total + item.docketsOpened, 0)
                .toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                }) || 0}
            </td>
            <td>
              {data
                .reduce((total, item) => total + item.docketsClosed, 0)
                .toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                }) || 0}
            </td>
          </tr>
          <tr>
            <td>All Open Dockets</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colSpan={4}></td>
            <td>Projected Billing</td>
            <td>{"$120,000"}</td>
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
