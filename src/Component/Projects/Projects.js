import React from "react";
import "../../stylesheet/Projects/Projects.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Navbar/Navbar";
import Profile from "../Profile/Profile";
import "../../stylesheet/App.css";
import { PageHeader } from "../Utility/PageHeader";

export const Projects = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <PageHeader />
    </>
  );
};
