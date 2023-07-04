import "./Shipments.scss";
// import { useLocation } from "react-router-dom";
import { useState } from "react";

// function useQuery() {
//   const { search } = useLocation();

//   return useMemo(() => new URLSearchParams(search), [search]);
// }

const PageShipments = () => {
  const [checkedState, setCheckedState] = useState([true, false, false]);
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? true : false
    );

    setCheckedState(updatedCheckedState);
  };
  // let query = useQuery();
  // {query.get("docketNumber")}
  return (
    <>
      <div className="shipment-tool-container">
        <div className="label-column" id="col1">
          <div className="label-row" id="row1">
            <div className="info-row-item label-production-info">
              <h2 className="label-info-header">Production Information:</h2>
              <table className="shipment-info-table" id="production-info-table">
                <tbody>
                  <tr>
                    <td>Docket #:</td>
                    <td>
                      <input type="text" name="docket-number" />
                    </td>
                  </tr>
                  <tr>
                    <td>Quote #: </td>
                    <td>
                      <input type="text" name="quote-number" />
                    </td>
                  </tr>
                  <tr>
                    <td>Customer: </td>
                    <td>
                      <input type="text" name="customer" />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="customer-po">Customer PO: </label>
                    </td>
                    <td>
                      <input type="text" name="customer-po" />
                    </td>
                  </tr>
                  <tr>
                    <td>Job Name:</td>
                    <td>
                      <input type="text" name="job-name" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="info-row-item label-shipping-address">
              <div className="checkbox-container">
                <h2 className="label-info-header">Shipping Address:</h2>
                {[
                  ["from-database", "Load From Database"],
                  ["other-address", "Other Address"],
                  ["not-show", "Do Not Show"],
                ].map((item, index) => (
                  <label
                    className="label-info-checkbox"
                    key={index}
                    htmlFor={item[0]}
                  >
                    <input
                      type="checkbox"
                      name={item[0]}
                      id={item[0]}
                      checked={checkedState[index]}
                      onChange={() => handleOnChange(index)}
                    />{" "}
                    {item[1]}
                  </label>
                ))}
              </div>
              <textarea
                style={{ display: checkedState[1] ? "block" : "none" }}
                className="other-address-input"
                name="other-address-input"
                id="other-address-input"
              />
              <label
                className="label-info-checkbox adc-address"
                htmlFor="adc-address"
              >
                <input type="checkbox" name="adc-address" id="adc-address" />{" "}
                Hide ADC Address
              </label>
            </div>
          </div>
          <div className="label-row" id="row2">
            <div className="info-row-item label-notes">
              <label htmlFor="additional-notes">
                Additional Notes:
                <textarea
                  className="notes-input"
                  name="additional-notes"
                  id="additional-notes"
                />
              </label>

              <label style={{ margin: "0 0.5vw" }} htmlFor="additional-notes">
                Label 1:
                <textarea
                  className="notes-input"
                  name="additional-notes"
                  id="additional-notes"
                />
              </label>

              <label htmlFor="additional-notes">
                Label 2:
                <textarea
                  className="notes-input"
                  name="additional-notes"
                  id="additional-notes"
                />
              </label>
            </div>
          </div>
          <div className="label-row" id="row3">
            <div className="info-row-item label-controls">
              <h2 className="label-info-header">Email To Client</h2>
              <div className="controls-container">
                <label htmlFor="">
                  Client Email: <input type="email" name="" id="" />
                </label>
                <button>Print & Send</button>
              </div>
              <h2 className="label-info-header">Print Label</h2>
              <div className="controls-container">
                <button>Print</button>
              </div>
            </div>
          </div>
        </div>
        <div className="label-column" id="col2">
          <div className="info-row-item label-forms">
            <h2 className="label-info-header">Forms:</h2>
            <table className="shipment-info-table" id="shipment-forms-table">
              <thead>
                <tr>
                  <th>Type:</th>
                  <th>Form:</th>
                  <th># of Skids:</th>
                  <th>Notes:</th>
                  <th>
                    <button className="delete-shipment-form-button">X</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(3)].map(() => (
                  <>
                    <tr>
                      <td>
                        <select>
                          <option value="Cartons">Cartons</option>
                          <option value="Sheets">Sheets</option>
                          <option value="Pieces">Pieces</option>
                        </select>
                      </td>
                      <td>
                        <input type="text" name="" id="" />
                      </td>
                      <td>
                        <input type="text" name="" id="" />
                      </td>
                      <td>
                        <input type="text" name="" id="" />
                      </td>
                      <td rowSpan={2}>
                        <button className="delete-shipment-form-button">
                          X
                        </button>
                      </td>
                    </tr>
                    <tr className="bottom-row">
                      <td></td>
                      <td>
                        <label htmlFor="">
                          Cartons: <input type="text" />
                        </label>
                      </td>
                      <td>
                        <label htmlFor="">
                          Pcs/Carton: <input type="text" />
                        </label>
                      </td>
                      <td>
                        <label htmlFor="">
                          Partial: <input type="text" />
                        </label>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <button className="add-shipments-form-button">+</button>
          </div>
        </div>
      </div>
    </>
  );
};

export { PageShipments };
