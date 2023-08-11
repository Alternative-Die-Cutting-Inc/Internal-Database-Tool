import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";

const WorkSheet = (quote, user, calculateTotal) => {
  if (!quote) {
    throw new Error("No ID provided to MakeReceipt.jsx");
  }
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      padding: "0.75cm",
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
      flexDirection: "row",
      justifyContent: "flex-start",
      border: "1px solid #000",
      padding: "0.25cm",
      marginBottom: "0.25cm",
      width: "100%",
    },
    info: {
      fontSize: "16px",
      marginBottom: "7px",
      fontFamily: "Times-Bold",
    },
    table: {
      width: "100%",
      border: "1px solid #000",
      marginBottom: "0.25cm",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      borderTop: "1px solid #EEE",
      paddingTop: 8,
      paddingBottom: 8,
    },
    bold: {
      fontFamily: "Times-Bold",
    },
    col1: {
      width: "15%",
      height: "100%",
      textAlign: "center",
      flexDirection: "column",
      justifyContent: "space-around",
      fontSize: "12px",
      borderRight: "1px solid #000",
    },
    col2: {
      width: "40%",
      height: "100%",
      fontSize: "12px",
      borderRight: "1px solid #000",
      display: "flex",
      justifyContent: "space-around",
      flexDirection: "column",
    },
    col3: {
      width: "30%",
      padding: "0 0.25cm",
      height: "100%",
      borderRight: "1px solid #000",
      fontSize: "12px",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      justifyContent: "space-around",
    },
    row1: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      textAlign: "center",
    },
    row2: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      textAlign: "center",
    },
    col4: {
      width: "20%",
      height: "100%",
      padding: "0 0.25cm",
      fontSize: "12px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      textAlign: "center",
    },
  });

  const tableStyles = StyleSheet.create({
    table: {
      width: "40%",
      height: "100%",
      borderRight: "1px solid #000",
      fontSize: "12px",
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
    },
    bold: {
      fontFamily: "Times-Bold",
    },
    // So Declarative and unDRY 👌
    row1: {
      width: "27%",
    },
    row2: {
      width: "15%",
    },
    row3: {
      width: "15%",
    },
    row4: {
      width: "20%",
    },
    row5: {
      width: "27%",
    },
  });

  return (
    <Document
      author={user.firstName}
      title={`Alternative Die Cutting Inc. Quote for ${quote.jobName}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.section}>
          <View style={{ paddingRight: "20px" }}>
            <Text style={styles.info}>{"#" + quote.quoteNumber}</Text>
            <Text style={styles.info}>
              {"Customer: " + quote.customer.name}
            </Text>
            <Text style={styles.info}>{"Attn: " + quote.attention}</Text>
            <Text style={styles.info}>{"By: " + user.firstName}</Text>
            <Text style={styles.info}>
              {"On: " +
                new Date().toLocaleDateString("en-CA", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
            </Text>
          </View>
          <View>
            <Text style={styles.info}>{"Job Name: " + quote.jobName}</Text>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              {"Description: " + quote.description}
            </Text>
            <Text
              style={{
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              {"Notes: " + quote.notes}
            </Text>
          </View>
        </View>

        {quote.quoteJobs.map((job, index) => {
          const { Subtotal, Premium, PerM } = calculateTotal(job);
          return (
            <View key={index} style={styles.table}>
              <View style={styles.col1}>
                <Text>{"Units: " + job.units}</Text>
                <Text>{"Per Sheet: " + job.perSheet}</Text>
                <Text>{"Sheets: " + parseInt(job.units / job.perSheet)}</Text>
              </View>

              <View style={tableStyles.table}>
                <View style={[styles.row, styles.bold, styles.header]}>
                  <Text style={styles.row1}>
                    {"Press: " + job.pressMachine}
                  </Text>
                </View>
                {/* Row 1 */}
                <View style={styles.row} wrap={false}>
                  <Text style={styles.row2}>123</Text>
                  <Text style={styles.row2}>123</Text>
                  <Text style={styles.row2}>123</Text>
                  <Text style={styles.row2}>1232</Text>
                  <Text style={styles.row2}>123</Text>
                  <Text style={styles.row2}>123</Text>
                  <Text>123</Text>
                  <Text>123</Text>
                </View>
              </View>

              {/* <View debug style={styles.col2}>
                <View style={styles.row2}>
                  <Text>{"Press: " + job.pressMachine}</Text>
                </View>
                <View style={styles.row2}>
                  <Text>{"Die: " + job.dieHours}</Text>
                  <Text>{job.dieHours * job.rates.die}</Text>
                  <Text>{"Setup: " + job.gluerSetupHours}</Text>
                  <Text>{job.gluerSetupHours * job.rates.gluer}</Text>
                </View>
                <View style={styles.row2}>
                  <Text>
                    {"Setup: " +
                      job.dieSetup +
                      " " +
                      job.dieSetup * job.rates.press}
                  </Text>
                  <Text>
                    {"Gluer: " +
                      job.gluerRunSpeed +
                      " " +
                      job.gluerRunM +
                      " " +
                      (job.gluerRunM * job.units) / 1000}
                  </Text>
                </View>
              </View> */}

              <View style={styles.col3}>
                <View style={styles.row1}>
                  <Text>{"Subtotal"}</Text>
                  <Text>{"Premium"}</Text>
                  <Text>{"Per M"}</Text>
                </View>
                <View style={styles.row1}>
                  <Text>
                    {Subtotal.toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                  <Text>
                    {Premium.toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                  <Text>
                    {PerM.toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                </View>
                <View style={[styles.row1, { justifyContent: "center" }]}>
                  <Text>
                    {"Total: " +
                      job.total.toLocaleString("en-CA", {
                        style: "currency",
                        currency: "CAD",
                      })}
                  </Text>
                </View>
              </View>
              <View style={styles.col4}>
                <Text>{"Client Notes: " + (job.clientNotes || "")}</Text>
                <Text>{"Internal Notes: " + (job.internalNotes || "")}</Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

WorkSheet.propTypes = {
  quote: PropTypes.object,
  user: PropTypes.object,
  calculateTotal: PropTypes.func,
};

export { WorkSheet };
