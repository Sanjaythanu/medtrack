export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Healthy':
      return 'badge-healthy';
    case 'Due Soon':
      return 'badge-due-soon';
    case 'Warranty Expiring':
      return 'badge-warranty';
    case 'Maintenance Overdue':
      return 'badge-overdue';
    case 'Critical':
      return 'badge-critical pulse-critical';
    case 'Under Repair':
      return 'bg-warning text-dark';
    case 'Retired':
      return 'bg-secondary text-white';
    default:
      return 'bg-info text-dark';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'Healthy':
      return 'bi-shield-check';
    case 'Due Soon':
      return 'bi-clock-history';
    case 'Warranty Expiring':
      return 'bi-exclamation-triangle';
    case 'Maintenance Overdue':
      return 'bi-exclamation-circle';
    case 'Critical':
      return 'bi-lightning-charge-fill';
    case 'Under Repair':
      return 'bi-tools';
    default:
      return 'bi-info-circle';
  }
};
