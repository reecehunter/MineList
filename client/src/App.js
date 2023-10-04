import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";
import SinglePluginPage from "./pages/SinglePluginPage/SinglePluginPage";
import RegistrationPage from "./pages/Auth/RegistrationPage/RegistrationPage";
import LoginPage from "./pages/Auth/LoginPage/LoginPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import EditPage from "./pages/EditPage/EditPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";

function App() {
  useEffect(() => {
    document.body.classList.add("mainBg");
  });

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth/sign-up" element={<RegistrationPage />} />
      <Route path="/auth/sign-in" element={<LoginPage />} />
      <Route path="/plugins" element={<HomePage />} />
      <Route path="/plugin/:vanityURL" element={<SinglePluginPage />} />
      <Route path="/servers" element={<HomePage />} />
      <Route path="/dashboard/" element={<DashboardPage />} />
      <Route path="/user/:username" element={<ProfilePage />} />
      <Route path="/create" element={<EditPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
