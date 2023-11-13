import { useDispatch, useSelector } from "react-redux";
import "./Admin.scss";
import { Fragment, useEffect, useState } from "react";
import { usersSelector } from "../../state/user/userSlice";
import { getUsers, signUp } from "../../state/user/saga";
import { customersSelector } from "../../state/customers/customerSlice";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
} from "../../state/customers/saga";
import { changeRates, getRates } from "../../state/quotes/saga";
import { ratesSelector } from "../../state/quotes/quoteSlice";

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
    if (!users) dispatch(getUsers());
  });

  return (
    <div className="user-tab-container">
      <div className="new-user">
        <form
          className="new-user-form"
          onSubmit={(event) => {
            event.preventDefault();
            const newUser = {
              username: event.target[0].value,
              email: event.target[1].value,
              password: event.target[2].value,
            };
            console.log(newUser);
            dispatch(signUp({ newUser }));
            dispatch(getUsers());
          }}
        >
          <input type="username" placeholder="Username" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
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
              <label htmlFor="">
                Username
                <input type="username" value={user.username} readOnly />
              </label>
              <label htmlFor="">
                Email
                <input type="email" value={user.email} readOnly />
              </label>
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
    type: "customer",
  });

  useEffect(() => {
    if (!customers) dispatch(getCustomers());
  });
  return (
    <div className="customers-tab-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          dispatch(createCustomer({ customer: newCustomer }));
        }}
        className="new-customer-form"
      >
        <header>
          <h2>New Customer</h2>
        </header>
        <div className="customer-form-info">
          <div className="form-column" id="customer-form-column1">
            <input
              type="text"
              placeholder="Name"
              required
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  name: event.target.value,
                });
              }}
            />
            <input
              type="number"
              placeholder="Premium"
              step={0.001}
              required
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  premium: parseFloat(event.target.value),
                });
              }}
            />
            <input
              type="text"
              placeholder="Memo"
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  memo: event.target.value,
                });
              }}
            />
            <select
              name="type"
              id="type"
              defaultValue={newCustomer.type}
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  type: event.target.value,
                });
              }}
            >
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
                if (event.detail)
                  setNewCustomer({
                    ...newCustomer,
                    contacts: [
                      ...newCustomer.contacts,
                      {
                        type: "phone",
                        label: "",
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
                <select
                  name="type"
                  id="type"
                  value={contact.type}
                  onChange={(event) => {
                    setNewCustomer({
                      ...newCustomer,
                      contacts: newCustomer.contacts.map((contact, i) => {
                        if (i == index) {
                          return {
                            ...contact,
                            type: event.target.value,
                          };
                        } else return contact;
                      }),
                    });
                  }}
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="fax">Fax</option>
                </select>
                <input
                  type="text"
                  placeholder="Label"
                  required
                  onChange={(event) => {
                    setNewCustomer({
                      ...newCustomer,
                      contacts: newCustomer.contacts.map((contact, i) => {
                        if (i == index) {
                          return {
                            ...contact,
                            label: event.target.value,
                          };
                        } else return contact;
                      }),
                    });
                  }}
                />
                <input
                  type={contact.type == "email" ? "email" : "text"}
                  placeholder="Info"
                  required
                  onChange={(event) => {
                    setNewCustomer({
                      ...newCustomer,
                      contacts: newCustomer.contacts.map((contact, i) => {
                        if (i == index) {
                          return {
                            ...contact,
                            info: event.target.value,
                          };
                        } else return contact;
                      }),
                    });
                  }}
                />
              </div>
            ))}
          </div>
          <div className="form-column" id="customer-form-column3">
            <input
              type="text"
              placeholder="Address Line 1"
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  address: {
                    ...newCustomer.address,
                    line1: event.target.value,
                  },
                });
              }}
            />
            <input
              type="text"
              placeholder="Address Line 2"
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  address: {
                    ...newCustomer.address,
                    line2: event.target.value,
                  },
                });
              }}
            />
            <input
              type="text"
              placeholder="City"
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  address: {
                    ...newCustomer.address,
                    city: event.target.value,
                  },
                });
              }}
            />
          </div>
          <div className="form-column" id="customer-form-column4">
            <input
              type="text"
              placeholder="Province"
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  address: {
                    ...newCustomer.address,
                    province: event.target.value,
                  },
                });
              }}
            />
            <input
              type="text"
              placeholder="Postal Code"
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  address: {
                    ...newCustomer.address,
                    postalCode: event.target.value,
                  },
                });
              }}
            />
            <input
              type="text"
              placeholder="Notes"
              onChange={(event) => {
                setNewCustomer({
                  ...newCustomer,
                  address: {
                    ...newCustomer.address,
                    notes: event.target.value,
                  },
                });
              }}
            />
          </div>

          <input type="submit" value={"Create Customer"} />
        </div>
      </form>
      <div className="customers-list">
        <header>
          <h2>Customers</h2>
        </header>
        {customers.length &&
          customers.map((customer, index) => (
            <div key={index} className="customer-list-item">
              <div className="form-column" id="customer-form-column1">
                <input type="text" value={customer.name} readOnly />
                <input type="number" value={customer.premium} readOnly />
                <input type="text" value={customer.memo} readOnly />
                <select name="type" id="type" value={customer.type} readOnly>
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                  <option value="perspective">Perspective</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div className="form-column" id="customer-form-column2">
                {/* <button>Add Contact</button> */}
                {customer.contacts.map((contact, index) => (
                  <div key={index} className="customer-form-contact">
                    <select name="type" id="type" value={contact.type} readOnly>
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                      <option value="fax">Fax</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Label"
                      value={contact.label}
                      readOnly
                    />
                    <input
                      type="text"
                      placeholder="Info"
                      value={contact.info}
                      readOnly
                    />
                  </div>
                ))}
              </div>
              <div className="form-column" id="customer-form-column3">
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={customer?.address?.line1 || ""}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Address Line 2"
                  value={customer?.address?.line2 || ""}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="City"
                  value={customer?.address?.city || ""}
                  readOnly
                />
              </div>
              <div className="form-column" id="customer-form-column4">
                <input
                  type="text"
                  placeholder="Province"
                  value={customer?.address?.province || ""}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={customer?.address?.postalCode || ""}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Notes"
                  value={customer?.address?.notes || ""}
                  readOnly
                />
              </div>
              <div className="form-column">
                <input
                  type="submit"
                  value={"Delete Customer"}
                  style={{ backgroundColor: "red" }}
                  onClick={() => {
                    dispatch(deleteCustomer({ id: customer._id }));
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

const RatesTab = () => {
  const dispatch = useDispatch();
  const { rates } = useSelector(ratesSelector);
  const [editingRates, setEditingRates] = useState(null);
  useEffect(() => {
    if (!rates) dispatch(getRates());
    else setEditingRates(rates);
  }, [rates, dispatch]);
  return (
    <div className="rates-tab-container">
      <div className="admin-rate-editor">
        <h1>Rate Editor</h1>
        <h3>Editing Global Rates</h3>
        {editingRates &&
          Object.keys(editingRates).map((rate, index) => {
            return (
              <label key={index} htmlFor={rate}>
                {rate}
                <br />
                <input
                  name={rate}
                  type={"number"}
                  value={editingRates[rate] || 0}
                  onChange={(event) => {
                    setEditingRates({
                      ...editingRates,
                      [rate]: parseFloat(event.target.value),
                    });
                  }}
                />
              </label>
            );
          })}
        <button
          onClick={() => {
            dispatch(changeRates({ rates: editingRates }));
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};
