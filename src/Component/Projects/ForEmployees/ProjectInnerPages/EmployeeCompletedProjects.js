// libraries
import React, { useState, useMemo, useContext } from "react";
import { TailSpin } from "react-loader-spinner";

// components
import { CommonGlobalFilter } from "../../../GlobalFilter/CommonGlobalFilter";
import ProjectDescriptionModal from "../ProjectDescriptionModal";
import CompletedProjectDescriptionModal from "./CompletedProjectDescriptionModal";
import { ContextTheme } from "../../../../Context/ThemeContext";

// using react table
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { formatDateTime } from "../../../Utility/formatDateTime";

export const EmployeeCompletedProjects = ({
  onlyCompletedProjects,
  loading,
}) => {
  const { toggleTheme } = useContext(ContextTheme);
  const [message, setMessage] = useState(""); // used to store the response msg

  const Columns = [
    {
      Header: "Project Id.",
      Cell: ({ row }) =>
        row.original.project_no !== "" ? row.original.project_no : "N/A",
    },
    {
      Header: "Project Name",
      accessor: "Project_name",
    },
    {
      Header: "Assigned Date",
      Cell: (row) => formatDateTime(row.row.original.assign_date),
      // Cell: (row) => {
      //   const date = new Date(row.row.original.assign_date);
      //   return date.toLocaleDateString("en-GB", {
      //     day: "2-digit",
      //     month: "2-digit",
      //     year: "numeric",
      //   });
      // },
    },
    {
      Header: "Project Status",
      accessor: "project_status",
    },
    {
      Header: "Description",
      Cell: ({ row }) => {
        const data = row.original;
        return (
          <CompletedProjectDescriptionModal projectDescriptionData={data} />
        );
      },
    },
  ];

  const columns = useMemo(() => Columns, []);
  const data = useMemo(() => onlyCompletedProjects, [onlyCompletedProjects]);

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
    <div>
      <div>
        <div className="my-projects mb-3">
          <h4
            className={`${
              toggleTheme ? "dark-text-color" : "default-text-color"
            }`}
          >
            Completed Projects
          </h4>
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
            ) : onlyCompletedProjects.length >= 1 ? (
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
                                  {column.Header === "Description" ||
                                  column.Header === "Edit" ||
                                  column.Header === "Update" ||
                                  column.Header === "Project Id." ||
                                  column.Header === "Assigned Date" ? (
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
                          key={row.original.Project_id}
                        >
                          {row.cells.map((cell) => {
                            return (
                              <td
                                {...cell.getCellProps()}
                                className="all-projects-table-body-rows-td"
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
                {onlyCompletedProjects && onlyCompletedProjects.length > 10 ? (
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
            ) : (
              <div
                className={`no-project-msg ${
                  toggleTheme ? "dark-sub-text-color" : "default-text-color"
                }`}
              >
                {/* {message} */}
                You do not have any Completed Project
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
