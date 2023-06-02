import { Page404 } from "../pages/404/404";
import { PageHome } from "../pages/Home/Home";
import { PageLogin } from "../pages/Login/Login";
import { PageQuotes } from "../pages/Quotes/Quotes";
import { PageDockets } from "../pages/Dockets/Dockets";
import { PageReports } from "../pages/Reports/Reports";
import { PageShipments } from "../pages/Shipments/Shipments";

export const pages = {
  404: {
    label: "404",
    component: <Page404 />,
  },
  main: [
    {
      label: "Quotes",
      component: <Page404 />,
      path: "/quotes",
      includeFooter: true,
    },
    {
      label: "Dockets",
      component: <Page404 />,
      path: "/dockets",
      includeFooter: true,
    },
    {
      label: "Reports",
      component: <Page404 />,
      path: "/reports",
      includeFooter: true,
    },
  ],

  hidden: [
    {
      label: "Client Sheet",
      component: <Page404 />,
      path: "/dockets",
      parent: "/quotes",
    },
    {
      label: "Work Sheet",
      component: <Page404 />,
      path: "/reports",
      parent: "/quotes",
    },
    {
      label: "Customer",
      component: <Page404 />,
      path: "/reports",
      parent: "/quotes",
    },
    {
      label: "#",
      component: <Page404 />,
      path: "/reports",
      parent: "/quotes",
    },
    {
      label: "Save",
      component: <Page404 />,
      path: "/dockets",
      parent: "/dockets",
    },
    {
      label: "Close",
      component: <Page404 />,
      path: "/reports",
      parent: "/dockets",
    },
    {
      label: "Reopen",
      component: <Page404 />,
      path: "/reports",
      parent: "/dockets",
    },
    {
      label: "Delete",
      component: <Page404 />,
      path: "/reports",
      parent: "/dockets",
    },
    {
      label: "New Shipment",
      component: <Page404 />,
      path: "/reports",
      parent: "/dockets",
    },
    {
      label: "Billing",
      component: <Page404 />,
      path: "/reports",
      parent: "/dockets",
    },
    {
      label: "Work Order",
      component: <Page404 />,
      path: "/reports",
      parent: "/dockets",
    },
  ],
};
