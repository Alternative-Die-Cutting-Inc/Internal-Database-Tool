import { PropTypes } from "prop-types";
import "./TableControls.scss";
import { Multiselect } from "multiselect-react-dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const TableControls = ({
  filterCustomers,
  filterStatus,
  filterDate,
  statusArray,
  sortDate,
  Table,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="table-controls-container">
      <div className="filter-sort-container">
        <div className="filters">
          {filterCustomers ? (
            <input
              className="filter-field"
              type="search"
              name="customer-name"
              placeholder="Customer Name:"
            />
          ) : (
            <></>
          )}
          {filterStatus ? (
            <div className="statusSelector" style={{ marginRight: "1vw" }}>
              <Multiselect
                placeholder="Status"
                style={{
                  multiselectContainer: {
                    backgroundColor: "var(--dark-grey)",
                    border: "1px solid var(--light-accent)",
                    borderRadius: "15px",
                    color: "var(--light-accent)",
                    padding: "0.5vh 1vw",
                    height: "5vh",
                  },
                  searchBox: {
                    border: "none",
                    justifyContent: "center",
                  },
                  optionContainer: {
                    backgroundColor: "var(--dark-grey)",
                  },
                  inputField: {
                    fontSize: "16px",
                  },
                }}
                options={statusArray}
                displayValue="name"
              />
            </div>
          ) : (
            <></>
          )}
          {filterDate ? (
            <>
              <DatePicker
                style={{ width: "min-content" }}
                className="filter-field"
                isClearable
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Creation Date Start"
              />
              <DatePicker
                style={{ width: "min-content" }}
                className="filter-field"
                isClearable
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                placeholderText="Creation Date End"
              />
            </>
          ) : null}
        </div>
        <div className="sorter">
          {sortDate ? (
            <select className="sort-field" name="sorter">
              <option value={"newToOld"}>Newest to Oldest</option>
              <option value={"oldToNew"}>Oldest to Newest</option>
            </select>
          ) : null}
        </div>
      </div>
      <Table />
    </div>
  );
};

TableControls.propTypes = {
  filterCustomers: PropTypes.bool,
  filterStatus: PropTypes.bool,
  statusArray: PropTypes.array,
  filterDate: PropTypes.bool,
  sortDate: PropTypes.bool,
  Table: PropTypes.any,
};

export { TableControls };
