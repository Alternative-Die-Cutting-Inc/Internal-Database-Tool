import "./Navbar.scss";

import AlternativeDCLogo from "../../assets/logo/logo.png";
import { Link, useLocation } from "react-router-dom";
import { pages } from "../../util/pages";

const Navbar = () => {
  const { pathname } = useLocation();

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
              alt="frosh logo"
            ></img>
          </Link>
          {pages.hidden.map((page, index) => {
            return (
              <>
                {page.parent === pathname ? (
                  <div
                    className="navbar-sub-container"
                    key={page.path}
                    style={
                      index == 0
                        ? {
                            "border-width": "0px 1px 0px 1px",
                            "border-style": "solid",
                            "border-color": "#000000",
                          }
                        : {}
                    }
                  >
                    <div className="navbar-link-label"> {page.label} </div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            );
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
                          "border-width": "0px 1px 0px 1px",
                          "border-style": "solid",
                          "border-color": "#000000",
                        }
                      : {}
                  }
                >
                  <nav className="navbar-link-label"> {page.label} </nav>
                </div>
              </Link>
            );
          })}
          <div className="navbar-sub-container" key={"logout"}>
            <div className="navbar-link-label"> Logout </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Navbar };
