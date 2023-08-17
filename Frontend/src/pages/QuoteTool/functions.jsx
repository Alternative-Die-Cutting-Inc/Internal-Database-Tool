import { changeRates } from "../../state/quotes/saga";

const PageQuoteToolFunctions = [
  {
    label: "Client Sheet",
    function: function (dispatch, navigate) {
      navigate("/pdf?sheet=ClientSheet");
    },
  },
  {
    label: "Work Sheet",
    function: function (dispatch, navigate) {
      navigate("/pdf?sheet=WorkSheet");
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
