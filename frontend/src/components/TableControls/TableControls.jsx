import { PropTypes } from "prop-types";
import "./TableControls.scss";
import "react-datepicker/dist/react-datepicker.css";

const TableControls = ({ Table }) => {
  return (
    <div className="table-controls-container">
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
