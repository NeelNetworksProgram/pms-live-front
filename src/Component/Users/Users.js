import React from "react";
import "../../stylesheet/Users/Users.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/Navbar";
import Profile from "../Profile/Profile";
import { PageHeader } from "../Utility/PageHeader";

export const Users = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <PageHeader />
    </>
  );
};
