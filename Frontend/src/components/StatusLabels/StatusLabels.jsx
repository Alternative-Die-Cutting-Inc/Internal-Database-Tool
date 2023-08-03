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
        if (label === "Done") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "green" }}
            >
              {label}
            </span>
          );
        } else if (label === "Shipped") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "gray" }}
            >
              {label}
            </span>
          );
        } else if (label === "Created") {
          return (
            <span
              key={idx}
              className="badge"
              style={{
                backgroundColor: "yellow",
                color: "black",
              }}
            >
              {label}
            </span>
          );
        } else if (label === "Closed") {
          return (
            <span
              key={idx}
              className="badge"
              style={{
                backgroundColor: "black",
              }}
            >
              {label}
            </span>
          );
        } else if (label === "In Progress" || label === "Inprogress") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "blue" }}
            >
              {label}
            </span>
          );
        } else if (label === "Stopped") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "red" }}
            >
              {label}
            </span>
          );
        } else {
          let color = Math.floor(Math.random() * 16777215).toString(16);
          return (
            <span
              className="badge"
              key={idx}
              style={{
                backgroundColor: "#" + color,
              }}
            >
              {label}
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
