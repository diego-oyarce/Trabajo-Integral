let fileInput = document.getElementById('file-input');
let boton = document.getElementById('subirArchivo');
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
  fetch('http://localhost:9999/ws/api/parametros/post', config)
    .then(response => response.json())
    .then(response => alert(response.mensaje));
}
