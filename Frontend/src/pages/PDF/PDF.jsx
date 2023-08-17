import "./PDF.scss";
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
  getCustomerNames,
  getCustomer,
  sendToCustomer,
} from "../../state/customers/saga";
import { getQuote } from "../../state/quotes/saga";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ClientSheet from "../../components/PDF/ClientSheet";
import WorkSheet from "../../components/PDF/WorkSheet";
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const PagePDF = () => {
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

  const sheet = query.get("sheet");

  const pickSheet = () => {
    switch (sheet) {
      case "ClientSheet":
        return <ClientSheet quote={quote} user={user} />;
      case "WorkSheet":
        return <WorkSheet quote={quote} user={user} />;
    }
  };

  const getBlob = async () => {
    switch (sheet) {
      case "ClientSheet":
        return await pdf(ClientSheet({ quote, user })).toBlob();

      case "WorkSheet":
        return await pdf(WorkSheet({ quote, user })).toBlob();

      default:
        return;
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const blob = await getBlob();
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
    dispatch(getCustomerNames());
  }, [dispatch, query]);

  return (
    <div className="pdf-container">
      <div className="pdf-viewer-container">
        <PDFViewer
          className="pdf-viewer"
          showToolbar={true}
          height={"100%"}
          width={"100%"}
        >
          {pickSheet()}
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
                const blob = await getBlob();
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

export default PagePDF;
