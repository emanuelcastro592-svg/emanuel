import React from 'react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
  showItemsPerPage = true 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        {totalItems > 0 && (
          <span className="pagination-text">
            Mostrando {startItem} a {endItem} de {totalItems} resultados
          </span>
        )}
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="pagination-items-per-page">
            <label>Itens por página:</label>
            <select 
              value={itemsPerPage} 
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="pagination-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="Primeira página"
          >
            ««
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            «
          </button>

          {getPageNumbers().map((page) => {
            if (page === 1 && currentPage > 3) {
              return (
                <React.Fragment key={page}>
                  <button
                    className="pagination-btn"
                    onClick={() => onPageChange(1)}
                  >
                    1
                  </button>
                  {currentPage > 4 && <span className="pagination-ellipsis">...</span>}
                </React.Fragment>
              );
            }
            if (page === totalPages && currentPage < totalPages - 2) {
              return (
                <React.Fragment key={page}>
                  {currentPage < totalPages - 3 && <span className="pagination-ellipsis">...</span>}
                  <button
                    className="pagination-btn"
                    onClick={() => onPageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                </React.Fragment>
              );
            }
            return (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Próxima página"
          >
            »
          </button>
          <button
            className="pagination-btn"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Última página"
          >
            »»
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-jump">
          <label>Ir para página:</label>
          <input
            type="number"
            min="1"
            max={totalPages}
            className="pagination-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                  e.target.value = '';
                }
              }
            }}
            placeholder={currentPage.toString()}
          />
        </div>
      )}
    </div>
  );
};

export default Pagination;




