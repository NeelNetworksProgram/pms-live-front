// libraries
import React, { useState, useEffect, useContext } from "react";
import { TailSpin } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import Calendar from "react-calendar"; // https://www.npmjs.com/package/react-calendar
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";

// components
import Navbar from "../Navbar/Navbar";
import ReportsNavbar from "./ReportsNavbar";
import Profile from "../Profile/Profile";
import { SelectDateBy } from "./SelectDateBy";
import { UserContext } from "../../Context/UserContext";

// styling
import "react-calendar/dist/Calendar.css";
import "../../stylesheet/App.css";
import "../../stylesheet/Reports/Reports.css";
import { PageHeader } from "../Utility/PageHeader";
import { PageFooter } from "../Utility/PageFooter";

const ReportsOld = () => {
  const mainUrl = useContext(UserContext);

  // used for toggling loading spinner
  const [loading, setLoading] = useState(false);

  // fetching logged in user id
  const userId = localStorage.getItem("userId"); // the logged in user id
  const newUserId = userId.replace(/['"]+/g, "");

  // fetching logged in user login token
  const LoginToken = localStorage.getItem("LoginToken"); // logged in user login token
  const bearer = "Bearer " + LoginToken;
  const newBearer = bearer.replace(/['"]+/g, "");

  const [startDate, setStartDate] = useState(new Date()); // start date
  const [endDate, setEndDate] = useState(new Date()); // end date

  const [recordData, setRecordData] = useState([]); // this stores the records data

  // constructing headers for CSV Link
  const headers = [
    { label: "Employee Name", key: "Employee_Name" },
    { label: "Project Name", key: "Project_Name" },
    { label: "Working hrs", key: "Total_spent_time" },
    { label: "Worked on", key: "Worked_on" },
    { label: "Description", key: "Work_Description" },
  ];

  const [message, setMessage] = useState(""); // used to store the response msg
  const [successMessage, setSuccessMessage] = useState("");

  // start date for report calendar
  const handleStartDateChange = (date) => {
    setStartDate(date);
    // console.log(date);
  };

  // end date for report calendar
  const handleEndDateChange = (date) => {
    setEndDate(date);
    // console.log(date);
  };

  // used to get all records within a date range
  useEffect(() => {
    // formatting start date
    const year1 = startDate.getFullYear();
    const month1 = (startDate.getMonth() + 1).toString().padStart(2, "0");
    const day1 = startDate.getDate().toString().padStart(2, "0");
    const newStartDate = `${year1}-${month1}-${day1}`;

    // formatting end date
    const year2 = endDate.getFullYear();
    const month2 = (endDate.getMonth() + 1).toString().padStart(2, "0");
    const day2 = endDate.getDate().toString().padStart(2, "0");
    const newEndDate = `${year2}-${month2}-${day2}`;

    const url = `${mainUrl}/reports/within-time-range/${newUserId}/${newStartDate}/${newEndDate}`;

    setLoading(true);
    fetch(url, {
      // used to get all records within a date range
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: newBearer,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.error) {
          setLoading(false);
          const errorData = result.messages;
          if (typeof errorData === "object") {
            Object.values(errorData).forEach((error) => setMessage(error));
          } else {
            setMessage(result.message);
          }
          setSuccessMessage("");
          setRecordData([]);
        } else {
          setLoading(false);

          // formatting the success message date from yyyy-mm-dd to dd-mm-yyyy format
          const message = result.message;
          const dateRegex = /\d{4}-\d{2}-\d{2}/g;
          const dateMatches = message.match(dateRegex);
          if (dateMatches && dateMatches.length === 2) {
            const formattedDates = dateMatches.map((dateMatch) => {
              const date = new Date(dateMatch);
              return `${date.getDate().toString().padStart(2, "0")}-${(
                date.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${date.getFullYear().toString()}`;
            });
            const updatedMessage = message
              .replace(dateMatches[0], formattedDates[0])
              .replace(dateMatches[1], formattedDates[1]);
            setSuccessMessage(updatedMessage);
          }
          const data = result.data;
          setRecordData(data);
        }
      });
  }, [startDate, endDate]); //startDateFormatted, endDateFormatted

  // for pagination
  const [pageNumber, setPageNumber] = useState(0); // page number for the pagination
  const projectsPerPage = 10;
  const pageVisited = pageNumber * projectsPerPage;
  const pageCount = Math.ceil(recordData.length / projectsPerPage);

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  // for displaying all work records
  const displayRecords = recordData
    .slice(pageVisited, pageVisited + projectsPerPage)
    .map((item, index) => {
      // converting the time 02:27:00 to 2 hrs 27 mins
      const date = new Date(`${item.Worked_on}T${item.Total_spent_time}Z`);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      let display = "";

      if (hours) {
        display = `${hours} hr`;
        if (hours > 1) {
          display += "s";
        }
      }

      if (minutes) {
        if (display) {
          display += " ";
        }
        display += `${minutes} min`;
        if (minutes > 1) {
          display += "s";
        }
      }

      return (
        <tr className="table__values" key={item.id}>
          <td>{index + 1}</td>
          <td>{item.Employee_Name}</td>
          <td>{item.Project_Name}</td>
          <td>
            {/* {item.Total_spent_time} hrs */}
            {display || "0 min"}
          </td>
          <td>
            {(() => {
              const date = new Date(item.Worked_on);
              return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });
            })()}
          </td>
          <td style={{ textAlign: "left", width: "40%" }}>
            {item.Work_Description === "" ? "---" : item.Work_Description}
          </td>
        </tr>
      );
    });

  return (
    <>
      <Navbar />
      <PageHeader />

      <div className="default__page__margin">
        {/* Reports Navbar */}
        <ReportsNavbar />

        {/* Reports Calendar section */}
        <div className="user-report records-report mt-3">
          <h4 className="mb-4">
            Select a start date & end date to check all the work records done by
            users in that time frame
          </h4>
          <div className="calendar-section">
            <div className="reports-calendar start-date-calendar">
              <h5>Start Date</h5>
              <Calendar
                // selectRange={true}
                className="react-calendar calendar"
                tileClassName="tile"
                // onChange={([start, end]) => {
                //     handleStartDateChange(start);
                //     handleEndDateChange(end);
                //     console.log(start, end);
                // }}
                // value={value}
                onChange={(date) => {
                  handleStartDateChange(date);
                }}
              />
            </div>
            <div className="reports-calendar end-date-calendar">
              <h5>End Date</h5>
              <Calendar
                // selectRange={true}
                className="react-calendar calendar"
                tileClassName="tile"
                // onChange={([start, end]) => {
                //     handleStartDateChange(start);
                //     handleEndDateChange(end);
                //     console.log(start, end);
                // }}
                // value={value}
                onChange={(date) => {
                  handleEndDateChange(date);
                }}
              />
            </div>
          </div>
          <SelectDateBy setStartDate={setStartDate} setEndDate={setEndDate} />
        </div>

        <div className="export-table-into-csv">
          {/* this msg prints "All data in between 'start date' and 'end date' are as listed below:" */}
          <h5 style={{ marginLeft: "10px" }}>{successMessage}</h5>
          <CSVLink
            data={recordData}
            headers={headers}
            filename={"reports.csv"}
            className="CSVLink"
          >
            <h5>Download Report as CSV</h5>
          </CSVLink>
        </div>

        {/* table for work records section */}
        <div className="default__table__section">
          {loading ? (
            <TailSpin
              height="80"
              width="80"
              color="#333"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{
                position: "absolute",
                width: "97%",
                height: "15vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              wrapperClass="loader"
              visible={true}
            />
          ) : recordData.length > 0 ? (
            <table className="table text-center default__table__content">
              <thead>
                <tr className="table__heading">
                  <th>Sr. no</th>
                  <th>Employee Name</th>
                  <th>Project Name</th>
                  <th>Working hrs</th>
                  <th>Worked on</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>{displayRecords}</tbody>
            </table>
          ) : (
            <h5 style={{ fontWeight: "600", color: "red" }} className="mt-2">
              {message}
            </h5>
          )}
          <div className="pagination">
            <ReactPaginate
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageCount={pageCount}
              previousLabel="< previous"
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              // disabledClassName='paginationDisabled'
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      </div>
      {/* <PageFooter /> */}
    </>
  );
};

export default ReportsOld;
