
const url = "url"


const historialGet = () => {

    fetch(url, "historial",{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        leerHistorial(res)
    })
    .catch(err => {
        alert("Error: " + err.message)
    })
}



const leerHistorial = (res) => {

    let historial = ""
    res.map( e => {
        historial = `
        <tbody>
        <tr>
          <th scope="row">134</th>

          <td>${e.nombre}</td>
          <td>689</td>
          <td>1,2,3,4,5</td>
          <td>la mejor</td>
          <td>bogota 5090</td>
          <td>$567</td>
        </tr>

      </tbody>
        `;
        
    })
}


historialGet()