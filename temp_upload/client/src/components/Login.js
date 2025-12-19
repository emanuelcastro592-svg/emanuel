import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { getUser } from '../utils/auth';
import Navbar from './Navbar';
import Notification from './Notification';
import { useNotification } from '../hooks/useNotification';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    // Validação básica
    if (!formData.email || !formData.password) {
      const errorMsg = 'Por favor, preencha todos os campos';
      setError(errorMsg);
      showNotification(errorMsg, 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await login(formData);
      showNotification('Login realizado com sucesso!', 'success');
      setTimeout(() => {
        onLogin(response.data.user, response.data.token);
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Erro no login:', err);
      let errorMsg = 'Erro ao fazer login';
      
      if (err.response) {
        // Erro com resposta do servidor
        errorMsg = err.response.data?.error || err.response.data?.message || 'Erro ao fazer login';
      } else if (err.request) {
        // Erro de conexão - servidor não respondeu
        errorMsg = 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando na porta 5000.';
      } else {
        // Outro erro
        errorMsg = err.message || 'Erro ao fazer login';
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
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
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
              />
            </div>
            {error && <div className="error slide-in">{error}</div>}
            <button type="submit" className="btn btn-primary btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span> Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
          <p className="register-link">
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;


