// libraries
import React, { useState, useContext } from "react";

// styling

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { Button } from "react-bootstrap";

export const DeleteUserModal = ({ id, username, setUserDeleted }) => {
  const mainUrl = useContext(UserContext);
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  const handleEdit = (id, username) => {
    setUserId(id);
    setUserName(username);
  };

  // for deleting a user
  const handleSubmit = () => {
    const LoginToken = localStorage.getItem("LoginToken");
    const bearer = "Bearer " + LoginToken;
    const newBearer = bearer.replace(/['"]+/g, "");

    const url = `${mainUrl}/user/delete/${userId}`;
    const requestOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: newBearer,
    };

    const data = {
      user_id: userId,
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
          setUserDeleted((previous) => !previous);
        }
      })
      .catch((error) => {
        ReactToastify(error, "error");
      });
  };

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        onClick={() => handleEdit(id, username)}
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${id}`}
      >
        <i className="bi bi-trash"></i>
      </Button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal-${id}`}
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
                Delete User
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
              {/* User Name input */}
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
                  User name:
                </label>
                <input
                  className="form-control default__input default-text-color"
                  type="text"
                  disabled
                  id="username"
                  style={{
                    width: "70%",
                    cursor: "not-allowed",
                  }}
                  value={userName}
                />
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
                Delete user
              </button>
            </div>
          </div>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};
