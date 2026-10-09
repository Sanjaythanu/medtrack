import React, { useState, useEffect, useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';
import { getAlertsList, markAlertAsRead, markAllAlertsRead } from '../services/alertService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { formatDateTime } from '../utils/formatters';

const Alerts = () => {
  const { addToast } = useContext(NotificationContext);

  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const query = severityFilter ? `severity=${severityFilter}` : '';
      const res = await getAlertsList(query);
      if (res.success) {
        setAlerts(res.alerts || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      addToast('Error fetching alerts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [severityFilter]);

  const handleMarkRead = async (id) => {
    try {
      const res = await markAlertAsRead(id);
      if (res.success) {
        setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, readStatus: true } : a)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      addToast('Failed to mark alert as read', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllAlertsRead();
      if (res.success) {
        addToast('All alerts marked as read', 'success');
        fetchAlerts();
      }
    } catch (err) {
      addToast('Failed to mark all as read', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'System Alerts & Warnings' }]} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Alerts & Notification Feed</h2>
          <p className="text-muted small mb-0">Automated triggers for maintenance due, warranty expiration, and critical equipment status.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-glass-secondary" onClick={handleMarkAllRead}>
            <i className="bi bi-check-all me-1"></i> Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="glass-panel p-3 mb-4">
        <div className="row align-items-center">
          <div className="col-md-4">
            <select className="form-select glass-input" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
              <option value="">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Refreshing system alert triggers..." />
      ) : alerts.length === 0 ? (
        <EmptyState title="No Active Alerts" message="Your medical devices are healthy and operating normally with no active warnings." icon="bi-shield-check" />
      ) : (
        <div className="d-flex flex-column gap-3">
          {alerts.map((al) => (
            <GlassCard
              key={al._id}
              className={`p-3 border-start border-4 ${
                al.severity === 'Critical'
                  ? 'border-danger bg-danger bg-opacity-10'
                  : al.severity === 'High'
                  ? 'border-warning bg-warning bg-opacity-10'
                  : 'border-info'
              }`}
            >
              <div className="d-flex align-items-start justify-content-between gap-3">
                <div className="d-flex align-items-start gap-3">
                  <div className={`avatar rounded-circle p-2 text-white ${al.severity === 'Critical' ? 'bg-danger' : 'bg-warning'}`}>
                    <i className={`bi ${al.severity === 'Critical' ? 'bi-lightning-charge-fill' : 'bi-exclamation-triangle-fill'}`}></i>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h6 className="fw-bold mb-0">{al.alertType}</h6>
                      <span className={`badge ${al.severity === 'Critical' ? 'bg-danger' : 'bg-warning text-dark'} extra-small`}>
                        {al.severity}
                      </span>
                      {!al.readStatus && <span className="badge bg-primary extra-small">NEW</span>}
                    </div>
                    <p className="mb-1 text-dark small">{al.alertMessage}</p>
                    <small className="text-muted">{formatDateTime(al.generatedDate)}</small>
                  </div>
                </div>

                {!al.readStatus && (
                  <button className="btn btn-sm btn-glass-secondary" onClick={() => handleMarkRead(al._id)}>
                    Mark Read
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
