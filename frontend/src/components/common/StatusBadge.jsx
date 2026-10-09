import React from 'react';
import { getStatusIcon } from '../../utils/statusHelpers';

const getStatusStyles = (status) => {
  switch (status) {
    case 'Healthy':
      return {
        bg: 'var(--status-healthy-bg)',
        color: 'var(--status-healthy)',
        border: 'rgba(0, 200, 151, 0.3)',
        dotColor: 'var(--status-healthy)',
      };
    case 'Due Soon':
      return {
        bg: 'var(--status-due-soon-bg)',
        color: 'var(--status-due-soon)',
        border: 'rgba(244, 180, 0, 0.3)',
        dotColor: 'var(--status-due-soon)',
      };
    case 'Warranty Expiring':
      return {
        bg: 'var(--status-warranty-bg)',
        color: 'var(--status-warranty)',
        border: 'rgba(255, 159, 67, 0.3)',
        dotColor: 'var(--status-warranty)',
      };
    case 'Maintenance Overdue':
      return {
        bg: 'var(--status-overdue-bg)',
        color: 'var(--status-overdue)',
        border: 'rgba(255, 77, 79, 0.3)',
        dotColor: 'var(--status-overdue)',
      };
    case 'Critical':
      return {
        bg: 'var(--status-critical-bg)',
        color: 'var(--status-critical)',
        border: 'rgba(193, 18, 31, 0.4)',
        dotColor: 'var(--status-critical)',
        isPulse: true,
      };
    case 'Under Repair':
      return {
        bg: 'rgba(139, 92, 246, 0.14)',
        color: 'var(--secondary-color)',
        border: 'rgba(139, 92, 246, 0.3)',
        dotColor: 'var(--secondary-color)',
      };
    case 'Retired':
      return {
        bg: 'rgba(100, 116, 139, 0.14)',
        color: 'var(--text-muted)',
        border: 'rgba(100, 116, 139, 0.25)',
        dotColor: 'var(--text-muted)',
      };
    default:
      return {
        bg: 'rgba(79, 124, 255, 0.14)',
        color: 'var(--accent-color)',
        border: 'rgba(79, 124, 255, 0.3)',
        dotColor: 'var(--accent-color)',
      };
  }
};

const StatusBadge = ({ status }) => {
  const styles = getStatusStyles(status);
  const icon = getStatusIcon(status);

  return (
    <span
      className={`d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-pill fw-semibold extra-small ${
        styles.isPulse ? 'pulse-critical' : ''
      }`}
      style={{
        backgroundColor: styles.bg,
        color: styles.color,
        border: `1px solid ${styles.border}`,
        letterSpacing: '0.01em',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: styles.dotColor,
          display: 'inline-block',
        }}
      ></span>
      <i className={`bi ${icon} extra-small`}></i>
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
