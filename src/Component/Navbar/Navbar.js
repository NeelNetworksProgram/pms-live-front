import React from "react";
import AdminNavbar from "./AdminNavbar";
import ManagerNavbar from "./ManagerNavbar";
import EmployeeNavbar from "./EmployeeNavbar";
import CheckUserExists from "../CheckUserExists";

const Navbar = ({ isOpen, setIsOpen }) => {
  const userRole = localStorage.getItem("userRole");

  return (
    <>
      {userRole === '"admin"' ? (
        <AdminNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
      ) : userRole === '"manager"' ? (
        <ManagerNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
      ) : (
        <EmployeeNavbar
          userRole={userRole}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
      <CheckUserExists />
    </>
  );
};

export default Navbar;
