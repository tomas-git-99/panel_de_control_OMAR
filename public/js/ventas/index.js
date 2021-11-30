

const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : '';


const historialGet = () => {

    fetch(url + "producto",{
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        leerHistorial(res.productos)
    })
    .catch(err => {
        console.error(err)
  
    })
}


const prueba = document.querySelector(".prueba")


const leerHistorial = (res) => {

    let historial = ""
    res.forEach( e => {
        historial += `
        <tr class="prueba">
          <th scope="row">${e.id}</th>

          <td>${e.nombre}</td>
          <td>${e.cantidad}</td>
          <td>1,2,3,4,5</td>
          <td>${e.tela}</td>
          <td>${e.local}</td>
          <td>$${e.precio}</td>
          </tr>
        `;
        

    })

    prueba.innerHTML = historial;
}


historialGet();
