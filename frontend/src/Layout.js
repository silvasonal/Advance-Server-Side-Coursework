import React from "react";
import { Outlet } from "react-router-dom";
import { PersonCircle, ArrowBarRight } from "react-bootstrap-icons";
import { Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Layout = ({ handleLogout, username, role }) => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white d-flex flex-column p-3" style={{ minHeight: "100vh", width: "200px" }}>
        <h5 className="mb-4">Dashboard</h5>

        <Nav defaultActiveKey="/home" className="flex-column">
          <Nav.Link href="/home" className="text-white">Home</Nav.Link>
          {role === "admin" && (
            <>
              <Nav.Link href="/home/user-management" className="text-white">User Management</Nav.Link>
              <Nav.Link href="/home/api-keys" className="text-white">API Keys</Nav.Link>
            </>
          )}
        </Nav>
        
        <div className="mt-auto pt-3 border-top border-secondary">
          <div className="d-flex align-items-center mb-2">
            <PersonCircle size={24} style={{ marginRight: "10px" }} />
            <span>{username}</span>
            <br />
          </div>
          <button id="logout_btn" className="btn btn-sm btn-outline-light mt-3" onClick={handleLogout}>
            <ArrowBarRight size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
