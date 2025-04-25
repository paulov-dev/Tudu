import "./Calendario.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import eventosPadrao from "./eventosPadrao";
import EventModal from "./EventModal";
import LoginButton from "../buttons/LoginButtons/LoginButton";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function CalendarioTarefas() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEventos = async () => {
    try {
      const response = await fetch("https://localhost:7071/api/Tarefas");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const eventosFormatted = data.map((evento) => {
            const dataInicio = evento.dataInicio
              ? new Date(evento.dataInicio)
              : new Date();
            const dataEntrega = evento.dataEntrega
              ? new Date(evento.dataEntrega)
              : new Date();

            return {
              id: evento.id,
              title: evento.titulo || "Sem título",
              start: dataInicio,
              end: dataEntrega,
              desc: evento.descricao || "Sem descrição",
              color: "#418dff",
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

    const interval = setInterval(() => {
      fetchEventos();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshKey]);

  const forceRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const eventStyle = (event) => ({
    style: {
      backgroundColor: event.color || "#418dff",
    },
  });

  const MoverEventos = async (data) => {
    const { start, end, event } = data;

    try {
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

      const response = await fetch(`https://localhost:7071/api/Tarefas/${event.id}`);
      if (response.ok) {
        const tarefa = await response.json();

        const tarefaAtualizada = {
          ...tarefa,
          dataInicio: new Date(start).toISOString(),
          dataEntrega: new Date(end).toISOString(),
        };

        const updateResponse = await fetch(`https://localhost:7071/api/Tarefas/${event.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tarefaAtualizada),
        });

        if (!updateResponse.ok) {
          console.error("Erro ao atualizar tarefa após arrastar");
          fetchEventos();
        }
      } else {
        console.error("Erro ao buscar tarefa para atualização");
        fetchEventos();
      }
    } catch (error) {
      console.error("Erro ao mover evento:", error);
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
        <PriorityButton
          PriorityText="Atualizar Calendário"
          backgroundColor="var(--lightblue)"
          FunctionPrioritybtn={forceRefresh}
        />
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

export default CalendarioTarefas;
