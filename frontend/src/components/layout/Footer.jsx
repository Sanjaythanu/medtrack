import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 border-top text-center text-muted small">
      <div className="container-fluid px-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div>
          © {new Date().getFullYear()} <strong>MedTrack SaaS</strong>. Smart Hospital Medical Equipment Lifecycle System.
        </div>
        <div className="d-flex gap-3 mt-2 mt-md-0">
          <span className="badge bg-success bg-opacity-15 text-success">
            <i className="bi bi-shield-check me-1"></i> Enterprise Grade Security
          </span>
          <span className="text-muted">v1.0.0 Production</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
