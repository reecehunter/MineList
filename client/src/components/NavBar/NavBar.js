import React, { useEffect, useState } from "react";
import { checkAuth } from "../../helpers/jwt";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../images/logo.png";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import User from "../icons/User";

const NavBar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthCheck = (link) => {
    if (!isAuthenticated) navigate("/login");
    else navigate(link);
  };

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
            <Nav.Link href="/explore" className="link link-primaryy">
              Explore
            </Nav.Link>
            <Nav.Link className="link link-primaryy" onClick={() => handleAuthCheck("/create")}>
              Create
            </Nav.Link>
            <Nav.Link href="/minelist+" className="link link-primaryy">
              MineList+
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link id="profileLink" onClick={() => handleAuthCheck("/profile")}>
            {isAuthenticated ? (
              <Button className="button-secondary" icon={<User />}>
                Profile
              </Button>
            ) : (
              <Button className="button-secondary">Log In</Button>
            )}
          </Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
