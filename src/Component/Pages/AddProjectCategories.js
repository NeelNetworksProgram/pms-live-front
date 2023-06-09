// libraries
import React, { useState, useContext } from "react";
import { TailSpin } from "react-loader-spinner";

//components
import Navbar from "../Navbar/Navbar";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { UserContext } from "../../Context/UserContext";
import { ContextTheme } from "../../Context/ThemeContext";
import { Button } from "react-bootstrap";
import { projectCategoryOptions } from "../Utility/ProjectCategoryOptions";

// styling
import "../../stylesheet/Pages/AddProjectCategories.css";

export const AddProjectCategories = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId"); // logged in userId
  const newUserId = userId.replace(/['"]+/g, "");

  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const [categoryName, setCategoryName] = useState("");

  const handleClear = () => {};

  // on click of Submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(categoryName);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* Header */}
      <PageHeader />
      <div
        className={`default__page__margin default-bg-color ${
          toggleTheme ? "dark" : ""
        }`}
      >
        <div
          className={`default-section-block ${
            toggleTheme ? "dark" : ""
          } form-content mt-2`}
        >
          <h3
            className={`${
              toggleTheme ? "dark-text-color" : "default-text-color"
            }`}
          >
            Add Project Category
          </h3>
          {/* Update details */}
          {loading ? (
            <TailSpin
              height="50"
              width="50"
              color="#333"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{
                width: "100%",
                height: "50vh",
                top: "10vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              wrapperClass="loader"
              visible={true}
            />
          ) : (
            <div className="form-page form__div-box">
              <form>
                <div className="mb-3 add-project-category-input">
                  <label
                    htmlFor="holiday_name"
                    className={`form-label ${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    Existing Categories
                  </label>
                  <select>
                    {projectCategoryOptions.map(({ value, label }) => (
                      <option value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="holiday_name"
                    className={`form-label ${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    New Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="holiday_name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
                <Button onClick={handleSubmit} className="btn default-button">
                  Add Category
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
      <PageFooter />
    </>
  );
};
