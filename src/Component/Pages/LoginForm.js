// libraries
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import Cookies from "js-cookie";

// styling
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../stylesheet/Pages/LoginForm.css";
import "animate.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";

const LoginForm = () => {
  // full LoginForm component thread
  const mainUrl = useContext(UserContext);
  const [loading, setLoading] = useState(false); // for loader

  const [isChecked, setIsChecked] = useState(false);

  // for toggling password (hide and show)
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const LoginToken = localStorage.getItem("LoginToken");
  const userRole = localStorage.getItem("userRole");

  // this code is used to redirect user to admin / manager / employee dashboard
  useEffect(() => {
    if (LoginToken && userRole === '"admin"') {
      navigate(`/dashboard`);
    } else if (LoginToken && userRole === '"manager"') {
      navigate(`/homepage`);
    } else if (LoginToken && userRole === '"employee"') {
      navigate(`/home`);
    } else {
      navigate("/");
    }
  }, []);

  // if any issues with login token (expired or tampered) or else user deleted, then logout
  useEffect(() => {
    const tokenTampered = localStorage.getItem("tokenTampered");
    const tokenExpired = localStorage.getItem("tokenExpired");
    const userDeleted = localStorage.getItem("userDeleted");
    if (tokenTampered) {
      ReactToastify(tokenTampered, "info");
      setTimeout(() => {
        localStorage.clear();
      }, 1500);
    }
    if (tokenExpired) {
      ReactToastify(tokenExpired, "info");
      setTimeout(() => {
        localStorage.clear();
      }, 1500);
    }
    if (userDeleted) {
      ReactToastify(userDeleted, "info");
      setTimeout(() => {
        localStorage.clear();
      }, 1500);
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmail = (e) => {
    const getEmail = e.target.value;
    setEmail(getEmail);
  };

  const handlePassword = (e) => {
    const getPassword = e.target.value;
    setPassword(getPassword);
  };

  const handleClear = () => {
    setEmail("");
    setPassword("");
  };

  /* handleSubmit =  whenever the user tries to log in,  
             a fetch api is called to check the  credentials are matching or not */

  const handleSubmit = (e) => {
    // handleSubmit started
    e.preventDefault();

    setLoading(true);

    const data = { email, password };
    // handleClear();

    // Fetch API to POST the data into database and check if user credentials matches or not
    fetch(`${mainUrl}/user/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json(); // returns the readable stream as response
      })
      .then((result) => {
        // returns the actual data in json, developers will use this data
        if (result.error) {
          setLoading(false);
          /* if users creds are incorrect then printing out the error */

          const errorData = result.message;
          if (typeof errorData === "object") {
            Object.values(errorData).forEach((error) => {
              ReactToastify(error, "error");
            });
          } else {
            ReactToastify(errorData, "error");
          }

          if (result.data) {
            Object.entries(result.data).forEach(([key, value]) => {
              /* result.data => user is registered but his email id is not verified */
              /* if the user has passed correct creds but his email is not activated 
                      then result.data will return the activate link in an object */

              // this line gives us the exact activation resendlink
              fetch(value, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
              })
                .then((response) => {
                  return response.json();
                })
                .then((result) => {
                  ReactToastify(JSON.stringify(result.message), "info");
                })
                .catch((error) => console.log(error));
            });
          }
        } else {
          if (isChecked) {
            Cookies.set("email", email, { expires: 365 });
            Cookies.set("password", password, { expires: 365 });
          } else {
            Cookies.remove("email"); // remove email cookie
            Cookies.remove("password"); // remove password cookie
          }

          /* if users creds are correct then redirecting him to the dashboard page */
          const LoginToken = JSON.stringify(result.token);
          localStorage.setItem("LoginToken", LoginToken);

          const userId = JSON.stringify(result.data.user_id);
          localStorage.setItem("userId", userId);

          const userRole = JSON.stringify(result.data.user_roles);
          localStorage.setItem("userRole", userRole);

          const userName = JSON.stringify(result.data.user_name);
          localStorage.setItem("userName", userName);

          if (userRole === '"admin"') {
            navigate(`/dashboard`);
          } else if (userRole === '"manager"') {
            navigate(`/homepage`);
          } else if (userRole === '"employee"') {
            navigate("/home");
          } else {
            navigate("/");
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        ReactToastify(error, "error");
      });
  }; //handleSubmit ended

  const handleCheckBox = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    const emailCookie = Cookies.get("email");
    const passwordCookie = Cookies.get("password");

    if (emailCookie && passwordCookie) {
      setEmail(emailCookie);
      setPassword(passwordCookie);
      setIsChecked(true);
    }
  }, []);

  return (
    <div className="login-form-main-div">
      {/* Login Form Content */}
      {loading ? (
        <TailSpin
          height="100"
          width="100"
          color="#333"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
          }}
          wrapperClass="loader"
          visible={true}
        />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="animate__animated animate__zoomIn"
        >
          <section className="vh-100 default-bg-color">
            <div className="container py-5 h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                  <div
                    className="card text-white"
                    style={{ borderRadius: "1rem", backgroundColor: "#25245c" }}
                  >
                    <div className="card-body p-5 text-center">
                      <div className="mb-md-5 mt-md-4">
                        <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                        <p className="text-white-50 mb-5">
                          Please enter your email and password!
                        </p>

                        <div className="login-email">
                          <input
                            type="email"
                            className="login-email-input"
                            required
                            id="email"
                            placeholder="Enter your Email Address"
                            onChange={handleEmail}
                            value={email}
                          />
                        </div>
                        <div className="login-password">
                          <input
                            className="login-password-input"
                            required
                            id="password"
                            autoComplete="off"
                            placeholder="Enter your Password"
                            onChange={handlePassword}
                            value={password}
                            type={showPassword ? "text" : "password"}
                          />
                          <i
                            onClick={() => setShowPassword(!showPassword)}
                            className={`far ${
                              showPassword ? "fa-eye-slash" : "fa-eye"
                            } show-password-icon`}
                            id="togglePassword"
                          />
                        </div>

                        <div className="loginForm_links">
                          <div className="">
                            <input
                              id="rememberMe"
                              type="checkbox"
                              checked={isChecked}
                              onChange={handleCheckBox}
                            />
                            <label className="link" htmlFor="rememberMe">
                              Remember me
                            </label>
                          </div>
                          <div>
                            <Link to="/forgot-password" className="link">
                              Forgot Password?
                            </Link>
                          </div>
                        </div>

                        <button className="login-button" type="submit">
                          Login
                        </button>
                      </div>

                      <div>
                        <p className="mb-0">
                          Don't have an account?
                          <Link to="/register" className="link fw-bold">
                            Sign Up
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
