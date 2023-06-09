// libraries
import React, { useState, useContext } from "react";

// styling
import "bootstrap/dist/css/bootstrap.min.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { Button } from "react-bootstrap";

const UpdateUserModal = ({
  id,
  username,
  email,
  roles,
  authority,
  setDataUpdated,
  status,
}) => {
  const mainUrl = useContext(UserContext);
  // console.log(
  //   `id=${id}, username=${username}, email=${email}, roles=${roles}, authority=${authority}`
  // );
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); // roles
  const [selectedStatus, setSelectedStatus] = useState(""); // status
  const [selectedAuthority, setSelectedAuthority] = useState(""); //authority

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
  ];

  const authorityOptions = [
    { value: "view", label: "View" },
    { value: "view,edit", label: "View/Edit" },
    { value: "view,edit,create", label: "View/Edit/Create" },
    { value: "view,edit,create,delete", label: "View/Edit/Create/Delete" },
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "suspend", label: "Suspend" },
  ];

  const handleEdit = () => {
    setUserId(id);
    setUserName(username);
    setUserEmail(email);
    setSelectedRole(roles);
    setSelectedStatus(status);
    setSelectedAuthority(authority);
  };

  // used to update the details of a particular user
  const handleSubmit = () => {
    const LoginToken = localStorage.getItem("LoginToken");

    if (LoginToken) {
      const bearer = "Bearer " + LoginToken;
      const newBearer = bearer.replace(/['"]+/g, "");

      const data = {
        username: userName,
        roles: selectedRole, //  employee or admin
        status: selectedStatus, // "view,edit,create,delete"
      };

      const url = `${mainUrl}/user/${userId}`;
      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      if (selectedRole === "" || selectedStatus === "") {
        ReactToastify("Cannot assign null values", "error");
      } else {
        // this fetch call is used to update the details of a particular user
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
              ReactToastify(result.message, "error");
            } else {
              ReactToastify(result.message, "success");
              setDataUpdated((previous) => !previous);
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
        onClick={() =>
          handleEdit(id, username, email, roles, authority, status)
        }
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal2-${id}`}
      >
        <i className="bi bi-pencil-fill"></i>
      </Button>
      {/* Button trigger modal ended */}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal2-${id}`}
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
                Update User Detail
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
              {/* User email input */}
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <label className="default-label" style={{ margin: "auto" }}>
                  Email:{" "}
                </label>
                <input
                  type="email"
                  id="userEmail"
                  className="form-control default__input default-text-color"
                  placeholder="Enter user Email"
                  style={{
                    // margin: "5px",
                    // fontSize: "16px",
                    // fontWeight: "600",
                    width: "80%",
                    cursor: "not-allowed",
                  }}
                  value={userEmail}
                  disabled
                />
              </div>

              {/* User Role input */}
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <label className="default-label" style={{ margin: "auto" }}>
                  Role:
                </label>
                <select
                  className="form-control default__input default-text-color"
                  style={{
                    // margin: "5px",
                    // fontSize: "16px",
                    // fontWeight: "600",
                    width: "80%",
                  }}
                  defaultValue={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                  }}
                >
                  <option value="">Select a Role...</option>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* User Status input */}
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
                  htmlFor="userId"
                >
                  Status:
                </label>
                <select
                  className="form-control default__input default-text-color"
                  style={{
                    // margin: "5px",
                    // fontSize: "16px",
                    // fontWeight: "600",
                    width: "80%",
                  }}
                  defaultValue={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                  }}
                >
                  <option value="">Select status...</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
      </div>
    </div>
  );
};

export default UpdateUserModal;
