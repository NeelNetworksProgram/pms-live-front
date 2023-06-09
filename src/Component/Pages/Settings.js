// libraries
import React from "react";

// component
import Navbar from "../Navbar/Navbar";

// styling
import "../../stylesheet/Pages/Settings.css";

export const Settings = () => {
  return (
    <>
      <Navbar />
      <div className="default__page__margin">
        <div className="default__heading">
          <h3>Settings Page</h3>
        </div>
      </div>
    </>
  );
};
