import { combineReducers } from "@reduxjs/toolkit";
import docketsReducer from "./dockets/docketSlice";
import quotesReducer from "./quotes/quoteSlice";
import usersReducer from "./user/userSlice";

const rootReducer = combineReducers({
  docketsReducer,
  quotesReducer,
  usersReducer,
});

export default rootReducer;
