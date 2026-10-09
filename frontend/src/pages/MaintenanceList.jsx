import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { getMaintenanceList, updateMaintenance } from '../services/maintenanceService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';
import GlassTable from '../components/common/GlassTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { formatDate, formatCurrency } from '../utils/formatters';

const MaintenanceList = () => {
  const { isAdmin, isTechnician } = useContext(AuthContext);
  const { addToast } = useContext(NotificationContext);

  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchMaintenanceData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        status: statusFilter,
        priority: priorityFilter,
      }).toString();

      const res = await getMaintenanceList(query);
      if (res.success) {
        setMaintenance(res.maintenance || []);
      }
    } catch (err) {
      addToast('Failed to fetch maintenance tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, [statusFilter, priorityFilter]);

  const handleMarkComplete = async (mId) => {
    try {
      const res = await updateMaintenance(mId, {
        status: 'Completed',
        completedDate: new Date().toISOString(),
      });
      if (res.success) {
        addToast('Maintenance task marked as Completed!', 'success');
        fetchMaintenanceData();
      } else {
        addToast(res.message || 'Update failed', 'error');
      }
    } catch (err) {
      addToast('Failed to update maintenance task', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <Breadcrumb items={[{ label: 'Maintenance Operations' }]} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-extrabold text-primary mb-1">Maintenance Operations & Work Orders</h2>
          <p className="text-muted small mb-0">Preventive, corrective, routine, and emergency bio-medical maintenance queue.</p>
        </div>
        {(isAdmin || isTechnician) && (
          <Link to="/maintenance/schedule" className="btn btn-glass-primary">
            <i className="bi bi-calendar-plus me-1.5"></i> Schedule Task
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-3 mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted mb-1">Filter by Status</label>
            <select className="form-select glass-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label small fw-semibold text-muted mb-1">Filter by Priority</label>
            <select className="form-select glass-input" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <LoadingSpinner text="Fetching maintenance work orders..." />
      ) : maintenance.length === 0 ? (
        <EmptyState
          title="No Maintenance Work Orders"
          message="No scheduled or logged maintenance tasks found matching your filters."
        />
      ) : (
        <GlassTable headers={['Task ID', 'Equipment Name & Asset ID', 'Type', 'Scheduled Date', 'Priority', 'Assigned Tech', 'Status', 'Actions']}>
          {maintenance.map((m) => (
            <tr key={m._id}>
              <td className="fw-bold text-primary">{m.maintenanceId}</td>
              <td>
                <div className="fw-semibold">{m.equipmentId?.equipmentName || 'Equipment'}</div>
                <small className="text-muted">Asset: {m.equipmentId?.assetId}</small>
              </td>
              <td><span className="badge bg-primary bg-opacity-15 text-primary">{m.maintenanceType}</span></td>
              <td>{formatDate(m.scheduledDate)}</td>
              <td>
                <span
                  className={`badge ${
                    m.priority === 'Critical'
                      ? 'bg-danger'
                      : m.priority === 'High'
                      ? 'bg-warning text-dark'
                      : 'bg-secondary'
                  }`}
                >
                  {m.priority}
                </span>
              </td>
              <td>{m.technicianId?.fullName || 'Unassigned'}</td>
              <td>
                <span
                  className={`badge ${
                    m.status === 'Completed'
                      ? 'bg-success'
                      : m.status === 'Overdue'
                      ? 'bg-danger'
                      : 'bg-info text-dark'
                  }`}
                >
                  {m.status}
                </span>
              </td>
              <td>
                <div className="d-flex gap-1">
                  <Link to={`/maintenance/${m._id}`} className="btn btn-sm btn-glass-secondary" title="View Details">
                    <i className="bi bi-eye"></i>
                  </Link>
                  {(isAdmin || isTechnician) && m.status !== 'Completed' && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleMarkComplete(m._id)}
                      title="Mark Task Completed"
                    >
                      <i className="bi bi-check-lg"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </GlassTable>
      )}
    </div>
  );
};

export default MaintenanceList;
