import React, { useState, useEffect } from 'react';
import BarraTopo from '../../components/NavBar/BarraTopo';
import AddEventButton from '../../components/buttons/AddEventButton/AddEventButton';
import Filtros from '../../components/Filtros/Filtros';
import TabelaItens from '../../components/TabelaItens/TabelaItens';
import LoginsInput from '../../components/inputs/LoginsInput';
import Desciption from '../../components/inputs/Description/Description';
import InputDate from '../../components/inputs/InputDate/InputDate';
import PriorityButton from '../../components/buttons/PriorityButton/PriorityButton';
import './CreateEvent.css';

const API_BASE = 'https://localhost:7071/api/Tarefas';

export default function CreateEvent() {
  const [tarefa, setTarefa] = useState({ titulo: '', descricao: '', dataInicio: '', dataEntrega: '', statusTarefa: 'A fazer', prioridade: 'Não urgente' });
  const [filtros, setFiltros] = useState({ titulo: '', dataEntrega: '', status: '', prioridade: '' });
  const [tarefas, setTarefas] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTarefa(prev => ({ ...prev, [name]: value }));
  };

  const fetchTarefas = async () => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, val]) => { if (val) params.append(key, val); });
    const url = params.toString() ? `${API_BASE}/filtrar?${params}` : API_BASE;

    try {
      const response = await fetch(url, { credentials: 'include' });
      if (response.ok) setTarefas(await response.json());
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
    }
  };

  useEffect(() => { fetchTarefas(); }, [refresh, filtros]);

  const formatarData = d => d ? new Date(d).toISOString() : null;

  const AddEvent = async () => {
    if (!tarefa.titulo || !tarefa.dataInicio || !tarefa.dataEntrega) return alert('Preencha todos os campos!');
    const body = {
      ...tarefa,
      dataInicio: formatarData(tarefa.dataInicio),
      dataEntrega: formatarData(tarefa.dataEntrega)
    };
    try {
      const res = await fetch(API_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(body) });
      if (res.ok) { setTarefa({ titulo: '', descricao: '', dataInicio: '', dataEntrega: '', statusTarefa: 'A fazer', prioridade: 'Não urgente' }); setRefresh(r => !r); setIsOpen(false); }
      else if (res.status === 401) alert('Faça login para criar tarefas.');
      else alert(`Erro ${res.status}`);
    } catch (err) { alert('Falha na criação'); }
  };

  return (
    <div className="CreateEvent-container">
      <BarraTopo />
      <div className="container-infoCreate">
        <h1>Gerenciar atividades</h1>
        <AddEventButton AddEvent={() => setIsOpen(true)} />
      </div>
      <Filtros filtros={filtros} setFiltros={setFiltros} />
      <TabelaItens tarefasList={tarefas} onUpdate={() => setRefresh(r => !r)} />

      {isOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h4>Nova Tarefa</h4>
            <LoginsInput textoInput="Título da tarefa" name="titulo" value={tarefa.titulo} onChange={handleChange} />
            <Desciption description="Descrição" name="descricao" value={tarefa.descricao} onChange={handleChange} />
            <div className="form-row two-cols">
              <div className="field"><label>Data de início</label><InputDate name="dataInicio" value={tarefa.dataInicio} onChange={handleChange} /></div>
              <div className="field"><label>Data de entrega</label><InputDate name="dataEntrega" value={tarefa.dataEntrega} onChange={handleChange} /></div>
            </div>
            <div className="form-row two-cols">
              <div className="field">
                <label>Status</label>
                <select name="statusTarefa" value={tarefa.statusTarefa} onChange={handleChange}><option>A fazer</option><option>Em processo</option><option>Concluído</option></select>
              </div>
              <div className="field">
                <label>Prioridade</label>
                <select name="prioridade" value={tarefa.prioridade} onChange={handleChange}><option>Muito urgente</option><option>Pouco urgente</option><option>Não urgente</option></select>
              </div>
            </div>
            <div className="buttons-row">
              <PriorityButton PriorityText="Cancelar" backgroundColor="var(--Borda)" FunctionPrioritybtn={() => setIsOpen(false)} />
              <PriorityButton PriorityText="Salvar" backgroundColor="var(--blue)" FunctionPrioritybtn={AddEvent} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}