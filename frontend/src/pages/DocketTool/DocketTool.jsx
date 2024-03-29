import "./DocketTool.scss";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDocket, updateDocket } from "../../state/dockets/saga";
import { docketSelector } from "../../state/dockets/docketSlice";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { clearEmail } from "../../state/customers/saga";
import { customerNamesSelector } from "../../state/customers/customerSlice";
import { getQuote } from "../../state/quotes/saga";
import { quoteSelector } from "../../state/quotes/quoteSlice";
import { shipmentsSelector } from "../../state/shipments/shipmentsSlice";
import { getDocketShipments } from "../../state/shipments/saga";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageDocketTool = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const { docket } = useSelector(docketSelector);
  const { docketShipments } = useSelector(shipmentsSelector)
  const { quote } = useSelector(quoteSelector);
  const { customerNames } = useSelector(customerNamesSelector);
  const [editingDocket, setEditingDocket] = useState();

  useEffect(() => {
    dispatch(getDocket({ id: query.get("docketNumber") }));
    dispatch(getDocketShipments({ docketNumber: query.get("docketNumber") }));
  }, [dispatch, query]);


  useEffect(() => {
    dispatch(clearEmail());
  }, [dispatch]);

  const saveDocket = (fields) => {
    if (editingDocket !== null) {
      if (fields) dispatch(updateDocket({ id: editingDocket?._id, fields }));
      else
        dispatch(
          updateDocket({ id: editingDocket?._id, fields: editingDocket })
        );
    }
  };

  const handleBlur = (fields) => {
    // if total quantity doesnt match, update it
    if (
      editingDocket?.forms?.reduce(
        (totalQuantity, form) =>
          parseInt(totalQuantity) + parseInt(form.quantity),
        0
      ) !== editingDocket?.numOfUnits
    )
      saveDocket({
        ...fields,
        numOfUnits: editingDocket?.forms?.reduce(
          (totalQuantity, form) =>
            parseInt(totalQuantity) + parseInt(form.quantity),
          0
        ),
      });
    else saveDocket(fields);
  };

  const handleCheckbox = (event) => {
    if (
      event.target.checked &&
      !editingDocket?.finishing
        .map((value) => value.value)
        .includes(event.target.id)
    ) {
      setEditingDocket({
        ...editingDocket,
        finishing: [
          ...editingDocket.finishing,
          { value: event.target.id, label: event.target.name },
        ],
      });
      saveDocket({
        finishing: [
          ...editingDocket.finishing,
          { value: event.target.id, label: event.target.name },
        ],
      });
    }
    if (
      !event.target.checked &&
      editingDocket?.finishing
        .map((value) => value.value)
        .includes(event.target.id)
    ) {
      setEditingDocket({
        ...editingDocket,
        finishing: editingDocket?.finishing.filter(
          (f) => f.value !== event.target.id
        ),
      });
      saveDocket({
        finishing: editingDocket?.finishing.filter(
          (f) => f.value !== event.target.id
        ),
      });
    }
  };

  useEffect(() => {
    setEditingDocket({
      ...docket,
      numOfUnits: docket?.numOfUnits
        ? docket.numOfUnits
        : docket?.forms?.reduce(
          (totalQuantity, form) =>
            parseInt(totalQuantity) + parseInt(form.quantity),
          0
        ),
    });
  }, [docket]);

  useEffect(() => {
    if (docket?.quoteNumber) dispatch(getQuote({ id: docket?.quoteNumber }));
  }, [docket?.quoteNumber, dispatch]);

  useEffect(() => {
    if (docket && (!quote || !quote?.quoteJobs))
      dispatch(
        updateDocket({
          id: docket?._id,
          fields: {
            quoteJob: null,
          },
        })
      );
  }, [quote, dispatch]);

  if (!docket)
    return (
      <div className="docket-tool-container">
        <h2 style={{ textAlign: "center", paddingTop: "40px" }}>
          {"No docket found. Please recheck the docket number and try again"}
        </h2>
      </div>
    );

  return (
    <div className="docket-tool-container">
      <div className="docket-info">
        <table className="docket-info-table" id="docket-info-table">
          <tbody>
            <tr>
              <td className="docket-info-label">Docket #:</td>
              <td>
                <input
                  type="text"
                  className="docket-info-input"
                  value={editingDocket?.docketNumber || ""}
                  readOnly
                />
              </td>
              <td className="docket-info-label">Customer:</td>
              <td>
                <Select
                  className="docket-info-select"
                  classNamePrefix="customer-select"
                  unstyled
                  menuPosition="fixed"
                  options={customerNames || []}
                  value={
                    {
                      label: editingDocket?.customer?.name,
                      value: editingDocket?.customer?.customerID,
                    } || {}
                  }
                  onChange={(option) => {
                    saveDocket({
                      customer: {
                        name: option.label,
                        customerID: option.value,
                      },
                    });
                  }}
                />
              </td>
              <td className="docket-info-label">Customer PO:</td>
              <td>
                <input
                  type="text"
                  className="docket-info-input"
                  value={editingDocket?.customerPO || ""}
                  onBlur={() => {
                    handleBlur({
                      customerPO: editingDocket?.customerPO,
                    });
                  }}
                  onChange={(event) => {
                    setEditingDocket({
                      ...editingDocket,
                      customerPO: event.target.value,
                    });
                  }}
                />
              </td>
              <td className="docket-info-label">Job Name:</td>
              <td>
                <input
                  type="text"
                  className="docket-info-input"
                  value={editingDocket?.jobName || ""}
                  onBlur={() => {
                    handleBlur({
                      jobName: editingDocket?.jobName,
                    });
                  }}
                  onChange={(event) => {
                    setEditingDocket({
                      ...editingDocket,
                      jobName: event.target.value,
                    });
                  }}
                />
              </td>
              <td className="docket-info-label">Quote Job:</td>
              <td>
                <select
                  className="docket-info-input"
                  value={editingDocket?.quoteJob?.id || ""}
                  onBlur={() => {
                    handleBlur({
                      quoteJob: editingDocket.quoteJob,
                    });
                  }}
                  onChange={(event) => {
                    setEditingDocket({
                      ...editingDocket,
                      quoteJob: {
                        id: event.target.selectedOptions[0].value,
                        name: event.target.selectedOptions[0].textContent,
                      },
                    });
                  }}
                >
                  <option value="">Select a quote job</option>
                  {quote ? (
                    quote.quoteJobs?.map((job, index) => (
                      <option key={index} value={job._id}>
                        {job.units +
                          " units, " +
                          job.total.toLocaleString("en-CA", {
                            style: "currency",
                            currency: "CAD",
                          }) +
                          " at " +
                          (job.total / (job.units / 1000)).toLocaleString(
                            "en-CA",
                            {
                              style: "currency",
                              currency: "CAD",
                            }
                          ) +
                          "/M"}
                      </option>
                    ))
                  ) : (
                    <option value="">No quote found</option>
                  )}
                </select>
              </td>
            </tr>
            <tr>
              <td className="docket-info-label">Quote #:</td>
              <td>
                <input
                  type="text"
                  className="docket-info-input"
                  value={editingDocket?.quoteNumber || ""}
                  onBlur={() => {
                    if (
                      docket.quoteNumber !==
                      parseInt(editingDocket?.quoteNumber)
                    )
                      handleBlur({
                        quoteNumber: editingDocket?.quoteNumber,
                        quoteJob: null,
                      });
                  }}
                  onChange={(event) => {
                    setEditingDocket({
                      ...editingDocket,
                      quoteNumber: event.target.value,
                    });
                  }}
                />
              </td>
              <td className="docket-info-label">Production Person:</td>
              <td>
                <input
                  type="text"
                  className="docket-info-input"
                  value={editingDocket?.productionPerson || ""}
                  onBlur={() => {
                    handleBlur({
                      productionPerson: editingDocket?.productionPerson,
                    });
                  }}
                  onChange={(event) => {
                    setEditingDocket({
                      ...editingDocket,
                      productionPerson: event.target.value,
                    });
                  }}
                />
              </td>
              <td className="docket-info-label">Sold For:</td>
              <td>
                <input
                  type="text"
                  className="docket-info-input"
                  value={
                    editingDocket?.soldFor
                      ? editingDocket?.soldFor.toLocaleString("en-CA", {
                        style: "currency",
                        currency: "CAD",
                        currencyDisplay: "symbol",
                      })
                      : "" || ""
                  }
                  onBlur={() => {
                    handleBlur({
                      soldFor: editingDocket?.soldFor,
                    });
                  }}
                  onChange={(event) => {
                    setEditingDocket({
                      ...editingDocket,
                      soldFor: event.target.value,
                    });
                  }}
                />
              </td>
              <td className="docket-info-label">Job Type:</td>
              <td>
                <select
                  className="docket-info-input"
                  value={editingDocket?.jobType || ""}
                  onBlur={() => {
                    handleBlur({
                      jobType: editingDocket?.jobType,
                    });
                  }}
                  onChange={(event) => {
                    setEditingDocket({
                      ...editingDocket,
                      jobType: event.target.value,
                    });
                  }}
                >
                  <option value="commercial">Commercial</option>
                  <option value="packaging">Packaging</option>
                  <option value="nflute">N-Flute</option>
                  <option value="other">Other</option>
                </select>
              </td>
              <td className="docket-info-label">Status:</td>
              <td>
                <CreatableSelect
                  className="status-select docket-info-input"
                  classNamePrefix="status-select"
                  isMulti
                  menuPosition="fixed"
                  closeMenuOnSelect={false}
                  value={editingDocket?.status}
                  onBlur={() => {
                    saveDocket({ status: editingDocket.status });
                  }}
                  isClearable={false}
                  onChange={(options) => {
                    setEditingDocket({
                      ...editingDocket,
                      status: options,
                    });
                  }}
                  options={[
                    { value: "Stopped", label: "Stopped" },
                    { value: "On The Floor", label: "On The Floor" },
                    { value: "In Progress", label: "In Progress" },
                    { value: "Closed", label: "Closed" },
                  ]}
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
              <table className="docket-info-table" id="finishing-info-table">
                <tbody>
                  <tr>
                    <td>Die:</td>
                    <td>
                      <div className="die-tabs">
                        <div
                          className="die-tab"
                          style={
                            editingDocket?.die?.standing
                              ? {
                                backgroundColor: "var(--light-grey)",
                                color: "black",
                              }
                              : {}
                          }
                          onClick={() => {
                            setEditingDocket({
                              ...editingDocket,
                              die: {
                                ...editingDocket?.die,
                                standing: true,
                              },
                            });
                          }}
                        >
                          Standing
                        </div>
                        <div
                          className="die-tab"
                          style={
                            !editingDocket?.die?.standing
                              ? {
                                backgroundColor: "var(--light-grey)",
                                color: "black",
                              }
                              : {}
                          }
                          onClick={() => {
                            setEditingDocket({
                              ...editingDocket,
                              die: {
                                ...editingDocket?.die,
                                standing: false,
                              },
                            });
                          }}
                        >
                          New
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>Die number:</td>
                    <td>
                      <input
                        type="text"
                        value={
                          editingDocket?.die?.standing
                            ? editingDocket?.die?.dieID
                            : editingDocket?.docketNumber || ""
                        }
                        onBlur={() => {
                          handleBlur({
                            die: editingDocket?.die,
                          });
                        }}
                        onChange={(event) => {
                          setEditingDocket({
                            ...editingDocket,
                            die: {
                              ...editingDocket?.die,
                              dieID: event.target.value,
                            },
                          });
                        }}
                        readOnly={!editingDocket?.die?.standing}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Die type:</td>
                    <td>
                      <select
                        value={editingDocket?.die?.dieType || ""}
                        onBlur={() => {
                          handleBlur({
                            die: {
                              ...editingDocket?.die,
                              dieType: editingDocket?.die?.dieType,
                            },
                          });
                        }}
                        onChange={(event) => {
                          setEditingDocket({
                            ...editingDocket,
                            die: {
                              ...editingDocket?.die,
                              dieType: event.target.value,
                            },
                          });
                        }}
                        disabled={editingDocket?.die?.standing}
                      >
                        <option value="H-die">H-die</option>
                        <option value="B-die">B-die</option>
                        <option value="other">Other</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="die-options">
              <table className="docket-info-table" id="finishing-option-table">
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="diecut">
                        <input
                          type="checkbox"
                          name="Die Cut"
                          id="diecut"
                          checked={
                            editingDocket?.finishing
                              ?.map((value) => value.value)
                              .includes("diecut") || false
                          }
                          onChange={handleCheckbox}
                        />{" "}
                        Die Cut
                      </label>
                    </td>
                    <td>
                      <label htmlFor="strip">
                        <input
                          checked={
                            editingDocket?.finishing
                              ?.map((value) => value.value)
                              .includes("strip") || false
                          }
                          onChange={handleCheckbox}
                          type="checkbox"
                          name="Strip"
                          id="strip"
                        />{" "}
                        Strip
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="foldAndGlue">
                        <input
                          checked={
                            editingDocket?.finishing
                              ?.map((value) => value.value)
                              .includes("foldAndGlue") || false
                          }
                          onChange={handleCheckbox}
                          type="checkbox"
                          name="Fold & Glue"
                          id="foldAndGlue"
                        />{" "}
                        Fold & Glue
                      </label>
                    </td>
                    <td>
                      <label htmlFor="score">
                        <input
                          checked={
                            editingDocket?.finishing
                              ?.map((value) => value.value)
                              .includes("score") || false
                          }
                          onChange={handleCheckbox}
                          type="checkbox"
                          name="Score"
                          id="score"
                        />{" "}
                        Score
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="crease">
                        <input
                          checked={
                            editingDocket?.finishing
                              ?.map((value) => value.value)
                              .includes("crease") || false
                          }
                          onChange={handleCheckbox}
                          type="checkbox"
                          name="Crease"
                          id="crease"
                        />{" "}
                        Crease
                      </label>
                    </td>
                    <td>
                      <label htmlFor="carton">
                        <input
                          checked={
                            editingDocket?.finishing
                              ?.map((value) => value.value)
                              .includes("carton") || false
                          }
                          onChange={handleCheckbox}
                          type="checkbox"
                          name="Carton"
                          id="carton"
                        />{" "}
                        Carton
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="stripHole">
                        <input
                          checked={
                            editingDocket?.finishing
                              ?.map((value) => value.value)
                              .includes("stripHole") || false
                          }
                          onChange={handleCheckbox}
                          type="checkbox"
                          name="Strip Hole"
                          id="stripHole"
                        />{" "}
                        Strip Hole
                      </label>
                    </td>
                    <td>
                      <label htmlFor="skidFlat">
                        <input
                          checked={
                            editingDocket?.finishing
                              ?.map((value) => value.value)
                              .includes("skidFlat") || false
                          }
                          onChange={handleCheckbox}
                          type="checkbox"
                          name="Skid Flat"
                          id="skidFlat"
                        />{" "}
                        Skid Flat
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="finishing-notes">
              <CreatableSelect
                className="finishing-select"
                classNamePrefix="finishing-select"
                isMulti
                closeMenuOnSelect={false}
                value={editingDocket?.finishing || ""}
                onBlur={() => {
                  handleBlur({
                    finishing: editingDocket?.finishing,
                  });
                }}
                isClearable={false}
                onChange={(options) => {
                  setEditingDocket({
                    ...editingDocket,
                    finishing: options,
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
                {editingDocket?.forms?.map((form, index) => (
                  <tr key={"form_" + index}>
                    <td>
                      <input
                        type="text"
                        value={form.name || ""}
                        onBlur={() => {
                          handleBlur({ forms: editingDocket?.forms });
                        }}
                        onChange={(event) => {
                          const newForms = editingDocket?.forms.map((f, i) => {
                            if (i === index) {
                              return { ...f, name: event.target.value };
                            }
                            return f;
                          });
                          setEditingDocket({
                            ...editingDocket,
                            forms: newForms,
                          });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step={1000}
                        value={form.quantity || 0}
                        onBlur={() => {
                          handleBlur({ forms: editingDocket?.forms });
                        }}
                        onChange={(event) => {
                          const newForms = editingDocket?.forms.map((f, i) => {
                            if (i === index) {
                              return {
                                ...f,
                                quantity: event.target.value,
                              };
                            }
                            return f;
                          });
                          setEditingDocket({
                            ...editingDocket,
                            forms: newForms,
                          });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={form.notes || ""}
                        onBlur={() => {
                          handleBlur({ forms: editingDocket?.forms });
                        }}
                        onChange={(event) => {
                          setEditingDocket({
                            ...editingDocket,
                            forms: editingDocket?.forms.map((f, i) => {
                              if (i === index) {
                                return {
                                  ...f,
                                  notes: event.target.value,
                                };
                              }
                              return f;
                            }),
                          });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={
                          form.quantityShipped + " / " + form.quantity || ""
                        }
                        readOnly
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={
                          form.lastShipmentDate
                            ? new Date(form.lastShipmentDate).toLocaleDateString("en-CA")
                            : "No Shipments"
                        }
                        readOnly
                      />
                    </td>
                    <td>
                      <button
                        className="delete-form-button"
                        onClick={(event) => {
                          event.preventDefault();
                          let newForms = [...editingDocket.forms];
                          newForms.splice(index, 1);
                          setEditingDocket({
                            ...editingDocket,
                            forms: newForms,
                          });
                          saveDocket({
                            forms: newForms,
                          });
                        }}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>Total Quantity:</td>
                  <td>
                    <input
                      type="text"
                      value={
                        editingDocket?.numOfUnits?.toLocaleString("en-CA") || ""
                      }
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              className="add-form-button"
              onClick={() => {
                setEditingDocket({
                  ...editingDocket,
                  forms: [
                    ...editingDocket.forms,
                    {
                      name: "",
                      notes: "",
                      quantity: 0,
                      quantityShipped: 0,
                    },
                  ],
                });
                saveDocket({
                  forms: [
                    ...editingDocket.forms,
                    {
                      name: "",
                      notes: "",
                      quantity: 0,
                      quantityShipped: 0,
                    },
                  ],
                });
              }}
            >
              +
            </button>
          </div>
          <div className="docket-shipping-history">
            <h2 className="docket-header">Shipment History:</h2>
            <table className="docket-info-table" id="shipment-history-table">
              <thead>
                <tr>
                  <th>Shipment Date:</th>
                  <th>Forms:</th>
                  <th>Quantity:</th>
                  <th>Notes:</th>
                </tr>
              </thead>
              <tbody>
                {/* Add History */}
                {docketShipments?.map((shipment) => {
                  return <tr>
                    <td>
                      <div>
                        {new Date(shipment.labelDate).toLocaleDateString("en-CA")}
                      </div>
                    </td>
                    <td>{shipment.forms.map((shippedForm) => {
                      return <div>{shippedForm.name}</div>
                    })}</td>
                    <td>{shipment.forms.map((shippedForm) => {
                      return <div>{shippedForm.name == "other" ? "-" : shippedForm.type == "cartons" ? (shippedForm.quantity * shippedForm.cartonQuantity + shippedForm.partialCartonQuantity || 0) : (shippedForm.quantity || 0)}</div>
                    })}</td>
                    <td>{shipment.forms.map((shippedForm) => {
                      return <div>{shippedForm.notes || "-"}</div>
                    })}</td>
                  </tr>
                })}
              </tbody>
            </table>
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
                value={editingDocket?.specialInstructions || ""}
                onBlur={() => {
                  handleBlur({
                    specialInstructions: editingDocket?.specialInstructions,
                  });
                }}
                onChange={(event) => {
                  setEditingDocket({
                    ...editingDocket,
                    specialInstructions: event.target.value,
                  });
                }}
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
                {editingDocket?.extraCharges?.map((charge, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        value={charge.name || ""}
                        onBlur={() => {
                          handleBlur({
                            extraCharges: editingDocket?.extraCharges,
                          });
                        }}
                        onChange={(event) => {
                          setEditingDocket({
                            ...editingDocket,
                            extraCharges: editingDocket?.extraCharges.map(
                              (c, i) => {
                                if (i === index) {
                                  return {
                                    ...c,
                                    name: event.target.value,
                                  };
                                }
                                return c;
                              }
                            ),
                          });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0.00"
                        step="100"
                        value={charge.cost || 0}
                        onBlur={() => {
                          handleBlur({
                            extraCharges: editingDocket?.extraCharges,
                          });
                        }}
                        onChange={(event) => {
                          setEditingDocket({
                            ...editingDocket,
                            extraCharges: editingDocket?.extraCharges.map(
                              (c, i) => {
                                if (i === index) {
                                  return {
                                    ...c,
                                    cost: event.target.value,
                                  };
                                }
                                return c;
                              }
                            ),
                          });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={charge.notes || ""}
                        onBlur={() => {
                          handleBlur({
                            extraCharges: editingDocket?.extraCharges,
                          });
                        }}
                        onChange={(event) => {
                          setEditingDocket({
                            ...editingDocket,
                            extraCharges: editingDocket?.extraCharges.map(
                              (c, i) => {
                                if (i === index) {
                                  return {
                                    ...c,
                                    notes: event.target.value,
                                  };
                                }
                                return c;
                              }
                            ),
                          });
                        }}
                      />
                    </td>
                    <td>
                      <button
                        className="delete-extra-cost-button"
                        onClick={() => {
                          let newExtraCharges = [...editingDocket.extraCharges];
                          newExtraCharges.splice(index, 1);
                          setEditingDocket({
                            ...editingDocket,
                            extraCharges: newExtraCharges,
                          });
                          saveDocket({
                            extraCharges: newExtraCharges,
                          });
                        }}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>Total Cost:</td>
                  <td>
                    <input
                      type="text"
                      value={
                        editingDocket?.extraCharges
                          ?.reduce(
                            (totalCost, charge) =>
                              parseFloat(totalCost) + parseFloat(charge.cost),
                            0.0
                          )
                          .toLocaleString("en-CA", {
                            style: "currency",
                            currency: "CAD",
                            currencyDisplay: "symbol",
                          }) || ""
                      }
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              className="add-extra-cost-button"
              onClick={() => {
                setEditingDocket({
                  ...editingDocket,
                  extraCharges: [
                    ...editingDocket.extraCharges,
                    {
                      name: "",
                      cost: 0,
                      notes: "",
                    },
                  ],
                });
                saveDocket({
                  extraCharges: [
                    ...editingDocket.extraCharges,
                    {
                      name: "",
                      cost: 0,
                      notes: "",
                    },
                  ],
                });
              }}
            >
              +
            </button>
          </div>
          <div className="docket-docket-summary">
            <h2>
              {editingDocket?.customer?.name +
                " #" +
                editingDocket?.docketNumber}
            </h2>
            <h2>{editingDocket?.jobName}</h2>
            <h3>
              {`${editingDocket?.die?.standing ? "Standing" : "New"} ${editingDocket?.die?.dieType
                }${editingDocket?.die?.standing
                  ? " #" + editingDocket?.die?.dieID
                  : ""
                }, ` +
                editingDocket?.finishing?.reduce(
                  (a, b) => b.label + ", " + a,
                  ""
                )}
            </h3>
            <h3>{editingDocket?.specialInstructions}</h3>
            <button
              onClick={(event) => {
                saveDocket();
                navigator.clipboard.writeText(
                  `${editingDocket?.customer?.name} #${editingDocket?.docketNumber
                  }\n${editingDocket?.jobName}\n${editingDocket?.die.standing ? "Standing" : "New"
                  } ${editingDocket?.die.dieType}${editingDocket?.die.standing
                    ? " #" + editingDocket?.die.dieID
                    : ""
                  }, ${editingDocket?.finishing.reduce(
                    (a, b) => b.label + ", " + a,
                    ""
                  )}`
                );
              }}
            >
              Save & Copy
            </button>
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
                value={editingDocket?.requoteMemo || ""}
                onBlur={() => {
                  handleBlur({
                    requoteMemo: editingDocket?.requoteMemo,
                  });
                }}
                onChange={(event) => {
                  setEditingDocket({
                    ...editingDocket,
                    requoteMemo: event.target.value,
                  });
                }}
              />
            </div>
            <div className="closing-date">
              <label htmlFor="closing-datetime">
                Closing Date
                <input
                  type="date"
                  name="closing-datetime"
                  id="closing-datetime"
                  value={
                    editingDocket?.closeDate
                      ? editingDocket?.closeDate.split("T")[0]
                      : "" || ""
                  }
                  onBlur={() => {
                    let statusArray = docket.status;
                    if (!editingDocket?.closeDate) {
                      statusArray = docket.status.filter((status) => {
                        return status.label !== "Closed";
                      });
                      statusArray.push({ label: "Open", value: "Open" });
                    } else if (
                      docket.status.every((status) => {
                        return status.label !== "Closed";
                      })
                    ) {
                      statusArray = docket.status.filter((status) => {
                        return status.label !== "Open";
                      });
                      statusArray.push({ label: "Closed", value: "Closed" });
                    }

                    handleBlur({
                      closeDate: editingDocket?.closeDate,
                      status: statusArray,
                    });
                  }}
                  onChange={(event) => {
                    setEditingDocket({
                      ...editingDocket,
                      closeDate: event.target.value,
                    });
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PageDocketTool };
