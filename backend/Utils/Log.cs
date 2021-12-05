using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace backend.Utils
{
    public class Log
    {
        public static void crearLog(string mensaje)
        {
            string path_base = WebConfigurationManager.AppSettings["path_base"];
            string ruta = path_base+@"\logs\";
            string nombre ="LOG_" + DateTime.Now.ToString("yyyyMMdd") + ".txt";

            if (!Directory.Exists(ruta)) Directory.CreateDirectory(ruta);
            if (!File.Exists(ruta + nombre)) File.Create(ruta + nombre);
            string[] lineas = File.ReadAllLines(ruta + nombre);
            List<string> tmp = lineas.ToList<string>();
            tmp.Add(DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss") + "\t" + mensaje);

            File.WriteAllLines(ruta + nombre, tmp.ToArray<string>());

        }
    }
}