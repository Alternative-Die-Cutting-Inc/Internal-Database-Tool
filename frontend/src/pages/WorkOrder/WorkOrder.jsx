import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  PDFViewer,
} from "@react-pdf/renderer";
import "./WorkOrder.scss";
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
  getCustomerNames,
  getCustomer,
  sendToCustomer,
} from "../../state/customers/saga";
import { getDocket } from "../../state/dockets/saga";
import { getQuote } from "../../state/quotes/saga";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageWorkOrder = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customerNames } = useSelector(customerNamesSelector);
  const { customer } = useSelector(customerSelector);
  const { docket } = useSelector(docketSelector);
  const { quote } = useSelector(quoteSelector);
  const { user } = useSelector(userSelector);
  const { email, error, loading } = useSelector(emailSelector);

  const [emails, setEmails] = useState([]);
  const [customerSelected, setCustomerSelected] = useState();

  const handleSend = async (event) => {
    event.preventDefault();
    const blob = await pdf(WorkOrder()).toBlob();
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

  useEffect(() => {
    if (docket && docket.quoteNumber)
      dispatch(getQuote({ id: docket.quoteNumber }));
    if (docket) {
      setCustomerSelected({
        value: docket.customer.customerID,
        label: docket.customer.name,
      });
      dispatch(getCustomer({ id: docket.customer.customerID }));
    }
  }, [dispatch, docket]);

  useEffect(() => {
    dispatch(getDocket({ id: query.get("docketNumber") }));
  }, [dispatch, query]);

  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      padding: "1cm",
      fontFamily: "Times-Roman",
    },
    internalInfo: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
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
      // border: "1px solid #000",
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
      fontSize: "14px",
    },
    header: {
      borderTop: "none",
      fontSize: "12px",
    },
    bold: {
      fontFamily: "Times-Bold",
    },
    row0: {
      width: "5%",
      height: "100%",
      textAlign: "center",
      fontSize: "14px",
      borderRight: "1px solid #000",

    },
    row1: {
      width: "45%",
      textAlign: "left",
      paddingLeft: "5px",
      fontSize: "14px",
      borderRight: "1px solid #000",

    },
    row2: {
      width: "20%",
      textAlign: "center",
      fontSize: "14px",
      borderRight: "1px solid #000",

    },
    row3: {
      width: "15%",
      textAlign: "center",
      fontSize: "14px",
      borderRight: "1px solid #000",

    },
    row4: {
      width: "20%",
      textAlign: "center",
      fontSize: "14px",

    },
    line: {
      width: "100%",
      borderBottom: "1px solid #000",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      margin: "15px 0",
    }
  });

  const WorkOrder = () => (
    <Document
      author={user?.firstName}
      title={`Alternative Die Cutting Inc. Quote for ${quote?.jobName}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.internalInfo}>
          <View style={{ flexDirection: "column", width: "100%" }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: "20px",
                  fontFamily: "Times-Bold",
                }}
              >
                {docket?.customer?.name}
              </Text>
              <Text
                style={{
                  fontSize: "20px",
                  fontFamily: "Times-Bold",
                }}
              >
                {"Docket #: " + docket?.docketNumber}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: "16px",
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
                fontSize: "36px",
                alignSelf: "center",
                fontFamily: "Times-Bold",
              }}
            >
              {docket?.jobName}
            </Text>
            <Text
              style={{
                fontSize: "16px",
                fontFamily: "Times-Bold",
              }}
            >
              {"Finishing:"}
            </Text>
            <Text
              style={{
                fontSize: "16px",
                padding: "20px 0"
              }}
            >
              {docket?.finishing?.reduce((a, b) => b.label + ", " + a, "") ||
                "N/A"}
            </Text>
            <Text
              style={{
                fontSize: "16px",
                fontFamily: "Times-Bold",
              }}
            >
              {"Special Instructions:"}
            </Text>
            <Text
              style={{
                fontSize: "16px",
                padding: "20px 0"

              }}
            >
              {docket?.specialInstructions || "N/A"}
            </Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={[styles.row, styles.bold, styles.header]}>
            <Text style={{ width: "5%" }} />
            <Text style={styles.row1}>{"Form"}</Text>
            <Text style={styles.row2}>{"Quantity"}</Text>
            <Text style={styles.row3}>{"Notes"}</Text>
            <Text style={styles.row4}>{"Quantity Run"}</Text>
          </View>
          {docket?.forms?.map((form, index) => (
            <View
              key={index}
              style={[styles.row, { fontSize: "12px" }]}
              wrap={false}
            >
              <Text style={styles.row0}>{index + 1}</Text>
              <Text style={styles.row1}>{form.name}</Text>
              <Text style={styles.row2}>
                {form.quantity.toLocaleString("en-CA")}
              </Text>
              <Text style={styles.row3}>{form.notes}</Text>
              <Text style={styles.row4}>{ }</Text>
            </View>
          ))}
        </View>
        <View style={styles.section2}>
          <View
            style={{
              width: "100%",
              borderBottom: "1px solid #000",
              display: "flex",
              padding: "0.25cm 0",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Text style={{ fontSize: "14px", }}>{"Press:"}</Text>
            <Text style={{ fontSize: "14px" }}>{"Operator:"}</Text>
            <Text style={{ fontSize: "14px" }}>{"Die:"}</Text>
            <Text style={{ fontSize: "14px", paddingRight: "3cm" }}>
              {"Due Date:"}
            </Text>
          </View>
          <View
            style={{
              width: "100%",
              borderBottom: "1px solid #000",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              margin: "15px 0",
            }}
          >
            <Text style={{ fontSize: "14px" }}>{"Notes:"}</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.line} />
        </View>
      </Page>
    </Document>
  );

  if (!user || !docket) return null;
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
          <a href={"/dockettool" + window.location.search}>docket</a>
        </h1>
      </div>
    );
  return (
    <div className="pdf-container">
      <div className="pdf-viewer-container">
        <PDFViewer
          className="pdf-viewer"
          showToolbar={true}
          height={"100%"}
          width={"100%"}
        >
          <WorkOrder />
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
                const blob = await pdf(WorkOrder).toBlob();
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

export default PageWorkOrder;
