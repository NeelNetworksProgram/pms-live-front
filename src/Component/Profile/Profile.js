// libraries
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

// styling
import "../../stylesheet/Profile/Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
  };

  const userName = localStorage.getItem("userName");
  const newUserName = userName.replace(/['"]+/g, "");

  return (
    <>
      <div className="profile-navbar">
        {/* Hello, */}
        <span className="user">
          {newUserName} <i className="fas fa-sort-down sort-down-icon"></i>
        </span>
        <div className="profile-navbar-dropdown">
          <NavLink to="/my-profile" className="profile-navbar-dropdown-span">
            <span className="profile-link-span">Profile</span>
          </NavLink>
          <button
            className="profile-navbar-dropdown-span logout-button"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
