import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../common/GlassCard';
import { formatDate } from '../../utils/formatters';

const UpcomingMaintenanceWidget = ({ items = [] }) => {
  return (
    <GlassCard
      title="Upcoming Maintenance Queue"
      icon="bi-calendar-event"
      action={<Link to="/maintenance" className="small text-primary">View All</Link>}
    >
      {items.length === 0 ? (
        <p className="text-muted small my-3 text-center">No upcoming maintenance tasks.</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {items.map((m) => (
            <div key={m._id} className="p-3 glass-panel d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold text-primary">{m.equipmentId?.equipmentName || 'Equipment'}</div>
                <div className="small text-muted">
                  Asset: <span className="fw-medium">{m.equipmentId?.assetId}</span> | Location: {m.equipmentId?.location}
                </div>
              </div>
              <div className="text-end">
                <span className="badge bg-warning bg-opacity-20 text-warning border border-warning px-2.5 py-1 mb-1">
                  {formatDate(m.scheduledDate)}
                </span>
                <div className="extra-small text-muted">{m.technicianId?.fullName || 'Unassigned'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default UpcomingMaintenanceWidget;
