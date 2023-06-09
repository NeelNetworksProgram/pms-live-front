import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const EmployeePrivateRoute = () => {
  const userRole = localStorage.getItem("userRole");

  return userRole === '"employee"' ? <Outlet /> : <Navigate to="/" />;
};

export default EmployeePrivateRoute;
