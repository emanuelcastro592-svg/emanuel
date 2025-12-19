import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { getUnreadCount } from '../utils/api';
import './Layout.css';

const Layout = ({ children, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (err) {
      // Ignorar erros
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  // Breadcrumb dinâmico baseado na rota
  const getBreadcrumb = () => {
    const path = location.pathname;
    const breadcrumbs = [{ label: 'FitBooking', path: '/' }];

    const routeMap = {
      '/dashboard': 'Dashboard',
      '/profile': 'Meu Perfil',
      '/trainer/services': 'Meus Serviços',
      '/trainer/appointments': 'Agendamentos',
      '/trainer/requests': 'Solicitações',
      '/client/trainers': 'Personal Trainers',
      '/client/appointments': 'Meus Agendamentos',
      '/client/requests': 'Minhas Solicitações',
      '/notifications': 'Notificações',
      '/client/appointments/create': 'Novo Agendamento',
      '/client/requests/create': 'Nova Solicitação'
    };

    // Adicionar página atual
    if (routeMap[path]) {
      breadcrumbs.push({ label: routeMap[path], path });
    } else {
      // Tentar extrair do path
      const segments = path.split('/').filter(Boolean);
      if (segments.length > 0) {
        const lastSegment = segments[segments.length - 1];
        // Remover IDs e formatar
        const formatted = lastSegment
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        breadcrumbs.push({ label: formatted || 'Página', path });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏋️</span>
            <span className="logo-text">FitBooking</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            {sidebarOpen && <span className="nav-text">Início</span>}
          </Link>
          
          <Link to="/trainers" className="nav-item">
            <span className="nav-icon">👥</span>
            {sidebarOpen && <span className="nav-text">Personal Trainers</span>}
          </Link>

          {user && (
            <Link to="/dashboard" className="nav-item nav-item-highlight">
              <span className="nav-icon">📊</span>
              {sidebarOpen && <span className="nav-text">Dashboard</span>}
            </Link>
          )}

          {user && (
            <Link to="/profile" className="nav-item">
              <span className="nav-icon">👤</span>
              {sidebarOpen && <span className="nav-text">Meu Perfil</span>}
            </Link>
          )}

          {user && (
            <>
              {user.role === 'client' ? (
                <>
                  <Link to="/client/appointments" className="nav-item">
                    <span className="nav-icon">📅</span>
                    {sidebarOpen && <span className="nav-text">Meus Agendamentos</span>}
                  </Link>
                  <Link to="/client/requests" className="nav-item">
                    <span className="nav-icon">🔔</span>
                    {sidebarOpen && <span className="nav-text">Minhas Solicitações</span>}
                  </Link>
                  <Link to="/notifications" className="nav-item">
                    <span className="nav-icon">🔔</span>
                    {sidebarOpen && (
                      <span className="nav-text">
                        Notificações
                        {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/trainer/services" className="nav-item">
                    <span className="nav-icon">📋</span>
                    {sidebarOpen && <span className="nav-text">Meus Serviços</span>}
                  </Link>
                  <Link to="/trainer/appointments" className="nav-item">
                    <span className="nav-icon">📅</span>
                    {sidebarOpen && <span className="nav-text">Agendamentos</span>}
                  </Link>
                  <Link to="/trainer/requests" className="nav-item">
                    <span className="nav-icon">🔔</span>
                    {sidebarOpen && <span className="nav-text">Solicitações</span>}
                  </Link>
                  <Link to="/notifications" className="nav-item">
                    <span className="nav-icon">🔔</span>
                    {sidebarOpen && (
                      <span className="nav-text">
                        Notificações
                        {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
                      </span>
                    )}
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {user && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <div className="user-details">
                  <div className="user-name">{user.name}</div>
                  <div className="user-role">
                    {user.role === 'trainer' ? 'Personal Trainer' : 'Cliente'}
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <span className="nav-icon">🚪</span>
              {sidebarOpen && <span>Sair</span>}
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-content">
            <div className="breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && <span className="breadcrumb-separator">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="breadcrumb-current">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="breadcrumb-link">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="top-bar-actions">
              {user && (
                <div className="top-bar-user-info">
                  <span className="user-greeting">Olá, {user.name}</span>
                </div>
              )}
              {!user && (
                <>
                  <Link to="/login" className="btn-topbar">Entrar</Link>
                  <Link to="/register" className="btn-topbar btn-primary">Cadastrar</Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

