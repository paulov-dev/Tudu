import "./Calendario.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import 'moment/locale/pt-br';
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventModal from "./EventModal";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

// Definindo locale moment para pt-br (pode manter, mas a tradução será manual)
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const DnDCalendar = withDragAndDrop(Calendar);

// Tradução manual dos dias da semana e meses
const daysOfWeekPT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthsPT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const formats = {
  weekdayFormat: (date) => daysOfWeekPT[date.getDay()],
  monthHeaderFormat: (date) => `${monthsPT[date.getMonth()]} ${date.getFullYear()}`,
  dayHeaderFormat: (date) => {
    const dayName = daysOfWeekPT[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  },
};

const messages = {
  allDay: 'Dia inteiro',
  previous: 'Anterior',
  next: 'Próximo',
  today: 'Hoje',
  month: 'Mês',
  week: 'Semana',
  day: 'Dia',
  agenda: 'Agenda',
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'Nenhum evento neste período.',
  showMore: (total) => `+ ${total} mais`,
};

function CalendarioTarefas() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Estados controlados para data e view
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  const fetchEventos = async () => {
    try {
      const res = await fetch("https://localhost:7071/api/Tarefas", {
        credentials: "include"
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Erro ao buscar tarefas:", res.status, text);
        return;
      }
      const data = await res.json();
      const formatted = data.map(evt => ({
        id: evt.id,
        title: evt.titulo || "—",
        start: evt.dataInicio ? new Date(evt.dataInicio) : new Date(),
        end: evt.dataEntrega ? new Date(evt.dataEntrega) : new Date(),
        desc: evt.descricao || "",
        color: "#418dff"
      }));
      setEventos(formatted);
    } catch (err) {
      console.error("Erro na requisição de tarefas:", err);
    }
  };

  useEffect(() => {
    fetchEventos();
    const interval = setInterval(fetchEventos, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const forceRefresh = () => setRefreshKey(k => k + 1);

  const eventStyleGetter = event => ({
    style: { backgroundColor: event.color }
  });

  const handleMoveResize = async ({ event, start, end }) => {
    setEventos(evts =>
      evts.map(e => (e.id === event.id ? { ...e, start, end } : e))
    );

    try {
      const getRes = await fetch(
        `https://localhost:7071/api/Tarefas/${event.id}`,
        { credentials: "include" }
      );
      if (!getRes.ok) {
        console.error("Erro ao buscar tarefa:", getRes.status);
        return fetchEventos();
      }
      const tarefa = await getRes.json();

      const payload = {
        ...tarefa,
        dataInicio: start.toISOString(),
        dataEntrega: end.toISOString()
      };
      const putRes = await fetch(
        `https://localhost:7071/api/Tarefas/${event.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload)
        }
      );
      if (!putRes.ok) {
        console.error("Erro ao atualizar tarefa:", putRes.status);
        fetchEventos();
      }
    } catch (err) {
      console.error("Erro ao mover/redimensionar evento:", err);
      fetchEventos();
    }
  };

  return (
    <div className="calendar-container">
      {/* Botão para atualizar o calendário (se quiser ativar) */}
      {/* <div className="botao-atualizar">
        <PriorityButton
          PriorityText="Atualizar Calendário"
          backgroundColor="var(--lightblue)"
          FunctionPrioritybtn={forceRefresh}
        />
      </div> */}

      <DnDCalendar
        date={date}
        view={view}
        onNavigate={newDate => setDate(newDate)}
        onView={newView => setView(newView)}
        messages={messages}
        events={eventos}
        localizer={localizer}
        formats={formats}  
        resizable
        onEventDrop={handleMoveResize}
        onEventResize={handleMoveResize}
        onSelectEvent={evt => setEventoSelecionado(evt)}
        eventPropGetter={eventStyleGetter}
        views={["month", "week", "day", "agenda"]}
        step={30}
        showMultiDayTimes
        toolbar
      />

      {eventoSelecionado && (
        <EventModal
          evento={eventoSelecionado}
          onClose={() => setEventoSelecionado(null)}
        />
      )}
    </div>
  );
}

export default CalendarioTarefas;
