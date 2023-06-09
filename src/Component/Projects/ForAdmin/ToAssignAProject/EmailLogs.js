// libraries
import React, { useContext, useEffect, useState, useMemo } from "react";
import { UserContext } from "../../../../Context/UserContext";
import { TailSpin } from "react-loader-spinner";

// components
import ReactToastify from "../../../Utility/ReactToastify";
import Navbar from "../../../Navbar/Navbar";
import { PageHeader } from "../../../Utility/PageHeader";
import { CommonGlobalFilter } from "../../../GlobalFilter/CommonGlobalFilter";
import { PageFooter } from "../../../Utility/PageFooter";
import { ContextTheme } from "../../../../Context/ThemeContext";

// using react table
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { CSVLink } from "react-csv";

export const EmailLogs = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  const [loading, setLoading] = useState(false);
  const [emailsList, setEmailsList] = useState([]);

  // constructing headers for CSV Link
  const headers = [
    { label: "Project Name", key: "project_name" },
    { label: "Sent From", key: "from" },
    { label: "Sent to", key: "to" },
    { label: "Sent date", key: "emailed_on" },
    { label: "Email body", key: "email_body" },
  ];

  // getting email conversation logs
  const getEmailConversation = () => {
    const userId = localStorage.getItem("userId"); // the logged in user id
    const newUserId = userId.replace(/['"]+/g, "");

    const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token

    const bearer = "Bearer " + LoginToken;
    const newBearer = bearer.replace(/['"]+/g, "");

    const requestOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: newBearer,
    };

    if (LoginToken) {
      setLoading(true);
      const url = `${mainUrl}/email/get-email-list/${newUserId}`;
      //for adding time entry in a particular project
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
            const errorData = result.message;

            if (typeof errorData === "object") {
              Object.values(errorData).forEach((error) =>
                ReactToastify(error, "error")
              );
            } else {
              ReactToastify(errorData, "error");
            }
          } else {
            setEmailsList(result.email_logs.reverse());
          }
        })
        .catch((error) => {
          setLoading(false);
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong!", "error");
    }
  };

  useEffect(() => {
    getEmailConversation();
  }, []);

  // helper function for formatting the Sent Date
  const formatDate = (inputDate) => {
    const date = new Date(inputDate).getDate();
    const month = (new Date(inputDate).getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const year = new Date(inputDate).getFullYear();

    return `${date}/${month}/${year}`;
  };

  // Using React table
  const Columns = [
    {
      Header: "Project Name",
      accessor: "project_name",
    },
    {
      Header: "Sent from",
      accessor: "from",
    },
    {
      Header: "Sent to",
      accessor: "to",
    },
    {
      Header: "Sent Date",
      accessor: "emailed_on",
      Cell: ({ row }) => formatDate(row.original.emailed_on) ?? "N/A",
      // row.original.project_no !== "" ? row.original.project_no : "N/A",
    },
    {
      Header: "Email Body",
      accessor: "email_body",
    },
  ];

  const columns = useMemo(() => Columns, []);
  const data = useMemo(() => emailsList, [emailsList]);

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
        <div className="assign-projects-page">
          {/* Projects assigned entire list */}
          <div
            className={`default-section-block ${
              toggleTheme ? "dark" : ""
            } mt-2`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* add a project */}
            <h5
              style={{
                display: "flex",
                alignItems: "center",
              }}
              className={`${
                toggleTheme ? "dark-text-color" : "default-text-color"
              }`}
            >
              Check Email Logs
              <span>
                <i className="fa-solid fa-envelope-circle-check all-email-logs-count"></i>
              </span>
            </h5>
            <CSVLink
              data={emailsList}
              headers={headers}
              filename={"Email_Logs.csv"}
            >
              <i className="fa-solid fa-download export-as-csv"></i>
            </CSVLink>
          </div>

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
            ) : emailsList.length >= 1 ? (
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
                                <span className="table-heading-span-styling-title">
                                  {column.render("Header")}
                                </span>{" "}
                                <span>
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
                                className="email-logs-table-body-rows-td"
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
                <p>No Data Found 🙁</p>
                {/* {message} */}
              </div>
            )}
            {emailsList.length > 10 ? (
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
