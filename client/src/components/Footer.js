import React from "react";

const Footer = () => {
  return (
    <footer className="sticky-footer bg-white">
      <div className="container my-auto">
        <div className="copyright text-center my-auto">
          <span>Copyright &copy; SignEase {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
