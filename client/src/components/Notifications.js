import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from '../utils/api';
import { getUser } from '../utils/auth';
import DataTable from './common/DataTable';
import EmptyState from './common/EmptyState';
import SkeletonLoader, { SkeletonTable } from './common/SkeletonLoader';
import Tooltip from './common/Tooltip';
import ConfirmationDialog from './common/ConfirmationDialog';
import { useNotification } from '../hooks/useNotification';
import Notification from './Notification';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [filter, setFilter] = useState('all');
  const user = getUser();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadUnreadCount();
      const interval = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const response = await getNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      showNotification('Erro ao carregar notificações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data?.count || 0);
    } catch (err) {
      // Ignorar erro
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      showNotification('Notificação marcada como lida', 'success');
      loadNotifications();
      loadUnreadCount();
    } catch (err) {
      showNotification('Erro ao marcar como lida', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      showNotification('Todas as notificações foram marcadas como lidas', 'success');
      loadNotifications();
      loadUnreadCount();
    } catch (err) {
      showNotification('Erro ao marcar todas como lidas', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedNotification) return;
    try {
      await deleteNotification(selectedNotification.id);
      showNotification('Notificação excluída', 'success');
      setShowDeleteDialog(false);
      setSelectedNotification(null);
      loadNotifications();
      loadUnreadCount();
    } catch (err) {
      showNotification('Erro ao excluir notificação', 'error');
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const columns = [
    {
      key: 'type',
      header: '',
      accessor: 'type',
      render: (row) => (
        <div className="notification-type-icon">
          {getTypeIcon(row.type)}
        </div>
      ),
      width: '50px',
      align: 'center'
    },
    {
      key: 'title',
      header: 'Título',
      accessor: 'title',
      render: (row) => (
        <div className="notification-title-cell">
          <strong className={!row.read ? 'unread-title' : ''}>{row.title}</strong>
          {!row.read && <span className="unread-dot"></span>}
        </div>
      ),
      sortable: true
    },
    {
      key: 'message',
      header: 'Mensagem',
      accessor: 'message',
      render: (row) => (
        <div className="notification-message-cell">
          {row.message}
        </div>
      ),
      width: '400px'
    },
    {
      key: 'created_at',
      header: 'Data',
      accessor: 'created_at',
      render: (row) => (
        <div className="notification-date-cell">
          {formatDateTime(row.created_at)}
        </div>
      ),
      sortable: true,
      width: '150px'
    },
    {
      key: 'read',
      header: 'Status',
      accessor: 'read',
      render: (row) => (
        <div className="notification-status-cell">
          {row.read ? (
            <span className="status-read">✓ Lida</span>
          ) : (
            <span className="status-unread">● Não lida</span>
          )}
        </div>
      ),
      sortable: true,
      width: '120px'
    }
  ];

  const filters = [
    {
      key: 'type',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: 'success', label: 'Sucesso' },
        { value: 'error', label: 'Erro' },
        { value: 'warning', label: 'Aviso' },
        { value: 'info', label: 'Informação' }
      ],
      filterFn: (row, value) => row.type === value
    }
  ];

  const actions = {
    onView: (notif) => {
      if (notif.link) {
        window.location.href = notif.link;
      }
      if (!notif.read) {
        handleMarkAsRead(notif.id);
      }
    },
    onEdit: (notif) => {
      if (!notif.read) {
        handleMarkAsRead(notif.id);
      }
    },
    onDelete: (notif) => {
      setSelectedNotification(notif);
      setShowDeleteDialog(true);
    },
    showView: true,
    showEdit: (notif) => !notif.read,
    showDelete: true,
    deleteConfirmMessage: 'Tem certeza que deseja excluir esta notificação?',
    customActions: [
      {
        icon: '✓',
        title: 'Marcar como lida',
        onClick: (item) => {
          if (!item.read) {
            handleMarkAsRead(item.id);
          }
        },
        className: 'action-mark-read',
        show: (item) => !item.read
      }
    ]
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={hideNotification}
        />
      )}

      <div className="notifications-page">
        <div className="page-header">
          <div>
            <h1>
              🔔 Notificações
              {unreadCount > 0 && (
                <span className="unread-badge-large">{unreadCount}</span>
              )}
            </h1>
            <p>Mantenha-se atualizado com todas as suas notificações</p>
          </div>
          <div className="header-actions">
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Todas ({notifications.length})
              </button>
              <button
                className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Não lidas ({unreadCount})
              </button>
              <button
                className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
                onClick={() => setFilter('read')}
              >
                Lidas ({notifications.length - unreadCount})
              </button>
            </div>
            {unreadCount > 0 && (
              <Tooltip content="Marcar todas as notificações como lidas">
                <button
                  className="btn btn-primary"
                  onClick={handleMarkAllAsRead}
                >
                  Marcar todas como lidas
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredNotifications}
          actions={actions}
          pagination={true}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
          filterable={true}
          filters={filters}
          emptyMessage={
            <EmptyState
              icon="🔔"
              title={filter === 'unread' ? "Nenhuma notificação não lida" : "Nenhuma notificação"}
              message={
                filter === 'unread'
                  ? "Você está em dia! Todas as notificações foram lidas."
                  : "Você ainda não recebeu nenhuma notificação."
              }
            />
          }
          loading={loading}
        />
      </div>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedNotification(null);
        }}
        onConfirm={handleDelete}
        title="Excluir Notificação"
        message="Tem certeza que deseja excluir esta notificação? Esta ação não pode ser desfeita."
        type="danger"
        confirmText="Excluir"
      />
    </>
  );
};

export default Notifications;




