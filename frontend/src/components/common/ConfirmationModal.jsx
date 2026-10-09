import React from 'react';
import GlassModal from './GlassModal';

const ConfirmationModal = ({ show, onClose, onConfirm, title = 'Confirm Action', message, confirmText = 'Delete', isDanger = true }) => {
  return (
    <GlassModal
      show={show}
      onClose={onClose}
      title={title}
      footerButtons={
        <>
          <button className="btn btn-glass-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className={`btn ${isDanger ? 'btn-danger' : 'btn-glass-primary'}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </>
      }
    >
      <div className="d-flex align-items-center gap-3">
        <i className={`bi ${isDanger ? 'bi-exclamation-triangle-fill text-danger' : 'bi-info-circle-fill text-primary'} fs-1`}></i>
        <p className="mb-0 fs-6">{message}</p>
      </div>
    </GlassModal>
  );
};

export default ConfirmationModal;
