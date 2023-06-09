// libraries
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

// component
import Navbar from "../Navbar/Navbar";
import Profile from "../Profile/Profile";
import TasksNavbar from "./TasksNavbar";
import { PendingTasks } from "./PendingTasks";
import { CompletedTasks } from "./CompletedTasks";
import { ReviewingTasks } from "./ReviewingTasks";
import { ContextTheme } from "../../Context/ThemeContext";

// styling
import "../../stylesheet/Tasks/MyTasks.css";
import "../../stylesheet/App.css";
import { CreatedTasks } from "./CreatedTasks";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { Button } from "react-bootstrap";

export const MyTasks = ({ isOpen, setIsOpen }) => {
  const { toggleTheme } = useContext(ContextTheme);

  const [activeTask, setActiveTask] = useState("Created");

  // fetching logged in user role
  const userRole = localStorage.getItem("userRole");
  const newUserRole = userRole.replace(/['"]+/g, "");

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* heading content */}
      <PageHeader />
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } ${isOpen ? "open" : ""}`}
      >
        <div className="mt-2 mytasks-page">
          <div className={`default-section-block ${toggleTheme ? "dark" : ""}`}>
            {/* Heading section */}
            <div className="my-tasks-header">
              <div className="my-tasks-heading">
                <h3
                  className={`${
                    toggleTheme ? "dark-text-color" : "default-text-color"
                  }`}
                >
                  All Tasks{" "}
                </h3>
                <i className="fa-solid fa-code my-tasks-count"></i>
              </div>

              {/* assign a task */}
              <Link to="/assign-task" className="assign-task-button">
                <Button className="btn default-button">Assign a task</Button>
              </Link>
            </div>
            {newUserRole === "admin" || newUserRole === "manager" ? (
              ""
            ) : (
              <div>
                <TasksNavbar
                  setActiveTask={setActiveTask}
                  activeTask={activeTask}
                />
              </div>
            )}
          </div>

          {newUserRole === "admin" || newUserRole === "manager" ? (
            <div
              className={`default-section-block ${toggleTheme ? "dark" : ""} `}
            >
              <div className="my-tasks-content">
                <div className="task-container">
                  <CreatedTasks />
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`default-section-block ${toggleTheme ? "dark" : ""}`}
            >
              <div className="my-tasks-content">
                <div className="task-container">
                  {activeTask === "Created" && <CreatedTasks />}
                  {activeTask === "Pending" && <PendingTasks />}
                  {activeTask === "Completed" && <CompletedTasks />}
                  {activeTask === "Reviewing" && <ReviewingTasks />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <PageFooter />
    </>
  );
};
