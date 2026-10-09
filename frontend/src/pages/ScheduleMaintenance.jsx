import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NotificationContext } from '../contexts/NotificationContext';
import { scheduleMaintenance } from '../services/maintenanceService';
import { getEquipmentList } from '../services/equipmentService';
import { getUsersList } from '../services/userService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';

const ScheduleMaintenance = () => {
  const [searchParams] = useSearchParams();
  const preselectedEquipmentId = searchParams.get('equipmentId') || '';

  const navigate = useNavigate();
  const { addToast } = useContext(NotificationContext);

  const [equipmentList, setEquipmentList] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    equipmentId: preselectedEquipmentId,
    technicianId: '',
    maintenanceType: 'Preventive',
    scheduledDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    estimatedCost: 500,
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eqRes, techRes] = await Promise.all([
          getEquipmentList('limit=100'),
          getUsersList('role=Technician'),
        ]);
        if (eqRes.success) setEquipmentList(eqRes.equipment || []);
        if (techRes.success) {
          setTechnicians(techRes.users || []);
          if (techRes.users.length > 0) {
            setFormData((prev) => ({ ...prev, technicianId: techRes.users[0]._id }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.equipmentId || !formData.technicianId || !formData.scheduledDate) {
      addToast('Please complete all required fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        dataToSend.append(key, formData[key]);
      });

      const res = await scheduleMaintenance(dataToSend);
      if (res.success) {
        addToast('Maintenance task scheduled successfully!', 'success');
        navigate('/maintenance');
      } else {
        addToast(res.message || 'Scheduling failed', 'error');
      }
    } catch (err) {
      addToast('Failed to schedule maintenance', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb
        items={[
          { label: 'Maintenance Operations', link: '/maintenance' },
          { label: 'Schedule Maintenance Task' },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Schedule Maintenance Work Order</h2>
          <p className="text-muted small mb-0">Create bio-medical service work order, assign lead technician, and set priority.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <GlassCard className="p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Target Medical Equipment</label>
              <select className="form-select glass-input" name="equipmentId" value={formData.equipmentId} onChange={handleChange} required>
                <option value="">-- Select Medical Device --</option>
                {equipmentList.map((eq) => (
                  <option key={eq._id} value={eq._id}>
                    {eq.equipmentName} ({eq.assetId}) - {eq.department}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Assigned Bio-Med Technician</label>
              <select className="form-select glass-input" name="technicianId" value={formData.technicianId} onChange={handleChange} required>
                <option value="">-- Select Technician --</option>
                {technicians.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.fullName} ({t.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Maintenance Category Type</label>
              <select className="form-select glass-input" name="maintenanceType" value={formData.maintenanceType} onChange={handleChange}>
                <option value="Preventive">Preventive</option>
                <option value="Corrective">Corrective</option>
                <option value="Emergency">Emergency</option>
                <option value="Routine">Routine</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Scheduled Execution Date</label>
              <input type="date" className="form-control glass-input" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Priority Level</label>
              <select className="form-select glass-input" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Estimated Cost ($)</label>
              <input type="number" className="form-control glass-input" name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} min="0" />
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold text-muted">Maintenance Instructions & Operational Notes</label>
              <textarea className="form-control glass-input" name="notes" rows="4" placeholder="Detail specific calibration guidelines or parts replacement required..." value={formData.notes} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" className="btn btn-glass-secondary" onClick={() => navigate('/maintenance')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glass-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Issue Work Order'}
            </button>
          </div>
        </GlassCard>
      </form>
    </div>
  );
};

export default ScheduleMaintenance;
