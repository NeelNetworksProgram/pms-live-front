import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutesAdmin = () => {
  const userRole = localStorage.getItem("userRole");

  return userRole === '"admin"' ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutesAdmin;
