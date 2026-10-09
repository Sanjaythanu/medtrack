import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { getMaintenanceById, updateMaintenance } from '../services/maintenanceService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatCurrency } from '../utils/formatters';

const MaintenanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isTechnician } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [actualCost, setActualCost] = useState(0);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Scheduled');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await getMaintenanceById(id);
        if (res.success && res.maintenance) {
          setRecord(res.maintenance);
          setActualCost(res.maintenance.actualCost || res.maintenance.estimatedCost || 0);
          setNotes(res.maintenance.notes || '');
          setStatus(res.maintenance.status || 'Scheduled');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await updateMaintenance(id, {
        status,
        actualCost: parseFloat(actualCost),
        notes,
        completedDate: status === 'Completed' ? new Date().toISOString() : null,
      });
      if (res.success) {
        addToast('Maintenance task updated successfully!', 'success');
        setRecord(res.maintenance);
      } else {
        addToast(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      addToast('An error occurred during update', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading work order details..." />;
  if (!record) return <div className="text-center p-5">Maintenance record not found.</div>;

  return (
    <div className="animate-fade-in">
      <Breadcrumb
        items={[
          { label: 'Maintenance Operations', link: '/maintenance' },
          { label: `Work Order ${record.maintenanceId}` },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Work Order {record.maintenanceId}</h2>
          <p className="text-muted small mb-0">Maintenance task details, cost logging, and completion update.</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <GlassCard title="Task Overview & Equipment Data" icon="bi-tools">
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="text-muted small">Target Medical Device</label>
                <div className="fw-bold fs-6 text-primary">
                  <Link to={`/equipment/${record.equipmentId?._id}`}>{record.equipmentId?.equipmentName}</Link>
                </div>
                <small className="text-muted">Asset ID: {record.equipmentId?.assetId}</small>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Assigned Bio-Med Technician</label>
                <div className="fw-bold fs-6 text-dark">{record.technicianId?.fullName || 'Unassigned'}</div>
                <small className="text-muted">{record.technicianId?.email}</small>
              </div>

              <div className="col-md-4">
                <label className="text-muted small">Maintenance Category</label>
                <div><span className="badge bg-primary">{record.maintenanceType}</span></div>
              </div>

              <div className="col-md-4">
                <label className="text-muted small">Priority</label>
                <div>
                  <span className={`badge ${record.priority === 'Critical' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    {record.priority}
                  </span>
                </div>
              </div>

              <div className="col-md-4">
                <label className="text-muted small">Current Status</label>
                <div>
                  <span className={`badge ${record.status === 'Completed' ? 'bg-success' : 'bg-info text-dark'}`}>
                    {record.status}
                  </span>
                </div>
              </div>
            </div>

            {(isAdmin || isTechnician) && (
              <form onSubmit={handleUpdate} className="border-top pt-4">
                <h6 className="fw-bold mb-3 text-primary">Update Execution Status & Expenses</h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Execution Status</label>
                    <select className="form-select glass-input" value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted">Actual Incurred Cost ($)</label>
                    <input type="number" className="form-control glass-input" value={actualCost} onChange={(e) => setActualCost(e.target.value)} min="0" />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label small fw-semibold text-muted">Service Notes & Findings</label>
                    <textarea className="form-control glass-input" rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Log service procedures performed..."></textarea>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="submit" className="btn btn-glass-primary" disabled={updating}>
                    {updating ? 'Updating...' : 'Save Work Order Update'}
                  </button>
                </div>
              </form>
            )}
          </GlassCard>
        </div>

        <div className="col-lg-4">
          <GlassCard title="Dates & Financial Summary" icon="bi-calculator">
            <div className="mb-3">
              <small className="text-muted d-block">Scheduled Date</small>
              <span className="fw-bold text-dark">{formatDate(record.scheduledDate)}</span>
            </div>
            {record.completedDate && (
              <div className="mb-3">
                <small className="text-muted d-block">Completion Date</small>
                <span className="fw-bold text-success">{formatDate(record.completedDate)}</span>
              </div>
            )}
            <div className="mb-3">
              <small className="text-muted d-block">Estimated Budget</small>
              <span className="fw-bold text-muted">{formatCurrency(record.estimatedCost)}</span>
            </div>
            <div>
              <small className="text-muted d-block">Actual Expenses</small>
              <span className="fw-bold text-primary fs-5">{formatCurrency(record.actualCost)}</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetails;
