import { Page404 } from "../pages/404/404";
import { PageHome } from "../pages/Home/Home";
import { PageAdmin } from "../pages/Admin/Admin";
import { PageLogin } from "../pages/Login/Login";
import { PageQuotes } from "../pages/Quotes/Quotes";
import { PageDockets } from "../pages/Dockets/Dockets";
import { PageReports } from "../pages/Reports/Reports";
import { PageShipments } from "../pages/Shipments/Shipments";
import { PageQuoteTool } from "../pages/QuoteTool/QuoteTool";
import { PageDocketTool } from "../pages/DocketTool/DocketTool";
import PageClientSheet from "../pages/ClientSheet/ClientSheet";
import PageWorkSheet from "../pages/WorkSheet/WorkSheet";
import PageDeliverySlip from "../pages/DeliverySlip/DeliverySlip";
import PageWorkOrder from "../pages/WorkOrder/WorkOrder";
import { PageQuoteToolFunctions } from "../pages/QuoteTool/functions";
import { PageShipmentsFunctions } from "../pages/Shipments/functions";
import { PageDocketToolFunctions } from "../pages/DocketTool/functions";

export const pages = {
  404: {
    label: "404",
    component: <Page404 />,
    path: "*",
  },
  login: {
    label: "Login",
    component: <PageLogin />,
    path: "/login",
  },
  main: [
    {
      label: "Quotes",
      component: <PageQuotes />,
      path: "/quotes",
    },
    {
      label: "Dockets",
      component: <PageDockets />,
      path: "/dockets",
    },
    {
      label: "Reports",
      component: <PageReports />,
      path: "/reports",
    },
    {
      label: "Admin",
      component: <PageAdmin />,
      path: "/admin",
    },
  ],
  hidden: [
    {
      label: "Home",
      component: <PageHome />,
      path: "/",
    },
    {
      label: "Quote Tool",
      component: <PageQuoteTool />,
      path: "/quotetool",
    },
    {
      label: "Docket Tool",
      component: <PageDocketTool />,
      path: "/dockettool",
    },
    {
      label: "Shipments",
      component: <PageShipments />,
      path: "/shipments",
    },
    {
      label: "Delivery Slip",
      component: <PageDeliverySlip />,
      path: "/delivery-slip",
    },
    {
      label: "Client Sheet",
      component: <PageClientSheet />,
      path: "/client-sheet",
    },
    {
      label: "Work Sheet",
      component: <PageWorkSheet />,
      path: "/work-sheet",
    },
    {
      label: "Work Order",
      component: <PageWorkOrder />,
      path: "/work-order",
    },
  ],

  functions: {
    quotetool: [...PageQuoteToolFunctions],
    dockettool: [...PageDocketToolFunctions],
    shipments: [...PageShipmentsFunctions],
  },
};
