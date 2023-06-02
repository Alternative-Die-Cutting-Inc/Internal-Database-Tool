import { Page404 } from "../pages/404/404";
import { PageHome } from "../pages/Home/Home";
import { PageLogin } from "../pages/Login/Login";
import { PageQuotes } from "../pages/Quotes/Quotes";
import { PageQuotesFunctions } from "../pages/Quotes/functions";
import { PageDockets } from "../pages/Dockets/Dockets";
import { PageDocketsFunctions } from "../pages/Dockets/functions";
import { PageReports } from "../pages/Reports/Reports";

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

  functions: {
    quotes: [...PageQuotesFunctions],
    dockets: [...PageDocketsFunctions],
    reports: [],
  },
};
