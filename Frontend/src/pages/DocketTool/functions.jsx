import { updateDocket, getDockets } from "../../state/dockets/saga";
export const PageDocketToolFunctions = [
  {
    label: "Save",
    function: function (dispatch) {
      dispatch(getDockets());
      console.log("hello world");
    },
  },
  {
    label: "Close",
    function: function () {
      console.log("hello world");
    },
  },
  {
    label: "Reopen",
    function: function () {
      console.log("hello world");
    },
  },
  {
    label: "Delete",
    function: function (dispatch) {
      dispatch(updateDocket);
    },
  },
  {
    label: "New Shipment",
    function: function () {
      console.log("hello world");
    },
  },
  {
    label: "Billing",
    function: function () {
      console.log("hello world");
    },
  },
  {
    label: "Work Order",
    function: function () {
      console.log("hello world");
    },
  },
];
