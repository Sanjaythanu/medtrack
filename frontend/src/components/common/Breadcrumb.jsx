import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className="mb-3">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/dashboard" className="text-muted d-inline-flex align-items-center gap-1">
            <i className="bi bi-house-door"></i> Home
          </Link>
        </li>
        {items.map((item, idx) => (
          <li
            key={idx}
            className={`breadcrumb-item ${idx === items.length - 1 ? 'active text-primary fw-medium' : ''}`}
            aria-current={idx === items.length - 1 ? 'page' : undefined}
          >
            {item.link ? (
              <Link to={item.link} className="text-muted">
                {item.label}
              </Link>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
