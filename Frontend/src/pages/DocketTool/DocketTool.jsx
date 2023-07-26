import "./DocketTool.scss";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDocket, updateDocket } from "../../state/dockets/saga";
import { docketSelector } from "../../state/dockets/docketSlice";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageDocketTool = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const { docket } = useSelector(docketSelector);
  const [editingDocket, setEditingDocket] = useState(docket);
  const customerNames = [
    { value: "customer1", label: "Customer 1" },
    { value: "customer2", label: "Customer 2" },
    { value: "customer3", label: "Customer 3" },
    { value: "customer4", label: "Customer 4" },
    { value: "customer5", label: "Customer 5" },
    { value: "customer6", label: "Customer 6" },
    { value: "customer7", label: "Customer 7" },
  ];
  useEffect(() => {
    dispatch(getDocket({ id: query.get("docketNumber") }));
  }, [dispatch, query]);

  const saveDocket = (fields) => {
    if (editingDocket) {
      if (fields) dispatch(updateDocket({ id: editingDocket._id, fields }));
      else
        dispatch(
          updateDocket({ id: editingDocket._id, fields: editingDocket })
        );
    }
  };

  const handleBlur = (event, fields) => {
    event.preventDefault();
    if (event.currentTarget === event.target) {
      saveDocket(fields);
    }
  };

  const handleCheckbox = (event) => {
    if (
      event.target.checked &&
      !editingDocket.finishing
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
      editingDocket.finishing
        .map((value) => value.value)
        .includes(event.target.id)
    ) {
      setEditingDocket({
        ...editingDocket,
        finishing: editingDocket.finishing.filter(
          (f) => f.value !== event.target.id
        ),
      });
      saveDocket({
        finishing: editingDocket.finishing.filter(
          (f) => f.value !== event.target.id
        ),
      });
    }
  };

  useEffect(() => {
    setEditingDocket(docket);
  }, [docket]);

  return (
    <>
      {editingDocket && (
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
                      value={editingDocket.docketNumber}
                      readOnly
                    />
                  </td>
                  <td>Customer:</td>
                  <td>
                    <Select
                      className="docket-info-select"
                      classNamePrefix="customer-select"
                      unstyled
                      menuPosition="fixed"
                      options={customerNames ? customerNames : []}
                    />
                  </td>
                  <td>Customer PO:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={editingDocket.customerPO}
                      onBlur={(event) => {
                        handleBlur(event, {
                          customerPO: editingDocket.customerPO,
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
                  <td>Job Name:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={editingDocket.jobName}
                      onBlur={(event) => {
                        handleBlur(event, {
                          jobName: editingDocket.jobName,
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
                  <td>Quote Job:</td>
                </tr>
                <tr>
                  <td>Quote #:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={editingDocket.quoteNumber}
                      readOnly
                    />
                  </td>
                  <td>Production Person:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={editingDocket.productionPerson}
                      onBlur={(event) => {
                        handleBlur(event, {
                          productionPerson: editingDocket.productionPerson,
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
                  <td>Sold For:</td>
                  <td>
                    <input
                      type="text"
                      className="docket-info-input"
                      value={editingDocket.soldFor}
                      onBlur={(event) => {
                        handleBlur(event, {
                          soldFor: editingDocket.soldFor,
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
                  <td>Job Type:</td>
                  <td>
                    <select
                      value={editingDocket.jobType}
                      onBlur={(event) => {
                        handleBlur(event, {
                          jobType: editingDocket.jobType,
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
                  <td>
                    <select
                      value={editingDocket.quoteJob}
                      readOnly
                      // onBlur={(event) => {
                      //   handleBlur(event, {
                      //     : editingDocket.,
                      //   });
                      // }}
                      // onChange={(event) => {
                      //   setEditingDocket({
                      //     ...editingDocket,
                      //     : event.target.value,
                      //   });
                      // }}
                    >
                      <option value={editingDocket.quoteJob}>
                        {editingDocket.quoteJob}
                      </option>
                    </select>
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
                            <div
                              className="die-tab"
                              style={
                                editingDocket.die.standing
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
                                    ...editingDocket.die,
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
                                !editingDocket.die.standing
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
                                    ...editingDocket.die,
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
                              editingDocket.die.standing
                                ? editingDocket.die.dieID
                                : editingDocket.docketNumber
                            }
                            onBlur={(event) => {
                              handleBlur(event, {
                                die: editingDocket.die,
                              });
                            }}
                            onChange={(event) => {
                              setEditingDocket({
                                ...editingDocket,
                                die: {
                                  ...editingDocket.die,
                                  dieID: event.target.value,
                                },
                              });
                            }}
                            readOnly={!editingDocket.die.standing}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>Die type:</td>
                        <td>
                          <select
                            value={editingDocket.die.dieType}
                            onBlur={(event) => {
                              handleBlur(event, {
                                die: {
                                  ...editingDocket.die,
                                  dieType: editingDocket.die.dieType,
                                },
                              });
                            }}
                            onChange={(event) => {
                              setEditingDocket({
                                ...editingDocket,
                                die: {
                                  ...editingDocket.die,
                                  dieType: event.target.value,
                                },
                              });
                            }}
                            disabled={editingDocket.die.standing}
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
                  <table
                    className="docket-info-table"
                    id="finishing-option-table"
                  >
                    <tbody>
                      <tr>
                        <td>
                          <label htmlFor="diecut">
                            <input
                              type="checkbox"
                              name="Die Cut"
                              id="diecut"
                              checked={editingDocket.finishing
                                .map((value) => value.value)
                                .includes("diecut")}
                              onChange={handleCheckbox}
                            />{" "}
                            Die Cut
                          </label>
                        </td>
                        <td>
                          <label htmlFor="strip">
                            <input
                              checked={editingDocket.finishing
                                .map((value) => value.value)
                                .includes("strip")}
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
                              checked={editingDocket.finishing
                                .map((value) => value.value)
                                .includes("foldAndGlue")}
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
                              checked={editingDocket.finishing
                                .map((value) => value.value)
                                .includes("score")}
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
                              checked={editingDocket.finishing
                                .map((value) => value.value)
                                .includes("crease")}
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
                              checked={editingDocket.finishing
                                .map((value) => value.value)
                                .includes("carton")}
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
                              checked={editingDocket.finishing
                                .map((value) => value.value)
                                .includes("stripHole")}
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
                              checked={editingDocket.finishing
                                .map((value) => value.value)
                                .includes("skidFlat")}
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
                    value={editingDocket.finishing}
                    onBlur={(event) => {
                      handleBlur(event, {
                        finishing: editingDocket.finishing,
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
                    {[...editingDocket.forms].map((form, index) => (
                      <tr key={"form_" + index}>
                        <td>
                          <input
                            type="text"
                            value={form.name}
                            onBlur={(event) => {
                              handleBlur(event, { forms: editingDocket.forms });
                            }}
                            onChange={(event) => {
                              const newForms = editingDocket.forms.map(
                                (f, i) => {
                                  if (i === index) {
                                    return { ...f, name: event.target.value };
                                  }
                                  return f;
                                }
                              );
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
                            value={form.quantity}
                            onBlur={(event) => {
                              handleBlur(event, { forms: editingDocket.forms });
                            }}
                            onChange={(event) => {
                              const newForms = editingDocket.forms.map(
                                (f, i) => {
                                  if (i === index) {
                                    return {
                                      ...f,
                                      quantity: event.target.value,
                                    };
                                  }
                                  return f;
                                }
                              );
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
                            value={form.notes}
                            onBlur={(event) => {
                              handleBlur(event, { forms: editingDocket.forms });
                            }}
                            onChange={(event) => {
                              setEditingDocket({
                                ...editingDocket,
                                forms: editingDocket.forms.map((f, i) => {
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
                            value={form.quantityShipped + " / " + form.quantity}
                            readOnly
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={
                              form.lastShipment
                                ? form.lastShipment.toLocaleDateString("en-CA")
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
                          value={editingDocket.forms.reduce(
                            (totalQuantity, form) =>
                              parseInt(totalQuantity) + parseInt(form.quantity),
                            0
                          )}
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
                    value={editingDocket.specialInstructions}
                    onBlur={(event) => {
                      handleBlur(event, {
                        specialInstructions: editingDocket.specialInstructions,
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
                    {[...editingDocket.extraCharges].map((charge, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={charge.name}
                            onBlur={(event) => {
                              handleBlur(event, {
                                extraCharges: editingDocket.extraCharges,
                              });
                            }}
                            onChange={(event) => {
                              setEditingDocket({
                                ...editingDocket,
                                extraCharges: editingDocket.extraCharges.map(
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
                            min="0.01"
                            step="0.01"
                            value={charge.cost}
                            onBlur={(event) => {
                              handleBlur(event, {
                                extraCharges: editingDocket.extraCharges,
                              });
                            }}
                            onChange={(event) => {
                              setEditingDocket({
                                ...editingDocket,
                                extraCharges: editingDocket.extraCharges.map(
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
                            value={charge.notes}
                            onBlur={(event) => {
                              handleBlur(event, {
                                extraCharges: editingDocket.extraCharges,
                              });
                            }}
                            onChange={(event) => {
                              setEditingDocket({
                                ...editingDocket,
                                extraCharges: editingDocket.extraCharges.map(
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
                              let newExtraCharges = [
                                ...editingDocket.extraCharges,
                              ];
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
                            "$" +
                            editingDocket.extraCharges
                              .reduce(
                                (totalCost, charge) =>
                                  parseFloat(totalCost) +
                                  parseFloat(charge.cost),
                                0.0
                              )
                              .toFixed(2)
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
                  {editingDocket.customerName +
                    " #" +
                    editingDocket.docketNumber}
                </h2>
                <h2>{editingDocket.jobName}</h2>
                <h3>
                  {editingDocket.finishing.reduce(
                    (a, b) => b.label + ", " + a,
                    ""
                  )}
                </h3>
                <h3>{editingDocket.specialInstructions}</h3>
                <button
                  onClick={() => {
                    saveDocket(editingDocket);
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
                    value={editingDocket.requoteMemo}
                    onBlur={(event) => {
                      handleBlur(event, {
                        requoteMemo: editingDocket.requoteMemo,
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
                        editingDocket.closeDate
                          ? editingDocket.closeDate.split("T")[0]
                          : ""
                      }
                      onBlur={(event) => {
                        handleBlur(event, {
                          closeDate: editingDocket.closeDate,
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
      )}
    </>
  );
};

export { PageDocketTool };
