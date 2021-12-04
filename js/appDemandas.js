let fileInput = document.getElementById('file-input');
let boton = document.getElementById('subirArchivo');
let Grafos = [];
let nodos = [];
let demandas = [];

traerNodos();

function traerNodos(){
  let config = {
    method: 'GET'
  }
  fetch('http://localhost:9999/ws/api/parametros/get', config)
    .then(response => response.json())
    .then(response => {
      if(response.codigo == 0){
        nodos = response.resp;
        if(!nodos){
          alert('Aviso: No se han subidos los parámetros. Vuelva a la página de inicio e ingrese el archivo de parámetros.');
        }
      }
      
    });
}


boton.addEventListener('click', (e)=>{
  if(!fileInput.value) return alert('Debe ingresar un archivo.');
  subirArchivo(fileInput.files[0])
})

function subirArchivo(archivo){
  let data = new FormData();
  data.append('archivo', archivo);
  let config = {
    body: data,
    method: 'POST'
  }
  fetch('http://localhost:9999/ws/api/demandas/post', config)
    .then(response => response.json())
    .then(response => {
      alert(response.mensaje);
      if(response.codigo == 0){
        demandas = response.resp;
        if(!nodos) return alert('Aviso: No se han subidos los parámetros. Vuelva a la página de inicio e ingrese el archivo de parámetros.');
        if(!demandas) return alert('Aviso: El archivo de Demandas subido, no contiene datos');
        document.getElementById('obtener-ruta').style.display = '';
      }
      
    });
}

document.getElementById('botonObtenerRutas').addEventListener('click', (e)=>{
  armarGrafos(demandas, nodos);
  let rutas = algoritmoCalculo(Grafos);
  mostrarRutas(rutas);

})

function entregarNodo(transicion, nodoAnterior){
  if(transicion.nodoA == nodoAnterior) return transicion.nodoB;
  if(transicion.nodoB == nodoAnterior) return transicion.nodoA;
}

function mostrarRutas(rutas){
  let divRutas = document.getElementById('rutas');
  divRutas.style.display = '';
  divRutas.innerHTML = '<hr> <h6>Mejores Rutas</h6>';
  if(rutas.length == 0) return divRutas.innerHTML += '<h6>No existen rutas.</h6>'
  rutas.forEach((ruta, i) => {
    let pesoTotal = 0;
    let nodoAnterior = 'E0';
    let texto = `<strong>Camión ${i+1}:</strong> E0 `;
    ruta.forEach(transicion=>{
      let siguienteNodo = entregarNodo(transicion, nodoAnterior);
      texto += '-> ' + siguienteNodo + ' ';
      pesoTotal += transicion.peso;
      nodoAnterior = siguienteNodo;
    })

    divRutas.innerHTML += `<div class="alert alert-primary" style="max-width: 60vh">${texto}- <strong>Distancia Total</strong>: ${pesoTotal.toFixed(5)} km</div>`;

  })

}

class Grafo{
    nodos = [];
    transiciones = [];
  
    constructor(nodos, transiciones){
      this.nodos = [new Nodo('E0', 'E', 0, 0), ...nodos];
      this.transiciones = [this.crearTransicionInicial(nodos), ...transiciones, ...this.crearTransiciones(this.nodos)];
    }
  
    crearTransicionInicial(nodos){
      let centro = nodos.filter((nodo)=>{
        if(nodo.tipo == 'C'){
          return nodo;
        }
      })
  
      return new Transicion('E0', centro[0].id, centro[0].calcularDistancia(0, 0));
    }
  
    crearTransiciones(nodos){
      let newTransiciones = [];
      for(let i = 0; i < nodos.length; i++){
        if(nodos[i].tipo != 'C' && nodos[i].tipo != 'E'){
          for(let j = i + 1; j < nodos.length; j++){
            if(nodos[j].tipo != 'C' && nodos[j].tipo != 'E'){
              newTransiciones.push(new Transicion(nodos[i].id, nodos[j].id, nodos[i].calcularDistancia(nodos[j].x, nodos[j].y)));
            }
          }
        }
      }
      return newTransiciones;
    }  
}

class Nodo{
    id = 0;
    tipo = '';
    x = 0;
    y = 0;
    demanda = 0;
    
    constructor(id, tipo, x, y, demanda = 0){
      this.id = id;
      this.tipo = tipo;
      this.x = x;
      this.y = y;
      this.demanda = demanda;
    }
  
    calcularDistancia(x, y){
      let numb = ((x - this.x)**2 + (y - this.y)**2) ** 0.5;
      return Math.round((numb + Number.EPSILON) * 100000)/100000;
    }
  
}

class Transicion{
    nodoA = 0;
    nodoB = 0;
    peso = 0;
  
    constructor(nodoA, nodoB, peso){
      this.nodoA = nodoA;
      this.nodoB = nodoB;
      this.peso = peso;
    }
  
}

let Grafos = [];

function existeNodo(id, nodos){
  for(let i = 0; i < nodos.length; i++){
    if(nodos[i].id == id){
      return true;
    }
  }
  return false;
}

function armarGrafos(demandas, nodos){
  let centros = [];
  for(let i = 0; i < demandas.length; i++){
    if(centros.indexOf(demandas[i].C) == -1){
      centros.push(demandas[i].C);
      let nodoCentro = null;
      let nNodos = [];
      let transiciones = [];

      for(let j = 0; j < nodos.length; j++){
        if(demandas[i].C == nodos[j].id && nodos[j].tipo == 'C'){
          nodoCentro = new Nodo(`C${nodos[j].id}`, 'C', nodos[j].x, nodos[j].y);
          nNodos.push(nodoCentro);
          break;
        }
      }
      
      for(let j = 0; j < demandas.length; j++){
        if(demandas[i].C == demandas[j].C && !existeNodo(`P${demandas[j].P}`, nNodos)){
          for(let z = 0; z < nodos.length; z++){
            if(nodos[z].id == demandas[j].P && nodos[z].tipo == 'P'){
              transiciones.push(new Transicion(`C${demandas[j].C}`, `P${demandas[j].P}`, nodoCentro.calcularDistancia(nodos[z].x, nodos[z].y)));
              nNodos.push(new Nodo(`${nodos[z].tipo}${nodos[z].id}`, nodos[z].tipo, nodos[z].x, nodos[z].y, demandas[j].N));
              break;
            }
          }
        }
      }
      Grafos.push(new Grafo(nNodos, transiciones));
    }
  }
}

function crearListaNodosEnGrafo(nodos, nodosEnArbol, transiciones){
  let nodosReturn = [];

  for(let i = 0; i < nodosEnArbol.length; i++){
    for(let j = 0; j < transiciones.length; j++){
      if(nodosEnArbol[i].id == transiciones[j].nodoA || nodosEnArbol[i].id == transiciones[j].nodoB){
        for(let z = 0; z < nodos.length; z++){
          if(nodosEnArbol[i].id == transiciones[j].nodoA && transiciones[j].nodoB == nodos[z].id && !nodosEnArbol.includes(nodos[z])){
            nodosReturn.push(nodos[z]);
            break;
          }else if(nodosEnArbol[i].id == transiciones[j].nodoB && transiciones[j].nodoA == nodos[z].id && !nodosEnArbol.includes(nodos[z])){
            nodosReturn.push(nodos[z]);
            break;
          }
        }
      }
    }
  }

  return nodosReturn;
}

function crearListaNodosNoVistos(nodos, nodosEnArbol, nodosEnGrafo){
  let nodosReturn = nodos.filter((nodo)=>{
    if(!nodosEnArbol.includes(nodo) && !nodosEnGrafo.includes(nodo)) return true;

    return false;
  });
  
  return nodosReturn;
}

function indexOf(id, nodos){
  for(let i = 0; i < nodos.length; i++){
    if(id == nodos[i].id) return i;
  }
  return -1;
}

function traerMenorTransicion(nodosGrafos, transiciones, actualSuministro, nodoActual, nodosArbol){

  let transActual = null;

  for(let i = 0; i < transiciones.length; i++){
    let trans = transiciones[i];
    if((!transActual || trans.peso < transActual.peso) && (trans.nodoA == nodoActual || trans.nodoB == nodoActual )){
      let indexA = indexOf(trans.nodoA, nodosGrafos);
      let indexB = indexOf(trans.nodoB, nodosGrafos);
      if(indexA != -1){
        if(actualSuministro - nodosGrafos[indexA].demanda >= 0){
          transActual = trans;
        }
      }
      if(indexB != -1){
        if(actualSuministro - nodosGrafos[indexB].demanda >= 0){
          transActual = trans;
        }
      }
    }
  }

  return transActual;
}

function existenPuntosDeVenta(nodos){
  for(let i = 0; i < nodos.length; i++){
    if(nodos[i].tipo == 'P') return true;
  }
  return false;
}

function eliminarNodosVisitados(nodos, nodosVisitados){
  return nodos.filter((nodo) => !nodosVisitados.includes(nodo) || nodo.tipo == 'C' || nodo.tipo == 'E' );
}

function eliminarTransiciones(nodos, transiciones){
  return transiciones.filter((trans) =>{
    let existeNodoA = false;
    let existeNodoB = false;
    for(let i = 0; i < nodos.length; i++){
      if(nodos[i].id == trans.nodoA){
        existeNodoA = true;
      }else if(nodos[i].id == trans.nodoB){
        existeNodoB = true;
      }

      if(existeNodoA && existeNodoB) break;
    }

    return existeNodoA && existeNodoB;
  })
}

function traerNodoCentro(nodos){
  for(let i = 0; i < nodos.length; i++){
    if(nodos[i].tipo == 'C'){
      return nodos[i];
    }
  }
  return nodos[0];
}

function algoritmoCalculo(grafos){

  let rutasFinales = [];

  grafos.forEach((grafo)=>{
    let nodosArbol = [ grafo.nodos[0] ];
    let nodos = [...grafo.nodos];
    let transiciones = [...grafo.transiciones];
    let nodosGrafos = crearListaNodosEnGrafo(nodos, nodosArbol, transiciones);

    let mejorRuta = [];

    let actualSuministro = 1000;
    let nodoActual = 'E0';

    while(existenPuntosDeVenta(nodos)){
      let ruta = traerMenorTransicion(nodosGrafos, transiciones, actualSuministro, nodoActual, nodosArbol);
      if(ruta){

        mejorRuta.push(ruta);
        let indexA = indexOf(ruta.nodoA, nodosGrafos);
        let index = indexA != -1 ? indexA : indexOf(ruta.nodoB, nodosGrafos);
        let variable = indexA != -1 ? 'nodoA' : 'nodoB';
        
        if(index != -1){
          nodoActual = ruta[variable];
          actualSuministro -= nodosGrafos[index].demanda;
          nodosArbol.push(nodosGrafos[index]);
          nodosGrafos = crearListaNodosEnGrafo(nodos, nodosArbol, transiciones);
        }
        
      }else{
        nodos = eliminarNodosVisitados(nodos, nodosArbol);
        transiciones = eliminarTransiciones(nodos, transiciones);

        mejorRuta.push(new Transicion('E0', nodoActual, grafo.nodos[indexOf(nodoActual, grafo.nodos)].calcularDistancia(0, 0)));
        rutasFinales.push(mejorRuta);
        nodosArbol = [ grafo.nodos[0] ];
        nodoActual = 'E0';
        mejorRuta = [];
        nodosGrafos = crearListaNodosEnGrafo(nodos, nodosArbol, transiciones);
        actualSuministro = 1000;
      }
      
    }
  })
  return rutasFinales;
}