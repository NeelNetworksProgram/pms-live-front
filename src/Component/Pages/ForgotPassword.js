// libraries
import React, { useState, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";

//components
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";

//styling
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../stylesheet/Pages/ForgotPassword.css";
import "animate.css";

const ForgotPassword = () => {
  const mainUrl = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");

  const handleEmail = (e) => {
    const getEmail = e.target.value;
    setEmail(getEmail);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = { email };
    setEmail("");

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
          setLoading(false);
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
          // toast.info("Reset Password Link sent please check your email");
          ReactToastify(
            "Reset Password Link sent please check your email",
            "info"
          );
          setLoading(false);
        }
      });
  };

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
        // Forgot Password Form Content
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
                        <h2 className="fw-bold mb-5 text-uppercase">
                          Reset Password
                        </h2>
                        <div className="forgot-password-email">
                          <input
                            type="email"
                            className="forgot-password-email-input"
                            required
                            autoComplete="off"
                            id="email"
                            placeholder="Enter your Email Address"
                            onChange={handleEmail}
                            value={email}
                          />
                        </div>

                        <button
                          className="forgot-password-button"
                          type="submit"
                        >
                          Reset Password
                        </button>
                      </div>
                      <div>
                        <Link className="link" to="/">
                          remember your password?
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

export default ForgotPassword;
