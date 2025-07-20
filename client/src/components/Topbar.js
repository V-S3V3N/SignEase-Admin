import React from "react";
import { Link } from "react-router-dom";

const Topbar = () => {
  function signOut() {
    localStorage.removeItem("uid");
    window.location.href = "/signin";
  }

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <ul className="navbar-nav ml-auto">
        {/* <!-- Nav Item - User Information --> */}
        <li className="nav-item dropdown no-arrow">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="userDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              className="img-profile rounded-circle"
              src="img/undraw_profile.svg"
            />
            <div className="d-none d-lg-flex flex-column ml-2 text-gray-600 small">
              <span>Admin&nbsp;&nbsp;&nbsp;</span>
            </div>
          </a>
          {/* <!-- Dropdown - User Information --> */}
          <div
            className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="userDropdown"
          >
            {/* <a className="dropdown-item" href="#">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
              Profile
            </a>
            <a className="dropdown-item" href="#">
              <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Settings
            </a>
            <a className="dropdown-item" href="#">
              <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
              Activity Log
            </a>
            <div className="dropdown-divider"></div> */}
            <a onClick={signOut} className="dropdown-item" role="button">
              <i className="fas fa-power-off fa-sm fa-fw mr-2 text-gray-400"></i>
              <span> Sign Out</span>
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Topbar;
