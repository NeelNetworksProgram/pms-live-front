// libraries
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// component
import Navbar from "../../Navbar/Navbar";
import { UserContext } from "../../../Context/UserContext";
import ReactToastify from "../../Utility/ReactToastify";

// styling
import "../../stylesheet/Projects/Projects.css";

const CompletedProjects = () => {
  const mainUrl = useContext(UserContext);
  const navigate = useNavigate();
  const [completedProjects, setCompletedProjects] = useState([]);

  const LoginToken = localStorage.getItem("LoginToken");

  useEffect(() => {
    if (LoginToken) {
      const bearer = "Bearer " + LoginToken;
      const newBearer = bearer.replace(/['"]+/g, "");

      const url = `${mainUrl}/project?status=Completed`;
      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

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
          }
          const data = result.data;
          setCompletedProjects(data);
        });
    } else {
      localStorage.clear();
      navigate("/");
      ReactToastify("Something went wrong, Please login again!", "error");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="default__page__margin">
        <div className="default__heading">
          <h3>Completed Projects</h3>
        </div>

        <div className="default__table__section">
          <table className="table text-center default__table__content">
            <thead>
              <tr className="table__heading">
                <th style={{ border: "1px solid black" }}>Sr. no</th>
                <th style={{ border: "1px solid black" }}>Project Name</th>
              </tr>
            </thead>
            <tbody>
              {completedProjects?.map((project, index) => (
                <tr className="table__values" key={project.id}>
                  <td style={{ border: "1px solid black" }}>{index + 1}</td>
                  <td style={{ border: "1px solid black" }}>{project.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CompletedProjects;
