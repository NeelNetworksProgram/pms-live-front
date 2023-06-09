// libraries
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ContextTheme } from "../../Context/ThemeContext";

// styling
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../stylesheet/Navbar/Navbar.css";
import "../../stylesheet/Navbar/ManagerNavbar.css";

const ManagerNavbar = ({ isOpen, setIsOpen }) => {
  const { toggleTheme } = useContext(ContextTheme);

  const navLinkStyles = ({ isActive }) => {
    if (isActive && toggleTheme) {
      return {
        color: "#408bd5",
        backgroundColor: "#191919",
      };
    } else if (isActive) {
      return {
        color: "#408bd5",
        backgroundColor: "#1f293723",
      };
    } else if (toggleTheme) {
      return {
        color: "#fff",
        backgroundColor: "",
      };
    } else {
      return {
        color: "#171616",
        backgroundColor: "",
      };
    }
  };

  return (
    <div>
      {/* Navbar sticky on left side */}
      <nav
        id="navbar"
        className={`ManagerleftNavbar ${isOpen ? "open" : ""} ${
          toggleTheme ? "dark" : ""
        }`}
      >
        <ul>
          {/* Dashboard link */}
          <li className="sidebar-link">
            <NavLink className="nav-link" style={navLinkStyles} to="/homepage">
              <i className="fa-solid fa-house"></i>
              <span className="sidebar-span">Dashboard</span>
            </NavLink>
          </li>

          {/* Reports link */}
          <li className="sidebar-link">
            <NavLink className="nav-link" style={navLinkStyles} to="/reports">
              <i className="bi bi-card-text"></i>
              <span className="sidebar-span">Reports</span>
            </NavLink>
          </li>

          {/* Existing projects page */}
          <li className="sidebar-link">
            <NavLink
              className="nav-link"
              style={navLinkStyles}
              to="/projects/existing-projects"
            >
              <i className="fa-solid fa-cube"></i>
              <span className="sidebar-span">All Projects</span>
            </NavLink>
          </li>

          {/* Assigning a project link */}
          <li className="sidebar-link">
            <NavLink
              className="nav-link"
              style={navLinkStyles}
              to="/projects/assign-project"
            >
              <i className="fa-solid fa-pen"></i>
              <span className="sidebar-span">Assign</span>
            </NavLink>
          </li>

          {/* Tasks link */}
          <li className="sidebar-link">
            <NavLink className="nav-link" style={navLinkStyles} to="/my-tasks">
              <i className="fa-solid fa-list-check"></i>
              <span className="sidebar-span">Tasks</span>
            </NavLink>
          </li>

          {/* Navbar toggle button */}
          <li className="sidebar-link">
            <span
              className="nav-link"
              style={{ color: "#fff" }}
              onClick={() => setIsOpen(!isOpen)}
            >
              {/* <i className="fas fa-bars"></i> */}
              {isOpen ? (
                <i className="fas fa-long-arrow-left toggler-icon open"></i>
              ) : (
                <i className="fas fa-long-arrow-right toggler-icon"></i>
              )}
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ManagerNavbar;
