// libraries
import React, { useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

// styling
import "../../stylesheet/Pages/ActivationPage.css";

// component
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "../Utility/ReactToastify";

const ActivationPage = () => {
  const navigate = useNavigate();
  const mainUrl = useContext(UserContext);
  const { userId } = useParams();

  useEffect(() => {
    const url = `${mainUrl}/user/verify/${userId}`;
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.error) {
          navigate("/");
        } else {
          // toast.success(result.message);
          ReactToastify(result.message, "success");
        }
      })
      .catch((error) => {
        // toast.error(error);
        ReactToastify(error, "error");
      });
  }, []);

  return (
    <>
      <div className="main">
        <h2>Hello User</h2>
        <p>
          Your email is verified now, Proceed to
          <Link to="/" className="login_link">
            Login 🚀
          </Link>
        </p>
      </div>
    </>
  );
};

export default ActivationPage;
