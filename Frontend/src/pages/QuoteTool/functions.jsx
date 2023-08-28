const PageQuoteToolFunctions = [
  {
    label: "Client Sheet",
    function: function (_, navigate) {
      navigate("/client-sheet" + window.location.search);
    },
  },
  {
    label: "Work Sheet",
    function: function (_, navigate) {
      navigate("/work-sheet" + window.location.search);
    },
  },
];

export { PageQuoteToolFunctions };
