import "./Dockets.scss";
import { TableControls } from "../../components/TableControls/TableControls";
import { JobsTable } from "../../components/JobsTable/JobsTable";
import { useNavigate } from "react-router-dom";

const PageDockets = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="docketspage-container">
        {/* New Docket Menu */}
        <div className="new-docket-menu-container">
          <header className="new-docket-title">
            <h1>New Docket</h1>
          </header>
          <div className="new-docket-fields-container">
            <form
              action=""
              className="new-docket-fields"
              onSubmit={(e) => {
                e.preventDefault();
                navigate("/dockettool");
              }}
            >
              <input
                type="search"
                className="new-docket-field"
                placeholder="Customer"
                name="customer"
                required="required"
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
                required="required"
              />
              <input
                type="text"
                className="new-docket-field"
                placeholder="Quote Number"
                name="quoteNumber"
              />
              <input
                type="submit"
                className="new-docket-submit"
                value="Create"
              />
            </form>
          </div>
        </div>

        {/* dockets List */}
        <div className="dockets-list-container">
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
            Table={JobsTable}
          />
        </div>
      </div>
    </>
  );
};

export { PageDockets };
