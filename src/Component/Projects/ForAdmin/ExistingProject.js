// libraries
import React, { useEffect, useState, useMemo, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import { CSVLink } from "react-csv";
import Multiselect from "multiselect-react-dropdown";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

// using react table
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";

// components
import { Projects } from "../Projects";
import UpdateProjectModal from "./ToAddAProject/UpdateProjectModal";
import DeleteProjectModal from "./ToAddAProject/DeleteProjectModal";
import AddProjectModal from "./ToAddAProject/AddProjectModal";
import { ProjectStage } from "./ToAddAProject/ProjectStage";
import { UserContext } from "../../../Context/UserContext";
import ReactToastify from "../../Utility/ReactToastify";
import { projectCategoryOptions } from "../../Utility/ProjectCategoryOptions";
import { PageFooter } from "../../Utility/PageFooter";
import { CommonGlobalFilter } from "../../GlobalFilter/CommonGlobalFilter";
import UsersInProjectModal from "./UsersInProjectModal";
import { ContextTheme } from "../../../Context/ThemeContext";
import { formatDateTime } from "../../../Component/Utility/formatDateTime";

// styling
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../../stylesheet/Projects/Projects.css";
import "../../../stylesheet/Projects/ExistingProject.css";
import "../../../stylesheet/App.css";

const ExistingProject = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);
  const [loading, setLoading] = useState(false);

  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const userRole = localStorage.getItem("userRole");

  // States
  const [message, setMessage] = useState(""); // used to store the response msg
  const [existingProject, setExistingProject] = useState([]); // storing all projects data
  const [projectsData, setProjectsData] = useState([]);
  const [projectNameUpdated, setProjectNameUpdated] = useState(true);
  const [projectDeleted, setProjectDeleted] = useState(true);
  const [projectAdded, setProjectAdded] = useState(true);

  const [userList, setUserList] = useState([]); // storing all the users usernames

  // multiselect projects
  const [multiSelectProjectsCategories, setMultiSelectProjectsCategories] =
    useState([]);
  const [multiSelectEmployees, setMultiSelectEmployees] = useState([]);
  const [multiSelectProjectsStatus, setMultiSelectProjectsStatus] = useState(
    []
  );

  // testing..states
  const [projectsCategoriesOptions, setProjectsCategoriesOptions] = useState(
    []
  );
  const [employeesOptions, setEmployeesOptions] = useState([]);
  const [projectsStatusOptions, setProjectStatusOptions] = useState([]);

  // project status options for multiselect dropdown
  const projectsStatus = [
    { statusValue: "Running", statusName: "Active Projects" },
    { statusValue: "Completed", statusName: "Completed Projects" },
    { statusValue: "Hold", statusName: "Projects On Hold" },
  ];

  // used to get all the existing projects
  useEffect(() => {
    setLoading(true);
    if (LoginToken) {
      const url = `${mainUrl}/project`; // used to get all the existing projects

      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: newBearer,
        },
      })
        .then((response) => {
          if (response.error) {
            ReactToastify(response.error, "error");
          } else {
            return response.json();
          }
        })
        .then((result) => {
          setLoading(false);
          if (result.error) {
            setMessage(result.message);
            ReactToastify(result.message.name, "error");
          } else {
            const projects = result.data;
            const updateProjectsData = projects.map((ele) => {
              if (ele.assign_to !== null && ele.assign_to !== "") {
                return { ...ele, assign_to: ele.assign_to.split(",") };
              } else {
                return { ...ele };
              }
            });

            setExistingProject(updateProjectsData);
            setProjectsData(updateProjectsData);

            if (updateProjectsData.length === 0) {
              setMessage(
                "No projects available, Kindly please add a new Project"
              );
            }
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
  }, [projectDeleted, projectNameUpdated, projectAdded]);

  // checking if user has came from homepage and clicked on any project status view all link
  const isActiveStatus = () => {
    setMultiSelectProjectsStatus([
      { statusValue: "Running", statusName: "Active Projects" },
    ]);

    const filteredData = projectsData.filter(
      ({ project_status }) => project_status === "Running"
    );
    setExistingProject(filteredData);
  };

  const isHaltStatus = () => {
    setMultiSelectProjectsStatus([
      { statusValue: "Hold", statusName: "Projects On Hold" },
    ]);

    const filteredData = projectsData.filter(
      ({ project_status }) => project_status === "Hold"
    );
    setExistingProject(filteredData);
  };

  const isCompletedStatus = () => {
    setMultiSelectProjectsStatus([
      { statusValue: "Completed", statusName: "Completed Projects" },
    ]);

    const filteredData = projectsData.filter(
      ({ project_status }) => project_status === "Completed"
    );
    setExistingProject(filteredData);
  };

  useEffect(() => {
    if (
      (location?.state?.location?.pathname === "/dashboard" ||
        location?.state?.location?.pathname === "/homepage") &&
      location?.state?.status === "active"
    ) {
      isActiveStatus();
    } else if (
      (location?.state?.location?.pathname === "/dashboard" ||
        location?.state?.location?.pathname === "/homepage") &&
      location?.state?.status === "halt"
    ) {
      isHaltStatus();
    } else if (
      (location?.state?.location?.pathname === "/dashboard" ||
        location?.state?.location?.pathname === "/homepage") &&
      location?.state?.status === "completed"
    ) {
      isCompletedStatus();
    } else {
      setMultiSelectProjectsStatus([]);
      setExistingProject(projectsData);
    }
  }, [projectsData]);

  // helper function for getting label of Project category
  const getCategory = (categoryValue) => {
    const categoryLabel = projectCategoryOptions.filter(
      (ele) => ele.value === categoryValue
    );
    return categoryLabel;
  };

  // function to set initial data in all multiselect tags
  // const projectFilterations = () => {
  //   const categoryArr = projectCategoryOptions?.map((category) => ({
  //     categoryValue: category.value,
  //     categoryName: category.label,
  //   }));
  //   setProjectsCategoriesOptions(categoryArr);

  //   const employeeArr = userList?.map((user) => ({
  //     id: user.id,
  //     username: user.username,
  //   }));
  //   setEmployeesOptions(employeeArr);

  //   const projectStatusArr = projectsStatus?.map((status) => ({
  //     statusValue: status.statusValue,
  //     statusName: status.statusName,
  //   }));
  //   setProjectStatusOptions(projectStatusArr);
  // };

  const categoryArr = projectCategoryOptions?.map((category) => ({
    categoryValue: category.value,
    categoryName: category.label,
  }));
  const employeeArr = userList?.map((user) => ({
    id: user.id,
    username: user.username,
  }));
  const projectStatusArr = projectsStatus?.map((status) => ({
    statusValue: status.statusValue,
    statusName: status.statusName,
  }));

  // calling projectFilterations function to set all initial data in all multiselect tags
  // useEffect(() => {
  //   projectFilterations();
  // }, [userList]);

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
              return ele.roles === "employee";
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

  // constructing headers for CSV Link
  const headers = [
    { label: "Project No.", key: "project_no" },
    { label: "Project Name", key: "project_name" },
    { label: "Project Category", key: "project_category" },
    { label: "Project assigned to", key: "assign_to" },
    { label: "Project status", key: "project_status" },
    { label: "Project Stage", key: "project_stage" },
    { label: "Created at", key: "created_at" },
  ];

  // Using React table
  const AdminColumns = [
    {
      Header: "Project No.",
      // accessor: "project_no",
      Cell: ({ row }) =>
        row.original.project_no !== "" ? row.original.project_no : "N/A",
    },
    {
      Header: "Project Name",
      accessor: "project_name",
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
    {
      Header: "Assigned To",
      Cell: ({ row }) => {
        const assignedTo = row.original.assign_to;
        if (row.original.project_status === "Completed") {
          return "---";
        } else if (assignedTo === null) {
          return "Not Assigned";
        } else {
          return (
            <>
              {assignedTo.length > 1 ? (
                <UsersInProjectModal
                  employees={assignedTo}
                  projectName={row.original.project_name}
                />
              ) : (
                assignedTo[0]
              )}
            </>
          );
        }
      },
    },
    {
      Header: "Project created on",
      Cell: ({ row }) => formatDateTime(row.original.created_at),
    },
    {
      Header: "Project Status",
      accessor: "project_status",
    },
    {
      Header: "Project Stage",
      accessor: "project_stage",
      Cell: ({ row }) => {
        return (
          <ProjectStage
            stage={row.original.project_stage}
            status={row.original.project_status}
          />
        );
      },
    },
    {
      Header: "Edit",
      Cell: ({ row }) => {
        return (
          <>
            <UpdateProjectModal
              setProjectNameUpdated={setProjectNameUpdated}
              updateProjectdata={row.original}
            />
          </>
        );
      },
    },
    {
      Header: "Delete",
      // accessor: "delete",
      Cell: ({ row }) => (
        <>
          <DeleteProjectModal
            id={row.original.project_id}
            name={row.original.project_name}
            setProjectDeleted={setProjectDeleted}
          />
        </>
      ),
    },
  ];

  const ManagerColumns = [
    {
      Header: "Project No.",
      Cell: ({ row }) =>
        row.original.project_no !== "" ? row.original.project_no : "N/A",
    },
    {
      Header: "Project Name",
      accessor: "project_name",
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
    {
      Header: "Assigned To",
      Cell: ({ row }) => {
        const assignedTo = row.original.assign_to;
        if (row.original.project_status === "Completed") {
          return "---";
        } else if (assignedTo === null) {
          return "Not Assigned";
        } else {
          return (
            <>
              {assignedTo.length > 1 ? (
                <UsersInProjectModal
                  employees={assignedTo}
                  projectName={row.original.project_name}
                />
              ) : (
                assignedTo[0]
              )}
            </>
          );
        }
      },
    },
    {
      Header: "Project created on",
      Cell: ({ row }) => formatDateTime(row.original.created_at),
    },
    {
      Header: "Project Status",
      accessor: "project_status",
    },
    {
      Header: "Project Stage",
      accessor: "project_stage",
      Cell: ({ row }) => (
        <ProjectStage
          stage={row.original.project_stage}
          status={row.original.project_status}
        />
      ),
    },
    {
      Header: "Edit",
      Cell: ({ row }) => {
        return (
          <>
            <UpdateProjectModal
              setProjectNameUpdated={setProjectNameUpdated}
              updateProjectdata={row.original}
            />
          </>
        );
      },
    },
  ];

  const columns = useMemo(
    () => (userRole === '"admin"' ? AdminColumns : ManagerColumns),
    []
  );
  const data = useMemo(() => existingProject, [existingProject]);

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

  // --------------------------------------------------------- //
  //helper function if category, employees & status is selected
  const filterByProjectCategoryEmployeeProjectStatus = () => {
    const selectedEmployees = multiSelectEmployees.map(
      ({ username }) => username
    );

    const selectedProjectCategories = multiSelectProjectsCategories.map(
      ({ categoryValue }) => categoryValue
    );

    const selectedProjectStatus = multiSelectProjectsStatus.map(
      ({ statusValue }) => statusValue
    );

    const filterByCategoryEmployeeStatus = (arr) => {
      return arr
        .filter(({ project_status }) =>
          selectedProjectStatus.includes(project_status)
        )
        .filter(({ project_category }) =>
          selectedProjectCategories.includes(project_category)
        )
        .filter(({ assign_to }) => {
          if (assign_to) {
            for (let i = 0; i < selectedEmployees.length; i++) {
              if (assign_to.indexOf(selectedEmployees[i]) !== -1) {
                return true;
              }
            }
          }
        });
    };

    const filteredData = filterByCategoryEmployeeStatus(projectsData);

    if (filteredData.length > 0) {
      setExistingProject(filteredData);
    } else {
      setExistingProject([]);
      setMessage("No Data Found 😕");
    }
  };

  //helper function if categories & project status is selected
  const filterByProjectStatusAndCategory = () => {
    const selectedProjectCategories = multiSelectProjectsCategories.map(
      ({ categoryValue }) => categoryValue
    );

    const selectedProjectStatus = multiSelectProjectsStatus.map(
      ({ statusValue }) => statusValue
    );

    const filterByStatusAndCategory = (arr) =>
      arr.filter(
        ({ project_status, project_category }) =>
          selectedProjectStatus.includes(project_status) &&
          selectedProjectCategories.includes(project_category)
      );

    const filteredData = filterByStatusAndCategory(projectsData);

    if (filteredData.length > 0) {
      setExistingProject(filteredData);
    } else {
      setExistingProject([]);
      setMessage("No Data Found 😕");
    }
  };

  //helper function if employees & categories are selected
  const filterByEmployeeAndProjectStatus = () => {
    const selectedEmployees = multiSelectEmployees.map(
      ({ username }) => username
    );

    const selectedProjectStatus = multiSelectProjectsStatus.map(
      ({ statusValue }) => statusValue
    );

    const filterByNameAndProjectStatus = (arr) => {
      return arr
        .filter(({ project_status }) =>
          selectedProjectStatus.includes(project_status)
        )
        .filter(({ assign_to }) => {
          if (assign_to) {
            for (let i = 0; i < selectedEmployees.length; i++) {
              if (assign_to.indexOf(selectedEmployees[i]) !== -1) {
                return true;
              }
            }
          }
        });
    };

    const filteredData = filterByNameAndProjectStatus(projectsData);

    if (filteredData.length > 0) {
      setExistingProject(filteredData);
    } else {
      setExistingProject([]);
      setMessage("No Data Found 😕");
    }
  };

  //helper function if employees & categories are selected
  const filterByEmployeeAndCategory = () => {
    const selectedEmployees = multiSelectEmployees.map(
      ({ username }) => username
    );

    const selectedProjectCategories = multiSelectProjectsCategories.map(
      ({ categoryValue }) => categoryValue
    );

    const filterByNameAndProject = (arr) => {
      return arr
        .filter(({ project_category }) =>
          selectedProjectCategories.includes(project_category)
        )
        .filter(({ assign_to }) => {
          if (assign_to) {
            for (let i = 0; i < selectedEmployees.length; i++) {
              if (assign_to.indexOf(selectedEmployees[i]) !== -1) {
                return true;
              }
            }
          }
        });
    };

    const filteredData = filterByNameAndProject(projectsData);

    if (filteredData.length > 0) {
      setExistingProject(filteredData);
    } else {
      setExistingProject([]);
      setMessage("No Data Found 😕");
    }
  };

  //helper function if employees are selected
  const filterByEmployee = () => {
    const selectedEmployees = multiSelectEmployees.map(
      ({ username }) => username
    );

    const filterByName = (arr) =>
      arr.filter((item) => {
        if (item.assign_to) {
          for (let i = 0; i < selectedEmployees.length; i++) {
            if (item.assign_to.indexOf(selectedEmployees[i]) !== -1) {
              return true;
            }
          }
        }
      });

    const filteredData = filterByName(projectsData);

    if (filteredData.length > 0) {
      setExistingProject(filteredData);
    } else {
      setExistingProject([]);
      setMessage("No Data Found 😕");
    }
  };

  //helper function if categories are selected
  const filterByProjectCategory = () => {
    const selectedProjectCategories = multiSelectProjectsCategories.map(
      ({ categoryValue }) => categoryValue
    );

    const filterByCategory = (arr) =>
      arr.filter(({ project_category }) =>
        selectedProjectCategories.includes(project_category)
      );

    const filteredData = filterByCategory(projectsData);

    if (filteredData.length > 0) {
      setExistingProject(filteredData);
    } else {
      setExistingProject([]);
      setMessage("No Data Found 😕");
    }
  };

  //helper function if project status is selected
  const filterByProjectStatus = () => {
    const selectedProjectStatus = multiSelectProjectsStatus.map(
      ({ statusValue }) => statusValue
    );

    const filterByStatus = (arr) =>
      arr.filter(({ project_status }) =>
        selectedProjectStatus.includes(project_status)
      );

    const filteredData = filterByStatus(projectsData);

    if (filteredData.length > 0) {
      setExistingProject(filteredData);
    } else {
      setExistingProject([]);
      setMessage("No Data Found 😕");
    }
  };

  // Handling get projects button
  const handleGetProjects = () => {
    // employees, categories, status selected
    if (
      multiSelectEmployees.length > 0 &&
      multiSelectProjectsCategories.length > 0 &&
      multiSelectProjectsStatus.length > 0
    ) {
      filterByProjectCategoryEmployeeProjectStatus();
    }
    // employees & categories selected
    else if (
      multiSelectEmployees.length > 0 &&
      multiSelectProjectsCategories.length > 0
    ) {
      filterByEmployeeAndCategory();
    }
    // categories & status selected
    else if (
      multiSelectProjectsCategories.length > 0 &&
      multiSelectProjectsStatus.length > 0
    ) {
      filterByProjectStatusAndCategory();
    }
    // employees & status selected
    else if (
      multiSelectEmployees.length > 0 &&
      multiSelectProjectsStatus.length > 0
    ) {
      filterByEmployeeAndProjectStatus();
    }
    // only employees selected
    else if (multiSelectEmployees.length > 0) {
      filterByEmployee();
    }
    // only categories selected
    else if (multiSelectProjectsCategories.length > 0) {
      filterByProjectCategory();
    }
    // only project status selected
    else if (multiSelectProjectsStatus.length > 0) {
      filterByProjectStatus();
    }
    // nothing selected then set as default i.e, All projects
    else {
      setExistingProject(projectsData);
    }
  };

  // helper function for resetting all filter states
  const handleReset = () => {
    window.location.reload();
    // setMultiSelectEmployees([]);
    // setMultiSelectProjectsStatus([]);
    // setMultiSelectProjectsCategories([]);
    // setExistingProject(projectsData);
    // projectFilterations();
  };

  // helper function for project category options
  const handleProjectCategoryOptions = () => {
    if (multiSelectProjectsCategories.length > 0) {
      const selectedProjectCategories = multiSelectProjectsCategories.map(
        ({ categoryValue }) => categoryValue
      );
      const afterFilter = projectsCategoriesOptions.filter(
        ({ categoryValue }) =>
          !selectedProjectCategories.includes(categoryValue)
      );
      return afterFilter;
    } else {
      return projectsCategoriesOptions;
    }
  };

  // helper function for employee options
  const handleEmployeeOptions = () => {
    if (multiSelectEmployees.length > 0) {
      const selectedEmployees = multiSelectEmployees.map(
        ({ username }) => username
      );
      const afterFilter = employeesOptions.filter(
        ({ username }) => !selectedEmployees.includes(username)
      );
      return afterFilter;
    } else {
      return employeesOptions;
    }
  };

  // helper function for project status options
  const handleProjectStatusOptions = () => {
    if (multiSelectProjectsStatus.length > 0) {
      const selectedProjectStatus = multiSelectProjectsStatus.map(
        ({ statusValue }) => statusValue
      );
      const afterFilter = projectsStatusOptions.filter(
        ({ statusValue }) => !selectedProjectStatus.includes(statusValue)
      );
      return afterFilter;
    } else {
      return projectsStatusOptions;
    }
  };

  return (
    <>
      <Projects isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } ${isOpen ? "open" : ""}`}
      >
        <div className="mt-2 existing-projects-page">
          <div
            className={`all-projects-header default-section-block ${
              toggleTheme ? "dark" : ""
            }`}
          >
            {/* add a project */}
            <div className="add-a-project">
              {userRole === '"admin"' || userRole === '"manager"' ? (
                <AddProjectModal
                  setProjectAdded={setProjectAdded}
                  projectAdded={projectAdded}
                />
              ) : (
                ""
              )}
            </div>
            {userRole === '"admin"' || userRole === '"manager"' ? (
              <CSVLink
                data={existingProject}
                headers={headers}
                filename={"projects.csv"}
              >
                <i className="fa-solid fa-download export-as-csv"></i>
              </CSVLink>
            ) : (
              ""
            )}
          </div>

          {/* Filtering Projects based upon selecting employees & project categories */}
          <div className={`default-section-block ${toggleTheme ? "dark" : ""}`}>
            <div style={{ display: "flex" }}>
              <p
                className={`projects__count-label ${
                  toggleTheme ? "dark-text-color" : "deafult-text-color"
                }`}
              >
                Projects Count:
              </p>
              <span
                className={`projects__count-count ${
                  toggleTheme ? "dark-text-color" : "default-text-color"
                }`}
              >
                {existingProject.length}
              </span>
            </div>
            <div className="project__filterations-existing-project-page">
              {/* multiple projects select box */}
              <div className="project-select-box">
                <Multiselect
                  options={categoryArr}
                  isObject={true}
                  selectedValues={multiSelectProjectsCategories}
                  displayValue="categoryName" // specify the property to display
                  valueProp="categoryValue" // specify the property to use as the selected value
                  onSelect={(e) => setMultiSelectProjectsCategories(e)}
                  onRemove={(e) => setMultiSelectProjectsCategories(e)}
                  placeholder="Select Project Category..."
                  className="multiselect-projects existing-projects-fitleration employee-select-box-input"
                />
              </div>

              {/* multiple employees select box */}
              <div className="project-select-box">
                <Multiselect
                  options={employeeArr}
                  selectedValues={multiSelectEmployees}
                  isObject={true}
                  displayValue="username" // specify the property to display
                  valueProp="id" // specify the property to use as the selected value
                  onSelect={(e) => setMultiSelectEmployees(e)}
                  onRemove={(e) => setMultiSelectEmployees(e)}
                  placeholder="Select Employee..."
                  className="multiselect-projects existing-projects-fitleration employee-select-box-input"
                />
              </div>

              {/* multiple status select box */}
              <div className="project-select-box">
                <Multiselect
                  options={projectStatusArr}
                  selectedValues={multiSelectProjectsStatus}
                  isObject={true}
                  displayValue="statusName" // specify the property to display
                  valueProp="statusValue" // specify the property to use as the selected value
                  onSelect={(e) => setMultiSelectProjectsStatus(e)}
                  onRemove={(e) => setMultiSelectProjectsStatus(e)}
                  placeholder="Select Project Status..."
                  className="multiselect-projects existing-projects-fitleration employee-select-box-input"
                />
              </div>
              <div className="project-select-box">
                <Button
                  className="btn default-button"
                  onClick={handleGetProjects}
                >
                  Search Projects
                </Button>
              </div>
              {/* <Button className="btn default-button" onClick={handleReset}>
                Reset
              </Button> */}
            </div>
          </div>

          {/* react table */}
          <div
            className={`default-section-block default__table__section  ${
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
            ) : existingProject.length >= 1 ? (
              <div>
                <div style={{ marginBottom: "10px" }}>
                  <CommonGlobalFilter
                    filter={globalFilter}
                    setFilter={setGlobalFilter}
                  />
                </div>
                <table
                  {...getTableProps()}
                  className="table text-center default__table__content"
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
                                  {column.Header === "Project ID" ||
                                  column.Header === "Edit" ||
                                  column.Header === "Delete" ||
                                  column.Header === "Category" ||
                                  column.Header === "Assigned To" ||
                                  column.Header === "Project No." ? (
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
                    {page.map((row, index) => {
                      prepareRow(row);
                      return (
                        <tr
                          className={`default-projects-table__values ${
                            toggleTheme
                              ? "dark-sub-text-color"
                              : "default-text-color"
                          }`}
                          {...row.getRowProps()}
                          key={index}
                        >
                          {row.cells.map((cell) => {
                            return (
                              <td
                                {...cell.getCellProps()}
                                className="existing-projects-table-body-rows-td"
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
                style={{ fontWeight: "600", color: "red", fontSize: "18px" }}
              >
                <p>{message}</p>
              </div>
            )}
            {existingProject && existingProject.length > 10 ? (
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

export default ExistingProject;
