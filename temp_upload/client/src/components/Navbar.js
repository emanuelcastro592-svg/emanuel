import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const user = getUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="logo-icon">🏋️</span>
          <span className="logo-text">FitBooking</span>
        </Link>
        
        <div className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
            Início
          </Link>
          <Link to="/trainers" className="navbar-link" onClick={closeMobileMenu}>
            Personal Trainers
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link" onClick={closeMobileMenu}>
                {user.role === 'client' ? 'Painel Cliente' : 'Painel Personal Trainer'}
              </Link>
              <span className="navbar-user">
                <span className="user-avatar-small">{user.name.charAt(0).toUpperCase()}</span>
                Olá, {user.name}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-entrar" onClick={closeMobileMenu}>
                Entrar
              </Link>
              <Link to="/register" className="btn-register" onClick={closeMobileMenu}>
                Cadastrar
              </Link>
            </>
          )}
        </div>

        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
