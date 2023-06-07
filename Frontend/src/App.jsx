/**
 * @fileOverview App component. This is the main component of the project. All pages are rendered here.
 * @author Farbod Mohammadzadeh - https://github.com/Freeassassin
 * @version 1.0
 * @date 2023-06-07
 * @description This component is responsible for rendering all pages. It also handles page transitions. 
 * @resources  
 */

import "./App.scss";
import { pages } from "./util/pages";
import { Navbar } from "./components/Navbar/Navbar";

import { BrowserRouter, useLocation, Route, Routes } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import { DarkModeProvider } from "./util/DarkModeProvider";
import { SnackbarProvider } from "./util/SnackbarProvider";

function App() {
  return (
    <DarkModeProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <TransitionRoutes />
        </BrowserRouter>
      </SnackbarProvider>
    </DarkModeProvider>
  );
}

const TransitionRoutes = () => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <Navbar />
      <ScrollToTop />
      <CSSTransition key={location.key} classNames="page" timeout={300}>
        <Routes location={location}>
          {[...pages.main, ...pages.hidden].map((page) => {
            return (
              <Route
                path={page.path}
                key={page.path}
                element={
                  <div
                    className="content-container"
                    style={{
                      marginTop: "45px",
                      position: "absolute",
                      right: 0,
                      left: 0,
                      bottom: 0,
                      top: 0,
                    }}
                  >
                    {page.component}
                  </div>
                }
              />
            );
          })}
          <Route path="*" element={pages["404"].component} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default App;
