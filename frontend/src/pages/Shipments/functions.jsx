const PageShipmentsFunctions = [
  {
    label: "Delivery Slip",
    function: function (_, navigate) {
      navigate("/delivery-slip" + window.location.search);
    },
  },
];

export { PageShipmentsFunctions };
