import React from 'react';
import { Link } from 'react-router-dom';
import TrainerDashboard from './TrainerDashboard';
import ClientDashboard from './ClientDashboard';
import InteractiveDashboard from './InteractiveDashboard';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard">
      <InteractiveDashboard user={user} />
      <div className="dashboard-content">
        {user.role === 'trainer' ? (
          <TrainerDashboard user={user} />
        ) : (
          <ClientDashboard user={user} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;


