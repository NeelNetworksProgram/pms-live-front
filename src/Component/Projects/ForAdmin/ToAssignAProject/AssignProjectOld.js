// libraries
import React, { useState, useEffect, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import ReactQuill from "react-quill";

// components
import Navbar from "../../../Navbar/Navbar";
import Profile from "../../../Profile/Profile";
import { UserContext } from "../../../../Context/UserContext";
import DeallocateProject from "./DeallocateProject";
import ReactToastify from "../../../Utility/ReactToastify";

// styling
import "react-quill/dist/quill.snow.css";
import "../../../../stylesheet/Projects/Projects.css";
import "../../../../stylesheet/App.css";
import "../../../../stylesheet/Projects/AssignProject.css";
import { PageHeader } from "../../../Utility/PageHeader";
import { PageFooter } from "../../../Utility/PageFooter";

const AssignProject = () => {
  const mainUrl = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const userRole = localStorage.getItem("userRole");

  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token

  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const [projectList, setProjectList] = useState([]); // storing all the projects names
  const [selectedProject, setSelectedProject] = useState(""); // selected particular project name

  const [userList, setUserList] = useState([]); // storing all the users usernames
  const [selectedUser, setSelectedUser] = useState(""); // selected particular username

  const [assignedProjectData, setAssignedProjectData] = useState([]);
  const [filteredAssignedList, setFilteredAssignedList] = useState([]);

  const [dataUpdated, setDataUpdated] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const categoryOptions = [
    { value: "designer", label: "Designer" },
    { value: "frontendDeveloper", label: "Front-End Developer" },
    { value: "backendDeveloper", label: "Back-End Developer" },
    { value: "seo", label: "SEO" },
  ];

  // const [assignNote, setAssignNote] = useState("");
  const [value, setValue] = useState(
    "Hi, you've been assigned with a new project..."
  );

  const [deallocateProjectStatus, setDeallocateProjectStatus] = useState(false);

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
        // used for getting users name inside the select html tag
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

  // For getting projects info
  useEffect(() => {
    if (LoginToken) {
      fetch(`${mainUrl}/project`, {
        // used for getting projects name inside the select html tag
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
            ReactToastify(result.message, "error");
          } else {
            const list = result.data; // getting projects list as a result from fetch api call
            setProjectList(list); // storing projects list in a state, will iterate through this list and make out a dropdown from the same.
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong, please login again!", "error");
    }
  }, []);

  // Once this form is submitted the selected username will be assigned the selected project name
  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    const url = `${mainUrl}/project/assign`;
    const data = {
      user_id: selectedUser,
      project_id: selectedProject,
      assign_by: newUserId,
      description: value,
    };

    if (LoginToken) {
      // this fetch is used to POST data for assigning a project to a user
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: newBearer,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          setLoading(false);
          if (result.error) {
            if (result.status === 400) {
              const err = Object.values(result.message);
              err.map((error) => {
                ReactToastify(error, "error");
              });
            }
            ReactToastify(result.message, "error");
          } else {
            // setValue("");
            setSelectedProject("");
            setSelectedUser("");
            ReactToastify(result.message, "success");
            setDataUpdated(!dataUpdated);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong!", "error");
    }
  };

  // filtering and reducing the overall assigned list data
  const filteringAndReducing = (arr) => {
    const result = {};
    arr.forEach((item) => {
      if (result[item.Project_name]) {
        result[item.Project_name].push(item.Assigned_to);
      } else {
        result[item.Project_name] = [item.Assigned_to];
      }
    });
    return Object.keys(result).map((project_name) => ({
      [project_name]: result[project_name],
    }));
  };

  // Used for listing overall assigned projects on the page
  useEffect(() => {
    setLoading(true);

    if (LoginToken) {
      const url = `${mainUrl}/project/assignlist/${newUserId}`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      fetch(url, {
        // this fetch call is used to get all users data
        method: "GET",
        headers: requestOptions,
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          setLoading(false);
          if (result.error) {
            const err = Object.values(result.message);
            ReactToastify(err, "error");
          } else {
            const data = result.data;
            setFilteredAssignedList(filteringAndReducing(data));
            setAssignedProjectData(data);
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      ReactToastify("Something went wrong!", "error");
    }
  }, [dataUpdated, deallocateProjectStatus]);

  // for pagination
  const [pageNumber, setPageNumber] = useState(0); // page number for the pagination
  const projectsPerPage = 10;
  const pageVisited = pageNumber * projectsPerPage;
  const pageCount = Math.ceil(assignedProjectData.length / projectsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // for displaying assigned project list
  const displayAssignedProjectList = assignedProjectData
    .slice(pageVisited, pageVisited + projectsPerPage)
    .map((data, index) => {
      return (
        <tr className="table__values" key={index}>
          <td>{index + 1}</td>
          <td>{data.assigned_by}</td>
          <td>{data.Assigned_to}</td>
          <td>{data.Project_name}</td>
          <td>
            {(() => {
              const date = new Date(data.Assigned_Date);
              return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            })()}
          </td>
          <td>
            <DeallocateProject
              projectIdSelected={data.project_id}
              userIdSelected={data.user_id}
              deallocateProjectStatus={deallocateProjectStatus}
              setDeallocateProjectStatus={setDeallocateProjectStatus}
              setLoading={setLoading}
            />
          </td>
        </tr>
      );
    });

  // for React quill editor
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <>
      <Navbar />
      <PageHeader />
      <div className="default__page__margin">
        <h5 className="default-text-color assign-project-heading">
          Select a user and a project that you want to assign
        </h5>

        <div className="assign__project default-text-color">
          <form className="assign__project__form" onSubmit={handleSubmit}>
            {/* <!-- Selecting a User input --> */}
            <div className="form-outline mb-3">
              <label className="form-label default-text-color">
                Select a User:
              </label>
              <select
                className="default__input default-text-color assign-project-select-input"
                value={selectedUser}
                key={selectedUser}
                required
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

            {/* <!-- Selecting a Project input --> */}
            <div className="form-outline mb-3">
              <label className="form-label default-text-color">
                Select a Project:
              </label>
              <select
                className="default__input default-text-color assign-project-select-input"
                value={selectedProject}
                key={selectedProject}
                required
                onChange={(event) => {
                  setSelectedProject(event.target.value);
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

            {/* <!-- Selecting a Category input --> */}
            {/* <div className="form-outline mb-3">
              <label className="form-label default-text-color">
                Select a Category:
              </label>
              <select
                className="default__input default-text-color assign-project-select-input"
                value={selectedCategory}
                key={selectedCategory}
                // required
                onChange={(event) => {
                  console.log(event.target.value);
                  setSelectedCategory(event.target.value);
                }}
              >
                <option key="" value="">
                  Select a Category...
                </option>
                {categoryOptions?.map((category) => (
                  <option key={category.value} value={category.value}>
                    {`${category.label}`}
                  </option>
                ))}
              </select>
            </div> */}

            {/* <!-- Add time button --> */}
            <div className="form-outline mb-3">
              <button className="btn default-button btn-block assign__project__btn">
                Assign Project
              </button>
            </div>
          </form>
          <div className="editor">
            <p className="assign-project-note">Add a note</p>
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              placeholder="Write a short brief about the project..."
              modules={modules}
              className="react-quill-editor"
            />
          </div>
        </div>

        {/* Projects assigned entire list */}
        <div className="default__table__section">
          {/* <table className="table text-center default__table__content">
            <thead>
              <tr className="table__heading">
                <th>Sr. no</th>
                <th>Assigned by</th>
                <th>Assigned to</th>
                <th>Project Name</th>
                <th>Assigned Date</th>
                <th style={{ width: "15%" }}>Deallocate Project</th>
              </tr>
            </thead>
            <tbody>
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
                    height: "30vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  wrapperClass="loader"
                  visible={true}
                />
              ) : (
                displayAssignedProjectList
              )}
            </tbody>
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
      <PageFooter />
    </>
  );
};

export default AssignProject;
