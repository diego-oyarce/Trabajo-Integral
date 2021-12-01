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
