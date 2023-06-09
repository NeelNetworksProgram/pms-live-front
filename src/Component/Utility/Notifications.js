import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import ReactToastify from "./ReactToastify";

export const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // fetching logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  // fetching logged in user login token
  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const mainUrl = useContext(UserContext);

  if (LoginToken) {
    const url = `${mainUrl}/user/all-notifications/${newUserId}`;

    const requestOptions = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: newBearer,
    };

    //this fetch call is used to get all projects count of an employee (total projects, completed projects, active projects)
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
          setNotifications(result.notification);
        }
      })
      .catch((error) => {
        ReactToastify(error, "error");
      });
  } else {
    ReactToastify("Sorry you are not authorised, please login again", "error");
  }

  return notifications;
};
