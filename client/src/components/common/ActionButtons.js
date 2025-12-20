import React, { useState } from 'react';
import Modal from './Modal';
import './ActionButtons.css';

const ActionButtons = ({ 
  onView, 
  onEdit, 
  onDelete, 
  onCustom,
  customActions = [],
  item,
  showView = true,
  showEdit = true,
  showDelete = true,
  deleteConfirmMessage = 'Tem certeza que deseja excluir este item?'
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await onDelete(item);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erro ao deletar:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="action-buttons">
        {showView && onView && (
          <button
            className="action-btn action-btn-view"
            onClick={() => onView(item)}
            title="Ver detalhes"
            aria-label="Ver detalhes"
          >
            👁️
          </button>
        )}
        {showEdit && onEdit && (
          <button
            className="action-btn action-btn-edit"
            onClick={() => onEdit(item)}
            title="Editar"
            aria-label="Editar"
          >
            ✏️
          </button>
        )}
        {showDelete && onDelete && (
          <button
            className="action-btn action-btn-delete"
            onClick={handleDeleteClick}
            title="Excluir"
            aria-label="Excluir"
          >
            🗑️
          </button>
        )}
        {customActions.map((action, index) => (
          <button
            key={index}
            className={`action-btn action-btn-custom ${action.className || ''}`}
            onClick={() => action.onClick(item)}
            title={action.title}
            aria-label={action.title}
          >
            {action.icon || action.label}
          </button>
        ))}
        {onCustom && (
          <button
            className="action-btn action-btn-custom"
            onClick={() => onCustom(item)}
            title="Mais ações"
            aria-label="Mais ações"
          >
            ⋮
          </button>
        )}
      </div>

      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Exclusão"
          size="small"
        >
          <div className="delete-confirm-content">
            <p>{deleteConfirmMessage}</p>
            <div className="delete-confirm-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ActionButtons;




