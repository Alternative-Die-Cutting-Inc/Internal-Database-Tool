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
} from "../../state/customers/customerSlice";
import { getCustomer } from "../../state/customers/saga";
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

  const [customerSelected, setCustomerSelected] = useState({
    label: quote?.customer.name,
    value: quote?.customer.customerID,
  });

  const sheet = query.get("sheet");
  const document = import(`../../components/PDF/${sheet}`);

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

  useEffect(() => {
    dispatch(getCustomer({ id: customerSelected.value }));
  }, [dispatch, customerSelected]);

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
          <div className="email-selection">
            <label htmlFor="">
              Email to customer
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
                options={
                  customer?.contacts?.reduce((emailList, contact) => {
                    if (contact.type === "email") {
                      emailList.push({
                        label: contact.label + ": " + contact.info,
                        value: contact.info,
                      });
                    }
                    return emailList;
                  }, []) || []
                }
                isMulti={false}
              />
            </label>
          </div>
          <div className="control-buttons">
            <button
              onClick={() => {
                dispatch();
              }}
            >
              Send To Customer
            </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePDF;
