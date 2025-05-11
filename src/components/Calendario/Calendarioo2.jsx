import "./Calendario.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import EventModal from "./EventModal";
import PriorityButton from "../buttons/PriorityButton/PriorityButton";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

function CalendarioTarefas() {
  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // **Estados controlados para data e view**
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
    // Atualização local
    setEventos(evts =>
      evts.map(e => (e.id === event.id ? { ...e, start, end } : e))
    );

    try {
      // GET tarefa completa
      const getRes = await fetch(
        `https://localhost:7071/api/Tarefas/${event.id}`,
        { credentials: "include" }
      );
      if (!getRes.ok) {
        console.error("Erro ao buscar tarefa:", getRes.status);
        return fetchEventos();
      }
      const tarefa = await getRes.json();

      // PUT com datas atualizadas
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
      {/* <div className="botao-atualizar">
        <PriorityButton
          PriorityText="Atualizar Calendário"
          backgroundColor="var(--lightblue)"
          FunctionPrioritybtn={forceRefresh}
        />
      </div> */}

      <DnDCalendar
        /** Agora controlado pelo state **/
        date={date}
        view={view}
        onNavigate={newDate => setDate(newDate)}
        onView={newView => setView(newView)}

        events={eventos}
        localizer={localizer}
        resizable
        onEventDrop={handleMoveResize}
        onEventResize={handleMoveResize}
        onSelectEvent={evt => setEventoSelecionado(evt)}
        eventPropGetter={eventStyleGetter}

        /** As views que você quer exibir **/
        views={["month", "week", "day", "agenda"]}
        step={30}
        showMultiDayTimes

        /** Exibe o toolbar padrão com botões de navegação */
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


