import { combineReducers } from "@reduxjs/toolkit";
import docketsReducer from "./dockets/docketSlice";
import customerReducer from "./customers/customerSlice";
import quotesReducer from "./quotes/quoteSlice";
import navbarReducer from "./navbar/navbarSlice";
import usersReducer from "./user/userSlice";

const rootReducer = combineReducers({
  customerReducer,
  docketsReducer,
  quotesReducer,
  navbarReducer,
  usersReducer,
});

export default rootReducer;
