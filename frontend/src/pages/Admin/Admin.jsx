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

  useEffect(() => {
    dispatch(getCustomers());
  });
  return (
    <div className="customers-tab-container">
      <div className="new-customer">
        <form className="new-customer-form">
          <input type="text" placeholder="Name" />
          <input type="number" placeholder="Premium" />
          <input type="text" placeholder="Memo" />
          <input type="submit" value={"Create Customer"} />
        </form>
      </div>
      <div className="customers-list">
        <header>
          <h2>Customers</h2>
        </header>
        {customers.length &&
          customers.map((customer, index) => (
            <div key={index} className="customer-list-item">
              <h3>{customer.name}</h3>
              {customer.contacts.length &&
                customer.contacts.map((contact, index) => (
                  <h3 key={index}>{contact.label + ": " + contact.info}</h3>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
};

const RatesTab = () => {
  return <></>;
};
