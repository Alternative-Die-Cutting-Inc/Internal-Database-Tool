import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import PropTypes from "prop-types";

const WorkSheet = ({ quote, user }) => {
  const calculateTotal = (job) => {
    let Subtotal = 0,
      Premium = 0,
      PerM = 0,
      Total = 0;
    const jobRates = job.rates;

    Subtotal += job.dieHours * jobRates.die;
    Subtotal += job.dieSetup * jobRates.press;
    Subtotal += (job.dieRunM * (job.units / job.perSheet)) / 1000;
    Subtotal += job.gluerSetupHours * jobRates.gluer;
    Subtotal += (job.gluerRunM * job.units) / 1000;
    Subtotal += (job.stripRunM * job.units) / 1000;

    Subtotal += job.extraCharges.reduce((acc, charge) => {
      acc += parseFloat(charge.cost);
      return parseFloat(acc);
    }, 0.0);

    Premium = Subtotal * parseFloat(jobRates.global + jobRates.customer - 2);

    PerM = (Subtotal + parseFloat(Premium)) / parseFloat(job.units / 1000);

    Total = Subtotal + parseFloat(Premium);

    if (isNaN(Total)) Total = 0;
    if (isNaN(Subtotal)) Subtotal = 0;
    if (isNaN(Premium)) Premium = 0;
    if (isNaN(PerM)) PerM = 0;
    return { Subtotal, Premium, PerM, Total };
  };
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      padding: "0.50cm",
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
      width: "10%",
      height: "100%",
      padding: "0 0 0 0.1cm",
      textAlign: "center",
      flexDirection: "column",
      justifyContent: "flex-start",
      fontSize: "12px",
      borderRight: "1px solid #000",
    },
    col3: {
      width: "15%",
      height: "100%",
      borderRight: "1px solid #000",
      fontSize: "12px",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
      justifyContent: "flex-start",
    },
    row1: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      textAlign: "center",
    },
    cols3a: { width: "37%" },
    cols3b: { width: "31%" },
    cols3c: { width: "31%" },
    row2: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      textAlign: "center",
    },
    col4: {
      width: "15%",
      height: "100%",
      padding: "0 0 0 0.1cm",
      fontSize: "12px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flext-start",
      textAlign: "left",
    },
  });

  const tableStyles = StyleSheet.create({
    table: {
      width: "60%",
      height: "100%",
      borderRight: "1px solid #000",
      fontSize: "12px",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      borderTop: "1px solid #EEE",
      justifyContent: "space-evenly",
      paddingTop: 5,
      paddingBottom: 5,
    },
    header: {
      borderTop: "none",
    },
    bold: {
      fontFamily: "Times-Bold",
    },
    // So Declarative and unDRY 👌
    row1: {
      width: "15%",
    },
    row2: {
      width: "12%",
    },
    row3: {
      width: "10%",
    },
    row4: {
      width: "5%",
    },
    row5: {
      width: "27%",
    },
    colSmall: {
      width: "9.5%",
    },
    colMedium: {
      width: "9.5%",
    },
    colLarge: {
      width: "17.5%",
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
            <View key={index} style={styles.table} wrap={false}>
              <View style={styles.col1}>
                <Text>{"Units:"}</Text>
                <Text>{job.units.toLocaleString("en-CA")}</Text>
                <Text>{"Per Sheet:"}</Text>
                <Text>{job.perSheet.toLocaleString("en-CA")}</Text>
                <Text>{"Sheets:"}</Text>
                <Text>
                  {parseInt(job.units / job.perSheet).toLocaleString("en-CA")}
                </Text>
              </View>

              {/* Quantities */}
              <View style={tableStyles.table}>
                <View style={styles.row}>
                  <Text style={styles.row1}>
                    {"Press: " + job.pressMachine}
                  </Text>
                </View>
                {/* Row 1 */}
                <View style={tableStyles.row}>
                  <Text style={tableStyles.colMedium}>Die:</Text>
                  <Text style={tableStyles.colMedium}>{job.dieHours}</Text>
                  <Text style={tableStyles.colSmall}></Text>
                  <Text style={tableStyles.colLarge}>
                    {(job.dieHours * job.rates.die).toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                  <Text style={tableStyles.colMedium}>Setup:</Text>
                  <Text style={tableStyles.colMedium}>{job.dieHours}</Text>
                  <Text style={tableStyles.colSmall}></Text>
                  <Text style={tableStyles.colLarge}>
                    {(job.dieHours * job.rates.die).toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                </View>
                {/* Row 2 */}
                <View style={tableStyles.row}>
                  <Text style={tableStyles.colMedium}>Setup:</Text>
                  <Text style={tableStyles.colMedium}>{job.dieSetup}</Text>
                  <Text style={tableStyles.colSmall}></Text>
                  <Text style={tableStyles.colLarge}>
                    {(job.dieSetup * job.rates.press).toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                  <Text style={tableStyles.colMedium}>Gluer:</Text>
                  <Text style={tableStyles.colMedium}>{job.dieRunSpeed}</Text>
                  <Text style={tableStyles.colSmall}>{job.dieRunM}</Text>
                  <Text style={tableStyles.colLarge}>
                    {(
                      (job.dieRunM * (job.units / job.perSheet)) /
                      1000
                    ).toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                </View>
                {/* Row 3 */}
                <View style={tableStyles.row}>
                  <Text style={tableStyles.colMedium}>Run:</Text>
                  <Text style={tableStyles.colMedium}>{job.dieRunSpeed}</Text>
                  <Text style={tableStyles.colSmall}>{job.dieRunM}</Text>
                  <Text style={tableStyles.colLarge}>
                    {(
                      (job.dieRunM * (job.units / job.perSheet)) /
                      1000
                    ).toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                  <Text style={tableStyles.colMedium}>Strip:</Text>
                  <Text style={tableStyles.colMedium}>{job.dieRunSpeed}</Text>
                  <Text style={tableStyles.colSmall}>{job.dieRunM}</Text>
                  <Text style={tableStyles.colLarge}>
                    {(
                      (job.dieRunM * (job.units / job.perSheet)) /
                      1000
                    ).toLocaleString("en-CA", {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </Text>
                </View>

                {/* Extras */}
                {job.extraCharges.map((extra, index) => {
                  return (
                    <View key={index} style={tableStyles.row}>
                      <Text style={{ width: "20%" }}>{"Extra Charge:"}</Text>
                      <Text style={{ width: "30%" }}>{extra.name}</Text>
                      <Text style={tableStyles.colMedium}>{extra.perM}</Text>
                      <Text style={tableStyles.colLarge}>
                        {extra.cost.toLocaleString("en-CA", {
                          style: "currency",
                          currency: "CAD",
                        })}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Totals */}
              <View style={styles.col3}>
                <Text>{"Subtotal"}</Text>
                <Text>
                  {Subtotal.toLocaleString("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  })}
                </Text>
                <Text>{"Premium"}</Text>
                <Text>
                  {Premium.toLocaleString("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  })}
                </Text>
                <Text>{"Per M"}</Text>
                <Text>
                  {PerM.toLocaleString("en-CA", {
                    style: "currency",
                    currency: "CAD",
                  })}
                </Text>

                <View style={styles.row1}>
                  <Text>
                    {"Total: " +
                      job.total.toLocaleString("en-CA", {
                        style: "currency",
                        currency: "CAD",
                      })}
                  </Text>
                </View>
              </View>

              {/* Notes */}
              <View style={styles.col4}>
                <Text>{"Client Notes:"}</Text>
                <Text>{job.clientNotes || ""}</Text>
                <Text>{"Internal Notes:"}</Text>
                <Text>{job.internalNotes || ""}</Text>
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
};

export default WorkSheet;
