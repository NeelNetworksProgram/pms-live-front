import React, { useState, useEffect } from "react";

export const SelectDateBy = ({ setStartDate, setEndDate }) => {
  // for selecting date by weekly or till date
  const [selectDateBy, setSelectDateBy] = useState("");
  const selectDateByOptions = [
    { value: "weekly", label: "This week" },
    { value: "tillDate", label: "Current month" },
  ];

  useEffect(() => {
    // if selected weekly case
    if (selectDateBy === "weekly") {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const startDateOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - (dayOfWeek - 1)
      );
      setStartDate(startDateOfWeek);

      const endDateOfWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (7 - dayOfWeek)
      );
      setEndDate(endDateOfWeek);
    }

    // if selected current month case
    if (selectDateBy === "tillDate") {
      const today = new Date();
      setEndDate(today);

      const startDateOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      setStartDate(startDateOfMonth);
    }

    setTimeout(() => {
      setSelectDateBy("");
    }, 2000);
  }, [selectDateBy]);

  return (
    <div>
      <div className="select-date-range">
        <h5>Else check report of this week/current month</h5>
        {/* getting reports weekly or till date */}
        <select
          className="default-text-color"
          name="select-date-range"
          id="select-date-range"
          value={selectDateBy}
          onChange={(e) => {
            setSelectDateBy(e.target.value);
          }}
        >
          <option value="">Select date by</option>
          {selectDateByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
