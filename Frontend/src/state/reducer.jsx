import { combineReducers } from "@reduxjs/toolkit";
import docketsReducer from "./dockets/docketSlice";
import quotesReducer from "./quotes/quoteSlice";
import navbarReducer from "./navbar/navbarSlice";
import usersReducer from "./user/userSlice";

const rootReducer = combineReducers({
  docketsReducer,
  quotesReducer,
  navbarReducer,
  usersReducer,
});

export default rootReducer;
