import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrainer, getTrainerServices, createRequest } from '../utils/api';
import './CreateRequest.css';

const CreateRequest = ({ user }) => {
  const { trainerId } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    serviceId: '',
    requestedDateTime: '',
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [trainerId]);

  const loadData = async () => {
    try {
      const [trainerResponse, servicesResponse] = await Promise.all([
        getTrainer(trainerId),
        getTrainerServices(trainerId),
      ]);
      setTrainer(trainerResponse.data);
      setServices(servicesResponse.data);
    } catch (err) {
      setError('Erro ao carregar informações');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.serviceId) {
      setError('Selecione um serviço');
      return;
    }

    try {
      await createRequest({
        trainerId,
        serviceId: formData.serviceId,
        requestedDateTime: formData.requestedDateTime || null,
        notes: formData.notes,
      });
      navigate('/client/requests');
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar solicitação');
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <h2>Nova Solicitação de Serviço</h2>
      {trainer && (
        <div className="card trainer-info">
          <h3>Personal Trainer: {trainer.name}</h3>
          {trainer.email && <p>📧 {trainer.email}</p>}
          {trainer.phone && <p>📱 {trainer.phone}</p>}
        </div>
      )}

      {services.length === 0 ? (
        <div className="card">
          <p>Este personal trainer ainda não cadastrou serviços disponíveis.</p>
          <button onClick={() => navigate('/client/trainers')} className="btn btn-secondary">
            Voltar
          </button>
        </div>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Serviço *</label>
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um serviço</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.duration}min - R$ {parseFloat(service.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            {formData.serviceId && (
              <>
                {services.find(s => s.id === formData.serviceId)?.description && (
                  <div className="service-description">
                    <p><strong>Descrição:</strong> {services.find(s => s.id === formData.serviceId).description}</p>
                  </div>
                )}
              </>
            )}
            <div className="form-group">
              <label>Data e Hora Desejada (opcional)</label>
              <input
                type="datetime-local"
                name="requestedDateTime"
                value={formData.requestedDateTime}
                onChange={handleChange}
              />
              <small>Deixe em branco se não tiver preferência</small>
            </div>
            <div className="form-group">
              <label>Observações</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Informações adicionais sobre sua solicitação..."
              />
            </div>
            {error && <div className="error">{error}</div>}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Enviar Solicitação
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/client/requests')} 
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateRequest;







