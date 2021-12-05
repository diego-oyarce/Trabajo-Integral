using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace backend.Models
{
    public class Parametros
    {
        public int id { get; set; }
        public char tipo { get; set; }
        public int x { get; set; }
        public int y { get; set; }

        public Parametros(int id, char tipo, int x, int y)
        {
            this.id = id;
            this.tipo = tipo;
            this.x = x;
            this.y = y;
        }
    }
}