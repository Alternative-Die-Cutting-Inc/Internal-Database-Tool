import { docketSelector } from "../../state/dockets/docketSlice";
import { updateDocket, getDockets } from "../../state/dockets/saga";
import { useSelector } from "react-redux";

export const PageDocketToolFunctions = [
  {
    label: "Save",
    function: function SaveDocket() {
      const { docket } = useSelector(docketSelector);
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
    function: function (_, navigate) {
      navigate("/shipments" + window.location.search);
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
