// libraries
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";

// styling

// component
import ReactToastify from "../../../Utility/ReactToastify";
import { UserContext } from "../../../../Context/UserContext";

const DeallocateProject = ({
  userIdSelected,
  projectIdSelected,
  deallocateProjectStatus,
  setDeallocateProjectStatus,
  setLoading,
}) => {
  const mainUrl = useContext(UserContext);

  // handle submit
  const handleSubmit = () => {
    setLoading(true);
    const LoginToken = localStorage.getItem("LoginToken");

    if (LoginToken) {
      const bearer = "Bearer " + LoginToken;
      const newBearer = bearer.replace(/['"]+/g, "");
      const userId = localStorage.getItem("userId");
      const newUserId = userId.replace(/['"]+/g, "");

      const url = `${mainUrl}/project/deallocate`;
      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      const data = {
        login_user: newUserId,
        deallocate_user: Number(userIdSelected),
        project_id: Number(projectIdSelected),
      };

      fetch(url, {
        method: "PATCH",
        headers: requestOptions,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          setLoading(false);
          if (result.error) {
            ReactToastify(result.message, "error");
          } else {
            setDeallocateProjectStatus(!deallocateProjectStatus);
            ReactToastify(result.message, "success");
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again.", "error");
      setTimeout(() => {
        localStorage.clear();
      }, 2000);
    }
  };

  return (
    <div>
      {/* Button trigger modal started */}
      {/* <button
        type="button"
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${projectIdSelected}`}
      >
        <i className="fa-regular fa-trash-can"></i>
      </button> */}
      <i
        className="fa-solid fa-user-slash"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${projectIdSelected}`}
        style={{
          marginLeft: "10px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      ></i>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal-${projectIdSelected}`}
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
                Deallocate Project
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
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h5>are sure you want to deallocate this project?</h5>
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
                Deallocate
              </button>
            </div>
          </div>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};

export default DeallocateProject;
