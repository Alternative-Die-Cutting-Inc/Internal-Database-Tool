import { createQuote } from "../../state/quotes/saga";
import { PropTypes } from "prop-types";
import Select from "react-select";
import { useState } from "react";
import "./NewQuote.scss";

function NewQuote({ customerNames, dispatch, navigate }) {
  const [quoteCustomer, setQuoteCustomer] = useState();
  return (
    <div id="homepage-new-quote" className="new-quote-menu-container">
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
                name: quoteCustomer.label,
                customerID: quoteCustomer.value,
              },
              jobName: e.target.jobName.value,
              attention: e.target.attention.value,
              description: e.target.description.value,
              notes: e.target.notes.value,
              status: [{ value: "Created", label: "Created" }],
              copy: e.target.copyQuoteNumber.value
            };
            dispatch(createQuote({ quote, navigate }));
          }}
        >
          <Select
            className="new-quote-customer-select"
            unstyled
            classNamePrefix="new-quote-customer-select"
            options={customerNames || []}
            required
            onChange={(option) => {
              setQuoteCustomer(option);
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
            type="text"
            className="new-quote-field"
            placeholder="Copy From Quote Number"
            name="copyQuoteNumber"
          />
          <input type="submit" className="new-quote-submit" value="Create" />
        </form>
      </div>
    </div>
  );
}

NewQuote.propTypes = {
  customerNames: PropTypes.any,
  dispatch: PropTypes.func,
  navigate: PropTypes.func,
};

export default NewQuote;
