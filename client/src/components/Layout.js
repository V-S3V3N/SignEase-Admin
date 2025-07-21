import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <div className="d-flex" id="wrapper" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Content Wrapper */}
        <div
          id="content-wrapper"
          className="d-flex flex-column w-100"
          style={{ overflowY: "auto" }}
        >
          {/* Main Content */}
          <div id="content" className="flex-grow-1">
            <Topbar />
            <Outlet />
          </div>
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
