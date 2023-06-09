// libraries
import React, { useEffect, useState, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

//  css styling
import "../../../../stylesheet/App.css";
import "../../../../stylesheet/Projects/TimeEntriesBrowser.css";

// importing components
import Navbar from "../../../Navbar/Navbar";
import Profile from "../../../Profile/Profile";
import { UserContext } from "../../../../Context/UserContext";
import ReactToastify from "../../../Utility/ReactToastify";

export const TimeEntriesBrowser = () => {
  // accessing login token from localstorage
  const navigate = useNavigate();
  const mainUrl = useContext(UserContext);

  const { userID, userName, projectID, projectName } = useParams(); // getting all info from url

  // login token
  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  // states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // used to store the response msg
  const [recordData, setRecordData] = useState([]);

  const colors = [
    "#FFC72C",
    "#D2122E",
    "#002D62",
    "#32de84",
    "#4B0082",
    "#4cd137",
    "#cd84f1",
    "#3d3d3d",
    "#7cf49a",
  ];

  // used this code to get all the time entries of a user for a project
  useEffect(() => {
    setLoading(true);
    const url = `${mainUrl}/reports/for-user-time-entries/${newUserId}/${userID}/${projectID}`;

    if (LoginToken) {
      // this fetch is used to get all work records done by the user for the project selected
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
          setLoading(false);
          if (result.error) {
            ReactToastify(result.message, "error");
            setMessage(result.message);
          } else {
            const data = result.data;
            setRecordData(data);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
      localStorage.clear();
    }
  }, []);

  // for pagination
  const [pageNumber, setPageNumber] = useState(0); // page number for the pagination
  const projectsPerPage = 5;
  const pageVisited = pageNumber * projectsPerPage;
  const pageCount = Math.ceil(recordData.length / projectsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // for displaying all work records
  const displayRecords = recordData
    .slice(pageVisited, pageVisited + projectsPerPage)
    .map((record) => {
      // converting the time 02:27:00 to 2 hrs 27 mins
      const date = new Date(`${record.Worked_on}T${record.Total_spent_time}Z`);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      let display = "";

      if (hours) {
        display = `${hours} hr`;
        if (hours > 1) {
          display += "s";
        }
      }

      if (minutes) {
        if (display) {
          display += " ";
        }
        display += `${minutes} min`;
        if (minutes > 1) {
          display += "s";
        }
      }

      return (
        // Project entries
        <tr
          key={record.project_id}
          className="time-entry-record time-entries-browser-time-entry-record"
          style={{
            borderLeft: `5px solid ${
              colors[Math.floor(Math.random() * colors.length)]
            }`,
          }}
        >
          <td className="time-entry-modal-project-name default-text-color">
            Project Name:- {record.Project_Name}
          </td>
          <td className="time-entry-modal-project-time default-text-color">
            <span>
              Worked on:-
              {(() => {
                const date = new Date(record.Worked_on);
                return date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              })()}
            </span>
            <span>
              {/* Time spent:- {record.Total_spent_time} */}
              Time spent:- {display || "0 min"}
            </span>
          </td>
          <td className="time-entry-modal-project-description default-text-color">
            Work description:-{" "}
            {record.Work_Description === "" ? "N.A" : record.Work_Description}
          </td>
        </tr>
      );
    });

  return (
    <>
      {/* <Navbar /> */}
      {/* <CheckUserExists /> */}
      {/* heading content */}
      <div className="default__heading">
        {/* <span className="logo">Project Management System</span> */}
        <span className="title">Project Time Entries</span>
        {/* <span className="profile">
          <Profile />
        </span> */}
      </div>
      <div className="" style={{ paddingTop: "8vh" }}>
        <div className="time-entries-browser-heading">
          <h5>
            <span>
              <u>Employee Name:</u> "{userName}"
            </span>
            <span>
              <u>Project Name:</u> "{projectName}"
            </span>
          </h5>
        </div>
        <div className="time-entries-browser-content">
          {/* Table section for displaying the time entries */}
          <div className="table__section" style={{ paddingBottom: "0px" }}>
            {/* <table className="time-entry-modal-table">
              {loading ? (
                <TailSpin
                  height="60"
                  width="60"
                  color="#333"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{
                    position: "absolute",
                    width: "97%",
                    height: "10vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  wrapperClass="loader"
                  visible={true}
                />
              ) : (
                <tbody className="time-entry-modal-body">
                  {recordData.length > 0 ? (
                    displayRecords
                  ) : (
                    <h5
                      style={{ fontWeight: "600", color: "red" }}
                      className="mt-2"
                    >
                      {message}
                    </h5>
                  )}
                </tbody>
              )}
            </table> */}
            {recordData.length > 5 ? (
              <div
                className="pagination"
                style={{ margin: "15px 0px 0px 0px" }}
              >
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
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {/* ending tag for default__page__margin */}
    </>
  );
};
