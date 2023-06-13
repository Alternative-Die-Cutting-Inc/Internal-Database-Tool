import { Page404 } from "../pages/404/404";
import { PageHome } from "../pages/Home/Home";
import { PageLogin } from "../pages/Login/Login";
import { PageQuotes } from "../pages/Quotes/Quotes";
import { PageQuotesFunctions } from "../pages/Quotes/functions";
import { PageDockets } from "../pages/Dockets/Dockets";
import { PageDocketsFunctions } from "../pages/Dockets/functions";
import { PageReports } from "../pages/Reports/Reports";
import { PageQuoteTool } from "../pages/QuoteTool/QuoteTool";
import { PageQuoteToolFunctions } from "../pages/QuoteTool/functions";
import { PageDocketTool } from "../pages/DocketTool/DocketTool";
import { PageDocketToolFunctions } from "../pages/DocketTool/functions";

export const pages = {
  404: {
    label: "404",
    component: <Page404 />,
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
      path: "/quotetool/*",
    },
    {
      label: "Docket Tool",
      component: <PageDocketTool />,
      path: "/dockettool/*",
    },
    {
      label: "Login",
      component: <PageLogin />,
      path: "/login",
    },
  ],
  functions: {
    quotes: [...PageQuotesFunctions],
    dockets: [...PageDocketsFunctions],
    quotetool: [...PageQuoteToolFunctions],
    dockettool: [...PageDocketToolFunctions],
    reports: [],
  },
};
