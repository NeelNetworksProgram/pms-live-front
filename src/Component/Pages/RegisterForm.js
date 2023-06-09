// libraries
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Tooltip } from "react-tooltip";

// styling
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../stylesheet/Pages/RegisterForm.css";
import "animate.css";
import "react-tooltip/dist/react-tooltip.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";

const RegisterForm = () => {
  const mainUrl = useContext(UserContext);
  const [loading, setLoading] = useState(false); // for loader

  // for toggling password (hide and show)
  const [showPassword, setShowPassword] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsername = (e) => {
    const getUsername = e.target.value;
    setUserName(getUsername);
  };

  const handleEmail = (e) => {
    const getEmail = e.target.value;
    setEmail(getEmail);
  };

  const handlePassword = (e) => {
    const getPassword = e.target.value;
    setPassword(getPassword);
  };

  const handleClear = () => {
    setUserName("");
    setEmail("");
    setPassword("");
  };

  // validating the email of user
  function validateEmail() {
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    // const domainRegex = /@neelnetworks.com$/i;
    // if (emailRegex.test(email) && domainRegex.test(email)) {
    //   return true;
    // } else {
    //   return false;
    // }

    const slicedEmail = email.slice(-17);
    const isCorrect = "@neelnetworks.com";
    if (slicedEmail === isCorrect) {
      return true;
    } else {
      return false;
    }
  }

  // validating the password of user
  // function validatePassword() {
  //   const passwordRegex =
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d@$!%*?&]{8,}$/;

  //   if (passwordRegex.test(password)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // Button Click event = Handle Submit //
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (/*validatePassword() &&*/ validateEmail()) {
      const data = { username: userName, email, password };
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
              Object.values(errorData).forEach((error) => {
                ReactToastify(error, "error");
                // toast.error(error);
              });
            } else {
              // toast.error(errorData);
              ReactToastify(errorData, "error");
            }
          } else {
            handleClear();
            // toast.success(
            //   "Thankyou for registering, Please check your email for verification"
            // );
            ReactToastify(
              "Thankyou for registering, Please check your email for verification",
              "success"
            );
          }
        })
        .catch((error) => {
          setLoading(false);
          // toast.error(
          //   "Something went wrong, Please try to register again after sometime"
          // );
          ReactToastify(
            "Something went wrong, Please try to register again after sometime",
            "error"
          );
        });
    } else {
      setLoading(false);

      if (!validateEmail()) {
        // toast.error(
        //   "Please use your official Email Id, eg: 'anybody@neelnetworks.com'"
        // );
        ReactToastify(
          "Please use your official Email Id, eg: 'anybody@neelnetworks.com'",
          "error"
        );
      }
      // if (!validatePassword()) {
      //   toast.error(
      //     "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      //   );
      // }
    }
  };

  return (
    <>
      <div className="register-page-main">
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
          //Register Form Content
          <form
            onSubmit={handleSubmit}
            className="animate__animated animate__zoomIn"
          >
            <section className="vh-100">
              <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div
                      className="card text-white"
                      style={{
                        borderRadius: "1rem",
                        backgroundColor: "#25245c",
                      }}
                    >
                      <div className="card-body p-5 text-center">
                        <div className="mb-md-5 mt-md-4">
                          <h2 className="fw-bold mb-2 text-uppercase mb-5">
                            Register Form
                          </h2>

                          <div className="register-input-box register-username">
                            <input
                              className="register-username-input"
                              type="text"
                              required
                              id="username"
                              placeholder="Enter your username"
                              onChange={(e) => handleUsername(e)}
                              value={userName}
                            />
                          </div>

                          <div className="register-input-box register-email">
                            <Tooltip
                              id="email-tooltip"
                              style={{
                                width: "300px",
                                background: "#000",
                                opacity: ".9",
                                color: "#fff",
                              }}
                            />
                            <input
                              type="email"
                              data-tooltip-id="email-tooltip"
                              data-tooltip-content="Please use official email only, For eg: 'user@neelnetworks.com'"
                              data-tooltip-place="right"
                              className="register-email-input"
                              required
                              id="email"
                              placeholder="Enter your Email Address"
                              onChange={(e) => handleEmail(e)}
                              value={email}
                            />
                          </div>

                          <div className="register-input-box register-password">
                            <Tooltip
                              id="password-tooltip"
                              style={{
                                width: "300px",
                                background: "#000",
                                opacity: ".9",
                                color: "#fff",
                              }}
                            />
                            <input
                              data-tooltip-id="password-tooltip"
                              data-tooltip-content="Password should be 8 characters long, it should contain atleast 1 capital letter, 1 small letter, 1 number and 1 special character"
                              data-tooltip-place="right"
                              className="register-password-input"
                              required
                              id="password"
                              autoComplete="off"
                              placeholder="Enter your Password"
                              onChange={(e) => handlePassword(e)}
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
                          <button className="register-button" type="submit">
                            Register
                          </button>
                        </div>

                        <div>
                          <Link className="link" to="/">
                            Already a user?
                          </Link>
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
    </>
  );
};

export { RegisterForm };
