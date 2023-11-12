import { PropTypes } from "prop-types";
import "./StatusLabels.scss";

/** This function defines the status labels for the table.
 * @param {string[]} values - The values of the status labels.
 * @returns custom status labels element
 */
const StatusLabels = ({ values }) => {
  return (
    <>
      {values.map((status, idx) => {
        const { label } = status;
        let backgroundColor = "black";
        let color = "white";
        switch (label) {
          case "Done":
            backgroundColor = "green";
            break;
          case "Shipped":
            backgroundColor = "gray";
            break;
          case "Created":
            backgroundColor = "yellow";
            color = "black";
            break;
          case "Open":
            backgroundColor = "yellow";
            color = "black";
            break;
          case "Closed":
            backgroundColor = "black";
            break;
          case "In Progress":
            backgroundColor = "blue";
            break;
          case "On The Floor":
            backgroundColor = "orange";
            break;
          case "Stopped":
            backgroundColor = "red";
            break;
          case "Approved":
            backgroundColor = "green";
            break;
          case "Sent":
            backgroundColor = "blue";
            break;
          default:
            backgroundColor = "var(--dark-grey)";
        }
        return (
          <span key={idx} className="badge" style={{ backgroundColor, color }}>
            {label}
          </span>
        );
      })}
    </>
  );
};

StatusLabels.propTypes = {
  values: PropTypes.any,
};

export { StatusLabels };
