// libraries
import React, { useState, useEffect, useMemo, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import { CSVLink } from "react-csv";
import Multiselect from "multiselect-react-dropdown";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";
import Button from "react-bootstrap/Button";

// components
import Navbar from "../Navbar/Navbar";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { CommonGlobalFilter } from "../GlobalFilter/CommonGlobalFilter";
import { ContextTheme } from "../../Context/ThemeContext";

// styling
import "react-calendar/dist/Calendar.css";
import "../../stylesheet/App.css";
import "../../stylesheet/Reports/Reports.css";

// using react table
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { formatDateTime } from "../Utility/formatDateTime";

const Reports = ({ isOpen, setIsOpen }) => {
  // used for toggling loading spinner
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);
  const [loading, setLoading] = useState(false);

  // fetching logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  // fetching logged in user login token
  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // states
  const [users, setUsers] = useState([]); // all users data
  const [projects, setProjects] = useState([]); // all projects data

  // multiselect users
  const [multiSelectUsers, setMultiSelectUsers] = useState([]);

  // multiselect projects
  const [multiSelectProjects, setMultiSelectProjects] = useState([]);

  // multiselect time entry category
  const [multiSelectEntryCategory, setMultiSelectEntryCategory] = useState([]);

  // datepicker range date
  const [rangeStartDate, setRangeStartDate] = useState("");
  const [rangeEndDate, setRangeEndDate] = useState("");

  const [startDate, setStartDate] = useState(new Date()); // start date
  const [endDate, setEndDate] = useState(new Date()); // end date

  // for displaying the date on screen
  const [displayStartDate, setDisplayStartDate] = useState("");
  const [displayEndDate, setDisplayEndDate] = useState("");

  // project categories.. all projects / completed projects / running projects
  const projectCategory = [
    {
      value: "all",
      label: "All Projects",
    },
    {
      value: "running",
      label: "Running Projects",
    },
    {
      value: "completed",
      label: "Completed Projects",
    },
  ];

  // users options for multiselect dropdown
  const usersOptions = users.map((user) => {
    return { id: user.id, username: user.username };
  });

  // projects options for multiselect dropdown
  const projectsOptions = projects.map((project) => {
    return { id: project.project_id, projectName: project.project_name };
  });

  // time entry options for multiselect dropdown
  const timeEntryOptions = [
    { entryName: "Project Entry", entryValue: "for_project" },
    { entryName: "Task Entry", entryValue: "for_task" },
    { entryName: "Proxy Entry", entryValue: "for_proxy" },
  ];

  // state for storing the report data, this data is used for react table
  const [recordData, setRecordData] = useState([]); // this stores the records data
  const [message, setMessage] = useState(""); // used to store the response msg

  // constructing headers for CSV Link
  const headers = [
    { label: "Employee Name", key: "Employee_Name" },
    { label: "Project Name", key: "Project_Name" },
    { label: "Task Name", key: "Task_Name" },
    { label: "Proxy Entry for", key: "work_description_for_proxy" },
    { label: "Working hrs", key: "Total_spent_time" },
    { label: "Worked on", key: "Worked_on" },
    { label: "Description", key: "Work_Description" },
  ];

  // code for adding date picker from Ant Design
  const { RangePicker } = DatePicker;
  const onChange = (date) => {
    if (date) {
      console.log("Date: ", date);
    } else {
      console.log("Clear");
    }
  };

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      let rangeDates = [];
      dates.map((date) => {
        rangeDates.push(date.$d);
      });
      let startingDate = rangeDates[0];
      let endingDate = rangeDates[1];

      setRangeStartDate(startingDate);
      setRangeEndDate(endingDate);
    } else {
      setRangeStartDate(new Date());
      setRangeEndDate(new Date());
    }
  };

  // this code is used to define the date range in Datepicker of Ant design
  const rangePresets = [
    {
      label: "Last 7 Days",
      value: [dayjs().add(-7, "d"), dayjs()],
    },
    {
      label: "Last 14 Days",
      value: [dayjs().add(-14, "d"), dayjs()],
    },
    {
      label: "Last 30 Days",
      value: [dayjs().add(-30, "d"), dayjs()],
    },
    {
      label: "Last 90 Days",
      value: [dayjs().add(-90, "d"), dayjs()],
    },
    {
      label: "Last 1 Year",
      value: [dayjs().add(-365, "d"), dayjs()],
    },
  ];

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
            setUsers(userData);
            setLoading(false);
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

  // used to get all the projects data
  useEffect(() => {
    const url = `${mainUrl}/project`;

    const requestOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: newBearer,
    };

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
        } else {
          setProjects(result.data);
        }
      })
      .catch((error) => {
        ReactToastify(error, "error");
      });
  }, []);

  // function just to filter out the report data
  const filterData = (data) => {
    // filter by name & project & entry category
    if (
      multiSelectUsers.length > 0 &&
      multiSelectProjects.length > 0 &&
      multiSelectEntryCategory.length > 0
    ) {
      const selectedUserName = multiSelectUsers.map(({ username }) => username);
      const selectedProjects = multiSelectProjects.map(
        ({ projectName }) => projectName
      );
      const selectedEntryCategory = multiSelectEntryCategory.map(
        ({ entryValue }) => entryValue
      );

      const filterByNameAndProjectAndEntryCategory = (arr) =>
        arr.filter(
          ({ Employee_Name, Project_Name, entries_for }) =>
            selectedUserName.includes(Employee_Name) &&
            selectedProjects.includes(Project_Name) &&
            selectedEntryCategory.includes(entries_for)
        );

      const filteredData = filterByNameAndProjectAndEntryCategory(data);
      setRecordData(filteredData);
    }
    // filter by name & project
    else if (multiSelectUsers.length > 0 && multiSelectProjects.length > 0) {
      const selectedUserName = multiSelectUsers.map(({ username }) => username);
      const selectedProjects = multiSelectProjects.map(
        ({ projectName }) => projectName
      );

      const filterByNameAndProject = (arr) =>
        arr.filter(
          ({ Employee_Name, Project_Name }) =>
            selectedUserName.includes(Employee_Name) &&
            selectedProjects.includes(Project_Name)
        );

      const filteredData = filterByNameAndProject(data);
      setRecordData(filteredData);
    }
    // filter by name & category
    else if (
      multiSelectUsers.length > 0 &&
      multiSelectEntryCategory.length > 0
    ) {
      const selectedUserName = multiSelectUsers.map(({ username }) => username);
      const selectedEntryCategory = multiSelectEntryCategory.map(
        ({ entryValue }) => entryValue
      );

      const filterByNameAndEntryCategory = (arr) =>
        arr.filter(
          ({ Employee_Name, entries_for }) =>
            selectedUserName.includes(Employee_Name) &&
            selectedEntryCategory.includes(entries_for)
        );

      const filteredData = filterByNameAndEntryCategory(data);
      setRecordData(filteredData);
    }
    // filter by project & category
    else if (multiSelectUsers.length > 0 && multiSelectProjects.length > 0) {
      const selectedUserName = multiSelectUsers.map(({ username }) => username);
      const selectedProjects = multiSelectProjects.map(
        ({ projectName }) => projectName
      );

      const filterByNameAndProject = (arr) =>
        arr.filter(
          ({ Employee_Name, Project_Name }) =>
            selectedUserName.includes(Employee_Name) &&
            selectedProjects.includes(Project_Name)
        );

      const filteredData = filterByNameAndProject(data);
      setRecordData(filteredData);
    }
    // filter by only name
    else if (multiSelectUsers.length > 0) {
      const selectedUserName = multiSelectUsers.map(({ username }) => username);

      const filterByName = (arr) =>
        arr.filter(({ Employee_Name }) =>
          selectedUserName.includes(Employee_Name)
        );

      const filteredData = filterByName(data);
      setRecordData(filteredData);
    }
    // filter by only project
    else if (multiSelectProjects.length > 0) {
      const selectedProjects = multiSelectProjects.map(
        ({ projectName }) => projectName
      );

      // filter by projects
      const filterByProject = (arr) =>
        arr.filter(({ Project_Name }) =>
          selectedProjects.includes(Project_Name)
        );

      const filteredData = filterByProject(data);
      setRecordData(filteredData);
    }
    // filter by only category
    else if (multiSelectEntryCategory.length > 0) {
      const selectedEntryCategory = multiSelectEntryCategory.map(
        ({ entryValue }) => entryValue
      );

      // filter by projects
      const filterByEntryCategory = (arr) =>
        arr.filter(({ entries_for }) =>
          selectedEntryCategory.includes(entries_for)
        );

      const filteredData = filterByEntryCategory(data);
      setRecordData(filteredData);
    }
    // setting complete dataset as it is without filters.
    else {
      setRecordData(data);
    }
  };

  // used to get all records within a date range selected, default is of current date
  const getTimeEntries = (startDate, endDate) => {
    // formatting start date
    const year1 = startDate.getFullYear();
    const month1 = (startDate.getMonth() + 1).toString().padStart(2, "0");
    const day1 = startDate.getDate().toString().padStart(2, "0");
    const newStartDate = `${year1}-${month1}-${day1}`;
    const showStartDate = `${day1}/${month1}/${year1}`;
    setDisplayStartDate(showStartDate);

    // formatting end date
    const year2 = endDate.getFullYear();
    const month2 = (endDate.getMonth() + 1).toString().padStart(2, "0");
    const day2 = endDate.getDate().toString().padStart(2, "0");
    const newEndDate = `${year2}-${month2}-${day2}`;
    const showEndDate = `${day2}/${month2}/${year2}`;
    setDisplayEndDate(showEndDate);

    const url = `${mainUrl}/reports/within-time-range/${newUserId}/${newStartDate}/${newEndDate}`;
    setLoading(true);
    fetch(url, {
      // used to get all records within a date range
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
          setLoading(false);
          const errorData = result.messages;
          if (typeof errorData === "object") {
            Object.values(errorData).forEach((error) => setMessage(error));
          } else {
            setMessage(result.message);
          }
          setRecordData([]);
        } else {
          setLoading(false);
          const data = result.data;
          filterData(data);
        }
      })
      .catch((error) => ReactToastify(error, "error"));
  };

  // Handling get report button to Get the Time entries depending on the filters
  const handleGetReport = () => {
    // if start and end date are given then filter data accordingly
    if (rangeStartDate && rangeEndDate) {
      getTimeEntries(rangeStartDate, rangeEndDate);
      setStartDate(rangeStartDate);
      setEndDate(rangeEndDate);
    } else {
      getTimeEntries(startDate, endDate);
    }
  };

  // Using React table
  const Columns = [
    {
      Header: "Sr No.",
      Cell: ({ row }) => parseInt(row.id) + 1,
    },
    {
      Header: "Employee Name",
      accessor: "Employee_Name",
    },
    {
      Header: "Entry for",
      accessor: "entries_for",
      Cell: ({ row }) =>
        row.original.entries_for === "for_project"
          ? "Project Entry"
          : row.original.entries_for === "for_task"
          ? "Task Entry"
          : row.original.entries_for === "for_proxy"
          ? "Proxy Entry"
          : "---",
    },
    {
      Header: "Worked on",
      Cell: ({ row }) =>
        row.original.Project_Name !== "NA"
          ? row.original.Project_Name
          : row.original.Task_Name !== "NA"
          ? row.original.Task_Name
          : row.original.work_description_for_proxy !== null ||
            row.original.work_description_for_proxy !== "NA"
          ? row.original.work_description_for_proxy
          : "---",
    },
    {
      Header: "Working hrs",
      accessor: "Total_spent_time",
      Cell: (row) => {
        // converting the time 02:27:00 to 2 hrs 27 mins
        const timeString = row.value;
        const [hours, minutes] = timeString
          .split(":")
          .map((num) => parseInt(num));
        const formattedTime = `${hours} ${
          hours > 1 ? "hrs" : "hr"
        } ${minutes} mins`;
        return formattedTime;
      },
    },
    {
      Header: "Date",
      accessor: "Worked_on",
      // Cell: (row) => formatDateTime(row.value),
      Cell: (row) => {
        const date = new Date(row.value);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      Header: "Description",
      accessor: "Work_Description",
      Cell: (row) => (row.value ? row.value : "---"),
    },
  ];

  const columns = useMemo(() => Columns, []);
  const data = useMemo(() => recordData, [recordData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    pageOptions,
    canNextPage,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <PageHeader />
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } ${isOpen ? "open" : ""}`}
      >
        <div className="mt-2 reports-page">
          <div
            className={`filter-div default-section-block ${
              toggleTheme ? "dark" : ""
            }`}
          >
            <div className="filters-wrapper">
              {/* employee select box */}
              <div className="filter-box">
                <Multiselect
                  options={usersOptions}
                  // displayValue={usersOptions.map((user) => user.id)}
                  // selectedValues={users.map((user) => user.username)}
                  isObject={true}
                  displayValue="username" // specify the property to display
                  valueProp="id" // specify the property to use as the selected value
                  onSelect={(e) => setMultiSelectUsers(e)}
                  onRemove={(e) => setMultiSelectUsers(e)}
                  placeholder="Select Employee..."
                  className="multiselect-users employee-select-box-input"
                />
              </div>
              {/* select options for report time filter */}
              <div className="filter-box">
                <Space direction="vertical">
                  <RangePicker
                    presets={rangePresets}
                    onChange={onRangeChange}
                    onRemove={onRangeChange}
                    className="range-picker range-picker-placeholer-color"
                  />
                </Space>
              </div>

              {/* Project select box */}
              <div className="filter-box">
                <Multiselect
                  options={projectsOptions}
                  isObject={true}
                  displayValue="projectName" // specify the property to display
                  valueProp="id" // specify the property to use as the selected value
                  onSelect={(e) => setMultiSelectProjects(e)}
                  onRemove={(e) => setMultiSelectProjects(e)}
                  placeholder="Select Project..."
                  className="multiselect-projects employee-select-box-input"
                />
              </div>

              {/* Time entry select box */}
              <div className="filter-box">
                <Multiselect
                  options={timeEntryOptions}
                  isObject={true}
                  displayValue="entryName" // specify the property to display
                  valueProp="entryValue" // specify the property to use as the selected value
                  onSelect={(e) => setMultiSelectEntryCategory(e)}
                  onRemove={(e) => setMultiSelectEntryCategory(e)}
                  placeholder="Select Entry Category..."
                  className="multiselect-projects employee-select-box-input"
                />
              </div>
            </div>

            <div className="filters-second-wrapper">
              {/* Get reports button */}
              <div className="filter-box reports-filters-buttons">
                <Button
                  className="btn default-button"
                  onClick={handleGetReport}
                >
                  Get Report
                </Button>

                {/* Export report in CSV file */}
                <CSVLink
                  data={recordData}
                  headers={headers}
                  filename={"reports.csv"}
                >
                  <i className="fa-solid fa-download export-as-csv"></i>
                </CSVLink>
              </div>
            </div>
          </div>

          {/* react table */}
          <div
            className={`default__table__section default-section-block ${
              toggleTheme ? "dark" : ""
            }`}
          >
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
                  height: "50vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                wrapperClass="loader"
                visible={true}
              />
            ) : recordData.length >= 1 ? (
              <div>
                <div className="heading-reports">
                  <h5
                    className={`${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    } pb-2 pt-1`}
                  >
                    Time Entries from: {displayStartDate} to {displayEndDate}
                    <span className="total-entries-text">
                      ({recordData.length} entries total)
                    </span>
                  </h5>
                  <div className="entry-colors">
                    <div className="projectEntry">
                      <span className="entry-color"></span>
                      <span
                        className={`entry-text ${
                          toggleTheme ? "dark-text-color" : "default-text-color"
                        }`}
                      >
                        For Project
                      </span>
                    </div>
                    <div className="taskEntry">
                      <span className="entry-color"></span>
                      <span
                        className={`entry-text ${
                          toggleTheme ? "dark-text-color" : "default-text-color"
                        }`}
                      >
                        For Task
                      </span>
                    </div>
                    <div className="proxyEntry">
                      <span className="entry-color"></span>
                      <span
                        className={`entry-text ${
                          toggleTheme ? "dark-text-color" : "default-text-color"
                        }`}
                      >
                        For Proxy
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ margin: "10px" }}>
                  <CommonGlobalFilter
                    filter={globalFilter}
                    setFilter={setGlobalFilter}
                  />
                </div>
                <table
                  {...getTableProps()}
                  className="table default__table__content"
                >
                  <thead>
                    {headerGroups.map((headerGroup) => (
                      <tr
                        className={`default-projects-table__heading ${
                          toggleTheme ? "dark-text-color" : "default-text-color"
                        }`}
                        {...headerGroup.getHeaderGroupProps()}
                      >
                        {headerGroup.headers.map((column) => {
                          return (
                            <th
                              className="default-projects-table__heading-headers"
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              <span>
                                <span>{column.render("Header")}</span>
                                <span className="table-heading-span-styling-arrow">
                                  {column.Header === "Sr No." ? (
                                    ""
                                  ) : column.isSorted ? (
                                    column.isSortedDesc ? (
                                      <span>↓</span>
                                    ) : (
                                      <span>↑</span>
                                    )
                                  ) : (
                                    <span>⇅</span>
                                  )}
                                </span>
                              </span>
                            </th>
                          );
                        })}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                      const rowStyling = {
                        backgroundColor:
                          row.original.entries_for === "for_project"
                            ? "#002855"
                            : row.original.entries_for === "for_task"
                            ? "#001233"
                            : row.original.entries_for === "for_proxy"
                            ? "#03071e"
                            : "",
                        color: "#e8e8e4",
                      };

                      prepareRow(row);
                      return (
                        <tr
                          style={rowStyling}
                          className={`default-projects-table__values`}
                          {...row.getRowProps()}
                          key={row.id}
                        >
                          {row.cells.map((cell) => {
                            return (
                              <td
                                {...cell.getCellProps()}
                                className="reports-table-body-rows-td"
                              >
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  fontWeight: "600",
                  color: "red",
                  fontSize: "18px",
                }}
              >
                {message}
              </div>
            )}
            {recordData && recordData.length > 10 ? (
              <div className="default__pagination__div">
                <span
                  className={`${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  <strong>
                    Page {pageIndex + 1} of {pageOptions.length}
                  </strong>
                </span>
                <button
                  disabled={!canPreviousPage}
                  className=" prev-button"
                  onClick={() => previousPage()}
                >
                  👈 prev
                </button>
                <button
                  disabled={!canNextPage}
                  className=" next-button"
                  onClick={() => nextPage()}
                >
                  next 👉
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <PageFooter />
    </>
  );
};

export default Reports;
