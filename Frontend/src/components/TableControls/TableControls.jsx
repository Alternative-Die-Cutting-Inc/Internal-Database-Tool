import { PropTypes } from "prop-types";
import "./TableControls.scss";
import { Multiselect } from "multiselect-react-dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const TableControls = ({
  filterCustomers,
  customersArray,
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
            <select className="filter-field" name="customer-name">
              {customersArray.map((customer, index) => {
                return (
                  <option key={customer.name + index} value={customer.name}>
                    {customer.name}
                  </option>
                );
              })}
            </select>
          ) : (
            <></>
          )}
          {filterStatus ? (
            <div className="statusSelector" style={{ marginRight: "1vw" }}>
              <Multiselect
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
          ) : (
            <></>
          )}
        </div>
        <div className="sorter">
          {sortDate ? (
            <select className="sort-field" name="sorter">
              <option value={"newToOld"}>Newest to oldest</option>
              <option value={"oldToNew"}>Oldest to newest</option>
              <option value={"docketNumber"}>Docket Number</option>
            </select>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Table />
    </div>
  );
};

TableControls.propTypes = {
  filterCustomers: PropTypes.bool,
  customersArray: PropTypes.array,
  filterStatus: PropTypes.bool,
  statusArray: PropTypes.array,
  filterDate: PropTypes.bool,
  sortDate: PropTypes.bool,
  Table: PropTypes.any,
};

export { TableControls };
