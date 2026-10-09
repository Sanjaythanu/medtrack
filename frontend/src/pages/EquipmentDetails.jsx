import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getEquipmentById } from '../services/equipmentService';
import Breadcrumb from '../components/common/Breadcrumb';
import GlassCard from '../components/common/GlassCard';
import StatusBadge from '../components/common/StatusBadge';
import TimelineWidget from '../components/common/TimelineWidget';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatDate, formatCurrency } from '../utils/formatters';

const EquipmentDetails = () => {
  const { id } = useParams();
  const { isAdmin, isTechnician } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getEquipmentById(id);
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <LoadingSpinner text="Retrieving equipment technical specifications..." />;
  if (!data || !data.equipment) return <div className="text-center p-5">Equipment record not found.</div>;

  const { equipment, maintenanceHistory } = data;

  return (
    <div className="animate-fade-in">
      <Breadcrumb
        items={[
          { label: 'Equipment Registry', link: '/equipment' },
          { label: equipment.equipmentName },
        ]}
      />

      {/* Header Profile Card */}
      <GlassCard className="mb-4 p-4">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar rounded-circle bg-primary bg-opacity-15 p-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-hospital fs-1"></i>
            </div>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <h3 className="fw-extrabold text-primary mb-0">{equipment.equipmentName}</h3>
                <StatusBadge status={equipment.equipmentStatus} />
              </div>
              <p className="text-muted small mb-0">
                Asset ID: <strong className="text-dark">{equipment.assetId}</strong> | Serial No: <strong className="text-dark">{equipment.serialNumber}</strong> | Department: <strong className="text-dark">{equipment.department}</strong>
              </p>
            </div>
          </div>
          <div className="d-flex gap-2">
            {(isAdmin || isTechnician) && (
              <Link to={`/maintenance/schedule?equipmentId=${equipment._id}`} className="btn btn-glass-primary">
                <i className="bi bi-tools me-1.5"></i> Schedule Maintenance
              </Link>
            )}
            {(isAdmin || isTechnician) && (
              <Link to={`/equipment/edit/${equipment._id}`} className="btn btn-glass-secondary">
                <i className="bi bi-pencil me-1.5"></i> Edit Specs
              </Link>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Tabs Navigation */}
      <ul className="nav nav-tabs glass-panel border-bottom-0 p-2 mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link rounded-3 fw-medium ${activeTab === 'overview' ? 'active bg-primary text-white' : 'text-muted'}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-info-circle me-1.5"></i> Specifications & Specs
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-3 fw-medium ${activeTab === 'timeline' ? 'active bg-primary text-white' : 'text-muted'}`}
            onClick={() => setActiveTab('timeline')}
          >
            <i className="bi bi-clock-history me-1.5"></i> Lifecycle Timeline
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link rounded-3 fw-medium ${activeTab === 'maintenance' ? 'active bg-primary text-white' : 'text-muted'}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <i className="bi bi-journal-text me-1.5"></i> Maintenance Log ({maintenanceHistory.length})
          </button>
        </li>
      </ul>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          <div className="col-lg-8">
            <GlassCard title="Technical Specifications & Details" icon="bi-cpu">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-muted small">Manufacturer</label>
                  <div className="fw-semibold text-dark">{equipment.manufacturer}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Model Designation</label>
                  <div className="fw-semibold text-dark">{equipment.model}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Category</label>
                  <div className="fw-semibold text-dark">{equipment.category}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Facility Location</label>
                  <div className="fw-semibold text-dark">{equipment.location}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Purchase Date</label>
                  <div className="fw-semibold text-dark">{formatDate(equipment.purchaseDate)}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Installation Date</label>
                  <div className="fw-semibold text-dark">{formatDate(equipment.installationDate)}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Purchase Cost</label>
                  <div className="fw-semibold text-dark">{formatCurrency(equipment.purchaseCost)}</div>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small">Service Interval</label>
                  <div className="fw-semibold text-dark">Every {equipment.serviceInterval} Days</div>
                </div>
              </div>
              {equipment.remarks && (
                <div className="mt-4 pt-3 border-top">
                  <label className="text-muted small">Engineering & Operational Remarks</label>
                  <p className="mb-0 text-dark small">{equipment.remarks}</p>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="col-lg-4">
            <GlassCard title="Assigned Bio-Med Technician" icon="bi-person-badge">
              {equipment.assignedTechnician ? (
                <div>
                  <h6 className="fw-bold mb-1">{equipment.assignedTechnician.fullName}</h6>
                  <p className="small text-muted mb-2">{equipment.assignedTechnician.email}</p>
                  <div className="small"><i className="bi bi-telephone me-1 text-primary"></i> {equipment.assignedTechnician.phone || 'N/A'}</div>
                </div>
              ) : (
                <p className="text-muted small mb-0">No technician currently assigned to this asset.</p>
              )}
            </GlassCard>

            <GlassCard title="Warranty & Maintenance Dates" icon="bi-shield-check" className="mt-4">
              <div className="mb-3">
                <small className="text-muted d-block">Warranty Expiration</small>
                <span className="fw-bold text-danger">{formatDate(equipment.warrantyExpiry)}</span>
              </div>
              <div className="mb-3">
                <small className="text-muted d-block">Last Maintenance</small>
                <span className="fw-bold text-dark">{formatDate(equipment.lastMaintenance)}</span>
              </div>
              <div>
                <small className="text-muted d-block">Next Maintenance Due</small>
                <span className="fw-bold text-warning">{formatDate(equipment.nextMaintenance)}</span>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Tab 2: Lifecycle Timeline */}
      {activeTab === 'timeline' && (
        <GlassCard title="Equipment Lifecycle Visual Timeline" icon="bi-clock-history">
          <p className="text-muted small mb-4">Complete audit trail of equipment acquisition, commissioning, department assignments, and maintenance services.</p>
          <TimelineWidget equipment={equipment} maintenanceHistory={maintenanceHistory} />
        </GlassCard>
      )}

      {/* Tab 3: Maintenance History */}
      {activeTab === 'maintenance' && (
        <GlassCard title="Associated Maintenance Operations" icon="bi-tools">
          {maintenanceHistory.length === 0 ? (
            <p className="text-muted small my-3 text-center">No maintenance tasks recorded for this device.</p>
          ) : (
            <div className="table-responsive">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Type</th>
                    <th>Scheduled Date</th>
                    <th>Technician</th>
                    <th>Status</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceHistory.map((m) => (
                    <tr key={m._id}>
                      <td className="fw-bold">{m.maintenanceId}</td>
                      <td>{m.maintenanceType}</td>
                      <td>{formatDate(m.scheduledDate)}</td>
                      <td>{m.technicianId?.fullName || 'N/A'}</td>
                      <td><span className="badge bg-secondary">{m.status}</span></td>
                      <td>{formatCurrency(m.actualCost || m.estimatedCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};

export default EquipmentDetails;
