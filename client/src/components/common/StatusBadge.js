import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status, children, size = 'md' }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: 'Pendente',
        icon: '⏳',
        className: 'status-pending'
      },
      confirmed: {
        label: 'Confirmado',
        icon: '✅',
        className: 'status-confirmed'
      },
      completed: {
        label: 'Concluído',
        icon: '🎯',
        className: 'status-completed'
      },
      cancelled: {
        label: 'Cancelado',
        icon: '❌',
        className: 'status-cancelled'
      },
      accepted: {
        label: 'Aceito',
        icon: '✅',
        className: 'status-accepted'
      },
      rejected: {
        label: 'Rejeitado',
        icon: '❌',
        className: 'status-rejected'
      },
      active: {
        label: 'Ativo',
        icon: '🟢',
        className: 'status-active'
      },
      inactive: {
        label: 'Inativo',
        icon: '⚫',
        className: 'status-inactive'
      }
    };

    return configs[status] || {
      label: status,
      icon: '',
      className: 'status-default'
    };
  };

  const config = getStatusConfig(status);
  const displayText = children || config.label;

  return (
    <span className={`status-badge ${config.className} status-${size}`}>
      {config.icon && <span className="status-icon">{config.icon}</span>}
      <span className="status-text">{displayText}</span>
    </span>
  );
};

export default StatusBadge;



