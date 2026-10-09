import React, { createContext, useState } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Floating Toast Notification Container */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show glass-panel text-white align-items-center mb-2 bg-${
              toast.type === 'error'
                ? 'danger'
                : toast.type === 'success'
                ? 'success'
                : toast.type === 'warning'
                ? 'warning text-dark'
                : 'primary'
            }`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body d-flex align-items-center gap-2">
                <i
                  className={`bi fs-5 ${
                    toast.type === 'error'
                      ? 'bi-exclamation-octagon-fill'
                      : toast.type === 'success'
                      ? 'bi-check-circle-fill'
                      : toast.type === 'warning'
                      ? 'bi-exclamation-triangle-fill'
                      : 'bi-info-circle-fill'
                  }`}
                ></i>
                <span>{toast.message}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => removeToast(toast.id)}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
