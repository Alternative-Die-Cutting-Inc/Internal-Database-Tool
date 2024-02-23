import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  PDFViewer,
} from "@react-pdf/renderer";
import "./BillingReport.scss";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userSelector } from "../../state/user/userSlice";
import { docketSelector } from "../../state/dockets/docketSlice";
import { quoteSelector } from "../../state/quotes/quoteSlice";
import {
  customerNamesSelector,
  customerSelector,
  emailSelector,
} from "../../state/customers/customerSlice";
import {
  getCustomer,
  sendToCustomer,
} from "../../state/customers/saga";
import { getQuote } from "../../state/quotes/saga";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { shipmentsSelector } from "../../state/shipments/shipmentsSlice";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageBillingReport = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customerNames } = useSelector(customerNamesSelector);
  const { customer } = useSelector(customerSelector);
  const { docket } = useSelector(docketSelector);
  const { docketShipments } = useSelector(shipmentsSelector)
  const { quote } = useSelector(quoteSelector);
  const { user } = useSelector(userSelector);
  const { email, error, loading } = useSelector(emailSelector);

  const [emails, setEmails] = useState([]);
  const [customerSelected, setCustomerSelected] = useState();

  const handleSend = async (event) => {
    event.preventDefault();
    const blob = await pdf(BillingReport()).toBlob();
    let formData = new FormData();
    formData.append(
      "emails",
      emails.map((email) => email.value)
    );
    formData.append("pdfFile", blob);
    formData.append("subject", event.target.subject.value);
    formData.append("body", event.target.body.value);
    dispatch(sendToCustomer({ formData }));
  };

  // useEffect(() => {
  //   dispatch(getDocket({ id: query.get("docketNumber") }));
  // }, [dispatch, query]);

  useEffect(() => {
    if (docket && docket.quoteNumber)
      dispatch(getQuote({ id: docket.quoteNumber }));
    setCustomerSelected({
      value: docket.customer.customerID,
      label: docket.customer.name,
    });
    dispatch(getCustomer({ id: docket.customer.customerID }));
  }, [dispatch, docket]);

  useEffect(() => {
    if (customerSelected) {
      dispatch(getCustomer({ id: customerSelected.value }));
    }
  }, [customerSelected]);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      padding: "1cm",
      fontFamily: "Times-Roman",
    },
    internalInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: "0.25cm",
      width: "100%",
    },
    docketInfo: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    section1: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      border: "1px solid #000",
      padding: "0.25cm",
      marginBottom: "0.25cm",
      width: "100%",
    },
    section2: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      border: "1px solid #000",
      padding: "0.25cm",
      marginBottom: "0.25cm",
      width: "100%",
    },
    section3: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid #000",
      padding: "0.25cm",
      marginBottom: "0.25cm",
      width: "100%",
    },
    logo: {
      height: "45px",
    },
    table: {
      width: "100%",
      border: "1px solid #000",
      marginBottom: "0.25cm",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      borderTop: "1px solid #000",
      paddingTop: 8,
      paddingBottom: 8,
    },
    header: {
      borderTop: "none",
      fontSize: "12px",
    },
    bold: {
      fontFamily: "Times-Bold",
    },
    row1: {
      width: "30%",
      textAlign: "center",
    },
    row2: {
      width: "30%",
      textAlign: "center",
    },
    row3: {
      width: "30%",
      textAlign: "center",
    },
  });

  const BillingReport = () => (
    <Document
      author={user?.firstName}
      title={`Alternative Die Cutting Inc. Quote for ${quote?.jobName}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.internalInfo}>
          <View style={{ flexDirection: "column" }}>
            <View>
              <Text
                style={{
                  fontSize: "16px",
                  fontFamily: "Times-Bold",
                }}
              >
                {"Billing"}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: "14px",
                  fontFamily: "Times-Bold",
                }}
              >
                {docket?.customer?.name}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "light",
                }}
              >
                {"Production Person: " +
                  (docket.productionPerson || "N/A") +
                  `\n` +
                  "Customer PO#: " +
                  docket?.customerPO +
                  `\n` +
                  "Quote#: " +
                  docket?.quoteNumber}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.section1}>
          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: "18px",
                alignSelf: "center",
                fontFamily: "Times-Bold",
              }}
            >
              {docket?.jobName}
            </Text>
            <Text
              style={{
                fontSize: "14px",
              }}
            >
              {"Docket #: " + docket?.docketNumber}
            </Text>
            <Text
              style={{
                fontSize: "14px",
              }}
            >
              {"Company: " + docket?.customer.name}
            </Text>
            <Text
              style={{
                fontSize: "14px",
              }}
            >
              {"Quote #: " + docket?.quoteNumber}
            </Text>
            <Text
              style={{
                fontSize: "14px",
              }}
            >
              {"Date: " + new Date().toLocaleDateString("en-CA")}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: "16px",
            alignSelf: "flex-start",
            fontFamily: "Times-Bold",
            padding: "0.25cm 0",
          }}
        >
          {"Total Charges"}
        </Text>
        <View style={styles.section2}>
          <View
            style={{
              width: "70%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                marginBottom: "15px",
              }}
            >
              {"Price Before Extras"}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                marginBottom: "15px",
              }}
            >
              {quote.quoteJobs
                .reduce((total, job) => {
                  if (job._id == docket.quoteJob.id) {
                    return job.total;
                  }
                  return total;
                }, 0)
                .toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                })}
            </Text>
          </View>
          <View
            style={{
              width: "70%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                marginBottom: "15px",
              }}
            >
              {"Total Extra Charges"}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                marginBottom: "15px",
              }}
            >
              {docket?.extraCharges
                ?.reduce(
                  (totalCost, charge) =>
                    parseFloat(totalCost) + parseFloat(charge.cost),
                  0.0
                )
                .toLocaleString("en-CA", {
                  style: "currency",
                  currency: "CAD",
                })}
            </Text>
          </View>
          <View
            style={{
              width: "70%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                marginBottom: "15px",
                fontFamily: "Times-Bold",
              }}
            >
              {"Total with Extras"}
            </Text>
            <Text
              style={{
                fontSize: "12px",
                marginBottom: "15px",
                fontFamily: "Times-Bold",
              }}
            >
              {(
                docket?.extraCharges?.reduce(
                  (totalCost, charge) =>
                    parseFloat(totalCost) + parseFloat(charge.cost),
                  0.0
                ) +
                quote.quoteJobs.reduce((total, job) => {
                  if (job._id == docket.quoteJob.id) {
                    return job.total;
                  }
                  return total;
                }, 0)
              ).toLocaleString("en-CA", {
                style: "currency",
                currency: "CAD",
              })}
            </Text>
          </View>
        </View>
        {docket?.extraCharges.length > 0 ?
          <>
            <Text
              style={{
                fontSize: "16px",
                alignSelf: "flex-start",
                fontFamily: "Times-Bold",
                padding: "0.25cm 0",
              }}
            >
              {"Extra Charges"}
            </Text>
            <View style={styles.table}>
              <View style={[styles.row, styles.bold, styles.header]}>
                <Text style={{ width: "10%" }} />
                <Text style={styles.row1}>{"Charge"}</Text>
                <Text style={styles.row2}>{"Cost"}</Text>
                <Text style={styles.row3}>{"Notes"}</Text>
              </View>
              {docket?.extraCharges?.map((charge, index) => (
                <View
                  key={index}
                  style={[styles.row, { fontSize: "12px" }]}
                  wrap={false}
                >
                  <Text style={{ width: "10%", textAlign: "center" }}>
                    {index + 1}
                  </Text>
                  <Text style={styles.row1}>{charge.name}</Text>
                  <Text style={styles.row2}>
                    {charge.cost.toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                  <Text style={styles.row3}>{charge.notes}</Text>
                </View>
              ))}
            </View>
          </> : null
        }
        <Text
          style={{
            fontSize: "16px",
            alignSelf: "flex-start",
            fontFamily: "Times-Bold",
            padding: "0.25cm 0",
          }}
        >
          {"Shipments"}
        </Text>
        <View style={styles.table}>
          <View style={[styles.row, styles.bold, styles.header]}>
            <Text style={{ width: "10%" }} />
            <Text style={styles.row1}>{"Shipment Date"}</Text>
            <Text style={styles.row2}>{"Forms"}</Text>
            <Text style={styles.row3}>{"Quantity"}</Text>
            <Text style={styles.row3}>{"Notes"}</Text>
          </View>
          {docketShipments?.map((shipment, index) => (
            <View
              key={index}
              style={[styles.row, { fontSize: "12px" }]}
              wrap={false}
            >
              <Text style={{ width: "10%", textAlign: "center" }}>
                {index + 1}
              </Text>
              <Text style={styles.row1}>{new Date(shipment.labelDate).toLocaleDateString("en-CA")}</Text>
              <Text style={styles.row2}>{shipment.forms.map((shippedForm) => {
                return <Text>{shippedForm.name + "\n"}</Text>
              })}</Text>
              <Text style={styles.row3}>{shipment.forms.map((shippedForm) => {
                return <Text>{(shippedForm.name == "other" ? "-" : shippedForm.type == "cartons" ? (shippedForm.quantity * shippedForm.cartonQuantity + shippedForm.partialCartonQuantity || 0) : (shippedForm.quantity || 0)) + "\n"}</Text>
              })}</Text>
              <Text style={styles.row3}>{shipment.forms.map((shippedForm) => {
                return <Text>{(shippedForm.notes || "-") + "\n"}</Text>
              })}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  if (!quote || !docket.quoteJob)
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          padding: "3vh 5vw",
        }}
      >
        <h1
          style={{
            backgroundColor: "var(--light-grey)",
            padding: "1vh 2vw",
            borderRadius: "15px",
          }}
        >
          Quote Not Found. Please add a valid quote number and quote job to the{" "}
          <a
            onClick={() => {
              navigate("/dockettool" + window.location.search);
            }}
          >
            docket
          </a>
        </h1>
      </div>
    );

  if (!user || !docket) return null;

  return (
    <div className="pdf-container">
      <div className="pdf-viewer-container">
        <PDFViewer
          className="pdf-viewer"
          showToolbar={true}
          height={"100%"}
          width={"100%"}
        >
          <BillingReport />
        </PDFViewer>
      </div>
      <div className="pdf-controls-container">
        <div className="email-controls">
          <form className="control-buttons" onSubmit={handleSend}>
            <div className="email-selection">
              <label htmlFor="">
                Email to
                <Select
                  className="customer-contact-select"
                  classNamePrefix="customer-contact-select"
                  unstyled
                  menuPosition="fixed"
                  options={customerNames || []}
                  value={customerSelected}
                  onChange={(e) => setCustomerSelected(e)}
                />
              </label>
              <label htmlFor="">
                At
                <CreatableSelect
                  className="customer-contact-select"
                  classNamePrefix="customer-contact-select"
                  unstyled
                  menuPosition="fixed"
                  value={emails}
                  options={customer?.contacts?.reduce((list, contact) => {
                    if (contact.type === "email") {
                      list.push({
                        label: contact.label + ": " + contact.info,
                        value: contact.info,
                      });
                    }
                    return list;
                  }, [])}
                  required
                  onChange={setEmails}
                  isMulti={true}
                />
              </label>
            </div>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Subject..."
              required
            />
            <textarea
              id="body"
              name="body"
              type="text"
              placeholder="Email..."
              required
            />
            <input type="submit" value="Send Email" />
            <button
              onClick={async () => {
                const blob = await pdf(BillingReport).toBlob();
                const fileURL = URL.createObjectURL(blob);
                const pdfWindow = window.open(fileURL, "_blank");
                pdfWindow && pdfWindow.focus();
              }}
            >
              Open PDF
            </button>
            <button
              onClick={() => {
                navigate("/dockettool?docketNumber=" + docket.docketNumber);
              }}
            >
              Go Back To Docket
            </button>
          </form>
          {loading && <div className="loading">Sending Email...</div>}
          {error && <div className="error">{error}</div>}
          {email && <div className="success">{email}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageBillingReport;
