// libraries
import React, { useState, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import { DatePicker, Space } from "antd";

//components
import Navbar from "../Navbar/Navbar";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { ContextTheme } from "../../Context/ThemeContext";
import { Button } from "react-bootstrap";

import "../../stylesheet/Pages/AddHoliday.css";

export const AddHoliday = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId"); // logged in userId
  const newUserId = userId.replace(/['"]+/g, "");

  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const [holidayDate, setHolidayDate] = useState("");
  const [holidayName, setHolidayName] = useState("");

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleClear = () => {
    setHolidayDate("");
    setHolidayName("");
  };

  // Function For adding New Holiday
  const addNewHoliday = () => {
    setLoading(true);
    const url = `${mainUrl}/add-new-holiday`;
    const requestOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: newBearer,
    };
    const data = {
      current_user: newUserId,
      holiday_name: holidayName,
      holiday_date: holidayDate,
    };

    fetch(url, {
      method: "POST",
      headers: requestOptions,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          if (typeof result.message == "object") {
            const value = Object.values(result.message);
            ReactToastify(value[0], "error");
          } else {
            ReactToastify(result.message, "error");
          }
        } else {
          handleClear();
          ReactToastify(result.message, "success");
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        ReactToastify(error, "error");
      });
  };

  // on click of Submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    addNewHoliday();
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
            Add Holiday
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
                <div className="mb-3">
                  <label
                    htmlFor="holiday_name"
                    className={`form-label ${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    Holiday Name
                  </label>
                  <input
                    type="text"
                    className="form-control default__input"
                    style={{ margin: "0" }}
                    id="holiday_name"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="holiday_date"
                    className={`form-label ${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    Holiday Date
                  </label>
                  {/* <input
                    type="date"
                    className="form-control default__input"
                    style={{ margin: "0" }}
                    id="holiday_date"
                    value={holidayDate}
                    onChange={(e) => setHolidayDate(e.target.value)}
                  /> */}
                  <div className="holiday-datepicker-wrapper">
                    <DatePicker
                      className="form-control default__input"
                      onChange={onChange}
                    />
                  </div>
                </div>
                <Button onClick={handleSubmit} className="btn default-button">
                  Add Holiday
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
