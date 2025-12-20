import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrainers, getTrainerServices, getTrainerRatings } from '../utils/api';
import Modal from './common/Modal';
import EmptyState from './common/EmptyState';
import SkeletonLoader, { SkeletonCard } from './common/SkeletonLoader';
import Tooltip from './common/Tooltip';
import { useNotification } from '../hooks/useNotification';
import Notification from './Notification';
import './TrainersList.css';

const TrainersList = ({ user }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [services, setServices] = useState([]);
  const [ratings, setRatings] = useState(null);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      const response = await getTrainers();
      setTrainers(response.data || []);
    } catch (err) {
      showNotification('Erro ao carregar personal trainers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewServices = async (trainer) => {
    try {
      const [servicesResponse, ratingsResponse] = await Promise.all([
        getTrainerServices(trainer.id),
        getTrainerRatings(trainer.id).catch(() => ({ data: { ratings: [], average: 0, total: 0 } }))
      ]);
      setServices(servicesResponse.data || []);
      setRatings(ratingsResponse.data);
      setSelectedTrainer(trainer);
      setShowServicesModal(true);
    } catch (err) {
      showNotification('Erro ao carregar serviços', 'error');
    }
  };

  const handleCreateAppointment = (trainerId) => {
    setShowServicesModal(false);
    navigate(`/client/appointments/create/${trainerId}`);
  };

  const handleCreateRequest = (trainerId) => {
    setShowServicesModal(false);
    navigate(`/client/requests/create/${trainerId}`);
  };

  const handleViewProfile = (trainerId) => {
    navigate(`/trainer/${trainerId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="stars">
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
      </div>
    );
  };

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="trainers-list-page">
        <div className="page-header">
          <h1>👥 Personal Trainers</h1>
        </div>
        <div className="trainers-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
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

      <div className="trainers-list-page">
        <div className="page-header">
          <div>
            <h1>👥 Personal Trainers Disponíveis</h1>
            <p>Encontre o personal trainer ideal para seus objetivos</p>
          </div>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nome, email ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="search-clear"
              onClick={() => setSearchTerm('')}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>

        {filteredTrainers.length === 0 ? (
          <EmptyState
            icon="👥"
            title={searchTerm ? "Nenhum trainer encontrado" : "Nenhum personal trainer cadastrado"}
            message={
              searchTerm
                ? "Tente ajustar os termos de busca"
                : "Ainda não há personal trainers cadastrados na plataforma"
            }
          />
        ) : (
          <div className="trainers-grid">
            {filteredTrainers.map((trainer, index) => (
              <div
                key={trainer.id}
                className="trainer-card-interactive"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="trainer-card-header">
                  <div className="trainer-avatar-large">
                    {trainer.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="trainer-info">
                    <h3>{trainer.name}</h3>
                    {trainer.city && (
                      <p className="trainer-location">📍 {trainer.city}</p>
                    )}
                  </div>
                </div>

                {trainer.bio && (
                  <p className="trainer-bio">{trainer.bio}</p>
                )}

                <div className="trainer-contact">
                  {trainer.email && (
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <span className="contact-text">{trainer.email}</span>
                    </div>
                  )}
                  {trainer.phone && (
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span className="contact-text">{trainer.phone}</span>
                    </div>
                  )}
                </div>

                {trainer.rating && (
                  <div className="trainer-rating">
                    {renderStars(trainer.rating)}
                    <span className="rating-text">
                      {trainer.rating?.toFixed(1) || '0.0'} ({trainer.rating_count || 0} avaliações)
                    </span>
                  </div>
                )}

                <div className="trainer-actions">
                  <Tooltip content="Ver perfil completo">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleViewProfile(trainer.id)}
                    >
                      Ver Perfil
                    </button>
                  </Tooltip>
                  <Tooltip content="Ver serviços disponíveis">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewServices(trainer)}
                    >
                      Ver Serviços
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Serviços */}
      {selectedTrainer && (
        <Modal
          isOpen={showServicesModal}
          onClose={() => {
            setShowServicesModal(false);
            setSelectedTrainer(null);
            setServices([]);
          }}
          title={`Serviços de ${selectedTrainer.name}`}
          size="large"
        >
          <div className="services-modal-content">
            {ratings && (
              <div className="trainer-summary">
                <div className="trainer-avatar-modal">
                  {selectedTrainer.name?.charAt(0).toUpperCase()}
                </div>
                <div className="trainer-summary-info">
                  <h3>{selectedTrainer.name}</h3>
                  {ratings.average > 0 && (
                    <div className="rating-summary">
                      {renderStars(ratings.average)}
                      <span>{ratings.average.toFixed(1)} ({ratings.total} avaliações)</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {services.length === 0 ? (
              <EmptyState
                icon="📋"
                title="Nenhum serviço disponível"
                message="Este personal trainer ainda não cadastrou serviços"
              />
            ) : (
              <div className="services-list-modal">
                {services.map((service) => (
                  <div key={service.id} className="service-card-modal">
                    <div className="service-header-modal">
                      <h4>{service.name}</h4>
                      <span className="service-price-modal">{formatPrice(service.price)}</span>
                    </div>
                    {service.description && (
                      <p className="service-description-modal">{service.description}</p>
                    )}
                    <div className="service-details-modal">
                      <span>⏱️ {service.duration} minutos</span>
                      {service.category && (
                        <span className="service-category-badge">{service.category}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="modal-actions-trainer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowServicesModal(false)}
              >
                Fechar
              </button>
              <Tooltip content="Agendar um horário específico com este trainer">
                <button
                  className="btn btn-primary"
                  onClick={() => handleCreateAppointment(selectedTrainer.id)}
                  disabled={services.length === 0}
                >
                  Fazer Agendamento
                </button>
              </Tooltip>
              <Tooltip content="Solicitar um serviço pontual">
                <button
                  className="btn btn-success"
                  onClick={() => handleCreateRequest(selectedTrainer.id)}
                  disabled={services.length === 0}
                >
                  Solicitar Serviço
                </button>
              </Tooltip>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TrainersList;





