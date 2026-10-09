import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { getAlertsList } from '../../services/alertService';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadAlerts = async () => {
      try {
        const res = await getAlertsList('readStatus=false');
        if (res.success) {
          setUnreadCount(res.unreadCount || 0);
          setAlerts(res.alerts ? res.alerts.slice(0, 5) : []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnreadAlerts();
    const interval = setInterval(fetchUnreadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/equipment?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="glass-navbar d-flex align-items-center justify-content-between px-4">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-link text-muted d-lg-none p-0" onClick={onToggleSidebar}>
          <i className="bi bi-list fs-2"></i>
        </button>

        <form onSubmit={handleGlobalSearch} className="d-none d-md-block" style={{ width: '340px' }}>
          <div className="position-relative">
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-6"></i>
            <input
              type="text"
              className="form-control glass-input ps-5 py-2 fs-7"
              placeholder="Global Search (Asset ID, Name, Serial)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ borderRadius: '14px' }}
            />
          </div>
        </form>
      </div>

      {/* Right Controls */}
      <div className="d-flex align-items-center gap-3">
        {/* Dark Mode Toggle */}
        <button
          className="btn btn-glass-secondary p-0 d-flex align-items-center justify-content-center"
          style={{ width: '42px', height: '42px', borderRadius: '12px' }}
          onClick={toggleTheme}
          title="Toggle Dark / Light Glass Mode"
        >
          <i className={`bi ${isDark ? 'bi-sun-fill text-warning fs-5' : 'bi-moon-stars-fill text-primary fs-5'}`}></i>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="position-relative">
          <button
            className="btn btn-glass-secondary p-0 d-flex align-items-center justify-content-center position-relative"
            style={{ width: '42px', height: '42px', borderRadius: '12px' }}
            onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
            title="System Alerts"
          >
            <i className="bi bi-bell-fill text-primary fs-5"></i>
            {unreadCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                style={{ fontSize: '0.65rem' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Quick Alerts Popup */}
          {showNotificationDrawer && (
            <div
              className="glass-panel position-absolute end-0 mt-2 p-3 shadow-lg fade-in-up"
              style={{ width: '350px', zIndex: 1050, borderRadius: '18px' }}
            >
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                <h6 className="fw-bold mb-0 text-primary">System Alerts ({unreadCount})</h6>
                <Link to="/alerts" className="small text-primary fw-semibold" onClick={() => setShowNotificationDrawer(false)}>
                  View All
                </Link>
              </div>

              {alerts.length === 0 ? (
                <p className="text-muted small my-3 text-center">No active unread alerts.</p>
              ) : (
                <div className="d-flex flex-column gap-2 max-h-60 overflow-auto">
                  {alerts.map((al) => (
                    <div key={al._id} className="p-2.5 glass-panel border-start border-3 border-danger small">
                      <div className="fw-semibold text-danger">{al.alertType}</div>
                      <div className="text-muted text-truncate">{al.alertMessage}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center gap-2.5 p-1"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div
              className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
              style={{
                width: '40px',
                height: '40px',
                background: 'var(--accent-gradient)',
              }}
            >
              <i className="bi bi-person-fill fs-5"></i>
            </div>
            <div className="d-none d-md-block text-start">
              <div className="fw-semibold fs-7 text-primary mb-0" style={{ lineHeight: 1.2 }}>
                {user?.fullName || 'User'}
              </div>
              <small className="text-muted extra-small">{user?.role}</small>
            </div>
          </button>
          <ul className="dropdown-menu dropdown-menu-end glass-panel border-0 shadow-lg mt-2 p-2" style={{ borderRadius: '16px', minWidth: '200px' }}>
            <li>
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2" to="/profile">
                <i className="bi bi-person text-primary"></i> Profile & Password
              </Link>
            </li>
            <li>
              <Link className="dropdown-item d-flex align-items-center gap-2 rounded-2 py-2" to="/settings">
                <i className="bi bi-gear text-primary"></i> System Settings
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider my-1" />
            </li>
            <li>
              <button className="dropdown-item text-danger d-flex align-items-center gap-2 rounded-2 py-2" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i> Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
