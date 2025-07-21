import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  function signOut() {
    localStorage.removeItem("uid");
    window.location.href = "/signin";
  }

  return (
    <nav className="sidebar sidebar-dark accordion"
      id="accordionSidebar"
      style={{
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        backgroundImage: "linear-gradient(180deg,#4e73df 10%,#224abe 100%)",
        color: "white",
      }}>
      <ul
        className="navbar-nav d-flex flex-column justify-content-between h-100"
        id="accordionSidebar"
      >
        {/* TOP PART */}
        <div>
          {/* BRANDING */}
          <a
            className="sidebar-brand d-flex align-items-center justify-content-center"
            href="/"
          >
            <div className="sidebar-brand-icon rotate-n-15">
              <i className="fas fa-hands-asl-interpreting"></i>
            </div>
            <div className="sidebar-brand-text mx-3">
              SignEase <sup>©</sup>
            </div>
          </a>

          {/* NAVIGATION LINKS */}
          <hr className="sidebar-divider my-0" />

          <li className="nav-item active">
            <Link to="/" className="nav-link">
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span> Dashboard</span>
            </Link>
          </li>
          <hr className="sidebar-divider my-0" />
          <li className="nav-item active">
            <Link to="/subscriptionPlan" className="nav-link">
              <i className="fas fa-fw fa-crown"></i>
              <span> Subscription Plan</span>
            </Link>
          </li>
          <hr className="sidebar-divider my-0" />
          <li className="nav-item active">
            <Link to="/" className="nav-link">
              <i className="fas fa-fw fa-book-open"></i>
              <span> Course</span>
            </Link>
          </li>
          <hr className="sidebar-divider my-0" />
          <li className="nav-item active">
            <Link to="/" className="nav-link">
              <i className="fas fa-fw fa-file-alt"></i>
              <span> Report</span>
            </Link>
          </li>
        </div>

        <div>
          {/* <hr className="sidebar-divider my-0" />
          <li className="nav-item active">
            <Link to="/" className="nav-link">
              <i className="fas fa-fw fa-user-circle"></i>
              <span> Profile</span>
            </Link>
          </li> */}
          {/* <hr className="sidebar-divider my-0" />
          <li className="nav-item active">
            <Link to="/" className="nav-link">
              <i className="fas fa-fw fa-plus"></i>
              <span> Create Admin</span>
            </Link>
          </li> */}
          <hr className="sidebar-divider my-0" />
          <li className="nav-item active">
            <a onClick={signOut} className="nav-link" role="button">
              <i className="fas fa-fw fa-power-off"></i>
              <span> Sign Out</span>
            </a>
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Sidebar;
