// libraries
import React, { useState, useEffect, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import Calendar from "react-calendar"; // https://www.npmjs.com/package/react-calendar
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Select } from "antd";
import { Button } from "react-bootstrap";

// components
import Navbar from "../../Navbar/Navbar";
import { UserContext } from "../../../Context/UserContext";
import ReactToastify from "../../Utility/ReactToastify";
import { PageHeader } from "../../Utility/PageHeader";
import { PageFooter } from "../../Utility/PageFooter";
import { ContextTheme } from "../../../Context/ThemeContext";
import EditTimeEntryModal from "./EditTimeEntryModal";

// styling
import "react-calendar/dist/Calendar.css";
import "../../../stylesheet/App.css";
import "../../../stylesheet/Projects/AddTimeInProject.css";

// for selecting time inside the form.
export const timeRange = [
  { value: "0.25", label: "15 mins" },
  { value: "0.50", label: "30 mins" },
  { value: `0.75`, label: "45 mins" },
  { value: "1.00", label: "1 hour" },
  { value: "1.25", label: "1 hour 15 mins" },
  { value: "1.50", label: "1 hour 30 mins" },
  { value: "1.75", label: "1 hour 45 mins" },
  { value: "2.00", label: "2 hours" },
  { value: "2.25", label: "2 hours 15 mins" },
  { value: "2.50", label: "2 hours 30 mins" },
  { value: "2.75", label: "2 hours 45 mins" },
  { value: "3.00", label: "3 hours" },
  { value: "3.25", label: "3 hours 15 mins" },
  { value: "3.50", label: "3 hours 30 mins" },
  { value: "3.75", label: "3 hours 45 mins" },
  { value: "4.00", label: "4 hours" },
  { value: "4.25", label: "4 hours 15 mins" },
  { value: "4.50", label: "4 hours 30 mins" },
  { value: "4.75", label: "4 hours 45 mins" },
  { value: "5.00", label: "5 hours" },
  { value: "5.25", label: "5 hours 15 mins" },
  { value: "5.50", label: "5 hours 30 mins" },
  { value: "5.75", label: "5 hours 45 mins" },
  { value: "6.00", label: "6 hours" },
  { value: "6.25", label: "6 hours 15 mins" },
  { value: "6.50", label: "6 hours 30 mins" },
  { value: "6.75", label: "6 hours 45 mins" },
  { value: "7.00", label: "7 hours" },
  { value: "7.25", label: "7 hours 15 mins" },
  { value: "7.50", label: "7 hours 30 mins" },
  { value: "7.75", label: "7 hours 45 mins" },
  { value: "8.00", label: "8 hours" },
  { value: "8.25", label: "8 hours 15 mins" },
  { value: "8.5", label: "8 hours 30 mins" },
  { value: "8.75", label: "8 hours 45 mins" },
  { value: "9.00", label: "9 hours" },
  { value: "9.25", label: "9 hours 15 mins" },
  { value: "9.50", label: "9 hours 30 mins" },
  { value: "9.75", label: "9 hours 45 mins" },
  { value: "10.00", label: "10 hours" },
  { value: "10.25", label: "10 hours 15 mins" },
  { value: "10.50", label: "10 hours 30 mins" },
  { value: "10.75", label: "10 hours 45 mins" },
  { value: "11.00", label: "11 hours" },
  { value: "11.25", label: "11 hours 15 mins" },
  { value: "11.50", label: "11 hours 30 mins" },
  { value: "11.75", label: "11 hours 45 mins" },
  { value: "12.00", label: "12 hours" },
];

const AddTimeInProject = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);
  const [loading, setLoading] = useState(false); // for loader

  const [timeEntryOption, setTimeEntryOption] = useState("project");

  const colors = [
    "#FFC72C",
    "#D2122E",
    "#002D62",
    "#32de84",
    "#4B0082",
    "#4cd137",
    "#cd84f1",
    "#3d3d3d",
    "#7cf49a",
  ];

  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const userId = localStorage.getItem("userId"); // logged in userId
  const newUserId = userId.replace(/['"]+/g, "");

  // all states
  const [projectList, setProjectList] = useState([]); // all the assigned projects are stored in here
  const [pendingTasks, setPendingTasks] = useState([]); // pending tasks
  const [recordData, setRecordData] = useState([]); // all the records are stored here, if present
  const [holidayData, setHolidayData] = useState([]);

  const [selectedProjectId, setSelectedProjectId] = useState(""); // selected project id
  const [selectedTaskId, setSelectedTaskId] = useState(""); // selected project id
  const [selectedProxyId, setSelectedProxyId] = useState(""); // selected project id
  const [description, setDescription] = useState(""); // description goes in here
  const [message, setMessage] = useState(""); // used to store the response msg
  const [formTime, setFormTime] = useState("");
  const [nameOfHoliday, setNameOfHoliday] = useState("");

  const [recordDate, setRecordDate] = useState(new Date()); // for checking the records
  const [formDate, setFormDate] = useState(new Date()); // storing the date selected by user in form
  const [calendarDate, setCalendarDate] = useState(new Date()); // used for calendar date

  const [dataUpdated, setDataUpdated] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // states for displaying time entries
  const [projectEntries, setProjectEntries] = useState([]);
  const [taskEntries, setTaskEntries] = useState([]);
  const [proxyEntries, setProxyEntries] = useState([]);

  // using this code, setting the form date same to the calendar date
  useEffect(() => {
    const now = new Date(calendarDate); // using this date to set max date in the form calendar
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const formatDate = `${year}-${month}-${day}`;
    setFormDate(formatDate);
  }, [calendarDate]);

  // this code is used for getting all active projects of the logged in user
  useEffect(() => {
    if (LoginToken) {
      // this url will give all projects that are in running status assigned to the current logged in user
      const url = `${mainUrl}/user/assign-project-list-for-single-user/${newUserId}`;

      // used for getting assigned projects name inside the select html tag
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
            setProjectList([]);
          } else {
            const list = result.data; // getting projects list as a result from fetch api call
            setProjectList(list);
          }
        })
        .catch((error) => {
          setProjectList([]);
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
      localStorage.clear();
    }
  }, []);

  // this API gets all the pending tasks of the logged in user
  useEffect(() => {
    setLoading(true);
    if (LoginToken) {
      const url = `${mainUrl}/task/list?task_status=Pending&login_user=${newUserId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get all pending tasks
      fetch(url, {
        method: "GET",
        headers: requestOptions,
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          setLoading(false);
          if (result.error) {
            setMessage(result.message);
            setPendingTasks([]);
          } else {
            setPendingTasks(result.data);
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

  // getting all the holidays
  useEffect(() => {
    const url = `${mainUrl}/holiday-list`;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: newBearer,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        const data = result.data;
        setHolidayData(data);
      });
  }, []);

  // used to get all "current logged in user" records present on the selected date
  useEffect(() => {
    setLoading(true);

    const year = recordDate.getFullYear();
    const month = (recordDate.getMonth() + 1).toString().padStart(2, "0");
    const day = recordDate.getDate().toString().padStart(2, "0");
    const dateFormatted = `${year}-${month}-${day}`;

    const url = `${mainUrl}/project/list/${newUserId}/${dateFormatted}`;

    //prints all the current present day work records done by the logged in user
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
          setRecordData([]);
          setMessage(result.message);
          setLoading(false);
        } else {
          const data = result.data;
          setRecordData(data);
          setLoading(false);
        }
      });
  }, [recordDate, dataUpdated]);

  // used to bifurcate all the entries (projects, tasks, proxy)
  useEffect(() => {
    const onlyProjectEntry = recordData.filter(
      ({ entries_for }) => entries_for === "for_project"
    );
    setProjectEntries(onlyProjectEntry);

    const onlyTaskEntry = recordData.filter(
      ({ entries_for }) => entries_for === "for_task"
    );
    setTaskEntries(onlyTaskEntry);

    const onlyProxyEntry = recordData.filter(
      ({ entries_for }) => entries_for === "for_proxy"
    );
    setProxyEntries(onlyProxyEntry);
  }, [recordData]);

  // this fn returns the previous date (i.e 1 date before the current date)
  function getPreviousDate() {
    const presentDate = new Date(); // this gives us the present current date

    // this gives us the previous date. like 1 day previous
    const oneDayBefore = new Date(
      presentDate.getFullYear(),
      presentDate.getMonth(),
      presentDate.getDate() - 1
    );

    const now = new Date(oneDayBefore); // just formatting the previous date (1 day back of current date)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const cutOffDate = `${year}-${month}-${day}`;
    return cutOffDate;
  }

  //this fn checks returns an obj of the selected project id that has all the details inside it.
  // details => ['project id', 'name', 'assigned date', etc...]
  function getProjectAssignedDate() {
    const output = projectList.filter((ele) =>
      ele.Project_id === selectedProjectId ? ele.assign_date : ""
    );
    return output;
  }

  // this fn gives us the last friday date & checks if formDate is same then true or else false
  function checkDateIsLastFriday() {
    const presentDate = new Date(); // this gives us the present current date
    // only if its Monday then this will return last Fridays date,
    //else whichever date it is, it will return 3 days back date
    const lastFridayDate = new Date(
      presentDate.getFullYear(),
      presentDate.getMonth(),
      presentDate.getDate() - 3
    );
    const now = new Date(lastFridayDate); // just formatting the previous date (1 day back of current date)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateOfLastFriday = `${year}-${month}-${day}`;

    return dateOfLastFriday === formDate && presentDate.getDay() === 1;
  }

  // checking dates between selected date & today's date are they all holidays if yes then allow.
  const checkDatesAreHolidays = () => {
    const selectedDate = new Date(formDate); // selected date

    // difference between todays date & selected date..
    const startDate = new Date(formDate); // Assuming 'MM/DD/YYYY' format
    const endDate = new Date();

    const timeDifference = endDate.getTime() - startDate.getTime();
    const dateDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) - 1; // loop count

    let result = false;
    let holidayCount = 0;
    for (let i = 1; i < dateDifference; i++) {
      const onlyDate = String(selectedDate.getDate() + i).padStart(2, "0"); // increases 1 date
      const onlyMonth = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const onlyYear = selectedDate.getFullYear();
      const dateAhead = new Date(`${onlyYear}-${onlyMonth}-${onlyDate}`);

      const { error } = checkIsHoliday(dateAhead);
      if (error) {
        holidayCount += 1;
      }
    }

    if (holidayCount === dateDifference - 1) result = true;
    return result;
  };

  // this fn is used for calling the time entry API
  function addTimeEntryInProject() {
    if (isSubmitting) {
      return; // Prevent multiple submissions
    }
    setIsSubmitting(true);

    let data = {
      user_id: newUserId,
      date: formDate,
      time: formTime,
      description: description,
    };

    if (timeEntryOption === "project") {
      data = {
        ...data,
        project_id: selectedProjectId,
        time_entries_for: "for_project",
      };
    } else if (timeEntryOption === "task") {
      data = {
        ...data,
        task_id: selectedTaskId,
        time_entries_for: "for_task",
      };
    } else if (timeEntryOption === "proxy") {
      data = {
        ...data,
        work_for: selectedProxyId,
        time_entries_for: "for_proxy",
      };
    }

    const url = `${mainUrl}/project/time`;

    const requestOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: newBearer,
    };

    if (LoginToken) {
      //for adding time entry
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
            setDataUpdated(!dataUpdated);
            setSelectedProjectId("");
            setSelectedTaskId("");
            setSelectedProxyId("");
            setFormTime("");
            setDescription("");
            setIsSubmitting(false);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong!", "error");
    }
  }

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const onProjectChange = (value) => {
    setSelectedProjectId(value);
  };
  const onTaskChange = (value) => {
    setSelectedTaskId(value);
  };
  const onProxyChange = (value) => {
    setSelectedProxyId(value);
  };

  const projectOptions = projectList.map((project) => {
    return { label: project.Project_name, value: project.Project_id };
  });
  const taskOptions = pendingTasks.map((task) => {
    return { label: task.task_name, value: task.task_id };
  });
  const proxyOptions = [
    {
      label: "UI/UX",
      value: "UI/UX",
    },
    {
      label: "Graphic Design",
      value: "Graphic Design",
    },
    {
      label: "Post making - Content creation",
      value: "Post making - Content creation",
    },
    {
      label: "Learning - Skill development",
      value: "Learning - Skill development",
    },
    { label: "Practice - Skill honing", value: "Practice - Skill honing" },
    {
      label: "Project is not assigned - Unallocated project",
      value: "Unallocated project",
    },
    {
      label: "Task is not assigned - Unassigned task",
      value: "Unassigned task",
    },
    {
      label: "Research and development - R&D",
      value: "Research and development - R&D",
    },
    {
      label: "PUK Changes",
      value: "PUK Changes",
    },
    {
      label: "PUK Projects",
      value: "PUK Projects",
    },
    {
      label: "In House Project",
      value: "In House Project",
    },
  ];

  const onDurationChange = (value) => {
    setFormTime(value);
  };

  useEffect(() => {
    setNameOfHoliday("");
  }, [formDate]);

  // checking if the selected date is a holiday or not
  function checkIsHoliday(selectedDate) {
    let error = false;
    let holidayName = "";

    const now = new Date(selectedDate); // just formatting the previous date (1 day back of current date)
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const cutOffDate = `${year}-${month}-${day}`;

    holidayData.map((ele) => {
      if (ele.date === cutOffDate) {
        error = true;
        holidayName = ele.holiday_name;
      }
    });

    return { error, holidayName };
  }

  // Handle Submit function, triggers when user clicks on submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    timeEntryConditions();
  };

  // Basic & common conditions
  const timeEntryConditions = () => {
    if (description === "" || formTime === undefined || formTime === "") {
      ReactToastify(
        "Please make sure you've entered all fields", //Project Name, Time & Description
        "error"
      );
    } else {
      if (description.split(" ").length > 100) {
        const descriptionLength = description.split(" ").length;
        ReactToastify(
          `Description max limit is upto 100 words only... Your's is ${descriptionLength} words`,
          "error"
        );
      } else {
        if (timeEntryOption === "project") {
          projectTimeEntryConditions();
        } else if (timeEntryOption === "task") {
          taskTimeEntryConditions();
        } else if (timeEntryOption === "proxy") {
          proxyTimeEntryConditions();
        }
      }
    }
  };

  // Project time entry related conditions
  const projectTimeEntryConditions = () => {
    if (selectedProjectId === "" || !selectedProjectId) {
      ReactToastify("Please Select a Project", "error");
    } else {
      const getFullDate = getProjectAssignedDate(); // getting complete obj of the selected project
      const projectAssignedDate = getFullDate[0].assign_date.slice(0, 10); // just slicing the date (eg: 2023-10-14)

      // if employee is trying to add time entry for a date that is older than the project assigned date, then error
      if (formDate >= projectAssignedDate) {
        // if employee is trying to add time entry for yesterday's date OR last fridays date then ok
        if (
          formDate >= getPreviousDate() ||
          checkDateIsLastFriday() ||
          checkDatesAreHolidays()
        ) {
          const { error, holidayName } = checkIsHoliday(formDate);
          // if selected date is saturday / sunday / holiday then not allowing to add time entry
          if (error) {
            ReactToastify(
              `You cannot add time entries on a holiday: ${holidayName}`,
              "error"
            );
          } else {
            addTimeEntryInProject();
          }
        } else {
          // giving error if selected date > yesterday's date || checkDateIsLastFriday() returns false
          if (formDate < getPreviousDate()) {
            const previousDate = getPreviousDate();
            const now = new Date(previousDate);
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const cutOffDate = `${day}-${month}-${year}`;
            ReactToastify(
              `You cannot add time entry before ${cutOffDate}`,
              "error"
            );
          } else {
            ReactToastify(
              "You cannot add time entries for selected date",
              "error"
            );
          }
        }
      } else {
        // giving error if selected date is older than the assigned project date
        if (formDate < projectAssignedDate) {
          const getAssignedDate = new Date(projectAssignedDate);
          const year = getAssignedDate.getFullYear();
          const month = String(getAssignedDate.getMonth() + 1).padStart(2, "0");
          const day = String(getAssignedDate.getDate()).padStart(2, "0");
          const cutOffDate = `${day}-${month}-${year}`;
          ReactToastify(
            `Project was assigned to you on ${cutOffDate}, you cannot add entries before that date`,
            "error"
          );
        }
      }
    }
  };

  // Task time entry related conditions
  const taskTimeEntryConditions = () => {
    if (selectedTaskId === "" || !selectedTaskId) {
      ReactToastify("Please Select a Task Name", "error");
    } else {
      // if employee is trying to add time entry for yesterday's date OR last fridays date then ok
      if (
        formDate >= getPreviousDate() ||
        checkDateIsLastFriday() ||
        checkDatesAreHolidays()
      ) {
        const { error, holidayName } = checkIsHoliday(formDate);
        // if selected date is saturday / sunday / holiday then not allowing to add time entry
        if (error) {
          ReactToastify(
            `You cannot add time entries on a holiday: ${holidayName}`,
            "error"
          );
        } else {
          addTimeEntryInProject();
        }
      } else {
        // giving error if selected date > yesterday's date || checkDateIsLastFriday() returns false
        if (formDate < getPreviousDate()) {
          const previousDate = getPreviousDate();
          const now = new Date(previousDate);
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          const cutOffDate = `${day}-${month}-${year}`;
          ReactToastify(
            `You cannot add time entry before ${cutOffDate}`,
            "error"
          );
        } else {
          ReactToastify(
            "You cannot add time entries for selected date",
            "error"
          );
        }
      }
    }
  };

  // Proxy time entry related conditions
  const proxyTimeEntryConditions = () => {
    if (selectedProxyId === "" || !selectedProxyId) {
      ReactToastify("Please Select Worked on field", "error");
    } else {
      // if employee is trying to add time entry for yesterday's date OR last fridays date then ok
      if (
        formDate >= getPreviousDate() ||
        checkDateIsLastFriday() ||
        checkDatesAreHolidays()
      ) {
        const { error, holidayName } = checkIsHoliday(formDate);
        // if selected date is saturday / sunday / holiday then not allowing to add time entry
        if (error) {
          ReactToastify(
            `You cannot add time entries on a holiday: ${holidayName}`,
            "error"
          );
        } else {
          addTimeEntryInProject();
        }
      } else {
        // giving error if selected date > yesterday's date || checkDateIsLastFriday() returns false
        if (formDate < getPreviousDate()) {
          const previousDate = getPreviousDate();
          const now = new Date(previousDate);
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          const cutOffDate = `${day}-${month}-${year}`;
          ReactToastify(
            `You cannot add time entry before ${cutOffDate}`,
            "error"
          );
        } else {
          ReactToastify(
            "You cannot add time entries for selected date",
            "error"
          );
        }
      }
    }
  };

  // helper function for getting time entries for selected Entry_For => Project or Task or Proxy
  const getRecordEntryFor = () => {
    if (timeEntryOption === "project" || timeEntryOption === "") {
      return projectEntries;
    } else if (timeEntryOption === "task") {
      return taskEntries;
    } else if (timeEntryOption === "proxy") {
      return proxyEntries;
    } else {
      return projectEntries;
    }
  };

  // for pagination
  const [pageNumber, setPageNumber] = useState(0); // page number for the pagination
  const recordsPerPage = 5;
  const pageVisited = pageNumber * recordsPerPage;
  const pageCount = Math.ceil(getRecordEntryFor().length / recordsPerPage);

  // Method for displaying records of the user
  const displayRecords = getRecordEntryFor()
    .slice(pageVisited, pageVisited + recordsPerPage)
    .map((record, index) => {
      // converting the time 02:27:00 to 2 hrs 27 mins
      const date = new Date(`${record.date}T${record.time}Z`);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      let display = "";

      if (hours) {
        display = `${hours} hr`;
        if (hours > 1) {
          display += "s";
        }
      }

      if (minutes) {
        if (display) {
          display += " ";
        }
        display += `${minutes} min`;
        if (minutes > 1) {
          display += "s";
        }
      }

      return (
        <div className="single-entry" key={index}>
          <div
            className="entry"
            style={{
              borderLeft: `5px solid ${
                colors[Math.floor(Math.random() * colors.length)]
              }`,
            }}
          >
            <div
              className={`time-entry-title project-name ${
                toggleTheme ? "dark-text-color" : "default-text-color"
              }`}
            >
              {checkEntryFor() === "" || checkEntryFor() === "Project"
                ? "Project Name:- "
                : checkEntryFor() === "Task"
                ? "Task Name:- "
                : checkEntryFor() === "Proxy"
                ? "Worked For:- "
                : ""}
              <span
                className={`time-entry-text ${
                  toggleTheme ? "dark-sub-text-color" : "default-text-color"
                }`}
              >
                {checkEntryFor() === "Project" || checkEntryFor() === ""
                  ? record.Project_name
                  : checkEntryFor() === "Task"
                  ? record.task_name
                  : checkEntryFor() === "Proxy"
                  ? record.work_description_for_proxy
                  : "N/A"}
              </span>
              <span
                className={`is-edited ${
                  toggleTheme ? "dark-sub-text-color" : "default-text-color"
                }`}
              >
                {record.is_edit === "Yes" ? "(edited)" : ""}
              </span>
            </div>
            <div
              className={`project-time time-entry-title ${
                toggleTheme ? "dark-text-color" : "default-text-color"
              }`}
            >
              Worked on:-{" "}
              <span
                className={`time-entry-text ${
                  toggleTheme ? "dark-sub-text-color" : "default-text-color"
                }`}
              >
                {(() => {
                  const date = new Date(record.date);
                  return date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                })()}
              </span>
              <span
                className={`time-entry-title ${
                  toggleTheme ? "dark-text-color" : "default-text-color"
                }`}
              >
                {/* Time spent:-  {record.time} hrs */}
                Time spent:-{" "}
                <span className="time-entry-text">{display || "0 min"}</span>
              </span>
            </div>
            <div
              className={`project-description time-entry-title ${
                toggleTheme ? "dark-text-color" : "default-text-color"
              }`}
            >
              Work description:-{" "}
              <span
                className={` time-entry-text ${
                  toggleTheme ? "dark-sub-text-color" : "default-text-color"
                }`}
              >
                {record.description === "" ? "N.A" : record.description}
              </span>
            </div>
          </div>

          <div>
            <EditTimeEntryModal
              entryData={record}
              projectOptions={projectOptions}
              taskOptions={taskOptions}
              proxyOptions={proxyOptions}
              dataUpdated={dataUpdated}
              setDataUpdated={setDataUpdated}
            />
          </div>
        </div>
      );
    });

  // component for displaying time entry form on UI
  const timeEntryForm = (option) => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group
          className={`mb-3 row__add-time-in-project-form`}
          // controlId="formBasicPassword"
        >
          <Form.Label
            className={`row-label__add-time-in-project-form ${
              toggleTheme ? "dark-text-color" : "default-text-color"
            }`}
          >
            {option === "project"
              ? "Project Name:"
              : option === "task"
              ? "Task Name:"
              : option === "proxy"
              ? "Worked on:"
              : ""}
          </Form.Label>
          <div className="row-input__add-time-in-project-form">
            <Select
              className="default-text-color add-time-in-project-select-input"
              showSearch
              onClear={
                option === "project"
                  ? () => setSelectedProjectId("")
                  : option === "task"
                  ? () => setSelectedTaskId("")
                  : option === "proxy"
                  ? () => setSelectedProxyId("")
                  : ""
              }
              allowClear={true}
              value={
                option === "project"
                  ? selectedProjectId
                  : option === "task"
                  ? selectedTaskId
                  : option === "proxy"
                  ? selectedProxyId
                  : ""
              }
              placeholder={
                option === "project"
                  ? "Select a Project..."
                  : option === "task"
                  ? "Select a Task..."
                  : option === "proxy"
                  ? "Select Proxy option..."
                  : ""
              }
              optionFilterProp="children"
              onChange={
                option === "project"
                  ? onProjectChange
                  : option === "task"
                  ? onTaskChange
                  : option === "proxy"
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
                option === "project"
                  ? projectOptions
                  : option === "task"
                  ? taskOptions
                  : option === "proxy"
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
              disabled
              className="form-control default__input"
              style={{ cursor: "not-allowed", margin: "0" }}
              value={formDate}
              type="date"
              id="formDate"
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
            Duration:
          </Form.Label>
          <Select
            className="default-text-color row-input__add-time-in-project-form"
            showSearch
            onClear={() => {
              setFormTime("");
            }}
            value={formTime}
            allowClear={true}
            placeholder="Select time..."
            optionFilterProp="children"
            onChange={onDurationChange}
            // onSearch={onSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
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
          <div className="row-input__add-time-in-project-form">
            <Form.Control
              className="form-control default__input description-box"
              style={{ margin: "0" }}
              as="textarea"
              placeholder="Enter your Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Form.Group>
        <Button className="btn default-button" type="submit">
          Submit
        </Button>
      </Form>
    );
  };

  // helper function
  function checkEntryFor() {
    if (timeEntryOption === "" || timeEntryOption === "project") {
      return "Project";
    } else if (timeEntryOption === "task") {
      return "Task";
    } else if (timeEntryOption === "proxy") {
      return "Proxy";
    } else {
      return "";
    }
  }

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <PageHeader />
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } ${isOpen ? "open" : ""}`}
      >
        <div className="mt-2 existing-projects-page">
          {/* Form section */}
          <div
            className={`page__top-section default-section-block ${
              toggleTheme ? "dark" : ""
            }`}
          >
            {/* For checking records */}
            <div className="row check__records">
              <Calendar
                className="react-calendar calendar"
                tileClassName="tile"
                maxDate={new Date()}
                value={calendarDate}
                onChange={(date) => {
                  setCalendarDate(date);
                  setRecordDate(date);
                }}
              />
            </div>
            {/* new code */}
            <div className="form__div-box add-time-in-projects">
              <div className={`add-time-in-projects__header `}>
                <Form.Group>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Form.Label
                      className={`${
                        toggleTheme ? "dark-text-color" : "default-text-color"
                      }`}
                    >
                      Add Time Entry for:
                    </Form.Label>
                    <RadioGroup
                      style={{ marginLeft: "50px" }}
                      row
                      aria-labelledby="add-new-user-type-radio-group"
                      name="add-new-user-type"
                      value={timeEntryOption}
                      onChange={(e) => setTimeEntryOption(e.target.value)}
                    >
                      <FormControlLabel
                        className={`time-entry-radio-button ${
                          toggleTheme
                            ? "dark-sub-text-color"
                            : "default-text-color"
                        }`}
                        value="project"
                        control={<Radio />}
                        label="Project"
                      />
                      <FormControlLabel
                        className={`time-entry-radio-button ${
                          toggleTheme
                            ? "dark-sub-text-color"
                            : "default-text-color"
                        }`}
                        value="task"
                        control={<Radio />}
                        label="Task"
                      />
                      <FormControlLabel
                        className={`time-entry-radio-button ${
                          toggleTheme
                            ? "dark-sub-text-color"
                            : "default-text-color"
                        }`}
                        value="proxy"
                        control={<Radio />}
                        label="Proxy"
                      />
                    </RadioGroup>
                  </div>
                </Form.Group>
              </div>
              <div className="add-time-in-projects__form__block">
                {timeEntryOption === "project"
                  ? timeEntryForm("project")
                  : timeEntryOption === "task"
                  ? timeEntryForm("task")
                  : timeEntryOption === "proxy"
                  ? timeEntryForm("proxy")
                  : ""}
              </div>
            </div>
          </div>

          <div className={`default-section-block ${toggleTheme ? "dark" : ""}`}>
            {/* Table section for displaying the time records */}
            <div className="table__section">
              {loading ? (
                <TailSpin
                  height="80"
                  width="80"
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
                <div>
                  <h4
                    className={`pl-1 ${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    }`}
                    style={{ textDecoration: "underline" }}
                  >
                    Work Entries for: {checkEntryFor()}
                  </h4>
                  <div className="time-entry-section">
                    {getRecordEntryFor().length > 0 ? (
                      <div className="time-entry-table">{displayRecords}</div>
                    ) : (
                      <h5
                        style={{ fontWeight: "600", color: "red" }}
                        className="mt-2"
                      >
                        {/* {message} */}
                        No Records Found for the selected Date
                      </h5>
                    )}
                  </div>
                </div>
              )}

              {getRecordEntryFor().length > 5 ? (
                <div className="pagination">
                  <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    // disabledClassName='paginationDisabled'
                    renderOnZeroPageCount={null}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </>
  );
};

export default AddTimeInProject;
