import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TrainerDashboard from './components/TrainerDashboard';
import ClientDashboard from './components/ClientDashboard';
import TrainerProfile from './components/TrainerProfile';
import ServicesManagement from './components/ServicesManagement';
import AppointmentsList from './components/AppointmentsList';
import RequestsList from './components/RequestsList';
import CreateAppointment from './components/CreateAppointment';
import CreateRequest from './components/CreateRequest';
import TrainersList from './components/TrainersList';
import Notifications from './components/Notifications';
import Ratings from './components/Ratings';
import UserProfile from './components/UserProfile';
import { getAuthToken, getUser } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const userData = getUser();
    if (token && userData) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes - Sem Layout */}
          <Route 
            path="/" 
            element={<><Navbar onLogout={handleLogout} /><Home /></>} 
          />
          <Route 
            path="/trainers" 
            element={<><Navbar onLogout={handleLogout} /><Home /></>} 
          />
          <Route 
            path="/trainer/:trainerId" 
            element={<TrainerProfile />} 
          />
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={<Register onLogin={handleLogin} />} 
          />
          
          {/* Protected Routes - Com Layout */}
          <Route 
            path="/dashboard" 
            element={user ? (
              <Layout onLogout={handleLogout}>
                <Dashboard user={user} onLogout={handleLogout} />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/trainer/services" 
            element={user && user.role === 'trainer' ? (
              <Layout onLogout={handleLogout}>
                <ServicesManagement user={user} />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/trainer/appointments" 
            element={user && user.role === 'trainer' ? (
              <Layout onLogout={handleLogout}>
                <AppointmentsList user={user} />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/trainer/requests" 
            element={user && user.role === 'trainer' ? (
              <Layout onLogout={handleLogout}>
                <RequestsList user={user} />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/client/trainers" 
            element={user && user.role === 'client' ? (
              <Layout onLogout={handleLogout}>
                <TrainersList user={user} />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/client/appointments" 
            element={user && user.role === 'client' ? (
              <Layout onLogout={handleLogout}>
                <AppointmentsList user={user} />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/client/requests" 
            element={user && user.role === 'client' ? (
              <Layout onLogout={handleLogout}>
                <RequestsList user={user} />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/client/appointments/create/:trainerId" 
            element={user && user.role === 'client' ? (
              <Layout onLogout={handleLogout}>
                <CreateAppointment user={user} />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/client/requests/create/:trainerId" 
            element={user && user.role === 'client' ? (
              <Layout onLogout={handleLogout}>
                <CreateRequest user={user} />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/notifications" 
            element={user ? (
              <Layout onLogout={handleLogout}>
                <Notifications />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? (
              <Layout onLogout={handleLogout}>
                <UserProfile />
              </Layout>
            ) : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


