// libraries
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";

// styling
import "../../stylesheet/Tasks/RevertBack.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { Button } from "react-bootstrap";

const RevertBack = ({
  revertBackData,
  revertBackUpdated,
  setRevertBackUpdated,
}) => {
  const mainUrl = useContext(UserContext);

  // states
  const [receivedData, setReceivedData] = useState([]);
  const [description, setDescription] = useState("");
  const [revertStatus, setRevertStatus] = useState("");

  // revert status options
  const revertStatusOptions = [
    {
      value: "able",
      label: "Able",
    },
    {
      value: "unable",
      label: "Unable",
    },
  ];

  // for React quill editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const handleEdit = (data) => {
    setReceivedData(data);
  };

  const handleSubmit = () => {
    const LoginToken = localStorage.getItem("LoginToken");

    if (LoginToken) {
      if (revertStatus && description !== "") {
        const url = `${mainUrl}/task/revert-task`;
        const bearer = "Bearer " + LoginToken;
        const newBearer = bearer.replace(/['"]+/g, "");
        const userId = localStorage.getItem("userId");
        const newUserId = userId.replace(/['"]+/g, "");

        const data = {
          task_id: revertBackData.task_id,
          project_id: revertBackData.project_id,
          current_user: newUserId,
          revert_description: description,
          revert_status: revertStatus,
        };

        // this fetch is used to add a new project
        fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: newBearer,
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            if (result.error) {
              const errorData = result.message;

              if (typeof errorData === "object") {
                Object.values(errorData).forEach((error) =>
                  ReactToastify(error, "error")
                );
              } else {
                ReactToastify(errorData, "error");
              }
            } else {
              ReactToastify(result.message, "success");
              setRevertBackUpdated((prev) => !prev);
              setDescription("");
              setRevertStatus("");
            }
          })
          .catch((error) => {
            ReactToastify(error, "error");
          });
      } else {
        if (!revertStatus) {
          ReactToastify("Please select revert status", "error");
        }
        if (description === "") {
          ReactToastify("Please add description", "error");
        }
      }
    } else {
      ReactToastify("You are not authorized, Please Login", "error");
    }
  };

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        onClick={() => handleEdit(revertBackData)}
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal1-${receivedData.task_id}`}
      >
        <i className="fa-solid fa-reply"></i>
      </Button>
      {/* Button trigger modal ended */}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal1-${receivedData.task_id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        {/* <form onSubmit={handleSubmit}> */}
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-dark" id="exampleModalLabel">
                Revert back
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body revert-back-modal-body">
              {/* Project name */}
              <div className="revert-back-modal-body-header">
                <div className="revert-back-heading">
                  <label className="default-text-color">
                    <span>Project name: </span>
                    {receivedData.Project_name}
                  </label>
                  <label className="default-text-color">
                    <span>Task Name:</span>
                    {receivedData.task_name}
                  </label>
                </div>
                <div className="revert-back-option">
                  <p className="default-label default-text-color">
                    Revert Status:
                  </p>
                  <select
                    className="form-control default__input default-text-color project-status-field"
                    required
                    defaultValue={revertStatus}
                    onChange={(e) => {
                      setRevertStatus(e.target.value);
                    }}
                  >
                    <option value="">Select an option...</option>
                    {revertStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project Name input */}
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Write a short brief about the project..."
                modules={modules}
                className="comment-modal-react-quill-modal-content default-text-color"
              />
            </div>
            <div className="modal-footer">
              <button
                onClick={handleSubmit}
                type="button"
                className="btn default-button"
                data-bs-dismiss="modal"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};

export default RevertBack;
