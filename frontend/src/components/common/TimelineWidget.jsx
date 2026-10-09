import React from 'react';
import { formatDate } from '../../utils/formatters';

const TimelineWidget = ({ equipment, maintenanceHistory = [] }) => {
  const timelineEvents = [
    {
      title: 'Equipment Purchased',
      date: formatDate(equipment.purchaseDate),
      description: `Purchased from vendor '${equipment.vendorName || 'Authorized Vendor'}' for ${equipment.purchaseCost ? `$${equipment.purchaseCost.toLocaleString()}` : 'N/A'}.`,
      icon: 'bi-cart-check',
      color: 'bg-primary',
    },
    {
      title: 'Installation & Commissioning',
      date: formatDate(equipment.installationDate),
      description: `Installed at ${equipment.location || 'Facility'} for operational deployment.`,
      icon: 'bi-box-seam',
      color: 'bg-info',
    },
    {
      title: 'Department Assignment',
      date: formatDate(equipment.installationDate),
      description: `Assigned to ${equipment.department} department.`,
      icon: 'bi-building',
      color: 'bg-secondary',
    },
    {
      title: 'Technician Assignment',
      date: formatDate(equipment.createdAt),
      description: equipment.assignedTechnician ? `Assigned to Lead Bio-Med Tech ${equipment.assignedTechnician.fullName}.` : 'Pending Technician Assignment',
      icon: 'bi-person-badge',
      color: 'bg-dark',
    },
  ];

  // Add Maintenance Events
  maintenanceHistory.forEach((m) => {
    timelineEvents.push({
      title: `${m.maintenanceType} Maintenance (${m.status})`,
      date: formatDate(m.scheduledDate),
      description: `Task ${m.maintenanceId}: ${m.notes || 'Service routine executed.'}`,
      icon: m.status === 'Completed' ? 'bi-check-circle-fill' : 'bi-clock-history',
      color: m.status === 'Completed' ? 'bg-success' : 'bg-warning',
    });
  });

  // Warranty Milestone
  timelineEvents.push({
    title: 'Warranty Expiration',
    date: formatDate(equipment.warrantyExpiry),
    description: `Manufacturer warranty period ends on ${formatDate(equipment.warrantyExpiry)}.`,
    icon: 'bi-shield-exclamation',
    color: 'bg-danger',
  });

  return (
    <div className="position-relative ps-4 border-start border-2 border-primary border-opacity-25 my-3">
      {timelineEvents.map((evt, idx) => (
        <div key={idx} className="mb-4 position-relative animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
          <div
            className={`position-absolute top-0 start-0 translate-middle rounded-circle p-2 text-white ${evt.color} shadow-sm d-flex align-items-center justify-content-center`}
            style={{ width: '32px', height: '32px', left: '-1rem' }}
          >
            <i className={`bi ${evt.icon} fs-6`}></i>
          </div>
          <div className="glass-card p-3 ms-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h6 className="fw-bold mb-0 text-primary">{evt.title}</h6>
              <span className="badge bg-secondary bg-opacity-20 text-muted small">{evt.date}</span>
            </div>
            <p className="small text-muted mb-0">{evt.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineWidget;
