import React from "react";
import { Outlet } from "react-router-dom";
import { PersonCircle , ArrowBarRight } from "react-bootstrap-icons";
import { Container, Nav, Navbar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ handleLogout, username, role }) => {

  return (
    <div>
      <Navbar bg= "dark" data-bs-theme="dark" >
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            {role === 'admin' && (
                <>
                    <Nav.Link href="/home/user-management">User Management</Nav.Link>
                    <Nav.Link href="/home/api-keys">Api Keys</Nav.Link>
                </>
            )}
          </Nav>
        </Container>
            <div className="header-container">
            <PersonCircle size={24} style={{ marginRight: "10px" }} />
            <p className="mb-0 mr-3">{username}</p>
            <button id="logout_btn" className="logout-button" onClick={handleLogout}>
                Logout
            <ArrowBarRight size={20}  />
            </button>
        </div>
      </Navbar>
      <Outlet/>
    </div>
  );
};

export default Layout;
