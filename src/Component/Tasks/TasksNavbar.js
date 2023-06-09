// libraries
import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

// component

// styling
import "../../stylesheet/Tasks/TasksNavbar.css";
import { Button } from "react-bootstrap";

function TasksNavbar({ setActiveTask }) {
  return (
    <Navbar className="taskNavbar">
      <Container>
        <Navbar.Collapse>
          <Button
            onClick={() => setActiveTask("Created")}
            className="btn default-button tasks-navbar-nav-link"
          >
            Created Tasks
            {/* <span className="tasks-navbar-span-count">0</span> */}
          </Button>
        </Navbar.Collapse>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <div className="">
            <Button
              onClick={() => setActiveTask("Pending")}
              className="btn default-button tasks-navbar-nav-link"
            >
              Pending Tasks
              {/* <span className="tasks-navbar-span-count">1</span> */}
            </Button>
            <Button
              onClick={() => setActiveTask("Reviewing")}
              className="btn default-button tasks-navbar-nav-link"
            >
              Reviewing Tasks
              {/* <span className="tasks-navbar-span-count">2</span> */}
            </Button>
            <Button
              onClick={() => setActiveTask("Completed")}
              className="btn default-button tasks-navbar-nav-link"
            >
              Completed Tasks
              {/* <span className="tasks-navbar-span-count">1</span> */}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TasksNavbar;
