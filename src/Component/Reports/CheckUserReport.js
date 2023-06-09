// libraries
import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import ReportsNavbar from "./ReportsNavbar";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import ReactPaginate from "react-paginate";

// component
import CheckTimeEntryModal from "./CheckTimeEntryModal";
import Profile from "../Profile/Profile";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";

// styling
import "../../stylesheet/Reports/Reports.css";
import "../../stylesheet/App.css";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";

const CheckUserReport = () => {
  const mainUrl = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  const [userList, setUserList] = useState([]); // storing all the users usernames
  const [selectedUser, setSelectedUser] = useState(""); // selected particular username

  const [userProjectData, setUserProjectData] = useState([]); // this variable stores all the work records done by a user for a particular project

  const [message, setMessage] = useState(""); // used to store the response msg

  // For getting users info
  useEffect(() => {
    if (LoginToken) {
      const url = `${mainUrl}/user`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get all users data inside the select html tag
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
            const userData = result.data;
            setUserList(userData);
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
      localStorage.clear();
    }
  }, []);

  // after selecting a user, this button grabs all the project data assigned to this user and also you can check his time entries
  const handleCheckRecordsReport = (e) => {
    e.preventDefault();

    setLoading(true);
    const url = `${mainUrl}/reports/foruser/${newUserId}/${selectedUser}`;

    if (LoginToken) {
      // this fetch is used to get all work records done by the selected user
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
            setLoading(false);
            setMessage(result.message);
            setUserProjectData([]);
          } else {
            const data = result.data;
            setUserProjectData(data);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
      localStorage.clear();
    }
  };

  // for pagination
  const [pageNumber, setPageNumber] = useState(0); // page number for the pagination
  const projectsPerPage = 10;
  const pageVisited = pageNumber * projectsPerPage;
  const pageCount = Math.ceil(userProjectData.length / projectsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // for displaying all work records
  const displayRecords = userProjectData
    .slice(pageVisited, pageVisited + projectsPerPage)
    .map((item, index) => {
      return (
        <tr className="table__values" key={item.id}>
          <td>{index + 1}</td>
          <td>{item.Employee_Name}</td>
          <td>{item.Project_name}</td>
          <td>{item.Project_Status}</td>
          <td>
            {
              (() => {
                const date = new Date(item.Assigned_Date);
                return date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              })() // Immediately Invoked Function Expression (IIFE)
            }
          </td>
          <td className="edit">
            <CheckTimeEntryModal
              projectID={item.Project_id}
              user={selectedUser}
            />
          </td>
        </tr>
      );
    });

  return (
    <div>
      <Navbar />
      <PageHeader />

      <div className="default__page__margin">
        {/* Reports Navbar */}
        <ReportsNavbar />

        <h5
          className="default-text-color"
          style={{ width: "97%", margin: "10px auto" }}
        >
          Select a user and check his work records
        </h5>

        <div
          className="user-report mt-2"
          style={{
            width: "97%",
            margin: "10px auto",
            border: "1px solid #333",
            padding: "10px",
          }}
        >
          <form className="report-form" onSubmit={handleCheckRecordsReport}>
            {/* <!-- Selecting a User input --> */}
            <div className="form-outline mb-3">
              <label className="form-label default-text-color">
                Select a User:
              </label>
              <select
                required
                className="default__input default-text-color"
                value={selectedUser}
                key={selectedUser}
                onChange={(event) => {
                  setSelectedUser(event.target.value);
                }}
              >
                <option key="" value="">
                  Select a User...
                </option>
                {userList?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {`${user.username}`}
                  </option>
                ))}
              </select>
            </div>

            {/* <!-- check user-project report button --> */}
            <div className="form-outline mb-3">
              <button className="btn btn-block w-25 default-button">
                Check Records
              </button>
            </div>
          </form>
        </div>

        {/* table for work records section */}
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
                height: "15vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              wrapperClass="loader"
              visible={true}
            />
          ) : userProjectData.length > 0 ? (
            <table className="table text-center default__table__content">
              <thead>
                <tr className="table__heading">
                  <th>Sr. no</th>
                  <th>Employee Name</th>
                  <th>Project Name</th>
                  <th>Project status</th>
                  <th>Assigned Date</th>
                  <th>Check time entries</th>
                </tr>
              </thead>
              <tbody>{displayRecords}</tbody>
            </table>
          ) : (
            <h5 style={{ fontWeight: "600", color: "red" }} className="mt-2">
              {message}
            </h5>
          )}

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
        </div>
      </div>
      {/* <PageFooter /> */}
    </div>
  );
};

export default CheckUserReport;
