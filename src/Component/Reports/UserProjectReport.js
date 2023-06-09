// libraries
import React, { useState, useEffect, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import ReactPaginate from "react-paginate";

// components
import Navbar from "../Navbar/Navbar";
import ReportsNavbar from "./ReportsNavbar";
import Profile from "../Profile/Profile";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";

// styling
import "../../stylesheet/App.css";
import "../../stylesheet/Reports/Reports.css";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";

const UserProjectReport = () => {
  const mainUrl = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  const [userList, setUserList] = useState([]); // storing all the users usernames
  const [selectedUser, setSelectedUser] = useState(""); // selected particular user id

  const [userProjects, setUserProjects] = useState([]); // all assigned projects of a particular user
  const [selectedProject, setSelectedProject] = useState(""); // selected particular username

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
          } else {
            const userData = result.data;
            setUserList(userData);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again", "error");
      localStorage.clear();
    }
  }, []);

  // after selecting the user, getting his assigned projects
  useEffect(() => {
    const url = `${mainUrl}/reports/foruser/${newUserId}/${selectedUser}`;

    if (LoginToken) {
      // this fetch is used to get all projects assigned to a particular user
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
            setUserProjects([]);
            setUserProjectData([]);
            setMessage("No projects assigned to this user");
          } else {
            setMessage("");
            const projects = result.data; // "projects" variable stores all the assigned project names and stores it in an array of a particular user
            setUserProjects(projects);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
      localStorage.clear();
    }
  }, [selectedUser]);

  // after selecting the project and user, you can check all the work records existing on that project done by the  selected user
  const handleCheckRecordsReport = (e) => {
    e.preventDefault();

    setLoading(true);

    const url = `${mainUrl}/reports/for-user-time-entries/${newUserId}/${selectedUser}/${selectedProject}`;

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
          if (result.error) {
            setLoading(false);
            setUserProjectData([]);
            setMessage(result.message);
          } else {
            const data = result.data;
            setUserProjectData(data);
            setLoading(false);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
      localStorage.clear();
    }
  };

  // for pagination
  const [pageNumber, setPageNumber] = useState(0); // page number for the pagination
  const projectsPerPage = 5;
  const pageVisited = pageNumber * projectsPerPage;
  const pageCount = Math.ceil(userProjectData.length / projectsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // for displaying all work records
  const displayRecords = userProjectData
    .slice(pageVisited, pageVisited + projectsPerPage)
    .map((item, index) => {
      // converting the time 02:27:00 to 2 hrs 27 mins
      const date = new Date(`${item.Worked_on}T${item.Total_spent_time}Z`);
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
        <tr className="table__values" key={item.id}>
          <td>{index + 1}</td>
          <td>{item.Project_Name}</td>
          <td>
            {
              (() => {
                const date = new Date(item.Worked_on);
                return date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              })() // Immediately Invoked Function Expression (IIFE)
            }
          </td>
          <td>
            {/* {item.Total_spent_time} hrs */}
            {display || "0 min"}
          </td>
          <td style={{ textAlign: "left", width: "50%" }}>
            {item.Work_Description}
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
          Select a user and a particular project assigned to the user, to see
          their work records for the same.
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
                  setSelectedProject("");
                  setUserProjectData([]);
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

            {/* <!-- Selecting a Project input --> */}
            <div className="form-outline mb-3">
              <label className="form-label default-text-color">
                Select a Project:
              </label>
              <select
                required
                className="default__input default-text-color"
                value={selectedProject}
                key={selectedProject}
                onChange={(event) => {
                  setSelectedProject(event.target.value);
                  console.log(event.target.value);
                }}
              >
                <option key="" value="" className="default-text-color">
                  Select a Project...
                </option>
                {userProjects?.map((project) => (
                  <option
                    className="default-text-color"
                    key={project.Project_id}
                    value={project.Project_id}
                  >
                    {`${project.Project_name}`}
                  </option>
                ))}
              </select>
            </div>

            {/* <!-- check user-project report button --> */}
            <div className="form-outline mb-3">
              <button className="btn default-button btn-block w-25">
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
                  <th>Project Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Description</th>
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

export default UserProjectReport;
