// libraries
import React, { useEffect, useState, useMemo, useContext } from "react";
import { TailSpin } from "react-loader-spinner";

// importing components
import { Users } from "./Users";
import UpdateUserModal from "./UpdateUserModal";
import { DeleteUserModal } from "./DeleteUserModal";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";

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

// to get all users data in this single page
const AllUsersOld = () => {
  const mainUrl = useContext(UserContext);

  // Fetching login token from localstorage
  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // States
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // all users data
  // const myUserData = "devenUmrania";

  const [dataUpdated, setDataUpdated] = useState(false);
  const [userDeleted, setUserDeleted] = useState(false);

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
    },
    {
      Header: "Authority",
      accessor: "authorized_to",
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
      <Users />
      <div className="default__page__margin">
        <div className="default__table__section">
          {/* react table */}
          <div>
            <div className="search-box">
              <UserSearchFilter
                filter={globalFilter}
                setFilter={setGlobalFilter}
              />
            </div>
            <table {...getTableProps()} className="users-table">
              {/* <div className="users-table-head"> */}
              <thead className="users-table-head">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {/* </div> */}
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
                <tbody {...getTableBodyProps()} className="users-table-body">
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={row.id}>
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
                  {users && users.length > 10 ? (
                    <div
                      style={{
                        margin: "20px 50px",
                        position: "absolute",
                        paddingBottom: "20px",
                      }}
                    >
                      <span>
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
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllUsersOld;
