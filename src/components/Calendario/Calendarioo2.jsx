import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import eventosPadrao from "./eventosPadrao";
import EventModal from "./EventModal";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function Calendario() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, SeteventoSelecionado] = useState(null);

  // Função para buscar as tarefas do backend e atualizar os eventos do calendário
  const fetchEventos = async () => {
    try {
      const response = await fetch('https://localhost:7071/api/Tarefas');
      if (response.ok) {
        const data = await response.json();
        const eventosFormatted = data.map(evento => ({
          id: evento.id,
          title: evento.titulo,
          start: new Date(evento.dataInicio),
          end: new Date(evento.dataEntrega),
          desc: evento.descricao,
          color: '#418dff', // Cor padrão ou use a cor real
        }));
        setEventos(eventosFormatted);
      } else {
        console.error("Erro ao buscar tarefas");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []); // Busca os eventos quando o componente for montado

  const eventStyle = (event) => ({
    style: {
      backgroundColor: "#418dff",
    }
  });

  const MoverEventos = (data) => {
    const { start, end } = data;
    const updatedEvents = eventos.map((event) => {
      if (event.id === data.event.id) {
        return {
          ...event,
          start: new Date(start),
          end: new Date(end),
        };
      }
      return event;
    });
    setEventos(updatedEvents);
  };

  const handleEventClick = (evento) => {
    SeteventoSelecionado(evento);
  };

  const handleEventClose = () => {
    SeteventoSelecionado(null);
  };

  return (
    <div className="calendar-container">
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

export default Calendario;
