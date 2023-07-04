import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";
import configureAppStore, { sagaMiddleware } from "./state/store.jsx";
import { Provider } from "react-redux";
import docketSaga from "./state/dockets/saga";
import quoteSaga from "./state/quotes/saga";
import navbarSaga from "./state/navbar/saga";
import userSaga from "./state/user/saga";

const store = configureAppStore();

sagaMiddleware.run(docketSaga);
sagaMiddleware.run(navbarSaga);
sagaMiddleware.run(quoteSaga);
sagaMiddleware.run(userSaga);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
