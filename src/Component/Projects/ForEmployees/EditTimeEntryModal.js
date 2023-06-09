// libraries
import React, { useState, useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Select, DatePicker } from "antd";
import { Button } from "react-bootstrap";

// styling
import "../../../stylesheet/Projects/EditTimeEntryModal.css";

// component
import { ContextTheme } from "../../../Context/ThemeContext";
import { timeRange } from "./AddTimeInProject";
import ReactToastify from "../../Utility/ReactToastify";
import { UserContext } from "../../../Context/UserContext";

const EditTimeEntryModal = ({
  entryData,
  projectOptions,
  taskOptions,
  proxyOptions,
  setDataUpdated,
  dataUpdated,
}) => {
  const { toggleTheme } = useContext(ContextTheme);

  const mainUrl = useContext(UserContext);

  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const userId = localStorage.getItem("userId"); // logged in userId
  const newUserId = userId.replace(/['"]+/g, "");

  const {
    Project_name,
    project_id,
    task_id,
    task_name,
    work_description_for_proxy,
    date,
    time,
    description,
    entries_for,
    entries_id,
  } = entryData;

  // Helper function for Converting time from "00:30:00" to "15 mins"
  function convertTime(input) {
    // Split the time into hours, minutes, and seconds
    const [hours, minutes, seconds] = input.split(":").map(Number);

    // Calculate the total number of minutes
    const totalMinutes = hours * 60 + minutes;

    // Calculate the decimal value for the time
    const decimalValue = totalMinutes / 60;

    // Format the decimal value with 2 decimal points
    const formattedValue = decimalValue.toFixed(2);

    // Check if the time is exactly on the hour
    if (minutes === 0 && seconds === 0) {
      return {
        value: formattedValue,
        time: `${hours} ${hours === 1 ? "hour" : "hours"}`,
      };
    }

    // Calculate the remaining minutes after subtracting full hours
    const remainingMinutes = totalMinutes % 60;

    // Format the output string
    let timeString = "";
    if (hours > 0) {
      timeString += `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }
    if (remainingMinutes > 0) {
      timeString += `${
        timeString.length > 0 ? " and " : ""
      }${remainingMinutes} ${remainingMinutes === 1 ? "minute" : "minutes"}`;
    }

    return { value: formattedValue, time: timeString };
  }

  // states
  const [entryDetails, setEntryDetails] = useState({
    projectName: "",
    projectId: "",
    taskId: "",
    taskName: "",
    proxyName: "",
    selectedDate: "",
    duration: "",
    newDescription: "",
    entryFor: "",
  });

  const handleEdit = () => {
    setEntryDetails({
      projectName: Project_name,
      projectId: project_id,
      taskId: task_id,
      taskName: task_name,
      proxyName: work_description_for_proxy,
      selectedDate: date,
      duration: convertTime(time).value,
      newDescription: description,
      entryFor: entries_for,
    });
  };

  const onDurationChange = (value) => {
    setEntryDetails({ ...entryDetails, duration: value });
  };
  const onProjectChange = (value, label) => {
    setEntryDetails({
      ...entryDetails,
      projectName: label.label,
      projectId: value,
    });
  };
  const onTaskChange = (value, label) => {
    setEntryDetails({
      ...entryDetails,
      taskName: label.label,
      taskId: value,
    });
  };
  const onProxyChange = (value, label) => {
    setEntryDetails({
      ...entryDetails,
      proxyName: label.label,
      proxyId: value,
    });
  };

  const updateTimeEntry = () => {
    let data = {
      user_id: newUserId,
      entries_for,
      entries_id,
      date: entryDetails?.selectedDate,
      time: entryDetails?.duration,
      description: entryDetails?.newDescription,
    };

    if (entries_for === "for_project") {
      data = {
        ...data,
        project_id: entryDetails?.projectId,
      };
    } else if (entries_for === "for_task") {
      data = {
        ...data,
        task_id: entryDetails?.taskId,
      };
    } else if (entries_for === "for_proxy") {
      data = {
        ...data,
        work_description_for_proxy: entryDetails?.proxyName,
      };
    }

    if (LoginToken) {
      const url = `${mainUrl}/project/edit-time-entries`;

      // this API call updates the existing time entry
      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: newBearer,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === 200) {
            ReactToastify(result.message, "success");
            setDataUpdated(!dataUpdated);
            setEntryDetails({
              projectName: "",
              projectId: "",
              taskId: "",
              taskName: "",
              proxyName: "",
              selectedDate: "",
              duration: "",
              newDescription: "",
              entryFor: "",
            });
          } else {
            ReactToastify(result.message, "error");
          }
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
      localStorage.clear();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTimeEntry();
  };

  return (
    <div>
      {/* Button trigger modal started */}
      <Button
        type="button"
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#EditTimeEntryModal-${entries_id}`}
        onClick={handleEdit}
      >
        <i className="bi bi-pencil-fill"></i>
      </Button>
      {/* Button trigger modal ended */}

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`EditTimeEntryModal-${entries_id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 text-dark" id="exampleModalLabel">
                Edit Time Entry
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <Form onSubmit={handleSubmit}>
              <div className="time-entry-modal-body padding">
                <Form.Group
                  className="mb-3 row__add-time-in-project-form"
                  // controlId="formBasicPassword"
                >
                  <Form.Label
                    className={`row-label__add-time-in-project-form ${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    }`}
                  >
                    {entries_for === "for_project"
                      ? "Project Name:"
                      : entries_for === "for_task"
                      ? "Task Name:"
                      : entries_for === "for_proxy"
                      ? "Worked for:"
                      : ""}
                  </Form.Label>
                  <div className="row-input__add-time-in-project-form">
                    <Select
                      className="default-text-color add-time-in-project-select-input"
                      showSearch
                      popupClassName="ant-design-select-zIndex"
                      onClear={
                        entries_for === "for_project"
                          ? () =>
                              setEntryDetails({
                                ...entryDetails,
                                projectId: "",
                              })
                          : entries_for === "for_task"
                          ? () =>
                              setEntryDetails({ ...entryDetails, taskId: "" })
                          : entries_for === "for_proxy"
                          ? () =>
                              setEntryDetails({
                                ...entryDetails,
                                proxyName: "",
                              })
                          : ""
                      }
                      allowClear={true}
                      value={
                        entries_for === "for_project"
                          ? entryDetails?.projectName
                          : entries_for === "for_task"
                          ? entryDetails?.taskName
                          : entries_for === "for_proxy"
                          ? entryDetails?.proxyName
                          : ""
                      }
                      placeholder={
                        entries_for === "for_project"
                          ? "Select a Project..."
                          : entries_for === "for_task"
                          ? "Select a Task..."
                          : entries_for === "for_proxy"
                          ? "Select Proxy option..."
                          : ""
                      }
                      optionFilterProp="children"
                      onChange={
                        entries_for === "for_project"
                          ? onProjectChange
                          : entries_for === "for_task"
                          ? onTaskChange
                          : entries_for === "for_proxy"
                          ? onProxyChange
                          : ""
                      }
                      // onSearch={onSearch}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={
                        entries_for === "for_project"
                          ? projectOptions
                          : entries_for === "for_task"
                          ? taskOptions
                          : entries_for === "for_proxy"
                          ? proxyOptions
                          : ""
                      }
                    />
                  </div>
                </Form.Group>
                <Form.Group
                  className="mb-3 row__add-time-in-project-form"
                  // controlId="formBasicPassword"
                >
                  <Form.Label
                    className={`row-label__add-time-in-project-form ${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    }`}
                  >
                    Date:
                  </Form.Label>
                  <div className="row-input__add-time-in-project-form">
                    <Form.Control
                      value={entryDetails?.selectedDate}
                      className="form-control default__input"
                      style={{ margin: "0" }}
                      onChange={(e) =>
                        setEntryDetails({
                          ...entryDetails,
                          selectedDate: e.target.value,
                        })
                      }
                      type="date"
                      id="projectName"
                    />
                    {/* <DatePicker
                      size="large"
                      // value={entryDetails?.selectedDate}
                      // onChange={(e) =>
                      //   setEntryDetails({
                      //     ...entryDetails,
                      //     selectedDate: e.target.value,
                      //   })
                      // }
                    /> */}
                  </div>
                </Form.Group>
                <Form.Group
                  className="mb-3 row__add-time-in-project-form"
                  // controlId="formBasicPassword"
                >
                  <Form.Label
                    className={`row-label__add-time-in-project-form ${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    }`}
                  >
                    Duration:
                  </Form.Label>
                  <Select
                    className="default-text-color row-input__add-time-in-project-form"
                    showSearch
                    onClear={() => {
                      // ReactToastify("Please select Time", "error");
                      //   setFormTime("");
                    }}
                    value={entryDetails?.duration}
                    allowClear={true}
                    popupClassName="ant-design-select-zIndex"
                    placeholder="Select time..."
                    optionFilterProp="children"
                    onChange={onDurationChange}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={timeRange}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3 row__add-time-in-project-form"
                  // controlId="formBasicPassword"
                >
                  <Form.Label
                    className={`row-label__add-time-in-project-form ${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    }`}
                  >
                    Description:
                  </Form.Label>
                  <div className="row-input__add-time-in-project-form textarea-field">
                    <Form.Control
                      className="form-control default__input description-box"
                      style={{ margin: "0" }}
                      as="textarea"
                      placeholder="Enter your Description..."
                      value={entryDetails?.newDescription}
                      onChange={(e) =>
                        setEntryDetails({
                          ...entryDetails,
                          newDescription: e.target.value,
                        })
                      }
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="modal-footer">
                <Button
                  data-bs-dismiss="modal"
                  className="btn default-button"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTimeEntryModal;
