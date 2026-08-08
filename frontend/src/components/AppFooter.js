// ============================================================
// AppFooter Component — Version & Quick Links
// ============================================================
import React from "react";

const AppFooter = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-brand">📚 Library Pro</span>
          <span className="footer-separator">|</span>
          <span className="footer-version">v2.0.0</span>
        </div>
        <div className="footer-center">
          <span>Professional Library Management System</span>
        </div>
        <div className="footer-right">
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;

