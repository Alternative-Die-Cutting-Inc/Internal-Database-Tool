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
import { useEffect } from "react";
import {
  BrowserRouter,
  useLocation,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

import { DarkModeProvider } from "./util/DarkModeProvider";
import { SnackbarProvider } from "./util/SnackbarProvider";

import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "./state/user/saga";
import { userSelector } from "./state/user/userSlice";

import { getDockets } from "./state/dockets/saga";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserInfo());
    dispatch(getDockets());
  });

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector(userSelector);
  useEffect(() => {
    if (!user) {
      dispatch(getUserInfo(navigate));
    }
  }, [user]);
  return (
    <TransitionGroup>
      <Navbar />
      <ScrollToTop />
      <Routes location={location}>
        {user ? (
          [...pages.main, ...pages.hidden].map((page) => {
            return (
              <Route
                path={page.path}
                key={page.path}
                element={
                  <div
                    className="content-container"
                    style={{
                      marginTop: "45px",
                      height: "fit-content",
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
          })
        ) : (
          <Route
            path="/"
            element={
              loading ? (
                <></>
              ) : (
                <div
                  className="content-container"
                  style={{
                    marginTop: "45px",
                    height: "fit-content",
                    position: "absolute",
                    right: 0,
                    left: 0,
                    bottom: 0,
                    top: 0,
                  }}
                >
                  {pages["login"].component}
                </div>
              )
            }
          />
        )}
        {loading ? <></> : <Route path="*" element={pages["404"].component} />}
      </Routes>
    </TransitionGroup>
  );
};

export default App;
