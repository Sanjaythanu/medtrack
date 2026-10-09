import React from 'react';

const GlassModal = ({ show, onClose, title, children, footerButtons }) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-block modal-backdrop-blur"
      style={{ zIndex: 1060 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content glass-panel border-0 text-start modal-scale-in" style={{ borderRadius: '24px' }}>
          <div className="modal-header border-bottom border-white-10 px-4 py-3">
            <h5 className="modal-title fw-bold text-primary mb-0">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">{children}</div>
          {footerButtons && <div className="modal-footer border-top border-white-10 px-4 py-3">{footerButtons}</div>}
        </div>
      </div>
    </div>
  );
};

export default GlassModal;
