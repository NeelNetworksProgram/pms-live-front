// libraries
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

//stylesheets
import "./stylesheet/App.css";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";

//components
// Pages
import LoginForm from "./Component/Pages/LoginForm"; //login form
import { RegisterForm } from "./Component/Pages/RegisterForm"; // register form
import { NoPage } from "./Component/Pages/NoPage"; // 404 error page
import ActivationPage from "./Component/Pages/ActivationPage"; // activation page
import { AdminDashboard } from "./Component/Dashboard/AdminDashboard"; // Admin dashboard page
import { ManagerDashboard } from "./Component/Dashboard/ManagerDashboard"; // Admin dashboard page
import { EmployeeDashboard } from "./Component/Dashboard/EmployeeDashboard"; // Employee dashboard page
import ForgotPassword from "./Component/Pages/ForgotPassword"; // forgot password form
import ResetPassword from "./Component/Pages/ResetPassword"; // reset password form
import MyProfile from "./Component/Profile/MyProfile"; // logged in user profile page
import { AllNotifications } from "./Component/Pages/AllNotifications";
import { AddHoliday } from "./Component/Pages/AddHoliday";
// import { AddProjectCategories } from "./Component/Pages/AddProjectCategories";
// import { AddEmployeeJobRole } from "./Component/Pages/AddEmployeeJobRole";

// tasks
import { MyTasks } from "./Component/Tasks/MyTasks";
import { AssignTask } from "./Component/Tasks/AssignTask";
import { PendingTasks } from "./Component/Tasks/PendingTasks";
import { CompletedTasks } from "./Component/Tasks/CompletedTasks";

// Private Routes
import PrivateRoutes from "./Component/PrivateRoute/PrivateRoutes"; // private routes
import PrivateRouteAdmin from "./Component/PrivateRoute/PrivateRouteAdmin";
import EmployeePrivateRoute from "./Component/PrivateRoute/EmployeePrivateRoute";
import PrivateRouteAdminManager from "./Component/PrivateRoute/PrivateRouteAdminManager";

// projects components
import ExistingProject from "./Component/Projects/ForAdmin/ExistingProject"; // all projects
import OldPageExistingProject from "./Component/Projects/ForAdmin/OldPageExistingProject";
import AssignProjectOld from "./Component/Projects/ForAdmin/ToAssignAProject/AssignProjectOld"; // assign a project old
import AssignProject from "./Component/Projects/ForAdmin/ToAssignAProject/AssignProjects";
import { AddProject } from "./Component/Projects/ForAdmin/ToAddAProject/AddProject";
import AddTimeInProject from "./Component/Projects/ForEmployees/AddTimeInProject"; // for employee to add time entry
import { EmployeeProjects } from "./Component/Projects/ForEmployees/EmployeeProjects";
import { TimeEntriesBrowser } from "./Component/Projects/ForAdmin/ToAssignAProject/TimeEntriesBrowser";
import { EmailLogs } from "./Component/Projects/ForAdmin/ToAssignAProject/EmailLogs";

// users components
import AllUsersOld from "./Component/Users/AllUsersOld";
import AllUsers from "./Component/Users/AllUsers"; // all users page
import { AddNewUser } from "./Component/Users/AddNewUser";

//reports components
import Reports from "./Component/Reports/Reports";
import ReportsOld from "./Component/Reports/ReportsOld";
import UserProjectReport from "./Component/Reports/UserProjectReport";
import CheckUserReport from "./Component/Reports/CheckUserReport";
import CheckProjectReport from "./Component/Reports/CheckProjectReport";

import { Settings } from "./Component/Pages/Settings";

// context
import { UserContext } from "./Context/UserContext";

const App = () => {
  const mainUrl = `https://pms.neelnetworks.in/api`;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <UserContext.Provider value={mainUrl}>
        <Routes>
          {/* Pages */}
          <Route index path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/email-activation/:userId"
            element={<ActivationPage />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:resetPasswordToken"
            element={<ResetPassword />}
          />
          {/* checking if loginToken exists or not, if not, then redirects to Login page */}
          <Route element={<PrivateRoutes />}>
            {/* ---------------All Notifications route ----------------------- */}
            <Route
              path="/all-notifications"
              element={
                <AllNotifications isOpen={isOpen} setIsOpen={setIsOpen} />
              }
            />

            {/* ------------------------ My profile route ------------------ */}
            <Route
              path="/my-profile"
              element={<MyProfile isOpen={isOpen} setIsOpen={setIsOpen} />}
            />

            {/* ------------------------ Dashboard route ------------------ */}
            <Route
              path="/dashboard"
              element={<AdminDashboard isOpen={isOpen} setIsOpen={setIsOpen} />}
            />
            <Route
              path="/homepage"
              element={
                <ManagerDashboard isOpen={isOpen} setIsOpen={setIsOpen} />
              }
            />
            <Route
              path="/home"
              element={
                <EmployeeDashboard isOpen={isOpen} setIsOpen={setIsOpen} />
              }
            />

            {/* ---------------------- all tasks routes -------------- */}
            <Route
              path="/assign-task"
              element={<AssignTask isOpen={isOpen} setIsOpen={setIsOpen} />}
            />
            <Route
              path="/my-tasks"
              element={<MyTasks isOpen={isOpen} setIsOpen={setIsOpen} />}
            />
            <Route path="/my-tasks/pending" element={<PendingTasks />} />
            <Route path="/my-tasks/completed" element={<CompletedTasks />} />

            {/* ----------------- all Projects route -------------------*/}
            {/* ---------------- Employee private route ------------------ */}
            {/* Add time in a project page */}
            <Route element={<EmployeePrivateRoute />}>
              <Route
                path="/projects/add-time-in-project"
                element={
                  <AddTimeInProject isOpen={isOpen} setIsOpen={setIsOpen} />
                }
              />

              {/* my projects page */}
              <Route
                path="/projects/employee-projects"
                element={
                  <EmployeeProjects isOpen={isOpen} setIsOpen={setIsOpen} />
                }
              />
            </Route>

            {/* ------------- checking if role = manager or admin ------------- */}

            <Route element={<PrivateRouteAdminManager />}>
              <Route
                path="/projects/existing-projects"
                element={
                  <ExistingProject isOpen={isOpen} setIsOpen={setIsOpen} />
                }
              />
              <Route
                path="/projects/add-project-form"
                element={<AddProject isOpen={isOpen} setIsOpen={setIsOpen} />}
              />
              <Route
                path="/projects/existing-projects-old-page"
                element={<OldPageExistingProject />}
              />
              {/* Assigning a project to an employee */}
              <Route
                path="/projects/assign-project-old"
                element={<AssignProjectOld />}
              />
              <Route
                path="/projects/assign-project"
                element={
                  <AssignProject isOpen={isOpen} setIsOpen={setIsOpen} />
                }
              />
              <Route
                path="/time-entries/:userID/:userName/:projectID/:projectName"
                element={<TimeEntriesBrowser />}
              />
              <Route
                path="/projects/email-logs"
                element={<EmailLogs isOpen={isOpen} setIsOpen={setIsOpen} />}
              />
              {/* ------------------------ all reports route ---------------- */}
              <Route
                path="/reports"
                element={<Reports isOpen={isOpen} setIsOpen={setIsOpen} />}
              />
              <Route path="/reports-old-page" element={<ReportsOld />} />
              <Route
                path="/reports/user-project-report"
                element={<UserProjectReport />}
              />
              <Route
                path="/reports/check-user-report"
                element={<CheckUserReport />}
              />
              <Route
                path="/reports/check-project-report"
                element={<CheckProjectReport />}
              />
              {/* adding holiday */}
              <Route
                path="/add-holiday"
                element={<AddHoliday isOpen={isOpen} setIsOpen={setIsOpen} />}
              />
              {/* adding project category */}
              {/* <Route
                path="add-project-category"
                element={
                  <AddProjectCategories isOpen={isOpen} setIsOpen={setIsOpen} />
                }
              /> */}
              {/* adding employee job role */}
              {/* <Route
                path="add-employee-job-role"
                element={<AddEmployeeJobRole />}
              /> */}
            </Route>

            {/* ---- if userRole is admin then only visit on these routes else go to dashboard ------ */}
            <Route element={<PrivateRouteAdmin />}>
              {/* ---------------- all users route ---------------------- */}
              <Route
                path="/users/all"
                element={<AllUsers isOpen={isOpen} setIsOpen={setIsOpen} />}
              />
              <Route
                path="/users/all/add-new-user"
                element={<AddNewUser isOpen={isOpen} setIsOpen={setIsOpen} />}
              />
              <Route path="/users/all-old-page" element={<AllUsersOld />} />
            </Route>
          </Route>

          {/* ------------------------ setting route ------------------ */}
          <Route path="/settings" element={<Settings />} />
          {/* 404 error page route */}
          <Route path="*" element={<NoPage />} />
        </Routes>
      </UserContext.Provider>
      <ToastContainer />
    </div>
  );
};

export default App;
