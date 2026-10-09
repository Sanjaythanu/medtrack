import React from 'react';

const SkeletonLoader = ({ count = 3, height = '40px' }) => {
  return (
    <div className="d-flex flex-column gap-3 w-100">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-box w-100" style={{ height }}></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
