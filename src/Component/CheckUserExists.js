// libraries
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// component
import { UserContext } from "../Context/UserContext";

export default function CheckUserExists() {
  const mainUrl = useContext(UserContext);
  const navigate = useNavigate();

  const LoginToken = localStorage.getItem("LoginToken");
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const userId = localStorage.getItem("userId"); // logged in userId
  const newUserId = userId.replace(/['"]+/g, "");

  // if any character in localstorage is changed then logout the user
  // useEffect(() => {
  //   window.addEventListener("storage", function (e) {
  //     console.log(e);
  //     if (
  //       e.key === "LoginToken" ||
  //       e.key === "userAuthority" ||
  //       e.key === "userId" ||
  //       e.key === "userRole"
  //     ) {
  //       localStorage.clear();
  //       const tokenTampered = "Something went wrong, please login again!";
  //       localStorage.setItem("tokenTampered", tokenTampered);
  //       navigate("/");
  //       console.log("more inside");
  //     }
  //   });
  // }, []);

  // checking if user exists or not, if not then logout the user
  useEffect(() => {
    // this API checks if user exists in database or not
    const url = `${mainUrl}/user/${newUserId}`;
    const requestOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: newBearer,
    };

    fetch(url, {
      method: "GET",
      headers: requestOptions,
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        // if the login token is expired
        if (result.code === 500 || result.error) {
          setTimeout(() => {
            localStorage.clear();
            const tokenExpired =
              "Your login token is expired 😟, please login again!";
            localStorage.setItem("tokenExpired", tokenExpired);
            navigate("/");
            window.location.reload();
          }, 2000);
        }

        // if user is deleted from database then also logout the user
        if (result.error) {
          setTimeout(() => {
            localStorage.clear();
            const userDeleted =
              "You're no longer a user 😟, please register yourself again!";
            localStorage.setItem("userDeleted", userDeleted);
            navigate("/");
            window.location.reload();
          }, 2000);
        }
      });
  }, []);
}
