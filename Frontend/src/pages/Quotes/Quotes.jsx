import "./Quotes.scss";
import { TableControls } from "../../components/TableControls/TableControls";
import { QuotesTable } from "../../components/QuotesTable/QuotesTable";
import { useNavigate } from "react-router-dom";

const PageQuotes = () => {
  const navigate = useNavigate();

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

                navigate("/quotetool");
              }}
            >
              <input
                type="search"
                className="new-quote-field"
                placeholder="Customer"
                name="customer"
                required="required"
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
                required="required"
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
