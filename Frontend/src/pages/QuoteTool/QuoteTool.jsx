import "./QuoteTool.scss";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQuote, updateQuote } from "../../state/quotes/saga";
import { quoteSelector } from "../../state/quotes/quoteSlice";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageQuoteTool = () => {
  const customerNames = [
    { value: "customer1", label: "Customer 1" },
    { value: "customer2", label: "Customer 2" },
    { value: "customer3", label: "Customer 3" },
    { value: "customer4", label: "Customer 4" },
    { value: "customer5", label: "Customer 5" },
    { value: "customer6", label: "Customer 6" },
    { value: "customer7", label: "Customer 7" },
  ];
  let query = useQuery();
  const dispatch = useDispatch();
  const { quote, error } = useSelector(quoteSelector);
  const [editingQuote, setEditingQuote] = useState(quote);

  useEffect(() => {
    dispatch(getQuote({ id: query.get("quoteNumber") }));
  }, [dispatch, query]);

  const saveQuote = (fields) => {
    if (editingQuote) {
      if (fields) dispatch(updateQuote({ id: editingQuote._id, fields }));
      else
        dispatch(updateQuote({ id: editingQuote._id, fields: editingQuote }));
    }
  };

  const handleBlur = (event, fields) => {
    event.preventDefault();
    if (event.currentTarget === event.target) {
      saveQuote(fields);
    }
  };

  useEffect(() => {
    setEditingQuote(quote);
    console.log("quote", quote);
  }, [quote]);

  return (
    <>
      {editingQuote ? (
        <div className="quote-tool-container">
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
                      options={customerNames ? customerNames : []}
                    />
                  </td>
                  <td>Attention:</td>
                  <td>
                    <input
                      type="text"
                      value={editingQuote.attention || ""}
                      onBlur={(event) => {
                        handleBlur(event, {
                          attention: editingQuote.attention,
                        });
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
                      type="text"
                      value={editingQuote.jobName || ""}
                      onBlur={(event) => {
                        handleBlur(event, {
                          jobName: editingQuote.jobName,
                        });
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
                      value={editingQuote.description || ""}
                      onBlur={(event) => {
                        handleBlur(event, {
                          description: editingQuote.description,
                        });
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
                      value={editingQuote.notes || ""}
                      onBlur={(event) => {
                        handleBlur(event, {
                          notes: editingQuote.notes,
                        });
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
                      value={editingQuote.status}
                      onBlur={(event) => {
                        handleBlur(event, {
                          status: editingQuote.status,
                        });
                      }}
                      isClearable={false}
                      onChange={(options) => {
                        setEditingQuote({
                          ...editingQuote,
                          status: options,
                        });
                      }}
                      options={[
                        {
                          value: "diecut",
                          label: "Die Cut",
                        },
                        {
                          value: "strip",
                          label: "Strip",
                        },
                        {
                          value: "foldAndGlue",
                          label: "Fold & Glue",
                        },
                        {
                          value: "score",
                          label: "Score",
                        },
                        {
                          value: "crease",
                          label: "Crease",
                        },
                        {
                          value: "carton",
                          label: "Carton",
                        },
                        {
                          value: "stripHole",
                          label: "Strip Hole",
                        },
                        {
                          value: "skidFlat",
                          label: "Skid Flat",
                        },
                      ]}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="jobs-list">
            {editingQuote.quoteJobs.map((job, jobIndex) => (
              <Fragment key={jobIndex}>
                <div className="job-item-container">
                  <div className="job-input-form" id="job-sheets">
                    <label className="job-input-label">
                      Units
                      <input
                        name="units"
                        className="job-input"
                        type="number"
                        step={1000}
                        value={job.units || 0}
                        onBlur={(event) => {
                          handleBlur(event, {
                            quoteJobs: editingQuote.quoteJobs,
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
                                    units: event.target.value,
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
                      Per Sheet
                      <input
                        className="job-input"
                        type="number"
                        step={10}
                        value={job.perSheet || 0}
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
                        className="job-input"
                        type="number"
                        value={parseInt(job.units / job.perSheet) || 0}
                        readOnly
                      />
                    </label>
                  </div>
                  <div className="job-input-form" id="job-work">
                    <table
                      className="job-input-table"
                      id="job-quantities-table"
                    >
                      <tbody>
                        {/* row #1 */}
                        <tr>
                          <td>Die</td>
                          <td>
                            <input
                              className="job-input"
                              type="number"
                              step={1}
                              value={job.dieHours || 0}
                              onBlur={(event) => {
                                handleBlur(event, {
                                  quoteJobs: editingQuote.quoteJobs,
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
                          <td>
                            <input
                              className="job-input"
                              type="number"
                              readOnly
                              value={job.dieHours * 100} // ! replace with actual value
                            />
                          </td>
                          <td style={{ paddingLeft: "0.25rem" }}>Setup</td>
                          <td>
                            <input
                              name="gluerSetupHours"
                              className="job-input"
                              type="number"
                              value={job.gluerSetupHours || 0}
                              onBlur={(event) => {
                                handleBlur(event, {
                                  quoteJobs: editingQuote.quoteJobs,
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
                          <td>
                            <input
                              readOnly
                              className="job-input"
                              type="number"
                              value={job.gluerSetupHours * 100 || 0} // ! replace with actual value
                            />
                          </td>
                        </tr>
                        {/* row #2 */}
                        <tr>
                          <td>Setup</td>
                          <td>
                            <input
                              className="job-input"
                              type="number"
                              value={job.dieSetup || 0}
                              onBlur={(event) => {
                                handleBlur(event, {
                                  quoteJobs: editingQuote.quoteJobs,
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
                          <td>
                            <input
                              readOnly
                              className="job-input"
                              type="number"
                              value={job.dieSetup * 100 || 0} // ! replace with actual value
                            />
                          </td>
                          <td style={{ paddingLeft: "0.25rem" }}>Gluer</td>
                          <td>
                            <input
                              className="job-input"
                              type="number"
                              value={job.gluerRunSpeed || 0}
                              onBlur={(event) => {
                                handleBlur(event, {
                                  quoteJobs: editingQuote.quoteJobs,
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
                            <input
                              className="job-input small"
                              type="number"
                              value={job.gluerRunM || 0}
                              onBlur={(event) => {
                                handleBlur(event, {
                                  quoteJobs: editingQuote.quoteJobs,
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
                          <td>
                            <input
                              readOnly
                              className="job-input"
                              type="number"
                              value={job.gluerRunSpeed * job.gluerRunM || 0} // ! replace with actual value
                            />
                          </td>
                        </tr>
                        {/* row #3 */}
                        <tr>
                          <td>Run</td>
                          <td>
                            <input
                              className="job-input"
                              type="number"
                              value={job.dieRunSpeed || 0}
                              onBlur={(event) => {
                                handleBlur(event, {
                                  quoteJobs: editingQuote.quoteJobs,
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
                            <input
                              className="job-input small"
                              type="number"
                              onBlur={(event) => {
                                handleBlur(event, {
                                  quoteJobs: editingQuote.quoteJobs,
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
                          <td>
                            <input
                              readOnly
                              className="job-input"
                              type="number"
                              value={job.dieRunSpeed * job.dieRunM || 0} // ! replace with actual value
                            />
                          </td>
                          <td style={{ paddingLeft: "0.25rem" }}>Strip</td>
                          <td>
                            <input
                              className="job-input"
                              type="number"
                              value={job.stripRunSpeed || 0}
                              onBlur={(event) => {
                                handleBlur(event, {
                                  quoteJobs: editingQuote.quoteJobs,
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
                            <input
                              className="job-input small"
                              type="number"
                              value={job.stripRunM || 0}
                              onBlur={(event) => {
                                handleBlur(event, {
                                  quoteJobs: editingQuote.quoteJobs,
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
                          <td>
                            <input
                              readOnly
                              className="job-input"
                              type="number"
                              value={job.stripRunSpeed * job.stripRunM || 0} // ! replace with actual value
                            />
                          </td>
                        </tr>
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
                              defaultValue="2000.00"
                            />
                          </td>
                          <td>
                            <input
                              className="job-input"
                              type="text"
                              defaultValue="2000.00"
                            />
                          </td>
                          <td>
                            <input
                              className="job-input"
                              type="text"
                              defaultValue="2000.00"
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
                              defaultValue={"2000.00"}
                              disabled
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="job-input-form" id="job-controls">
                    <table
                      className="job-input-table"
                      style={{ textAlign: "center" }}
                    >
                      <tbody>
                        {/* row #1 */}
                        <tr>
                          <td>
                            <button className="job-input-button">
                              Fill All
                            </button>
                          </td>
                          <td>
                            <button
                              className="job-input-button"
                              onClick={() => {
                                const newQuoteJobs = editingQuote.quoteJobs.map(
                                  (j, i) => {
                                    if (jobIndex === i) {
                                      return {
                                        ...j,
                                        extraCharges: [...j.extraCharges, {}],
                                      };
                                    }
                                    return j;
                                  }
                                );
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: newQuoteJobs,
                                });
                                saveQuote({
                                  quoteJobs: newQuoteJobs,
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
                            <button className="job-input-button">
                              Fill Selected
                            </button>
                          </td>
                          <td>
                            <button className="job-input-button">
                              Change Rates
                            </button>
                          </td>
                        </tr>
                        {/* row #3 */}
                        <tr>
                          <td>
                            <button className="job-input-button">
                              Duplicate
                            </button>
                          </td>
                          <td>
                            <button
                              className="job-input-button"
                              onClick={() => {
                                console.log(job, jobIndex);
                                const newJobs = editingQuote.quoteJobs.filter(
                                  (j, i) => {
                                    if (jobIndex === i) console.log(j);
                                    return jobIndex !== i;
                                  }
                                );
                                setEditingQuote({
                                  ...editingQuote,
                                  quoteJobs: newJobs,
                                });
                                saveQuote({
                                  quoteJobs: newJobs,
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
                              <input type="checkbox" id="job-input-checkbox" />{" "}
                              To Be Filled
                            </label>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {job.extraCharges.length ? (
                    <div
                      className="job-input-form"
                      id="job-extraCharges"
                      style={job.extraCharges.length ? {} : { display: "none" }}
                    >
                      <table
                        className="job-input-table"
                        id="extraCharges-table"
                      >
                        <thead>
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Cost</th>
                            <th>Per M</th>
                          </tr>
                        </thead>
                        <tbody>
                          {job.extraCharges.map((extra, extraIndex) => (
                            <tr key={extraIndex}>
                              <td>
                                <button
                                  onClick={() => {
                                    const newExtraCharges =
                                      editingQuote.quoteJobs[
                                        jobIndex
                                      ].extraCharges.filter(
                                        (e, i) => i !== extraIndex
                                      );
                                    const newJobs = editingQuote.quoteJobs.map(
                                      (j, i) => {
                                        if (i === jobIndex) {
                                          return {
                                            ...j,
                                            extraCharges: newExtraCharges,
                                          };
                                        }
                                        return j;
                                      }
                                    );
                                    setEditingQuote({
                                      ...editingQuote,
                                      quoteJobs: newJobs,
                                    });
                                    saveQuote({
                                      quoteJobs: newJobs,
                                    });
                                  }}
                                >
                                  x
                                </button>
                              </td>
                              <td>
                                <input
                                  className="job-input"
                                  type="text"
                                  value={extra.name || ""}
                                  onBlur={(event) => {
                                    handleBlur(event, {
                                      quoteJobs: editingQuote.quoteJobs,
                                    });
                                  }}
                                  onChange={(event) => {
                                    const newExtraCharges =
                                      editingQuote.quoteJobs[
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
                              <td>
                                <input
                                  className="job-input"
                                  type="number"
                                  value={extra.perM || ""}
                                  onBlur={(event) => {
                                    handleBlur(event, {
                                      quoteJobs: editingQuote.quoteJobs,
                                    });
                                  }}
                                  onChange={(event) => {
                                    const newExtraCharges =
                                      editingQuote.quoteJobs[
                                        jobIndex
                                      ].extraCharges.map((e, i) => {
                                        if (i === extraIndex) {
                                          return {
                                            ...e,
                                            perM: event.target.value,
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
                              <td>
                                <input
                                  className="job-input"
                                  type="text"
                                  value={extra.cost || ""}
                                  onBlur={(event) => {
                                    handleBlur(event, {
                                      quoteJobs: editingQuote.quoteJobs,
                                    });
                                  }}
                                  onChange={(event) => {
                                    const newExtraCharges =
                                      editingQuote.quoteJobs[
                                        jobIndex
                                      ].extraCharges.map((e, i) => {
                                        if (i === extraIndex) {
                                          return {
                                            ...e,
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
                  ) : (
                    <div className="job-notes">
                      <textarea
                        name="clientNotes"
                        id="1"
                        value={job.clientNotes || ""}
                        placeholder="Notes for the client"
                        onBlur={(event) =>
                          handleBlur(event, {
                            quoteJobs: editingQuote.quoteJobs,
                          })
                        }
                        onChange={(event) => {
                          const newJobs = editingQuote.quoteJobs.map((j, i) => {
                            if (i === jobIndex) {
                              return {
                                ...j,
                                clientNotes: event.target.value,
                              };
                            }
                            return j;
                          });
                          setEditingQuote({
                            ...editingQuote,
                            quoteJobs: newJobs,
                          });
                        }}
                      />
                      <textarea
                        name="privateNotes"
                        id="2"
                        placeholder="Notes for internal review"
                        value={job.internalNotes || ""}
                        onBlur={(event) =>
                          handleBlur(event, {
                            quoteJobs: editingQuote.quoteJobs,
                          })
                        }
                        onChange={(event) => {
                          const newJobs = editingQuote.quoteJobs.map((j, i) => {
                            if (i === jobIndex) {
                              return {
                                ...j,
                                internalNotes: event.target.value,
                              };
                            }
                            return j;
                          });
                          setEditingQuote({
                            ...editingQuote,
                            quoteJobs: newJobs,
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
                {job.extraCharges.length ? (
                  <div className="job-notes-row">
                    <textarea
                      name="clientNotes"
                      id="1"
                      placeholder="Notes for the client"
                      value={job.clientNotes || ""}
                      onBlur={(event) =>
                        handleBlur(event, { quoteJobs: editingQuote.quoteJobs })
                      }
                      onChange={(event) => {
                        const newJobs = editingQuote.quoteJobs.map((j, i) => {
                          if (i === jobIndex) {
                            return {
                              ...j,
                              clientNotes: event.target.value,
                            };
                          }
                          return j;
                        });
                        setEditingQuote({
                          ...editingQuote,
                          quoteJobs: newJobs,
                        });
                      }}
                    />
                    <textarea
                      name="privateNotes"
                      id="2"
                      placeholder="Notes for internal review"
                      value={job.internalNotes || ""}
                      onBlur={(event) => {
                        handleBlur(event, {
                          quoteJobs: editingQuote.quoteJobs,
                        });
                      }}
                      onChange={(event) => {
                        const newJobs = editingQuote.quoteJobs.map((j, i) => {
                          if (i === jobIndex) {
                            return {
                              ...j,
                              internalNotes: event.target.value,
                            };
                          }
                          return j;
                        });
                        setEditingQuote({
                          ...editingQuote,
                          quoteJobs: newJobs,
                        });
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </Fragment>
            ))}
          </div>
          <button
            className="add-job-button"
            onClick={() => {
              setEditingQuote({
                ...editingQuote,
                quoteJobs: [
                  ...editingQuote.quoteJobs,
                  {
                    units: 0,
                    extraCharges: [],
                  },
                ],
              });
              saveQuote({
                quoteJobs: [
                  ...editingQuote.quoteJobs,
                  {
                    units: 0,
                    perSheet: 0,
                    dieHours: 0,
                    dieSetup: 0,
                    dieRunSpeed: 0,
                    dieRunM: 0,
                    gluerSetupHours: 0,
                    gluerRunSpeed: 0,
                    gluerRunM: 0,
                    stripRunSpeed: 0,
                    stripRunM: 0,
                    extraCharges: [],
                  },
                ],
              });
            }}
          >
            +
          </button>
        </div>
      ) : (
        error && (
          <div className="quote-tool-container">
            <h1 style={{ color: "var(--white)" }}>{error}</h1>
          </div>
        )
      )}
    </>
  );
};

export { PageQuoteTool };
