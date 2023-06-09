// libraries
import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";

// styling
import "bootstrap/dist/css/bootstrap.min.css";

// component
import { UserContext } from "../../../../Context/UserContext";
import ReactToastify from "../../../Utility/ReactToastify";

const UpdateProjectModal = ({ setProjectNameUpdated, updateProjectdata }) => {
  const mainUrl = useContext(UserContext);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");

  // for project status
  const [selectedProjectStatusOption, setSelectedProjectStatusOption] =
    useState("");

  const projectStatusOptions = [
    { value: "Running", label: "Running" },
    { value: "Completed", label: "Completed" },
    { value: "Hold", label: "Hold" },
  ];

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

  // when any project edit btn is clicked we will get these data from backend
  const handleEdit = (data) => {
    setProjectId(data.project_id);
    setProjectName(data.project_name);
    setSelectedProjectStatusOption(data.project_status);
    setSelectedProjectStageOption(data.project_stage);
  };

  const handleSubmit = () => {
    const LoginToken = localStorage.getItem("LoginToken");

    if (LoginToken) {
      const bearer = "Bearer " + LoginToken;
      const newBearer = bearer.replace(/['"]+/g, "");
      const userId = localStorage.getItem("userId");
      const newUserId = userId.replace(/['"]+/g, "");

      const data = {
        id: projectId, // project id
        name: projectName, // project name
        user_id: newUserId, // user id
        project_status: selectedProjectStatusOption, // project status
        project_stage: selectedProjectStageOption,
      };

      const url = `${mainUrl}/project`;
      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      if (
        selectedProjectStatusOption === "" ||
        selectedProjectStageOption === ""
      ) {
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
              setProjectNameUpdated((prev) => !prev);
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
        onClick={() => handleEdit(updateProjectdata)}
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${updateProjectdata.project_id}`}
      >
        <i className="bi bi-pencil-fill"></i>
      </Button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal-${updateProjectdata.project_id}`}
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
              {/* Project Name input */}
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <label
                  className="default-label"
                  style={{ margin: "auto" }}
                  htmlFor="projectName"
                >
                  Project Name:
                </label>
                <input
                  className="form-control default__input default-text-color"
                  type="text"
                  disabled
                  id="projectName"
                  style={{
                    width: "70%",
                    cursor: "not-allowed",
                  }}
                  value={projectName}
                />
              </div>

              {/* Project status dropdown input */}
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <label
                  className="default-label"
                  style={{ margin: "auto" }}
                  htmlFor="projectStatus"
                >
                  Project Status:
                </label>
                <select
                  className="form-control default__input default-text-color"
                  style={{
                    width: "70%",
                  }}
                  value={selectedProjectStatusOption}
                  onChange={(e) => {
                    setSelectedProjectStatusOption(e.target.value);
                  }}
                >
                  <option value="">Set Project status...</option>
                  {projectStatusOptions.map((option) => (
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

export default UpdateProjectModal;
