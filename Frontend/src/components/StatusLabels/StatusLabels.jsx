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
              style={{ backgroundColor: "gray" }}
            >
              {status}
            </span>
          );
        } else if (status === "Created") {
          return (
            <span
              key={idx}
              className="badge"
              style={{
                backgroundColor: "yellow",
                color: "black",
              }}
            >
              {status}
            </span>
          );
        } else if (status === "Closed") {
          return (
            <span
              key={idx}
              className="badge"
              style={{
                backgroundColor: "black",
              }}
            >
              {status}
            </span>
          );
        } else if (status === "In Progress" || status === "Inprogress") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "blue" }}
            >
              {status}
            </span>
          );
        } else if (status === "Stopped") {
          return (
            <span
              key={idx}
              className="badge"
              style={{ backgroundColor: "red" }}
            >
              {status}
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
