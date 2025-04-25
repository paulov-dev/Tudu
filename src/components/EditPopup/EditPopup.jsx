import React from "react";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";
import LoginsInput from "../inputs/LoginsInput";

function EditPopup({ tarefa, onClose, onSave, onDelete }) {
  // Função para formatar a data para o input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Normaliza os dados iniciais
  const [editedTarefa, setEditedTarefa] = React.useState(() => ({
    ...tarefa,
    status: tarefa.StatusTarefa || tarefa.statusTarefa || "A fazer",
    prioridade: tarefa.Prioridade || tarefa.prioridade || "Não urgente",
    dataInicio: formatDateForInput(tarefa.dataInicio),
    dataEntrega: formatDateForInput(tarefa.dataEntrega),
    // Remove campos duplicados
    StatusTarefa: undefined,
    Prioridade: undefined
  }));

  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTarefa(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const tarefaFormatada = {
        ...editedTarefa,
        StatusTarefa: editedTarefa.statusTarefa,
        Prioridade: editedTarefa.prioridade,
        dataInicio: editedTarefa.dataInicio ? new Date(editedTarefa.dataInicio).toISOString() : null,
        dataEntrega: editedTarefa.dataEntrega ? new Date(editedTarefa.dataEntrega).toISOString() : null,
        status: undefined,
        prioridade: undefined
      };

      // Adiciona verificação se onSave existe e é função
      if (typeof onSave === 'function') {
        await onSave(tarefaFormatada);
      }
    } catch (err) {
      setError("Erro ao salvar. Tente novamente.");
      console.error("Erro:", err);
      return; // Não fecha o popup em caso de erro
    } finally {
      setIsLoading(false);
    }
    
    // Só fecha se tudo der certo
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // Adiciona verificação se onDelete existe e é função
      if (typeof onDelete === 'function') {
        await onDelete(editedTarefa.id);
      }
    } catch (err) {
      setError("Erro ao excluir. Tente novamente.");
      console.error("Erro:", err);
      return; // Não fecha o popup em caso de erro
    } finally {
      setIsLoading(false);
    }
    
    // Só fecha se tudo der certo
    if (typeof onClose === 'function') {
      onClose();
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
              value={editedTarefa.titulo || ''}
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
                type="date"
                name="dataInicio"
                value={editedTarefa.dataInicio || ''}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="field">
              <label>Data Entrega</label>
              <input
                type="date"
                name="dataEntrega"
                value={editedTarefa.dataEntrega || ''}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="field">
              <label>Status</label>
              <select
                name="status"
                value={editedTarefa.status}
                onChange={handleChange}
                className="form-control"
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
                name="prioridade"
                value={editedTarefa.prioridade}
                onChange={handleChange}
                className="form-control"
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
                  PriorityText="Confirmar Exclusão"
                  backgroundColor="#e74c3c"
                  onClick={handleDelete}
                  disabled={isLoading}
                />
                <PriorityButton
                  type="button"
                  PriorityText="Cancelar"
                  backgroundColor="#95a5a6"
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
                  onClick={() => setConfirmDelete(true)}
                  disabled={isLoading}
                />
                <PriorityButton
                  type="button"
                  PriorityText="Cancelar"
                  backgroundColor="#95a5a6"
                  onClick={onClose}
                  disabled={isLoading}
                />
                <PriorityButton
                  type="submit"
                  PriorityText="Salvar"
                  backgroundColor="#3498db"
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