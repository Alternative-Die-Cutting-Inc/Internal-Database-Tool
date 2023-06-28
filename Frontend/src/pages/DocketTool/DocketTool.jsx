import "./DocketTool.scss";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageDocketTool = () => {
  let query = useQuery();

  const docketInfo = {
    docket_number: 123456,
    quoteNumber: 123456,
    quote_job_id: 123456,
    customerName: "John Doe",
    jobName: "Job Name",
    jobType: "Job Type",
    productionPerson: "Production Person",
    po: 123456,
    soldFor: 123456,
    finishing: "Finishing",
    specialInstructions: "Special Instructions",
    requoteMemos: "Requote Memos",
    closingDate: new Date(),
    description: "Description",
    notes: "Notes",
    status: ["Status", "Status", "Status"],
    dieID: 123456,
    datecreated: new Date(),
  };

  return (
    <>
      <div className="docket-tool-container">
        <div className="docket-info">
          <table className="docket-info-table" id="docket-info-table">
            <tbody>
            <tr>
              <td>Docket #:</td>
              <td>
                <input type="text" className="docket-info-input" />
              </td>
              <td>Customer:</td>
              <td>
                <input type="text" className="docket-info-input" />
              </td>
              <td>Customer PO:</td>
              <td>
                <input type="text" className="docket-info-input" />
              </td>
              <td>Job Name:</td>
              <td>
                <input type="text" className="docket-info-input" />
              </td>
              <td>Quote Job:</td>
            </tr>
            <tr>
              <td>Quote #:</td>
              <td>
                <input type="text" className="docket-info-input" />
              </td>
              <td>Production Person:</td>
              <td>
                <input type="text" className="docket-info-input" />
              </td>
              <td>Sold For:</td>
              <td>
                <input type="text" className="docket-info-input" />
              </td>
              <td>Job Type:</td>
              <td>
                <input type="text" className="docket-info-input" />
              </td>
              <td>
                <input type="text" className="docket-info-input" />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div className="docket-column-container">
          <div className="docket-input-column" id="column1">
            <div className="docket-finishing">
              <div className="die-info">
                <table className="docket-info-table" id="finishing-info-table">
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
                      <input type="text" />
                    </td>
                  </tr>
                  <tr>
                    <td>Die type:</td>
                    <td>
                      <input type="text" />
                    </td>
                  </tr>
                </table>
              </div>
              <div className="die-options">
                <table
                  className="docket-info-table"
                  id="finishing-option-table"
                >
                  <tr>
                    <td>
                      <label htmlFor="diecut">
                        <input type="checkbox" name="" id="diecut" /> Die Cut
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
                        <input type="checkbox" name="" id="foldAndGlue" /> Fold
                        & Glue
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
                </table>
              </div>
              <div className="finishing-notes">
                <textarea
                  name=""
                  id=""
                  className="finishing-notes-input"
                  placeholder="Additional Notes"
                />
              </div>
            </div>
            <div className="docket-forms">
              <h2 className="docket-header">Forms:</h2>
              <table className="docket-info-table" id="forms-table">
                <tr style={{ borderBottom: "2px solid var(--light-accent)" }}>
                  <th>Name:</th>
                  <th>Quantity:</th>
                  <th>Notes:</th>
                  <th>Quantity Shipped:</th>
                  <th>Last Shipment:</th>
                </tr>
                {[...Array(10)].map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <button className="delete-form-button">X</button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>Total Quantity:</td>
                  <td>
                    <input type="text" placeholder="1000000" disabled />
                  </td>
                </tr>
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
                />
              </div>
            </div>
            <div className="docket-extra-charges">
              <h2 className="docket-header">Extra Charges:</h2>
              <table className="docket-info-table" id="extra-charges-table">
                <tr style={{ borderBottom: "2px solid var(--light-accent)" }}>
                  <th>Charge:</th>
                  <th>Cost:</th>
                  <th>Note:</th>
                </tr>
                {[...Array(10)].map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <input type="text" />
                    </td>
                    <td>
                      <button className="delete-extra-cost-button">X</button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>Total Cost:</td>
                  <td>
                    <input type="text" placeholder="$1000000" disabled />
                  </td>
                </tr>
              </table>
              <button className="add-extra-cost-button">+</button>
            </div>
            <div className="docket-docket-summary">
              <h2>flkdsjf;lsdkjfla jlsfk jdsl;afj</h2>
              <h2>gfdkjldkgjl;jfgj gsf</h2>
              <h3>fgkfdgjdjhfsakjfhsdkjfhsdjkf</h3>
              <h3>fgkfdgjdjhfsakjfhsdkjfhsdjkf</h3>
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { PageDocketTool };
