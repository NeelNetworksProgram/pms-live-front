// libraries
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//  css styling
import "../../ForAdmin/ToAddAProject/AddProject.css";
import "../../../../stylesheet/App.css";

// importing components
import Navbar from "../../../Navbar/Navbar";
import Profile from "../../../Profile/Profile";
import { UserContext } from "../../../../Context/UserContext";
import ReactToastify from "../../../Utility/ReactToastify";
import { projectCategoryOptions } from "../../../Utility/ProjectCategoryOptions";
import { PageHeader } from "../../../Utility/PageHeader";

export const AddProject = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);

  // accessing login token from localstorage
  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // states
  const [selectedProjectCategoryOption, setSelectedProjectCategoryOption] =
    useState("");
  const [projectName, setProjectName] = useState("");

  // just clears the state
  //   const handleClear = () => {
  //     setUsername("");
  //     setEmail("");
  //     setUserRole("");
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* heading content */}
      <PageHeader />
      <div className="default__page__margin">
        <div className="form__div">
          <Form className="form__div-box">
            <Form.Group className="mb-3" /*controlId="formBasicEmail"*/>
              <Form.Label>Project Name:</Form.Label>
              <Form.Control
                type="input"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter Project name"
              />
            </Form.Group>

            <Form.Group className="mb-3" /*controlId="formBasicPassword"*/>
              <Form.Label>Project Category:</Form.Label>
              <Form.Select
                value={selectedProjectCategoryOption}
                onChange={(e) => {
                  setSelectedProjectCategoryOption(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option>Select a category...</option>
                {projectCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button
              className="default-button"
              onClick={(e) => {
                e.preventDefault();
              }}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </div>
      </div>
      {/* ending tag for default__page__margin */}
    </>
  );
};
