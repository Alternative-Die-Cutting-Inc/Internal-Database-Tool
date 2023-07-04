import "./DocketTool.scss";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDocket } from "../../state/dockets/saga";
import { docketSelector } from "../../state/dockets/docketSlice";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageDocketTool = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const { docket, loading } = useSelector(docketSelector);
  useEffect(() => {
    dispatch(getDocket(query.get("docketNumber")));
  });

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div className="docket-tool-container">
          <div className="docket-info">
            <table className="docket-info-table" id="docket-info-table">
              <tbody>
                <tr>
                  <td>Docket #:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={docket.docketNumber}
                      disabled
                    />
                  </td>
                  <td>Customer:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={docket.customerName}
                    />
                  </td>
                  <td>Customer PO:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={docket.customerPO}
                    />
                  </td>
                  <td>Job Name:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={docket.jobName}
                    />
                  </td>
                  <td>Quote Job:</td>
                </tr>
                <tr>
                  <td>Quote #:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={docket.quoteNumber}
                    />
                  </td>
                  <td>Production Person:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={docket.productionPerson}
                    />
                  </td>
                  <td>Sold For:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={docket.soldFor}
                    />
                  </td>
                  <td>Job Type:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={docket.jobType}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={docket.quoteJob}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="docket-column-container">
            <div className="docket-input-column" id="column1">
              <div className="docket-finishing">
                <div className="die-info">
                  <table
                    className="docket-info-table"
                    id="finishing-info-table"
                  >
                    <tbody>
                      <tr>
                        <td>Die:</td>
                        <td>
                          <div className="die-tabs">
                            <div className="die-tab">Standing</div>
                            <div className="die-tab">New</div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Die search:</td>
                        <td>
                          <input type="text" value={docket.dieID} />
                        </td>
                      </tr>
                      <tr>
                        <td>Die type:</td>
                        <td>
                          <input type="text" value={docket.dieType} />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="die-options">
                  <table
                    className="docket-info-table"
                    id="finishing-option-table"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <label htmlFor="diecut">
                            <input type="checkbox" name="" id="diecut" /> Die
                            Cut
                          </label>
                        </td>
                        <td>
                          <label htmlFor="strip">
                            <input type="checkbox" name="" id="strip" /> Strip
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label htmlFor="foldAndGlue">
                            <input type="checkbox" name="" id="foldAndGlue" />{" "}
                            Fold & Glue
                          </label>
                        </td>
                        <td>
                          <label htmlFor="score">
                            <input type="checkbox" name="" id="score" /> Score
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label htmlFor="crease">
                            <input type="checkbox" name="" id="crease" /> Crease
                          </label>
                        </td>
                        <td>
                          <label htmlFor="">
                            <input type="checkbox" name="" id="" /> option name
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label htmlFor="">
                            <input type="checkbox" name="" id="" /> option name
                          </label>
                        </td>
                        <td>
                          <label htmlFor="">
                            <input type="checkbox" name="" id="" /> option name
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="finishing-notes">
                  <textarea
                    name=""
                    id=""
                    className="finishing-notes-input"
                    placeholder="Additional Notes"
                    value={docket.finishing}
                  />
                </div>
              </div>
              <div className="docket-forms">
                <h2 className="docket-header">Forms:</h2>
                <table className="docket-info-table" id="forms-table">
                  <thead>
                    <tr>
                      <th>Name:</th>
                      <th>Quantity:</th>
                      <th>Notes:</th>
                      <th>Quantity Shipped:</th>
                      <th>Last Shipment:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...docket.forms].map((form, index) => (
                      <tr key={form.name + index}>
                        <td>
                          <input type="text" value={form.name} />
                        </td>
                        <td>
                          <input type="text" value={form.quantity} />
                        </td>
                        <td>
                          <input type="text" value={form.notes} />
                        </td>
                        <td>
                          <input type="text" value={form.quantityShipped} />
                        </td>
                        <td>
                          <input type="text" value={form.lastShipmentDate} />
                        </td>
                        <td>
                          <button className="delete-form-button">X</button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Total Quantity:</td>
                      <td>
                        <input type="text" disabled />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button className="add-form-button">+</button>
              </div>
            </div>
            <div className="docket-input-column" id="column2">
              <div className="docket-special-instructions">
                <h2 className="docket-header">Special Instructions:</h2>
                <div className="instruction-notes">
                  <textarea
                    name=""
                    id=""
                    className="instructions-input"
                    placeholder="Instructions"
                    value={docket.specialInstructions}
                  />
                </div>
              </div>
              <div className="docket-extra-charges">
                <h2 className="docket-header">Extra Charges:</h2>
                <table className="docket-info-table" id="extra-charges-table">
                  <thead>
                    <tr>
                      <th>Charge:</th>
                      <th>Cost:</th>
                      <th>Note:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...docket.extraCharges].map((extraCharge, index) => (
                      <tr key={extraCharge.chargeName + index}>
                        <td>
                          <input type="text" value={extraCharge.chargeName} />
                        </td>
                        <td>
                          <input type="text" value={extraCharge.chargeCost} />
                        </td>
                        <td>
                          <input type="text" value={extraCharge.chargeNotes} />
                        </td>
                        <td>
                          <button className="delete-extra-cost-button">
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Total Cost:</td>
                      <td>
                        <input type="text" placeholder="$1000000" disabled />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button className="add-extra-cost-button">+</button>
              </div>
              <div className="docket-docket-summary">
                <h2>{docket.customerName + " #" + docket.docketNumber}</h2>
                <h2>{docket.jobName}</h2>
                <h3>{docket.finishing}</h3>
                <h3>{docket.specialInstructions}</h3>
                <button>Save & Copy</button>
              </div>
              <div className="docket-requote-memo">
                <h2 className="docket-header">Requote Memo</h2>
                <div className="instruction-notes">
                  <textarea
                    name=""
                    id=""
                    rows={7}
                    className="requote-memo-input"
                    placeholder="Memo"
                    value={docket.requoteMemo}
                  />
                </div>
                <div className="closing-date">
                  <label htmlFor="closing-datetime">
                    Closing Date
                    <input
                      type="date"
                      name="closing-datetime"
                      id="closing-datetime"
                      value={docket.closingDate}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { PageDocketTool };
