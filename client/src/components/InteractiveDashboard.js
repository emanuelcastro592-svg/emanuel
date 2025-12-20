import React, { useState, useEffect } from 'react';
import { getStats, getClientAppointments, getTrainerAppointments } from '../utils/api';
import { getUser } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';
import './InteractiveDashboard.css';

const InteractiveDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadDashboardData();
  }, [user, selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, appointmentsResponse] = await Promise.all([
        getStats().catch(() => ({ data: {} })),
        user.role === 'client' 
          ? getClientAppointments()
          : getTrainerAppointments()
      ]);

      setStats(statsResponse.data);
      setAppointments(appointmentsResponse.data || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estatísticas
  const completedCount = appointments.filter(apt => apt.status === 'completed').length;
  const pendingCount = appointments.filter(apt => apt.status === 'pending').length;
  const confirmedCount = appointments.filter(apt => apt.status === 'confirmed').length;
  const cancelledCount = appointments.filter(apt => apt.status === 'cancelled').length;
  const totalCount = appointments.length;

  // Calcular percentuais para gráfico
  const pendingPercent = totalCount > 0 ? (pendingCount / totalCount) * 100 : 0;
  const confirmedPercent = totalCount > 0 ? (confirmedCount / totalCount) * 100 : 0;
  const completedPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const cancelledPercent = totalCount > 0 ? (cancelledCount / totalCount) * 100 : 0;

  // Agendamentos próximos com paginação
  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'pending' || apt.status === 'confirmed')
    .sort((a, b) => new Date(a.date_time) - new Date(b.date_time));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = upcomingAppointments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(upcomingAppointments.length / itemsPerPage);

  // Calcular dados para gráfico de linha (últimos 7 dias)
  const getLast7DaysData = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = appointments.filter(apt => {
        const aptDate = new Date(apt.date_time).toISOString().split('T')[0];
        return aptDate === dateStr;
      }).length;
      days.push({ date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }), count });
    }
    return days;
  };

  const weeklyData = getLast7DaysData();
  const maxCount = Math.max(...weeklyData.map(d => d.count), 1);

  if (loading) {
    return <LoadingSpinner message="Carregando dashboard..." />;
  }

  return (
    <div className="interactive-dashboard">
      <div className="dashboard-header-interactive">
        <div>
          <h1>📊 Dashboard</h1>
          <p className="dashboard-subtitle">Visão geral das suas atividades e estatísticas</p>
        </div>
        <div className="period-selector">
          <button
            className={selectedPeriod === 'week' ? 'active' : ''}
            onClick={() => setSelectedPeriod('week')}
          >
            Semana
          </button>
          <button
            className={selectedPeriod === 'month' ? 'active' : ''}
            onClick={() => setSelectedPeriod('month')}
          >
            Mês
          </button>
          <button
            className={selectedPeriod === 'year' ? 'active' : ''}
            onClick={() => setSelectedPeriod('year')}
          >
            Ano
          </button>
        </div>
      </div>

      {/* Cards de Estatísticas Principais */}
      <div className="stats-cards-grid">
        <div className="stat-card-interactive stat-card-primary">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">📅</div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{totalCount}</div>
            <div className="stat-label">Total de Agendamentos</div>
            <div className="stat-trend">
              <span className="trend-up">↗ +12%</span> vs período anterior
            </div>
          </div>
        </div>

        <div className="stat-card-interactive stat-card-warning">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">⏳</div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{pendingCount}</div>
            <div className="stat-label">Pendentes</div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pendingPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card-interactive stat-card-success">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">✅</div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{confirmedCount}</div>
            <div className="stat-label">Confirmados</div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill success" style={{ width: `${confirmedPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="stat-card-interactive stat-card-info">
          <div className="stat-icon-wrapper">
            <div className="stat-icon">🎯</div>
          </div>
          <div className="stat-content">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Concluídos</div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill info" style={{ width: `${completedPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos e Visualizações */}
      <div className="charts-grid">
        {/* Gráfico de Barras - Distribuição por Status */}
        <div className="dashboard-section chart-section">
          <div className="section-header">
            <h2>📊 Distribuição por Status</h2>
            <span className="section-badge">{totalCount} total</span>
          </div>
          <div className="bar-chart">
            <div className="bar-chart-item">
              <div className="bar-label">Pendentes</div>
              <div className="bar-container">
                <div className="bar-fill warning" style={{ width: `${pendingPercent}%` }}>
                  <span className="bar-value">{pendingCount}</span>
                </div>
              </div>
            </div>
            <div className="bar-chart-item">
              <div className="bar-label">Confirmados</div>
              <div className="bar-container">
                <div className="bar-fill success" style={{ width: `${confirmedPercent}%` }}>
                  <span className="bar-value">{confirmedCount}</span>
                </div>
              </div>
            </div>
            <div className="bar-chart-item">
              <div className="bar-label">Concluídos</div>
              <div className="bar-container">
                <div className="bar-fill info" style={{ width: `${completedPercent}%` }}>
                  <span className="bar-value">{completedCount}</span>
                </div>
              </div>
            </div>
            {cancelledCount > 0 && (
              <div className="bar-chart-item">
                <div className="bar-label">Cancelados</div>
                <div className="bar-container">
                  <div className="bar-fill danger" style={{ width: `${cancelledPercent}%` }}>
                    <span className="bar-value">{cancelledCount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Linha - Últimos 7 dias */}
        <div className="dashboard-section chart-section">
          <div className="section-header">
            <h2>📈 Tendência (7 dias)</h2>
            <span className="section-badge">Última semana</span>
          </div>
          <div className="line-chart">
            <div className="line-chart-bars">
              {weeklyData.map((day, index) => (
                <div key={index} className="line-chart-bar">
                  <div 
                    className="line-chart-bar-fill" 
                    style={{ height: `${(day.count / maxCount) * 100}%` }}
                    title={`${day.count} agendamentos`}
                  >
                    <span className="bar-count">{day.count}</span>
                  </div>
                  <div className="line-chart-label">{day.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabela Interativa de Agendamentos */}
      <div className="dashboard-section table-section">
        <div className="section-header">
          <h2>📋 Próximos Agendamentos</h2>
          <div className="table-controls">
            <span className="table-info">
              Mostrando {startIndex + 1}-{Math.min(endIndex, upcomingAppointments.length)} de {upcomingAppointments.length}
            </span>
          </div>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>{user.role === 'client' ? 'Personal Trainer' : 'Cliente'}</th>
                <th>Status</th>
                <th>Duração</th>
                <th>Local</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data-cell">
                    <div className="no-data">
                      <span className="no-data-icon">📭</span>
                      <p>Nenhum agendamento próximo</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedAppointments.map((apt) => (
                  <tr key={apt.id} className="table-row">
                    <td>
                      <div className="table-cell-date">
                        {new Date(apt.date_time).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                        <span className="table-cell-time">
                          {new Date(apt.date_time).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-user">
                        <div className="user-avatar-small">
                          {(user.role === 'client' ? apt.trainer_name : apt.client_name)?.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.role === 'client' ? apt.trainer_name : apt.client_name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${apt.status}`}>
                        {apt.status === 'pending' && '⏳ Pendente'}
                        {apt.status === 'confirmed' && '✅ Confirmado'}
                        {apt.status === 'completed' && '🎯 Concluído'}
                        {apt.status === 'cancelled' && '❌ Cancelado'}
                      </span>
                    </td>
                    <td>{apt.duration || 'N/A'} min</td>
                    <td>
                      <span className="table-cell-location">
                        {apt.location || 'Não informado'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>
            <div className="pagination-info">
              Página {currentPage} de {totalPages}
            </div>
            <button 
              className="pagination-btn" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima →
            </button>
          </div>
        )}
      </div>

      {/* Estatísticas do Sistema */}
      {stats && (
        <div className="dashboard-sections">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>🌐 Estatísticas do Sistema</h2>
            </div>
            <div className="system-stats-grid">
              <div className="system-stat-card">
                <div className="system-stat-icon">👥</div>
                <div className="system-stat-content">
                  <div className="system-stat-value">{stats.users?.count || 0}</div>
                  <div className="system-stat-label">Total de Usuários</div>
                </div>
              </div>
              <div className="system-stat-card">
                <div className="system-stat-icon">💪</div>
                <div className="system-stat-content">
                  <div className="system-stat-value">{stats.trainers?.count || 0}</div>
                  <div className="system-stat-label">Personal Trainers</div>
                </div>
              </div>
              <div className="system-stat-card">
                <div className="system-stat-icon">👤</div>
                <div className="system-stat-content">
                  <div className="system-stat-value">{stats.clients?.count || 0}</div>
                  <div className="system-stat-label">Clientes</div>
                </div>
              </div>
              <div className="system-stat-card">
                <div className="system-stat-icon">📋</div>
                <div className="system-stat-content">
                  <div className="system-stat-value">{stats.services?.count || 0}</div>
                  <div className="system-stat-label">Serviços Cadastrados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveDashboard;






