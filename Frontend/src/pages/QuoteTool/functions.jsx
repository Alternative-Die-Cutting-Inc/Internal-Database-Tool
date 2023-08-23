const PageQuoteToolFunctions = [
  {
    label: "Client Sheet",
    function: function (_, navigate) {
      navigate(
        "/pdf?sheet=ClientSheet" + window.location.search.replace("?", "&")
      );
    },
  },
  {
    label: "Work Sheet",
    function: function (_, navigate) {
      navigate(
        "/pdf?sheet=WorkSheet" + window.location.search.replace("?", "&")
      );
    },
  },
];

export { PageQuoteToolFunctions };
