import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTrainers, getStats, getTrainerServices } from '../utils/api';
import { getUser } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';
import SearchFilters from './SearchFilters';
import EmptyState from './common/EmptyState';
import Tooltip from './common/Tooltip';
import SkeletonLoader, { SkeletonCard } from './common/SkeletonLoader';
import { useNotification } from '../hooks/useNotification';
import Notification from './Notification';
import './Home.css';

const Home = () => {
  const [trainers, setTrainers] = useState([]);
  const [trainersWithServices, setTrainersWithServices] = useState([]);
  const [filteredTrainers, setFilteredTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    minRating: 0,
    maxPrice: '',
    category: '',
    city: ''
  });
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef({});
  const resultsSectionRef = useRef(null);
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    loadTrainers();
    loadStats();
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, entry.target.dataset.index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredTrainers]);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const response = await getTrainers();
      const trainersData = response.data || [];
      setTrainers(trainersData);
      
      // Carregar serviços de cada trainer
      const trainersWithServicesData = await Promise.all(
        trainersData.map(async (trainer) => {
          try {
            const servicesResponse = await getTrainerServices(trainer.id);
            const services = servicesResponse.data || [];
            
            // Calcular preço mínimo e máximo
            const prices = services
              .filter(s => s.active)
              .map(s => parseFloat(s.price) || 0);
            
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
            
            // Obter categorias únicas
            const categories = [...new Set(
              services
                .filter(s => s.active && s.category)
                .map(s => s.category.toLowerCase())
            )];
            
            return {
              ...trainer,
              services: services.filter(s => s.active),
              minPrice,
              maxPrice,
              categories,
              servicesCount: services.filter(s => s.active).length
            };
          } catch (err) {
            return {
              ...trainer,
              services: [],
              minPrice: 0,
              maxPrice: 0,
              categories: [],
              servicesCount: 0
            };
          }
        })
      );
      
      setTrainersWithServices(trainersWithServicesData);
      setFilteredTrainers(trainersWithServicesData);
    } catch (err) {
      console.error('Erro ao carregar trainers:', err);
      showNotification('Erro ao carregar personal trainers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback((newFilters, shouldScroll = false) => {
    setFilters(newFilters);
    setFiltering(true);
    
    // Usar setTimeout para permitir animação
    setTimeout(() => {
      let filtered = [...trainersWithServices];

      // Filtro por busca (nome, bio, cidade, email, especialidade)
      if (newFilters.search) {
        const searchLower = newFilters.search.toLowerCase();
        filtered = filtered.filter(trainer => {
          const nameMatch = trainer.name?.toLowerCase().includes(searchLower);
          const bioMatch = trainer.bio?.toLowerCase().includes(searchLower);
          const cityMatch = trainer.city?.toLowerCase().includes(searchLower);
          const emailMatch = trainer.email?.toLowerCase().includes(searchLower);
          
          // Buscar em serviços
          const serviceMatch = trainer.services?.some(service =>
            service.name?.toLowerCase().includes(searchLower) ||
            service.description?.toLowerCase().includes(searchLower) ||
            service.category?.toLowerCase().includes(searchLower)
          );
          
          return nameMatch || bioMatch || cityMatch || emailMatch || serviceMatch;
        });
      }

      // Filtro por avaliação mínima
      if (newFilters.minRating > 0) {
        filtered = filtered.filter(trainer =>
          parseFloat(trainer.rating || 0) >= parseFloat(newFilters.minRating)
        );
      }

      // Filtro por preço máximo
      if (newFilters.maxPrice) {
        const maxPriceValue = parseFloat(newFilters.maxPrice);
        filtered = filtered.filter(trainer => {
          // Trainer deve ter pelo menos um serviço com preço <= maxPrice
          return trainer.services?.some(service => 
            parseFloat(service.price || 0) <= maxPriceValue
          ) || trainer.minPrice <= maxPriceValue;
        });
      }

      // Filtro por cidade
      if (newFilters.city) {
        const cityLower = newFilters.city.toLowerCase();
        filtered = filtered.filter(trainer =>
          trainer.city?.toLowerCase().includes(cityLower)
        );
      }

      // Filtro por categoria de serviço
      if (newFilters.category) {
        const categoryLower = newFilters.category.toLowerCase();
        filtered = filtered.filter(trainer =>
          trainer.categories?.some(cat => cat.includes(categoryLower))
        );
      }

      setFilteredTrainers(filtered);
      setFiltering(false);
      
      // Scroll para a seção de resultados apenas se for uma busca manual
      if (shouldScroll && resultsSectionRef.current) {
        setTimeout(() => {
          resultsSectionRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }, 200);
      }
    }, 100);
  }, [trainersWithServices]);

  const handleSearch = (searchFilters) => {
    // Aplicar filtros com scroll (busca manual)
    applyFilters(searchFilters, true);
  };

  const loadStats = async () => {
    try {
      const userData = getUser();
      if (userData) {
        const response = await getStats();
        setStats(response.data);
      }
    } catch (err) {
      // Ignorar erro se não autenticado
    }
  };

  const handleViewTrainer = (trainerId) => {
    navigate(`/trainer/${trainerId}`);
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="trainers-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
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
      
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Encontre o Personal Trainer Ideal Para Seus Objetivos
              </h1>
              <p className="hero-description">
                Agende treinos personalizados, solicite serviços específicos e transforme sua jornada fitness com profissionais qualificados.
              </p>
              <div className="hero-search">
                <SearchFilters 
                  onFilterChange={applyFilters} 
                  onSearch={handleSearch}
                  initialFilters={filters}
                />
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-placeholder">
                <div className="play-button-overlay">
                  <div className="play-button">▶</div>
                </div>
              </div>
              {stats && (
                <div className="stats-card">
                  <div className="stats-icon">🏆</div>
                  <div className="stats-text">
                    <div className="stats-number">{stats.appointments?.count || 0}+</div>
                    <div className="stats-label">Agendamentos Totais</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Como Funciona Section */}
        <section className="how-it-works">
          <div className="container">
            <h2 className="section-title">Como Funciona o FitBooking</h2>
            <p className="section-description">
              Uma plataforma completa para conectar você aos melhores personal trainers da sua região
            </p>
          </div>
        </section>

        {/* Trainers Grid */}
        <section ref={resultsSectionRef} className="trainers-section" id="trainers-results">
          <div className="container">
            <div className="section-header-with-results">
              <h2 className="section-title">
                Personal Trainers Disponíveis
                {filtering && (
                  <span className="filtering-indicator">
                    <span className="filtering-spinner"></span> Filtrando...
                  </span>
                )}
              </h2>
              {filteredTrainers.length !== trainersWithServices.length && (
                <div className="results-info">
                  <span className="results-count-badge">
                    {filteredTrainers.length} {filteredTrainers.length === 1 ? 'resultado' : 'resultados'}
                    {trainersWithServices.length > 0 && (
                      <span className="results-total"> de {trainersWithServices.length}</span>
                    )}
                  </span>
                </div>
              )}
            </div>
            
            <div className={`trainers-grid ${filtering ? 'filtering' : ''}`}>
              {filteredTrainers.length === 0 ? (
                <EmptyState
                  icon={trainersWithServices.length === 0 ? "👥" : "🔍"}
                  title={trainersWithServices.length === 0 ? "Nenhum personal trainer cadastrado" : "Nenhum trainer encontrado"}
                  message={
                    trainersWithServices.length === 0
                      ? "Ainda não há personal trainers cadastrados na plataforma"
                      : "Tente ajustar os filtros de busca para encontrar mais resultados"
                  }
                />
              ) : (
                filteredTrainers.map((trainer, index) => {
                  const isVisible = visibleCards.has(String(index));
                  return (
                    <div 
                      key={trainer.id} 
                      ref={(el) => (cardRefs.current[trainer.id] = el)}
                      data-index={index}
                      className={`trainer-card-interactive ${isVisible ? 'card-visible' : ''}`}
                      onClick={() => handleViewTrainer(trainer.id)}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="trainer-card-inner">
                        <div className="trainer-avatar-large">
                          {trainer.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <h3>
                          {filters.search 
                            ? highlightSearchTerm(trainer.name, filters.search)
                            : trainer.name}
                        </h3>
                        {trainer.city && (
                          <p className="trainer-location">
                            📍 {filters.city
                              ? highlightSearchTerm(trainer.city, filters.city)
                              : trainer.city}
                          </p>
                        )}
                        {trainer.email && (
                          <Tooltip content={trainer.email}>
                            <p className="trainer-email">📧 {trainer.email}</p>
                          </Tooltip>
                        )}
                        {trainer.phone && (
                          <Tooltip content={trainer.phone}>
                            <p className="trainer-phone">📱 {trainer.phone}</p>
                          </Tooltip>
                        )}
                        {trainer.rating && (
                          <div className="trainer-rating">
                            <span className="stars">
                              {'★'.repeat(Math.round(trainer.rating))}
                              {'☆'.repeat(5 - Math.round(trainer.rating))}
                            </span>
                            <span className="rating-text">
                              {trainer.rating?.toFixed(1) || '0.0'} ({trainer.rating_count || 0} {trainer.rating_count === 1 ? 'avaliação' : 'avaliações'})
                            </span>
                          </div>
                        )}
                        {trainer.servicesCount > 0 && (
                          <div className="trainer-services-info">
                            <span className="services-count-badge">
                              {trainer.servicesCount} {trainer.servicesCount === 1 ? 'serviço' : 'serviços'}
                            </span>
                            {trainer.minPrice > 0 && trainer.maxPrice > 0 && (
                              <span className="price-range">
                                R$ {trainer.minPrice.toFixed(2)} - R$ {trainer.maxPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}
                        {trainer.categories && trainer.categories.length > 0 && (
                          <div className="trainer-categories">
                            {trainer.categories.slice(0, 3).map((cat, idx) => (
                              <span key={idx} className="category-tag">
                                {cat}
                              </span>
                            ))}
                            {trainer.categories.length > 3 && (
                              <span className="category-tag-more">
                                +{trainer.categories.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        <Tooltip content="Ver perfil completo e serviços">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewTrainer(trainer.id);
                            }}
                            className="btn-view-trainer"
                          >
                            Ver Perfil →
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
