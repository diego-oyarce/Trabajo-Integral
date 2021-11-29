function leerArchivo(e) {
  var archivo = e.target.files[0];
  if (!archivo) {
    return;
  }
  var lector = new FileReader();
  lector.onload = function(e) {
    var contenido = e.target.result;
    separarDatos(contenido);
    mostrarContenido(contenido);
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
  alert(arrayAux);
}
