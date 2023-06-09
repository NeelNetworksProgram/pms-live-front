// libraries
import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate, Link, Navigate } from "react-router-dom";
import { Button } from "react-bootstrap";

// components
import logo from "../../images/neel-networks-logo.svg";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "./ReactToastify";
import { ContextTheme } from "../../Context/ThemeContext";
import { formatDateTime } from "../Utility/formatDateTime";

// styling
import "../../stylesheet/App.css";

export const PageHeader = () => {
  const navigate = useNavigate();
  const mainUrl = useContext(UserContext);
  const { toggleTheme, handleTheme } = useContext(ContextTheme);

  // fetching logged in user login token
  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // fetching logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  // states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // const [toggleTheme, setToggleTheme] = useState(false);

  const handleSignOut = () => {
    localStorage.clear();
    window.location.reload();
    // navigate("/");
  };

  const userName = localStorage.getItem("userName");
  const newUserName = userName.replace(/['"]+/g, "");

  // toggling notifications list
  const handleNotifications = () => {
    setShowNotifications((prev) => !prev);
    updateNotifications();
  };

  // used to get all notifications
  const getNotifications = () => {
    if (LoginToken) {
      const url = `${mainUrl}/user/all-notifications/${newUserId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get all notifications for the logged in user
      fetch(url, {
        method: "GET",
        headers: requestOptions,
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (!result.error) {
            setNotifications(result.notification.reverse());
          }
        })
        .catch((error) => {
          // ReactToastify(error, "error");
          //console.log(error);
        });
    } else {
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  // updating notifications (mark as read)
  const updateNotifications = () => {
    if (LoginToken) {
      const url = `${mainUrl}/user/update-notifications/${newUserId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      const isReadId = notifications
        .filter((ele) => ele.is_read === "no") //.slice(0, 5)
        .reduce((acc, curr) => `${acc + curr.id},`, "");
      // console.log(isReadId.slice(0, isReadId.length - 1));

      const data = {
        notification_id: isReadId,
      };

      //this fetch call is used to get all notifications for the logged in user
      fetch(url, {
        method: "PATCH",
        headers: requestOptions,
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          // console.log(result);
        })
        .catch((error) => {
          // ReactToastify(error, "error");
          //console.log(error);
        });
    } else {
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
    }
  };

  // function for formatting the Data & time inside Comments
  // const formatingDate = (input) => {
  //   // Create a new Date object from the input string
  //   const dateObj = new Date(input);
  //   // Format the date in dd/mm/yyyy format
  //   const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}/${(
  //     dateObj.getMonth() + 1
  //   )
  //     .toString()
  //     .padStart(2, "0")}/${dateObj.getFullYear()}`;

  //   // Format the time in hh:mm AM/PM format
  //   const hours = dateObj.getHours();
  //   const minutes = dateObj.getMinutes();
  //   const formattedTime = `${hours % 12 === 0 ? 12 : hours % 12}:${minutes
  //     .toString()
  //     .padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;

  //   // Output the formatted date and time
  //   const DateTime = `${formattedDate} | ${formattedTime}`;
  //   return DateTime;
  // };

  // Original One dont touch
  const NotificationsListBox = () => {
    return (
      <>
        <i
          className={`fa-solid fa-bell notification-icon ${
            toggleTheme ? "dark" : ""
          }`}
          onClick={handleNotifications}
        >
          {notifications.filter((ele) => ele.is_read === "no").length > 0 ? (
            <span className="all-notifications-count">
              {notifications.filter((ele) => ele.is_read === "no").length}
            </span>
          ) : (
            ""
          )}
        </i>
        {showNotifications ? (
          <div
            className="notifications-list"
            style={{
              overflowY:
                notifications.filter((ele) => ele.is_read === "no").length < 3
                  ? "hidden"
                  : "scroll",
            }}
          >
            <div className="notifications-list__header default-bg-color">
              <p>Notifications List</p>
            </div>
            <div className="notifications-list__content">
              <ul>
                {notifications.filter((ele) => ele.is_read === "no").length <
                1 ? (
                  <p className="zero-notifications-msg">No new notifications</p>
                ) : (
                  notifications
                    .filter((ele) => ele.is_read === "no")
                    .map((ele) => {
                      return (
                        <li className="notfications-list__li" key={ele.id}>
                          <p className="notfications-list__li-title">
                            {ele.notification_for}
                          </p>
                          <p className="notfications-list__li-sub-title">
                            {ele.notification_message}
                          </p>
                          <p className="notfications-list__li-time">
                            {formatDateTime(ele.created_at)}
                          </p>
                        </li>
                      );
                    })
                )}
              </ul>
              <div className="view-all-notifications">
                <Link
                  to="/all-notifications"
                  className="view-all-notifications-link"
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    );
  };
  // Original One dont touch

  const NotificationsModal = () => {
    return (
      <>
        {/* <!-- Button trigger modal --> */}
        <i
          data-toggle="modal"
          data-target="#notificationsModal"
          className={`fa-solid fa-bell notification-icon ${
            toggleTheme ? "dark" : ""
          }`}
          onClick={handleNotifications}
        >
          {notifications.filter((ele) => ele.is_read === "no").length > 0 ? (
            <span className="all-notifications-count">
              {notifications.filter((ele) => ele.is_read === "no").length}
            </span>
          ) : (
            ""
          )}
        </i>

        {/* <!-- Modal --> */}
        <div
          className="modal fade"
          id="notificationsModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className={`modal-title`}
                  style={{ color: "#000" }}
                  id="exampleModalLabel"
                >
                  Notifications List
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div
                className={`modal-body notifications_list `}
                style={{ color: "#000" }}
              >
                <div>
                  <div className="notifications-list__content">
                    <ul>
                      {notifications.filter((ele) => ele.is_read === "no")
                        .length <= 0 ? (
                        <p className="zero-notifications-msg">
                          No new notifications
                        </p>
                      ) : (
                        notifications
                          .filter((ele) => ele.is_read === "no")
                          .map((ele) => {
                            return (
                              <li
                                className="notfications-list__li"
                                key={ele.id}
                              >
                                <p className="notfications-list__li-title">
                                  {ele.notification_for}
                                </p>
                                <p className="notfications-list__li-sub-title">
                                  {ele.notification_message}
                                </p>
                                <p className="notfications-list__li-time">
                                  {formatDateTime(ele.created_at)}
                                </p>
                              </li>
                            );
                          })
                      )}
                    </ul>
                    <p
                      className="view-all-notifications-link"
                      onClick={() => navigate("/all-notifications")}
                      data-dismiss="modal"
                    >
                      View All Notifications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className={`default__heading ${toggleTheme ? "dark" : ""}`}>
      <NavLink to="/" className="logo">
        <img src={logo} className="pms__logo" alt="Neel Networks Logo" />
      </NavLink>

      <span className="profile">
        <div>
          <span className="toggle-theme">
            {toggleTheme ? (
              <i onClick={handleTheme} className="fa-solid fa-moon moon"></i>
            ) : (
              <i onClick={handleTheme} className="fa-solid fa-sun sun"></i>
            )}
          </span>

          {/* --------------------- */}
          <NotificationsModal />
          {/* --------------------- */}

          {/* original */}
          {/* <NotificationsListBox /> */}
        </div>
        <div className="profile-navbar">
          <span className="user-name">
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
      </span>
    </div>
  );
};
