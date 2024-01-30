import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
  PDFViewer,
} from "@react-pdf/renderer";
import Logo from "../../assets/logo/logo-large.png";
import "./DeliverySlip.scss";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
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
import { getDocket, updateDocket } from "../../state/dockets/saga";
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
  const { email, error, loading } = useSelector(emailSelector);

  const [emails, setEmails] = useState([]);
  const [customerSelected, setCustomerSelected] = useState();

  const handleSend = async (event) => {
    event.preventDefault();
    const blob = await pdf(DeliverySlip()).toBlob();
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

    if (
      docket?.status?.every((status) => {
        return status.label !== "New Shipment";
      })
    ) {
      dispatch(
        updateDocket({
          id: docket._id,
          fields: {
            status: [
              ...docket.status,
              { value: "New Shipment", label: "New Shipment" },
            ],
          },
        })
      );
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
      alignItems: "flex-start",
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
    address: `132 Alexdon Rd\nToronto ON`,
    postalCode: "M3J2B3",
    tel: "(416) 748-6868",
    fax: "(416) 748-0737",
    website: "www.alternativedc.com",
  };
  const DeliverySlip = () => (
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
                {shipment?.address.show.adc
                  ? AltDieIncInfo.address +
                    `\n` +
                    AltDieIncInfo.postalCode +
                    `\n` +
                    "Tel: " +
                    AltDieIncInfo.tel +
                    `\n` +
                    AltDieIncInfo.website +
                    `\n`
                  : "Tel: " +
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
        <View style={styles.section1}>
          <View style={{ width: "100%" }}>
            <Text
              style={{
                fontSize: "12px",
              }}
            >
              {"Docket #" + docket?.docketNumber}
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
          <View style={{ width: "100%" }}>
            {shipment?.address.show.customer ? (
              <>
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
                  {`${shipment?.address.line1 || ""}\n${
                    shipment?.address.line2 || ""
                  }\n${shipment?.address.city || ""}\n${
                    shipment?.address.province || ""
                  }\n${shipment?.address.postalCode || ""}`}
                </Text>
              </>
            ) : null}
          </View>
        </View>
        <View style={styles.section2}>
          <Text
            style={{
              fontSize: "16px",
              fontFamily: "Times-Bold",
              marginBottom: "15px",
              alignSelf: "center",
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
          <Text
            style={{
              fontSize: "12px",
              marginBottom: "15px",
            }}
          >
            {"Notes: " + (shipment?.additionalNotes || "")}
          </Text>
        </View>
        <View style={styles.table}>
          <View style={[styles.row, styles.bold, styles.header]}>
            <Text style={{ width: "5%" }} />
            <Text style={styles.row1}>{"Form"}</Text>
            <Text style={styles.row2}>{"Quantity"}</Text>
            <Text style={styles.row3}>{"Number of Skids"}</Text>
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
          {shipment?.forms?.map((form, index) => {
            return (
              <View
                key={index}
                style={[styles.row, { fontSize: "12px" }]}
                wrap={false}
              >
                <Text style={{ width: "5%", textAlign: "center" }}>
                  {index + 1}
                </Text>
                <Text style={styles.row1}>{form.name}</Text>
                <Text style={styles.row2}>
                  {form.type === "cartons"
                    ? form.quantity +
                      " " +
                      form.type +
                      `\n` +
                      form.cartonQuantity +
                      " pieces per carton and partial of " +
                      form.partialCartonQuantity +
                      " pieces"
                    : form.quantity + " " + form.type}
                </Text>
                <Text style={styles.row3}>{form.skids}</Text>
                <Text style={styles.row4}>{form.name}</Text>
                <Text style={[styles.row5, styles.bold]}>
                  {form.type === "cartons"
                    ? form.quantity * form.cartonQuantity +
                      form.partialCartonQuantity
                    : form.quantity}
                </Text>
                <Text
                  style={{
                    width: "25%",
                    textAlign: "center",
                  }}
                >
                  {form.notes}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.section3}>
          <Text
            style={{
              fontSize: "14px",

              marginBottom: "15px",
            }}
          >
            {shipment?.label1}
          </Text>
          <Text
            style={{
              fontSize: "14px",

              marginBottom: "15px",
            }}
          >
            {shipment?.label2}
          </Text>
        </View>
      </Page>
    </Document>
  );

  if (!quote || !user || !docket || !shipment) return null;

  return (
    <div className="pdf-container">
      <div className="pdf-viewer-container">
        <PDFViewer
          className="pdf-viewer"
          showToolbar={true}
          height={"100%"}
          width={"100%"}
        >
          <DeliverySlip />
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
          {loading && <div className="loading">Sending Email...</div>}
          {error && <div className="error">{error}</div>}
          {email && <div className="success">{email}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageDeliverySlip;
