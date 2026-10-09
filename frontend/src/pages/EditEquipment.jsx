import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationContext } from '../contexts/NotificationContext';
import { getEquipmentById, updateEquipment } from '../services/equipmentService';
import { getUsersList } from '../services/userService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useContext(NotificationContext);

  const [formData, setFormData] = useState(null);
  const [equipmentImage, setEquipmentImage] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eqRes, techRes] = await Promise.all([getEquipmentById(id), getUsersList('role=Technician')]);
        if (eqRes.success && eqRes.equipment) {
          const eq = eqRes.equipment;
          setFormData({
            assetId: eq.assetId,
            equipmentName: eq.equipmentName,
            category: eq.category,
            department: eq.department,
            manufacturer: eq.manufacturer,
            model: eq.model,
            serialNumber: eq.serialNumber,
            purchaseDate: eq.purchaseDate ? eq.purchaseDate.split('T')[0] : '',
            warrantyExpiry: eq.warrantyExpiry ? eq.warrantyExpiry.split('T')[0] : '',
            vendorName: eq.vendorName || '',
            purchaseCost: eq.purchaseCost || 0,
            serviceInterval: eq.serviceInterval || 90,
            nextMaintenance: eq.nextMaintenance ? eq.nextMaintenance.split('T')[0] : '',
            location: eq.location || '',
            assignedTechnician: eq.assignedTechnician ? eq.assignedTechnician._id || eq.assignedTechnician : '',
            remarks: eq.remarks || '',
            equipmentStatus: eq.equipmentStatus || 'Healthy',
          });
        }
        if (techRes.success) {
          setTechnicians(techRes.users || []);
        }
      } catch (err) {
        addToast('Error loading equipment data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEquipmentImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        dataToSend.append(key, formData[key]);
      });
      if (equipmentImage) {
        dataToSend.append('equipmentImage', equipmentImage);
      }

      const res = await updateEquipment(id, dataToSend);
      if (res.success) {
        addToast(`Equipment '${formData.equipmentName}' updated successfully!`, 'success');
        navigate(`/equipment/${id}`);
      } else {
        addToast(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      addToast('An error occurred while updating equipment', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading equipment data for editing..." />;
  if (!formData) return <div className="text-center p-5">Equipment record not found.</div>;

  return (
    <div className="animate-fade-in">
      <Breadcrumb
        items={[
          { label: 'Equipment Registry', link: '/equipment' },
          { label: formData.equipmentName, link: `/equipment/${id}` },
          { label: 'Edit Specifications' },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Edit Equipment Specifications</h2>
          <p className="text-muted small mb-0">Update technical details, department assignment, or service dates.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <GlassCard className="p-4 mb-4">
          <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">Equipment Details</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Asset ID</label>
              <input type="text" className="form-control glass-input" name="assetId" value={formData.assetId} disabled />
            </div>

            <div className="col-md-8">
              <label className="form-label small fw-semibold text-muted">Equipment Name</label>
              <input type="text" className="form-control glass-input" name="equipmentName" value={formData.equipmentName} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Category</label>
              <select className="form-select glass-input" name="category" value={formData.category} onChange={handleChange}>
                <option value="Radiology & Imaging">Radiology & Imaging</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Life Support">Life Support</option>
                <option value="Patient Monitoring">Patient Monitoring</option>
                <option value="Surgical Workstations">Surgical Workstations</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Department</label>
              <select className="form-select glass-input" name="department" value={formData.department} onChange={handleChange}>
                <option value="Radiology & Imaging">Radiology & Imaging</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                <option value="General & Robotic Surgery">General & Robotic Surgery</option>
                <option value="Emergency & Trauma">Emergency & Trauma</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Location</label>
              <input type="text" className="form-control glass-input" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Status</label>
              <select className="form-select glass-input" name="equipmentStatus" value={formData.equipmentStatus} onChange={handleChange}>
                <option value="Healthy">Healthy</option>
                <option value="Due Soon">Due Soon</option>
                <option value="Warranty Expiring">Warranty Expiring</option>
                <option value="Maintenance Overdue">Maintenance Overdue</option>
                <option value="Critical">Critical</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Assigned Technician</label>
              <select className="form-select glass-input" name="assignedTechnician" value={formData.assignedTechnician} onChange={handleChange}>
                <option value="">-- Unassigned --</option>
                {technicians.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Next Maintenance Date</label>
              <input type="date" className="form-control glass-input" name="nextMaintenance" value={formData.nextMaintenance} onChange={handleChange} required />
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold text-muted">Remarks & Engineering Notes</label>
              <textarea className="form-control glass-input" name="remarks" rows="3" value={formData.remarks} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" className="btn btn-glass-secondary" onClick={() => navigate(`/equipment/${id}`)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glass-primary" disabled={saving}>
              {saving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </GlassCard>
      </form>
    </div>
  );
};

export default EditEquipment;
