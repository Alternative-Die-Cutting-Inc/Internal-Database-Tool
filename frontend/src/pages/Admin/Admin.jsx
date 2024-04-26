import { useDispatch, useSelector } from "react-redux";
import "./Admin.scss";
import { Fragment, useEffect, useState, useContext } from "react";
import { userSelector, usersSelector } from "../../state/user/userSlice";
import { getUsers, signUp, deleteUser } from "../../state/user/saga";
import { customersSelector } from "../../state/customers/customerSlice";
import {
  createCustomer,
  deleteCustomer,
  getCustomers,
} from "../../state/customers/saga";
import { changeRates, getRates } from "../../state/quotes/saga";
import { ratesSelector } from "../../state/quotes/quoteSlice";
import { SnackbarContext } from "../../util/SnackbarProvider";

export const PageAdmin = () => {
  const { setSnackbar } = useContext(SnackbarContext);
  const tabs = [
    { name: "Users", component: <UserTab setSnackbar={setSnackbar} /> },
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

const UserTab = ({ setSnackbar }) => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(usersSelector);
  const { user } = useSelector(userSelector);
  const [newUser, setNewUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    setNewUser(values => ({ ...values, [field]: value }))
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(signUp({ newUser, setSnackbar, setNewUser }));
  }

  return (
    <div className="user-tab-container">
      <div className="new-user">
        <header  >
          <h2>New User</h2>
        </header>
        <form
          className="new-user-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username || ""}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={newUser.firstName || ""}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={newUser.lastName || ""}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email || ""}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password || ""}
            onChange={handleChange}
            required
          />
          <input type="submit" value={"Create User"} />
          {loading && "loading..."}
        </form>
      </div>
      <div className="users-list">
        <header>
          <h2>Users</h2>
        </header>
        {users.length && (
          <table >
            <thead>
              <tr>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((listUser, index) => (
                <tr key={index}  >
                  <td>{listUser.username}</td>
                  <td>{listUser.firstName}</td>
                  <td>{listUser.lastName}</td>
                  <td>{listUser.email}</td>
                  <td
                    style={{
                      alignItems: "center"
                    }}
                  >
                    <button
                      style={{
                        width: "2vw",
                        backgroundColor: "var(--red-error)",
                      }}
                      onClick={() => {
                        const id = listUser._id;
                        dispatch(deleteUser({ id, setSnackbar }));
                      }}
                      disabled={user._id == listUser._id}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
    if (!customers.length) dispatch(getCustomers());
  });
  const handleChange = (event) => {
    const field = event.target.name;
    const value = event.target.value;
    setNewCustomer(values => ({ ...values, [field]: value }))
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(createCustomer({ customer: newCustomer }));
  }
  return (
    <div className="customers-tab-container">
      <form
        onSubmit={handleSubmit}
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
              step={0.01}
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
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Premium</th>
              <th>Memo</th>
              <th>Type</th>
              <th>Contact Type</th>
              <th>Contact Label</th>
              <th>Contact Info</th>
              <th>Address Line 1</th>
              <th>Address Line 2</th>
              <th>City</th>
              <th>Province</th>
              <th>Postal Code</th>
              <th>Notes</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 &&
              customers.map((customer, index) => (
                <tr key={index}>
                  <td>{customer.name}</td>
                  <td>{customer.premium}</td>
                  <td>{customer.memo}</td>
                  <td>{customer.type}</td>
                  <td>
                    {customer.contacts.map((contact, index) => (
                      <div key={index}>{contact.type}</div>
                    ))}
                  </td>
                  <td>
                    {customer.contacts.map((contact, index) => (
                      <div key={index}>{contact.label}</div>
                    ))}
                  </td>
                  <td>
                    {customer.contacts.map((contact, index) => (
                      <div key={index}>{contact.info}</div>
                    ))}
                  </td>
                  <td>{customer?.address?.line1 || ""}</td>
                  <td>{customer?.address?.line2 || ""}</td>
                  <td>{customer?.address?.city || ""}</td>
                  <td>{customer?.address?.province || ""}</td>
                  <td>{customer?.address?.postalCode || ""}</td>
                  <td>{customer?.address?.notes || ""}</td>
                  <td>
                    <input
                      type="submit"
                      value={"X"}
                      style={{ backgroundColor: "red" }}
                      onClick={() => {
                        dispatch(deleteCustomer({ id: customer._id }));
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

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


