// libraries
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";

// styling
import "bootstrap/dist/css/bootstrap.min.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { Button } from "react-bootstrap";

const UpdateTaskModal = ({
  updateTaskModalData,
  taskUpdated,
  setTaskUpdated,
}) => {
  const mainUrl = useContext(UserContext);

  // const [projectId, setProjectId] = useState("");
  // const [projectName, setProjectName] = useState("");

  // for project status
  const [selectedTaskStatusOption, setSelectedTaskStatusOption] = useState("");

  const taskStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  // when any project edit btn is clicked we will get these data from backend
  const handleEdit = (task_id, name, status, stage) => {
    // console.log(updateTaskModalData);
  };

  const handleSubmit = () => {
    const LoginToken = localStorage.getItem("LoginToken");

    if (LoginToken) {
      if (!selectedTaskStatusOption) {
        ReactToastify(
          "Please select an option from Task Status options",
          "error"
        );
      } else {
        const bearer = "Bearer " + LoginToken;
        const newBearer = bearer.replace(/['"]+/g, "");
        const userId = localStorage.getItem("userId");
        const newUserId = userId.replace(/['"]+/g, "");

        const url = `${mainUrl}/task/update-task/${newUserId}/${updateTaskModalData.task_id}/${selectedTaskStatusOption}`;
        const requestOptions = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: newBearer,
        };

        // this fetch is used for updating a particular task
        fetch(url, {
          method: "PUT",
          headers: requestOptions,
        })
          .then((response) => {
            // console.log("response");
            // console.log(response);
            return response.json();
          })
          .then((result) => {
            // console.log("result");
            console.log(result);
            if (result.error) {
              ReactToastify(result.message, "error");
            } else {
              ReactToastify(result.message, "success");
              setTaskUpdated((prev) => !prev);
            }
          })
          .catch((error) => {
            ReactToastify(error, "error");
          });
      }
    } else {
      localStorage.clear();
      ReactToastify("Something went wrong please login again!", "error");
    }
  };

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        onClick={() => handleEdit()} //id, name, status, stage
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal1-${updateTaskModalData.task_id}`}
      >
        <i className="bi bi-pencil-fill"></i>
      </Button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal1-${updateTaskModalData.task_id}`}
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
                Update Task
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
                <label className="default-label" style={{ margin: "auto" }}>
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
                  value={updateTaskModalData.Project_name}
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
                <label className="default-label" style={{ margin: "auto" }}>
                  Task Status:
                </label>
                <select
                  className="form-control default__input default-text-color"
                  style={{
                    width: "70%",
                  }}
                  value={selectedTaskStatusOption}
                  onChange={(e) => {
                    setSelectedTaskStatusOption(e.target.value);
                  }}
                >
                  <option value="">Set Task status...</option>
                  {taskStatusOptions.map((option) => (
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

export default UpdateTaskModal;
