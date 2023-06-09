// libraries
import React, { useContext, useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Select } from "antd";

// component
import Navbar from "../Navbar/Navbar";
import Profile from "../Profile/Profile";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { ContextTheme } from "../../Context/ThemeContext";

// styling
import "../../stylesheet/App.css";
import "../../stylesheet/Tasks/AssignTask.css";

export const AssignTask = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);
  const [loading, setLoading] = useState(false);

  // fetching logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  // fetching logged in user role
  const userRole = localStorage.getItem("userRole");
  const newUserRole = userRole.replace(/['"]+/g, "");

  // fetching logged in user login token
  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // states
  const [users, setUsers] = useState([]); // all users data
  const [projects, setProjects] = useState([]); // all projects data
  const [description, setDescription] = useState("");
  const [taskName, setTaskName] = useState("");

  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // used to get all the users data
  useEffect(() => {
    if (LoginToken) {
      const url = `${mainUrl}/user`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get all users data
      fetch(url, {
        method: "GET",
        headers: requestOptions,
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.error) {
            ReactToastify(result.message, "error");
            setLoading(false);
          } else {
            const userData = result.data;
            const filteredUserData = userData.filter(
              (user) =>
                user.roles === "employee" &&
                user.id !== newUserId &&
                user.status === "active"
            );
            setUsers(filteredUserData);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
    }
  }, []);

  // used to get all the projects data assigned to logged in user
  useEffect(() => {
    const url = `${mainUrl}/user/assign-project-list-for-single-user/${newUserId}`;

    const requestOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: newBearer,
    };

    //this fetch call is used to get all projects data
    fetch(url, {
      method: "GET",
      headers: requestOptions,
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.error) {
          // console.log(result.message);
          // ReactToastify(result.message, "error");
        } else {
          const projectData = result.data;
          setProjects(projectData);
        }
      })
      .catch((error) => {
        // console.log(error);
        // ReactToastify(error, "error");
      });
  }, []);

  const handleClear = () => {
    setDescription("");
    setSelectedUserId("");
    setSelectedProjectId("");
    setTaskName("");
  };

  // Assigning a Task from using Project
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedProjectId && selectedUserId && description && taskName) {
      if (LoginToken) {
        setLoading(true);
        // this API will assign a task from employee - employee using project
        const url = `${mainUrl}/task/assign-task-with-project`;
        const requestOptions = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: newBearer,
        };
        const data = {
          login_user: newUserId,
          assign_to: selectedUserId,
          project_id: selectedProjectId,
          task_description: description,
          task_name: taskName,
        };

        //this fetch call is used to get all users data
        fetch(url, {
          method: "POST",
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
              handleClear();
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            ReactToastify(error, "error");
          });
      } else {
        ReactToastify(
          "Sorry you are not authorised, please login again",
          "error"
        );
      }
    } else if (selectedUserId && description && taskName) {
      if (LoginToken) {
        setLoading(true);
        // this API will assign a task from employee - employee using project
        const url = `${mainUrl}/task/assign-task-without-project`;
        const requestOptions = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: newBearer,
        };
        const data = {
          assign_to: selectedUserId,
          task_description: description,
          task_name: taskName,
          assign_by: newUserId,
        };

        //this fetch call is used to assign task from employee to another employee
        fetch(url, {
          method: "POST",
          headers: requestOptions,
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
              handleClear();
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            ReactToastify(error, "error");
          });
      } else {
        ReactToastify(
          "Sorry you are not authorised, please login again",
          "error"
        );
      }
    } else {
      ReactToastify(
        "Please make sure you've selected Employee or Project & entered Task Name & given description",
        "error"
      );
    }
  };

  const userOptions = users.map((user) => {
    return { label: user.username, value: user.id };
  });

  const onUserChange = (value) => {
    setSelectedUserId(value);
  };

  const projectOptions = projects.map((project) => {
    return { label: project.Project_name, value: project.Project_id };
  });

  const onProjectChange = (value) => {
    setSelectedProjectId(value);
  };

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* heading content */}
      <PageHeader />
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        }`}
      >
        <div
          className={`default-section-block ${
            toggleTheme ? "dark" : ""
          } form-content mt-2`}
        >
          <h3
            className={`${
              toggleTheme ? "dark-text-color" : "default-text-color"
            }`}
          >
            Assign a Task
          </h3>
          {/* Assign a task form section */}
          {loading ? (
            <TailSpin
              height="50"
              width="50"
              color="#333"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{
                width: "100%",
                height: "50vh",
                top: "10vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              wrapperClass="loader"
              visible={true}
            />
          ) : (
            <Form
              className={`form-page form__div-box ${
                toggleTheme ? "dark-sub-text-color" : "default-text-color"
              }`}
            >
              <Form.Group className="mb-3" /*controlId="formBasicPassword"*/>
                <Form.Label
                  className={`${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  Employee Name:
                </Form.Label>
                <Select
                  className="default-text-color add-time-in-project-select-input"
                  showSearch
                  placeholder="Select an Employee..."
                  optionFilterProp="children"
                  onClear={() => setSelectedUserId("")}
                  allowClear={true}
                  onChange={onUserChange}
                  // onSearch={onSearch}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={userOptions}
                />
              </Form.Group>

              {newUserRole === "admin" || newUserRole === "manager" ? (
                ""
              ) : (
                <Form.Group className="mb-3" /*controlId="formBasicPassword"*/>
                  <Form.Label
                    className={`${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    Project Name: (optional)
                  </Form.Label>
                  <Select
                    className="default-text-color add-time-in-project-select-input"
                    showSearch
                    placeholder="Select a Project..."
                    optionFilterProp="children"
                    onClear={() => setSelectedProjectId("")}
                    allowClear={true}
                    onChange={onProjectChange}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={projectOptions}
                  />
                </Form.Group>
              )}

              <Form.Group className="mb-3" /*controlId="formBasicPassword"*/>
                <Form.Label
                  className={`${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  Task Name:
                </Form.Label>
                <Form.Control
                  as="input"
                  className="form-control default__input"
                  style={{ margin: "0px" }}
                  placeholder="Enter Task name..."
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" /*controlId="formBasicPassword"*/>
                <Form.Label
                  className={`${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  Description:
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className="form-control default__input"
                  placeholder="Enter your Description..."
                  style={{ margin: "0px" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>

              <Button
                className="default-button"
                onClick={handleSubmit}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          )}
        </div>
      </div>
      <PageFooter />
    </>
  );
};
