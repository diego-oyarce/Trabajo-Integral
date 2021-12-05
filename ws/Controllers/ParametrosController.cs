using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;

namespace backend.Controllers
{
    public class ParametrosController : ApiController
    {
        [HttpGet]
        [ActionName("Get")]
        public SalidaPar Get()
        {
            SalidaPar salida = new SalidaPar();
            string nombre_archivo = "parametros.txt";
            string path_base = WebConfigurationManager.AppSettings["path_base"];
            if (File.Exists(path_base+@"\archivos\" + nombre_archivo))
            {
                try
                {
                    backend.Utils.Log.crearLog("Inicio proceso de lectura de archivo");
                    salida.resp = ParametroProceso.leerArchivo(path_base + @"\archivos\" + nombre_archivo);
                    backend.Utils.Log.crearLog("Finaliza proceso de lectura de archivo");
                    salida.codigo = 0;
                    salida.mensaje = "Archivo subido exitosamente";
                }
                catch (Exception ex)
                {
                    backend.Utils.Log.crearLog(ex.Message.ToString());
                    salida.codigo = -1;
                    salida.mensaje = "Error al leer el archivo, asegurese que este contiene el formato T;N;x,y para cada fila";
                }
            }
            else
            {
                backend.Utils.Log.crearLog("Archivo no encontrado en el sistema");
                salida.codigo = -1;
                salida.mensaje = "Error el archivo no existe en el sistema.";
            }

            return salida;
        }
        [HttpPost]
        [ActionName("Post")]
        public SalidaPar Post()
        {
            SalidaPar salida = new SalidaPar();
            HttpPostedFile archivo = HttpContext.Current.Request.Files["archivo"];
            string ext_archivo = Path.GetExtension(archivo.FileName);
            string nombre_archivo = "parametros.txt";
            string path_base = WebConfigurationManager.AppSettings["path_base"];
            if (ext_archivo == ".txt")
            {
                try
                {
                    backend.Utils.Log.crearLog("Inicio proceso de guardado de archivo");
                    if (!Directory.Exists(path_base + @"\archivos")) Directory.CreateDirectory(path_base + @"\archivos");
                    archivo.SaveAs(path_base+@"\archivos\" + nombre_archivo);
                    backend.Utils.Log.crearLog("Archivo guardado exitosamente");
                }
                catch (Exception ex)
                {
                    backend.Utils.Log.crearLog(ex.Message.ToString());
                    salida.codigo = -1;
                    salida.mensaje = "Error al guardar el archivo en el servidor";
                }

                salida = Get();
            }
            else
            {
                salida.codigo = -1;
                salida.mensaje = "Error en el tipo de archivo subido, se esperaba txt y se obtuvo: " + ext_archivo;
            }

            return salida;
        }
    }
    public class SalidaPar
    {
        public int codigo;
        public string mensaje;
        public IEnumerable<backend.Models.Parametros> resp = null;
    }
    public class ParametroProceso
    {
        public static IEnumerable<backend.Models.Parametros> leerArchivo(string ruta)
        {
            List<backend.Models.Parametros> resp = new List<backend.Models.Parametros>();

            StreamReader sr = new StreamReader(ruta);
            string line = sr.ReadLine();

            while (line != null)
            {
                backend.Utils.Log.crearLog("Intentando Procesar Linea: " + line);
                string[] splited = line.Split(';');
                if (splited.Length > 3 || splited.Length < 3)
                {
                    backend.Utils.Log.crearLog("Cantidad de argumentos por linea incorrectos");
                    throw new Exception("Cantidad de argumentos por linea incorrectos");
                }

                char T;
                if (!char.TryParse(splited[0], out T))
                {
                    backend.Utils.Log.crearLog("Parámetro T no es una letra: " + splited[0]);
                    throw new Exception("Parámetro T no es una letra");
                }

                if(T != 'C' && T != 'P')
                {
                    backend.Utils.Log.crearLog("Parámetro T no contiene el valor de C o P: " + T);
                    throw new Exception("Parámetro T no contiene el valor de C o P");
                }

                int N;
                if (!int.TryParse(splited[1], out N))
                {
                    backend.Utils.Log.crearLog("Parámetro N no es un número: " + splited[1]);
                    throw new Exception("Parámetro N no es un número");
                }
                string[] pos = splited[2].Split(',');
                if (pos.Length > 2 || pos.Length < 2)
                {
                    backend.Utils.Log.crearLog("Cantidad de argumentos por posición x,y incorrectos");
                    throw new Exception("Cantidad de argumentos por posición x,y incorrectos");
                }
                int x;
                if (!int.TryParse(pos[0], out x))
                {
                    backend.Utils.Log.crearLog("Parámetro x no es un número: " + pos[0]);
                    throw new Exception("Parámetro x no es un número");
                }
                int y;
                if (!int.TryParse(pos[1], out y))
                {
                    backend.Utils.Log.crearLog("Parámetro y no es un número: " + pos[1]);
                    throw new Exception("Parámetro y no es un número");
                }
                Models.Parametros parametro = new Models.Parametros(N, T, x, y);
                resp.Add(parametro);
                line = sr.ReadLine();
            }
            sr.Close();

            return resp;
        }
    }
}
