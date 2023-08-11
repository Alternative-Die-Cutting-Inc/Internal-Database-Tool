import "./QuoteTool.scss";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getQuote,
  updateQuote,
  updateJob,
  createJob,
  changeRates,
  getRates,
} from "../../state/quotes/saga";
import {
  quoteSelector,
  ratesSelector,
  ratesEditorSelector,
} from "../../state/quotes/quoteSlice";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { getCustomerNames } from "../../state/customers/saga";
import { customerNamesSelector } from "../../state/customers/customerSlice";
import { ClientSheet } from "../../components/PDF/ClientSheet/ClientSheet";
import { WorkSheet } from "../../components/PDF/WorkSheet/WorkSheet";
import ReactPDF from "@react-pdf/renderer";
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageQuoteTool = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const { rates } = useSelector(ratesSelector);
  const { quote, error } = useSelector(quoteSelector);
  const { ratesEditor } = useSelector(ratesEditorSelector);
  const { customerNames } = useSelector(customerNamesSelector);
  const [editingQuote, setEditingQuote] = useState(quote);
  const [editingRates, setEditingRates] = useState(rates);
  const [fillCheckboxes, setFillCheckboxes] = useState([]);

  useEffect(() => {
    dispatch(getQuote({ id: query.get("quoteNumber") }));
    dispatch(getRates());
  }, [dispatch, query]);

  useEffect(() => {
    dispatch(getCustomerNames());
  }, [dispatch]);

  const saveQuote = (fields) => {
    if (editingQuote) {
      if (fields) dispatch(updateQuote({ id: editingQuote._id, fields }));
      else
        dispatch(updateQuote({ id: editingQuote._id, fields: editingQuote }));
    }
  };

  const saveJob = (jobID, fields) => {
    dispatch(updateJob({ quoteID: editingQuote._id, jobID, fields }));
  };

  const calculateTotal = (job) => {
    let Subtotal = 0,
      Premium = 0,
      PerM = 0,
      Total = 0;
    const jobRates = job.rates;

    Subtotal += job.dieHours * jobRates.die;
    Subtotal += job.dieSetup * jobRates.press;
    Subtotal += (job.dieRunM * (job.units / job.perSheet)) / 1000;
    Subtotal += job.gluerSetupHours * jobRates.gluer;
    Subtotal += (job.gluerRunM * job.units) / 1000;
    Subtotal += (job.stripRunM * job.units) / 1000;

    Subtotal += job.extraCharges.reduce((acc, charge) => {
      acc += parseFloat(charge.cost);
      return parseFloat(acc);
    }, 0.0);

    Premium = Subtotal * parseFloat(jobRates.global + jobRates.customer - 2);

    PerM = (Subtotal + parseFloat(Premium)) / parseFloat(job.units / 1000);

    Total = Subtotal + parseFloat(Premium);

    if (isNaN(Total)) Total = 0;
    if (isNaN(Subtotal)) Subtotal = 0;
    if (isNaN(Premium)) Premium = 0;
    if (isNaN(PerM)) PerM = 0;
    return { Subtotal, Premium, PerM, Total };
  };

  const nextRow = (event) => {
    if (event.key === "Enter") {
      const idx = event.target.parentElement.cellIndex;
      const nextRow =
        event.target.parentElement.parentElement.nextElementSibling;
      if (nextRow !== null) {
        const nextSibling = nextRow.cells[idx].firstChild;
        nextSibling.focus();
      }
    }
  };

  useEffect(() => {
    setEditingQuote(quote);
    setFillCheckboxes(new Array(quote?.quoteJobs?.length).fill(false));
  }, [quote]);

  useEffect(() => {
    setEditingRates({ job: undefined, rates });
  }, [rates]);
  return (
    <>
      {!error ? (
        <div className="quote-tool-container">
          <div
            className="rate-editor-popup"
            style={ratesEditor ? { display: "flex" } : {}}
          >
            <h1>Rate Editor</h1>
            <h3 style={!editingRates?.job ? { color: "red" } : {}}>
              {editingRates?.job ? "Editing Job Rates" : "Editing Global Rates"}
            </h3>
            {editingRates?.rates &&
              Object.keys(editingRates.rates).map((rate, index) => {
                if (rate === "_id" || rate === "__v")
                  return <div key={index}></div>;

                return (
                  <label key={index} htmlFor={rate}>
                    {rate}
                    <br />
                    <input
                      name={rate}
                      type="number"
                      value={editingRates.rates[rate] || 0}
                      onChange={(event) => {
                        setEditingRates({
                          ...editingRates,
                          rates: {
                            ...editingRates.rates,
                            [rate]: event.target.value,
                          },
                        });
                      }}
                    />
                  </label>
                );
              })}
            <button
              onClick={() => {
                if (editingRates.job) {
                  saveJob(editingRates.job._id, {
                    rates: editingRates.rates,
                  });
                  dispatch(changeRates({}));
                  setEditingRates({ job: undefined, rates });
                } else {
                  dispatch(changeRates({ rates: editingRates.rates }));
                  saveJob(editingRates.job._id, {
                    rates: editingRates.rates,
                  });
                }
              }}
            >
              Save
            </button>
          </div>
          <div className="quote-info-container">
            <table className="job-input-table" id="quote-info-table">
              <tbody>
                <tr>
                  <td>Customer Name:</td>
                  <td>
                    <Select
                      className="quote-info-select"
                      classNamePrefix="customer-select"
                      unstyled
                      menuPosition="fixed"
                      options={customerNames || []}
                      value={{
                        label: editingQuote?.customer.name,
                        value: editingQuote?.customer.customerID,
                      }}
                      onChange={(option) => {
                        saveQuote({
                          customer: {
                            name: option.label,
                            customerID: option.value,
                          },
                        });
                      }}
                    />
                  </td>
                  <td>Attention:</td>
                  <td>
                    <input
                      className="quote-info-input"
                      type="text"
                      value={editingQuote?.attention || ""}
                      onBlur={() => {
                        saveQuote({ attention: editingQuote.attention });
                      }}
                      onChange={(event) => {
                        setEditingQuote({
                          ...editingQuote,
                          attention: event.target.value,
                        });
                      }}
                    />
                  </td>
                  <td>Job Name:</td>
                  <td>
                    <input
                      className="quote-info-input"
                      type="text"
                      value={editingQuote?.jobName || ""}
                      onBlur={() => {
                        saveQuote({ jobName: editingQuote.jobName });
                      }}
                      onChange={(event) => {
                        setEditingQuote({
                          ...editingQuote,
                          jobName: event.target.value,
                        });
                      }}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Description:</td>
                  <td>
                    <textarea
                      type="text"
                      value={editingQuote?.description || ""}
                      onBlur={() => {
                        saveQuote({ description: editingQuote.description });
                      }}
                      onChange={(event) => {
                        setEditingQuote({
                          ...editingQuote,
                          description: event.target.value,
                        });
                      }}
                    />
                  </td>
                  <td>Notes:</td>
                  <td>
                    <textarea
                      type="text"
                      value={editingQuote?.notes || ""}
                      onBlur={() => {
                        saveQuote({ notes: editingQuote.notes });
                      }}
                      onChange={(event) => {
                        setEditingQuote({
                          ...editingQuote,
                          notes: event.target.value,
                        });
                      }}
                    />
                  </td>
                  <td>Status:</td>
                  <td>
                    <CreatableSelect
                      className="status-select"
                      classNamePrefix="status-select"
                      isMulti
                      menuPosition="fixed"
                      closeMenuOnSelect={false}
                      value={editingQuote?.status}
                      onBlur={() => {
                        saveQuote({ status: editingQuote.status });
                      }}
                      isClearable={false}
                      onChange={(options) => {
                        setEditingQuote({
                          ...editingQuote,
                          status: options,
                        });
                      }}
                      options={[
                        { value: "Sent", label: "Sent" },
                        { value: "Approved", label: "Approved" },
                      ]}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="jobs-list">
            {editingQuote?.quoteJobs?.map((job, jobIndex) => (
              <div key={job._id} className="job-item-container">
                <div className="job-input-form" id="job-sheets">
                  <label className="job-input-label">
                    Units
                    <input
                      name="units"
                      className="job-input large"
                      type="number"
                      step={1000}
                      value={job.units || 0}
                      onBlur={() => {
                        saveJob(job._id, {
                          units: job.units,
                          total: calculateTotal(job).Total,
                        });
                      }}
                      onChange={(event) => {
                        setEditingQuote({
                          ...editingQuote,
                          quoteJobs: editingQuote.quoteJobs.map((j, i) => {
                            if (i === jobIndex) {
                              return {
                                ...j,
                                units: event.target.value,
                              };
                            }
                            return j;
                          }),
                        });
                      }}
                    />
                  </label>
                  <label className="job-input-label">
                    Per Sheet
                    <input
                      className="job-input large"
                      type="number"
                      step={5}
                      value={job.perSheet || 0}
                      onBlur={() => {
                        saveJob(job._id, {
                          perSheet: job.perSheet,
                          total: calculateTotal(job).Total,
                        });
                      }}
                      onChange={(event) => {
                        setEditingQuote({
                          ...editingQuote,
                          quoteJobs: editingQuote.quoteJobs.map(
                            (job, index) => {
                              if (index === jobIndex) {
                                return {
                                  ...job,
                                  perSheet: event.target.value,
                                };
                              }
                              return job;
                            }
                          ),
                        });
                      }}
                    />
                  </label>
                  <label className="job-input-label">
                    Sheets
                    <input
                      className="job-input large"
                      type="number"
                      value={parseInt(job.units / job.perSheet) || 0}
                      readOnly
                    />
                  </label>
                </div>
                <div className="job-input-form" id="job-work">
                  <div className="quantities-tables">
                    <table
                      className="job-input-table"
                      id="job-quantities-table"
                    >
                      <thead>
                        <tr>
                          <th colSpan={4}>
                            <div>
                              Press
                              <select
                                value={job.pressMachine}
                                onBlur={() => {
                                  saveJob(job._id, {
                                    pressMachine: job.pressMachine,
                                    rates: job.rates,
                                  });
                                }}
                                onChange={(event) => {
                                  setEditingQuote({
                                    ...editingQuote,
                                    quoteJobs: editingQuote.quoteJobs.map(
                                      (j, i) => {
                                        if (i === jobIndex) {
                                          return {
                                            ...j,
                                            pressMachine: event.target.value,
                                            rates: {
                                              ...j.rates,
                                              press:
                                                job.rates[event.target.value],
                                            },
                                          };
                                        }
                                        return j;
                                      }
                                    ),
                                  });
                                }}
                              >
                                <option value={"bobst"}>Bobst</option>
                                <option value={"ijima"}>Ijima</option>
                                <option value={"heidelberg"}>Heidelberg</option>
                              </select>
                              <select>
                                <option value="0.5">0.5</option>
                                <option value="1">1</option>
                                <option value="1.5">1.5</option>
                                <option value="2">2</option>
                              </select>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Die</td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input"
                              type="number"
                              step={1}
                              value={job.dieHours || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  dieHours: job.dieHours,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (job, index) => {
                                      if (index === jobIndex) {
                                        return {
                                          ...job,
                                          dieHours: event.target.value,
                                        };
                                      }
                                      return job;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td>
                            <div className="input-break" />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input large"
                              type="number"
                              readOnly
                              value={
                                parseFloat(
                                  job.dieHours * job.rates.die
                                ).toFixed(2) || 0
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Setup</td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input"
                              type="number"
                              value={job.dieSetup || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  dieSetup: job.dieSetup,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (job, index) => {
                                      if (index === jobIndex) {
                                        return {
                                          ...job,
                                          dieSetup: event.target.value,
                                        };
                                      }
                                      return job;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td>
                            <div className="input-break" />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              readOnly
                              className="job-input large"
                              type="number"
                              value={
                                parseFloat(
                                  job.dieSetup * job.rates.press
                                ).toFixed(2) || 0
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>Run</td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input"
                              type="number"
                              step={1000}
                              value={job.dieRunSpeed || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  dieRunSpeed: job.dieRunSpeed,
                                  dieRunM:
                                    (job.rates.press * 1000) / job.dieRunSpeed,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (job, index) => {
                                      if (index === jobIndex) {
                                        return {
                                          ...job,
                                          dieRunSpeed: event.target.value,
                                          dieRunM:
                                            (job.rates.press * 1000) /
                                            event.target.value,
                                        };
                                      }
                                      return job;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input small"
                              type="number"
                              value={job.dieRunM || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  dieRunM: job.dieRunM,
                                  dieRunSpeed:
                                    (job.rates.press * 1000) / job.dieRunM,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (job, index) => {
                                      if (index === jobIndex) {
                                        return {
                                          ...job,
                                          dieRunSpeed:
                                            (job.rates.press * 1000) /
                                            event.target.value,
                                          dieRunM: event.target.value,
                                        };
                                      }
                                      return job;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              readOnly
                              className="job-input large"
                              type="number"
                              value={
                                parseFloat(
                                  job.dieRunM *
                                    (job.units / job.perSheet / 1000)
                                ).toFixed(2) || 0
                              }
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      className="job-input-table"
                      id="job-quantities-table"
                    >
                      <thead>
                        <tr>
                          <th colSpan={4}>Gluer and Strip</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ paddingLeft: "0.25rem" }}>Setup</td>
                          <td onKeyDown={nextRow}>
                            <input
                              name="gluerSetupHours"
                              className="job-input"
                              type="number"
                              value={job.gluerSetupHours || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  gluerSetupHours: job.gluerSetupHours,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (job, index) => {
                                      if (index === jobIndex) {
                                        return {
                                          ...job,
                                          gluerSetupHours: event.target.value,
                                        };
                                      }
                                      return job;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td>
                            <div className="input-break" />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              readOnly
                              className="job-input large"
                              type="number"
                              value={job.gluerSetupHours * job.rates.gluer || 0}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingLeft: "0.25rem" }}>Gluer</td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input"
                              type="number"
                              step={1000}
                              value={job.gluerRunSpeed || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  gluerRunSpeed: job.gluerRunSpeed,
                                  gluerRunM:
                                    (job.rates.gluer * 1000) /
                                    job.gluerRunSpeed,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (job, index) => {
                                      if (index === jobIndex) {
                                        return {
                                          ...job,
                                          gluerRunSpeed: event.target.value,
                                          gluerRunM:
                                            (job.rates.gluer * 1000) /
                                            event.target.value,
                                        };
                                      }
                                      return job;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input small"
                              type="number"
                              value={job.gluerRunM || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  gluerRunSpeed:
                                    (job.rates.gluer * 1000) / job.gluerRunM,
                                  gluerRunM: job.gluerRunM,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (job, index) => {
                                      if (index === jobIndex) {
                                        return {
                                          ...job,
                                          gluerRunSpeed:
                                            (job.rates.gluer * 1000) /
                                            event.target.value,
                                          gluerRunM: event.target.value,
                                        };
                                      }
                                      return job;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              readOnly
                              className="job-input large"
                              type="number"
                              value={
                                parseFloat(
                                  (job.gluerRunM * job.units) / 1000
                                ).toFixed(2) || 0
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ paddingLeft: "0.25rem" }}>Strip</td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input"
                              type="number"
                              step={1000}
                              value={job.stripRunSpeed || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  stripRunSpeed: job.stripRunSpeed,
                                  stripRunM:
                                    (job.rates.strip * 1000) /
                                    job.stripRunSpeed,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (job, index) => {
                                      if (index === jobIndex) {
                                        return {
                                          ...job,
                                          stripRunSpeed: event.target.value,
                                          stripRunM:
                                            (job.rates.strip * 1000) /
                                            event.target.value,
                                        };
                                      }
                                      return job;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input small"
                              type="number"
                              value={job.stripRunM || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  stripRunSpeed:
                                    (job.rates.strip * 1000) / job.stripRunM,
                                  stripRunM: job.stripRunM,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (job, index) => {
                                      if (index === jobIndex) {
                                        return {
                                          ...job,
                                          stripRunSpeed:
                                            (job.rates.strip * 1000) /
                                            event.target.value,
                                          stripRunM: event.target.value,
                                        };
                                      }
                                      return job;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              readOnly
                              className="job-input large"
                              type="number"
                              value={
                                parseFloat(
                                  (job.stripRunM * job.units) / 1000
                                ).toFixed(2) || 0
                              }
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <table
                    className="job-input-table"
                    id="extraCharges-table"
                    style={job.extraCharges.length ? {} : { display: "none" }}
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Per M</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {job.extraCharges?.map((extra, extraIndex) => (
                        <tr key={extraIndex}>
                          <td>
                            <button
                              onClick={() => {
                                saveJob(job._id, {
                                  extraCharges: job.extraCharges.filter(
                                    (e, i) => i !== extraIndex
                                  ),
                                });
                              }}
                            >
                              x
                            </button>
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input"
                              type="text"
                              value={extra.name || ""}
                              onBlur={() => {
                                saveJob(job._id, {
                                  extraCharges: job.extraCharges,
                                });
                              }}
                              onChange={(event) => {
                                const newExtraCharges = editingQuote.quoteJobs[
                                  jobIndex
                                ].extraCharges.map((e, i) => {
                                  if (i === extraIndex) {
                                    return {
                                      ...e,
                                      name: event.target.value,
                                    };
                                  }
                                  return e;
                                });
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (j, i) => {
                                      if (i === jobIndex) {
                                        return {
                                          ...j,
                                          extraCharges: newExtraCharges,
                                        };
                                      }
                                      return j;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input"
                              type="number"
                              step={5}
                              value={extra.perM || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  extraCharges: job.extraCharges,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                const newExtraCharges = editingQuote.quoteJobs[
                                  jobIndex
                                ].extraCharges.map((e, i) => {
                                  if (i === extraIndex) {
                                    return {
                                      ...e,
                                      perM: event.target.value,
                                      cost:
                                        event.target.value * (job.units / 1000),
                                    };
                                  }
                                  return e;
                                });
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (j, i) => {
                                      if (i === jobIndex) {
                                        return {
                                          ...j,
                                          extraCharges: newExtraCharges,
                                        };
                                      }
                                      return j;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                          <td onKeyDown={nextRow}>
                            <input
                              className="job-input"
                              type="number"
                              step={100}
                              value={extra.cost || 0}
                              onBlur={() => {
                                saveJob(job._id, {
                                  extraCharges: job.extraCharges,
                                  total: calculateTotal(job).Total,
                                });
                              }}
                              onChange={(event) => {
                                const newExtraCharges = editingQuote.quoteJobs[
                                  jobIndex
                                ].extraCharges.map((e, i) => {
                                  if (i === extraIndex) {
                                    return {
                                      ...e,
                                      perM:
                                        event.target.value /
                                        ((job.units || 0) / 1000),
                                      cost: event.target.value,
                                    };
                                  }
                                  return e;
                                });
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: editingQuote.quoteJobs.map(
                                    (j, i) => {
                                      if (i === jobIndex) {
                                        return {
                                          ...j,
                                          extraCharges: newExtraCharges,
                                        };
                                      }
                                      return j;
                                    }
                                  ),
                                });
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="job-input-form" id="job-cost">
                  <table className="job-input-table" id="job-cost-table">
                    <tbody>
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
                            value={
                              calculateTotal(job).Subtotal.toLocaleString(
                                "en-CA",
                                {
                                  style: "currency",
                                  currency: "CAD",
                                  currencyDisplay: "symbol",
                                }
                              ) || 0
                            }
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="job-input"
                            type="text"
                            value={
                              calculateTotal(job).Premium.toLocaleString(
                                "en-CA",
                                {
                                  style: "currency",
                                  currency: "CAD",
                                  currencyDisplay: "symbol",
                                }
                              ) || 0
                            }
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            className="job-input"
                            type="text"
                            value={
                              calculateTotal(job).PerM.toLocaleString("en-CA", {
                                style: "currency",
                                currency: "CAD",
                                currencyDisplay: "symbol",
                              }) || 0
                            }
                            readOnly
                          />
                        </td>
                      </tr>
                      {/* row #3 */}
                      <tr>
                        <td colSpan="3">
                          <h3>
                            {job.total.toLocaleString("en-CA", {
                              style: "currency",
                              currency: "CAD",
                              currencyDisplay: "symbol",
                            })}
                          </h3>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="job-input-form" id="job-controls">
                  <table
                    className="job-input-table"
                    id="job-controls-table"
                    style={{ textAlign: "center" }}
                  >
                    <tbody>
                      {/* row #1 */}
                      <tr>
                        <td>
                          <button
                            className="job-input-button"
                            onClick={() => {
                              saveQuote({
                                quoteJobs: editingQuote.quoteJobs.map(() => {
                                  return { ...job, _id: undefined };
                                }),
                              });
                            }}
                          >
                            Fill All
                          </button>
                        </td>
                        <td>
                          <button
                            className="job-input-button"
                            onClick={() => {
                              saveQuote({
                                quoteJobs: editingQuote.quoteJobs.map(
                                  (j, i) => {
                                    if (jobIndex === i) {
                                      return {
                                        ...j,
                                        extraCharges: [...j.extraCharges, {}],
                                      };
                                    }
                                    return j;
                                  }
                                ),
                              });
                            }}
                          >
                            Add Extras
                          </button>
                        </td>
                      </tr>
                      {/* row #2 */}
                      <tr>
                        <td>
                          <button
                            className="job-input-button"
                            onClick={() => {
                              saveQuote({
                                quoteJobs: editingQuote.quoteJobs.map(
                                  (j, i) => {
                                    if (fillCheckboxes[i])
                                      return {
                                        ...job,
                                        _id: j._id,
                                        rates: j.rates,
                                        total: undefined,
                                        dieRunM: undefined,
                                        gluerRunM: undefined,
                                        stripRunM: undefined,
                                      };
                                    return j;
                                  }
                                ),
                              });
                            }}
                          >
                            Fill Selected
                          </button>
                        </td>
                        <td>
                          <button
                            className="job-input-button"
                            onClick={() => {
                              if (!ratesEditor) {
                                dispatch(changeRates({}));
                                setEditingRates({ job, rates: job.rates });
                              }
                            }}
                          >
                            Change Rates
                          </button>
                        </td>
                      </tr>
                      {/* row #3 */}
                      <tr>
                        <td>
                          <button
                            className="job-input-button"
                            onClick={() => {
                              dispatch(
                                createJob({
                                  quoteID: editingQuote._id,
                                  fields: {
                                    ...job,
                                    _id: undefined,
                                    rates: undefined,
                                    total: undefined,
                                    dieRunM: undefined,
                                    gluerRunM: undefined,
                                    stripRunM: undefined,
                                  },
                                })
                              );
                            }}
                          >
                            Duplicate
                          </button>
                        </td>
                        <td>
                          <button
                            className="job-input-button"
                            onClick={() => {
                              saveQuote({
                                quoteJobs: editingQuote.quoteJobs.filter(
                                  (j, i) => {
                                    return jobIndex !== i;
                                  }
                                ),
                              });
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {/* row #4 */}
                      <tr>
                        <td>
                          <label>
                            <input
                              checked={fillCheckboxes[jobIndex]}
                              onChange={() => {
                                setFillCheckboxes(
                                  fillCheckboxes.map((c, i) => {
                                    if (i === jobIndex) {
                                      return !c;
                                    }
                                    return c;
                                  })
                                );
                              }}
                              type="checkbox"
                              id="job-input-checkbox"
                            />
                            {" To Be Filled"}
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="job-notes">
                  <textarea
                    name="clientNotes"
                    id="1"
                    value={job.clientNotes || ""}
                    placeholder="Notes for the client"
                    onBlur={() => {
                      saveJob(job._id, {
                        clientNotes: job.clientNotes,
                      });
                    }}
                    onChange={(event) => {
                      setEditingQuote({
                        ...editingQuote,
                        quoteJobs: editingQuote.quoteJobs.map((j, i) => {
                          if (i === jobIndex) {
                            return {
                              ...j,
                              clientNotes: event.target.value,
                            };
                          }
                          return j;
                        }),
                      });
                    }}
                  />
                  <textarea
                    name="privateNotes"
                    id="2"
                    placeholder="Notes for internal review"
                    value={job.internalNotes || ""}
                    onBlur={() => {
                      saveJob(job._id, {
                        internalNotes: job.internalNotes,
                      });
                    }}
                    onChange={(event) => {
                      setEditingQuote({
                        ...editingQuote,
                        quoteJobs: editingQuote.quoteJobs.map((j, i) => {
                          if (i === jobIndex) {
                            return {
                              ...j,
                              internalNotes: event.target.value,
                            };
                          }
                          return j;
                        }),
                      });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={async () => {
              const blob = await ReactPDF.pdf(
                WorkSheet(quote, { firstName: "Farbod" }, calculateTotal)
              ).toBlob();
              const fileURL = URL.createObjectURL(blob);
              const pdfWindow = window.open(fileURL, "_blank");
              pdfWindow && pdfWindow.focus();
            }}
          >
            PDF
          </button>
          <button
            className="add-job-button"
            onClick={() => {
              dispatch(createJob({ quoteID: editingQuote._id }));
            }}
          >
            +
          </button>
        </div>
      ) : (
        <div className="quote-tool-container">
          <h1 style={{ color: "var(--white)" }}>{error}</h1>
        </div>
      )}
    </>
  );
};

// const QuoteInfo = () => {
//
//   return (

//   );
// };

export { PageQuoteTool };
