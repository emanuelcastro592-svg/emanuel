import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile } from '../utils/api';
import { getUser as getCurrentUser } from '../utils/auth';
import Modal from './common/Modal';
import Tooltip from './common/Tooltip';
import ProgressIndicator from './common/ProgressIndicator';
import Notification from './Notification';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from './LoadingSpinner';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    avatar: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    } else {
      navigate('/login');
    }
  }, [currentUser]);

  useEffect(() => {
    if (formData.avatar) {
      setAvatarPreview(formData.avatar);
    } else if (user?.avatar) {
      setAvatarPreview(user.avatar);
    } else {
      setAvatarPreview(null);
    }
  }, [formData.avatar, user]);

  const loadUserProfile = async () => {
    try {
      const response = await getUserProfile();
      const userData = response.data;
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        address: userData.address || '',
        city: userData.city || '',
        state: userData.state || '',
        zip_code: userData.zip_code || '',
        avatar: userData.avatar || ''
      });
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      const userData = getCurrentUser();
      if (userData) {
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: userData.bio || '',
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          zip_code: userData.zip_code || '',
          avatar: userData.avatar || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Nome é obrigatório';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
        } else {
          delete newErrors.name;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email é obrigatório';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Email inválido';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (value && !/^[\d\s\(\)\-]+$/.test(value)) {
          newErrors.phone = 'Telefone inválido';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'zip_code':
        if (value && !/^\d{5}-?\d{3}$/.test(value.replace(/\D/g, ''))) {
          newErrors.zip_code = 'CEP inválido (formato: 00000-000)';
        } else {
          delete newErrors.zip_code;
        }
        break;
      case 'bio':
        if (value && value.length > 500) {
          newErrors.bio = 'Biografia deve ter no máximo 500 caracteres';
        } else {
          delete newErrors.bio;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatação automática
    if (name === 'phone') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      if (formattedValue.length === 14) formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (name === 'zip_code') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2');
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });

    // Validação em tempo real
    if (touched[name]) {
      validateField(name, formattedValue);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marcar todos os campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validar todos os campos
    let isValid = true;
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    if (!isValid) {
      showNotification('Por favor, corrija os erros no formulário', 'error');
      return;
    }

    setSaving(true);
    setSaveProgress(0);

    // Simular progresso
    const progressInterval = setInterval(() => {
      setSaveProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const response = await updateUserProfile(formData);
      setSaveProgress(100);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setEditing(false);
      setTouched({});
      showNotification('Perfil atualizado com sucesso!', 'success');
      setTimeout(() => {
        setSaveProgress(0);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setSaveProgress(0);
      showNotification(err.response?.data?.error || 'Erro ao salvar perfil', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando perfil..." />;
  }

  if (!user) {
    return <div>Usuário não encontrado</div>;
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
      <div className="user-profile-container">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {avatarPreview ? (
                <img src={avatarPreview} alt={user.name} onError={() => setAvatarPreview(null)} />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
              {editing && (
                <div className="avatar-edit-overlay">
                  <Tooltip content="Clique para alterar a URL do avatar">
                    <span className="avatar-edit-icon">📷</span>
                  </Tooltip>
                </div>
              )}
            </div>
            {editing && (
              <div className="avatar-url-input-container">
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="URL da imagem (opcional)"
                  className={`avatar-url-input ${errors.avatar ? 'input-error' : ''}`}
                />
                {errors.avatar && (
                  <span className="field-error">{errors.avatar}</span>
                )}
                {avatarPreview && (
                  <div className="avatar-preview-small">
                    <img src={avatarPreview} alt="Preview" onError={() => setAvatarPreview(null)} />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="profile-info-header">
            <h1>{user.name}</h1>
            <p className="user-role-badge">
              {user.role === 'trainer' ? '👨‍💼 Personal Trainer' : '👤 Cliente'}
            </p>
            {!editing && (
              <Tooltip content="Editar informações do perfil">
                <button onClick={() => setEditing(true)} className="btn-edit-profile">
                  ✏️ Editar Perfil
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {saving && (
          <div className="save-progress-container">
            <ProgressIndicator progress={saveProgress} showPercentage={true} />
          </div>
        )}

        {editing ? (
          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-section">
              <h3>Informações Pessoais</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    Nome Completo *
                    {errors.name && <span className="error-indicator">⚠️</span>}
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.name ? 'input-error' : ''}
                    required
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Email *
                    {errors.email && <span className="error-indicator">⚠️</span>}
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email ? 'input-error' : ''}
                    required
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">
                    Telefone
                    {errors.phone && <span className="error-indicator">⚠️</span>}
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="(11) 99999-9999"
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Sobre Você</h3>
              <div className="form-group">
                <label htmlFor="bio">
                  Biografia
                  {errors.bio && <span className="error-indicator">⚠️</span>}
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Conte um pouco sobre você..."
                  rows="4"
                  className={errors.bio ? 'input-error' : ''}
                  maxLength={500}
                />
                <div className="char-count">
                  {formData.bio.length}/500 caracteres
                </div>
                {errors.bio && <span className="field-error">{errors.bio}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>Endereço</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="address">Endereço</label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Rua, número, complemento"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">Cidade</label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">Estado</label>
                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zip_code">
                    CEP
                    {errors.zip_code && <span className="error-indicator">⚠️</span>}
                  </label>
                  <input
                    id="zip_code"
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="00000-000"
                    className={errors.zip_code ? 'input-error' : ''}
                    maxLength={9}
                  />
                  {errors.zip_code && <span className="field-error">{errors.zip_code}</span>}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={saving || Object.keys(errors).length > 0}>
                {saving ? (
                  <>
                    <span className="spinner-small"></span> Salvando...
                  </>
                ) : (
                  '💾 Salvar Alterações'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setErrors({});
                  setTouched({});
                  loadUserProfile();
                }}
                className="btn-cancel"
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="profile-section">
              <h3>Informações de Contato</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">📧 Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="info-item">
                    <span className="info-label">📱 Telefone:</span>
                    <span className="info-value">{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="info-item full-width">
                    <span className="info-label">📍 Endereço:</span>
                    <span className="info-value">
                      {user.address}
                      {user.city && `, ${user.city}`}
                      {user.state && ` - ${user.state}`}
                      {user.zip_code && ` ${user.zip_code}`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {user.bio && (
              <div className="profile-section">
                <h3>Sobre</h3>
                <p className="bio-text">{user.bio}</p>
              </div>
            )}

            <div className="profile-section">
              <h3>Estatísticas</h3>
              <div className="stats-grid">
                {user.role === 'trainer' ? (
                  <>
                    <div className="stat-card">
                      <div className="stat-number">-</div>
                      <div className="stat-label">Serviços</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">-</div>
                      <div className="stat-label">Agendamentos</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">-</div>
                      <div className="stat-label">Avaliações</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="stat-card">
                      <div className="stat-number">-</div>
                      <div className="stat-label">Agendamentos</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-number">-</div>
                      <div className="stat-label">Avaliações Feitas</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
