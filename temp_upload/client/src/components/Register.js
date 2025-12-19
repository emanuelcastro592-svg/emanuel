import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/api';
import { getUser } from '../utils/auth';
import Navbar from './Navbar';
import Notification from './Notification';
import { useNotification } from '../hooks/useNotification';
import './Login.css';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  // Redirecionar se já estiver logado
  useEffect(() => {
    const user = getUser();
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validação básica no frontend
    if (!formData.name || !formData.email || !formData.password) {
      const errorMsg = 'Por favor, preencha todos os campos obrigatórios';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      const errorMsg = 'A senha deve ter pelo menos 6 caracteres';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      setLoading(false);
      return;
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      const errorMsg = 'Por favor, insira um email válido';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      setLoading(false);
      return;
    }

    try {
      console.log('Tentando registrar com dados:', { ...formData, password: '***' });
      const response = await register(formData);
      console.log('Resposta completa do registro:', response);
      console.log('Dados da resposta:', response.data);
      
      // Verificar se a resposta tem os dados esperados
      if (response && response.data) {
        const { user, token } = response.data;
        
        if (user && token) {
          console.log('Registro bem-sucedido!', { user, token: token.substring(0, 20) + '...' });
          showNotification('Conta criada com sucesso! Redirecionando...', 'success');
          setLoading(false);
          
          // Pequeno delay para mostrar a notificação antes de redirecionar
          setTimeout(() => {
            if (onLogin) {
              onLogin(user, token);
            }
            navigate('/dashboard');
          }, 1000);
        } else {
          console.error('Resposta incompleta - faltando user ou token', response.data);
          throw new Error('Resposta do servidor incompleta. Tente novamente.');
        }
      } else {
        console.error('Resposta inválida:', response);
        throw new Error('Resposta do servidor inválida. Tente novamente.');
      }
    } catch (err) {
      console.error('=== ERRO NO REGISTRO ===');
      console.error('Erro completo:', err);
      console.error('Erro response:', err.response);
      console.error('Erro request:', err.request);
      console.error('Erro message:', err.message);
      console.error('Erro config:', err.config);
      
      let errorMsg = 'Erro ao registrar';
      
      if (err.response) {
        // Erro com resposta do servidor (4xx, 5xx)
        const status = err.response.status;
        const data = err.response.data;
        
        console.error(`Erro HTTP ${status}:`, data);
        
        if (status === 400) {
          errorMsg = data?.error || data?.message || 'Dados inválidos. Verifique os campos preenchidos.';
        } else if (status === 409 || status === 403) {
          errorMsg = data?.error || data?.message || 'Este email já está cadastrado.';
        } else if (status === 500) {
          errorMsg = data?.error || 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          errorMsg = data?.error || data?.message || `Erro do servidor (${status})`;
        }
      } else if (err.request) {
        // Erro de conexão (sem resposta do servidor)
        console.error('Servidor não respondeu. Verifique:');
        console.error('1. O servidor está rodando? (npm run server ou node server/index.js)');
        console.error('2. A porta 5000 está livre?');
        console.error('3. A URL da API está correta?');
        errorMsg = 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando na porta 5000.';
      } else {
        // Outro erro (configuração, etc)
        errorMsg = err.message || 'Erro ao processar registro. Tente novamente.';
      }
      
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      setLoading(false);
    }
  };

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
      <div className="login-container fade-in">
        <div className="login-card scale-in">
          <h1>Registro</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className={focusedField === 'name' || formData.name ? 'label-focused' : ''}>
                Nome
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={error && !formData.name ? 'input-error' : ''}
                required
              />
            </div>
            <div className="form-group">
              <label className={focusedField === 'email' || formData.email ? 'label-focused' : ''}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={error && !formData.email ? 'input-error' : ''}
                required
              />
            </div>
            <div className="form-group">
              <label className={focusedField === 'password' || formData.password ? 'label-focused' : ''}>
                Senha
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={error && !formData.password ? 'input-error' : ''}
                required
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label className={focusedField === 'role' || formData.role ? 'label-focused' : ''}>
                Tipo de Conta
              </label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleChange}
                onFocus={() => setFocusedField('role')}
                onBlur={() => setFocusedField(null)}
                required
              >
                <option value="client">Cliente</option>
                <option value="trainer">Personal Trainer</option>
              </select>
            </div>
            <div className="form-group">
              <label className={focusedField === 'phone' || formData.phone ? 'label-focused' : ''}>
                Telefone (opcional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            {error && <div className="error slide-in">{error}</div>}
            <button type="submit" className="btn btn-primary btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span> Registrando...
                </>
              ) : (
                'Registrar'
              )}
            </button>
          </form>
          <p className="register-link">
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;


