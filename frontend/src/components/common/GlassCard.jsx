import React from 'react';

const GlassCard = ({ children, className = '', title, subtitle, icon, action }) => {
  return (
    <div className={`glass-card p-4 ${className}`}>
      {(title || action) && (
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
          <div className="d-flex align-items-center gap-2">
            {icon && <i className={`bi ${icon} fs-4 text-primary`}></i>}
            <div>
              {title && <h5 className="fw-bold mb-0">{title}</h5>}
              {subtitle && <small className="text-muted">{subtitle}</small>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default GlassCard;
