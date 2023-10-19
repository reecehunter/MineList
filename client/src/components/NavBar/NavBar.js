import React, { useEffect, useState } from "react";
import styles from "./NavBar.module.css";
import { checkAuth } from "../../helpers/jwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "../Button/Button";
import { Link, useNavigate } from "react-router-dom";
import ProfileNav from "../../components/ProfileNav/ProfileNav";
import User from "../icons/User";
import Toast from "../Toast/Toast";

const NavBar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hoveringProfile, setHoveringProfile] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  function removeToast(e, message) {
    setTimeout(() => setToasts([...toasts].filter((toast) => toast.message !== message)), 0);
  }

  useEffect(() => {
    checkAuth((isAuthRes) => setIsAuthenticated(isAuthRes));
  }, []);

  return (
    <>
      <Navbar expand="lg" className={`${styles.container} bg-body-primary`}>
        <Container>
          <Navbar.Brand href="/" className="text-light">
            <img src="https://freepngimg.com/thumb/minecraft/11-2-minecraft-diamond-png.png" width="35" height="30" className="d-inline-block align-center" alt="Logo" /> MineList
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="text-light" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link onClick={() => navigate("/servers")} className="link link-primaryy">
                Servers
              </Nav.Link> */}
              <Nav.Link onClick={() => navigate("/plugins")} className="link link-primaryy">
                Plugins
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/minelist+")} className="link link-primaryy">
                MineList+
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <div className={styles.rightSide}>
              {/* <div className={styles.darkModeButton} onClick={() => setDarkMode((prev) => !prev)}>
                <Sun color="var(--primaryColor)" />
              </div> */}
              {isAuthenticated ? (
                <ProfileNav show={showPopup} isAuthenticated={isAuthenticated} />
              ) : (
                <Link to="/auth/sign-in">
                  <Button className="button-septenary" icon={<User color="var(--primaryColor)" width={20} height={20} />}>
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className={styles.toastContainer}>
        {toasts.map((toast, index) => (
          <Toast key={index} type={toast.type} title={toast.title} message={toast.message} onClick={(e) => removeToast(e, toast.message)} />
        ))}
      </div>
    </>
  );
};

export default NavBar;
