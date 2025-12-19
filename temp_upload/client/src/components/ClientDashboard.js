import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const ClientDashboard = ({ user }) => {
  return (
    <div className="container">
      <div className="dashboard-panel-header">
        <div className="panel-header-content">
          <h2>🏋️ Painel do Cliente</h2>
          <p>Gerencie seus treinos, encontre personal trainers e acompanhe seus agendamentos</p>
        </div>
      </div>
      
      <div className="dashboard-menu">
        <Link to="/client/trainers" className="menu-card menu-card-primary">
          <div className="menu-card-icon">👥</div>
          <div className="menu-card-content">
            <h3>Personal Trainers</h3>
            <p>Encontre e explore personal trainers disponíveis na plataforma</p>
            <span className="menu-card-action">Explorar →</span>
          </div>
        </Link>
        
        <Link to="/client/appointments" className="menu-card menu-card-secondary">
          <div className="menu-card-icon">📅</div>
          <div className="menu-card-content">
            <h3>Meus Agendamentos</h3>
            <p>Visualize, gerencie e acompanhe todos os seus agendamentos</p>
            <span className="menu-card-action">Ver Agendamentos →</span>
          </div>
        </Link>
        
        <Link to="/client/requests" className="menu-card menu-card-tertiary">
          <div className="menu-card-icon">🔔</div>
          <div className="menu-card-content">
            <h3>Minhas Solicitações</h3>
            <p>Visualize e acompanhe suas solicitações de serviços personalizados</p>
            <span className="menu-card-action">Ver Solicitações →</span>
          </div>
        </Link>
      </div>

      <div className="dashboard-info-section">
        <div className="info-card">
          <h4>💡 Dica</h4>
          <p>Use o menu lateral para navegar rapidamente entre as diferentes seções do seu painel.</p>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;






