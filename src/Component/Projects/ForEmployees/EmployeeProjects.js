// libraries
import React, { useState, useEffect, useContext } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useLocation } from "react-router-dom";

// components
import Navbar from "../../Navbar/Navbar";
import { UserContext } from "../../../Context/UserContext";
import ReactToastify from "../../Utility/ReactToastify";
import { PageHeader } from "../../Utility/PageHeader";
import { PageFooter } from "../../Utility/PageFooter";
import { AllProjects } from "./ProjectInnerPages/AllProjects";
import { ActiveProjects } from "./ProjectInnerPages/ActiveProjects";
import { EmployeeCompletedProjects } from "./ProjectInnerPages/EmployeeCompletedProjects";
import { ContextTheme } from "../../../Context/ThemeContext";

// styling
import "../../../stylesheet/Projects/EmployeeProjects.css";

export const EmployeeProjects = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("");

  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);
  const [loading, setLoading] = useState(false);

  const LoginToken = localStorage.getItem("LoginToken"); // login JWT token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const userId = localStorage.getItem("userId"); // logged in userId
  const newUserId = userId.replace(/['"]+/g, "");

  // states
  const [projectList, setProjectList] = useState([]); // all the assigned projects are stored in here
  const [message, setMessage] = useState(""); // used to store the response msg
  const [projectUpdated, setProjectUpdated] = useState(false);

  useEffect(() => {
    if (
      location?.state?.location?.pathname === "/home" &&
      location?.state?.value === "completed"
    ) {
      setSelectedTab("completed");
    } else {
      setSelectedTab("active");
    }
  }, []);

  //getting all the projects list for the logged in user
  const getProjectsData = () => {
    if (LoginToken) {
      const url = `${mainUrl}/user/all-assign-project-list-for-single-user/${newUserId}`;
      setLoading(true);
      // used for getting overall assigned projects list
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
            setProjectList([]);
            setMessage(result.message);
          } else {
            setProjectList(result.project_list);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
      localStorage.clear();
    }
  };

  useEffect(() => {
    getProjectsData();
  }, [projectUpdated]);

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <PageHeader />
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } ${isOpen ? "open" : ""}`}
      >
        {/* tabs section for active, completed, all projects */}
        <div
          className={`mt-2 default-section-block ${toggleTheme ? "dark" : ""}`}
        >
          <div className="employee-projects__tabs">
            <div
              className={` employee-projects__tabs-headings ${
                toggleTheme ? "dark-text-color" : "default-text-color"
              }`}
            >
              <p
                onClick={() => setSelectedTab("active")}
                style={{
                  fontWeight: `${selectedTab === "active" ? "700" : "500"}`,
                }}
              >
                Active Projects
              </p>
              <p
                onClick={() => setSelectedTab("completed")}
                style={{
                  fontWeight: `${selectedTab === "completed" ? "700" : "500"}`,
                }}
              >
                Completed Projects
              </p>
            </div>
            <div className="employee-projects__tabs-content">
              {selectedTab === "active" ? (
                <ActiveProjects
                  setLoading={setLoading}
                  loading={loading}
                  setProjectUpdated={setProjectUpdated}
                  onlyActiveProjects={projectList.filter(
                    (project) => project.project_completed === "no"
                  )}
                />
              ) : (
                <EmployeeCompletedProjects
                  loading={loading}
                  onlyCompletedProjects={projectList.filter(
                    (project) => project.project_status === "Completed"
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </>
  );
};
