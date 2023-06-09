// libraries
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";

// styling

// component
import { UserContext } from "../../../../Context/UserContext";
import ReactToastify from "../../../Utility/ReactToastify";
import { projectCategoryOptions } from "../../../Utility/ProjectCategoryOptions";
import { Button } from "react-bootstrap";

const AddProjectModal = ({ projectAdded, setProjectAdded }) => {
  const mainUrl = useContext(UserContext);
  const [projectName, setProjectName] = useState("");
  const [selectedProjectCategoryOption, setSelectedProjectCategoryOption] =
    useState("");

  const onProjectCategoryChange = (value) => {
    setSelectedProjectCategoryOption(value);
  };

  const handleSubmit = () => {
    const LoginToken = localStorage.getItem("LoginToken");

    if (LoginToken) {
      const url = `${mainUrl}/project`;
      const bearer = "Bearer " + LoginToken;
      const newBearer = bearer.replace(/['"]+/g, "");
      const userId = localStorage.getItem("userId");
      const newUserId = userId.replace(/['"]+/g, "");

      if (
        selectedProjectCategoryOption === undefined ||
        selectedProjectCategoryOption === ""
      ) {
        return ReactToastify("Please select a project category", "error");
      }
      const data = {
        name: projectName,
        user_id: newUserId,
        project_category: selectedProjectCategoryOption,
      };

      // this fetch is used to add a new project
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
            result.message.name
              ? ReactToastify(result.message.name, "error")
              : ReactToastify(result.message, "error");
          } else {
            ReactToastify(result.message, "success");
            setProjectAdded(!projectAdded);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("You are not authorized, Please Login", "error");
    }
    setProjectName("");
    setSelectedProjectCategoryOption("");
  };

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal`}
      >
        Add a new Project
      </Button>
      {/* Button trigger modal ended */}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`exampleModal`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add a Project
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body"
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Project Name input */}
              <input
                autoComplete="off"
                type="text"
                id="project-name"
                className="form-control default__input default-text-color"
                placeholder="Enter your Project Name"
                onChange={(e) => setProjectName(e.target.value)}
                value={projectName}
              />
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <label
                  style={{ margin: "auto", color: "#000", fontWeight: "500" }}
                  htmlFor="projectCategory"
                >
                  Project category:
                </label>
                <Select
                  style={{
                    margin: "5px",
                    fontSize: "16px",
                    fontWeight: "600",
                    width: "70%",
                  }}
                  popupClassName="ant-design-select-zIndex"
                  className="default-text-color add-time-in-project-select-input"
                  showSearch
                  placeholder="Select project category..."
                  optionFilterProp="children"
                  onClear={() => setSelectedProjectCategoryOption("")}
                  allowClear={true}
                  onChange={(value) => setSelectedProjectCategoryOption(value)}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  value={selectedProjectCategoryOption}
                  options={projectCategoryOptions}
                />
                {/* <select
                  className="default__input"
                  style={{
                    margin: "5px",
                    fontSize: "16px",
                    fontWeight: "600",
                    width: "70%",
                    padding: "5px",
                  }}
                  value={selectedProjectCategoryOption}
                  onChange={(e) => {
                    setSelectedProjectCategoryOption(e.target.value);
                  }}
                >
                  <option value="">Select Project Category...</option>
                  {projectCategoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select> */}
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

export default AddProjectModal;
