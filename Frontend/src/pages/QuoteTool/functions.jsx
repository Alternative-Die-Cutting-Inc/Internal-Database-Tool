import { changeRates } from "../../state/quotes/saga";

const PageQuoteToolFunctions = [
  {
    label: "Client Sheet",
    function: function (dispatch, navigate, pathname) {
      navigate("/quotes");
    },
  },
  {
    label: "Work Sheet",
    function: function () {
      console.log("hello world");
    },
  },
  {
    label: "Change Rates",
    function: function (dispatch) {
      dispatch(changeRates({}));
    },
  },
];

export { PageQuoteToolFunctions };
