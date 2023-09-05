import React from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../../images/logo.png';
import Button from '../Button/Button';

const NavBar = () => {
  return (
    <Navbar expand="lg" className="bg-body-primary py-4">
      <Container>
        <Navbar.Brand href="/" className="text-light">
            <img src={logo} width="30" height="30" className="d-inline-block align-center" alt="Logo" />
            {' '} MineList
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="text-light" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/explore" className="link link-primaryy">Explore</Nav.Link>
            <Nav.Link href="/create" className="link link-primaryy">Create</Nav.Link>
            <Nav.Link href="/minelist+" className="link link-primaryy">MineList+</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
        <Nav.Link href="/login"><Button className="button-secondary">Log In</Button></Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar