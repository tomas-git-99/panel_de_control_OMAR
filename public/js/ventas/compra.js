import { algo_salio_mal } from "../helpers/para_todos/alertas.js";
import { cargaMedio, load_normal } from "../helpers/para_todos/carga_de_botones.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { fecthNormalGET, fecthNormalGET_QUERY, fecthNormalPOST_PUT} from "../helpers/ventas/fetch.js";



const cantidad    = document.querySelector(".cantidad");
const formAgregar = document.querySelector(".formAgregar")
const checkAgregar = document.getElementById("checkAgregar");
const bienvenido = document.getElementsByClassName("cartel");




//CARGAR HISTORIAL DE LA DB
const main_historial = () => {
  cargaMedio("spinner_load", true);

  fecthNormalGET("GET", "producto")
        .then(res => {
          cargaMedio("spinner_load", false);

          leerHistorial(res.productos)
        })
        .catch( err =>{
          algo_salio_mal(`Algo salio mal: ${ err }`)
      })
}
main_historial()

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
const boton_para_cargar = document.querySelector(".boton_para_cargar")
window.enviar_datos_producto = (id) => {

  load_normal(boton_para_cargar, true)
  const id_usuario = localStorage.getItem("id");

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
      cantidad_unica.value = "";
      talle_unico.value = "";
      load_normal(boton_para_cargar, false, "Agregar");
      

    }else if (res.error == 10 || res.error == "10"){
      localStorage.removeItem("x-token");
      window.location.href = `${window.location.origin}/index.html`
    }else{
      load_normal(boton_para_cargar, false, "Agregar")
      console.log(res)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salio mal, vuelva intentarlo en unos minutos, si el error sigue comuniquese con servicio',
      })
    }
  })
  .catch(err => {
    load_normal(boton_para_cargar, false, "Agregar")

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
        <td data-label="TALLES">${e.talles == null ? "- -" : e.talles}</td>
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
            .catch( err =>{
              algo_salio_mal(`Algo salio mal: ${ err }`)
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
      .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}

opcionesDeLocales();

window.cambioDeLocal = (dato) => {

  cargaMedio("spinner_load", true);
  if (dato.value == 0){
     fecthNormalGET("GET", "producto")
      .then(res => {
        cargaMedio("spinner_load", false);
        leerHistorial(res.productos);
      })
      .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
  }

  fecthNormalGET_QUERY("GET", "producto/locales/seleccionado/local?", "local=", dato.value)
      .then((response) => {
        cargaMedio("spinner_load", false);

        leerHistorial(response.locales);
      })
      .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
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

window.cerrar_seccion = () => {
  cerrar_login();
}

const nombre = localStorage.getItem("nombre");


const nombre_usario = document.querySelector("#nombre_usario");


nombre_usario.innerHTML =  nombre;
