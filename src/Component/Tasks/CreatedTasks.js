// libraries
import React, { useContext, useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

// component
import Navbar from "../Navbar/Navbar";
import Profile from "../Profile/Profile";
import { UserContext } from "../../Context/UserContext";
import CreatedTaskCommentModal from "./CreatedTaskCommentModal";
import RevertBack from "./RevertBack";
import UpdateTaskModal from "./UpdateTaskModal";
import ReactToastify from "../Utility/ReactToastify";
import { UserSearchFilter } from "../GlobalFilter/UserSearchFilter";
import { CommonGlobalFilter } from "../GlobalFilter/CommonGlobalFilter";
import { ContextTheme } from "../../Context/ThemeContext";

// styling
import "../../stylesheet/Tasks/MyTasks.css";
import "../../stylesheet/App.css";
import "../../stylesheet/Tasks/CreatedTasks.css";

// using react table
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { formatDateTime } from "../Utility/formatDateTime";

export const CreatedTasks = () => {
  const { toggleTheme } = useContext(ContextTheme);

  // states
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");
  const [createdTasks, setCreatedTasks] = useState([]);
  const [commentUpdated, setCommentUpdated] = useState(false);
  const [revertBackUpdated, setRevertBackUpdated] = useState(false);
  const [taskUpdated, setTaskUpdated] = useState(false);

  // fetching logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  // fetching logged in user role
  const userRole = localStorage.getItem("userRole");

  // fetching logged in user login token
  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const mainUrl = useContext(UserContext);

  // Using React table
  const EmployeeColumns = [
    {
      Header: "Sr No.",
      Cell: ({ row }) => parseInt(row.id) + 1,
    },
    {
      Header: "Project Name",
      Cell: ({ row }) => row.original.Project_name ?? "N/A",
    },
    {
      Header: "Task Name",
      Cell: ({ row }) => row.original.task_name ?? "N/A",
    },
    {
      Header: "Assigned to",
      accessor: "assign_to",
    },
    {
      Header: "Assigned on",
      Cell: (row) => formatDateTime(row.row.original.assign_on),
      // Cell: (row) => {
      //   const date = new Date(row.row.original.assign_on);
      //   return date.toLocaleDateString("en-GB", {
      //     day: "2-digit",
      //     month: "2-digit",
      //     year: "numeric",
      //   });
      // },
    },
    {
      Header: "Task Status",
      accessor: "task_status",
    },
    {
      Header: "Revert Status",
      Cell: ({ row }) => row.original.revert_status ?? "---",
    },
    {
      Header: "Task Description",
      accessor: "task_description",
    },
    {
      Header: "Comments",
      Cell: ({ row }) => {
        return (
          <CreatedTaskCommentModal
            commentModalData={row.original}
            commentUpdated={commentUpdated}
            setCommentUpdated={setCommentUpdated}
          />
        );
      },
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <UpdateTaskModal
          updateTaskModalData={row.original}
          taskUpdated={taskUpdated}
          setTaskUpdated={setTaskUpdated}
        />
      ),
    },
  ];

  const AdminManagerColumns = [
    {
      Header: "Sr No.",
      Cell: ({ row }) => parseInt(row.id) + 1,
    },
    {
      Header: "Task Name",
      Cell: ({ row }) => row.original.task_name ?? "N/A",
    },
    {
      Header: "Assigned to",
      accessor: "assign_to",
    },
    {
      Header: "Assigned on",
      Cell: (row) => {
        const date = new Date(row.row.original.assign_on);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      Header: "Task Status",
      accessor: "task_status",
    },
    {
      Header: "Revert Status",
      Cell: ({ row }) => row.original.revert_status ?? "---",
    },
    {
      Header: "Task Description",
      accessor: "task_description",
    },
    {
      Header: "Comments",
      Cell: ({ row }) => {
        return (
          <CreatedTaskCommentModal
            commentModalData={row.original}
            commentUpdated={commentUpdated}
            setCommentUpdated={setCommentUpdated}
          />
        );
      },
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <UpdateTaskModal
          updateTaskModalData={row.original}
          taskUpdated={taskUpdated}
          setTaskUpdated={setTaskUpdated}
        />
      ),
    },
  ];

  const columns = useMemo(
    () => (userRole === '"employee"' ? EmployeeColumns : AdminManagerColumns),
    []
  );
  const data = useMemo(() => createdTasks, [createdTasks]);

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

  // using this code we are getting all the created tasks of the logged in user
  useEffect(() => {
    setLoading(true);
    if (LoginToken) {
      const url = `${mainUrl}/task/my-assign-task/${newUserId}`;

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
            setCreatedTasks([]);
          } else {
            // console.log(result.data);
            setCreatedTasks(result.data);
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
  }, [taskUpdated, commentUpdated]);

  return (
    <>
      <div className="my-tasks-heading tasks-container-title">
        <h3
          className={`${
            toggleTheme ? "dark-text-color" : "default-text-color"
          }`}
        >
          Created Tasks{" "}
        </h3>
        <span
          className="my-tasks-count"
          style={{ fontSize: "18px", fontWeight: "600" }}
        >
          {createdTasks.length}
        </span>
      </div>

      {/* main content section */}
      <div className="pending-tasks-content">
        {/* react table */}
        <div className="default__table__section">
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
          ) : createdTasks.length >= 1 ? (
            <div>
              <div style={{ width: "100%", marginBottom: "10px" }}>
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
                      {headerGroup.headers.map((column) => (
                        <th
                          className="default-projects-table__heading-headers"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <span>
                            <span>{column.render("Header")}</span>
                            <span className="table-heading-span-styling-arrow">
                              {column.Header === "Edit" ||
                              column.Header === "Comments" ||
                              column.Header === "Assigned on" ||
                              column.Header === "Sr No." ? (
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
                      ))}
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
                              className={`created-tasks-table-body-rows-td ${
                                userRole === '"employee"'
                                  ? "employee"
                                  : "AdminOrManager"
                              }`}
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
              {createdTasks && createdTasks.length > 10 ? (
                <div>
                  <span
                    className={`${
                      toggleTheme ? "dark-text-color" : "default-text-color"
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
          ) : (
            <div
              style={{
                margin: "0px 50px",
                display: "block",
                fontWeight: "600",
                fontSize: "18px",
              }}
              className={`${
                toggleTheme ? "dark-sub-text-color" : "default-text-color"
              }`}
            >
              {/* {message} */}
              You have not yet created any tasks <b>¯\_(ツ)_/¯</b>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
