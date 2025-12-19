import React, { useState, useEffect, useCallback, useRef } from 'react';
import Tooltip from './common/Tooltip';
import './SearchFilters.css';

const SearchFilters = ({ onFilterChange, onSearch, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    minRating: 0,
    maxPrice: '',
    category: '',
    city: '',
    ...initialFilters
  });
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const isManualSearchRef = useRef(false);

  // Debounce para busca em tempo real (sem scroll)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Se foi uma busca manual, não aplicar debounce automático
    if (isManualSearchRef.current) {
      isManualSearchRef.current = false;
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(false);
      if (onFilterChange) {
        onFilterChange(filters);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters, onFilterChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Formatação automática de preço
    if (name === 'maxPrice') {
      // Remove tudo que não é número
      const numbers = value.replace(/\D/g, '');
      if (numbers) {
        // Converte para formato de moeda
        const price = parseFloat(numbers) / 100;
        processedValue = price.toFixed(2);
      } else {
        processedValue = '';
      }
    }

    const newFilters = {
      ...filters,
      [name]: processedValue
    };
    setFilters(newFilters);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    isManualSearchRef.current = true; // Marcar como busca manual
    if (onSearch) {
      onSearch(filters);
    }
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const clearFilters = () => {
    const cleared = {
      search: '',
      minRating: 0,
      maxPrice: '',
      category: '',
      city: ''
    };
    setFilters(cleared);
    if (onFilterChange) {
      onFilterChange(cleared);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeFilter = (filterName) => {
    const newFilters = { ...filters };
    if (filterName === 'minRating') {
      newFilters[filterName] = 0;
    } else {
      newFilters[filterName] = '';
    }
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.minRating > 0) count++;
    if (filters.maxPrice) count++;
    if (filters.category) count++;
    if (filters.city) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="search-filters">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Buscar por nome, especialidade..."
            className="search-input-large"
          />
          {isSearching && (
            <div className="search-loading-indicator">
              <span className="search-spinner"></span>
            </div>
          )}
          {filters.search && (
            <button
              className="search-clear-btn"
              onClick={() => removeFilter('search')}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>
        <Tooltip content="Buscar trainers (Enter)">
          <button onClick={handleSearch} className="btn-search-large">
            🔍 Buscar
          </button>
        </Tooltip>
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>
            Avaliação Mínima
            {filters.minRating > 0 && (
              <span className="filter-badge">{filters.minRating}+</span>
            )}
          </label>
          <select
            name="minRating"
            value={filters.minRating}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="0">Todas</option>
            <option value="3">3+ estrelas</option>
            <option value="4">4+ estrelas</option>
            <option value="4.5">4.5+ estrelas</option>
            <option value="4.8">4.8+ estrelas</option>
          </select>
        </div>

        <div className="filter-group">
          <label>
            Preço Máximo
            {filters.maxPrice && (
              <span className="filter-badge">R$ {parseFloat(filters.maxPrice).toFixed(2)}</span>
            )}
          </label>
          <div className="price-input-wrapper">
            <span className="price-prefix">R$</span>
            <input
              type="text"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="0,00"
              className="filter-input price-input"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>
            Cidade
            {filters.city && (
              <span className="filter-badge">{filters.city}</span>
            )}
          </label>
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="Ex: São Paulo"
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label>
            Categoria
            {filters.category && (
              <span className="filter-badge">{filters.category}</span>
            )}
          </label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="">Todas</option>
            <option value="hipertrofia">Hipertrofia</option>
            <option value="emagrecimento">Emagrecimento</option>
            <option value="funcional">Funcional</option>
            <option value="reabilitacao">Reabilitação</option>
            <option value="pilates">Pilates</option>
            <option value="yoga">Yoga</option>
            <option value="crossfit">CrossFit</option>
          </select>
        </div>

        <div className="filter-actions">
          {activeFiltersCount > 0 && (
            <div className="active-filters-count">
              {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro ativo' : 'filtros ativos'}
            </div>
          )}
          <Tooltip content="Limpar todos os filtros">
            <button 
              onClick={clearFilters} 
              className={`btn-clear-filters ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
              disabled={activeFiltersCount === 0}
            >
              🗑️ Limpar Filtros
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Badges de Filtros Ativos */}
      {activeFiltersCount > 0 && (
        <div className="active-filters-badges">
          {filters.search && (
            <span className="filter-tag">
              Busca: "{filters.search}"
              <button onClick={() => removeFilter('search')} className="filter-tag-remove">×</button>
            </span>
          )}
          {filters.minRating > 0 && (
            <span className="filter-tag">
              {filters.minRating}+ estrelas
              <button onClick={() => removeFilter('minRating')} className="filter-tag-remove">×</button>
            </span>
          )}
          {filters.maxPrice && (
            <span className="filter-tag">
              Até R$ {parseFloat(filters.maxPrice).toFixed(2)}
              <button onClick={() => removeFilter('maxPrice')} className="filter-tag-remove">×</button>
            </span>
          )}
          {filters.city && (
            <span className="filter-tag">
              {filters.city}
              <button onClick={() => removeFilter('city')} className="filter-tag-remove">×</button>
            </span>
          )}
          {filters.category && (
            <span className="filter-tag">
              {filters.category}
              <button onClick={() => removeFilter('category')} className="filter-tag-remove">×</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;



