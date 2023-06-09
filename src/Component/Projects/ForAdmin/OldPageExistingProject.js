// libraries
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import ReactPaginate from "react-paginate";

// using react table
// import { useTable, useGlobalFilter, useSortBy } from "react-table";
// import { GlobalFilter } from "../../GlobalFilter/GlobalFilter";

// components
import { Projects } from "../Projects";
import UpdateProjectModal from "./ToAddAProject/UpdateProjectModal";
import DeleteProjectModal from "./ToAddAProject/DeleteProjectModal";
import AddProjectModal from "./ToAddAProject/AddProjectModal";
import { ProjectStage } from "./ToAddAProject/ProjectStage";
import { UserContext } from "../../../Context/UserContext";
import ReactToastify from "../../Utility/ReactToastify";

// styling
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../../stylesheet/Projects/Projects.css";
import "../../../stylesheet/Projects/ExistingProject.css";
import "../../../stylesheet/App.css";

const ExistingProject = () => {
  const mainUrl = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const LoginToken = localStorage.getItem("LoginToken");
  const userRole = localStorage.getItem("userRole");
  // const userAuthority = localStorage.getItem("userAuthority");

  // States
  const [existingProject, setExistingProject] = useState([]);
  const [projectNameChanged, setProjectNameChanged] = useState(true);
  const [projectDeleted, setProjectDeleted] = useState(true);
  const [projectAdded, setProjectAdded] = useState(true);

  // used to get all the existing projects
  useEffect(() => {
    setLoading(true);
    if (LoginToken) {
      const bearer = "Bearer " + LoginToken;
      const newBearer = bearer.replace(/['"]+/g, "");
      const url = `${mainUrl}/project`; // used to get all the existing projects

      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: newBearer,
        },
      })
        .then((response) => {
          if (response.error) {
            ReactToastify(response.error, "error");
          } else {
            return response.json();
          }
        })
        .then((result) => {
          if (result.error) {
            ReactToastify(result.message.name, "error");
            setLoading(false);
          } else {
            const projects = result.data;
            setExistingProject(projects);
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
  }, [projectDeleted, projectNameChanged, projectAdded]);

  // for pagination
  const [pageNumber, setPageNumber] = useState(0); // page number for the pagination
  const projectsPerPage = 10;
  const pageVisited = pageNumber * projectsPerPage;
  const pageCount = Math.ceil(existingProject.length / projectsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // for displaying projects table
  const displayProjects = existingProject
    .slice(pageVisited, pageVisited + projectsPerPage)
    .map((item, index) => {
      return (
        <tr className="table__values" key={item.id}>
          <td>{index + 1}</td>
          <td>{item.name}</td>
          <td>{item.project_status ? item.project_status : "---"}</td>
          <td>
            <ProjectStage stage={item.project_stage} />
          </td>
          {/* <td>
            <select
              id="project-stage"
              value={projectStage}
              onChange={(e) => {
                setProjectStage(e.target.value);
              }}
            >
              <option value="">Select a stage...</option>
              {stageOptions.map((stage) => (
                <option value={stage.value}>{stage.label}</option>
              ))}
            </select>
          </td> */}
          {userRole === '"employee"' ? (
            ""
          ) : (
            <td className="edit">
              <UpdateProjectModal
                projectNameChanged={projectNameChanged}
                setProjectNameChanged={setProjectNameChanged}
                id={item.id}
                name={item.name}
                status={item.project_status}
                stage={item.project_stage}
              />
            </td>
          )}
          {userRole === '"admin"' || userRole === '"manager"' ? (
            <td className="delete">
              <DeleteProjectModal
                projectDeleted={projectDeleted}
                setProjectDeleted={setProjectDeleted}
                id={item.id}
                name={item.name}
              />
            </td>
          ) : (
            ""
          )}
        </tr>
      );
    });

  return (
    <>
      <Projects />
      <div className="default__page__margin">
        <div className="all-projects-header">
          {/* add a project */}
          <div className="add-a-project">
            {userRole === '"admin"' || userRole === '"manager"' ? (
              ""
            ) : (
              <AddProjectModal
                setProjectAdded={setProjectAdded}
                projectAdded={projectAdded}
              />
            )}
          </div>
          {/* defining progress bar colors */}
          {/* <div className="progress-bar-colors">
            <div className="colors">
              <ul>
                <li>
                  <span className="colors-danger"></span>
                  20%
                </li>
                <li>
                  <span className="colors-warning"></span>
                  40%
                </li>
                <li>
                  <span className="colors-info"></span>
                  60%
                </li>
                <li>
                  <span className="colors-default"></span>
                  80%
                </li>
                <li>
                  <span className="colors-success"></span>
                  100%
                </li>
              </ul>
            </div>
          </div> */}
        </div>

        <div className="default__table__section">
          {/* <table className="table text-center default__table__content">
            <thead>
              <tr className="table__heading">
                <th>Project. no</th>
                <th>Project Name</th>
                <th>Project Status</th>
                <th>Project Stage</th>
                {
                  // if user role is only view then do not display Edit option
                  userRole === '"employee"' ? "" : <th>Edit</th>
                }
                {
                  // if user has delete role then display delete option
                  userRole === '"admin"' || userRole === '"manager"' ? (
                    <th>Delete</th>
                  ) : (
                    ""
                  )
                }
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
                    height: "50vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  wrapperClass="loader"
                  visible={true}
                />
              ) : (
                displayProjects
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
    </>
  );
};

export default ExistingProject;
