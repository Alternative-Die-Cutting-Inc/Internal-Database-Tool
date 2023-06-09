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
        if (status === "Done") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "green" }}
            >
              {status}
            </span>
          );
        } else if (status === "Shipped") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "blue" }}
            >
              {status}
            </span>
          );
        } else {
          return (
            <span
              className="badge"
              key={idx}
              style={{ backgroundColor: "blue" }}
            >
              {status}
            </span>
          );
        }
      })}
    </>
  );
};

StatusLabels.propTypes = {
  values: PropTypes.any,
};

export { StatusLabels };
