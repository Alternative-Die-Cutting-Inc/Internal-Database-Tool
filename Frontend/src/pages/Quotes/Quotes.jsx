import "./Quotes.scss";
import { TableControls } from "../../components/TableControls/TableControls";
import { QuotesTable } from "../../components/QuotesTable/QuotesTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createQuote } from "../../state/quotes/saga";
import { customerNamesSelector } from "../../state/customers/customerSlice";
import Select from "react-select";
import { useEffect, useState } from "react";
import { getCustomerNames } from "../../state/customers/saga";

const PageQuotes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomerNames());
  }, [dispatch]);

  const [customer, setCustomer] = useState();
  const { customerNames } = useSelector(customerNamesSelector);

  return (
    <>
      <div className="quotespage-container">
        {/* New Quote Menu */}
        <div className="new-quote-menu-container">
          <header className="new-quote-title">
            <h1>New Quote</h1>
          </header>
          <div className="new-quote-fields-container">
            <form
              action=""
              className="new-quote-fields"
              onSubmit={(e) => {
                e.preventDefault();
                const quote = {
                  customer: {
                    name: customer.label,
                    customerID: customer.value,
                  },
                  jobName: e.target.jobName.value,
                  attention: e.target.attention.value,
                  description: e.target.description.value,
                  notes: e.target.notes.value,
                  status: [{ value: "Created", label: "Created" }],
                };
                dispatch(createQuote({ quote, navigate }));
              }}
            >
              <Select
                options={customerNames || []}
                onChange={(option) => {
                  setCustomer(option);
                }}
              />
              <input
                type="text"
                className="new-quote-field"
                placeholder="Job Name"
                name="jobName"
                required="required"
              />
              <input
                type="text"
                className="new-quote-field"
                placeholder="Attention"
                name="attention"
              />
              <input
                type="text"
                className="new-quote-field"
                placeholder="Description"
                name="description"
              />
              <input
                type="text"
                className="new-quote-field"
                placeholder="Notes"
                name="notes"
              />
              <input
                type="submit"
                className="new-quote-submit"
                value="Create"
              />
            </form>
          </div>
        </div>

        {/* Quotes List */}
        <div className="quotes-list-container">
          <TableControls
            filterCustomers={true}
            filterStatus={true}
            filterDate={true}
            statusArray={[
              { name: "Done" },
              { name: "Shipped" },
              { name: "On The Floor" },
              { name: "Stopped" },
            ]}
            sortDate={true}
            Table={QuotesTable}
          />
        </div>
      </div>
    </>
  );
};

export { PageQuotes };
