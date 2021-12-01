


const url = ( window.location.hostname.includes('localhost'))
? 'http://localhost:8000/api/'
: '';


const cantidad    = document.querySelector(".cantidad");
const formAgregar = document.querySelector(".formAgregar")





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
historialGet();
const prueba = (event) => {
  cantidad.style.opacity = 1;

  localStorage.setItem("id_producto", event);
}
const tablaCompra = document.querySelector(".tablaCompra")

const leerHistorial = (res) => {

  let historial = ""
  res.map( e => {
      historial += `
      <tr>
        <th scope="row">${e.id}</th>

        <td>${e.nombre}</td>
        <td>${e.cantidad}</td>
        <td>1,2,3,4,5</td>
        <td>${e.tela}</td>
        <td>${e.local}</td>
        <td>$${e.precio}</td>
        <td>
        <div class="boton preview">
            <button class="eliminar" id="${e.id}" onclick="prueba(this.id)" >
                Agregar
            </button>
        </div>
        </td>
        </tr>
      `;
      

    })
    tablaCompra.innerHTML = historial;

}




  formAgregar.addEventListener("submit", (event) => {

      event.preventDefault();

      const id_producto = localStorage.getItem("id_producto");
      const id_usuario = localStorage.getItem("id");

      const forData = {id_producto, id_usuario};

      for(let el of formAgregar.elements){
          if(el.name.length > 0)
              forData[el.name] = el.value;    
          } 
    //agregar a carrito para despues comprar con el metodo POST

    fetch(url + "carrito" ,{ 
      method: "POST",
      body: JSON.stringify( forData ),
      headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
      // alert("salio todo bien")
      if(res.ok){
        cantidad.style.opacity = 0;
        localStorage.removeItem("id_producto")
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salio mal, vuelva intentarlo en unos minutos, si el error sigue comuniquese con servicio',
        })
      }
  
    })
    .catch(err => {
        alert("Error: " + err)
    });
            
    




  })


  const carrito = document.querySelector(".carrito");

  carrito.addEventListener("click", () => {

    window.location = "/page/roles/admin/ventas/carrito.html"

  })


  const talleUnica = document.querySelector(".talleUnica");
  const checkAgregar = document.getElementById("checkAgregar");


checkAgregar.addEventListener("change", (e) => {
  e.preventDefault();

  if(checkAgregar.checked){

    talleUnica.style.display = "grid";
    talleUnica.style.visibility = "visible";

  }else{
    talleUnica.style.display = "none";
    talleUnica.style.visibility = "hidden";
  }

});


/////BUSCADOR//////

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

////BUSCADOR FIN/////



////SALIR DE LA VENTANA DE AGREGAR///////

const titleX = document.querySelector(".titleX");

titleX.addEventListener("click", (e) => {
  e.preventDefault();

  cantidad.style.opacity = 0;

})

//// FIN SALIR DE LA VENTANA DE AGREGAR///////