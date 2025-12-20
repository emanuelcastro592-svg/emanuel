import React, { useState, useEffect } from 'react';
import { 
  getClientRequests, 
  getTrainerRequests, 
  updateRequestStatus 
} from '../utils/api';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import StatusBadge from './common/StatusBadge';
import EmptyState from './common/EmptyState';
import SkeletonLoader, { SkeletonTable } from './common/SkeletonLoader';
import { useNotification } from '../hooks/useNotification';
import Notification from './Notification';
import './RequestsList.css';

const RequestsList = ({ user }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    loadRequests();
  }, [user]);

  const loadRequests = async () => {
    try {
      const response = user.role === 'client' 
        ? await getClientRequests()
        : await getTrainerRequests();
      setRequests(response.data || []);
    } catch (err) {
      showNotification('Erro ao carregar solicitações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedRequest || !newStatus) return;

    try {
      await updateRequestStatus(selectedRequest.id, newStatus);
      showNotification('Status atualizado com sucesso!', 'success');
      setShowStatusModal(false);
      setSelectedRequest(null);
      setNewStatus('');
      loadRequests();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Erro ao atualizar status', 'error');
    }
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setShowStatusModal(true);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Não especificado';
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getAvailableStatuses = (currentStatus, role) => {
    if (role === 'client') {
      if (currentStatus === 'pending') {
        return [{ value: 'cancelled', label: 'Cancelada' }];
      }
      return [];
    } else {
      if (currentStatus === 'pending') {
        return [
          { value: 'accepted', label: 'Aceita' },
          { value: 'rejected', label: 'Rejeitada' }
        ];
      }
      if (currentStatus === 'accepted') {
        return [
          { value: 'completed', label: 'Concluída' },
          { value: 'cancelled', label: 'Cancelada' }
        ];
      }
      return [];
    }
  };

  const columns = [
    {
      key: 'service_name',
      header: 'Serviço',
      accessor: 'service_name',
      render: (row) => (
        <div className="service-cell">
          <strong>{row.service_name}</strong>
          {row.service_description && (
            <div className="service-description">{row.service_description}</div>
          )}
        </div>
      ),
      sortable: true
    },
    {
      key: user.role === 'client' ? 'trainer_name' : 'client_name',
      header: user.role === 'client' ? 'Personal Trainer' : 'Cliente',
      accessor: user.role === 'client' ? 'trainer_name' : 'client_name',
      render: (row) => (
        <div className="user-cell">
          <div className="user-avatar-small">
            {(user.role === 'client' ? row.trainer_name : row.client_name)?.charAt(0).toUpperCase() || '?'}
          </div>
          <span>{user.role === 'client' ? row.trainer_name : row.client_name || 'N/A'}</span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'requested_date_time',
      header: 'Data/Hora Desejada',
      accessor: 'requested_date_time',
      render: (row) => (
        <div className="datetime-cell">
          <div className="date-text">{formatDate(row.requested_date_time)}</div>
          {row.requested_date_time && (
            <div className="time-text">
              {new Date(row.requested_date_time).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
      ),
      sortable: true,
      width: '180px'
    },
    {
      key: 'service_price',
      header: 'Preço',
      accessor: 'service_price',
      render: (row) => formatPrice(row.service_price || 0),
      sortable: true,
      align: 'right',
      width: '120px'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status === 'accepted' ? 'accepted' : row.status} />,
      sortable: true,
      width: '120px'
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pendente' },
        { value: 'accepted', label: 'Aceita' },
        { value: 'rejected', label: 'Rejeitada' },
        { value: 'completed', label: 'Concluída' },
        { value: 'cancelled', label: 'Cancelada' }
      ],
      filterFn: (row, value) => row.status === value
    }
  ];

  const actions = {
    onView: handleView,
    onEdit: (request) => {
      const availableStatuses = getAvailableStatuses(request.status, user.role);
      if (availableStatuses.length > 0) {
        handleEdit(request);
      }
    },
    onDelete: null,
    showView: true,
    showEdit: (request) => getAvailableStatuses(request.status, user.role).length > 0,
    showDelete: false,
    customActions: user.role === 'trainer' ? [
      {
        icon: '✅',
        title: 'Aceitar',
        onClick: (item) => {
          if (item.status === 'pending') {
            setSelectedRequest(item);
            setNewStatus('accepted');
            setShowStatusModal(true);
          }
        },
        className: 'action-accept',
        show: (item) => item.status === 'pending'
      },
      {
        icon: '🎯',
        title: 'Marcar Concluída',
        onClick: (item) => {
          if (item.status === 'accepted') {
            setSelectedRequest(item);
            setNewStatus('completed');
            setShowStatusModal(true);
          }
        },
        className: 'action-complete',
        show: (item) => item.status === 'accepted'
      }
    ].filter(action => !action.show || action.show(requests.find(r => r.id === action.item?.id))) : []
  };

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

      <div className="requests-page">
        <div className="page-header">
          <div>
            <h1>🔔 {user.role === 'client' ? 'Minhas Solicitações' : 'Solicitações de Serviços'}</h1>
            <p>Gerencie todas as suas solicitações de serviços de forma organizada</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={requests}
          actions={actions}
          pagination={true}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
          filterable={true}
          filters={filters}
          emptyMessage={
            <EmptyState
              icon="📋"
              title="Nenhuma solicitação encontrada"
              message={
                user.role === 'client'
                  ? "Você ainda não fez nenhuma solicitação. Explore os personal trainers e seus serviços!"
                  : "Você ainda não recebeu nenhuma solicitação de serviço."
              }
            />
          }
          loading={loading}
        />
      </div>

      {/* Modal de Detalhes */}
      {selectedRequest && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRequest(null);
          }}
          title="Detalhes da Solicitação"
          size="medium"
        >
          <div className="request-detail">
            <div className="detail-section">
              <h3>Informações do Serviço</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Nome:</span>
                  <span className="detail-value">{selectedRequest.service_name}</span>
                </div>
                {selectedRequest.service_description && (
                  <div className="detail-item full-width">
                    <span className="detail-label">Descrição:</span>
                    <span className="detail-value">{selectedRequest.service_description}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Duração:</span>
                  <span className="detail-value">{selectedRequest.service_duration} minutos</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Preço:</span>
                  <span className="detail-value">{formatPrice(selectedRequest.service_price)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <StatusBadge status={selectedRequest.status === 'accepted' ? 'accepted' : selectedRequest.status} />
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>{user.role === 'client' ? 'Personal Trainer' : 'Cliente'}</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Nome:</span>
                  <span className="detail-value">
                    {user.role === 'client' 
                      ? selectedRequest.trainer_name 
                      : selectedRequest.client_name}
                  </span>
                </div>
                {(user.role === 'client' ? selectedRequest.trainer_email : selectedRequest.client_email) && (
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {user.role === 'client' 
                        ? selectedRequest.trainer_email 
                        : selectedRequest.client_email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>Detalhes da Solicitação</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Data/Hora Desejada:</span>
                  <span className="detail-value">{formatDateTime(selectedRequest.requested_date_time)}</span>
                </div>
                {selectedRequest.location && (
                  <div className="detail-item">
                    <span className="detail-label">Local:</span>
                    <span className="detail-value">{selectedRequest.location}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Criado em:</span>
                  <span className="detail-value">{formatDateTime(selectedRequest.created_at)}</span>
                </div>
              </div>
            </div>

            {selectedRequest.notes && (
              <div className="detail-section">
                <h3>Observações</h3>
                <p className="detail-notes">{selectedRequest.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal de Alterar Status */}
      {selectedRequest && (
        <Modal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedRequest(null);
            setNewStatus('');
          }}
          title="Alterar Status da Solicitação"
          size="small"
        >
          <div className="status-change-form">
            <div className="form-group">
              <label>Novo Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="form-select"
              >
                <option value="">Selecione um status</option>
                {getAvailableStatuses(selectedRequest.status, user.role).map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedRequest(null);
                  setNewStatus('');
                }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleStatusChange}
                disabled={!newStatus || newStatus === selectedRequest.status}
              >
                Salvar Alteração
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default RequestsList;




