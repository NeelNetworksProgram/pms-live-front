// libraries
import React, { useContext, useEffect, useState } from "react";
import ReactToastify from "../Utility/ReactToastify";
import { TailSpin } from "react-loader-spinner";

// images
import projectImg from "../../images/project.png";
import taskUpdatedImg from "../../images/taskUpdated.png";
import newTaskImg from "../../images/newTask.png";
import taskSubmissionImg from "../../images/taskSubmission.png";
import projectDeallocatedImg from "../../images/projectDeallocated.png";
import newProjectImg from "../../images/newProject.png";

// component
import Navbar from "../Navbar/Navbar";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { UserContext } from "../../Context/UserContext";
import { ContextTheme } from "../../Context/ThemeContext";
import { formatDateTime } from "../Utility/formatDateTime";

// styling
import "../../stylesheet/Pages/AllNotifications.css";

export const AllNotifications = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  // fetching logged in user login token
  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // fetching logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // used to get all notifications
  const getNotifications = () => {
    if (LoginToken) {
      setLoading(true);
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
          setLoading(false);
          if (result.error) {
            ReactToastify(result.message, "error");
          } else {
            setNotifications(result.notification.reverse());
          }
        })
        .catch((error) => {
          setLoading(false);
          ReactToastify(error, "error");
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

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <PageHeader />
      {/* Main Content */}
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } ${isOpen ? "open" : ""}`}
      >
        <div className="all-notifications-page">
          <div
            className={`default-section-block ${
              toggleTheme ? "dark" : ""
            } mt-2`}
          >
            <div
              className={`all-notifications-header ${
                toggleTheme ? "dark" : ""
              }`}
            >
              <h4>All Notifications</h4>
              <span>
                <i className="fa-solid fa-bell all-notifications-icon"></i>
              </span>
            </div>
          </div>

          <div>
            {loading ? (
              <TailSpin
                height="80"
                width="80"
                color="#333"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{
                  position: "absolute",
                  width: "97%",
                  height: "50vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                wrapperClass="loader"
                visible={true}
              />
            ) : notifications.length >= 1 ? (
              <ul className="all-notifications-ul">
                {notifications.map((ele) => {
                  return (
                    <li
                      key={ele.id}
                      className={`default-section-block ${
                        toggleTheme ? "dark" : ""
                      } notification-elements`}
                    >
                      <div className="notification-image">
                        {ele.notification_for === "Project Submission" ? (
                          <img
                            className="notification-img projectImg"
                            src={projectImg}
                            alt="project submission image"
                          />
                        ) : ele.notification_for === "Task Updated" ? (
                          <img
                            className="notification-img taskImg"
                            src={taskUpdatedImg}
                            alt="task updated image"
                          />
                        ) : ele.notification_for === "New Task" ? (
                          <img
                            className="notification-img taskImg"
                            src={newTaskImg}
                            alt="new task image"
                          />
                        ) : ele.notification_for === "Task Submission" ? (
                          <img
                            className="notification-img taskImg"
                            src={taskSubmissionImg}
                            alt="task submission image"
                          />
                        ) : ele.notification_for === "Project Deallocation" ? (
                          <img
                            className="notification-img taskImg"
                            src={projectDeallocatedImg}
                            alt="project deallocated image"
                          />
                        ) : ele.notification_for === "New Project" ? (
                          <img
                            className="notification-img taskImg"
                            src={newProjectImg}
                            alt="project deallocated image"
                          />
                        ) : (
                          "No Image"
                        )}
                      </div>
                      <div className="notification-content">
                        <p
                          className={`notification-content__title ${
                            toggleTheme
                              ? "dark-text-color"
                              : "default-text-color"
                          }`}
                        >
                          <span className="font-weight-bold">Title:</span>{" "}
                          {ele.notification_for}
                        </p>
                        <p
                          className={`notification-content__message ${
                            toggleTheme
                              ? "dark-sub-text-color"
                              : "default-text-color"
                          }`}
                        >
                          <span className="font-weight-bold">Message:</span>{" "}
                          {ele.notification_message}
                        </p>
                        <p
                          className={`notification-content__time  ${
                            toggleTheme
                              ? "dark-sub-text-color"
                              : "default-text-color"
                          }`}
                        >
                          <span className="font-weight-bold">Date:</span>{" "}
                          {formatDateTime(ele.created_at)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div
                className={`default-section-block ${toggleTheme ? "dark" : ""}`}
              >
                <p
                  className={`${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  You do not have any Notifications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <PageFooter />
    </>
  );
};
