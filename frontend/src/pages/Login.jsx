import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import ForgotPasswordModal from './ForgotPasswordModal';

const Login = () => {
  const [email, setEmail] = useState('admin@medtrack.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasError(false);

    if (!email || !password) {
      setHasError(true);
      addToast('Please enter both hospital email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success) {
        addToast(`Welcome back, ${res.user.fullName}!`, 'success');
        navigate('/dashboard');
      } else {
        setHasError(true);
        addToast(res.message || 'Login failed. Invalid credentials.', 'error');
      }
    } catch (error) {
      setHasError(true);
      addToast(error.message || 'An error occurred during authentication', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 w-100 d-flex overflow-hidden bg-dark position-relative">
      <div className="row g-0 w-100 min-vh-100">
        
        {/* Left Panel: Deep Navy/Indigo Gradient + CSS Ambient Mesh */}
        <div
          className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-5 position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0B1120 0%, #162038 50%, #1E2A47 100%)',
            color: '#ffffff',
          }}
        >
          {/* Animated CSS Abstract Mesh Blobs */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
            style={{ opacity: 0.35, zIndex: 1 }}
          >
            <div
              className="blob"
              style={{
                width: '480px',
                height: '480px',
                background: '#4F7CFF',
                top: '-10%',
                left: '-10%',
                filter: 'blur(100px)',
              }}
            ></div>
            <div
              className="blob"
              style={{
                width: '420px',
                height: '420px',
                background: '#8B5CF6',
                bottom: '-5%',
                right: '-5%',
                filter: 'blur(100px)',
                animationDelay: '-8s',
              }}
            ></div>
          </div>

          {/* Left Brand Header */}
          <div className="d-flex align-items-center gap-3 position-relative" style={{ zIndex: 2 }}>
            <div
              className="d-flex align-items-center justify-content-center shadow-lg"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)',
              }}
            >
              <i className="bi bi-heart-pulse-fill fs-3 text-white"></i>
            </div>
            <div>
              <h4 className="fw-extrabold mb-0 tracking-tight text-white" style={{ fontSize: '1.5rem' }}>
                MedTrack
              </h4>
              <small className="text-white-50 extra-small">Enterprise Medical Asset Governance</small>
            </div>
          </div>

          {/* Left Center Tagline */}
          <div className="my-auto position-relative py-5" style={{ zIndex: 2, maxWidth: '500px' }}>
            <span
              className="badge px-3 py-2 rounded-pill fw-semibold mb-4 d-inline-flex align-items-center gap-2"
              style={{
                background: 'rgba(79, 124, 255, 0.18)',
                color: '#80A4FF',
                border: '1px solid rgba(79, 124, 255, 0.35)',
              }}
            >
              <i className="bi bi-shield-check fs-6"></i> Production Bio-Medical SaaS
            </span>
            <h1 className="display-5 fw-bold leading-tight mb-4 text-white">
              Hospital Medical Equipment Lifecycle & Maintenance System
            </h1>
            <p className="lead text-white-50 fs-6 mb-4" style={{ lineHeight: 1.7 }}>
              Real-time dynamic health status, automated alert triggers, preventive work-order scheduling, and continuous compliance auditing across hospital departments.
            </p>

            <div className="d-flex align-items-center gap-4 pt-3 border-top border-white-10">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-cpu-fill fs-5 text-accent-light" style={{ color: '#4F7CFF' }}></i>
                <span className="small text-white-50">Automated Status Engine</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-bell-fill fs-5" style={{ color: '#FF4D4F' }}></i>
                <span className="small text-white-50">Warranty Alert Engine</span>
              </div>
            </div>
          </div>

          {/* Left Footer */}
          <div className="position-relative text-white-50 small" style={{ zIndex: 2 }}>
            © {new Date().getFullYear()} MedTrack SaaS Portal. All rights reserved.
          </div>
        </div>

        {/* Right Panel: Ultra-Refined Glass Login Surface */}
        <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5 position-relative">
          <div
            className={`glass-card p-4 p-sm-5 w-100 shadow-lg fade-in-up ${hasError ? 'shake-error' : ''}`}
            style={{ maxWidth: '460px', borderRadius: '24px' }}
          >
            <div className="text-center mb-4">
              <div className="d-lg-none d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '54px', height: '54px', borderRadius: '16px', background: 'linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)' }}>
                <i className="bi bi-heart-pulse-fill fs-2 text-white"></i>
              </div>
              <h3 className="fw-extrabold text-primary mb-1">Sign In to MedTrack</h3>
              <p className="text-muted small">Enter your authorized hospital credentials</p>
            </div>

            {/* Quick Credentials Switcher */}
            <div
              className="p-3 mb-4 rounded-3 text-start"
              style={{
                backgroundColor: 'rgba(79, 124, 255, 0.08)',
                border: '1px solid rgba(79, 124, 255, 0.2)',
              }}
            >
              <div className="fw-semibold small text-primary mb-2 d-flex align-items-center gap-1.5">
                <i className="bi bi-person-badge-fill"></i> Quick Demo Roles:
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-glass-secondary py-1 px-2.5 fs-7"
                  onClick={() => { setEmail('admin@medtrack.com'); setPassword('Admin@123'); setHasError(false); }}
                >
                  <i className="bi bi-shield-lock-fill me-1"></i> Admin
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-glass-secondary py-1 px-2.5 fs-7"
                  onClick={() => { setEmail('tech.john@medtrack.com'); setPassword('Tech@123'); setHasError(false); }}
                >
                  <i className="bi bi-tools me-1"></i> Tech
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-glass-secondary py-1 px-2.5 fs-7"
                  onClick={() => { setEmail('staff.emily@medtrack.com'); setPassword('Staff@123'); setHasError(false); }}
                >
                  <i className="bi bi-person-check-fill me-1"></i> Staff
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3.5">
                <label className="form-label small fw-semibold text-muted mb-1">
                  Hospital Email Address
                </label>
                <div className="position-relative">
                  <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <input
                    type="email"
                    className="form-control glass-input ps-5"
                    placeholder="name@hospital.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setHasError(false); }}
                    required
                  />
                </div>
              </div>

              <div className="mb-3.5">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold text-muted mb-0">
                    Password
                  </label>
                  <button
                    type="button"
                    className="btn btn-link p-0 extra-small text-muted text-decoration-none hover-primary"
                    onClick={() => setShowForgotModal(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="position-relative">
                  <i className="bi bi-lock position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control glass-input ps-5 pe-5"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setHasError(false); }}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                  </button>
                </div>
              </div>

              <div className="mb-4 form-check d-flex align-items-center justify-content-between">
                <div>
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="rememberCheck"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label className="form-check-label small text-muted cursor-pointer" htmlFor="rememberCheck">
                    Remember session
                  </label>
                </div>
              </div>

              {/* Gradient Submit Button with Morphed In-Place Spinner */}
              <button
                type="submit"
                className="btn btn-glass-primary w-100 py-3 fw-semibold fs-6"
                disabled={loading}
                style={{ minHeight: '48px' }}
              >
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Authenticating Session...</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <i className="bi bi-box-arrow-in-right fs-5"></i>
                    <span>Sign In to SaaS</span>
                  </div>
                )}
              </button>

              {/* Security Microcopy */}
              <div className="text-center mt-3 pt-2 text-muted extra-small d-flex align-items-center justify-content-center gap-1.5">
                <i className="bi bi-lock-fill text-success"></i>
                <span>Secured 256-bit Encrypted Session</span>
              </div>
            </form>
          </div>
        </div>

      </div>

      <ForgotPasswordModal show={showForgotModal} onClose={() => setShowForgotModal(false)} />
    </div>
  );
};

export default Login;
