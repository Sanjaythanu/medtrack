import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Sidebar = ({ showMobile, onCloseMobile }) => {
  const { user, logout, isAdmin } = useContext(AuthContext);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'bi-grid-1x2-fill' },
    { label: 'Equipment', path: '/equipment', icon: 'bi-hospital-fill' },
    { label: 'Maintenance', path: '/maintenance', icon: 'bi-tools' },
    { label: 'Alerts', path: '/alerts', icon: 'bi-bell-fill' },
    { label: 'Reports', path: '/reports', icon: 'bi-file-earmark-bar-graph-fill' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Users', path: '/users', icon: 'bi-people-fill' });
  }

  navItems.push(
    { label: 'Profile', path: '/profile', icon: 'bi-person-circle' },
    { label: 'Settings', path: '/settings', icon: 'bi-gear-fill' }
  );

  return (
    <aside className={`glass-sidebar ${showMobile ? 'show' : ''}`}>
      <div className="d-flex flex-column h-100 p-3">
        {/* Brand Header */}
        <div className="d-flex align-items-center justify-content-between mb-4 px-2 pt-2 border-bottom border-white-10 pb-3">
          <Link to="/dashboard" className="d-flex align-items-center gap-2.5 text-decoration-none">
            <div
              className="d-flex align-items-center justify-content-center text-white shadow-sm"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--accent-gradient)',
              }}
            >
              <i className="bi bi-heart-pulse-fill fs-4"></i>
            </div>
            <div>
              <span className="fs-5 fw-extrabold text-primary tracking-tight d-block" style={{ lineHeight: 1.1 }}>
                MedTrack
              </span>
              <span
                className="badge extra-small px-2 py-0.5 rounded-pill"
                style={{
                  background: 'rgba(79, 124, 255, 0.15)',
                  color: 'var(--accent-color)',
                  border: '1px solid rgba(79, 124, 255, 0.25)',
                }}
              >
                Enterprise SaaS
              </span>
            </div>
          </Link>
          <button className="btn btn-sm btn-link d-lg-none text-muted p-0" onClick={onCloseMobile}>
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="nav flex-column gap-1.5 flex-grow-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium position-relative transition-all ${
                  isActive
                    ? 'text-white shadow-sm sidebar-nav-active'
                    : 'text-muted hover-accent-bg'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                boxShadow: isActive ? '0 4px 15px rgba(79, 124, 255, 0.35)' : 'none',
              })}
            >
              <i className={`bi ${item.icon} fs-5`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="glass-panel p-3 mt-auto border border-white-10">
          <div className="d-flex align-items-center gap-2.5 mb-2.5">
            <div
              className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: '38px',
                height: '38px',
                background: 'var(--accent-gradient)',
              }}
            >
              <i className="bi bi-person-fill fs-5"></i>
            </div>
            <div className="overflow-hidden">
              <h6 className="mb-0 text-truncate fw-semibold small text-primary">{user?.fullName || 'User'}</h6>
              <span
                className="badge extra-small px-2 py-0.5 rounded-pill"
                style={{
                  backgroundColor: 'rgba(79, 124, 255, 0.14)',
                  color: 'var(--accent-color)',
                }}
              >
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="btn btn-sm btn-glass-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2 text-danger"
            style={{ backgroundColor: 'var(--status-overdue-bg)', color: 'var(--status-overdue)', borderColor: 'rgba(255, 77, 79, 0.3)' }}
          >
            <i className="bi bi-box-arrow-right"></i> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
