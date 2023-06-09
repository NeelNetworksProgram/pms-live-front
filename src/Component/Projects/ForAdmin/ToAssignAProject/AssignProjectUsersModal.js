// libraries
import React, { useState, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import ReactPaginate from "react-paginate";

// styling
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../../stylesheet/Projects/AssignProjectUsersModal.css";

// component
import { UserContext } from "../../../../Context/UserContext";
import Modal from "react-bootstrap/Modal";
import ReactToastify from "../../../Utility/ReactToastify";
import { ContextTheme } from "../../../../Context/ThemeContext";
import { formatDateTime } from "../../../Utility/formatDateTime";

// ----------  MAIN COMPONENT -----------------------
// id & project_id both are same.
const AssignProjectUsersModal = ({
  data,
  id,
  project_id,
  dataUpdated,
  setDataUpdated,
}) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");
  const userId = localStorage.getItem("userId");
  const newUserId = userId.replace(/['"]+/g, "");

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

  // states
  const [loading, setLoading] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [selectedProjectID, setSelectedProjectID] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [recordData, setRecordData] = useState([]); // used for time entries
  const [message, setMessage] = useState(""); // used to store the response msg
  const [selectedUser, setSelectedUser] = useState(""); // select a user after checking assigned users in a project
  const [displayModal, setDisplayModal] = useState(false);

  const handleEdit = (actualData) => {
    setSelectedProjectID(actualData.project_id);
    setSelectedProjectName(actualData.project_name);
    const userData = actualData.users;
    setUserNames(userData);
    setDisplayModal((prev) => !prev);
  };

  // react modal for showing time entries after selecting a particular user from a project
  function handleShow(userData) {
    setSelectedUser(userData);
    setShow(true);
    setLoading(true);

    // helper function
    const onlyDate = (inputDate) => {
      const dateObj = new Date(inputDate);
      const formattedDate = `${(dateObj.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${dateObj
        .getDate()
        .toString()
        .padStart(2, "0")}/${dateObj.getFullYear()}`;

      return formattedDate;
    };

    // helper function for filtering time entries based on Assigned & Deallocation date
    const filterTimeEntry = (timeEntryData) => {
      const assignedDate =
        userData.Assigned_Date !== null &&
        userData.Assigned_Date !== "0000-00-00 00:00:00"
          ? new Date(onlyDate(userData.Assigned_Date))
          : null;

      const deallocateDate =
        userData.deallocate_date !== null &&
        userData.deallocate_date !== "0000-00-00 00:00:00"
          ? new Date(onlyDate(userData.deallocate_date))
          : null;

      const toShowEntries = [];

      timeEntryData.map((ele) => {
        //

        if (assignedDate && deallocateDate) {
          //if assigned date & deallocate date present..

          if (
            new Date(onlyDate(ele.Worked_on)) >= assignedDate &&
            new Date(onlyDate(ele.Worked_on)) <= deallocateDate
          ) {
            toShowEntries.push(ele);
          }
        } else if (assignedDate) {
          if (new Date(onlyDate(ele.Worked_on)) >= assignedDate) {
            toShowEntries.push(ele);
          }
        }

        if (toShowEntries.length > 0) {
          setRecordData(toShowEntries);
        } else {
          setRecordData([]);
          setMessage(`No Time Entries found ¯\\_(ツ)_/¯`);
        }
      });
    };

    //getting time entries of the selected user & project
    const url = `${mainUrl}/reports/for-user-time-entries/${newUserId}/${userData.user_id}/${selectedProjectID}`;
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
            setMessage(result.message);
            setRecordData([]);
          } else {
            const data = result.data;
            filterTimeEntry(data);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
      localStorage.clear();
    }
  }

  // for pagination
  const [pageNumber, setPageNumber] = useState(0); // page number for the pagination
  const projectsPerPage = 5;
  const pageVisited = pageNumber * projectsPerPage;
  const pageCount = Math.ceil(recordData.length / projectsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // for displaying all work records inside the FULLSCREEN modal
  const displayRecords = recordData
    .slice(pageVisited, pageVisited + projectsPerPage)
    .map((record, index) => {
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
          key={index}
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
              Worked on:-{" "}
              {(() => {
                const date = new Date(record.Worked_on);
                return date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              })()}
            </span>
            <span>Time spent:- {display || "0 min"}</span>
          </td>
          <td className="time-entry-modal-project-description default-text-color">
            Work description:-{" "}
            {record.Work_Description === "" ? "N.A" : record.Work_Description}
          </td>
        </tr>
      );
    });

  // used for removing employee from an project
  const DeallocateEmployee = (user) => {
    const result = window.confirm(
      `are you sure, you want to remove ${user.username} from ${data.project_name} project?`
    );

    // if admin/manager clicks OK then remove the employee from that project code
    if (result) {
      if (LoginToken) {
        const url = `${mainUrl}/project/deallocate`;
        const requestOptions = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: newBearer,
        };

        const apiData = {
          login_user: newUserId,
          deallocate_user: Number(user.user_id),
          project_id: Number(data.project_id),
          project_assign_id: user.project_assign_id,
        };

        fetch(url, {
          method: "PATCH",
          headers: requestOptions,
          body: JSON.stringify(apiData),
        })
          .then((response) => {
            return response.json();
          })
          .then((result) => {
            setLoading(false);
            if (result.error) {
              if (result.status === 400) {
                ReactToastify(result.message.project_assign_id, "error");
              } else {
                ReactToastify(result.message, "error");
              }
            } else {
              ReactToastify(result.message, "success");
              setDataUpdated(!dataUpdated);
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          })
          .catch((error) => {
            ReactToastify(error, "error");
          });
      } else {
        ReactToastify("Something went wrong, please login again", "error");
        setTimeout(() => {
          localStorage.clear();
        }, 1000);
      }
    }
  };

  return (
    <div>
      {/* Button trigger modal started */}
      <i
        className={`fa-solid fa-circle-plus plus-symbol ${
          toggleTheme ? "dark" : ""
        }`}
        onClick={() => handleEdit(data, id, project_id)}
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${id}`}
        style={{ marginLeft: "10px", fontSize: "18px", cursor: "pointer" }}
        title="check users"
      ></i>

      {/* <!-- Modal --> */}
      <div
        className={`modal fade`}
        id={`exampleModal-${id}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog assign-project-users-modal-dialog">
          <div className="modal-content assign-project-users-modal-content">
            <div className="modal-header assign-project-users-modal-header">
              <h1
                className="modal-title fs-5 default-text-color"
                id="exampleModalLabel"
              >
                "{data.project_name}" Project Details
              </h1>
              <button
                type="button"
                id="close__assign-project__modal"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div
              className="modal-body default-text-color"
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p className="assign-project-users-modal-heading">
                Employee's List:-
              </p>
              <div className="getResults">
                {userNames.map((user, index) => {
                  return (
                    <div className="users-p" key={index}>
                      <span>
                        {index + 1}) Employee name: {user.username}
                      </span>
                      <div className="users-icons-div">
                        {user.project_deallocate === "no" ? (
                          <span>
                            <i
                              onClick={() => DeallocateEmployee(user)}
                              className="fa-solid fa-user-slash"
                              style={{
                                marginLeft: "10px",
                                fontSize: "18px",
                                cursor: "pointer",
                              }}
                              title={`remove ${user.username} from project`}
                            ></i>
                          </span>
                        ) : (
                          ""
                        )}
                        <span>
                          <i
                            key={index}
                            onClick={() => handleShow(user)}
                            className="fa-solid fa-circle-plus"
                            style={{
                              marginLeft: "10px",
                              fontSize: "18px",
                              cursor: "pointer",
                            }}
                            title="check time entries"
                          ></i>
                          <Modal
                            show={show}
                            fullscreen={fullscreen}
                            onHide={() => {
                              setSelectedUser("");
                              setShow(false);
                            }}
                          >
                            <Modal.Header closeButton>
                              <Modal.Title>Project Time Entries</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="time-entries-browser-heading">
                                <table className="assignProjectUsersModal table text-center default__table__content">
                                  <thead>
                                    <tr className="table__heading">
                                      <th>Employee Name</th>
                                      <th>Project Name</th>
                                      <th>Assigned By</th>
                                      <th>Assigned Date</th>
                                      <th>Deallocation Date</th>
                                      <th>User Category</th>
                                      <th>Completion Time</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="table__values" key={index}>
                                      <td
                                        style={{
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {selectedUser.username}
                                      </td>
                                      <td>{selectedProjectName}</td>
                                      <td
                                        style={{
                                          textTransform: "capitalize",
                                        }}
                                      >
                                        {selectedUser.assigned_by}
                                      </td>
                                      <td>
                                        {formatDateTime(
                                          selectedUser.Assigned_Date
                                        )}
                                        {/* {new Date(
                                          selectedUser.Assigned_Date
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                        })} */}
                                      </td>
                                      <td>
                                        {selectedUser.deallocate_date !==
                                          null &&
                                        selectedUser.deallocate_date !==
                                          "0000-00-00 00:00:00"
                                          ? formatDateTime(
                                              selectedUser.deallocate_date
                                            )
                                          : "N/A"}

                                        {/* {selectedUser.deallocate_date !==
                                          null &&
                                        selectedUser.deallocate_date !==
                                          "0000-00-00 00:00:00"
                                          ? new Date(
                                              selectedUser.deallocate_date
                                            ).toLocaleDateString("en-GB", {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                            })
                                          : "N/A"} */}
                                      </td>
                                      <td>
                                        {selectedUser.user_category !== ""
                                          ? selectedUser.user_category
                                          : "N/A"}
                                      </td>
                                      <td>
                                        {selectedUser.estimation_time !== ""
                                          ? `${selectedUser.estimation_time} hours`
                                          : "N/A"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div
                                style={{
                                  margin: "15px 10px",
                                }}
                              >
                                <h6>
                                  <b>Job Description:</b>{" "}
                                  {selectedUser.work_description === "" ? (
                                    "No description available"
                                  ) : (
                                    <div
                                      className="mt-2"
                                      dangerouslySetInnerHTML={{
                                        __html: selectedUser.work_description,
                                      }}
                                    />
                                  )}
                                </h6>
                              </div>
                              <hr />
                              <div className="time-entries-browser-content">
                                {/* Table section for displaying the time entries */}
                                <div
                                  className="table__section"
                                  style={{ paddingBottom: "0px" }}
                                >
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
                                    <div>
                                      {recordData.length > 0 ? (
                                        <p className="time-entries-heading">
                                          Time Entries:{" "}
                                        </p>
                                      ) : (
                                        ""
                                      )}
                                      <table className="time-entry-modal-table">
                                        <tbody className="time-entry-modal-body assigned-projects-page">
                                          {recordData.length > 0 ? (
                                            displayRecords
                                          ) : (
                                            <tr>
                                              <td
                                                style={{
                                                  fontWeight: "600",
                                                  color: "red",
                                                  fontSize: "18px",
                                                }}
                                                className="mt-2"
                                              >
                                                {message}
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                  {loading ? (
                                    ""
                                  ) : recordData.length > 5 ? (
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
                            </Modal.Body>
                          </Modal>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignProjectUsersModal;
