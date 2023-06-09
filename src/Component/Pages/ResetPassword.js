// libraries
import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";

// styling
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../stylesheet/Pages/ResetPassword.css";
import "animate.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";

const ResetPassword = () => {
  // full resetPassword component thread
  const navigate = useNavigate();

  const mainUrl = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  // for toggling password (hide and show)
  const [showPassword, setShowPassword] = useState(false);

  // for toggling confirm password (hide and show)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { resetPasswordToken } = useParams(); // reset password token

  // for fetching the email id
  useEffect(() => {
    const url = `${mainUrl}/user/fetchemail/${resetPasswordToken}`;

    // getting email id and using it in the email input
    fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.error) {
          ReactToastify(result.message, "error");
          setTimeout(() => {
            navigate("/");
          }, 2500);
        } else {
          setEmail(result.data);
        }
      });
  }, []);

  const handleEmail = (e) => {
    const getEmail = e.target.value;
    setEmail(getEmail);
  };

  const handlePassword = (e) => {
    const getPassword = e.target.value;
    setPassword(getPassword);
  };

  const handleConfirmPassword = (e) => {
    const getConfirmPassword = e.target.value;
    setConfirmPassword(getConfirmPassword);
  };

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

  /* handleSubmit =  whenever the user tries to log in,  
             a fetch api is called to check the  credentials are matching or not */

  const handleSubmit = (e) => {
    // handleSubmit started
    e.preventDefault();
    setLoading(true);

    if (validatePassword()) {
      const data = { email, password, confirm_password: confirmPassword };
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
          setLoading(false);
          if (result.error) {
            const err = Object.values(result.message);
            err.map((error) => {
              ReactToastify(error, "error");
            });
          } else {
            setPassword("");
            setConfirmPassword("");
            ReactToastify(result.message, "success");
            setTimeout(() => {
              navigate("/");
            }, 2500);
          }
        })
        .catch((error) => {
          setLoading(false);
          ReactToastify(error, "error");
        });
    } else {
      setLoading(false);
      ReactToastify(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
        "error"
      );
    }
  }; //handleSubmit ended

  return (
    <>
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
        //Login Form Content
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
                    style={{ borderRadius: "1rem", backgroundColor: "#25245c" }}
                  >
                    <div className="card-body p-5 text-center">
                      <div className="mb-md-5 mt-md-4">
                        <h3 className="fw-bold mb-5 text-uppercase">
                          Reset Password Form
                        </h3>

                        {/* Email input */}
                        <div className="reset-password-input-box reset-password-email">
                          <input
                            type="email"
                            className={`reset-password-email-input ${
                              email ? "active" : ""
                            }`}
                            required
                            autoComplete="off"
                            id="email"
                            placeholder="Enter your Email Address"
                            onChange={handleEmail}
                            value={email}
                            autoFocus
                            disabled
                          />
                        </div>

                        {/* Password input */}
                        <div className="reset-password-input-box reset-password-password">
                          <input
                            className="reset-password-password-input"
                            required
                            id="password"
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

                        {/* Confirm password input */}
                        <div className="reset-password-input-box reset-password-confirm-password">
                          <input
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            className="reset-password-confirm-password-input"
                            placeholder="Re-enter your Password"
                            onChange={handleConfirmPassword}
                            value={confirmPassword}
                          />
                          <i
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className={`far ${
                              showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                            } show-password-icon`}
                            id="toggleConfirmPassword"
                          />
                        </div>

                        <button className="reset-password-button" type="submit">
                          Reset Password
                        </button>
                      </div>
                      <div>
                        <Link className="link" to="/">
                          Login now?
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
    </>
  );
};

export default ResetPassword;
