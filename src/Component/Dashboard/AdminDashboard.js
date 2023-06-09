// libraries
import React, { useEffect, useState, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import {
  useNavigate,
  Navigate,
  NavLink,
  Link,
  useLocation,
} from "react-router-dom";
import {} from "react-router-dom";

//  css styling
import "../../stylesheet/Dashboard/Dashboard.css";
import "../../stylesheet/App.css";

// importing components
import Navbar from "../Navbar/Navbar";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { ContextTheme } from "../../Context/ThemeContext";

export const AdminDashboard = ({ isOpen, setIsOpen }) => {
  // accessing login token from localstorage
  const navigate = useNavigate();
  const location = useLocation();
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  // states
  const [projectList, setProjectList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [employeesData, setEmployeesData] = useState([]);

  // used to get all the existing projects
  useEffect(() => {
    if (LoginToken) {
      setLoading(true);
      const url = `${mainUrl}/project`; // used to get all the existing projects

      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: newBearer,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          setLoading(false);
          if (result.error) {
            ReactToastify(result.message, "error");
          } else {
            const projects = result.data;
            setProjectList(projects);
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
  }, []);

  // function used to bifercate the project (running, onHold, Completed)
  const getProjects = (status) => {
    return projectList
      .reduce((acc, curr) => {
        if (curr.project_status === status) {
          acc = [...acc, curr];
        }
        return acc;
      }, [])
      .reverse();
  };

  // API for getting what employees are working on
  useEffect(() => {
    if (LoginToken) {
      const url = `${mainUrl}/user/get-current-work-by-employee/${newUserId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get reviewing tasks data
      fetch(url, {
        method: "GET",
        headers: requestOptions,
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.error) {
            ReactToastify(result.message, "error");
          } else {
            setEmployeesData(result.data);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
    }
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* Header */}
      <PageHeader />
      {/* Main content */}

      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } ${isOpen ? "open" : ""}`}
      >
        <div
          className={`mt-2 dashboard ${
            toggleTheme ? "dark" : ""
          }  admin-dashboard-page`}
        >
          {/* dashboard parent section */}
          <div className="dashboard__summary-parent__section">
            {/* Projects Count Section */}
            <div
              className={`default-section-block ${toggleTheme ? "dark" : ""}`}
            >
              <span
                className={`dashboard__summary-title ${
                  toggleTheme ? "dark" : ""
                }`}
              >
                Project Summary
              </span>
              <div className="dashboard__summary-block-parent">
                <div
                  className={`dashboard__summary-block ${
                    toggleTheme
                      ? "dashboard__summary-dark-theme-hover"
                      : "dashboard__summary-block__default-hover"
                  } all-projects-block`}
                >
                  <div className="summary-block__icon">
                    <i className="fas fa-clipboard-list dashboard-summary__icon"></i>
                  </div>
                  <div className="summary-block-content">
                    <div
                      className={`summary-block-content__title ${
                        toggleTheme ? "dark" : ""
                      }`}
                    >
                      Active Projects
                    </div>
                    <div
                      className={`summary-block-count ${
                        toggleTheme ? "dark" : ""
                      }`}
                    >
                      <span className="summary-block-count__number">
                        {getProjects("Running").length}
                      </span>
                      {/* <NavLink
                        to="/projects/existing-projects"
                        className={`summary-block-count__link ${
                          toggleTheme ? "dark" : ""
                        }`}
                      >
                        view all
                      </NavLink> */}
                      <p
                        className={`summary-block-count__link ${
                          toggleTheme ? "dark" : ""
                        }`}
                        onClick={() =>
                          navigate("/projects/existing-projects", {
                            state: {
                              status: "active",
                              location,
                            },
                          })
                        }
                      >
                        view all
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`dashboard__summary-block ${
                    toggleTheme
                      ? "dashboard__summary-dark-theme-hover"
                      : "dashboard__summary-block__default-hover"
                  } all-projects-block`}
                >
                  <div className="summary-block__icon">
                    <i className="fas fa-exclamation-circle file-icon dashboard-summary__icon"></i>
                  </div>
                  <div className="summary-block-content">
                    <div
                      className={`summary-block-content__title ${
                        toggleTheme ? "dark" : ""
                      }`}
                    >
                      On Halt Projects
                    </div>
                    <div
                      className={`summary-block-count ${
                        toggleTheme ? "dark" : ""
                      }`}
                    >
                      <span className="summary-block-count__number">
                        {getProjects("Hold").length}
                      </span>
                      {/* <NavLink
                        to="/projects/existing-projects"
                        className={`summary-block-count__link ${
                          toggleTheme ? "dark" : ""
                        }`}
                      >
                        view all
                      </NavLink> */}
                      <p
                        className={`summary-block-count__link ${
                          toggleTheme ? "dark" : ""
                        }`}
                        onClick={() =>
                          navigate("/projects/existing-projects", {
                            state: {
                              status: "halt",
                              location,
                            },
                          })
                        }
                      >
                        view all
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`dashboard__summary-block ${
                    toggleTheme
                      ? "dashboard__summary-dark-theme-hover"
                      : "dashboard__summary-block__default-hover"
                  } all-projects-block`}
                >
                  <div className="summary-block__icon">
                    <i className="fas fa-tasks dashboard-summary__icon"></i>
                  </div>
                  <div className="summary-block-content">
                    <div
                      className={`summary-block-content__title ${
                        toggleTheme ? "dark" : ""
                      }`}
                    >
                      Completed Projects
                    </div>
                    <div
                      className={`summary-block-count ${
                        toggleTheme ? "dark" : ""
                      }`}
                    >
                      <span className="summary-block-count__number">
                        {getProjects("Completed").length}
                      </span>
                      {/* <NavLink
                        to="/projects/existing-projects"
                        className={`summary-block-count__link ${
                          toggleTheme ? "dark" : ""
                        }`}
                      >
                        view all
                      </NavLink> */}
                      <p
                        className={`summary-block-count__link ${
                          toggleTheme ? "dark" : ""
                        }`}
                        onClick={() =>
                          navigate("/projects/existing-projects", {
                            state: {
                              status: "completed",
                              location,
                            },
                          })
                        }
                      >
                        view all
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Table section */}
          <div className="dashboard__active-projects__completed-projects">
            {/* Active projects section */}
            <div
              className={`default-section-block ${toggleTheme ? "dark" : ""}`}
            >
              <div>
                <h5
                  className={`projects__summary__header ${
                    toggleTheme ? "dark" : ""
                  }`}
                >
                  Active Projects <i className="bi bi-gear loop"></i>
                </h5>

                <div>
                  {getProjects("Running").length > 0 ? (
                    <>
                      <table className="table">
                        <thead>
                          <tr
                            className={`dashboard-projects-table__heading ${
                              toggleTheme ? "dark-text-color" : ""
                            }`}
                          >
                            <th>Project. Id</th>
                            <th>Project Name</th>
                          </tr>
                        </thead>
                        {loading ? (
                          <TailSpin
                            height="50"
                            width="50"
                            color="#333"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{
                              position: "absolute",
                              width: "97%",
                              height: "15vh",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            wrapperClass="loader"
                            visible={true}
                          />
                        ) : (
                          <tbody>
                            {getProjects("Running")
                              .slice(0, 10)
                              .reverse()
                              ?.map((project) => {
                                return (
                                  <tr
                                    className={`dashboard-projects-table__values ${
                                      toggleTheme
                                        ? "dark-sub-text-color"
                                        : "default-text-color"
                                    }`}
                                    key={project.project_id}
                                  >
                                    <td>
                                      {project.project_no !== ""
                                        ? project.project_no
                                        : "N/A"}
                                    </td>
                                    <td title={project.project_name}>
                                      {project.project_name.length > 40
                                        ? `${
                                            project.project_name.slice(0, 40) +
                                            "..."
                                          }`
                                        : project.project_name}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        )}
                      </table>
                      {getProjects("Running").length > 10 ? (
                        <NavLink
                          to="/projects/existing-projects"
                          className="summary-block-count__link check__all__projects"
                        >
                          view all
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <>
                      <p>There are 0 projects in active status currently</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            {/* Completed projects section */}
            <div
              className={`default-section-block ${toggleTheme ? "dark" : ""}`}
            >
              <div>
                <h5
                  className={`projects__summary__header ${
                    toggleTheme ? "dark" : ""
                  }`}
                >
                  Completed Projects <i className="bi bi-check-circle"></i>
                </h5>

                <div>
                  {getProjects("Completed").length > 0 ? (
                    <>
                      <table className="table">
                        <thead>
                          <tr
                            className={`dashboard-projects-table__heading ${
                              toggleTheme ? "dark-text-color" : ""
                            }`}
                          >
                            <th>Project. Id</th>
                            <th>Project Name</th>
                          </tr>
                        </thead>
                        {loading ? (
                          <TailSpin
                            height="50"
                            width="50"
                            color="#333"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{
                              position: "absolute",
                              width: "97%",
                              height: "15vh",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            wrapperClass="loader"
                            visible={true}
                          />
                        ) : (
                          <tbody>
                            {getProjects("Completed")
                              .slice(0, 10)
                              .reverse()
                              .map((project) => (
                                <tr
                                  className={`dashboard-projects-table__values ${
                                    toggleTheme
                                      ? "dark-sub-text-color"
                                      : "default-text-color"
                                  }`}
                                  key={project.project_id}
                                >
                                  <td>
                                    {project.project_no !== ""
                                      ? project.project_no
                                      : "N/A"}
                                  </td>
                                  <td title={project.project_name}>
                                    {project.project_name.length > 40
                                      ? `${
                                          project.project_name.slice(0, 40) +
                                          "..."
                                        }`
                                      : project.project_name}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        )}
                      </table>
                      {getProjects("Completed").length > 10 ? (
                        <NavLink
                          to="/projects/existing-projects"
                          className="summary-block-count__link check__all__projects"
                        >
                          view all
                        </NavLink>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <p
                      className={`${
                        toggleTheme
                          ? "dark-sub-text-color"
                          : "default-text-color"
                      }`}
                    >
                      None of the projects are fully completed yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick links section */}
          <div className="Admin-dashboard__employees-working-on_quick-links">
            <div
              className={`default-section-block dashboard__employees-working-on ${
                toggleTheme ? "dark" : ""
              }`}
            >
              <>
                {employeesData?.length > 0 ? (
                  <table className="table employee-working-on-table">
                    <thead>
                      <tr
                        className={`dashboard-projects-table__heading bg-red ${
                          toggleTheme ? "dark-text-color" : ""
                        }`}
                      >
                        <th>Name</th>
                        <th>Working on...</th>
                      </tr>
                    </thead>
                    {loading ? (
                      <TailSpin
                        height="50"
                        width="50"
                        color="#333"
                        ariaLabel="tail-spin-loading"
                        radius="1"
                        wrapperStyle={{
                          position: "absolute",
                          width: "97%",
                          height: "15vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        wrapperClass="loader"
                        visible={true}
                      />
                    ) : (
                      <tbody>
                        {employeesData.map((employee) => {
                          const {
                            id,
                            insert_date,
                            task_long_description,
                            task_short_description,
                            username,
                            user_id,
                          } = employee;

                          return (
                            <tr
                              className={`dashboard-projects-table__values ${
                                toggleTheme
                                  ? "dark-sub-text-color"
                                  : "default-text-color"
                              }`}
                              key={id}
                            >
                              <td>{username}</td>
                              <td className="employee-description">
                                <span
                                  className={`employee-short__description ${
                                    toggleTheme
                                      ? "dark-sub-text-color"
                                      : "default-text-color"
                                  }`}
                                >
                                  {task_short_description}
                                </span>
                                <span
                                  className={`employee-long-description ${
                                    toggleTheme
                                      ? "dark-sub-text-color"
                                      : "default-text-color"
                                  }`}
                                >
                                  {task_long_description}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
                  </table>
                ) : (
                  <p
                    className={`${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    Please request your staff to input their current work 😟
                  </p>
                )}
              </>
            </div>
            <div
              className={`default-section-block  ${
                toggleTheme ? "dark" : ""
              } dashboard__quick-links`}
            >
              <h5
                className={`projects__summary__header ${
                  toggleTheme ? "dark" : ""
                } employee__dashboard-title`}
              >
                Quick Links <i className="fas fa-link"></i>
              </h5>
              <div className="admin__dashboard-quick-links__blocks">
                <NavLink
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/projects/existing-projects"
                >
                  Create a Project
                </NavLink>
                <NavLink
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/projects/assign-project"
                >
                  Assign a Project
                </NavLink>
                <NavLink
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/assign-task"
                >
                  Assign a Task
                </NavLink>
                <NavLink
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/users/all/add-new-user"
                >
                  Add new User
                </NavLink>
                <NavLink
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/add-holiday"
                >
                  Add holiday
                </NavLink>
                {/* <NavLink
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/add-project-category"
                >
                  Add Project Category
                </NavLink>
                <NavLink
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/add-employee-job-role"
                >
                  Add Employee Job Role
                </NavLink> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <PageFooter />
    </>
  );
};
