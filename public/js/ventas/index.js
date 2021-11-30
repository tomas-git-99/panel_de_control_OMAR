

const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : '';


const historialGet = () => {

    fetch(url, "producto")
    .then(response => response.json())
    .then(res => {
        leerHistorial(res)
    })
    .catch(err => {
        console.error(err)
  
    })
}



const leerHistorial = (res) => {

    let historial = ""
    res.map( e => {
        historial = `
        <tbody>
        <tr>
          <th scope="row">${e.id}</th>

          <td>${e.nombre}</td>
          <td>${e.cantidad}</td>
          <td>1,2,3,4,5</td>
          <td>${e.tela}</td>
          <td>${e.local}</td>
          <td>$${e.precio}</td>
        </tr>

      </tbody>
        `;
        
    })
}


historialGet()