import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column position-relative overflow-hidden">
      {/* Header Bar */}
      <header className="glass-navbar border-bottom-0 bg-transparent px-4 py-3" style={{ marginLeft: 0 }}>
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2.5">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)',
                boxShadow: '0 4px 14px rgba(79, 124, 255, 0.35)',
              }}
            >
              <i className="bi bi-heart-pulse-fill fs-4 text-white"></i>
            </div>
            <span className="fs-4 fw-extrabold text-primary tracking-tight">MedTrack</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link to="/login" className="btn btn-glass-primary position-relative" style={{ zIndex: 10 }}>
              <i className="bi bi-box-arrow-in-right me-1"></i> Launch SaaS Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container my-auto py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 text-start fade-in-up">
            <span
              className="badge px-3 py-2 rounded-pill fw-semibold mb-3.5 d-inline-flex align-items-center gap-2"
              style={{
                backgroundColor: 'rgba(79, 124, 255, 0.14)',
                color: 'var(--accent-color)',
                border: '1px solid rgba(79, 124, 255, 0.25)',
              }}
            >
              <i className="bi bi-shield-check"></i> Next-Gen Bio-Medical SaaS Platform
            </span>
            <h1 className="display-4 fw-extrabold text-primary mb-4 leading-tight">
              Smart Hospital Medical Equipment Lifecycle & Maintenance
            </h1>
            <p className="lead text-muted mb-4 fs-6" style={{ lineHeight: 1.7 }}>
              Monitor, schedule, and track medical devices from procurement to retirement. Real-time dynamic health status, automated alert engine, preventive maintenance scheduling, and role-based operational compliance.
            </p>
            <div className="d-flex gap-3">
              <Link to="/login" className="btn btn-glass-primary btn-lg px-4 py-3 fs-6 position-relative" style={{ zIndex: 10 }}>
                Sign In to Command Center <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>

          <div className="col-lg-6 text-center fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="glass-card p-4.5 shadow-lg">
              <div className="p-4 rounded-4 text-center" style={{ background: 'rgba(79, 124, 255, 0.08)' }}>
                <i className="bi bi-hospital fs-1 text-primary mb-3 d-block"></i>
                <h4 className="fw-bold text-primary mb-2">Hospital Operations Hub</h4>
                <p className="small text-muted mb-4">
                  Enterprise dashboard with automated status engine, warranty warning triggers, and Chart.js analytics.
                </p>
                <div className="row g-3 text-start">
                  <div className="col-6">
                    <div className="p-3 glass-panel">
                      <i className="bi bi-shield-check text-success fs-4 d-block mb-1"></i>
                      <strong className="d-block text-dark small">Automated Alerts</strong>
                      <span className="extra-small text-muted">Maintenance & Warranty triggers</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 glass-panel">
                      <i className="bi bi-person-lock text-primary fs-4 d-block mb-1"></i>
                      <strong className="d-block text-dark small">RBAC Security</strong>
                      <span className="extra-small text-muted">Admin, Tech & Staff controls</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
