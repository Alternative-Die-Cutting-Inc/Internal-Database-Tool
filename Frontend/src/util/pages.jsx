// import { lazyLoad } from "./lazyLoad";

// const Page404 = lazyLoad("../pages/404/404", "Page404");
// const PageHome = lazyLoad("../pages/Home/Home", "PageHome");
// const PageLogin = lazyLoad("../pages/Login/Login", "PageLogin");
// const PageQuotes = lazyLoad("../pages/Quotes/Quotes", "PageQuotes");
// const PageDockets = lazyLoad("../pages/Dockets/Dockets", "PageDockets");
// const PageReports = lazyLoad("../pages/Reports/Reports", "PageReports");
// const PageQuoteTool = lazyLoad("../pages/QuoteTool/QuoteTool", "PageQuoteTool");
// const PageDocketTool = lazyLoad(
//   "../pages/DocketTool/DocketTool",
//   "PageDocketTool"
//   );

import { Page404 } from "../pages/404/404";
import { PageHome } from "../pages/Home/Home";
import { PageLogin } from "../pages/Login/Login";
import { PageQuotes } from "../pages/Quotes/Quotes";
import { PageDockets } from "../pages/Dockets/Dockets";
import { PageReports } from "../pages/Reports/Reports";
import { PageShipments } from "../pages/Shipments/Shipments";
import { PageQuoteTool } from "../pages/QuoteTool/QuoteTool";
import { PageDocketTool } from "../pages/DocketTool/DocketTool";
import { PageQuoteToolFunctions } from "../pages/QuoteTool/functions";
import { PageDocketToolFunctions } from "../pages/DocketTool/functions";
import PagePDF from "../pages/PDF/PDF";
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
      label: "PDF",
      component: <PagePDF />,
      path: "/pdf",
    },
  ],

  functions: {
    quotes: [],
    dockets: [],
    quotetool: [...PageQuoteToolFunctions],
    dockettool: [...PageDocketToolFunctions],
    reports: [],
  },
};
