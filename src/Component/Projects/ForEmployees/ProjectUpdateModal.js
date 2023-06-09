// libraries
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";

// styling
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../stylesheet/Projects/ProjectUpdateModal.css";

// component
import { UserContext } from "../../../Context/UserContext";
import ReactToastify from "../../Utility/ReactToastify";
import { Button } from "react-bootstrap";

const ProjectUpdateModal = ({ projectData, setProjectUpdated }) => {
  const mainUrl = useContext(UserContext);

  // for project stage
  const [selectedProjectStageOption, setSelectedProjectStageOption] =
    useState("");
  const projectStageOptions = [
    { value: "20", label: "20%" },
    { value: "40", label: "40%" },
    { value: "60", label: "60%" },
    { value: "80", label: "80%" },
    { value: "100", label: "100%" },
  ];

  const handleSubmit = () => {
    const LoginToken = localStorage.getItem("LoginToken");

    if (LoginToken) {
      const bearer = "Bearer " + LoginToken;
      const newBearer = bearer.replace(/['"]+/g, "");
      const userId = localStorage.getItem("userId");
      const newUserId = userId.replace(/['"]+/g, "");

      const data = {
        project_id: projectData.Project_id, // project id
        user_id: newUserId, // user id
        project_stage: selectedProjectStageOption,
      };

      const url = `${mainUrl}/project/project-stage`;
      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      if (selectedProjectStageOption === "") {
        ReactToastify("Cannot set null value", "error");
      } else {
        // this fetch is used for partial updating a particular project
        fetch(url, {
          method: "PATCH",
          headers: requestOptions,
          body: JSON.stringify(data),
        })
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            if (result.error) {
              result.message.name
                ? ReactToastify(result.message.name, "error")
                : ReactToastify(result.message, "error");
            } else {
              ReactToastify(result.message, "success");
              setProjectUpdated((prev) => !prev);
            }
          })
          .catch((error) => {
            ReactToastify(error, "error");
          });
      }
    }
  };

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal1-${projectData.Project_id}`}
      >
        <i className="bi bi-pencil-fill"></i>
      </Button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal1-${projectData.Project_id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        {/* <form onSubmit={handleSubmit}> */}
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5 default-text-color"
                id="exampleModalLabel"
              >
                Update Project
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body default-text-color project-update-modal__body">
              {/* Project Name input */}
              <div className="project-update-modal__input-div">
                <label className="default-label">Project Name:</label>
                <input
                  className="form-control default__input default-text-color"
                  type="text"
                  disabled
                  id="projectName"
                  value={projectData.Project_name}
                />
              </div>

              {/* Project stage dropdown input */}
              <div className="project-update-modal__input-div">
                <label className="default-label" htmlFor="projectStatus">
                  Project Stage:
                </label>
                <select
                  className="form-control default__input default-text-color"
                  value={selectedProjectStageOption}
                  onChange={(e) => {
                    setSelectedProjectStageOption(e.target.value);
                  }}
                >
                  <option value="">Set Project Stage...</option>
                  {projectStageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* footer */}
            <div className="modal-footer">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn default-button"
                data-bs-dismiss="modal"
              >
                Save
              </button>
            </div>
          </div>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};

export default ProjectUpdateModal;
