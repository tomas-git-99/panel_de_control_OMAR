import { fecthNormalGET } from "../helpers/ventas/fetch.js";


const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : '';

const historialGet = () => {

    fetch(url + "producto",{ 
        method: "GET",
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
    console.log(res)
    let historial = ""
    res.map( e => {
        historial += `
   
        <tr>
          <th scope="row">${e.id}</th>

          <td>${e.nombre}</td>
          <td>${e.cantidad}</td>
          <td>
          <select class="custom-select my-1 mr-sm-2" id="inlineFormCustomSelectPref">
          <option selected>1,2,3,4,5,6</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
          </select>
          </td>
          <td>${e.tela}</td>
          <td>${e.local}</td>
          <td>$${e.precio}</td>
        </tr>

   
        `;
        
    })

    prueba.innerHTML = historial;
}




//BUSCADOR

const search = document.querySelector("#search");

search.addEventListener("keyup", ({keyCode}) => {

    if( keyCode !== 13){return;}
    if(search.length === 0){return;}

    getSearch(search.value);
    search.value = "";
});


const getSearch = (valor) => {

    

    fetch(url + "producto/search?" + `nombre=${valor}`,{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        leerHistorial(res.producto);
    })
    .catch(err => {
        console.error(err)
  
    })
}






//CARGAR EL HISTORIAL CADA VEZ QUE ENTREN A ESTE HTML
historialGet();




//COLOGAR TALLES NUEVOS


const talle_por_ID = (res) => {

    let talles = "";

    res.map( e => {
        talles += `
        <option value="${e.id}"></option>
        `
    })

}

/* fecthNormalGET("GET", `talle/${id_producto}`)
   .then(res => {
       
   }) */
