import React from "react";
import { NavLink } from "react-router-dom";

export default function ReportsNavbar() {
  const navLinkStyles = ({ isActive }) => {
    return {
      fontWeight: isActive ? "bold" : "normal",
    };
  };

  return (
    <>
      {/* Reports Navbar */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary reports-navbar">
        <div className="container-fluid container-reports">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <li>
                <NavLink
                  className="reports-nav-link"
                  style={navLinkStyles}
                  to="/reports/check-user-report"
                >
                  Check User Report
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="reports-nav-link"
                  style={navLinkStyles}
                  to="/reports/check-project-report"
                >
                  Check Project Report
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="reports-nav-link"
                  style={navLinkStyles}
                  to="/reports/user-project-report"
                >
                  User Project Report
                </NavLink>
              </li>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
