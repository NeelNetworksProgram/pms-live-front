// libraries
import React from "react";

// styling
import "../../stylesheet/GlobalFilter/GlobalFilter.css";

// search box for the react table
export const ReportSearchFilter = ({ filter, setFilter }) => {
  return (
    <span className="global-filter-span">
      <input
        className="global-filter-input"
        type="text"
        placeholder="Search from reports..."
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
      />
    </span>
  );
};
