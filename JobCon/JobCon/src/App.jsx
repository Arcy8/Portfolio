import { useState } from "react";
import { Routes, Route } from "react-router-dom";


import Header from "./components/Header";
import MainContent from "./pages/MainContent";
import Aboutus from "./pages/Aboutus";
import Home from "./pages/Home";
import MySelection from "./pages/MySelection";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminHome from "./pages/AdminHome";
import Dashboard from "./components/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./components/Admin";
import JobChart from "./admincomponents/JobChart";
import Applicant from "./admincomponents/Applicant";
import AdminScheduleManager from "./admincomponents/AdminScheduleManager";
import ViewSummary from "./admincomponents/ViewSummary"; // Import new Summary Page
import ApplicantResponses from "./pages/ApplicantResponses";
import ChatbotResponses from "./components/ChatbotResponses";
import Responses from "./components/Responses";


function App() {
  const [favoritesJob, setFavoritesJob] = useState([]);


  return (
    <>
      {/* Optional: Uncomment if you want a global header */}
      {/* <Header /> */}


      <Routes>
        {/* Main User Routes */}
        <Route
          path="/"
          element={<MainContent setFavoritesJob={setFavoritesJob} />}
        />
        <Route path="aboutus" element={<Aboutus />} />
        <Route path="home" element={<Home />} />
        <Route
          path="myselection"
          element={
            <MySelection
              favoritesJob={favoritesJob}
              setFavoritesJob={setFavoritesJob}
            />
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />


        {/* Admin Routes */}
        <Route path="admin" element={<AdminHome />} />
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/AddJobs" element={<Admin />} />
        <Route path="/JobChart" element={<JobChart />} />
        <Route path="/Applicant" element={<Applicant />} />
        <Route path="/Schedule" element={<AdminScheduleManager />} />
        <Route path="/admin/responses/:jobPosition" element={<ApplicantResponses />} />
        <Route path="/admin/chatbot-responses/:jobPosition" element={<ChatbotResponses />} />
        <Route path="/responses/:userEmail/:jobPosition" element={<Responses />} />



        {/* New Route for Summary Page */}
        <Route path="/summary/:id" element={<ViewSummary />} />
      </Routes>
    </>
  );
}


export default App;