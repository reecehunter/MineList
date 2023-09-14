import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";
import SinglePluginPage from "./pages/SinglePluginPage/SinglePluginPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import CreatePage from "./pages/CreatePage/CreatePage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";

function App() {
  useEffect(() => {
    document.body.classList.add("mainBg");
  });

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/explore" element={<HomePage />} />
      <Route path="/plugin/:id" element={<SinglePluginPage />} />
      <Route path="/auth/sign-up" element={<RegistrationPage />} />
      <Route path="/auth/sign-in" element={<LoginPage />} />
      <Route path="/dashboard/" element={<DashboardPage />} />
      <Route path="/user/:username" element={<ProfilePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
