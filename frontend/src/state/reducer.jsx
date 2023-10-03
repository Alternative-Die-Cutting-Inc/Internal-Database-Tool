import { combineReducers } from "@reduxjs/toolkit";
import docketsReducer from "./dockets/docketSlice";
import customerReducer from "./customers/customerSlice";
import quotesReducer from "./quotes/quoteSlice";
import navbarReducer from "./navbar/navbarSlice";
import usersReducer from "./user/userSlice";
import shipmentsReducer from "./shipments/shipmentsSlice";

const rootReducer = combineReducers({
  shipmentsReducer,
  customerReducer,
  docketsReducer,
  quotesReducer,
  navbarReducer,
  usersReducer,
});

export default rootReducer;
