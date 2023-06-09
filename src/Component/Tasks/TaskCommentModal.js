// libraries
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";

// styling
import "../../stylesheet/Tasks/TaskCommentModal.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { Button } from "react-bootstrap";

const TaskCommentModal = ({
  commentModalData,
  commentUpdated,
  setCommentUpdated,
}) => {
  const mainUrl = useContext(UserContext);

  // fetching logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");
  const userName = localStorage.getItem("userName");
  const newUserName = userName.replace(/['"]+/g, "");

  // fetching logged in user login token
  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // states
  const [description, setDescription] = useState(""); // react quill value
  const [receivedData, setReceivedData] = useState([]); // getting from parent component
  const [allComments, setAllComments] = useState([]); // getting from fetch call, all comments

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

    if (LoginToken) {
      const url = `${mainUrl}/task/all-comments/${newUserId}/${commentModalData.task_id}`;
      // console.log(url);
      // this fetch is used to get all comments (cannot use it in Created Tasks)
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
          if (result.error) {
            ReactToastify(result.message, "error");
          } else {
            const commentArray = result.comments[0].reverse();
            setAllComments(commentArray);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("You are not authorized, Please Login", "error");
    }
  };

  // used to add a comment
  const handleSubmit = () => {
    const LoginToken = localStorage.getItem("LoginToken");

    if (description !== "") {
      if (LoginToken) {
        const url = `${mainUrl}/task/comments`;
        const bearer = "Bearer " + LoginToken;
        const newBearer = bearer.replace(/['"]+/g, "");
        const userId = localStorage.getItem("userId");
        const newUserId = userId.replace(/['"]+/g, "");

        const data = {
          task_id: receivedData.task_id,
          project_id: receivedData.project_id,
          task_commentor: newUserId,
          task_comments: description,
        };

        // this fetch is used to add a new comment
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
            if (result.error) {
              ReactToastify(result.message, "error");
            } else {
              setCommentUpdated((prev) => !prev);
              setDescription("");
              ReactToastify(result.message, "success");
            }
          })
          .catch((error) => {
            ReactToastify(error, "error");
          });
      } else {
        ReactToastify("You are not authorized, Please Login", "error");
      }
    } else {
      ReactToastify(
        "Cannot add empty Comments, Please fill in the comment field",
        "error"
      );
    }
  };

  // function for formatting the Data & time inside Comments
  const FormattingTaskDateTime = (input) => {
    // Input date string
    //   const inputDate = ele.comments_on;

    // Create a new Date object from the input string
    const dateObj = new Date(input);

    // Format the date in dd/mm/yyyy format
    const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}/${(
      dateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${dateObj.getFullYear()}`;

    // Format the time in hh:mm AM/PM format
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const formattedTime = `${hours % 12 === 0 ? 12 : hours % 12}:${minutes
      .toString()
      .padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;

    // Output the formatted date and time
    const DataTime = `${formattedDate} | ${formattedTime}`;
    return DataTime;
  };
  const RevertDateTime = FormattingTaskDateTime(commentModalData.revert_time);

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        onClick={() => handleEdit(commentModalData)}
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal10-${commentModalData.task_id}`}
      >
        <i className="fa-solid fa-comments"></i>
      </Button>
      {/* Button trigger modal ended */}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal10-${commentModalData.task_id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5 default-text-color"
                id="exampleModalLabel"
              >
                Task - Comments
                {/* Pending, Reviewing & Completed Tasks modal */}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {/* --------- MODAL BODY -------- */}
            <div className="modal-body comment-modal-body text-dark">
              {/* Project name */}
              <div className="comment-body-title">
                <h6>
                  <span>Project Name:</span>{" "}
                  {commentModalData.Project_name !== "N.A"
                    ? commentModalData.Project_name
                    : "Not assigned with Project"}
                </h6>
                <h6>
                  <span>Task Name:</span> {commentModalData.task_name}
                </h6>
              </div>

              {/* all comments section */}

              <div className="created-task-comment-modal text-dark">
                {allComments.length > 0 ? (
                  <ul className="ul-all-comments-created-task-comment-modal">
                    {allComments.map((ele, index) => {
                      const CommentDateTime = FormattingTaskDateTime(
                        ele.comments_on
                      );

                      return (
                        <>
                          {ele.commentor === newUserName ? (
                            <li
                              key={index}
                              className="li-you-all-comments-created-task-comment-modal"
                            >
                              <div className="div-you-all-comments-created-task-comment-modal">
                                <span className="comments-on-li-you-all-comments-created-task-comment-modal">
                                  {CommentDateTime}
                                </span>
                                <div>
                                  <p className="message-li-you-all-comments-created-task-comment-modal">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: ele.task_comments,
                                      }}
                                    />
                                    {/* {ele.task_comments} */}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ) : (
                            <li
                              key={index}
                              className="li-not-you-all-comments-created-task-comment-modal"
                            >
                              <div className="div-not-you-all-comments-created-task-comment-modal">
                                <span className="commentor-li-not-you-all-comments-created-task-comment-modal">
                                  {ele.commentor}
                                </span>
                                <span className="comments-on-li-not-you-all-comments-created-task-comment-modal">
                                  {CommentDateTime}
                                </span>
                                <div>
                                  <p className="message-li-not-you-all-comments-created-task-comment-modal">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: ele.task_comments,
                                      }}
                                    />
                                    {/* {ele.task_comments} */}
                                  </p>
                                </div>
                              </div>
                            </li>
                          )}
                        </>
                      );
                    })}
                  </ul>
                ) : (
                  <p>No comments available</p>
                )}
              </div>

              {/* if reverted back then displaying revert msg as well */}
              {/* {commentModalData.task_revert_description !== "" ? (
                <>
                  <div className="divider-line"></div>
                  <div className="created-task-revert-comment-modal">
                    <span>Reverted Back on: </span>{" "}
                    <span>{RevertDateTime}</span>
                    <br />
                    <span>Revert back description: </span>
                    <span>{commentModalData.task_revert_description}</span>
                  </div>
                </>
              ) : (
                ""
              )} */}

              {/* Project description input */}
              {commentModalData.task_status === "Completed" ? (
                ""
              ) : (
                <>
                  <div className="divider-line-task-comment-modal"></div>
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    placeholder="Enter your comment here..."
                    modules={modules}
                    className="comment-modal-react-quill-modal-content text-dark"
                  />
                </>
              )}
            </div>
            {/* modal footer */}
            <div className="modal-footer">
              {commentModalData.task_status === "Completed" ? (
                <button
                  type="button"
                  className="btn default-button"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn default-button"
                  data-bs-dismiss="modal"
                >
                  Comment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCommentModal;
