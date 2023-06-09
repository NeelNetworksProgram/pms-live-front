// libraries
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ContextTheme } from "../../Context/ThemeContext";

// styling
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../stylesheet/Navbar/Navbar.css";
import "../../stylesheet/Navbar/EmployeeNavbar.css";

const UserNavbar = ({ isOpen, setIsOpen }) => {
  const { toggleTheme } = useContext(ContextTheme);
  // const navLinkStyles = ({ isActive }) => {
  //   return {
  //     color: isActive ? "#408bd5" : "#171616",
  //     backgroundColor: isActive ? "#1f293723" : "",
  //   };
  // };
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
        className={`EmployeeleftNavbar ${toggleTheme ? "dark" : ""} ${
          isOpen ? "open" : ""
        }`}
      >
        <ul>
          {/* Dashboard link */}
          <li className="sidebar-link">
            <NavLink className="nav-link" style={navLinkStyles} to="/home">
              <i className="fa-solid fa-house"></i>
              <span className="sidebar-span">Dashboard</span>
            </NavLink>
          </li>

          {/* My projects page */}
          <li className="sidebar-link">
            <NavLink
              className="nav-link"
              style={navLinkStyles}
              to="/projects/employee-projects"
            >
              <i className="fa-solid fa-file"></i>
              <span className="sidebar-span">Projects</span>
            </NavLink>
          </li>

          {/* Add time in a projects */}
          <li className="sidebar-link">
            <NavLink
              className="nav-link"
              style={navLinkStyles}
              to="/projects/add-time-in-project"
            >
              <i className="fa-solid fa-stopwatch"></i>
              <span className="sidebar-span">Time Entry</span>
            </NavLink>
          </li>

          {/* Tasks */}
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

export default UserNavbar;
