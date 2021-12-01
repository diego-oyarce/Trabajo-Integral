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