import { PropTypes } from "prop-types";
import "./PaginationControls.scss";

/** The pagination controls component.
 * @returns controls for pagination
 */
const PaginationControls = ({
  getCanPreviousPage,
  getCanNextPage,
  previousPage,
  nextPage,
  getPageCount,
  setPageIndex,
  setPageSize,
  getState,
}) => {
  return (
    <>
      <div className="pagination-buttons-container">
        <button
          className="pagination-control"
          onClick={() => setPageIndex(0)}
          disabled={!getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="pagination-control"
          onClick={() => previousPage()}
          disabled={!getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="pagination-control"
          onClick={() => nextPage()}
          disabled={!getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="pagination-control"
          onClick={() => setPageIndex(getPageCount() - 1)}
          disabled={!getCanNextPage()}
        >
          {">>"}
        </button>
        <span>
          Page{" "}
          <strong>
            {getState().pagination.pageIndex + 1} of {getPageCount()}
          </strong>
        </span>
        <span>
          Go to page:{" "}
          <input
            className="pagination-number"
            type="number"
            defaultValue={getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              setPageIndex(page);
            }}
            style={{ width: "100px" }}
          />
        </span>
        <select
          className="pagination-pages"
          value={getState().pagination.pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
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
  getCanPreviousPage: PropTypes.func,
  getCanNextPage: PropTypes.func,
  previousPage: PropTypes.func,
  nextPage: PropTypes.func,
  getPageCount: PropTypes.func,
  setPageIndex: PropTypes.func,
  setPageSize: PropTypes.func,
  getState: PropTypes.func,
};

export { PaginationControls };
