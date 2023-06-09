// libraries
import React, { useState, useContext } from "react";
import { ContextTheme } from "../../../Context/ThemeContext";

// styling
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../stylesheet/Projects/AssignProjectUsersModal.css";

// ----------  MAIN COMPONENT -----------------------
const UsersInProjectModal = ({ employees, projectName }) => {
  const { toggleTheme } = useContext(ContextTheme);

  return (
    <div>
      {/* Button trigger modal started */}
      <i
        className={`fa-solid fa-circle-plus plus-symbol ${
          toggleTheme ? "dark" : ""
        }`}
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-`}
        title="check users"
      ></i>

      {/* <!-- Modal --> */}
      <div
        className={`modal fade`}
        id={`exampleModal-`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog assign-project-users-modal-dialog">
          <div className="modal-content assign-project-users-modal-content">
            <div className="modal-header assign-project-users-modal-header">
              <h1
                className="modal-title fs-5 default-text-color"
                id="exampleModalLabel"
              >
                "{projectName}" Project Details
              </h1>
              <button
                type="button"
                id="close__assign-project__modal"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div
              className="modal-body default-text-color"
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p className="assign-project-users-modal-heading">
                Employee's List:-
              </p>
              <div className="getResults">
                {employees.map((user, index) => {
                  return (
                    <p className="users-p" key={index}>
                      <span>
                        {index + 1}) Employee name: {user}
                      </span>
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersInProjectModal;
