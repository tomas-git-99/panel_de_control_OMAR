import { fecthNormalGET, fecthNormalGET_QUERY, fecthNormalPOST_PUT} from "../helpers/ventas/fetch.js";



const cantidad    = document.querySelector(".cantidad");
const formAgregar = document.querySelector(".formAgregar")


//CARGAR HISTORIAL DE LA DB
fecthNormalGET("GET", "producto")
      .then(res => {
        leerHistorial(res.productos)
      });

//FIN ARGAR HISTORIAL DE LA DB

window.boton_agregar = (event) => {
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
            <button class="eliminar" id="${e.id}" onclick="boton_agregar(this.id)" >
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
          if(el.name.length > 0){
            if(el.value.length > 0){

              forData[el.name] = el.value;    
            }
          }
             
          }
          
    //agregar a carrito para despues comprar con el metodo POST
    fecthNormalPOST_PUT("POST", "carrito", forData)
        .then( res => {
          if(res.ok){
            cantidad.style.opacity = 0;
            localStorage.removeItem("id_producto");
            for(let el of formAgregar.elements){
              el.value = "";
            }

          }else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Algo salio mal, vuelva intentarlo en unos minutos, si el error sigue comuniquese con servicio',
            })
          }
        })
        .catch(err => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salio mal, vuelva intentarlo en unos minutos, si el error sigue comuniquese con servicio',
          })
        })
            

  })


const carrito = document.querySelector(".carrito");

carrito.addEventListener("click", () => {

    window.location = "/page/roles/admin/ventas/carrito.html"

})


const checkAgregar = document.getElementById("checkAgregar");
const talle_unico = document.getElementById("talle_unico");
const talleUnica = document.querySelector(".talleUnica");


checkAgregar.addEventListener("change", (e) => {
  e.preventDefault();

  if(checkAgregar.checked){

    talleUnica.style.display = "grid";
    talleUnica.style.visibility = "visible";

  }else{
    talleUnica.style.display = "none";
    talleUnica.style.visibility = "hidden";
    talle_unico.value = "";
  }

});


/////BUSCADOR//////

const search = document.querySelector("#search");

search.addEventListener("keyup", ({keyCode}) => {

    if( keyCode !== 13){return;}
    if(search.length === 0){return;}

    fecthNormalGET_QUERY("GET", `producto/search`, "?nombre=", search.value)
            .then(res => {
              leerHistorial(res.producto)
            })
    search.value = "";
});


////BUSCADOR FIN/////



////SALIR DE LA VENTANA DE AGREGAR///////

const titleX = document.querySelector(".titleX");

titleX.addEventListener("click", (e) => {
  e.preventDefault();

  cantidad.style.opacity = 0;

})

//// FIN SALIR DE LA VENTANA DE AGREGAR///////
const seleccion_locales = document.querySelector("#seleccion_locales");


const opcionesDeLocales = () => {
  fecthNormalGET("GET", "producto/locales/todos")
      .then( res => {
        let datos = res.result;
        let result = ""
        datos.map( e => {

          result = `
          <option value="${e}">${e}</option>
          `
          seleccion_locales.innerHTML += result;
        })
      })
}

opcionesDeLocales();

window.cambioDeLocal = (dato) => {

  if (dato.value == 0){
    return fecthNormalGET("GET", "producto")
      .then(res => {
        leerHistorial(res.productos)
      });
  }

  fecthNormalGET_QUERY("GET", "producto/locales/seleccionado/local?", "local=", dato.value)
      .then((response) => {
        leerHistorial(response.locales);
      })
}