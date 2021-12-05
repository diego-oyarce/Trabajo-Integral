using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace backend.Models
{
    public class Demandas
    {
        public int C { get; set; }
        public int P { get; set; }
        public int N { get; set; }

        public Demandas(int C, int P, int N)
        {
            this.C = C;
            this.P = P;
            this.N = N;
        }
    }
}