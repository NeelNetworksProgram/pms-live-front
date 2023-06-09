// libraries
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";

// component
import { UserContext } from "../../../../Context/UserContext";
import ReactToastify from "../../../Utility/ReactToastify";

// styling
import { Button } from "react-bootstrap";

const DeleteProjectModal = ({ id, name, setProjectDeleted }) => {
  const mainUrl = useContext(UserContext);
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");

  const handleEdit = (id, name) => {
    setProjectId(id);
    setProjectName(name);
  };

  const handleSubmit = () => {
    const LoginToken = localStorage.getItem("LoginToken");
    const bearer = "Bearer " + LoginToken;
    const newBearer = bearer.replace(/['"]+/g, "");
    const userId = localStorage.getItem("userId");
    const newUserId = userId.replace(/['"]+/g, "");

    const url = `${mainUrl}/project`;
    const requestOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: newBearer,
    };

    const data = {
      id: projectId,
      name: projectName,
      user_id: newUserId,
    };

    fetch(url, {
      method: "DELETE",
      headers: requestOptions,
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.error) {
          ReactToastify(result.message, "error");
        } else {
          ReactToastify(result.message, "info");
          setProjectDeleted((prev) => !prev);
        }
      });
  };

  return (
    <>
      {/* Button trigger modal started */}
      <Button
        type="button"
        className="btn default-button"
        onClick={() => handleEdit(id, name)}
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal1-${id}`}
      >
        <i className="bi bi-trash"></i>
      </Button>
      {/* Button trigger modal ended */}

      {/* <!-- Modal started --> */}
      <div
        className="modal fade"
        id={`exampleModal1-${id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5 default-text-color"
                id="exampleModalLabel"
              >
                Delete Project
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
              {/* Project ID input */}
              {/* <input 
                    type="number" 
                    // id="projectId"
                    disabled placeholder='id' 
                    style={{margin:"5px", fontSize:"16px", fontWeight:"600", width:"80%"}}
                    value={id}
                    />  */}

              {/* Project Name input */}
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <label style={{ margin: "auto" }} htmlFor="projectName">
                  Project Name:{" "}
                </label>
                <input
                  className="default-text-color"
                  type="text"
                  disabled
                  id="projectName"
                  style={{
                    margin: "5px",
                    fontSize: "16px",
                    fontWeight: "600",
                    width: "70%",
                    cursor: "not-allowed",
                  }}
                  value={projectName}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn default-button"
                data-bs-dismiss="modal"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Modal ended --> */}
    </>
  );
};

export default DeleteProjectModal;
