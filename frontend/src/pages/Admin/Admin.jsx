import { useDispatch, useSelector } from "react-redux";
import "./Admin.scss";
import { Fragment, useEffect, useState } from "react";
import { usersSelector } from "../../state/user/userSlice";
import { getUsers } from "../../state/user/saga";
import { customersSelector } from "../../state/customers/customerSlice";
import { getCustomers } from "../../state/customers/saga";

export const PageAdmin = () => {
  const tabs = [
    { name: "Users", component: <UserTab /> },
    { name: "Customers", component: <CustomerTab /> },
    { name: "Rates", component: <RatesTab /> },
  ];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="admin-page-container">
      <div className="admin-tabs">
        {tabs.map((tab, index) => (
          <h2
            key={index}
            className={index == activeTab ? "selected" : ""}
            style={
              index == 0
                ? { borderRadius: "15px 0px 0px 0px" }
                : index == tabs.length - 1
                ? { borderRadius: "0px 15px 0px 0px" }
                : null
            }
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </h2>
        ))}
      </div>
      <div className="admin-page-content">
        {tabs.map((tab, index) =>
          index == activeTab ? (
            <Fragment key={index}>{tab.component}</Fragment>
          ) : null
        )}
      </div>
    </div>
  );
};

const UserTab = () => {
  const dispatch = useDispatch();
  const { users } = useSelector(usersSelector);

  useEffect(() => {
    dispatch(getUsers());
  });

  return (
    <div className="user-tab-container">
      <div className="new-user">
        <form className="new-user-form">
          <input type="username" placeholder="Username" />
          <input type="email" placeholder="Email" />
          <input type="text" placeholder="Password" />
          <input type="submit" value={"Create User"} />
        </form>
      </div>
      <div className="users-list">
        <header>
          <h2>Users</h2>
        </header>
        {users.length &&
          users.map((user, index) => (
            <div key={index} className="user-list-item">
              <h3>{user.username}</h3>
              <h3>{user.email}</h3>
            </div>
          ))}
      </div>
    </div>
  );
};

const CustomerTab = () => {
  const dispatch = useDispatch();
  const { customers } = useSelector(customersSelector);
  const [newCustomer, setNewCustomer] = useState({
    contacts: [
      {
        type: "phone",
        label: "Phone",
        info: "",
      },
    ],
  });

  useEffect(() => {
    dispatch(getCustomers());
  });
  return (
    <div className="customers-tab-container">
      <div className="new-customer-form">
        <header>
          <h2>New Customer</h2>
        </header>
        <div className="customer-form-info">
          <div className="form-column" id="customer-form-column1">
            <input type="text" placeholder="Name" required />
            <input type="number" placeholder="Premium" required />
            <input type="text" placeholder="Memo" />
            <select name="type" id="type">
              <option value="customer">Customer</option>
              <option value="supplier">Supplier</option>
              <option value="perspective">Perspective</option>
              <option value="client">Client</option>
            </select>
          </div>
          <div className="form-column" id="customer-form-column2">
            <button
              onClick={(event) => {
                event.preventDefault();
                setNewCustomer({
                  ...newCustomer,
                  contacts: [
                    ...newCustomer.contacts,
                    {
                      type: "phone",
                      label: "Phone",
                      info: "",
                    },
                  ],
                });
              }}
            >
              Add Contact
            </button>
            {newCustomer.contacts.map((contact, index) => (
              <div key={index} className="customer-form-contact">
                <select name="type" id="type">
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="fax">Fax</option>
                </select>
                <input type="text" placeholder="Label" required />
                <input type="text" placeholder="Info" required />
              </div>
            ))}
          </div>
          <div className="form-column" id="customer-form-column3">
            <input type="text" placeholder="Address Line 1" />
            <input type="text" placeholder="Address Line 2" />
            <input type="text" placeholder="City" />
          </div>
          <div className="form-column" id="customer-form-column4">
            <input type="text" placeholder="Province" />
            <input type="text" placeholder="Postal Code" />
            <input type="text" placeholder="Notes" />
          </div>

          <input type="submit" value={"Create Customer"} />
        </div>
      </div>
      <div className="customers-list">
        <header>
          <h2>Customers</h2>
        </header>
        {customers.length &&
          customers.map((customer, index) => (
            <div key={index} className="customer-list-item">
              <div className="form-column" id="customer-form-column1">
                <input type="text" value={customer.name} />
                <input type="number" value={customer.premium} />
                <input type="text" value={customer.memo} />
                <select name="type" id="type" value={customer.type}>
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                  <option value="perspective">Perspective</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div className="form-column" id="customer-form-column2">
                <button>Add Contact</button>
                {customer.contacts.map((contact, index) => (
                  <div key={index} className="customer-form-contact">
                    <select name="type" id="type" value={contact.type}>
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                      <option value="fax">Fax</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Label"
                      value={contact.label}
                    />
                    <input
                      type="text"
                      placeholder="Info"
                      value={contact.info}
                    />
                  </div>
                ))}
              </div>
              <div className="form-column" id="customer-form-column3">
                <input type="text" placeholder="Address Line 1" />
                <input type="text" placeholder="Address Line 2" />
                <input type="text" placeholder="City" />
              </div>
              <div className="form-column" id="customer-form-column4">
                <input type="text" placeholder="Province" />
                <input type="text" placeholder="Postal Code" />
                <input type="text" placeholder="Notes" />
              </div>
              <div className="form-column">
                <input type="submit" value={"Edit Customer"} />
                <input type="submit" value={"Delete Customer"} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const RatesTab = () => {
  return <></>;
};
