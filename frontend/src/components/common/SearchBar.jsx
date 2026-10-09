import React from 'react';

const SearchBar = ({ value, onChange, placeholder = 'Search equipment, asset ID, serial number...' }) => {
  return (
    <div className="position-relative w-100">
      <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
      <input
        type="text"
        className="form-control glass-input ps-5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          className="btn btn-sm btn-link position-absolute top-50 end-0 translate-middle-y me-2 text-muted"
          onClick={() => onChange('')}
        >
          <i className="bi bi-x-circle-fill"></i>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
