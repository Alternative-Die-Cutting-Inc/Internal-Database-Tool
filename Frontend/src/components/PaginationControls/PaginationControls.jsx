import { PropTypes } from "prop-types";
import "./PaginationControls.scss";

/** The pagination controls component.
 * @returns controls for pagination
 */
const PaginationControls = ({
  canPreviousPage,
  canNextPage,
  pageOptions,
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
        <button
          className="pagination-control"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="pagination-control"
          onClick={() => previousPage()}
          disabled={!canPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="pagination-control"
          onClick={() => nextPage()}
          disabled={!canNextPage()}
        >
          {">"}
        </button>
        <button
          className="pagination-control"
          onClick={() => gotoPage(pageOptions() - 1)}
          disabled={!canNextPage()}
        >
          {">>"}
        </button>
        <span>
          Page
          <strong>
            {" "}
            {pageIndex + 1} of {pageOptions()}
          </strong>
        </span>
        <span>
          Go to page:{" "}
          <input
            className="pagination-number"
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
          className="pagination-pages"
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

PaginationControls.propTypes = {
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  pageOptions: PropTypes.any,
  gotoPage: PropTypes.any,
  nextPage: PropTypes.any,
  previousPage: PropTypes.any,
  setPageSize: PropTypes.any,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
};

export { PaginationControls };
