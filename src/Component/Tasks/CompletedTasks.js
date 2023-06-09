// libraries
import React, { useContext, useMemo, useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";

// component
import { UserContext } from "../../Context/UserContext";
import TaskCommentModal from "./TaskCommentModal";
import ReactToastify from "../Utility/ReactToastify";
import { CommonGlobalFilter } from "../GlobalFilter/CommonGlobalFilter";
import { ContextTheme } from "../../Context/ThemeContext";

// styling
import "../../stylesheet/Tasks/MyTasks.css";
import "../../stylesheet/App.css";
import "../../stylesheet/Tasks/CompletedTasks.css";

// using react table
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { formatDateTime } from "../Utility/formatDateTime";

export const CompletedTasks = () => {
  // states
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [commentUpdated, setCommentUpdated] = useState(false);

  // fetching logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  // fetching logged in user login token
  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  // Using React table
  const Columns = [
    {
      Header: "Sr No.",
      Cell: ({ row }) => parseInt(row.id) + 1,
    },
    {
      Header: "Project Name",
      accessor: "Project_name",
    },
    {
      Header: "Task Name",
      accessor: "task_name",
    },
    {
      Header: "Assigned By",
      accessor: "assign_by",
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
      Header: "Description",
      accessor: "task_description",
    },
    {
      Header: "Comments",
      Cell: ({ row }) => {
        const data = row.original;
        return (
          <TaskCommentModal
            commentModalData={data}
            commentUpdated={commentUpdated}
            setCommentUpdated={setCommentUpdated}
          />
        );
      },
    },
  ];

  const columns = useMemo(() => Columns, []);
  const data = useMemo(() => completedTasks, [completedTasks]);

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

  // using this code we are getting all the completed tasks of the logged in user
  useEffect(() => {
    setLoading(true);
    if (LoginToken) {
      const url = `${mainUrl}/task/list?task_status=Completed&login_user=${newUserId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get completed tasks data
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
          } else {
            setCompletedTasks(result.data);
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
  }, [commentUpdated]);

  return (
    <>
      <div className="my-tasks-heading tasks-container-title">
        <h3
          className={`${
            toggleTheme ? "dark-text-color" : "default-text-color"
          }`}
        >
          Completed Tasks{" "}
        </h3>
        <span
          className="my-tasks-count"
          style={{ fontSize: "18px", fontWeight: "600" }}
        >
          {completedTasks.length}
        </span>
      </div>

      {/* main content section */}
      <div className="completed-tasks-content">
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
          ) : completedTasks.length >= 1 ? (
            <>
              <div style={{ width: "100%", marginBottom: "10px" }}>
                {/* <UserSearchFilter filter={globalFilter} setFilter={setGlobalFilter} /> */}
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
                      {...headerGroup.getHeaderGroupProps()}
                      className={`default-projects-table__heading ${
                        toggleTheme ? "dark-text-color" : "default-text-color"
                      }`}
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
                              {column.Header === "Sr No." ||
                              column.Header === "Assigned on" ||
                              column.Header === "Comments" ? (
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
                <tbody {...getTableBodyProps()} className="users-table-body">
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        className={`default-projects-table__values ${
                          toggleTheme
                            ? "dark-sub-text-color"
                            : "default-text-color"
                        }`}
                        {...row.getRowProps()}
                        key={row.id}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="completed-tasks-table-body-rows-td"
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
            </>
          ) : (
            <div
              style={{
                margin: "0px 50px",
                display: "block",
                fontWeight: "600",
                fontSize: "18px",
              }}
              className={`${
                toggleTheme ? "dark-text-color" : "default-text-color"
              }`}
            >
              {/* {message} */}
              No tasks found ❌
            </div>
          )}
          {completedTasks && completedTasks.length > 10 ? (
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
      </div>
    </>
  );
};
