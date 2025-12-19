import React, { useState, useEffect } from 'react';
import { 
  getClientAppointments, 
  getTrainerAppointments, 
  updateAppointmentStatus 
} from '../utils/api';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import StatusBadge from './common/StatusBadge';
import { useNotification } from '../hooks/useNotification';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';
import './AppointmentsList.css';

const AppointmentsList = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    try {
      const response = user.role === 'client' 
        ? await getClientAppointments()
        : await getTrainerAppointments();
      setAppointments(response.data || []);
    } catch (err) {
      showNotification('Erro ao carregar agendamentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!selectedAppointment || !newStatus) return;

    try {
      await updateAppointmentStatus(selectedAppointment.id, newStatus);
      showNotification('Status atualizado com sucesso!', 'success');
      setShowStatusModal(false);
      setSelectedAppointment(null);
      setNewStatus('');
      loadAppointments();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Erro ao atualizar status', 'error');
    }
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setShowStatusModal(true);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
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

  const formatTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAvailableStatuses = (currentStatus, role) => {
    if (role === 'client') {
      if (currentStatus === 'pending') {
        return [{ value: 'cancelled', label: 'Cancelado' }];
      }
      return [];
    } else {
      if (currentStatus === 'pending') {
        return [
          { value: 'confirmed', label: 'Confirmado' },
          { value: 'cancelled', label: 'Cancelado' }
        ];
      }
      if (currentStatus === 'confirmed') {
        return [
          { value: 'completed', label: 'Concluído' },
          { value: 'cancelled', label: 'Cancelado' }
        ];
      }
      return [];
    }
  };

  const columns = [
    {
      key: 'date_time',
      header: 'Data/Hora',
      accessor: 'date_time',
      render: (row) => (
        <div className="datetime-cell">
          <div className="date-text">{formatDate(row.date_time)}</div>
          <div className="time-text">{formatTime(row.date_time)}</div>
        </div>
      ),
      sortable: true,
      width: '180px'
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
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
      sortable: true,
      width: '120px'
    },
    {
      key: 'duration',
      header: 'Duração',
      accessor: 'duration',
      render: (row) => `${row.duration || 0} min`,
      sortable: true,
      align: 'center',
      width: '100px'
    },
    {
      key: 'location',
      header: 'Local',
      accessor: 'location',
      render: (row) => (
        <span className="location-cell">
          {row.location || 'Não informado'}
        </span>
      ),
      width: '200px'
    }
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pendente' },
        { value: 'confirmed', label: 'Confirmado' },
        { value: 'completed', label: 'Concluído' },
        { value: 'cancelled', label: 'Cancelado' }
      ],
      filterFn: (row, value) => row.status === value
    }
  ];

  const actions = {
    onView: handleView,
    onEdit: (appointment) => {
      const availableStatuses = getAvailableStatuses(appointment.status, user.role);
      if (availableStatuses.length > 0) {
        handleEdit(appointment);
      }
    },
    onDelete: null, // Não permitir deletar, apenas mudar status
    showView: true,
    showEdit: getAvailableStatuses(appointments[0]?.status || 'pending', user.role).length > 0,
    showDelete: false,
    customActions: user.role === 'trainer' ? [
      {
        icon: '✅',
        title: 'Confirmar',
        onClick: (item) => {
          if (item.status === 'pending') {
            setSelectedAppointment(item);
            setNewStatus('confirmed');
            setShowStatusModal(true);
          }
        },
        className: 'action-confirm',
        show: (item) => item.status === 'pending'
      },
      {
        icon: '🎯',
        title: 'Marcar Concluído',
        onClick: (item) => {
          if (item.status === 'confirmed') {
            setSelectedAppointment(item);
            setNewStatus('completed');
            setShowStatusModal(true);
          }
        },
        className: 'action-complete',
        show: (item) => item.status === 'confirmed'
      }
    ].filter(action => !action.show || action.show(appointments.find(a => a.id === action.item?.id))) : []
  };

  if (loading) {
    return <LoadingSpinner message="Carregando agendamentos..." />;
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

      <div className="appointments-page">
        <div className="page-header">
          <div>
            <h1>📅 {user.role === 'client' ? 'Meus Agendamentos' : 'Agendamentos'}</h1>
            <p>Gerencie todos os seus agendamentos de forma organizada</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={appointments}
          actions={actions}
          pagination={true}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
          filterable={true}
          filters={filters}
          emptyMessage="Nenhum agendamento encontrado"
          loading={loading}
        />
      </div>

      {/* Modal de Detalhes */}
      {selectedAppointment && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAppointment(null);
          }}
          title="Detalhes do Agendamento"
          size="medium"
        >
          <div className="appointment-detail">
            <div className="detail-section">
              <h3>Informações Gerais</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Data/Hora:</span>
                  <span className="detail-value">{formatDateTime(selectedAppointment.date_time)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duração:</span>
                  <span className="detail-value">{selectedAppointment.duration} minutos</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <StatusBadge status={selectedAppointment.status} />
                </div>
                {selectedAppointment.location && (
                  <div className="detail-item">
                    <span className="detail-label">Local:</span>
                    <span className="detail-value">{selectedAppointment.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>{user.role === 'client' ? 'Personal Trainer' : 'Cliente'}</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Nome:</span>
                  <span className="detail-value">
                    {user.role === 'client' 
                      ? selectedAppointment.trainer_name 
                      : selectedAppointment.client_name}
                  </span>
                </div>
                {(user.role === 'client' ? selectedAppointment.trainer_email : selectedAppointment.client_email) && (
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">
                      {user.role === 'client' 
                        ? selectedAppointment.trainer_email 
                        : selectedAppointment.client_email}
                    </span>
                  </div>
                )}
                {(user.role === 'client' ? selectedAppointment.trainer_phone : selectedAppointment.client_phone) && (
                  <div className="detail-item">
                    <span className="detail-label">Telefone:</span>
                    <span className="detail-value">
                      {user.role === 'client' 
                        ? selectedAppointment.trainer_phone 
                        : selectedAppointment.client_phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {selectedAppointment.notes && (
              <div className="detail-section">
                <h3>Observações</h3>
                <p className="detail-notes">{selectedAppointment.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal de Alterar Status */}
      {selectedAppointment && (
        <Modal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedAppointment(null);
            setNewStatus('');
          }}
          title="Alterar Status do Agendamento"
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
                {getAvailableStatuses(selectedAppointment.status, user.role).map((status) => (
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
                  setSelectedAppointment(null);
                  setNewStatus('');
                }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleStatusChange}
                disabled={!newStatus || newStatus === selectedAppointment.status}
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

export default AppointmentsList;



