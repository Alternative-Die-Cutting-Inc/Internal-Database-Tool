import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Logo from "../../assets/logo/logo-large.png";
import PropTypes from "prop-types";
import "./DeliverySlip.scss";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userSelector } from "../../state/user/userSlice";
import { docketSelector } from "../../state/dockets/docketSlice";
import { quoteSelector } from "../../state/quotes/quoteSlice";
import { shipmentSelector } from "../../state/shipments/shipmentsSlice";
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

const PageDeliverySlip = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customerNames } = useSelector(customerNamesSelector);
  const { customer } = useSelector(customerSelector);
  const { shipment } = useSelector(shipmentSelector);
  const { docket } = useSelector(docketSelector);
  const { quote } = useSelector(quoteSelector);
  const { user } = useSelector(userSelector);
  const { email, error } = useSelector(emailSelector);

  const [emails, setEmails] = useState([]);
  const [customerSelected, setCustomerSelected] = useState();

  const handleSend = async (event) => {
    event.preventDefault();
    const blob = await pdf(DeliverySlip).toBlob();
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
    if (docket?.customer?.customerID) {
      setCustomerSelected({
        value: docket.customer.customerID,
        label: docket.customer.name,
      });
    }
  }, [dispatch, docket]);

  useEffect(() => {
    if (docket && docket.quoteNumber)
      dispatch(getQuote({ id: docket.quoteNumber }));
    if (docket) dispatch(getCustomer({ id: docket.customer.customerID }));
  }, [dispatch, docket]);

  useEffect(() => {
    dispatch(getCustomerNames());
    dispatch(getDocket({ id: query.get("docketNumber") }));
  }, [dispatch, query]);

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
      borderTop: "1px solid #EEE",
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
      width: "15%",
      textAlign: "center",
    },
    row2: {
      width: "15%",
      textAlign: "center",
    },
    row3: {
      width: "15%",
      textAlign: "center",
    },
    row4: {
      width: "15%",
      textAlign: "center",
    },
    row5: {
      width: "27%",
      textAlign: "center",
    },
  });

  const AltDieIncInfo = {
    name: "Alternative Die Cutting Inc.",
    address: "132 Alexdon Rd, Toronto ON",
    postalCode: "M3J2B3",
    tel: "(416) 748-6868",
    fax: "(416) 748-0737",
    website: "www.alternativedc.com",
  };
  const DeliverySlip = (
    <Document
      author={user?.firstName}
      title={`Alternative Die Cutting Inc. Quote for ${quote?.jobName}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.internalInfo}>
          <View style={{ flexDirection: "column" }}>
            <Image source={Logo} style={styles.logo} />
            <View>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "light",
                }}
              >
                {shipment?.address
                  ? AltDieIncInfo.address +
                    `\n` +
                    AltDieIncInfo.postalCode +
                    `\n`
                  : "" +
                    "Tel: " +
                    AltDieIncInfo.tel +
                    `\n` +
                    AltDieIncInfo.website +
                    `\n`}
              </Text>
            </View>
          </View>
          <View style={styles.docketInfo}>
            <Text
              style={{
                fontSize: "24px",
                fontFamily: "Times-Bold",
              }}
            >
              {"#" + docket?.docketNumber}
            </Text>
            <Text
              style={{
                fontSize: "24px",
                fontFamily: "Times-Bold",
              }}
            >
              {quote?.customer.name}
            </Text>
          </View>
        </View>
        <View debug style={styles.section1}>
          <View debug style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              {"Docket #" + quote?.jobName}
            </Text>
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              {"Company: " + docket?.customer.name}
            </Text>
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              {"Quote #" + docket?.quoteNumber}
            </Text>
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              {"Date: " + new Date().toLocaleDateString("en-CA")}
            </Text>
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              {"Contact: " + (docket?.productionPerson || "N/A")}
            </Text>
          </View>
          <View debug style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              {"Ship to:"}
            </Text>
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              {"Ship to:"}
            </Text>
          </View>
        </View>
        <View style={styles.section2}>
          <Text
            style={{
              fontSize: "16px",
              fontFamily: "Times-Bold",
              marginBottom: "15px",
            }}
          >
            {quote?.jobName}
          </Text>
          <Text
            style={{
              fontSize: "12px",
              marginBottom: "15px",
            }}
          >
            {"Customer PO: " + (docket?.customerPO || "")}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.row, styles.bold, styles.header]}>
            <Text style={{ width: "5%" }}> </Text>
            <Text style={styles.row1}>{"Units"}</Text>
            <Text style={styles.row2}>{"Units per Sheet"}</Text>
            <Text style={styles.row3}>{"Sheets"}</Text>
            <Text style={styles.row4}>{"Cost Per Thousand"}</Text>
            <Text style={styles.row5}>{"Total"}</Text>
            <Text
              style={{
                width: "25%",
                fontFamily: "Times-Bold",
                textAlign: "center",
              }}
            >
              {"Notes"}
            </Text>
          </View>
          {quote?.quoteJobs.map((job, index) => {
            const sheets = parseInt(job.units / job.perSheet);
            return (
              <View
                key={index}
                style={[styles.row, { fontSize: "12px" }]}
                wrap={false}
              >
                <Text style={{ width: "5%", textAlign: "center" }}>
                  {index + 1}
                </Text>
                <Text style={styles.row1}>{job.units}</Text>
                <Text style={styles.row2}>{job.perSheet}</Text>
                <Text style={styles.row3}>{isNaN(sheets) ? 0 : sheets}</Text>
                <Text style={styles.row4}>
                  {isNaN(sheets)
                    ? 0
                    : (job.total / sheets).toLocaleString("en-CA", {
                        style: "currency",
                        currency: "CAD",
                      })}
                </Text>
                <Text style={[styles.row5, styles.bold]}>
                  {job.total.toLocaleString("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  })}
                </Text>
                <Text
                  style={{
                    width: "25%",
                    textAlign: "center",
                  }}
                >
                  {job.clientNotes}
                </Text>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );

  if (!quote || !user || !docket || !shipment) return <></>;

  return (
    <div className="pdf-container">
      <div className="pdf-viewer-container">
        {quote && user && docket && shipment ? (
          <PDFViewer
            className="pdf-viewer"
            showToolbar={true}
            height={"100%"}
            width={"100%"}
          >
            <DeliverySlip /> // Error here
          </PDFViewer>
        ) : null}
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
                const blob = await pdf(DeliverySlip).toBlob();
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
          {error && <div className="error">{error}</div>}
          {email && <div className="success">{email}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageDeliverySlip;
