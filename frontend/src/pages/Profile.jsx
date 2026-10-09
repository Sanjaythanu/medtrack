import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { updateUser } from '../services/userService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';
import { formatDate } from '../utils/formatters';

const Profile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateUser(user._id, { fullName, phone, department });
      if (res.success) {
        updateUserProfile({ fullName, phone, department });
        addToast('Profile details updated successfully!', 'success');
      } else {
        addToast(res.message || 'Profile update failed', 'error');
      }
    } catch (err) {
      addToast('An error occurred during profile update', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setPassLoading(true);
    try {
      const res = await updateUser(user._id, { password: newPassword });
      if (res.success) {
        addToast('Password changed successfully!', 'success');
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
      } else {
        addToast(res.message || 'Password update failed', 'error');
      }
    } catch (err) {
      addToast('Error changing password', 'error');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'User Account Profile' }]} />

      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-lg-4">
          <GlassCard className="text-center p-4">
            <div className="avatar rounded-circle bg-primary text-white p-3 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-person-fill fs-1"></i>
            </div>
            <h4 className="fw-bold mb-1">{user?.fullName}</h4>
            <span className="badge bg-primary bg-opacity-15 text-primary mb-3 px-3 py-1.5">{user?.role}</span>

            <div className="text-start border-top pt-3 mt-3">
              <div className="mb-2">
                <small className="text-muted d-block">Email Address</small>
                <span className="fw-medium text-dark">{user?.email}</span>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block">Employee ID</small>
                <span className="fw-medium text-dark">{user?.employeeId}</span>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block">Department</small>
                <span className="fw-medium text-dark">{user?.department}</span>
              </div>
              <div className="mb-2">
                <small className="text-muted d-block">Last Authentication</small>
                <span className="fw-medium text-dark">{formatDate(user?.lastLogin)}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Update Forms */}
        <div className="col-lg-8">
          <GlassCard title="Update Profile Details" icon="bi-person-gear" className="mb-4">
            <form onSubmit={handleUpdateProfile}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Full Name</label>
                  <input type="text" className="form-control glass-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input type="text" className="form-control glass-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="col-md-12">
                  <label className="form-label small fw-semibold text-muted">Department</label>
                  <input type="text" className="form-control glass-input" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button type="submit" className="btn btn-glass-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </GlassCard>

          <GlassCard title="Security & Change Password" icon="bi-shield-lock">
            <form onSubmit={handleChangePassword}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">New Password</label>
                  <input type="password" className="form-control glass-input" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Confirm New Password</label>
                  <input type="password" className="form-control glass-input" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button type="submit" className="btn btn-outline-danger" disabled={passLoading}>
                  {passLoading ? 'Updating Password...' : 'Update Security Password'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Profile;
