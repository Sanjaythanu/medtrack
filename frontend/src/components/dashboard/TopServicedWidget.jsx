import React from 'react';
import GlassCard from '../common/GlassCard';
import { formatCurrency } from '../../utils/formatters';

const TopServicedWidget = ({ items = [] }) => {
  return (
    <GlassCard title="Top 5 Frequently Serviced Equipment" icon="bi-award">
      {items.length === 0 ? (
        <p className="text-muted small my-3 text-center">No maintenance service records recorded yet.</p>
      ) : (
        <div className="d-flex flex-column gap-2">
          {items.map((item, idx) => (
            <div key={idx} className="p-3 glass-panel d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar rounded-circle bg-primary bg-opacity-15 text-primary fw-bold p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                  #{idx + 1}
                </div>
                <div>
                  <div className="fw-semibold text-primary">{item.equipment?.equipmentName || 'Medical Equipment'}</div>
                  <div className="small text-muted">
                    Asset ID: <span className="fw-medium">{item.equipment?.assetId}</span> | Dept: {item.equipment?.department}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <span className="badge bg-primary bg-opacity-15 text-primary fw-bold px-2.5 py-1 mb-1">
                  {item.maintenanceCount} Service Work Orders
                </span>
                <div className="extra-small text-muted">Cost: {formatCurrency(item.totalCost)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default TopServicedWidget;
