import React from 'react';

const FilterPanel = ({ filters, onFilterChange, onReset, departments = [], categories = [] }) => {
  return (
    <div className="glass-panel p-3 mb-4">
      <div className="row g-3 align-items-center">
        <div className="col-md-3">
          <label className="form-label small fw-semibold text-muted mb-1">Department</label>
          <select
            className="form-select glass-input"
            value={filters.department || ''}
            onChange={(e) => onFilterChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d._id || d.name} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label small fw-semibold text-muted mb-1">Category</label>
          <select
            className="form-select glass-input"
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Radiology & Imaging">Radiology & Imaging</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Life Support">Life Support</option>
            <option value="Patient Monitoring">Patient Monitoring</option>
            <option value="Surgical Workstations">Surgical Workstations</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label small fw-semibold text-muted mb-1">Health Status</label>
          <select
            className="form-select glass-input"
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Warranty Expiring">Warranty Expiring</option>
            <option value="Maintenance Overdue">Maintenance Overdue</option>
            <option value="Critical">Critical</option>
            <option value="Under Repair">Under Repair</option>
          </select>
        </div>

        <div className="col-md-3 d-flex align-items-end gap-2 mt-md-4">
          <button className="btn btn-glass-secondary w-100" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
