import "./Quotes.scss";

const PageQuotes = () => {
  const customers = [
    { name: "alternative Die Cutting Inc." },
    { name: "alternative Die Cutting Inc." },
    { name: "alternative Die Cutting Inc." },
    { name: "alternative Die Cutting Inc." },
  ];

  return (
    <>
      <div className="quotespage-container">

        {/* New Quote Menu */}
        <div className="new-quote-menu-container">
          <header className="new-quote-title">
            <h1>New Quote</h1>
          </header>
          <div className="new-quote-fields-container">
            <form action="" className="new-quote-fields">
              <select className="new-quote-field" name="customer-name">
                {customers.map((customer, index) => {
                  return (
                    <option
                      className="search-field"
                      key={customer.name + index}
                      value={customer.name}
                    >
                      {customer.name}
                    </option>
                  );
                })}
              </select>
              <input
                type="text"
                placeholder="Job Name"
                name="jobName"
                required="required"
              />
              <input
                type="text"
                placeholder="Attention"
                name="attention"
                required="required"
              />
              <input type="text" placeholder="Description" name="description" />
              <input type="text" placeholder="Notes" name="notes" />
              <input type="submit" value="Create" />
            </form>
          </div>
        </div>

        {/* Quotes List */}
        <div className="quotes-list-container">
          
        </div>
      </div>
    </>
  );
};

export { PageQuotes };
