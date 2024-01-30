import { createDocket } from "../../state/dockets/saga";
import { PropTypes } from "prop-types";
import Select from "react-select";
import { useState } from "react";
import "./NewDocket.scss";

function NewDocket({ customerNames, dispatch, navigate }) {
  const [jobCustomer, setJobCustomer] = useState();

  return (
    <div id="homepage-new-docket" className="new-docket-menu-container">
      <header className="new-docket-title">
        <h1>New Docket</h1>
      </header>
      <div className="new-docket-fields-container">
        <form
          action=""
          className="new-docket-fields"
          onSubmit={(e) => {
            e.preventDefault();
            const docket = {
              customer: {
                name: jobCustomer.label,
                customerID: jobCustomer.value,
              },
              creationDate: new Date(),
              jobName: e.target.jobName.value,
              customerPO: e.target.customerPO.value,
              quoteNumber: e.target.quoteNumber.value,
              status: [{ value: "Open", label: "Open" }],
            };
            dispatch(createDocket({ docket, navigate }));
          }}
        >
          <Select
            required
            className="new-docket-customer-select"
            unstyled
            classNamePrefix="new-docket-customer-select"
            onChange={(option) => {
              setJobCustomer(option);
            }}
            name="customer"
            options={customerNames || []}
          />
          <input
            type="text"
            className="new-docket-field"
            placeholder="Job Name"
            name="jobName"
            required="required"
          />
          <input
            type="text"
            className="new-docket-field"
            placeholder="Customer PO#"
            name="customerPO"
          />
          <input
            type="text"
            className="new-docket-field"
            placeholder="Quote Number"
            name="quoteNumber"
          />
          <input type="submit" className="new-docket-submit" value="Create" />
        </form>
      </div>
    </div>
  );
}

NewDocket.propTypes = {
  customerNames: PropTypes.any,
  dispatch: PropTypes.func,
  navigate: PropTypes.func,
};

export default NewDocket;
