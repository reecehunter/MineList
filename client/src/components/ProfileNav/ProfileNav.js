import React, { useEffect, useRef, useState } from "react";
import styles from "./ProfileNav.module.css";
import { parseToken } from "../../helpers/jwt";
import config from "../../config/config";
import { Link } from "react-router-dom";
import SignIn from "../icons/SignIn";
import PlusSquare from "../icons/PlusSquare";
import Dashboard from "../icons/Dashboard";
import Bell from "../icons/Bell";
import Gear from "../icons/Gear";

const ProfileNav = (props) => {
  const { isAuthenticated } = props;
  const container = useRef(null);
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState({ username: "", pfpImgSrc: "" });

  const handleAuthCheck = (link) => {
    if (!isAuthenticated) {
      window.location.href = "/auth/sign-in";
    } else {
      console.log("link: " + link);
      window.location.href = link;
    }
  };

  useEffect(() => {
    if (document.cookie) {
      setUserData(parseToken(document.cookie));
    }
  }, []);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        container.current.style.display = "block";
        setTimeout(() => {
          container.current.style.opacity = "1";
          container.current.style.transform = "scaleY(1)";
        }, 10);
      }, 100);
    } else {
      setTimeout(() => {
        if (container.current.matches(":hover")) return;
        setTimeout(() => (container.current.style.display = "none"), 100);
        container.current.style.opacity = "0";
        container.current.style.transform = "scaleY(1.1)";
      }, 50);
    }
  }, [show]);

  return (
    <div className={styles.container} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <img src={userData.pfpImgSrc ? userData.pfpImgSrc : config.default_user_image} alt="Profile" />
      <div ref={container} className={styles.popup}>
        <Link to={`/user/${userData.username}`} className={styles.viewProfile}>
          <img src={userData.pfpImgSrc ? userData.pfpImgSrc : config.default_user_image} alt="Profile" />
          <div>
            <p className="text-primaryy">View Your Profile</p>
            <p>@{userData.username}</p>
          </div>
        </Link>
        <hr className={styles.line} />
        <Link to="/create">
          <PlusSquare /> Create Project
        </Link>
        <hr className={styles.line} />
        <Link to="/dashboard">
          <Dashboard /> Dashboard
        </Link>
        <Link to="/notifications">
          <Bell /> Notifications
        </Link>
        <Link to="/settings">
          <Gear /> Settings
        </Link>
        <hr className={styles.line} />
        <Link to="/auth/sign-out" className={styles.signOut}>
          <SignIn /> Sign Out
        </Link>
      </div>
    </div>
  );
};

export default ProfileNav;
