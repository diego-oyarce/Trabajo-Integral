const { number } = require("mathjs");
import {number} from 'mathjs'

var arrayPuntosDeVenta = new String(); //número identificador contenido en el archivo de parametros
var arrayCentrosDeDistribución = new String(); ////número identificador contenido en el archivo de parametros

function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    var contenido = e.target.result;
    var arrayParametros = new Array();
    arrayParametros = separarDatos(contenido);
    if(estructuraArchivo(arrayParametros)){
      mostrarContenido(contenido);
    }
    else{
      alert("El formato del archivo ingresado es incorrecto.");
      return false;
    }
    
  };
  lector.readAsText(archivo);
}
  
function mostrarContenido(contenido) {
  var elemento = document.getElementById('contenido-archivo');
  elemento.innerHTML = contenido;
}

document.getElementById('file-input').addEventListener('change', leerArchivo, false);

function separarDatos(contenido){
  var arrayAux = new String();
  var newstr2 = new String();
  var newstr = contenido.replace(/\n/g,";");
  newstr2 = newstr.replace(/\s/g,"");
  arrayAux = newstr2.split(";");
  //alert(arrayAux[]);
  return arrayAux;
}

function estructuraArchivo(arrayParametros){
  if((arrayParametros.lenght % 4) == 0){
    verificarVentaODistribucion(arrayParametros);
    return true;
  }
  else{
    alert("El formato del archivo ingresado es incorrecto.");
    return false;
  }
}

function verificarVentaODistribucion(arrayParametros){
  for(let i=0; i<arrayParametros.lenght; (i+3)){
    let letra = arrayParametros[i];
    if((letra != 'P') || (letra != 'C')){
      alert("El formato del archivo ingresado es incorrecto.");
      return false;
    }
    else{
      if(verificarIdentificador(arrayParametros)){
        return true;
      }
      else{
        alert("El formato del archivo ingresado es incorrecto.");
        return false;
      }
    }
  }
}

function verificarIdentificador(arrayParametros){
  for(let i=1; i<arrayParametros.lenght; (i+3)){
    if(typeof(arrayParametros[i]) == 'number'){
      verificarCoordenadas(arrayParametros);
      return true;
    }
    else{
      alert("El formato del archivo ingresado es incorrecto.");
      return false;
    }
  }
}

function verificarCoordenadas(arrayParametros){
  let coordenadas = new Array();
  for(let i=2; i<arrayParametros.lenght; (i+3)){
    coordenadas = arrayParametros[i].split(",");
    if((typeof(coordenadas[0]) == "number") && (typeof(coordenadas[1] == "number"))){
      return true;
    }
    else{
      alert("El formato del archivo ingresado es incorrecto.");
      return false;
    }
  }
}