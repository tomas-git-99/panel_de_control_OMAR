
import { advertencia, algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { cargaMedio, load_normal } from "../helpers/para_todos/carga_de_botones.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { devolverString } from "../helpers/para_todos/null.js";
import { usuarioPermisos } from "../helpers/para_todos/usuarios_permisos.js";
import { fecthNormalGET, fecthNormalGET_QUERY, fecthNormalPOST_PUT} from "../helpers/ventas/fetch.js";
import { conteoPorTalle, imprimirTallesEnCadaProducto } from "../helpers/ventas/productos_ventas.js";

const rol = localStorage.getItem('roles');
usuarioPermisos( rol, "produccion");




const cantidad    = document.querySelector(".cantidad");
const formAgregar = document.querySelector(".formAgregar")
const checkAgregar = document.getElementById("checkAgregar");
const bienvenido = document.getElementsByClassName("cartel");




//CARGAR HISTORIAL DE LA DB
let numeroPaginas = null;
let valorGuardado 
const main_historial = (offset=0) => {

  cargaMedio("spinner_load", true);
  let usuario = localStorage.getItem("id")


  fecthNormalGET("GET", "producto?offset="+offset+"&usuario="+usuario)
        .then(res => {
          cargaMedio("spinner_load", false);
          if(numeroPaginas == null || numeroPaginas == "null" ){
            paginacion(res.contador)
          }
          numeroPaginas = res.contador;
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

const talles_del_producto = document.querySelector(".talles_del_producto");

let arrayTalle;
window.boton_agregar = (event) => {

  let array = event.value.split(",");
  arrayTalle = array;
  let historial = "";

  for(let i of array) {

    historial += `
    <div class="form-group">
    <label for="exampleFormControlInput1">${i}</label>
    <input type="number" class="form-control" id="talle_unico_${i}" style="width:50px">
    </div>
    `
  }

  talles_del_producto.innerHTML = historial;

  
 /*  cantidad.style.opacity = 1; */
 cantidad.style.display = "grid";
 cantidad.style.visibility = "visible";
 aca_viene_id_producto.id = event.id;

}
const boton_para_cargar = document.querySelector(".boton_para_cargar");

talles_del_producto.addEventListener("keyup", (keyCode) => {
  const id_usuario = localStorage.getItem("id");

/*   console.log(keyCode.keyCode); */
  if(keyCode.keyCode == 13) {
 /*    console.log(keyCode.path[0].value); */
    let separador = keyCode.path[0].id; 
    if(keyCode.path[0].value.length == 0){
      return advertencia("Se te olvido colocar un valor")
    }
    
    let talles = separador.split("_")[2];
    let data = {
      id_usuario:id_usuario,
      id_producto: aca_viene_id_producto.id,
      cantidad: keyCode.path[0].value,
      talle:talles
    }

    

    enviarFormCarrito(data, keyCode.path[0].id)
    
    
  }
})

cantidad_unica.addEventListener("input", (valor) => {
 
  for(let e of arrayTalle) {
    let talle_unico = document.getElementById(`talle_unico_${e}`);
    talle_unico.value = valor.target.value;
    talle_unico.disabled = true;
    
  }

  if(valor.target.value.length == 0 || valor.target.value == ''){
    for(let e of arrayTalle) {
      let talle_unico = document.getElementById(`talle_unico_${e}`);
      talle_unico.disabled = false;
      
    }
  }

})

window.enviar_datos_producto = (id) => {

  load_normal(boton_para_cargar, true)
  const id_usuario = localStorage.getItem("id");

  let data = {
    id_usuario:id_usuario,
    id_producto: id,
    cantidad: cantidad_unica.value
  }

  /* if(checkAgregar.checked){
    data["talle"] = talle_unico.value;
    
  }

 */
  // if(document.querySelector(`#seleccion_talles_${id}`).length > 1){

 
  //   if(data.talle == undefined){
  //     load_normal(boton_para_cargar, false, "Agregar")

  //     return advertencia("Seleccione el talle para este producto")
  //   }
  // }

  if(cantidad_unica.value.length <= 0 || cantidad_unica.value == 0 || cantidad_unica.value == "0"){
    load_normal(boton_para_cargar, false, "Agregar")

    return advertencia("Se te olvido colocar la cantidad / Nose acepta el valor 0")
  }


  enviarFormCarrito(data)

      
}

const enviarFormCarrito = (data , limpiar="") => {
  fecthNormalPOST_PUT("POST", "carrito", data)
  .then( res => {
    if(res.ok == true){
      cantidad_unica.value = "";
      talle_unico.value = "";
      //if(limpiar !== "")document.getElementById(`${limpiar}`).value = "";
      for(let e of arrayTalle) {
        let talle_unico = document.getElementById(`talle_unico_${e}`);
        talle_unico.disabled = false;
        talle_unico.value = "";
        
      }
      load_normal(boton_para_cargar, false, "Agregar");

      return salio_todo_bien()
    }else if (res.error == 10 || res.error == "10"){
      localStorage.removeItem("x-token");
      window.location.href = `${window.location.origin}/index.html`
    }else{
      
      load_normal(boton_para_cargar, false, "Agregar")
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salio mal, vuelva intentarlo en unos minutos, si el error sigue comuniquese con servicio',
      })
    }
  })
  .catch(err => {
    load_normal(boton_para_cargar, false, "Agregar")

    return Swal.fire({
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
        <td data-label="ARTICULO">${devolverString(e.productos.id)}</td>
        <td data-label="MODELO">${devolverString(e.productos.nombre)}</td>
        <td data-label="DISE??O">${devolverString(e.productos.dise??o)}</td>
        <td data-label="DISE??O">${devolverString(e.productos.color)}</td>
        <td data-label="STOCK">${e.talles.length > 0 ? conteoPorTalle(e.talles) : devolverString(e.productos.cantidad)}</td>
        <td data-label="TALLES">
        <div class="opcionesDeTalles">
        <select class="form-control form-control-sm" id="seleccion_talles_${e.productos.id}">
            <option value="0">${devolverString(e.productos.talles)}</option>
            
          </select>
          </div>
        </td>
        <td data-label="TELA">${devolverString(e.productos.tela)}</td>
        <td data-label="LOCAL">${devolverString(e.productos.local)}</td>
        <td data-label="PRECIO">$${devolverString(e.productos.precio)}</td>
        <td>
        <div class="boton preview">
            <button class="eliminar" value="${e.productos.talles}" id="${e.productos.id}" onclick="boton_agregar(this)" >
                Agregar
            </button>
        </div>
        </td>
        </tr>
      `;
      

    })
    tablaCompra.innerHTML = historial;

    imprimirTallesEnCadaProducto(res);




}



const carrito = document.querySelector(".carrito");
const talleUnica = document.querySelector(".talleUnica");

carrito.addEventListener("click", () => {

    window.location = "carrito.html"

})





/* 
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

}); */


/////BUSCADOR//////

const search = document.querySelector("#search");

search.addEventListener("keyup", ({keyCode}) => {

    if( keyCode !== 13){return;}
    if(search.length === 0){return;}

    numeroPaginas = null;
    buscador(search.value);
    search.value = "";
});
const volver_Atras_buscar = document.querySelector(".volver_Atras_buscar");

const buscador = (valor, offset=0) => {
  let usuario = localStorage.getItem("id")

  cargaMedio("spinner_load", true);
  fecthNormalPOST_PUT("GET", `producto/search?nombre=${valor}&offset=${offset}&usuario=${usuario}`)
  .then(res => {
    if(numeroPaginas == null || numeroPaginas == "null" ){
      paginacion(res.contador, "buscador")
    }
  cargaMedio("spinner_load", false);

    numeroPaginas = res.contador;
    valorGuardado = valor;
    volver_Atras_buscar.style.display = "grid";
    volver_Atras_buscar.style.visibility = "visible";
    leerHistorial(res.productos)
  })
  .catch( err =>{
    algo_salio_mal(`Algo salio mal: ${ err }`)
})
}


window.volver_inicio = () => {
  numeroPaginas = null;
  volver_Atras_buscar.style.display = "none";
  volver_Atras_buscar.style.visibility = "hidden";

  main_historial();
}
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

//opcionesDeLocales();

window.cambioDeLocal = (dato) => {

  numeroPaginas = null;

  cargaMedio("spinner_load", true);

  if (dato.value == 0){
    main_historial();
    }else{
      buscarLocales(dato.value);
  }

}



const buscarLocales = (valor, offset=0) => {
  fecthNormalPOST_PUT("GET", `producto/locales/seleccionado/local?local=${valor}&offset=${offset}`)
  .then((res) => {
    cargaMedio("spinner_load", false);

    if(numeroPaginas == null || numeroPaginas == "null" ){
      paginacion(res.contador, "locales")
    }
    numeroPaginas = res.contador;
    valorGuardado = valor;
    leerHistorial(res.productos);
    })
    .catch( err =>{
    cargaMedio("spinner_load", false);

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




const paginacion = (valor, query=undefined) => {

  if(query !== undefined){
      numeroPaginas = null;
  }

  let valorNumero = parseInt(valor);

  const pagination = document.querySelector(".pagination");

  let calcularPagina = valorNumero / 10;

  let paginas = Math.ceil(calcularPagina);

  let historial = ""

  for (let i = 1; i <= paginas; i++) {
      let valor = 0

      if (i == 1){
          historial += `
          <li class="page-item active" onclick="pagina_id(this.id)" id=${"pagina-"+valor+"-"+query} ><a class="page-link" href="#">${i}</a></li>

          `
      }else{
          valor = i - 1;
          historial += `
          <li class="page-item" onclick="pagina_id(this.id)" id=${"pagina-"+valor+"-"+query} ><a class="page-link" href="#">${i}</a></li>
  
          `
      }

  }

  pagination.innerHTML = historial;


}


let recargaPaginaIgual

window.pagina_id = (e) => {

  const arrNombresFiltro = ["fecha_de_salida", "fecha_de_entrada", "fecha_de_pago", "id_taller"]

  const cambiarSeleccion = document.getElementById(`${e}`);
  const active = document.querySelector(`.active`);


  let datos = e.split("-")

  if(active.id == e){
      return
  }

  cambiarSeleccion.className = "page-item active";
  active.className = "";

  if(datos[2] == "locales"){

    if(datos[1] == 0){
      return buscarLocales(valorGuardado)
    }else{

      return buscarLocales(valorGuardado, datos[1]+"0")
    }
  }

  if(datos[2] == "buscador"){
    if(datos[1] == 0){
      return buscador(valorGuardado)
    }else{

      return buscador(valorGuardado, datos[1]+"0")
    }
  }

  if(datos[1] == 0){
      recargaPaginaIgual = "0";
      main_historial();
    
  }else{
      
    main_historial(datos[1]+"0") 
      recargaPaginaIgual = datos[1]+"0";
  }

  
}



