import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../contexts/NotificationContext';
import { createUser } from '../services/userService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';

const AddUser = () => {
  const navigate = useNavigate();
  const { addToast } = useContext(NotificationContext);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
    department: 'Radiology & Imaging',
    designation: 'Medical Officer',
    role: 'Staff',
    password: 'Password@123',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createUser(formData);
      if (res.success) {
        addToast(`User account '${formData.fullName}' created successfully!`, 'success');
        navigate('/users');
      } else {
        addToast(res.message || 'User creation failed', 'error');
      }
    } catch (err) {
      addToast('An error occurred during account creation', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb
        items={[
          { label: 'User Directory', link: '/users' },
          { label: 'Create New User Account' },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Create User & Assign System Role</h2>
          <p className="text-muted small mb-0">Register staff members or bio-med technicians into the MedTrack RBAC network.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <GlassCard className="p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Full Name</label>
              <input type="text" className="form-control glass-input" name="fullName" placeholder="Dr. Jane Smith" value={formData.fullName} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Email Address (Unique Login)</label>
              <input type="email" className="form-control glass-input" name="email" placeholder="jane.smith@medtrack.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Employee ID (Unique)</label>
              <input type="text" className="form-control glass-input" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Phone Number</label>
              <input type="text" className="form-control glass-input" name="phone" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">System Role (RBAC)</label>
              <select className="form-select glass-input" name="role" value={formData.role} onChange={handleChange}>
                <option value="Admin">Admin (Full Control)</option>
                <option value="Technician">Technician (Maintenance Control)</option>
                <option value="Staff">Staff (Read-Only Access)</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Department</label>
              <select className="form-select glass-input" name="department" value={formData.department} onChange={handleChange}>
                <option value="Radiology & Imaging">Radiology & Imaging</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                <option value="General & Robotic Surgery">General & Robotic Surgery</option>
                <option value="Emergency & Trauma">Emergency & Trauma</option>
                <option value="Hospital Administration">Hospital Administration</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Initial Password</label>
              <input type="text" className="form-control glass-input" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" className="btn btn-glass-secondary" onClick={() => navigate('/users')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glass-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Provision User Account'}
            </button>
          </div>
        </GlassCard>
      </form>
    </div>
  );
};

export default AddUser;
