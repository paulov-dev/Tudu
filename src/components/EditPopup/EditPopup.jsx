import React from "react";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";
import LoginsInput from "../inputs/LoginsInput";

function EditPopup({ tarefa, onClose, onSave, onDelete }) {
  const [editedTarefa, setEditedTarefa] = React.useState(tarefa);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTarefa({ ...editedTarefa, [name]: value });
  };

  const handleStatusChange = (e) => {
    setEditedTarefa({ ...editedTarefa, status: e.target.value });
  };

  const handlePriorityChange = (e) => {
    setEditedTarefa({ ...editedTarefa, prioridade: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(editedTarefa);
      onClose();
    } catch (err) {
      setError("Erro ao salvar alterações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setIsLoading(true);
    try {
      await onDelete(editedTarefa.id);
      onClose();
    } catch (err) {
      setError("Erro ao excluir tarefa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>Alterar Tarefa</h3>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <LoginsInput
              textoInput="Título da tarefa"
              name="titulo"
              value={editedTarefa.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={editedTarefa.descricao || ''}
              onChange={handleChange}
              className="form-control"
              rows="3"
            />
          </div>

          <div className="form-row two-cols">
            <div className="field">
              <label>Data Início</label>
              <input
                type="text"
                name="dataInicio"
                value={editedTarefa.dataInicio || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label>Data Entrega</label>
              <input
                type="text"
                name="dataEntrega"
                value={editedTarefa.dataEntrega || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="field">
              <label>Status</label>
              <select
                value={editedTarefa.status}
                onChange={handleStatusChange}
                required
              >
                <option value="A fazer">A fazer</option>
                <option value="Em processo">Em processo</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
            <div className="field">
              <label>Prioridade</label>
              <select
                value={editedTarefa.prioridade}
                onChange={handlePriorityChange}
                required
              >
                <option value="Muito urgente">Muito urgente</option>
                <option value="Pouco urgente">Pouco urgente</option>
                <option value="Não urgente">Não urgente</option>
              </select>
            </div>
          </div>

          <div className="buttons-row">
            {confirmDelete ? (
              <>
                <PriorityButton
                  type="button"
                  PriorityText={isLoading ? "Confirmando..." : "Confirmar Exclusão"}
                  backgroundColor="#e74c3c"
                  textColor="#fff"
                  onClick={handleDelete}
                  disabled={isLoading}
                />
                <PriorityButton
                  type="button"
                  PriorityText="Cancelar"
                  backgroundColor="#95a5a6"
                  textColor="#333"
                  onClick={() => setConfirmDelete(false)}
                  disabled={isLoading}
                />
              </>
            ) : (
              <>
                <PriorityButton
                  type="button"
                  PriorityText="Excluir"
                  backgroundColor="#e74c3c"
                  textColor="#fff"
                  onClick={handleDelete}
                  disabled={isLoading}
                />
                <PriorityButton
                  type="button"
                  PriorityText="Cancelar"
                  backgroundColor="#95a5a6"
                  textColor="#333"
                  onClick={onClose}
                  disabled={isLoading}
                />
                <PriorityButton
                  type="submit"
                  PriorityText={isLoading ? "Salvando..." : "Salvar"}
                  backgroundColor="#3498db"
                  textColor="#fff"
                  disabled={isLoading}
                />
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPopup;