// libraries
import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import { TailSpin } from "react-loader-spinner";

// styling
import "../../stylesheet/Tasks/CreatedTaskCommentModal.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { Button } from "react-bootstrap";

const CreatedTaskCommentModal = ({
  commentModalData,
  commentUpdated,
  setCommentUpdated,
}) => {
  const userName = localStorage.getItem("userName");
  const newUserName = userName.replace(/['"]+/g, "");
  const LoginToken = localStorage.getItem("LoginToken");
  const mainUrl = useContext(UserContext);
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");
  const userId = localStorage.getItem("userId");
  const newUserId = userId.replace(/['"]+/g, "");

  // states
  const [description, setDescription] = useState("");
  const [receivedData, setReceivedData] = useState([]);
  const [allComments, setAllComments] = useState([]); // getting from fetch call, all comments
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    if (LoginToken) {
      const url = `${mainUrl}/task/all-comments-for-task-assigner/${newUserId}/${data.task_id}`;

      // this fetch is used to get all comments (only for Created Tasks)
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
          setLoading(false);
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

  // used to add a new comment
  const handleSubmit = () => {
    if (description !== "") {
      if (LoginToken) {
        const url = `${mainUrl}/task/comments`;

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
            // console.log(result);
            if (result.error) {
              ReactToastify(result.message, "error");
            } else {
              ReactToastify(result.message, "success");
              setCommentUpdated(!commentUpdated);
              setDescription("");
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

  const RevertDateTime = commentModalData.revert_time
    ? FormattingTaskDateTime(commentModalData.revert_time)
    : "N/A";

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        onClick={() => handleEdit(commentModalData)}
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${commentModalData.task_id}`}
      >
        <i className="fa-solid fa-comments"></i>
      </Button>
      {/* Button trigger modal ended */}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal-${commentModalData.task_id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-dark" id="exampleModalLabel">
                Created Task - Comments
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {loading ? (
              <TailSpin
                height="40"
                width="40"
                color="#333"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{
                  position: "absolute",
                  width: "97%",
                  height: "30vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                wrapperClass="loader"
                visible={true}
              />
            ) : (
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

                <div className="created-task-comment-modal">
                  {allComments.length > 0 ? (
                    <ul className="ul-all-comments-created-task-comment-modal">
                      {allComments.map((ele, index) => {
                        const DateTime = FormattingTaskDateTime(
                          ele.comments_on
                        );
                        return (
                          <div key={index}>
                            {ele.commentor === newUserName ? (
                              <li
                                className="li-you-all-comments-created-task-comment-modal"
                                // style={{ background: "green" }}
                              >
                                <div className="div-you-all-comments-created-task-comment-modal">
                                  <span className="comments-on-li-you-all-comments-created-task-comment-modal">
                                    {DateTime}
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
                                // style={{ background: "pink" }}
                              >
                                <div className="div-not-you-all-comments-created-task-comment-modal">
                                  <span className="commentor-li-not-you-all-comments-created-task-comment-modal">
                                    {ele.commentor}
                                  </span>
                                  <span className="comments-on-li-not-you-all-comments-created-task-comment-modal">
                                    {DateTime}
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
                          </div>
                        );
                      })}
                    </ul>
                  ) : (
                    <p>No comments available</p>
                  )}
                </div>
                {/* if reverted back then displaying revert msg as well */}
                <div className="divider-line-created-task-comment-modal"></div>
                {commentModalData.revert_time !== "0000-00-00 00:00:00" ? (
                  <>
                    <div className="created-task-revert-comment-modal">
                      <span>
                        <b>Reverted Back on:</b>{" "}
                      </span>{" "}
                      <span>{RevertDateTime}</span>
                      <br />
                      <span>
                        <b>Revert back description:</b>{" "}
                      </span>
                      {commentModalData.task_revert_description !== "" &&
                      commentModalData.task_revert_description !== undefined ? (
                        <>
                          {/* <span>{commentModalData.task_revert_description}</span> */}
                          <div
                            className="mt-2"
                            dangerouslySetInnerHTML={{
                              __html: commentModalData.task_revert_description,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {/* `No response added from ${commentModalData.assign_to}` */}
                          N/A
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  ""
                )}

                {/* Project description input */}
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  placeholder="Enter your comment here..."
                  modules={modules}
                  className="comment-modal-react-quill-modal-content"
                />
              </div>
            )}

            {/* modal footer */}
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

export default CreatedTaskCommentModal;
