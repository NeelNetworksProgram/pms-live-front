// libraries
import React, { useState, useEffect, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import ReactPaginate from "react-paginate";

// component
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

const CheckProjectReport = () => {
  const mainUrl = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // used to store the response msg

  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  const [projectList, setProjectList] = useState([]); // storing all the users usernames
  const [selectedProject, setSelectedProject] = useState(""); // selected particular username

  const [projectData, setProjectData] = useState([]); // this variable stores all the work records done by a user for a particular project

  // https://ems.neelnetworks.org/reports/all-user-list-on-single-project/?current_user=${newUserId}&project_id=${project_id}

  // For getting all projects info
  useEffect(() => {
    if (LoginToken) {
      const url = `${mainUrl}/project`; // this api provides all projects

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get all project name data and stores it in an array
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
            const list = result.data;
            setProjectList(list);
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

  // after selecting a project, this button grabs all data of that particular project
  const handleCheckRecordsReport = (e) => {
    e.preventDefault();

    setLoading(true);

    const url = `${mainUrl}/reports/all-user-list-on-single-project/${newUserId}/${selectedProject}`;
    if (LoginToken) {
      fetch(url, {
        // this fetch is used to get all data about the selected project
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
            setProjectData([]);
            setMessage(result.message);
          } else {
            const data = result.data;
            setProjectData(data);
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
  const projectsPerPage = 10;
  const pageVisited = pageNumber * projectsPerPage;
  const pageCount = Math.ceil(projectData.length / projectsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // for displaying all work records
  const displayRecords = projectData
    .slice(pageVisited, pageVisited + projectsPerPage)
    .map((item, index) => {
      // converting the time 02:27:00 to 2 hrs 27 mins
      const date = new Date(`${item.worked_on}T${item.total_spend_time}Z`);
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
          <td>{item.username}</td>
          <td>{item.project_name}</td>
          <td>{item.project_status}</td>
          <td>
            {
              (() => {
                const date = new Date(item.Project_assigned_on);
                return date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              })() // Immediately Invoked Function Expression (IIFE)
            }
          </td>
          <td>
            {/* {item.total_spend_time} hrs */}
            {display || "0 min"}
          </td>
          <td>
            {
              (() => {
                const date = new Date(item.worked_on);
                return date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              })() // Immediately Invoked Function Expression (IIFE)
            }
          </td>
          <td style={{ textAlign: "left", width: "35%" }}>
            {item.work_description === "" ? "N.A" : item.work_description}
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
          Select a Project and check all the work records
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
                Select a Project:
              </label>
              <select
                required
                className="default__input default-text-color"
                value={selectedProject}
                key={selectedProject}
                onChange={(event) => {
                  setSelectedProject(event.target.value);
                  // console.log(event.target.value);
                }}
              >
                <option key="" value="">
                  Select a Project...
                </option>
                {projectList?.map((project) => (
                  <option key={project.id} value={project.id}>
                    {`${project.name}`}
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
          {/* <table className="table text-center default__table__content">
            <thead>
              <tr className="table__heading">
                <th>Sr. no</th>
                <th>Employee Name</th>
                <th>Project Name</th>
                <th>Project status</th>
                <th>Assigned Date</th>
                <th>Time entries</th>
                <th>Worked on</th>
                <th>Description</th>
              </tr>
            </thead>
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
            ) : (
              <tbody>
                {projectData.length > 0 ? (
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

export default CheckProjectReport;
