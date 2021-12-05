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

            StreamWriter streamWriter = new StreamWriter(ruta+nombre);
            streamWriter.WriteLine(DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss") + "\t" + mensaje);

            streamWriter.Close();

        }
    }
}