import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ 
  type = 'text', 
  width, 
  height, 
  count = 1,
  circle = false,
  className = '' 
}) => {
  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`skeleton skeleton-${type} ${circle ? 'skeleton-circle' : ''} ${className}`}
      style={{ width, height }}
    />
  ));

  return <>{elements}</>;
};

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <SkeletonLoader type="avatar" circle width="60px" height="60px" />
    <div className="skeleton-content">
      <SkeletonLoader type="title" width="60%" height="20px" />
      <SkeletonLoader type="text" width="100%" height="16px" count={2} />
      <SkeletonLoader type="button" width="100px" height="36px" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonLoader key={i} type="text" width="120px" height="16px" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <SkeletonLoader key={colIndex} type="text" width="100%" height="16px" />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonLoader;




