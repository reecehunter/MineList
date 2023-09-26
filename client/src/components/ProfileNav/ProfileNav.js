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
import CreateForm from "../CreateForm/CreateForm";

const ProfileNav = (props) => {
  const { isAuthenticated } = props;
  const container = useRef(null);
  const [show, setShow] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userData, setUserData] = useState({ username: "", pfpImgSrc: "" });

  const handleAuthCheck = (link) => {
    if (!isAuthenticated) {
      window.location.href = "/auth/sign-in";
    } else {
      console.log("link: " + link);
      window.location.href = link;
    }
  };

  const openCreateModal = () => {
    setShowCreateForm(true);
    setShow(false);
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
    <div id="profileNav" className={styles.container} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <CreateForm show={showCreateForm} setShow={setShowCreateForm} />
      <img src={userData.pfpImgSrc ? userData.pfpImgSrc : config.default_user_image} alt="Profile" className={styles.pfp} />
      <div ref={container} className={styles.popup}>
        <Link to={`/user/${userData.username}`} className={styles.viewProfile}>
          <img src={userData.pfpImgSrc ? userData.pfpImgSrc : config.default_user_image} alt="Profile" className={styles.pfp} />
          <div>
            <p className="text-primaryy">View Your Profile</p>
            <p>@{userData.username}</p>
          </div>
        </Link>
        <hr className={styles.line} />
        <Link onClick={openCreateModal}>
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
