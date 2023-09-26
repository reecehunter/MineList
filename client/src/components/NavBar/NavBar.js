import React, { useEffect, useState } from "react";
import { checkAuth } from "../../helpers/jwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../images/logo.png";
import Button from "../Button/Button";
import { Link, useNavigate } from "react-router-dom";
import ProfileNav from "../../components/ProfileNav/ProfileNav";
import SignIn from "../icons/SignIn";

const NavBar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hoveringProfile, setHoveringProfile] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    checkAuth((isAuthRes) => setIsAuthenticated(isAuthRes));
  }, []);

  return (
    <Navbar expand="lg" className="bg-body-primary py-4">
      <Container>
        <Navbar.Brand href="/" className="text-light">
          <img src={logo} width="30" height="30" className="d-inline-block align-center" alt="Logo" /> MineList
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="text-light" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/servers" className="link link-primaryy">
              Servers
            </Nav.Link>
            <Nav.Link href="/plugins" className="link link-primaryy">
              Plugins
            </Nav.Link>
            <Nav.Link href="/minelist+" className="link link-primaryy">
              MineList+
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <div>
            {isAuthenticated ? (
              <ProfileNav show={showPopup} isAuthenticated={isAuthenticated} />
            ) : (
              <Link to="/auth/sign-in">
                <Button className="button-secondary" icon={<SignIn color="var(--primaryColor)" width={20} height={20} />}>
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
