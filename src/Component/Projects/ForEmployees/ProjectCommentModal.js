// libraries
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";

// styling

// component
import { UserContext } from "../../../Context/UserContext";
import ReactToastify from "../../Utility/ReactToastify";
import { Button } from "react-bootstrap";

const ProjectCommentModal = ({ commentModalData, setLoading }) => {
  const mainUrl = useContext(UserContext);

  // states
  const [description, setDescription] = useState("");
  const [receivedData, setReceivedData] = useState([]);

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

  // this code is simply sending a mail to the assigner with a message saying employee completed so n so task.
  const handleSubmit = () => {
    if (description !== "") {
      const LoginToken = localStorage.getItem("LoginToken");
      if (LoginToken) {
        setLoading(true);
        const url = `${mainUrl}/project/submit`;
        const bearer = "Bearer " + LoginToken;
        const newBearer = bearer.replace(/['"]+/g, "");
        const userId = localStorage.getItem("userId");
        const newUserId = userId.replace(/['"]+/g, "");

        const data = {
          project_id: commentModalData.Project_id,
          current_user: newUserId,
          message: description,
        };

        // this fetch is used to send a mail to the person who assigned this project, with a message.
        fetch(url, {
          method: "POST",
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
            setLoading(false);
            if (result.error) {
              ReactToastify(result.message, "error");
            } else {
              ReactToastify(result.message, "success");
              setDescription("");
            }
          })
          .catch((error) => {
            setLoading(false);
            ReactToastify(error, "error");
          });
      } else {
        ReactToastify("You are not authorized, Please Login", "error");
      }
    } else {
      ReactToastify("Please enter description", "error");
    }
  };

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal4-${commentModalData.Project_id}`}
      >
        <i className="fa-solid fa-comments"></i>
      </Button>

      {/* Button trigger modal ended */}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal4-${commentModalData.Project_id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-dark" id="exampleModalLabel">
                Update to Manager/Admin
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body comment-modal-body text-dark">
              {/* Project name */}
              <h6
                style={{
                  textAlign: "left",
                  width: "100%",
                  marginLeft: "5px",
                  paddingBottom: "10px",
                }}
              >
                Project name: {commentModalData.Project_name}
              </h6>
              {/* Project Name input */}
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                placeholder="Enter your description about the project here..."
                modules={modules}
                className="comment-modal-react-quill-modal-content"
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn default-button"
                data-bs-dismiss="modal"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCommentModal;
