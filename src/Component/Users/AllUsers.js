// libraries
import React, { useEffect, useState, useMemo, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";

// components
import { Users } from "./Users";
import UpdateUserModal from "./UpdateUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { PageFooter } from "../Utility/PageFooter";
import { ContextTheme } from "../../Context/ThemeContext";

// css styling
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../stylesheet/Users/AllUsers.css";
import "../../stylesheet/App.css";

// using react table
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { UserSearchFilter } from "../GlobalFilter/UserSearchFilter";
import { CommonGlobalFilter } from "../GlobalFilter/CommonGlobalFilter";
import { Button } from "react-bootstrap";

// to get all users data in this single page
const AllUsers = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  // Fetching login token from localstorage
  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // States
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // all users data

  const [dataUpdated, setDataUpdated] = useState(false);
  const [userDeleted, setUserDeleted] = useState(false);

  // states for keeping the count of users
  const [employeeCount, setEmployeeCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [managerCount, setManagerCount] = useState(0);

  // constructing headers for CSV Link
  const headers = [
    { label: "Username", key: "username" },
    { label: "Email", key: "email" },
    { label: "Role", key: "roles" },
    { label: "Authority", key: "authorized_to" },
    { label: "Status", key: "status" },
    { label: "is_Active", key: "is_active" },
  ];

  // for getting all user details on the page
  useEffect(() => {
    setLoading(true);

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

            // keeping the count of employees and admin
            let adminArr = [];
            let managerArr = [];
            let employeeArr = [];

            userData.map((ele) => {
              if (ele.roles === "admin") {
                adminArr.push(ele);
              }
              if (ele.roles === "manager") {
                managerArr.push(ele);
              }
              if (ele.roles === "employee") {
                employeeArr.push(ele);
              }
            });
            setAdminCount(adminArr.length);
            setEmployeeCount(employeeArr.length);
            setManagerCount(managerArr.length);
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
  }, [dataUpdated, userDeleted]);

  // React table headers,
  const Columns = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Username",
      accessor: "username",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Roles",
      accessor: "roles",
      Cell: ({ row }) => {
        const word = row.original.roles;
        return word.charAt(0).toUpperCase() + word.slice(1);
      },
    },
    {
      Header: "Authority",
      accessor: "authorized_to",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Edit",
      Cell: ({ row }) => (
        <UpdateUserModal
          setDataUpdated={setDataUpdated}
          id={row.original.id}
          username={row.original.username}
          email={row.original.email}
          roles={row.original.roles}
          authority={row.original.authorized_to}
          status={row.original.status}
        />
      ),
    },
    {
      Header: "Delete",
      Cell: ({ row }) => (
        <DeleteUserModal
          id={row.original.id}
          username={row.original.username}
          setUserDeleted={setUserDeleted}
        />
      ),
    },
  ];

  const columns = useMemo(() => Columns, []);
  const data = useMemo(() => users, [users]);

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
    previousPage,
    nextPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  return (
    <>
      <Users isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        } ${isOpen ? "open" : ""}`}
      >
        <div className="all-users-page mt-2">
          <div className={`default-section-block ${toggleTheme ? "dark" : ""}`}>
            <div className="all-users-header">
              <div className="all-users-heading">
                <h3
                  className={`${
                    toggleTheme ? "dark-text-color" : "default-text-color"
                  }`}
                >
                  All Users{" "}
                </h3>
                <i className="fa-solid fa-user all-users-count"></i>
              </div>

              {/* Export report in CSV file */}
              <CSVLink data={users} headers={headers} filename={"users.csv"}>
                <i className="fa-solid fa-download export-as-csv"></i>
              </CSVLink>
            </div>
            <div className="all-users-block-section">
              <div className="elem">
                <span className="number">{employeeCount}</span>
                <span
                  className={`elem-title ${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  Employees
                </span>
              </div>
              <div className="elem">
                <span className="number">{managerCount}</span>
                <span
                  className={`elem-title ${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  Manager
                </span>
              </div>
              <div className="elem">
                <span className="number">{adminCount}</span>
                <span
                  className={`elem-title ${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  Admin
                </span>
              </div>
            </div>
          </div>
          <div
            className={`default__table__section default-section-block ${
              toggleTheme ? "dark" : ""
            }`}
          >
            <div className="search-box">
              <Link to="/users/all/add-new-user">
                <Button className="btn default-button">Add new User</Button>
              </Link>
              <div className="user-search-box">
                <CommonGlobalFilter
                  filter={globalFilter}
                  setFilter={setGlobalFilter}
                />
              </div>
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
            ) : (
              <div>
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
                              className={`default-projects-table__heading-headers`}
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              <span>
                                <span>{column.render("Header")}</span>
                                <span className="table-heading-span-styling-arrow">
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
                      prepareRow(row);
                      return (
                        <tr
                          className={`default-projects-table__values ${
                            toggleTheme
                              ? "dark-sub-text-color"
                              : "default-text-color"
                          }`}
                          {...row.getRowProps()}
                          key={row.original.id}
                        >
                          {row.cells.map((cell) => {
                            return (
                              <td
                                {...cell.getCellProps()}
                                className="users-table-body-rows-td"
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
                {users && users.length > 10 ? (
                  <div>
                    <span
                      className={`${
                        toggleTheme
                          ? "dark-sub-text-color"
                          : "default-text-color"
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
            )}
          </div>
        </div>
      </div>
      <PageFooter />
    </>
  );
};

export default AllUsers;
