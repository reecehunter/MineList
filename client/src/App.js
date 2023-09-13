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

function App() {
  useEffect(() => {
    document.body.classList.add("mainBg");
  });

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/explore" element={<HomePage />} />
      <Route path="/plugin/:id" element={<SinglePluginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} /> {/* TODO: Make intermediary which sends you to your own profile */}
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
