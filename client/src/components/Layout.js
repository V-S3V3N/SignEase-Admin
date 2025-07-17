import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <div id="wrapper">
      {/* Sidebar */}
      <Sidebar />

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          <Topbar />
          <Outlet />
        </div>
      </div>
    </div>
    </>
  );
};

export default Layout;
