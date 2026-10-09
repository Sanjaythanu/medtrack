import React from 'react';
import GlassCard from '../common/GlassCard';
import { formatDateTime } from '../../utils/formatters';

const ActivityTimeline = ({ activities = [] }) => {
  return (
    <GlassCard title="Real-Time Audit & Activity Feed" icon="bi-activity">
      {activities.length === 0 ? (
        <p className="text-muted small my-3 text-center">No recent audit log activity.</p>
      ) : (
        <div className="d-flex flex-column gap-2 max-h-80 overflow-auto">
          {activities.map((act) => (
            <div key={act._id} className="p-2.5 glass-panel d-flex align-items-start gap-3">
              <div className="avatar rounded-circle bg-primary bg-opacity-15 p-2 text-primary mt-1">
                <i className="bi bi-clock-history fs-6"></i>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold text-primary small">{act.action}</span>
                  <span className="extra-small text-muted">{formatDateTime(act.createdAt)}</span>
                </div>
                <p className="small text-muted mb-0">{act.details}</p>
                <div className="extra-small text-muted mt-1">
                  By: <span className="fw-medium">{act.userName}</span> ({act.userRole})
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default ActivityTimeline;
