import "./Home.scss";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";

const PageHome = () => {
  const customers = [
    { name: "alternative Die Cutting Inc." },
    { name: "alternative Die Cutting Inc." },
    { name: "alternative Die Cutting Inc." },
    { name: "alternative Die Cutting Inc." },
  ];
  return (
    <>
      <div className="homepage-container">
        <div className="search-menu">
          <div className="job-search-container">
            <div className="search-header">
              <div className="search-title">
                <h2>Jobs</h2>
              </div>
              <div className="expansion-icon">
                <AiOutlineMinus />
              </div>
            </div>
            <div className="search-fields-container">
              <form className="job-search-form">
                <input
                  className="search-field"
                  type="search"
                  name="docker-number"
                  placeholder="Docket Number:"
                />
                <select className="search-field" name="customer-name">
                  {customers.map((customer, index) => {
                    return (
                      <option key={customer.name + index} value={customer.name}>
                        {customer.name}
                      </option>
                    );
                  })}
                </select>
                <input
                  className="search-field"
                  type="search"
                  name="docker-number"
                  placeholder="Number of Units:"
                />
              </form>
            </div>
          </div>
          <div className="quote-search-container">
            <div className="search-header">
              <div className="search-title">
                <h2>Quotes</h2>
              </div>
              <div className="expansion-icon">
                <AiOutlinePlus />
              </div>
            </div>
          </div>
          <div className="die-search-container">
            <div className="search-fields-container">
              <form className="job-search-form"></form>
            </div>
          </div>
        </div>
        <div className="items-list-container">
          <div className="item-tabs">
            <div className="jobs-tab">
              <h2>Jobs</h2>
            </div>
            <div className="quotes-tab">
              <h2>quotes</h2>
            </div>
          </div>
          <div className="item-filters-sorter">
            <div className="item-filters">
              <div className="item-filter"></div>
              <div className="item-filter"></div>
              <div className="item-filter"></div>
            </div>
            <div className="item-sorter"></div>
          </div>
          <div className="items-list"></div>
        </div>
      </div>
    </>
  );
};

export { PageHome };
