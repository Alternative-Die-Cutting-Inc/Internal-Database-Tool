import "./Navbar.scss";
import { useEffect, useRef } from "react";
import AlternativeDCLogo from "../../assets/logo/logo.png";
import { Link, useLocation } from "react-router-dom";
import { pages } from "../../util/pages";
import { useDispatch } from "react-redux";
import { setNavbarFunctions } from "../../state/navbar/saga";
const Navbar = () => {
  const { pathname } = useLocation();
  const navbarFunctionsRef = useRef([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (navbarFunctionsRef.current.length > 0) {
      dispatch(setNavbarFunctions({ navbarFunctions: navbarFunctionsRef }));
      console.log(navbarFunctionsRef.current);
    }
  }, []);
  return (
    <>
      <div className="navbar-container">
        <div className="navbar-special">
          <Link
            to={pathname === "/" ? {} : "/"}
            style={pathname === "/" ? { pointerEvents: "none" } : {}}
            key={"home"}
          >
            <img
              className="icon-logo"
              src={AlternativeDCLogo}
              alt="altenative die cutting logo"
            ></img>
          </Link>
          {Object.keys(pages.functions).forEach((pageFunctions) => {
            pages.functions[pageFunctions].map((pageFunction, index) => {
              return (
                <div
                  className="navbar-sub-container"
                  key={pageFunction.label}
                  ref={(element) => navbarFunctionsRef.current.push(element)}
                  style={
                    index == 0
                      ? {
                          borderWidth: "0px 1px 0px 1px",
                          borderStyle: "solid",
                          borderColor: "#000000",
                        }
                      : {}
                  }
                >
                  <nav className="navbar-link-label">
                    <h3>{pageFunction.label}</h3>
                  </nav>
                </div>
              );
            });
          })}
        </div>
        <div className="navbar-main">
          {pages.main.map((page, index) => {
            return (
              <Link
                to={pathname === page.path ? {} : page.path}
                key={page.path}
                style={pathname === page.path ? { pointerEvents: "none" } : {}}
              >
                <div
                  className={
                    pathname === page.path
                      ? "navbar-sub-container page-selected"
                      : "navbar-sub-container"
                  }
                  key={page.path}
                  style={
                    index == 0
                      ? {
                          borderWidth: "0px 1px 0px 1px",
                          borderStyle: "solid",
                          borderColor: "#000000",
                        }
                      : {}
                  }
                >
                  <nav className="navbar-link-label">
                    <h3>{page.label}</h3>{" "}
                  </nav>
                </div>
              </Link>
            );
          })}
          <div className="navbar-sub-container" key={"logout"}>
            <div className="navbar-link-label">
              {" "}
              <h3>Logout</h3>{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Navbar };
