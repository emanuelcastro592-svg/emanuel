import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const TrainerDashboard = ({ user }) => {
  return (
    <div className="container">
      <div className="dashboard-panel-header">
        <div className="panel-header-content">
          <h2>💪 Painel do Personal Trainer</h2>
          <p>Gerencie seus serviços, agendamentos, solicitações e acompanhe seu desempenho</p>
        </div>
      </div>
      
      <div className="dashboard-menu">
        <Link to="/trainer/services" className="menu-card menu-card-primary">
          <div className="menu-card-icon">📋</div>
          <div className="menu-card-content">
            <h3>Meus Serviços</h3>
            <p>Gerencie os serviços que você oferece, defina preços e disponibilidade</p>
            <span className="menu-card-action">Gerenciar Serviços →</span>
          </div>
        </Link>
        
        <Link to="/trainer/appointments" className="menu-card menu-card-secondary">
          <div className="menu-card-icon">📅</div>
          <div className="menu-card-content">
            <h3>Agendamentos</h3>
            <p>Visualize, confirme e gerencie todos os seus agendamentos</p>
            <span className="menu-card-action">Ver Agendamentos →</span>
          </div>
        </Link>
        
        <Link to="/trainer/requests" className="menu-card menu-card-tertiary">
          <div className="menu-card-icon">🔔</div>
          <div className="menu-card-content">
            <h3>Solicitações</h3>
            <p>Gerencie solicitações pontuais de serviços dos seus clientes</p>
            <span className="menu-card-action">Ver Solicitações →</span>
          </div>
        </Link>
      </div>

      <div className="dashboard-info-section">
        <div className="info-card">
          <h4>💡 Dica</h4>
          <p>Mantenha seus serviços atualizados e responda rapidamente às solicitações para melhorar sua reputação na plataforma.</p>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;








