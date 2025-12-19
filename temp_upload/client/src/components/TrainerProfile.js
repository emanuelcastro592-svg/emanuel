import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrainer, getTrainerServices, createAppointment, getTrainerRatings } from '../utils/api';
import { getUser } from '../utils/auth';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';
import Modal from './common/Modal';
import Tooltip from './common/Tooltip';
import Notification from './Notification';
import Ratings from './Ratings';
import { useNotification } from '../hooks/useNotification';
import './TrainerProfile.css';

const TrainerProfile = () => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [services, setServices] = useState([]);
  const [trainerRatings, setTrainerRatings] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showPreview, setShowPreview] = useState(false);
  const [clientData, setClientData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const user = getUser();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    loadData();
  }, [trainerId]);

  const loadData = async () => {
    try {
      const [trainerResponse, servicesResponse, ratingsResponse] = await Promise.all([
        getTrainer(trainerId),
        getTrainerServices(trainerId),
        getTrainerRatings(trainerId).catch(() => ({ data: { ratings: [], average: 0, total: 0 } }))
      ]);
      setTrainer(trainerResponse.data);
      setServices(servicesResponse.data);
      setTrainerRatings(ratingsResponse.data);
      if (servicesResponse.data.length > 0) {
        setSelectedService(servicesResponse.data[0]);
      }
      // Gerar horários disponíveis
      generateAvailableTimes();
    } catch (err) {
      setError('Erro ao carregar informações do trainer');
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableTimes = () => {
    // Horários padrão - podem ser configurados pelo trainer no futuro
    const defaultTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    setAvailableTimes(defaultTimes);
  };

  const renderRatingStars = (rating) => {
    return '★'.repeat(Math.min(rating, 5)) + '☆'.repeat(Math.max(0, 5 - rating));
  };

  const generateCalendar = () => {
    const days = [];
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const today = new Date();
    
    // Preencher dias do mês anterior (se necessário)
    const startDay = firstDay.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth, -i);
      days.push({ date, currentMonth: false });
    }
    
    // Dias do mês atual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      days.push({ date, currentMonth: true, isToday });
    }
    
    return { days, monthName: monthNames[currentMonth], year: currentYear };
  };

  const handleMonthChange = (direction) => {
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      const today = new Date();
      const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const newDate = new Date(currentYear, currentMonth - 1, 1);
      
      if (newDate >= minDate) {
        if (currentMonth === 0) {
          setCurrentMonth(11);
          setCurrentYear(currentYear - 1);
        } else {
          setCurrentMonth(currentMonth - 1);
        }
      }
    }
  };

  const handleDateSelect = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    
    if (selected >= today) {
      setSelectedDate(date);
      setSelectedTime(null); // Reset time when date changes
      showNotification('Data selecionada! Agora escolha um horário', 'info', 2000);
    } else {
      showNotification('Não é possível selecionar datas passadas', 'warning');
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    if (selectedDate && selectedService) {
      setShowPreview(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    if (!user || user.role !== 'client') {
      showNotification('Faça login como cliente para agendar', 'warning');
      setTimeout(() => navigate('/login'), 1500);
      setSubmitting(false);
      return;
    }

    if (!selectedService || !selectedDate || !selectedTime) {
      setError('Selecione serviço, data e horário');
      showNotification('Preencha todos os campos obrigatórios', 'error');
      setSubmitting(false);
      return;
    }

    try {
      const dateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      await createAppointment({
        trainerId,
        dateTime: dateTime.toISOString(),
        duration: selectedService.duration,
        notes: clientData.notes
      });

      showNotification('Agendamento criado com sucesso!', 'success');
      setTimeout(() => {
        navigate('/client/appointments');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erro ao criar agendamento';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      setSubmitting(false);
    }
  };


  if (loading) {
    return <LoadingSpinner message="Carregando perfil do trainer..." />;
  }

  if (!trainer) {
    return (
      <div className="error-container">
        <div className="error-message-large">Trainer não encontrado</div>
      </div>
    );
  }

  const calendar = generateCalendar();
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <>
      <Navbar />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={hideNotification}
        />
      )}
      <div className="trainer-profile-container fade-in">
      <div className="trainer-profile-content">
        {/* Left Panel - Trainer Info */}
        <div className="trainer-info-panel">
          <div className="trainer-header">
            <div className="trainer-avatar-large">
              {trainer.name.charAt(0).toUpperCase()}
            </div>
            <h2>{trainer.name}</h2>
            {trainer.bio && (
              <p className="trainer-specialty">{trainer.bio}</p>
            )}
            {trainerRatings && (
              <div className="trainer-rating-large">
                <span className="stars-large">{renderRatingStars(Math.round(trainerRatings.average || 0))}</span>
                <span>{trainerRatings.average?.toFixed(1) || '0.0'} ({trainerRatings.total || 0} {trainerRatings.total === 1 ? 'avaliação' : 'avaliações'})</span>
              </div>
            )}
          </div>

          <div className="trainer-contact">
            {trainer.phone && <p>📱 {trainer.phone}</p>}
            {trainer.email && <p>📧 {trainer.email}</p>}
            {trainer.address && (
              <p>📍 {trainer.address}{trainer.city && `, ${trainer.city}`}{trainer.state && ` - ${trainer.state}`}</p>
            )}
          </div>

          {trainer.bio && (
            <div className="trainer-description">
              <p>{trainer.bio}</p>
            </div>
          )}

          <div className="services-section">
            <h3>Serviços Disponíveis</h3>
            <div className="services-list">
                {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`service-item ${selectedService?.id === service.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedService(service);
                    showNotification(`Serviço "${service.name}" selecionado`, 'success', 2000);
                  }}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="service-header">
                    <h4>{service.name}</h4>
                    <span className="service-price">R$ {parseFloat(service.price).toFixed(2)}</span>
                  </div>
                  <p className="service-duration">{service.duration} minutos</p>
                  {service.description && (
                    <p className="service-description">{service.description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Categorias de Preço */}
            <div className="price-categories-section">
              <h3>Categorias de Preço</h3>
              <div className="price-categories-grid">
                <div className="price-category-card price-category-basic">
                  <div className="price-category-icon">⭐</div>
                  <h4>Básico</h4>
                  <div className="price-category-price">R$ 50,00</div>
                  <p className="price-category-description">Plano essencial para iniciantes</p>
                </div>
                
                <div className="price-category-card price-category-intermediate">
                  <div className="price-category-icon">⭐⭐</div>
                  <h4>Intermediário</h4>
                  <div className="price-category-price">R$ 80,00</div>
                  <p className="price-category-description">Ideal para quem já tem experiência</p>
                </div>
                
                <div className="price-category-card price-category-premium">
                  <div className="price-category-icon">👑</div>
                  <h4>Premium</h4>
                  <div className="price-category-price">R$ 120,00</div>
                  <p className="price-category-description">Acompanhamento completo e personalizado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Booking */}
        <div className="booking-panel">
          <h3>Selecione Data e Horário</h3>
          
          <div className="calendar-container">
            <div className="calendar-header">
              <Tooltip content="Mês anterior">
                <button
                  className="calendar-nav-btn"
                  onClick={() => handleMonthChange('prev')}
                  disabled={new Date(currentYear, currentMonth - 1, 1) < new Date(new Date().getFullYear(), new Date().getMonth(), 1)}
                >
                  ‹
                </button>
              </Tooltip>
              <span className="calendar-month-year">
                {calendar.monthName} {calendar.year}
              </span>
              <Tooltip content="Próximo mês">
                <button
                  className="calendar-nav-btn"
                  onClick={() => handleMonthChange('next')}
                >
                  ›
                </button>
              </Tooltip>
            </div>
            <div className="calendar-weekdays">
              {weekDays.map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {calendar.days.map((day, index) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const dayDate = new Date(day.date);
                dayDate.setHours(0, 0, 0, 0);
                
                const isSelected = selectedDate && 
                  dayDate.toDateString() === new Date(selectedDate).toDateString();
                const isPast = dayDate < today;
                const isToday = day.isToday;
                
                return (
                  <Tooltip
                    key={index}
                    content={
                      isPast
                        ? 'Data passada'
                        : isToday
                        ? 'Hoje'
                        : `Selecionar ${day.date.toLocaleDateString('pt-BR')}`
                    }
                  >
                    <div
                      className={`calendar-day ${!day.currentMonth ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''} ${isToday ? 'today' : ''}`}
                      onClick={() => day.currentMonth && !isPast && handleDateSelect(day.date)}
                    >
                      {day.date.getDate()}
                      {isToday && <span className="today-indicator"></span>}
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="times-section">
              <h4>
                Horários Disponíveis
                <span className="selected-date-text">
                  {new Date(selectedDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </span>
              </h4>
              <div className="times-grid">
                {availableTimes.map((time) => (
                  <Tooltip key={time} content={`Selecionar ${time}`}>
                    <button
                      className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                      {selectedTime === time && <span className="check-icon">✓</span>}
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && selectedService && (
            <div className="booking-preview">
              <h4>📋 Resumo do Agendamento</h4>
              <div className="preview-content">
                <div className="preview-item">
                  <span className="preview-label">Serviço:</span>
                  <span className="preview-value">{selectedService.name}</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Data/Hora:</span>
                  <span className="preview-value">
                    {new Date(selectedDate).toLocaleDateString('pt-BR')} às {selectedTime}
                  </span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Duração:</span>
                  <span className="preview-value">{selectedService.duration} minutos</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Valor:</span>
                  <span className="preview-value price">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(selectedService.price)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-form">
            <h4>Seus Dados</h4>
            {user && user.role === 'client' ? (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={user.name}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={user.email}
                    disabled
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={clientData.name}
                    onChange={(e) => setClientData({...clientData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={clientData.email}
                    onChange={(e) => setClientData({...clientData, email: e.target.value})}
                    required
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <input
                type="tel"
                placeholder="Telefone"
                value={clientData.phone}
                onChange={(e) => setClientData({...clientData, phone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Observações (opcional)"
                value={clientData.notes}
                onChange={(e) => setClientData({...clientData, notes: e.target.value})}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            {!user || user.role !== 'client' ? (
              <button type="button" onClick={() => navigate('/login')} className="btn-booking">
                Faça login para agendar
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-booking" 
                disabled={!selectedService || !selectedDate || !selectedTime || submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-small"></span> Processando...
                  </>
                ) : (
                  'Confirmar Agendamento'
                )}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="ratings-section-wrapper">
        <Ratings trainerId={trainerId} />
      </div>
    </div>
    </>
  );
};

export default TrainerProfile;

