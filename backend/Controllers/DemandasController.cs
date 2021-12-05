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
    public class DemandasController : ApiController
    {
        [HttpGet]
        [ActionName("Get")]
        public Salida Get()
        {
            Salida salida = new Salida();
            string nombre_archivo = "demandas.txt";
            string path_base = WebConfigurationManager.AppSettings["path_base"];
            if (File.Exists(path_base + @"\archivos\" + nombre_archivo))
            {
                try
                {
                    backend.Utils.Log.crearLog("Inicio proceso de lectura de archivo");
                    salida.resp = DemandaProceso.leerArchivo(path_base+@"\archivos\" + nombre_archivo);
                    backend.Utils.Log.crearLog("Finaliza proceso de lectura de archivo");
                    salida.codigo = 0;
                    salida.mensaje = "Archivo subido exitosamente";
                }
                catch (Exception ex)
                {
                    backend.Utils.Log.crearLog(ex.Message.ToString());
                    salida.codigo = -1;
                    salida.mensaje = "Error al leer el archivo, asegurese que este contiene el formato C;P;N para cada fila";
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
        public Salida Post()
        {
            Salida salida = new Salida();
            HttpPostedFile archivo = HttpContext.Current.Request.Files["archivo"];
            string ext_archivo = Path.GetExtension(archivo.FileName);
            string nombre_archivo = "demandas.txt";
            string path_base = WebConfigurationManager.AppSettings["path_base"];
            if (ext_archivo == ".txt")
            {
                try
                {
                    backend.Utils.Log.crearLog("Inicio proceso de guardado de archivo");
                    if (!Directory.Exists(path_base+@"\archivos")) Directory.CreateDirectory(@".\archivos");
                    archivo.SaveAs(path_base+@"\archivos\" + nombre_archivo);
                    backend.Utils.Log.crearLog("Archivo guardado exitosamente");
                }
                catch(Exception ex)
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
    public class Salida
    {
        public int codigo;
        public string mensaje;
        public IEnumerable<backend.Models.Demandas> resp = null;
    }
    public class DemandaProceso
    {
        public static IEnumerable<backend.Models.Demandas> leerArchivo(string ruta)
        {
            List<backend.Models.Demandas> resp = new List<backend.Models.Demandas>();

            StreamReader sr = new StreamReader(ruta);
            string line = sr.ReadLine();

            while(line != null)
            {
                backend.Utils.Log.crearLog("Intentando Procesar Linea: " + line);
                string[] splited = line.Split(';');
                if (splited.Length > 3 || splited.Length < 3) 
                {
                    backend.Utils.Log.crearLog("Cantidad de argumentos por linea incorrectos");
                    throw new Exception("Cantidad de argumentos por linea incorrectos");
                }

                int C;
                if(!int.TryParse(splited[0], out C))
                {
                    backend.Utils.Log.crearLog("Parámetro C no es un número: " + splited[0]);
                    throw new Exception("Parámetro C no es un número");
                }
                int P;
                if (!int.TryParse(splited[1], out P))
                {
                    backend.Utils.Log.crearLog("Parámetro P no es un número: " + splited[1]);
                    throw new Exception("Parámetro P no es un número");
                }
                int N;
                if (!int.TryParse(splited[2], out N))
                {
                    backend.Utils.Log.crearLog("Parámetro N no es un número: " + splited[2]);
                    throw new Exception("Parámetro N no es un número");
                }
                Models.Demandas demanda = new Models.Demandas(C, P, N);
                resp.Add(demanda);
                line = sr.ReadLine();
            }
            sr.Close();
            return resp;
        }
    }
}
