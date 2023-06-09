// libraries
import React, { useEffect, useState, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

//  css styling
import "../../stylesheet/Dashboard/Dashboard.css";
import "../../stylesheet/App.css";

// importing components
import Navbar from "../Navbar/Navbar";
import PieChart from "../Charts/PieChart";
import EmployeeLineChart from "../Charts/EmployeeLineChart";
import EmployeeBarChart from "../Charts/EmployeeBarChart";
import { EmployeeDoughnutChart } from "../Charts/EmployeeDoughnutChart";
import { ProjectStage } from "../Projects/ForAdmin/ToAddAProject/ProjectStage";
import EmpDashboardBlockSectionCarousel from "../Utility/EmpDashboardBlockSectionCarousel";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { ContextTheme } from "../../Context/ThemeContext";
import { Button } from "react-bootstrap";

export const EmployeeDashboard = ({ isOpen, setIsOpen }) => {
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
  const [pendingTasks, setPendingTasks] = useState([]);
  const [reviewTasks, setReviewTasks] = useState([]);
  const [allProjectsCount, setAllProjectsCount] = useState("");
  const [completedProjectsCount, setCompletedProjectsCount] = useState("");
  const [runningProjectsCount, setRunningProjectsCount] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");

  const [errorWorkMsg, setErrorWorkMsg] = useState("");
  const [shortWorkMsg, setShortWorkMsg] = useState("");
  const [longWorkMsg, setLongWorkMsg] = useState("");

  const [loading, setLoading] = useState(false);
  const [dummyState, setDummyState] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // to get all, completed, active projects of an employee
  useEffect(() => {
    if (LoginToken) {
      const url = `${mainUrl}/user/count-project-list-for-single-user/${newUserId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get all projects count of an employee (total projects, completed projects, active projects)
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
            setAllProjectsCount(result.count[0].all_project);
            setCompletedProjectsCount(result.count[0].completed);
            setRunningProjectsCount(result.count[0].running);
          }
        })
        .catch((error) => {
          // toast.error(error);
          ReactToastify(error, "error");
        });
    } else {
      // toast.error("Sorry you are not authorised, please login again");
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
    }
  }, []);

  // using this code we are getting all the pending tasks of the logged in user
  useEffect(() => {
    if (LoginToken) {
      const url = `${mainUrl}/task/list?task_status=Pending&login_user=${newUserId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get all pending tasks
      fetch(url, {
        method: "GET",
        headers: requestOptions,
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.error) {
            setPendingTasks([]);
          } else {
            setPendingTasks(result.data);
          }
        })
        .catch((error) => {
          // toast.error(error);
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
      // toast.error("Sorry you are not authorised, please login again");
    }
  }, []);

  // using this code we are getting all the reviewing tasks of the logged in user
  useEffect(() => {
    if (LoginToken) {
      const url = `${mainUrl}/task/list?task_status=Review&login_user=${newUserId}`;

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
            setReviewTasks([]);
          } else {
            setReviewTasks(result.data);
          }
        })
        .catch((error) => {
          // toast.error(error);
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
    }
  }, []);

  // This code was used to display Good Morning, Good Afternoon or evening on the right with username.
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const newUserName = userName.replace(/['"]+/g, "");
    setUsername(newUserName);

    const now = new Date();
    const hours = now.getHours();

    if (hours >= 0 && hours < 12) {
      setMessage("Good Morning, ");
    } else if (hours >= 12 && hours < 16) {
      setMessage("Good Afternoon, ");
    } else {
      setMessage("Good Evening, ");
    }
  }, []);

  // this code is used to submit the present work employee is working on
  const handleSubmitWork = (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }
    setIsSubmitting(true);

    if (LoginToken) {
      // setLoading(true);
      const url = `${mainUrl}/user/add-current-work`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      const data = {
        user_id: newUserId,
        task_short_description: shortDescription,
        task_long_description: longDescription,
      };

      //this fetch call is used to get reviewing tasks data
      fetch(url, {
        method: "POST",
        headers: requestOptions,
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.error) {
            ReactToastify(result.message, "error");
            // setLoading(false);
          } else {
            ReactToastify(result.message, "success");
            setLongDescription("");
            setShortDescription("");
            getWorkMsg();
            setIsSubmitting(false);
            setDummyState(!dummyState);
          }
        })
        .catch((error) => {
          // setLoading(false);
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
    }
  };

  const handleEdit = () => {
    setShortDescription(shortWorkMsg);
    setLongDescription(longWorkMsg);
  };

  // This API returns what employee is working on currently.
  const getWorkMsg = () => {
    if (LoginToken) {
      setLoading(true);
      const url = `${mainUrl}/user/get-my-current-work/${newUserId}`;

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
            setErrorWorkMsg(result.message);
            setLoading(false);
          } else {
            setErrorWorkMsg("");
            setShortWorkMsg(result.data[0].task_short_description);
            setLongWorkMsg(result.data[0].task_long_description);
            setLoading(false);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
          setLoading(false);
        });
    } else {
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
    }
  };

  useEffect(() => {
    getWorkMsg();
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* Header */}
      <PageHeader />
      {/* Main Content */}
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } dashboard ${isOpen ? "open" : ""}`}
      >
        <div className="employee__dashboard-main-content mt-2">
          <div className="employee__dashboard-left__content">
            <div
              className={`default-section-block ${
                toggleTheme ? "dark" : ""
              } employee__dashboard-left__content-top__div`}
            >
              <div className="text__content">
                <h5
                  className={`${
                    toggleTheme ? "dark-text-color" : "default-text-color"
                  }`}
                >
                  {message}
                  <span style={{ textTransform: "capitalize" }}>
                    {username}
                  </span>
                </h5>
                <p
                  className={`${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  {runningProjectsCount > 0
                    ? `you've been assigned with ${runningProjectsCount} projects ${
                        pendingTasks.length > 0
                          ? `& ${pendingTasks.length} tasks`
                          : ""
                      }`
                    : ""}
                </p>
                <Link
                  to="/projects/employee-projects"
                  className={`text__content-link ${toggleTheme ? "dark" : ""}`}
                >
                  View Projects
                </Link>
                <Link
                  to="/my-tasks"
                  className={`text__content-link ${toggleTheme ? "dark" : ""}`}
                >
                  View Tasks
                </Link>
              </div>
              <div className="blocks__section-content">
                <div className={`block-element ${toggleTheme ? "dark" : ""}`}>
                  <p
                    className={`block-element__title ${
                      toggleTheme ? "dark" : ""
                    }`}
                  >
                    All <br /> Projects
                  </p>
                  <p
                    className={`block-element__count ${
                      toggleTheme ? "dark" : ""
                    }`}
                  >
                    {allProjectsCount}
                  </p>
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/projects/employee-projects", {
                      state: {
                        location: location,
                        value: "active",
                      },
                    });
                  }}
                  className={`block-element ${toggleTheme ? "dark" : ""}`}
                >
                  <p
                    className={`block-element__title ${
                      toggleTheme ? "dark" : ""
                    }`}
                  >
                    Active <br /> Projects
                  </p>
                  <p
                    className={`block-element__count ${
                      toggleTheme ? "dark" : ""
                    }`}
                  >
                    {runningProjectsCount}
                  </p>
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate("/projects/employee-projects", {
                      state: {
                        location: location,
                        value: "completed",
                      },
                    });
                  }}
                  className={`block-element ${toggleTheme ? "dark" : ""}`}
                >
                  <p
                    className={`block-element__title ${
                      toggleTheme ? "dark" : ""
                    }`}
                  >
                    Completed <br /> Projects
                  </p>
                  <p
                    className={`block-element__count ${
                      toggleTheme ? "dark" : ""
                    }`}
                  >
                    {completedProjectsCount}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`default-section-block ${toggleTheme ? "dark" : ""} `}
            >
              <form
                onSubmit={handleSubmitWork}
                className="what-are-you-working-on"
              >
                <input
                  required
                  type="text"
                  className="short_description default-input-field"
                  placeholder="You're working on?"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
                <input
                  type="text"
                  required
                  className="long_description default-input-field"
                  placeholder="Please elaborate your work..."
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                />
                <Button
                  type="submit"
                  className="btn default-button what-are-you-working-on-button"
                >
                  Submit
                </Button>
              </form>

              {/* This Div shows the input value & need to make this field editablte */}
              <div className={`lineBreak ${toggleTheme ? "dark" : ""}`}></div>
              <div className="employee-working-on__div">
                {loading ? (
                  <TailSpin
                    height="35"
                    width="35"
                    color="#333"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                    wrapperClass="loader"
                    visible={true}
                  />
                ) : errorWorkMsg !== "" ? (
                  <p
                    className={`${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    }`}
                  >
                    {errorWorkMsg}
                  </p>
                ) : (
                  <>
                    <div
                      className={`${
                        toggleTheme ? "dark-text-color" : "default-text-color"
                      } work-description`}
                    >
                      <div className="work-icon">&#10148;</div>
                      <div className="work-description-text">
                        <span className="short-work-description">
                          {shortWorkMsg}
                        </span>
                        <span className="long-work-description">
                          {longWorkMsg}
                        </span>
                      </div>
                    </div>
                    <Button className="btn default-button" onClick={handleEdit}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div
              className={`default-section-block ${
                toggleTheme ? "dark" : ""
              } employee__dashboard-left__content-bottom__div`}
            >
              <div className="barChart">
                <EmployeeBarChart />
              </div>
            </div>
          </div>
          <div className="employee__dashboard-right__content">
            <div
              className={`default-section-block ${
                toggleTheme ? "dark" : ""
              } employee__dashboard-right__content-top__div`}
            >
              <div className="employee-doughnut-chart">
                <EmployeeDoughnutChart />
              </div>
            </div>
            <div
              className={`default-section-block ${
                toggleTheme ? "dark" : ""
              } employee__dashboard-right__content-bottom__div `}
            >
              <h5
                className={`projects__summary__header ${
                  toggleTheme ? "dark" : ""
                } employee__dashboard-title`}
              >
                Quick Links <i className="fas fa-link"></i>
              </h5>
              <div className="employee__dashboard-quick-links__blocks">
                <Link
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/projects/add-time-in-project"
                >
                  Add Time Entry
                </Link>
                <Link
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/assign-task"
                >
                  Assign a Task
                </Link>
                <Link
                  className={`quick-links__button ${
                    toggleTheme ? "dark" : ""
                  } employee__dashboard-quick-link`}
                  to="/my-profile"
                >
                  My Profile
                </Link>
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
