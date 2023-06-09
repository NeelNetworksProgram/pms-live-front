// libraries
import React, { useState, useEffect, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import Button from "react-bootstrap/Button";

// components
import Navbar from "../Navbar/Navbar";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";
import { ContextTheme } from "../../Context/ThemeContext";

// styling
import "../../stylesheet/App.css";

export default function MyProfile({ isOpen, setIsOpen }) {
  const [loading, setLoading] = useState(true);

  const mainUrl = useContext(UserContext);
  const { toggleTheme } = useContext(ContextTheme);

  const userId = localStorage.getItem("userId"); // logged in userId
  const newUserId = userId.replace(/['"]+/g, "");

  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const [message, setMessage] = useState(""); // used to store the response msg

  // for toggling password (hide and show)
  const [showPassword, setShowPassword] = useState(false);
  const [showProfile, setShowProfile] = useState(true);

  const [user, setUser] = useState({});

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");

  // validating the password of user
  function validatePassword() {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (passwordRegex.test(password)) {
      return true;
    } else {
      return false;
    }
  }

  //this code is used to get all users data and then returning only the current logged in user
  useEffect(() => {
    if (LoginToken) {
      const url = `${mainUrl}/user`;

      const requestOptions = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      };

      //this fetch call is used to get all users data and then returning only the current logged in user
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
            const userData = result.data;
            userData.map((user) => {
              if (user.id === newUserId) {
                setUser(user);
                setUsername(user.username);
                setEmail(user.email);
              }
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          ReactToastify(error, "error");
          setLoading(false);
        });
    } else {
      ReactToastify(
        "Sorry you are not authorised, please login again",
        "error"
      );
      setLoading(false);
    }
  }, []);

  const handleUsername = (e) => {
    setNewUsername(e.target.value);
    setUsername(e.target.value);
  };
  const handlePassword = (e) => setPassword(e.target.value);
  const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);

  // functions used to update username & password.
  const updateUsername = () => {
    const data = {
      username,
    };
    const url = `${mainUrl}/user/${newUserId}`; // to update the username

    // used to update the username
    fetch(url, {
      method: "PATCH",
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
          console.log(result.message);
        } else {
          ReactToastify(result.message, "success");
          setPassword("");
          setConfirmPassword("");
        }
      })
      .catch((error) => {
        console.log("err = " + error);
        ReactToastify(error, "error");
      });
  };

  const updatePassword = () => {
    if (validatePassword()) {
      const data = {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      };
      const url = `${mainUrl}/user/resetpassword`; // to update the password

      fetch(url, {
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
            const err = Object.values(result.message);
            err.map((error) => {
              ReactToastify(error, "error");
            });
          } else {
            ReactToastify(result.message, "success");
            setPassword("");
            setConfirmPassword("");
          }
        })
        .catch((error) => {
          console.log(error);
          ReactToastify(error, "error");
        });
    } else {
      if (password === "" || confirmPassword === "") {
        ReactToastify("Please provide password & confirm password", "error");
      } else {
        ReactToastify(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
          "error"
        );
      }
    }
  };

  const updateUsernameAndPassword = () => {
    const data = {
      username,
    };
    const url = `${mainUrl}/user/${newUserId}`; // to update the username

    // used to update the username
    fetch(url, {
      method: "PATCH",
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
          console.log(result);
        } else {
          ReactToastify(result.message, "success");
          setPassword("");
          setConfirmPassword("");
        }
      })
      .catch((error) => {
        console.log(error);
        ReactToastify(error, "error");
      });

    if (validatePassword()) {
      const data = {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      };
      const url = `${mainUrl}/user/resetpassword`; // to update the password

      fetch(url, {
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
            const err = Object.values(result.message);
            err.map((error) => {
              ReactToastify(error, "error");
            });
          } else {
            ReactToastify(result.message, "success");
            setPassword("");
            setConfirmPassword("");
          }
        })
        .catch((error) => {
          ReactToastify(error, "error");
        });
    } else {
      if (password === "" || confirmPassword === "") {
        ReactToastify("Please provide password & confirm password", "error");
      } else {
        ReactToastify(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
          "error"
        );
      }
    }
  };

  const handleSubmit = (e) => {
    // handleSubmit started
    e.preventDefault();
    // if everything is null and user hits submit, giving error cannot set null values
    if (username === "" || password === "" || confirmPassword === "") {
      ReactToastify("Cannot set null values", "error");
    } else {
      if (
        username === newUsername &&
        password === "" &&
        confirmPassword === ""
      ) {
        updateUsername();
      } else if (
        username !== newUsername &&
        password !== "" &&
        confirmPassword !== ""
      ) {
        updatePassword();
      } else if (
        username === newUsername &&
        password !== "" &&
        confirmPassword !== ""
      ) {
        updateUsernameAndPassword();
      }
    }
  }; //handleSubmit ended

  return (
    <>
      {/* Navbar */}
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      {/* Header */}
      <PageHeader />
      {/* main content */}
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
          <div
            className={`headings ${
              toggleTheme ? "dark-text-color" : "default-text-color"
            }`}
          >
            <div className="myprofile" onClick={() => setShowProfile(true)}>
              <p className={`myprofile-heading ${showProfile ? "bold" : ""}`}>
                My Profile
              </p>
            </div>
            <div
              className="update-password"
              onClick={() => setShowProfile(false)}
            >
              <p className={`myprofile-heading ${showProfile ? "" : "bold"} `}>
                Update Password
              </p>
            </div>
          </div>
          {loading ? (
            <TailSpin
              height="30"
              width="30"
              color="#333"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{
                width: "100%",
                height: "10vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              wrapperClass="loader"
              visible={true}
            />
          ) : showProfile ? (
            <div
              className={`myprofile-content ${
                toggleTheme ? "dark-text-color" : "default-text-color"
              }`}
            >
              <p>
                <span>Email ID:</span>
                {user.email}
              </p>
              <p>
                <span>Username:</span> {user.username}
              </p>
              <p>
                <span>User Role:</span> {user.roles}
              </p>
            </div>
          ) : (
            <div className="update-password-form">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className={`form-label ${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    disabled
                    style={{ cursor: "not-allowed", margin: "0" }}
                    type="email"
                    className="form-control default__input"
                    id="email"
                    value={email}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className={`form-label ${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    }`}
                  >
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="form-control default__input"
                      style={{ margin: "0" }}
                      required
                      id="password"
                      placeholder="Enter Password"
                      onChange={handlePassword}
                      autoComplete="off"
                      value={password}
                      type={showPassword ? "text" : "password"}
                    />
                    <i
                      onClick={() => setShowPassword(!showPassword)}
                      className={`far ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                      id="togglePassword"
                      style={{
                        position: "absolute",
                        right: "10px",
                        cursor: "pointer",
                        top: "3px",
                        fontSize: "22px",
                        padding: "5px",
                      }}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="confirm-password"
                    className={`form-label ${
                      toggleTheme ? "dark-text-color" : "default-text-color"
                    }`}
                  >
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      className="form-control default__input"
                      style={{ margin: "0" }}
                      required
                      id="confirm-password"
                      placeholder="Re-enter password"
                      autoComplete="off"
                      onChange={handleConfirmPassword}
                      value={confirmPassword}
                      type={showPassword ? "text" : "password"}
                    />
                    <i
                      onClick={() => setShowPassword(!showPassword)}
                      className={`far ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                      id="togglePassword"
                      style={{
                        position: "absolute",
                        right: "10px",
                        cursor: "pointer",
                        top: "3px",
                        fontSize: "22px",
                        padding: "5px",
                      }}
                    />
                  </div>
                </div>
                <Button type="submit" className="btn default-button">
                  Update
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
      <PageFooter />
    </>
  );
}
