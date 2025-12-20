import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ 
  progress = 0, 
  showPercentage = true,
  size = 'md',
  color = 'primary',
  animated = true 
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`progress-indicator progress-${size} progress-${color}`}>
      <div className="progress-track">
        <div
          className={`progress-bar ${animated ? 'progress-animated' : ''}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <span className="progress-text">{Math.round(clampedProgress)}%</span>
      )}
    </div>
  );
};

export const LinearProgress = ({ progress, showPercentage, color }) => (
  <ProgressIndicator 
    progress={progress} 
    showPercentage={showPercentage}
    color={color}
  />
);

export const CircularProgress = ({ progress, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="circular-progress-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="circular-progress-bar"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="circular-progress-text">{Math.round(clampedProgress)}%</span>
    </div>
  );
};

export default ProgressIndicator;




