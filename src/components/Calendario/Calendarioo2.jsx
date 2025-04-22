import "./Calendario.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventModal from "./EventModal";
import LoginButton from "../buttons/LoginButtons/LoginButton";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function Calendarioo2() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Estado para forçar atualização

  // Função para buscar as tarefas do backend e atualizar os eventos do calendário
  const fetchEventos = async () => {
    try {
      const response = await fetch('https://localhost:7071/api/Tarefas');
      if (response.ok) {
        const data = await response.json();
        // Verifica se os dados são válidos
        if (Array.isArray(data)) {
          const eventosFormatted = data.map(evento => {
            // Certifique-se de que as datas são válidas antes de criar os objetos Date
            const dataInicio = evento.dataInicio ? new Date(evento.dataInicio) : new Date();
            const dataEntrega = evento.dataEntrega ? new Date(evento.dataEntrega) : new Date();
            
            return {
              id: evento.id,
              title: evento.titulo || 'Sem título',
              start: dataInicio,
              end: dataEntrega,
              desc: evento.descricao || 'Sem descrição',
              color: '#418dff',
            };
          });
          setEventos(eventosFormatted);
        } else {
          console.error("Dados inválidos recebidos da API");
        }
      } else {
        console.error("Erro ao buscar tarefas");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  useEffect(() => {
    fetchEventos();
    
    // Configura um intervalo para atualizar os eventos a cada 30 segundos
    const interval = setInterval(() => {
      fetchEventos();
    }, 30000);
    
    return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
  }, [refreshKey]); // Busca os eventos quando o componente for montado ou refreshKey mudar

  // Força a atualização do componente
  const forceRefresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  const eventStyle = (event) => ({
    style: {
      backgroundColor: event.color || "#418dff",
    }
  });

  const MoverEventos = async (data) => {
    const { start, end, event } = data;
    
    try {
      // Primeiro atualiza a UI para feedback imediato
      const updatedEvents = eventos.map((e) => {
        if (e.id === event.id) {
          return {
            ...e,
            start: new Date(start),
            end: new Date(end),
          };
        }
        return e;
      });
      setEventos(updatedEvents);
      
      // Depois atualiza no backend
      // Busca a tarefa original primeiro
      const response = await fetch(`https://localhost:7071/api/Tarefas/${event.id}`);
      if (response.ok) {
        const tarefa = await response.json();
        
        // Atualiza apenas as datas
        const tarefaAtualizada = {
          ...tarefa,
          dataInicio: new Date(start).toISOString(),
          dataEntrega: new Date(end).toISOString()
        };
        
        // Envia a atualização para o backend
        const updateResponse = await fetch(`https://localhost:7071/api/Tarefas/${event.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tarefaAtualizada)
        });
        
        if (!updateResponse.ok) {
          console.error("Erro ao atualizar tarefa após arrastar");
          // Se falhar, busca os eventos novamente para sincronizar
          fetchEventos();
        }
      } else {
        console.error("Erro ao buscar tarefa para atualização");
        fetchEventos();
      }
    } catch (error) {
      console.error("Erro ao mover evento:", error);
      // Em caso de erro, atualiza os eventos para garantir sincronização
      fetchEventos();
    }
  };

  const handleEventClick = (evento) => {
    setEventoSelecionado(evento);
  };

  const handleEventClose = () => {
    setEventoSelecionado(null);
  };

  return (
    <div className="calendar-container">
      <div className="botao-atualizar">
        {/* <LoginButton textoLoginButton="WorkItems" rota={'/WorkItems'} /> */}
        <PriorityButton
                PriorityText="Atualizar Calendário"
                backgroundColor="var(--lightblue)"
                FunctionPrioritybtn={forceRefresh}
              />
       {/* <button onClick={forceRefresh} className="refresh-button">
          Atualizar Calendário
        </button>*/}
      </div>
      <DragAndDropCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        events={eventos}
        localizer={localizer}
        resizable
        onEventDrop={MoverEventos}
        onEventResize={MoverEventos}
        onSelectEvent={handleEventClick}
        eventPropGetter={eventStyle}
        views={["month", "week", "day", "agenda"]}
        step={30}
        showMultiDayTimes
      />
      <div className="info-container">
        {eventoSelecionado && (
          <EventModal evento={eventoSelecionado} onClose={handleEventClose} />
        )}
      </div>
    </div>
  );
}

export default Calendarioo2;