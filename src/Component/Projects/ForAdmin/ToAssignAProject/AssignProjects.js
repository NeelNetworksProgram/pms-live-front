// libraries
import React, { useState, useEffect, useContext, useMemo } from "react";
import { TailSpin } from "react-loader-spinner";
import ReactQuill from "react-quill";
import { renderToString } from "react-dom/server";
import { Select } from "antd";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

// components
import Navbar from "../../../Navbar/Navbar";
import { UserContext } from "../../../../Context/UserContext";
import AssignProjectUsersModal from "./AssignProjectUsersModal";
import ReactToastify from "../../../Utility/ReactToastify";
import { projectCategoryOptions } from "../../../Utility/ProjectCategoryOptions";
import { ContextTheme } from "../../../../Context/ThemeContext";
import { PageHeader } from "../../../Utility/PageHeader";
import { PageFooter } from "../../../Utility/PageFooter";
import { employeeJobRoleOptions } from "../../../Utility/EmployeeJobRoleOptions";

// using react table
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

// styling
import "react-quill/dist/quill.snow.css";
import "../../../../stylesheet/Projects/Projects.css";
import "../../../../stylesheet/App.css";
import "../../../../stylesheet/Projects/AssignProject.css";

const AssignProject = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token

  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const [userList, setUserList] = useState([]); // storing all the users usernames
  const [selectedUser, setSelectedUser] = useState(""); // selected particular user id
  const [selectedUsername, setSelectedUsername] = useState(""); // selected particular username

  const [projectList, setProjectList] = useState([]); // storing all the projects names
  const [selectedProject, setSelectedProject] = useState(""); // selected particular project name

  const [optionsForProject, setOptionsForProject] = useState([]);
  const [projectCompletionTime, setProjectCompletionTime] = useState("");
  const [filteredAssignedList, setFilteredAssignedList] = useState([]);
  const [dataUpdated, setDataUpdated] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // helper function for getting label of Project category
  const getCategory = (categoryValue) => {
    const categoryLabel = projectCategoryOptions.filter(
      (ele) => ele.value === categoryValue
    );
    return categoryLabel;
  };

  const defaultDescription = () => {
    return (
      <>
        <p>Hi, you've been assigned with a new project...</p>
        <p>Estimated Time to complete this project...</p>
      </>
    );
  };

  const [description, setDescription] = useState("");
  // renderToString(defaultDescription());
  const [testDescription, setTestDescription] = useState("");

  const [deallocateProjectStatus, setDeallocateProjectStatus] = useState(false);

  // For getting users info
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
        // used for getting users name inside the select html tag
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
            const userData = result.data;
            const filteredData = userData.filter((ele) => {
              return (
                ele.roles === "employee" &&
                ele.is_active === "1" &&
                ele.status === "active"
              );
            });
            setUserList(filteredData);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Sorry you are not authorised, please login again");
      localStorage.clear();
    }
  }, []);

  // for clearing all the states after form submits
  const handleClear = () => {
    setSelectedProject("");
    setSelectedUser("");
    setSelectedCategory("");
    setDescription("");
    // renderToString(defaultDescription())
    setTestDescription("");
    setProjectCompletionTime("");
  };

  // Once this form is submitted the selected employee will be assigned with the selected project
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (isSubmitting) {
        return; // Prevent multiple submissions
      }
      setIsSubmitting(true);

      if (selectedUser === "" || selectedUser === undefined) {
        ReactToastify("Please select an employee", "error");
      } else if (selectedProject === "" || selectedProject === undefined) {
        ReactToastify("Please select a project", "error");
      } else if (selectedCategory === "" || selectedCategory === undefined) {
        ReactToastify("Please select a category", "error");
      } else if (projectCompletionTime === "" || !projectCompletionTime) {
        ReactToastify("Please enter project completion time", "error");
      } else if (description === "" || description === null) {
        ReactToastify("Please enter project description", "error");
      } else {
        setLoading(true);
        const url = `${mainUrl}/project/assign`;
        const data = {
          user_id: selectedUser,
          project_id: selectedProject,
          assign_by: newUserId,
          work_description: description,
          user_category: selectedCategory,
          completion_time: projectCompletionTime,
        };

        if (LoginToken) {
          // this fetch is used to POST data for assigning a project to a user
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
              setLoading(false);
              if (result.error) {
                if (result.status === 400) {
                  const err = Object.values(result.message);
                  err.map((error) => {
                    ReactToastify(error, "error");
                  });
                }
                ReactToastify(result.message, "error");
              } else {
                ReactToastify(result.message, "success");
                handleClear();
                setDataUpdated(!dataUpdated);
              }
            })
            .catch((error) => {
              ReactToastify(error, "error");
            });
        } else {
          ReactToastify("Something went wrong!", "error");
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // filtering out the whole data set and return only required fields
  const filteringAndReducing = (data) => {
    const result = {};
    data.forEach((item) => {
      if (result[item.project_id]) {
        result[item.project_id].users.push({
          username: item.assign_to_user_name,
          user_id: item.assign_to_user_id,
          user_category: item.user_category,
          assigned_by: item.assigned_by_username,
          estimation_time: item.completion_time,
          work_description: item.work_description,
          Assigned_Date: item.assigned_date,
          project_deallocate: item.project_deallocate,
          deallocate_date: item.deallocate,
          project_assign_id: item.assign_id,
        });
      } else {
        result[item.project_id] = {
          project_id: item.project_id,
          project_no: item.project_no,
          project_name: item.Project_name,
          project_category: item.project_category,
          users: [
            {
              username: item.assign_to_user_name,
              user_id: item.assign_to_user_id,
              user_category: item.user_category,
              estimation_time: item.completion_time,
              work_description: item.work_description,
              assigned_by: item.assigned_by_username,
              Assigned_Date: item.assigned_date,
              project_deallocate: item.project_deallocate,
              deallocate_date: item.deallocate,
              project_assign_id: item.assign_id,
            },
          ],
        };
      }
    });
    const output = Object.values(result);
    return output;
  };

  // For getting projects info
  useEffect(() => {
    if (LoginToken) {
      fetch(`${mainUrl}/project`, {
        // used for getting projects name inside the select html tag
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
            const list = result.data; // getting projects list as a result from fetch api call
            setProjectList(list); // storing projects list in a state, will iterate through this list and make out a dropdown from the same.
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
    }
  }, []);

  // Used for listing overall assigned projects on the page
  useEffect(() => {
    setLoading(true);

    if (LoginToken) {
      const url = `${mainUrl}/project/assignlist/${newUserId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      // getting overall assigned projects list
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
            const err = Object.values(result.message);
            ReactToastify(err, "error");
          } else {
            const data = result.project_list;
            setFilteredAssignedList(filteringAndReducing(data));
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong!", "error");
    }
  }, [dataUpdated, deallocateProjectStatus]);

  // for pagination
  const [pageNumber, setPageNumber] = useState(0); // page number for the pagination
  const projectsPerPage = 10;
  const pageVisited = pageNumber * projectsPerPage;
  const pageCount = Math.ceil(filteredAssignedList.length / projectsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // Using React table
  const Columns = [
    {
      Header: "Project ID",
      Cell: ({ row }) =>
        row.original.project_no !== "" ? row.original.project_no : "N/A",
    },
    {
      Header: "Project Name",
      Cell: ({ row }) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 10px",
              columnGap: "15px",
            }}
          >
            <p style={{ textAlign: "left" }}>{row.original.project_name}</p>
            <div style={{ color: "#0b1338" }}>
              <AssignProjectUsersModal
                dataUpdated={dataUpdated}
                setDataUpdated={setDataUpdated}
                data={row.original}
                project_id={row.original.project_id}
                id={row.original.project_id}
                setDeallocateProjectStatus={setDeallocateProjectStatus}
                deallocateProjectStatus={deallocateProjectStatus}
              />
            </div>
          </div>
        );
      },
    },
    {
      Header: "Category",
      Cell: ({ row }) => {
        const category = getCategory(row.original.project_category); // [{value , label}]

        const getLabel = () =>
          category.length > 0 ? category[0].label : "N/A";

        return getLabel();
      },
    },
  ];

  const columns = useMemo(() => Columns, []);
  const data = useMemo(() => filteredAssignedList, [filteredAssignedList]);

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

  // for ant design select search dropdown
  const onUserChange = (value, label) => {
    setSelectedUsername(label.label);
    setSelectedUser(value);
  };
  const onProjectChange = (value) => {
    setSelectedProject(value);
  };
  const onCategoryChange = (value) => {
    setSelectedCategory(value);
  };
  // const onSearch = (value) => {
  //   // console.log("search:", value);
  // };

  const userOptions = userList.map((user) => {
    return { label: user.username, value: user.id };
  });

  // helper function to distinguish user is already assigned with the selected project or not
  const setProjectOptions = () => {
    const newProjectList = projectList.map((project) => {
      if (project.assign_to !== null && project.assign_to !== "") {
        return { ...project, assign_to: project.assign_to.split(",") };
      } else {
        return { ...project };
      }
    });

    const projectOptions = newProjectList
      .filter(({ project_status }) => project_status === "Running")
      .map(({ assign_to, project_name, project_id }) => {
        const checkUser = () => {
          if (assign_to !== null) {
            return assign_to.includes(selectedUsername);
          }
        };

        return {
          label: checkUser() ? `${project_name} - ✅` : project_name,
          value: project_id,
        };
      });

    setOptionsForProject(projectOptions);
  };

  // for displaying projects in select a project dropdown
  useEffect(() => {
    setProjectOptions();
  }, [selectedUsername]);

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <PageHeader />
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } ${isOpen ? "open" : ""}`}
      >
        <div className="assign-projects-page mt-2">
          <div className={`default-section-block ${toggleTheme ? "dark" : ""}`}>
            <h5
              className={`${
                toggleTheme ? "dark-text-color" : "default-text-color"
              }`}
            >
              Select an employee and a project that you want to assign
            </h5>

            <div className="assign__project">
              <form className="assign__project__form" onSubmit={handleSubmit}>
                {/* <!-- Selecting a User input --> */}
                <div className="form-outline assign-project-select-div">
                  <label
                    className={`form-label assign-project-select-label ${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    Select an Employee:
                  </label>
                  <Select
                    className="assign-project-select-input react__select__tag-assign__project"
                    showSearch
                    value={selectedUser}
                    onClear={() => {
                      setSelectedUser("");
                      setSelectedUsername("");
                    }}
                    allowClear={true}
                    placeholder="Select an Employee..."
                    optionFilterProp="children"
                    onChange={onUserChange}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={userOptions}
                  />
                </div>

                {/* <!-- Selecting a Project input --> */}
                <div className="form-outline assign-project-select-div">
                  <label
                    className={`form-label assign-project-select-label ${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    Select a Project:
                  </label>
                  <Select
                    className="assign-project-select-input react__select__tag-assign__project"
                    showSearch
                    value={selectedProject}
                    onClear={() => setSelectedProject("")}
                    allowClear={true}
                    placeholder="Select a Project..."
                    optionFilterProp="children"
                    onChange={onProjectChange}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={optionsForProject}
                  />
                </div>

                {/* <!-- Selecting a Category input --> */}
                <div className="form-outline assign-project-select-div">
                  <label
                    className={`form-label assign-project-select-label ${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    Select Job Role:
                  </label>
                  <Select
                    className="assign-project-select-input react__select__tag-assign__project"
                    showSearch
                    value={selectedCategory}
                    onClear={() => setSelectedCategory("")}
                    allowClear={true}
                    placeholder="Select Job Role..."
                    optionFilterProp="children"
                    required
                    onChange={onCategoryChange}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={employeeJobRoleOptions}
                  />
                </div>

                {/* <!-- Estimated time for completing project input --> */}
                <div className="form-outline assign-project-select-div">
                  <label
                    className={`form-label assign-project-select-label ${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    Project Completion Time (in hours):
                  </label>
                  <input
                    className="custom-styling__assign-project-select-input"
                    placeholder="Enter completion time in hours"
                    type="number"
                    min="1"
                    required
                    value={projectCompletionTime}
                    onChange={(e) => setProjectCompletionTime(e.target.value)}
                  />
                </div>

                {/* <!-- Add time button --> */}
                <div className="form-outline">
                  <Button
                    type="submit"
                    className="btn default-button assign__project__btn"
                  >
                    Assign Project
                  </Button>
                </div>
              </form>
              {/* </div> */}
              {/* <div className="assign-project-box"> */}
              <div
                className={`editor ${
                  toggleTheme ? "dark-sub-text-color" : "default-text-color"
                }`}
              >
                <p
                  className={`assign-project-note ${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  Add a note
                </p>
                <ReactQuill
                  theme="snow"
                  value={description}
                  onChange={setDescription}
                  placeholder="Write a short brief about the project..."
                  modules={modules}
                  className={`react-quill-editor`}
                />
              </div>
            </div>
          </div>

          {/* Projects assigned entire list */}
          <div className={`default-section-block ${toggleTheme ? "dark" : ""}`}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h5
                className={`${
                  toggleTheme ? "dark-text-color" : "default-text-color"
                }`}
              >
                Assigned Projects List
              </h5>
              <Link to="/projects/email-logs">
                <Button className="btn default-button">Email Logs</Button>
              </Link>
            </div>
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
            ) : filteredAssignedList.length >= 1 ? (
              <table
                {...getTableProps()}
                className="table default__table__section text-center default__table__content"
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
                              <span className="table-heading-span-styling-title">
                                {column.render("Header")}
                              </span>
                              {/* <span>
                              {column.Header === "Edit" ||
                              column.Header === "Delete" ? (
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
                            </span> */}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, index) => {
                    prepareRow(row);
                    return (
                      <tr
                        className={`default-projects-table__values ${
                          toggleTheme
                            ? "dark-sub-text-color"
                            : "default-text-color"
                        } `}
                        {...row.getRowProps()}
                        key={index}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="assign-projects-table-body-rows-td"
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
            ) : (
              <div
                style={{ fontWeight: "600", color: "red", fontSize: "18px" }}
              >
                <p>No Data Found 🙁</p>
                {/* {message} */}
              </div>
            )}
            {filteredAssignedList.length > 10 ? (
              <div>
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

export default AssignProject;
