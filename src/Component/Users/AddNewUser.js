// libraries
import React, { useContext, useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { TailSpin } from "react-loader-spinner";

//  css styling
import "../../stylesheet/Users/AddNewUser.css";
import "../../stylesheet/App.css";

// importing components
import Navbar from "../Navbar/Navbar";
import Profile from "../Profile/Profile";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { ContextTheme } from "../../Context/ThemeContext";

export const AddNewUser = ({ isOpen, setIsOpen }) => {
  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  // accessing login token from localstorage
  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  // states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  // validating the email of user
  function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const domainRegex = /@neelnetworks.com$/i;
    if (emailRegex.test(email) && domainRegex.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  const validateUsername = () => username !== "";

  const validateRole = () => userRole !== "";

  const handleRadioChange = (event) => {
    setUserRole(event.target.value);
  };

  // just clears the state
  const handleClear = () => {
    setUsername("");
    setEmail("");
    setUserRole("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateUsername() && validateEmail() && validateRole()) {
      setLoading(true);
      const data = { username, email, roles: userRole, is_active: "1" };
      const url = `${mainUrl}/user`;

      fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          setLoading(false);
          if (result.error) {
            const errorData = result.message;

            if (typeof errorData === "object") {
              Object.values(errorData).forEach((error) =>
                ReactToastify(error, "error")
              );
            } else {
              ReactToastify(errorData, "error");
            }
          } else {
            ReactToastify("User created successfully!", "success");
            handleClear();

            // if user creates successfully, then sending him reset password link via mail
            fetch(`${mainUrl}/user/forgotpassword`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                accept: "application/json",
              },
              body: JSON.stringify(data),
            })
              .then((response) => {
                return response.json();
              })
              .then((result) => {
                if (result.error) {
                  // setLoading(false);
                  const errorData = result.message;

                  if (typeof errorData === "object") {
                    Object.values(errorData).forEach((error) =>
                      ReactToastify(error, "error")
                    );
                  } else {
                    ReactToastify(errorData, "error");
                  }
                } else {
                  ReactToastify(
                    `Reset Password Link sent to ${username}`,
                    "info"
                  );
                  // setLoading(false);
                }
              });
          }
        })
        .catch((error) => {
          setLoading(false);
          ReactToastify(error, "error");
        });
    } else {
      if (!validateUsername()) {
        ReactToastify("Please enter username", "error");
      }
      if (!validateEmail()) {
        ReactToastify(
          "Please use official Email Id, eg: 'user@neelnetworks.com'",
          "error"
        );
      }
      if (!validateRole()) {
        ReactToastify("Please select user type", "error");
      }
    }
  };

  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* heading content */}
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
            Add new user
          </h3>
          {loading ? (
            <TailSpin
              height="50"
              width="50"
              color="#333"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{
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
            <Form
              className={`form-page form__div-box ${
                toggleTheme ? "dark-sub-text-color" : "default-text-color"
              }`}
            >
              <Form.Group className="mb-3" /*controlId="formBasicEmail"*/>
                <Form.Label
                  className={`${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  Username:
                </Form.Label>
                <Form.Control
                  type="input"
                  className="form-control default__input"
                  style={{ margin: "0px" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group className="mb-3" /*controlId="formBasicEmail"*/>
                <Form.Label
                  className={`${
                    toggleTheme ? "dark-sub-text-color" : "default-text-color"
                  }`}
                >
                  Email:
                </Form.Label>
                <Form.Control
                  type="email"
                  className="form-control default__input"
                  style={{ margin: "0px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                />
              </Form.Group>
              <Form.Group>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Form.Label
                    className={`${
                      toggleTheme ? "dark-sub-text-color" : "default-text-color"
                    }`}
                  >
                    User Type:
                  </Form.Label>
                  <RadioGroup
                    style={{ marginLeft: "50px" }}
                    row
                    aria-labelledby="add-new-user-type-radio-group"
                    name="add-new-user-type"
                    value={userRole}
                    onChange={handleRadioChange}
                  >
                    <FormControlLabel
                      value="admin"
                      control={<Radio />}
                      label="Admin"
                    />
                    <FormControlLabel
                      value="manager"
                      control={<Radio />}
                      label="Manager"
                    />
                    <FormControlLabel
                      value="employee"
                      control={<Radio />}
                      label="Employee"
                    />
                  </RadioGroup>
                </div>
              </Form.Group>

              <Button
                className="btn default-button"
                onClick={handleSubmit}
                type="submit"
              >
                Create user
              </Button>
            </Form>
          )}
        </div>
      </div>
      {/* ending tag for default__page__margin */}
      <PageFooter />
    </>
  );
};
