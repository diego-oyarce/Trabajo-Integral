using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace backend
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Configuración y servicios de API web

            // Rutas de API web
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "GetDemandas",
                routeTemplate: "api/{controller}/{Action}/{id}",
                defaults: new { 
                    Controller = "Demandas",
                    Action = "Get",
                    id = RouteParameter.Optional 
                }
            );
            config.Routes.MapHttpRoute(
                name: "GetParametros",
                routeTemplate: "api/{controller}/{Action}/{id}",
                defaults: new
                {
                    Controller = "Parametros",
                    Action = "Get",
                    id = RouteParameter.Optional
                }
            );
        }
    }
}
