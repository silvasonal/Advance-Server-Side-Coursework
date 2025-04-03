import React from "react";
import { Outlet } from "react-router-dom";
import { PersonCircle } from "react-bootstrap-icons";
import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ handleLogout, username, role }) => {

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            {role === 'admin' && (
                <Nav.Link href="/home/user-management">User Management</Nav.Link>
            )}
          </Nav>
        </Container>
            <div className="header-container">
            <PersonCircle size={24} style={{ marginRight: "10px" }} />
            <p className="mb-0 mr-3">{username}</p>
            <button id="logout_btn" className="logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
      </Navbar>

     

      <Outlet />
    </div>
  );
};

export default Layout;
