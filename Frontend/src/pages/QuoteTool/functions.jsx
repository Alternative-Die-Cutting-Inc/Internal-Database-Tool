import { getDocket } from "../../state/dockets/saga";
import { docketSelector } from "../../state/dockets/docketSlice";
import { useDispatch, useSelector } from "react-redux";

function useClientSheet() {
  useDispatch(getDocket());
  const { docket } = useSelector(docketSelector);
  return docket;
}

const PageQuoteToolFunctions = [
  {
    label: "Client Sheet",
    function: function () {
      console.log("hello world");
    },
  },
  {
    label: "Work Sheet",
    function: function () {
      console.log("hello world");
    },
  },
  {
    label: "Customer",
    function: function () {
      console.log("hello world");
    },
  },
  {
    label: "#",
    function: function () {
      console.log("hello world");
    },
  },
];

export { PageQuoteToolFunctions };
