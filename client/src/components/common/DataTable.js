import React, { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';
import Pagination from './Pagination';
import './DataTable.css';

const DataTable = ({
  columns,
  data,
  onRowClick,
  actions,
  pagination = true,
  itemsPerPage: initialItemsPerPage = 10,
  searchable = true,
  sortable = true,
  filterable = false,
  filters = [],
  emptyMessage = 'Nenhum dado disponível',
  loading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeFilters, setActiveFilters] = useState({});

  // Filtrar dados
  const filteredData = useMemo(() => {
    let result = [...data];

    // Busca global
    if (searchTerm && searchable) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const value = col.accessor ? row[col.accessor] : col.render?.(row);
          return String(value || '').toLowerCase().includes(searchLower);
        })
      );
    }

    // Filtros específicos
    if (filterable && filters.length > 0) {
      Object.keys(activeFilters).forEach((filterKey) => {
        if (activeFilters[filterKey]) {
          const filter = filters.find((f) => f.key === filterKey);
          if (filter) {
            result = result.filter((row) => filter.filterFn(row, activeFilters[filterKey]));
          }
        }
      });
    }

    // Ordenação
    if (sortConfig.key && sortable) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue === bValue) return 0;
        
        const comparison = aValue > bValue ? 1 : -1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig, activeFilters, columns, searchable, sortable, filterable, filters]);

  // Paginação
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage, pagination]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1);
  };

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="datatable-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="datatable-container">
      {/* Barra de Busca e Filtros */}
      {(searchable || filterable) && (
        <div className="datatable-toolbar">
          {searchable && (
            <div className="datatable-search">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="datatable-search-input"
              />
              {searchTerm && (
                <button
                  className="datatable-search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Limpar busca"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {filterable && filters.length > 0 && (
            <div className="datatable-filters">
              {filters.map((filter) => (
                <div key={filter.key} className="datatable-filter">
                  <label>{filter.label}:</label>
                  {filter.type === 'select' ? (
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      className="datatable-filter-select"
                    >
                      <option value="">Todos</option>
                      {filter.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={filter.type || 'text'}
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      placeholder={filter.placeholder}
                      className="datatable-filter-input"
                    />
                  )}
                </div>
              ))}
              {(Object.keys(activeFilters).length > 0 || searchTerm) && (
                <button
                  className="datatable-clear-filters"
                  onClick={clearFilters}
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tabela */}
      <div className="datatable-wrapper">
        <table className="datatable">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key || column.accessor}
                  className={`
                    ${sortable && column.sortable !== false ? 'sortable' : ''}
                    ${sortConfig.key === (column.key || column.accessor) ? `sort-${sortConfig.direction}` : ''}
                    ${column.align ? `text-${column.align}` : ''}
                  `}
                  onClick={() => {
                    if (sortable && column.sortable !== false) {
                      handleSort(column.key || column.accessor);
                    }
                  }}
                  style={{ width: column.width }}
                >
                  <div className="th-content">
                    <span>{column.header}</span>
                    {sortable && column.sortable !== false && (
                      <span className="sort-icon">
                        {sortConfig.key === (column.key || column.accessor) ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : (
                          '⇅'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="actions-header">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="datatable-empty">
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>{emptyMessage}</p>
                    {(searchTerm || Object.keys(activeFilters).length > 0) && (
                      <button
                        className="btn btn-secondary"
                        onClick={clearFilters}
                      >
                        Limpar Filtros
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={onRowClick ? 'clickable' : ''}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key || column.accessor}
                      className={column.align ? `text-${column.align}` : ''}
                    >
                      {column.render
                        ? column.render(row)
                        : column.accessor
                        ? (column.type === 'status' ? (
                            <StatusBadge status={row[column.accessor]} />
                          ) : (
                            row[column.accessor]
                          ))
                        : '-'}
                    </td>
                  ))}
                  {actions && (
                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                      <ActionButtons {...actions} item={row} />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {pagination && filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1);
          }}
          totalItems={filteredData.length}
        />
      )}

      {/* Info de Resultados */}
      {filteredData.length > 0 && (
        <div className="datatable-info">
          <span>
            Mostrando {paginatedData.length} de {filteredData.length} resultados
            {searchTerm && ` para "${searchTerm}"`}
          </span>
        </div>
      )}
    </div>
  );
};

export default DataTable;





