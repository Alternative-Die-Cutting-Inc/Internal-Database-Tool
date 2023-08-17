import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Logo from "../../assets/logo/Logo.png";
import PropTypes from "prop-types";

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
      height: "60px",
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
    <Document
      author={user.firstName}
      title={`Alternative Die Cutting Inc. Quote for ${quote.jobName}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.internalInfo}>
          <View style={{ flexDirection: "row" }}>
            <Image source={Logo} style={styles.logo} />
            <View>
              <Text
                style={{
                  fontSize: "16px",
                  fontFamily: "Times-Bold",
                }}
              >
                {AltDieIncInfo.name}
              </Text>
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
                  "Fax: " +
                  AltDieIncInfo.fax +
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
};

ClientSheet.propTypes = {
  quote: PropTypes.object,
  user: PropTypes.object,
};

export default ClientSheet;
