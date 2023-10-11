import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <div className="container">
      <NavBar />
      <App />
      <Footer />
    </div>
  </BrowserRouter>
);