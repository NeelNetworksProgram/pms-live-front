// import { useContext, createContext, useState } from "react";
// import { UserContext } from "./UserContext";
// import { useEffect } from "react";

// const NotificationsContext = createContext();

// const NotificationsProvider = ({ children }) => {
//   const mainUrl = useContext(UserContext);

//   // fetching logged in user login token
//   const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
//   const bearer = "Bearer " + LoginToken;
//   const newBearer = bearer.replace(/['"]+/g, "");

//   // fetching logged in user id
//   const userId = localStorage.getItem("userId"); // the logged in user id
//   const newUserId = userId.replace(/['"]+/g, "");

//   const [notifications, setNotifications] = useState([]);

//   const getNotifications = () => {
//     if (LoginToken) {
//       const url = `${mainUrl}/user/all-notifications/${newUserId}`;

//       const requestOptions = {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         Authorization: newBearer,
//       };

//       //this fetch call is used to get all notifications for the logged in user
//       fetch(url, {
//         method: "GET",
//         headers: requestOptions,
//       })
//         .then((response) => {
//           return response.json();
//         })
//         .then((result) => {
//           if (result.error) {
//             console.log(result.message, "error");
//           } else {
//             setNotifications(result.notification.reverse());
//           }
//         })
//         .catch((error) => {
//           // ReactToastify(error, "error");
//           // console.log(error);
//         });
//     }
//   };
//   //   getNotifications();

//   useEffect(() => {
//     // getNotifications();
//   }, [notifications]);

//   return (
//     <NotificationsContext.Provider value={"deven"}>
//       {children}
//     </NotificationsContext.Provider>
//   );
// };

// export { NotificationsContext, NotificationsProvider };
