export const PageDocketToolFunctions = [
  // {
  //   label: "Save",
  //   function: function SaveDocket() {
  //     const { docket } = useSelector(docketSelector);
  //   },
  // },
  // {
  //   label: "Close",
  //   function: function () {
  //     console.log("hello world");
  //   },
  // },
  // {
  //   label: "Reopen",
  //   function: function () {
  //     console.log("hello world");
  //   },
  // },
  // {
  //   label: "Delete",
  //   function: function DeleteDocket(_, navigate) {
  //     const dispatch = useDispatch();
  //     const { docket } = useSelector(docketSelector);
  //     return useEffect(() => {
  //       console.log(docket);
  //       dispatch(deleteDocket({ id: docket._id }));
  //       navigate("/dockets");
  //     });
  //   },
  // },
  {
    label: "New Shipment",
    function: function (_, navigate) {
      navigate("/shipments" + window.location.search);
    },
  },
  {
    label: "Billing",
    function: function (_, navigate) {
      navigate("/billing-report" + window.location.search);
    },
  },
  {
    label: "Work Order",
    function: function () {
      console.log("hello world");
    },
  },
];
