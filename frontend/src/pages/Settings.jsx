import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { NotificationContext } from '../contexts/NotificationContext';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';

const Settings = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const { addToast } = useContext(NotificationContext);

  const [hospitalName, setHospitalName] = useState('St. Jude General Hospital & Bio-Medical Research Institute');
  const [maintenanceWarningDays, setMaintenanceWarningDays] = useState(7);
  const [warrantyWarningDays, setWarrantyWarningDays] = useState(30);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('System preferences saved successfully!', 'success');
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'System Configuration & Settings' }]} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">System Preferences & Settings</h2>
          <p className="text-muted small mb-0">Global facility settings, glass theme customization, and alert engine thresholds.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <GlassCard title="Appearance & Glass Theme" icon="bi-palette">
            <div className="d-flex align-items-center justify-content-between p-3 glass-panel mb-3">
              <div>
                <h6 className="fw-bold mb-1">Dark Glass UI Mode</h6>
                <p className="small text-muted mb-0">Switch between Light Glass and Dark Glass theme palette.</p>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input fs-4"
                  type="checkbox"
                  role="switch"
                  checked={isDark}
                  onChange={toggleTheme}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Facility Identity Settings" icon="bi-building" className="mt-4">
            <form onSubmit={handleSaveSettings}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Hospital Facility Name</label>
                <input
                  type="text"
                  className="form-control glass-input"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-glass-primary">
                Save Facility Settings
              </button>
            </form>
          </GlassCard>
        </div>

        <div className="col-lg-6">
          <GlassCard title="Automated Alert Engine Thresholds" icon="bi-sliders">
            <form onSubmit={handleSaveSettings}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Maintenance Due Warning Threshold (Days)</label>
                <input
                  type="number"
                  className="form-control glass-input"
                  value={maintenanceWarningDays}
                  onChange={(e) => setMaintenanceWarningDays(e.target.value)}
                  min="1"
                  max="30"
                />
                <small className="text-muted">Equipment will be flagged as 'Due Soon' within this day window.</small>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Warranty Expiration Warning Threshold (Days)</label>
                <input
                  type="number"
                  className="form-control glass-input"
                  value={warrantyWarningDays}
                  onChange={(e) => setWarrantyWarningDays(e.target.value)}
                  min="1"
                  max="90"
                />
                <small className="text-muted">Equipment will be flagged as 'Warranty Expiring' within this day window.</small>
              </div>

              <div className="d-flex align-items-center justify-content-between p-3 glass-panel mb-3">
                <div>
                  <h6 className="fw-bold mb-1">Automated Email Notifications</h6>
                  <p className="small text-muted mb-0">Dispatch critical alert emails to Bio-Med Technicians.</p>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input fs-4"
                    type="checkbox"
                    role="switch"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-glass-primary">
                Update Threshold Rules
              </button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;
