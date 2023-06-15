import "./QuoteTool.scss";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageQuoteTool = () => {
  let query = useQuery();
  const quoteInfo = {
    quoteNumber: 123456,
    customerName: "John Doe",
    jobName: "Job Name",
    attention: "Jane Doe",
    description: "Description",
    notes: "Notes",
    status: ["Status", "Status", "Status"],
    datecreated: new Date(),
  };

  const quoteJobs = [
    {
      jobID: 123456,
      units: 12313,
      per_sheet: 123,
      die_hours: 123,
      die_setup: 123,
      die_run: 123,
      die_run_speed: 123,
      die_run_hours: 123,
      gluer_setup: 123,
      gluer_hours: 123,
      gluer_speed: 123,
      strip_setup: 123,
      strip_hours: 123,
      client_notes: "Client Notes",
      private_notes: "private Notes",
      date_created: new Date(),
      rates: {
        press_per_hour: 123,
        gluer_per_hour: 123,
        strip_per_hour: 123,
        die_per_hour: 123,
        customer_rate: 123,
        global_premium: 123,
      },
      extras: [
        // {
        //   name: "Extra 1",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
      ],
    },
    {
      jobID: 123456,
      units: 12313,
      per_sheet: 123,
      die_hours: 123,
      die_setup: 123,
      die_run: 123,
      die_run_speed: 123,
      die_run_hours: 123,
      gluer_setup: 123,
      gluer_hours: 123,
      gluer_speed: 123,
      strip_setup: 123,
      strip_hours: 123,
      client_notes: "Client Notes",
      private_notes: "private Notes",
      date_created: new Date(),
      rates: {
        press_per_hour: 123,
        gluer_per_hour: 123,
        strip_per_hour: 123,
        die_per_hour: 123,
        customer_rate: 123,
        global_premium: 123,
      },
      extras: [
        {
          name: "Extra 1",
          per_m: 123,
          cost: 123,
        },
        {
          name: "Extra 2",
          per_m: 123,
          cost: 123,
        },
        {
          name: "Extra 2",
          per_m: 123,
          cost: 123,
        },
      ],
    },
    {
      jobID: 123456,
      units: 12313,
      per_sheet: 123,
      die_hours: 123,
      die_setup: 123,
      die_run: 123,
      die_run_speed: 123,
      die_run_hours: 123,
      gluer_setup: 123,
      gluer_hours: 123,
      gluer_speed: 123,
      strip_setup: 123,
      strip_hours: 123,
      client_notes: "Client Notes",
      private_notes: "private Notes",
      date_created: new Date(),
      rates: {
        press_per_hour: 123,
        gluer_per_hour: 123,
        strip_per_hour: 123,
        die_per_hour: 123,
        customer_rate: 123,
        global_premium: 123,
      },
      extras: [
        // {
        //   name: "Extra 1",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
      ],
    },
    {
      jobID: 123456,
      units: 12313,
      per_sheet: 123,
      die_hours: 123,
      die_setup: 123,
      die_run: 123,
      die_run_speed: 123,
      die_run_hours: 123,
      gluer_setup: 123,
      gluer_hours: 123,
      gluer_speed: 123,
      strip_setup: 123,
      strip_hours: 123,
      client_notes: "Client Notes",
      private_notes: "private Notes",
      date_created: new Date(),
      rates: {
        press_per_hour: 123,
        gluer_per_hour: 123,
        strip_per_hour: 123,
        die_per_hour: 123,
        customer_rate: 123,
        global_premium: 123,
      },
      extras: [
        {
          name: "Extra 1",
          per_m: 123,
          cost: 123,
        },
        {
          name: "Extra 2",
          per_m: 123,
          cost: 123,
        },
        {
          name: "Extra 2",
          per_m: 123,
          cost: 123,
        },
      ],
    },
    {
      jobID: 123456,
      units: 12313,
      per_sheet: 123,
      die_hours: 123,
      die_setup: 123,
      die_run: 123,
      die_run_speed: 123,
      die_run_hours: 123,
      gluer_setup: 123,
      gluer_hours: 123,
      gluer_speed: 123,
      strip_setup: 123,
      strip_hours: 123,
      client_notes: "Client Notes",
      private_notes: "private Notes",
      date_created: new Date(),
      rates: {
        press_per_hour: 123,
        gluer_per_hour: 123,
        strip_per_hour: 123,
        die_per_hour: 123,
        customer_rate: 123,
        global_premium: 123,
      },
      extras: [
        // {
        //   name: "Extra 1",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
        // {
        //   name: "Extra 2",
        //   per_m: 123,
        //   cost: 123,
        // },
      ],
    },
    {
      jobID: 123456,
      units: 12313,
      per_sheet: 123,
      die_hours: 123,
      die_setup: 123,
      die_run: 123,
      die_run_speed: 123,
      die_run_hours: 123,
      gluer_setup: 123,
      gluer_hours: 123,
      gluer_speed: 123,
      strip_setup: 123,
      strip_hours: 123,
      client_notes: "Client Notes",
      private_notes: "private Notes",
      date_created: new Date(),
      rates: {
        press_per_hour: 123,
        gluer_per_hour: 123,
        strip_per_hour: 123,
        die_per_hour: 123,
        customer_rate: 123,
        global_premium: 123,
      },
      extras: [
        {
          name: "Extra 1",
          per_m: 123,
          cost: 123,
        },
        {
          name: "Extra 2",
          per_m: 123,
          cost: 123,
        },
        {
          name: "Extra 2",
          per_m: 123,
          cost: 123,
        },
      ],
    },
  ];

  return (
    <>
      <div className="quote-tool-container">
        <div className="jobs-list">
          {quoteJobs.map((job) => (
            <>
              <div className="job-item-container">
                <div className="job-input-form" id="job-sheets">
                  <label className="job-input-label">
                    Units
                    <input
                      className="job-input"
                      type="text"
                      placeholder="2000"
                    />
                  </label>
                  <label className="job-input-label">
                    Per Sheet
                    <input
                      className="job-input"
                      type="text"
                      placeholder="2000"
                    />
                  </label>
                  <label className="job-input-label">
                    Sheets
                    <input
                      className="job-input"
                      type="text"
                      placeholder="2000"
                    />
                  </label>
                </div>
                <div className="job-notes">
                  <textarea
                    name="clientNotes"
                    id="1"
                    placeholder="Notes for the client"
                    style={job.extras.length ? { maxWidth: "7.5vw" } : {}}
                  />
                  <textarea
                    name="privateNotes"
                    id="2"
                    placeholder="Notes for internal review"
                    style={job.extras.length ? { maxWidth: "7.5vw" } : {}}
                  />
                </div>
                <div
                  className="job-input-form"
                  id="job-extras"
                  style={job.extras.length ? {} : { display: "none" }}
                >
                  <table className="job-input-table" id="extras-table">
                    {job.extras.map((extra, index) => (
                      <tr key={extra.name + index}>
                        <td>x</td>
                        <td>
                          <input
                            className="job-input"
                            type="text"
                            value={extra.name}
                          />
                        </td>
                        <td>
                          <input
                            className="job-input"
                            type="text"
                            placeholder="2000"
                          />
                        </td>
                        <td>
                          <input
                            className="job-input"
                            type="text"
                            placeholder="2000"
                          />
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
                <div className="job-input-form" id="job-work">
                  <table className="job-input-table">
                    {/* row #1 */}
                    <tr>
                      <td>Die</td>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td>
                        <div className="input-break" />
                      </td>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          placeholder="2000.00"
                          disabled
                        />
                      </td>
                      <td style={{ paddingLeft: "0.25rem" }}>Setup</td>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td>
                        <div className="input-break" />
                      </td>
                      <td>
                        <input
                          disabled
                          className="job-input"
                          type="text"
                          placeholder="2000.00"
                        />
                      </td>
                    </tr>
                    {/* row #2 */}
                    <tr>
                      <td>Setup</td>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td>
                        <div className="input-break" />
                      </td>
                      <td>
                        <input
                          disabled
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td style={{ paddingLeft: "0.25rem" }}>Gluer</td>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td>
                        <input
                          className="job-input small"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td>
                        <input
                          disabled
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                    </tr>
                    {/* row #3 */}
                    <tr>
                      <td>Run</td>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td>
                        <input
                          className="job-input small"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td>
                        <input
                          disabled
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td style={{ paddingLeft: "0.25rem" }}>Strip</td>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td>
                        <input
                          className="job-input small"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                      <td>
                        <input
                          disabled
                          className="job-input"
                          type="text"
                          placeholder="2000"
                        />
                      </td>
                    </tr>
                  </table>
                </div>
                <div className="job-input-form" id="job-cost">
                  <table className="job-input-table" id="job-cost-table">
                    {/* row #1 */}
                    <tr>
                      <td>Subtotal</td>
                      <td>Premium</td>
                      <td>Per M</td>
                    </tr>
                    {/* row #2 */}
                    <tr>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          value="2000.00"
                        />
                      </td>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          value="2000.00"
                        />
                      </td>
                      <td>
                        <input
                          className="job-input"
                          type="text"
                          value="2000.00"
                        />
                      </td>
                    </tr>
                    {/* row #3 */}
                    <tr>
                      <td colSpan="3">
                        <input
                          style={{
                            fontWeight: "bold",
                            height: "100%",
                            color: "black",
                          }}
                          className="job-input"
                          type="text"
                          value={"2000.00"}
                          disabled
                        />
                      </td>
                    </tr>
                  </table>
                </div>
                <div className="job-input-form" id="job-controls">
                  <table
                    className="job-input-table"
                    style={{ textAlign: "center" }}
                  >
                    {/* row #1 */}
                    <tr>
                      <td>
                        <button className="job-input-button">Fill All</button>
                      </td>
                      <td>
                        <button className="job-input-button">Add Extras</button>
                      </td>
                    </tr>
                    {/* row #2 */}
                    <tr>
                      <td>
                        <button className="job-input-button">
                          Fill Selected
                        </button>
                      </td>
                      <td rowSpan={2}>
                        <button className="job-input-button">
                          Change Rates
                        </button>
                      </td>
                    </tr>
                    {/* row #3 */}
                    <tr>
                      <td>
                        <button className="job-input-button">Duplicate</button>
                      </td>
                    </tr>
                    {/* row #4 */}
                    <tr>
                      <td>
                        <label>
                          <input type="checkbox" id="job-input-checkbox" /> To
                          Be Filled
                        </label>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </>
          ))}
        </div>
        <button className="add-job-button">+</button>
      </div>
    </>
  );
};

export { PageQuoteTool };
