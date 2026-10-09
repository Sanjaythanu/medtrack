import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../contexts/NotificationContext';
import { createEquipment } from '../services/equipmentService';
import { getUsersList } from '../services/userService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';

const AddEquipment = () => {
  const navigate = useNavigate();
  const { addToast } = useContext(NotificationContext);

  const [formData, setFormData] = useState({
    assetId: `EQ-${Date.now().toString().slice(-6)}`,
    equipmentName: '',
    category: 'Radiology & Imaging',
    department: 'Radiology & Imaging',
    manufacturer: '',
    model: '',
    serialNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    vendorName: 'Authorized Medical Supplier',
    purchaseCost: 50000,
    serviceInterval: 90,
    nextMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: 'Main Block, Room 101',
    assignedTechnician: '',
    remarks: '',
  });

  const [equipmentImage, setEquipmentImage] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const res = await getUsersList('role=Technician');
        if (res.success) {
          setTechnicians(res.users || []);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTechnicians();
  }, []);

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
    if (!formData.assetId || !formData.equipmentName || !formData.serialNumber) {
      addToast('Please complete all required fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        dataToSend.append(key, formData[key]);
      });
      if (equipmentImage) {
        dataToSend.append('equipmentImage', equipmentImage);
      }

      const res = await createEquipment(dataToSend);
      if (res.success) {
        addToast(`Equipment '${formData.equipmentName}' registered successfully!`, 'success');
        navigate('/equipment');
      } else {
        addToast(res.message || 'Registration failed', 'error');
      }
    } catch (err) {
      addToast(err.message || 'An error occurred during submission', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb
        items={[
          { label: 'Equipment Registry', link: '/equipment' },
          { label: 'Register New Equipment' },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Register Medical Equipment</h2>
          <p className="text-muted small mb-0">Add new hospital device, assign bio-med technician, and establish maintenance interval.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <GlassCard className="p-4 mb-4">
          <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">1. General Information</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Asset ID (Unique)</label>
              <input type="text" className="form-control glass-input" name="assetId" value={formData.assetId} onChange={handleChange} required />
            </div>

            <div className="col-md-8">
              <label className="form-label small fw-semibold text-muted">Equipment Name</label>
              <input type="text" className="form-control glass-input" name="equipmentName" placeholder="e.g. Siemens Magnetom 3T MRI Scanner" value={formData.equipmentName} onChange={handleChange} required />
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
              <label className="form-label small fw-semibold text-muted">Hospital Department</label>
              <select className="form-select glass-input" name="department" value={formData.department} onChange={handleChange}>
                <option value="Radiology & Imaging">Radiology & Imaging</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                <option value="General & Robotic Surgery">General & Robotic Surgery</option>
                <option value="Emergency & Trauma">Emergency & Trauma</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Facility Location / Room</label>
              <input type="text" className="form-control glass-input" name="location" value={formData.location} onChange={handleChange} required />
            </div>
          </div>

          <h5 className="fw-bold mb-3 mt-4 text-primary border-bottom pb-2">2. Technical & Vendor Specifications</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Manufacturer</label>
              <input type="text" className="form-control glass-input" name="manufacturer" placeholder="e.g. GE Healthcare" value={formData.manufacturer} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Model Designation</label>
              <input type="text" className="form-control glass-input" name="model" placeholder="e.g. Revolution 128" value={formData.model} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Serial Number (Unique)</label>
              <input type="text" className="form-control glass-input" name="serialNumber" placeholder="SN-XXXX-XXXX" value={formData.serialNumber} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Purchase Cost ($)</label>
              <input type="number" className="form-control glass-input" name="purchaseCost" value={formData.purchaseCost} onChange={handleChange} required min="0" />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Vendor Name</label>
              <input type="text" className="form-control glass-input" name="vendorName" value={formData.vendorName} onChange={handleChange} />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Assigned Bio-Med Technician</label>
              <select className="form-select glass-input" name="assignedTechnician" value={formData.assignedTechnician} onChange={handleChange}>
                <option value="">-- Unassigned --</option>
                {technicians.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.fullName} ({t.employeeId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h5 className="fw-bold mb-3 mt-4 text-primary border-bottom pb-2">3. Dates & Service Schedule</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Purchase Date</label>
              <input type="date" className="form-control glass-input" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Warranty Expiration Date</label>
              <input type="date" className="form-control glass-input" name="warrantyExpiry" value={formData.warrantyExpiry} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold text-muted">Next Maintenance Date</label>
              <input type="date" className="form-control glass-input" name="nextMaintenance" value={formData.nextMaintenance} onChange={handleChange} required />
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold text-muted">Equipment Image</label>
              <input type="file" className="form-control glass-input" accept="image/*" onChange={handleFileChange} />
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-semibold text-muted">Engineering & Operational Remarks</label>
              <textarea className="form-control glass-input" name="remarks" rows="3" placeholder="Enter initial calibration state or special operating conditions..." value={formData.remarks} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button type="button" className="btn btn-glass-secondary" onClick={() => navigate('/equipment')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-glass-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Register Equipment Asset'}
            </button>
          </div>
        </GlassCard>
      </form>
    </div>
  );
};

export default AddEquipment;
