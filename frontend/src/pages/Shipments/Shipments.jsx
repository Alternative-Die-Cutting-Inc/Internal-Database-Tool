import "./Shipments.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo, Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { docketSelector } from "../../state/dockets/docketSlice";
import { customerSelector } from "../../state/customers/customerSlice";
import { getDocket } from "../../state/dockets/saga";
import { getCustomer } from "../../state/customers/saga";
import { shipmentSelector } from "../../state/shipments/shipmentsSlice";
import { updateShipment } from "../../state/shipments/saga";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageShipments = () => {
  let query = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { docket } = useSelector(docketSelector);
  const { shipment } = useSelector(shipmentSelector);
  const { customer } = useSelector(customerSelector);
  const [checkedState, setCheckedState] = useState([true, false, false]);
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((_, index) =>
      index === position ? true : false
    );

    if (position === 0)
      saveShipment({
        address: {
          ...customer?.address,
          show: {
            adc: shipment?.address.show.adc,
            customer: true,
          },
        },
      });
    else if (position === 1)
      saveShipment({
        address: {
          show: {
            adc: shipment?.address?.show?.adc,
            customer: true,
          },
        },
      });
    else if (position === 2)
      saveShipment({
        address: {
          show: {
            adc: shipment?.address?.show?.adc,
            customer: false,
          },
        },
      });
    setCheckedState(updatedCheckedState);
  };

  const saveShipment = (fields) => {
    const newShipment = { ...shipment, ...fields }
    dispatch(updateShipment({ shipment: newShipment }))
  };

  const getFromTypeInput = (form, index) => {
    switch (form.type) {
      case "cartons":
        return (
          <>
            <td>
              <label htmlFor="">
                Cartons:{" "}
                <input
                  type="number"
                  defaultValue={0}
                  onBlur={(event) => {
                    saveShipment({
                      forms: shipment.forms.map((item, i) => {
                        if (i === index) {
                          return {
                            ...item,
                            quantity: event.target.value,
                          };
                        }
                        return item;
                      }),
                    });
                  }}
                />
              </label>
            </td>
            <td>
              <label htmlFor="">
                Pcs/Carton:{" "}
                <input
                  type="number"
                  defaultValue={0}
                  onBlur={(event) => {
                    saveShipment({
                      forms: shipment.forms.map((item, i) => {
                        if (i === index) {
                          return {
                            ...item,
                            cartonQuantity: event.target.value,
                          };
                        }
                        return item;
                      }),
                    });
                  }}
                />
              </label>
            </td>
            <td>
              <label htmlFor="">
                Partial:{" "}
                <input
                  type="number"
                  defaultValue={0}
                  onBlur={(event) => {
                    saveShipment({
                      forms: shipment.forms.map((item, i) => {
                        if (i === index) {
                          return {
                            ...item,
                            partialCartonQuantity: event.target.value,
                          };
                        }
                        return item;
                      }),
                    });
                  }}
                />
              </label>
            </td>
          </>
        );
      case "sheets":
        return (
          <>
            <td>Number of sheets:</td>
            <td>
              <input
                type="number"
                defaultValue={0}
                onBlur={(event) => {
                  saveShipment({
                    forms: shipment.forms.map((item, i) => {
                      if (i === index) {
                        return {
                          ...item,
                          quantity: event.target.value,
                        };
                      }
                      return item;
                    }),
                  });
                }}
              />
            </td>
          </>
        );
      case "pieces":
        return (
          <>
            <td>Number of pieces:</td>
            <td>
              <input
                type="number"
                defaultValue={0}
                onBlur={(event) => {
                  saveShipment({
                    forms: shipment.forms.map((item, i) => {
                      if (i === index) {
                        return {
                          ...item,
                          quantity: event.target.value,
                        };
                      }
                      return item;
                    }),
                  });
                }}
              />
            </td>
          </>
        );
    }
  };

  useEffect(() => {
    dispatch(updateShipment({ shipment: null }))
  }, [])


  useEffect(() => {
    docket && dispatch(getCustomer({ id: docket.customer.customerID }))
  }, [dispatch, docket]);

  useEffect(() => {
    if (!query.get("docketNumber")) navigate("/");
    dispatch(getDocket({ id: query.get("docketNumber") }));
  }, [navigate, dispatch, query]);

  useEffect(() => {
    customer && saveShipment({
      customer: docket.customer,
      address: {
        ...customer.address,
        show: {
          adc: true,
          customer: true,
        },
      },
      forms: [],
      docketNumber: docket.docketNumber,
      labelDate: new Date(),
      _id: undefined,
    });
  }, [dispatch, customer]);

  return (
    <div className="shipment-tool-container">
      {shipment?.address && <>
        <div className="label-column" id="col1">
          <div className="label-row" id="row1">
            <div className="info-row-item label-production-info">
              <h2 className="label-info-header">Production Information:</h2>
              <table className="shipment-info-table" id="production-info-table">
                <tbody>
                  <tr>
                    <td>Docket #:</td>
                    <td>
                      <input
                        type="text"
                        name="docket-number"
                        value={docket.docketNumber}
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Quote #: </td>
                    <td>
                      <input
                        type="text"
                        name="quote-number"
                        value={docket?.quoteNumber || ""}
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Customer: </td>
                    <td>
                      <input
                        type="text"
                        name="customer"
                        value={docket.customer.name}
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="customer-po">Customer PO: </label>
                    </td>
                    <td>
                      <input
                        type="text"
                        name="customer-po"
                        value={docket?.customerPO || ""}
                        readOnly
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Job Name:</td>
                    <td>
                      <input
                        type="text"
                        name="job-name"
                        value={docket.jobName}
                        readOnly
                      />
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
              <div
                className="address-container"
                style={checkedState[2] ? { display: "none" } : null}
              >
                <label htmlFor="line1">
                  Line 1:{" "}
                  <input
                    type="text"
                    id="line1"
                    value={shipment?.address?.line1 || ""}
                    readOnly={checkedState[0]}
                    onChange={(event) => {
                      saveShipment({
                        address: {
                          ...shipment.address,
                          line1: event.target.value,
                        }
                      });
                    }
                    }
                  />
                </label>
                <label htmlFor="line2">
                  Line 2:{" "}
                  <input
                    type="text"
                    id="line2"
                    value={shipment?.address?.line2 || ""}
                    readOnly={checkedState[0]}
                    onChange={(event) => {
                      saveShipment({
                        address: {
                          ...shipment.address,
                          line2: event.target.value,
                        },
                      });
                    }}
                  />
                </label>
                <label htmlFor="city">
                  City:{" "}
                  <input
                    type="text"
                    id="city"
                    value={shipment?.address?.city || ""}
                    readOnly={checkedState[0]}
                    onChange={(event) => {
                      saveShipment({
                        address: {
                          ...shipment.address,
                          city: event.target.value,
                        },
                      });
                    }}
                  />
                </label>
                <label htmlFor="province">
                  Province:{" "}
                  <input
                    type="text"
                    id="province"
                    value={shipment?.address?.province || ""}
                    readOnly={checkedState[0]}
                    onChange={(event) => {
                      saveShipment({
                        address: {
                          ...shipment.address,
                          province: event.target.value,
                        },
                      });
                    }}
                  />
                </label>
                <label htmlFor="postalCode">
                  Postal Code:{" "}
                  <input
                    type="text"
                    id="postalCode"
                    value={shipment?.address?.postalCode || ""}
                    readOnly={checkedState[0]}
                    onChange={(event) => {
                      saveShipment({
                        address: {
                          ...shipment.address,
                          postalCode: event.target.value,
                        },
                      });
                    }}
                  />
                </label>
                <label htmlFor="notes">
                  Notes:{" "}
                  <input
                    type="text"
                    id="notes"
                    value={shipment?.address?.notes || ""}
                    readOnly={checkedState[0]}
                    onChange={(event) => {
                      saveShipment({
                        address: {
                          ...shipment.address,
                          notes: event.target.value,
                        },
                      });
                    }}
                  />
                </label>
              </div>
              <label
                className="label-info-checkbox adc-address"
                htmlFor="adc-address"
              >
                <input
                  type="checkbox"
                  name="adc-address"
                  id="adc-address"
                  onChange={(event) => {
                    saveShipment({
                      address: {
                        ...shipment.address,
                        show: {
                          ...shipment.address.show,
                          adc: !event.target.checked,
                        },
                      },
                    });
                  }}
                />{" "}
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
                  onChange={(event) => {
                    saveShipment({
                      additionalNotes: event.target.value,
                    });
                  }}
                />
              </label>

              <label style={{ margin: "0 0.5vw" }} htmlFor="additional-notes">
                Label 1:
                <textarea
                  className="notes-input"
                  name="additional-notes"
                  id="additional-notes"
                  onChange={(event) => {
                    saveShipment({
                      label1: event.target.value,
                    });
                  }}
                />
              </label>

              <label htmlFor="additional-notes">
                Label 2:
                <textarea
                  className="notes-input"
                  name="additional-notes"
                  id="additional-notes"
                  onChange={(event) => {
                    saveShipment({
                      label2: event.target.value,
                    });
                  }}
                />
              </label>
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
                    <button
                      className="delete-shipment-form-button"
                      onClick={() => {
                        saveShipment({
                          forms: [],
                        });
                      }}
                    >
                      X
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {shipment?.forms?.map((form, index) => (
                  <Fragment key={index}>
                    <tr>
                      <td>
                        <select
                          defaultValue="cartons"
                          onChange={(event) => {
                            saveShipment({
                              forms: shipment.forms.map((item, i) => {
                                if (i === index) {
                                  return {
                                    ...item,
                                    type: event.target.value,
                                  };
                                }
                                return item;
                              }),
                            });
                          }}
                        >
                          <option value="cartons">Cartons</option>
                          <option value="sheets">Sheets</option>
                          <option value="pieces">Pieces</option>
                        </select>
                      </td>
                      <td>
                        <select
                          defaultValue="other"
                          onChange={(event) => {
                            saveShipment({
                              forms: shipment.forms.map((item, i) => {
                                if (i === index) {
                                  return {
                                    ...item,
                                    name: event.target.value,
                                    docketFormID: event.target.selectedOptions[0].id,
                                  };
                                }
                                return item;
                              }),
                            });
                          }}
                        >
                          <option value="other">Other</option>
                          {docket.forms.map((form) => <option key={form._id} id={form._id} value={form.name}>{form.name}</option>)}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          name="skids"
                          defaultValue={0}
                          onBlur={(event) => {
                            saveShipment({
                              forms: shipment.forms.map((item, i) => {
                                if (i === index) {
                                  return {
                                    ...item,
                                    skids: event.target.value,
                                  };
                                }
                                return item;
                              }),
                            });
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="notes"
                          defaultValue={form.notes || ""}
                          onBlur={(event) => {
                            saveShipment({
                              forms: shipment.forms.map((item, i) => {
                                if (i === index) {
                                  return {
                                    ...item,
                                    notes: event.target.value,
                                  };
                                }
                                return item;
                              }),
                            });
                          }}
                        />
                      </td>
                      <td rowSpan={2}>
                        <button
                          className="delete-shipment-form-button"
                          onClick={() => {
                            saveShipment({
                              forms: shipment.forms.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                    <tr className="bottom-row">
                      <td></td>
                      {getFromTypeInput(form, index)}
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
            <button
              className="add-shipments-form-button"
              onClick={() => {
                saveShipment({
                  forms: [...shipment.forms, { type: 'cartons' }],
                });
              }}
            >
              +
            </button>
          </div>
        </div>
      </>}
    </div>
  );
};

export { PageShipments };
