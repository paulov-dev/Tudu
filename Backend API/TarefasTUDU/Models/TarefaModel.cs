﻿using System;


namespace TarefasTUDU.Models
{
    public class TarefaModel
    {
        public int Id { get; set; }
        public string? Titulo { get; set; }
        public string? Descricao { get; set; }
        public DateTime DataEntrega {  get; set; }

        //public StatusTarefa Status { get; set; }




    }
}
