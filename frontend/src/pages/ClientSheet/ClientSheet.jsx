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
import "./ClientSheet.scss";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userSelector } from "../../state/user/userSlice";
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

const ClientSheet = ({ quote, user }) => {
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
    quoteInfo: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-end",
    },
    section: {
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

  return (
    <>
      {quote && user && (
        <Document
          author={user.firstName}
          title={`Alternative Die Cutting Inc. Quote for ${quote.jobName}`}
        >
          <Page size="LETTER" style={styles.page}>
            <View style={styles.internalInfo}>
              <View style={{ flexDirection: "column" }}>
                <Image source={Logo} style={styles.logo} />
                <View>
                  <Text
                    style={{
                      fontSize: "12px",
                      fontWeight: "light",
                    }}
                  >
                    {AltDieIncInfo.address +
                      `\n` +
                      AltDieIncInfo.postalCode +
                      `\n` +
                      "Tel: " +
                      AltDieIncInfo.tel +
                      `\n` +
                      AltDieIncInfo.website +
                      `\n`}
                  </Text>
                </View>
              </View>
              <View style={styles.quoteInfo}>
                <Text
                  style={{
                    fontSize: "20px",
                    fontFamily: "Times-Bold",
                  }}
                >
                  {"#" + quote.quoteNumber}
                </Text>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "extrabold",
                  }}
                >
                  {quote.customer.name}
                </Text>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "extrabold",
                  }}
                >
                  {"Attention: " + quote.attention}
                </Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text
                style={{
                  fontSize: "12px",
                  marginBottom: "15px",
                }}
              >
                {"Quote for "}
                <Text
                  style={{
                    fontSize: "12px",
                    fontFamily: "Times-Bold",
                  }}
                >
                  {quote.customer.name}
                </Text>
                {" By " +
                  user.firstName +
                  " on " +
                  new Date().toLocaleDateString("en-CA", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
              </Text>
              <Text
                style={{
                  fontSize: "16px",
                  fontFamily: "Times-Bold",
                  marginBottom: "15px",
                }}
              >
                {quote.jobName}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  marginBottom: "10px",
                }}
              >
                {quote.description}
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  marginBottom: "10px",
                }}
              >
                {quote.notes}
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
              {quote.quoteJobs.map((job, index) => {
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
                    <Text style={styles.row3}>
                      {isNaN(sheets) ? 0 : sheets}
                    </Text>
                    <Text style={styles.row4}>
                      {isNaN(sheets)
                        ? 0
                        : (job.total / job.units).toLocaleString("en-CA", {
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
      )}
    </>
  );
};

ClientSheet.propTypes = {
  quote: PropTypes.object,
  user: PropTypes.object,
};

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PageClientSheet = () => {
  let query = useQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customerNames } = useSelector(customerNamesSelector);
  const { customer } = useSelector(customerSelector);
  const { quote } = useSelector(quoteSelector);
  const { user } = useSelector(userSelector);
  const { email, error } = useSelector(emailSelector);

  const [emails, setEmails] = useState([]);
  const [customerSelected, setCustomerSelected] = useState();

  const handleSend = async (event) => {
    event.preventDefault();
    const blob = await pdf(ClientSheet({ quote, user })).toBlob();
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
    if (quote?.customer?.customerID) {
      setCustomerSelected({
        value: quote.customer.customerID,
        label: quote.customer.name,
      });
      dispatch(getCustomer({ id: quote.customer.customerID }));
    }
  }, [dispatch, quote]);

  useEffect(() => {
    dispatch(getQuote({ id: query.get("quoteNumber") }));
  }, [dispatch, query]);

  return (
    <div className="pdf-container">
      <div className="pdf-viewer-container">
        {quote ? (
          <PDFViewer
            className="pdf-viewer"
            showToolbar={true}
            height={"100%"}
            width={"100%"}
          >
            <ClientSheet quote={quote} user={user} />
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
                const blob = await pdf(ClientSheet({ quote, user })).toBlob();
                const fileURL = URL.createObjectURL(blob);
                const pdfWindow = window.open(fileURL, "_blank");
                pdfWindow && pdfWindow.focus();
              }}
            >
              Open PDF
            </button>
            <button
              onClick={() => {
                navigate("/quotetool?quoteNumber=" + quote.quoteNumber);
              }}
            >
              Go Back To Quote
            </button>
          </form>
          {error && <div className="error">{error}</div>}
          {email && <div className="success">{email}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageClientSheet;
