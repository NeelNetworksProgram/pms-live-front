// libraries
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import ReactPaginate from "react-paginate";

// styling
import "../../stylesheet/App.css";
import "../../stylesheet/Reports/CheckTimeEntryModal.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";

const CheckTimeEntryModal = ({ projectID, user }) => {
  const mainUrl = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // for loader

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

  const [message, setMessage] = useState(""); // used to store the response msg

  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  const [projectId] = useState(projectID);
  const [selectedUser] = useState(user);

  const [recordData, setRecordData] = useState([]);

  const handleEdit = () => {
    setLoading(true);

    if (LoginToken) {
      const url = `${mainUrl}/reports/for-user-time-entries/${newUserId}/${selectedUser}/${projectId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get all work records done by the selected user on the selected project
      fetch(url, {
        method: "GET",
        headers: requestOptions,
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.error) {
            setLoading(false);
            setMessage(result.message);
          } else {
            setLoading(false);
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
      navigate("/");
      window.location.reload();
    }
  };

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
          className="time-entry-record"
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
            Work description:-
            {record.Work_Description === "" ? "N.A" : record.Work_Description}
          </td>
        </tr>
      );
    });

  return (
    <div>
      {/* Button trigger modal started */}
      <button
        type="button"
        onClick={() => handleEdit(projectID, user)}
        className="btn default-button"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${projectID}`}
      >
        check entry
      </button>
      {/* Button trigger modal ended */}

      {/* <!-- Modal --> */}
      <div
        className="modal"
        id={`exampleModal-${projectID}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog time-entry-modal-dialog">
          <div className="modal-content time-entry-modal">
            <div className="modal-header">
              <h1
                className="modal-title fs-5 default-text-color"
                id="exampleModalLabel"
              >
                Project Time Entries
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/*  */}
              {/* Table section for displaying the time entries */}
              <div className="table__section" style={{ paddingBottom: "0px" }}>
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
                ) : recordData.length > 0 ? (
                  <table className="time-entry-modal-table">
                    <tbody className="time-entry-modal-body">
                      {displayRecords}
                    </tbody>
                  </table>
                ) : (
                  <h5
                    style={{ fontWeight: "600", color: "red" }}
                    className="mt-2"
                  >
                    {message}
                  </h5>
                )}
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
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn default-button"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckTimeEntryModal;
