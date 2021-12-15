import { fecthNormalGET, fecthNormalGET_QUERY, fecthNormalPOST_PUT} from "../helpers/ventas/fetch.js";



const cantidad    = document.querySelector(".cantidad");
const formAgregar = document.querySelector(".formAgregar")
const checkAgregar = document.getElementById("checkAgregar");


//CARGAR HISTORIAL DE LA DB
fecthNormalGET("GET", "producto")
      .then(res => {
        leerHistorial(res.productos)
      });

//FIN ARGAR HISTORIAL DE LA DB
const aca_viene_id_producto = document.getElementById("aca_viene_id_producto");
const talle_unico = document.getElementById("talle_unico");
const cantidad_unica = document.getElementById("cantidad_unica");

window.boton_agregar = (event) => {
 /*  cantidad.style.opacity = 1; */
 cantidad.style.display = "grid";
 cantidad.style.visibility = "visible";
 aca_viene_id_producto.id = event;


}

window.enviar_datos_producto = (id) => {

  const id_usuario = localStorage.getItem("id");

  console.log(id_usuario);
  let data = {
    id_usuario:id_usuario,
    id_producto: id,
    cantidad: cantidad_unica.value
  }

  if(checkAgregar.checked){
    data["talle"] = talle_unico.value;
    
  }

  

  fecthNormalPOST_PUT("POST", "carrito", data)
  .then( res => {
    if(res.ok){
      console.log("todo salio bien");
      cantidad_unica.value = "";
      talle_unico.value = "";

    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salio mal, vuelva intentarlo en unos minutos, si el error sigue comuniquese con servicio',
      })
    }
  })
  .catch(err => {
    console.log(err)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Algo salio mal, vuelva intentarlo en unos minutos, si el error sigue comuniquese con servicio',
    })
  })
      
}

const tablaCompra = document.querySelector(".tablaCompra")

const leerHistorial = (res) => {

  let historial = ""
  res.map( e => {
      historial += `
      <tr>
        <td data-label="ID">${e.id}</td>
        <td data-label="NOMBRE">${e.nombre}</td>
        <td data-label="STOCK">${e.cantidad}</td>
        <td data-label="TALLES">1,2,3,4,5</td>
        <td data-label="TELA">${e.tela}</td>
        <td data-label="LOCAL">${e.local}</td>
        <td data-label="PRECIO">$${e.precio}</td>
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

/* formAgregar.addEventListener("submit", (event) => {

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
          console.log(err)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo salio mal, vuelva intentarlo en unos minutos, si el error sigue comuniquese con servicio',
          })
        })
            

  }) */


const carrito = document.querySelector(".carrito");
const talleUnica = document.querySelector(".talleUnica");

carrito.addEventListener("click", () => {

    window.location = "carrito.html"

})






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


  cantidad.style.display = "none";
  cantidad.style.visibility = "hidden";

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


const menu = document.querySelector(".menu");

window.style_menu = () => {
    menu.style.left = "0px"
    menu.style.transition = ".5s all"
    menu.style.zIndex = "200"
}

window.style_menu_salir = () => {
    menu.style.left = "-300px"
    menu.style.transition = ".5s all"
}