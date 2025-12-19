import React, { useState, useEffect } from 'react';
import { getTrainerServices, createService, updateService, deleteService } from '../utils/api';
import DataTable from './common/DataTable';
import Modal from './common/Modal';
import StatusBadge from './common/StatusBadge';
import { useNotification } from '../hooks/useNotification';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';
import './ServicesManagement.css';

const ServicesManagement = ({ user }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    loadServices();
  }, [user]);

  const loadServices = async () => {
    try {
      const response = await getTrainerServices(user.id);
      setServices(response.data || []);
    } catch (err) {
      showNotification('Erro ao carregar serviços', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.duration || parseInt(formData.duration) < 1) {
      newErrors.duration = 'Duração deve ser maior que 0';
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Preço deve ser maior ou igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification('Por favor, corrija os erros no formulário', 'error');
      return;
    }

    try {
      if (editingService) {
        await updateService(editingService.id, {
          name: formData.name,
          description: formData.description,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price),
          category: formData.category || null,
        });
        showNotification('Serviço atualizado com sucesso!', 'success');
      } else {
        await createService({
          name: formData.name,
          description: formData.description,
          duration: parseInt(formData.duration),
          price: parseFloat(formData.price),
          category: formData.category || null,
        });
        showNotification('Serviço criado com sucesso!', 'success');
      }

      setShowFormModal(false);
      resetForm();
      loadServices();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Erro ao salvar serviço', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      price: '',
      category: '',
    });
    setErrors({});
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      duration: service.duration || '',
      price: service.price || '',
      category: service.category || '',
    });
    setShowFormModal(true);
  };

  const handleDelete = async (service) => {
    try {
      await deleteService(service.id);
      showNotification('Serviço excluído com sucesso!', 'success');
      loadServices();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Erro ao excluir serviço', 'error');
    }
  };

  const handleNewService = () => {
    resetForm();
    setShowFormModal(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const columns = [
    {
      key: 'name',
      header: 'Nome do Serviço',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="service-name-cell">
          <strong>{row.name}</strong>
          {row.category && (
            <span className="service-category">{row.category}</span>
          )}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Descrição',
      accessor: 'description',
      render: (row) => (
        <span className="service-description-cell">
          {row.description || 'Sem descrição'}
        </span>
      ),
      width: '300px'
    },
    {
      key: 'duration',
      header: 'Duração',
      accessor: 'duration',
      render: (row) => `${row.duration} min`,
      sortable: true,
      align: 'center',
      width: '100px'
    },
    {
      key: 'price',
      header: 'Preço',
      accessor: 'price',
      render: (row) => formatPrice(row.price),
      sortable: true,
      align: 'right',
      width: '120px'
    },
    {
      key: 'active',
      header: 'Status',
      accessor: 'active',
      render: (row) => (
        <StatusBadge status={row.active ? 'active' : 'inactive'} />
      ),
      sortable: true,
      align: 'center',
      width: '100px'
    }
  ];

  const filters = [
    {
      key: 'category',
      label: 'Categoria',
      type: 'select',
      options: [
        { value: 'treino_personalizado', label: 'Treino Personalizado' },
        { value: 'consultoria', label: 'Consultoria' },
        { value: 'avaliacao_fisica', label: 'Avaliação Física' },
        { value: 'nutricao', label: 'Nutrição' },
        { value: 'outro', label: 'Outro' }
      ],
      filterFn: (row, value) => row.category === value
    }
  ];

  const actions = {
    onView: null,
    onEdit: handleEdit,
    onDelete: handleDelete,
    showView: false,
    showEdit: true,
    showDelete: true,
    deleteConfirmMessage: 'Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.'
  };

  if (loading) {
    return <LoadingSpinner message="Carregando serviços..." />;
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

      <div className="services-page">
        <div className="page-header">
          <div>
            <h1>📋 Meus Serviços</h1>
            <p>Gerencie os serviços que você oferece aos seus clientes</p>
          </div>
          <button
            className="btn btn-primary btn-new-service"
            onClick={handleNewService}
          >
            + Novo Serviço
          </button>
        </div>

        <DataTable
          columns={columns}
          data={services}
          actions={actions}
          pagination={true}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
          filterable={true}
          filters={filters}
          emptyMessage="Nenhum serviço cadastrado. Clique em 'Novo Serviço' para criar seu primeiro serviço!"
          loading={loading}
        />
      </div>

      {/* Modal de Criar/Editar Serviço */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          resetForm();
        }}
        title={editingService ? 'Editar Serviço' : 'Novo Serviço'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-group">
            <label htmlFor="name">
              Nome do Serviço *
              {errors.name && <span className="error-indicator">⚠️</span>}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              placeholder="Ex: Treino Personalizado"
              required
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descreva o serviço oferecido..."
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">
                Duração (minutos) *
                {errors.duration && <span className="error-indicator">⚠️</span>}
              </label>
              <input
                id="duration"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className={errors.duration ? 'input-error' : ''}
                min="1"
                placeholder="Ex: 60"
                required
              />
              {errors.duration && <span className="field-error">{errors.duration}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Preço (R$) *
                {errors.price && <span className="error-indicator">⚠️</span>}
              </label>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'input-error' : ''}
                min="0"
                step="0.01"
                placeholder="Ex: 150.00"
                required
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoria</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              <option value="treino_personalizado">Treino Personalizado</option>
              <option value="consultoria">Consultoria</option>
              <option value="avaliacao_fisica">Avaliação Física</option>
              <option value="nutricao">Nutrição</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowFormModal(false);
                resetForm();
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {editingService ? 'Atualizar Serviço' : 'Criar Serviço'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ServicesManagement;



