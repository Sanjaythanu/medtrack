import React from 'react';

const EmptyState = ({ title = 'No Data Found', message = 'There are no records matching your criteria.', icon = 'bi-inbox', action }) => {
  return (
    <div className="glass-panel p-5 text-center my-4 animate-fade-in">
      <div className="avatar avatar-xl rounded-circle bg-primary bg-opacity-10 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
        <i className={`bi ${icon} fs-1 text-primary`}></i>
      </div>
      <h4 className="fw-bold mb-2">{title}</h4>
      <p className="text-muted max-w-md mx-auto mb-4">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
