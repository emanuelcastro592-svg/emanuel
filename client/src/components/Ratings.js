import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTrainerRatings, createRating } from '../utils/api';
import { getUser } from '../utils/auth';
import Modal from './common/Modal';
import EmptyState from './common/EmptyState';
import SkeletonLoader from './common/SkeletonLoader';
import Tooltip from './common/Tooltip';
import Notification from './Notification';
import { useNotification } from '../hooks/useNotification';
import './Ratings.css';

const InteractiveStarRating = ({ rating, onRatingChange, interactive = false, size = 'md' }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleStarHover = (value) => {
    if (interactive) {
      setHoveredRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div 
      className={`star-rating star-rating-${size} ${interactive ? 'interactive' : ''}`}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= displayRating ? 'filled' : ''} ${interactive ? 'clickable' : ''}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          disabled={!interactive}
          aria-label={`${star} estrela${star > 1 ? 's' : ''}`}
        >
          <span className="star-icon">★</span>
          {interactive && (
            <span className="star-tooltip">{star} {star === 1 ? 'estrela' : 'estrelas'}</span>
          )}
        </button>
      ))}
      {interactive && rating > 0 && (
        <span className="rating-preview">
          {rating === 1 && 'Péssimo'}
          {rating === 2 && 'Ruim'}
          {rating === 3 && 'Regular'}
          {rating === 4 && 'Bom'}
          {rating === 5 && 'Excelente'}
        </span>
      )}
    </div>
  );
};

const Ratings = ({ trainerId, appointmentId, onRatingSubmitted }) => {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const user = getUser();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (trainerId) {
      loadRatings();
    }
  }, [trainerId]);

  const loadRatings = async () => {
    try {
      const response = await getTrainerRatings(trainerId);
      setRatings(response.data.ratings || []);
      setAverage(response.data.average || 0);
      setTotalRatings(response.data.total || 0);
    } catch (err) {
      showNotification('Erro ao carregar avaliações', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      showNotification('Faça login para avaliar', 'warning');
      return;
    }

    if (formData.rating === 0) {
      showNotification('Por favor, selecione uma avaliação', 'warning');
      return;
    }

    try {
      await createRating({
        trainerId,
        appointmentId,
        rating: formData.rating,
        comment: formData.comment
      });
      
      showNotification('Avaliação enviada com sucesso!', 'success');
      setShowFormModal(false);
      setFormData({ rating: 0, comment: '' });
      loadRatings();
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (err) {
      showNotification(err.response?.data?.error || 'Erro ao enviar avaliação', 'error');
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(rating => {
      distribution[rating.rating] = (distribution[rating.rating] || 0) + 1;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  if (loading) {
    return (
      <div className="ratings-loading">
        <SkeletonLoader type="text" width="200px" height="20px" count={3} />
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
      
      <div className="ratings-section">
        <div className="ratings-header">
          <div className="ratings-summary">
            <div className="average-rating-card">
              <div className="average-number-large">{average.toFixed(1)}</div>
              <InteractiveStarRating rating={Math.round(average)} size="lg" />
              <div className="total-ratings-text">
                {totalRatings} {totalRatings === 1 ? 'avaliação' : 'avaliações'}
              </div>
            </div>
            
            {totalRatings > 0 && (
              <div className="rating-distribution">
                <h4>Distribuição de Avaliações</h4>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = distribution[star] || 0;
                  const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                  return (
                    <div key={star} className="distribution-row">
                      <div className="distribution-label">
                        <span>{star}★</span>
                      </div>
                      <div className="distribution-bar-container">
                        <div 
                          className="distribution-bar"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="distribution-count">{count}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {user && user.role === 'client' && (
            <Tooltip content="Avaliar este personal trainer">
              <button 
                onClick={() => setShowFormModal(true)} 
                className="btn btn-primary btn-rate"
              >
                ⭐ Avaliar
              </button>
            </Tooltip>
          )}
        </div>

        <div className="ratings-list">
          {ratings.length === 0 ? (
            <EmptyState
              icon="⭐"
              title="Nenhuma avaliação ainda"
              message="Seja o primeiro a avaliar este personal trainer!"
            />
          ) : (
            ratings.map((rating, index) => (
              <div 
                key={rating.id} 
                className="rating-item-interactive"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="rating-header">
                  <div className="rating-user">
                    <div className="user-avatar-small">
                      {rating.client_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="user-name">{rating.client_name || 'Anônimo'}</div>
                      <div className="rating-date">
                        {new Date(rating.created_at).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <InteractiveStarRating rating={rating.rating} size="sm" />
                </div>
                {rating.comment && (
                  <div className="rating-comment">{rating.comment}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Avaliação */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setFormData({ rating: 0, comment: '' });
        }}
        title="Avaliar Personal Trainer"
        size="medium"
      >
        <form onSubmit={handleSubmit} className="rating-form-modal">
          <div className="form-group">
            <label className="rating-label">
              Sua Avaliação *
              {formData.rating === 0 && <span className="error-indicator">⚠️</span>}
            </label>
            <div className="rating-input-container">
              <InteractiveStarRating
                rating={formData.rating}
                onRatingChange={(rating) => setFormData({...formData, rating})}
                interactive={true}
                size="lg"
              />
              {formData.rating > 0 && (
                <div className="rating-feedback">
                  {formData.rating === 1 && '😞 Péssimo'}
                  {formData.rating === 2 && '😐 Ruim'}
                  {formData.rating === 3 && '😊 Regular'}
                  {formData.rating === 4 && '😄 Bom'}
                  {formData.rating === 5 && '🤩 Excelente'}
                </div>
              )}
            </div>
            {formData.rating === 0 && (
              <span className="field-error">Por favor, selecione uma avaliação</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="comment">Comentário (opcional)</label>
            <textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              placeholder="Compartilhe sua experiência com este personal trainer..."
              rows="4"
              className="rating-comment-input"
            />
            <div className="char-count">
              {formData.comment.length}/500 caracteres
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowFormModal(false);
                setFormData({ rating: 0, comment: '' });
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formData.rating === 0}
            >
              Enviar Avaliação
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Ratings;





