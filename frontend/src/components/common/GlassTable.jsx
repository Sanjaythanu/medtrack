import React from 'react';

const GlassTable = ({ headers, children, className = '' }) => {
  return (
    <div className={`glass-table-container ${className}`}>
      <div className="table-responsive">
        <table className="glass-table align-middle">
          <thead>
            <tr>
              {headers.map((h, idx) => (
                <th key={idx}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="stagger-children">{children}</tbody>
        </table>
      </div>
    </div>
  );
};

export default GlassTable;
