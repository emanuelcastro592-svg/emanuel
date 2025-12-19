import React from 'react';
import './EmptyState.css';

const EmptyState = ({
  icon = '📭',
  title = 'Nada aqui ainda',
  message,
  actionLabel,
  onAction,
  children
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {message && <p className="empty-state-message">{message}</p>}
      {children}
      {actionLabel && onAction && (
        <button className="btn btn-primary empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;



