import "./Calendario.css";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import eventosPadrao from "./eventosPadrao";
import EventModal from "./EventModal";

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);


function Calendario(){
    const [eventos, setEventos] = useState(eventosPadrao)
    const [eventoSelecionado,  SeteventoSelecionado] =useState(null);

    const eventStyle = (event) => ({
        style:{
            backgroundColor:"#418dff",
            // backgroundColor:event.color,
            // font: 'Raleway',
        }
    });



    const MoverEventos = (data) => {
        const {start, end} = data;
        const updatedEvents = eventos.map((event) => {
            if(event.id === data.event.id){
                return{
                    ...event,
                    start:new Date(start),
                    end: new Date(end)
                };
            }
            return event;
    });
        setEventos(updatedEvents)
    }

    const handleEventClick = (evento) =>{
        SeteventoSelecionado(evento);
    }

    const handleEventClose = () =>{
        SeteventoSelecionado(null);
    }



  return (
    <div className="calendar-container"
        //  style={{ height: '90vh', width: '100vh'}}
        

        >
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




        views={["month", "week", "day", "agenda"]}  // Permite alternar entre views
        step={30}  // Passo de tempo (em minutos) para cada evento
        showMultiDayTimes  // Exibe os eventos que ocorrem ao longo de vários dias
        />
        <div className="info-container">
            {eventoSelecionado &&(
                <EventModal
                evento = {eventoSelecionado}
                onClose = {handleEventClose}
                
                ></EventModal>
            )}

        </div>

  </div>
  );
}

export default Calendario;
