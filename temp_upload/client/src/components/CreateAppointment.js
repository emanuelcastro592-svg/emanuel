import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrainer, createAppointment } from '../utils/api';
import { useNotification } from '../hooks/useNotification';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';
import './CreateAppointment.css';

const CreateAppointment = ({ user }) => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dateTime: '',
    duration: '',
    location: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    loadTrainer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId]);

  const loadTrainer = async () => {
    try {
      const response = await getTrainer(trainerId);
      setTrainer(response.data);
    } catch (err) {
      showNotification('Erro ao carregar informações do trainer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'dateTime':
        if (!value) {
          newErrors.dateTime = 'Data e hora são obrigatórias';
        } else {
          const selectedDate = new Date(value);
          const now = new Date();
          if (selectedDate <= now) {
            newErrors.dateTime = 'A data deve ser futura';
          } else {
            delete newErrors.dateTime;
          }
        }
        break;
      case 'duration':
        if (!value) {
          newErrors.duration = 'Duração é obrigatória';
        } else if (parseInt(value) < 15) {
          newErrors.duration = 'Duração mínima é 15 minutos';
        } else if (parseInt(value) > 480) {
          newErrors.duration = 'Duração máxima é 8 horas';
        } else {
          delete newErrors.duration;
        }
        break;
      default:
        delete newErrors[name];
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
    
    // Validação em tempo real
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    validateField(e.target.name, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos os campos
    const isValid = 
      validateField('dateTime', formData.dateTime) &&
      validateField('duration', formData.duration);
    
    if (!isValid) {
      showNotification('Por favor, corrija os erros no formulário', 'error');
      return;
    }

    setSubmitting(true);

    try {
      await createAppointment({
        trainerId,
        dateTime: formData.dateTime,
        duration: parseInt(formData.duration),
        location: formData.location,
        notes: formData.notes,
      });
      showNotification('Agendamento criado com sucesso!', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      showNotification(err.response?.data?.error || 'Erro ao criar agendamento', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando informações do trainer..." />;
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
      <div className="create-appointment-container">
        <div className="page-header">
          <h1>Novo Agendamento</h1>
          <p>Preencha os dados abaixo para agendar seu treino</p>
        </div>

        {trainer && (
          <div className="trainer-card-info">
            <div className="trainer-avatar-mini">
              {trainer.name.charAt(0).toUpperCase()}
            </div>
            <div className="trainer-details-mini">
              <h3>{trainer.name}</h3>
              {trainer.email && <p>📧 {trainer.email}</p>}
              {trainer.phone && <p>📱 {trainer.phone}</p>}
              {trainer.rating && (
                <div className="trainer-rating-mini">
                  ⭐ {trainer.rating.toFixed(1)} ({trainer.rating_count || 0} avaliações)
                </div>
              )}
            </div>
          </div>
        )}

        <div className="form-card">
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label htmlFor="dateTime">
                Data e Hora * 
                {errors.dateTime && <span className="error-indicator">⚠️</span>}
              </label>
              <input
                id="dateTime"
                type="datetime-local"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.dateTime ? 'error' : ''}
                required
              />
              {errors.dateTime && <span className="field-error">{errors.dateTime}</span>}
            </div>

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
                onBlur={handleBlur}
                className={errors.duration ? 'error' : ''}
                min="15"
                max="480"
                step="15"
                placeholder="Ex: 60"
                required
              />
              {errors.duration && <span className="field-error">{errors.duration}</span>}
              <small className="field-hint">Mínimo: 15min | Máximo: 8h</small>
            </div>

            <div className="form-group">
              <label htmlFor="location">Local (opcional)</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Academia XYZ, Rua ABC, 123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Observações</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Informações adicionais sobre o agendamento..."
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={submitting || Object.keys(errors).length > 0}
              >
                {submitting ? '⏳ Criando...' : '✅ Criar Agendamento'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAppointment;



