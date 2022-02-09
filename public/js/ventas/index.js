import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { salio_todo_bien, algo_salio_mal } from "../helpers/para_todos/alertas.js";
import { agregarPorTalle } from "../helpers/ventas/agregar_por_talle.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { verificarToken } from "../helpers/para_todos/permisos.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { usuarioPermisos } from "../helpers/para_todos/usuarios_permisos.js";

import { cargaMedio } from "../helpers/para_todos/carga_de_botones.js";
import { devolverString } from "../helpers/para_todos/null.js";
import { conteoPorTalle, imprimirTallesEnCadaProducto } from "../helpers/ventas/productos_ventas.js";



const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : 'https://tiendamilena.com.ar/api/';

//let token = localStorage.getItem('x-token');

const rol = localStorage.getItem('roles');
let valorGuardado 

usuarioPermisos( rol, "produccion");


    
//verificarToken(token);

let numeroPaginas = null;
const historialGet = (offset=0) => {

    cargaMedio("spinner_load", true);

    fetch(url + "producto?offset="+offset,{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {

        cargaMedio("spinner_load", false);

        if(numeroPaginas == null || numeroPaginas == "null" ){

            paginacion(res.contador)

        }
        numeroPaginas = res.contador;
        leerHistorial(res.productos);
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}

const prueba = document.querySelector(".prueba")
const previsualizar = document.querySelector(".previsualizar");
const producto_id = document.getElementById("producto_id")
const ordenar_por_talle = document.querySelector(".ordenar_por_talle")
const formulario_por_talle = document.querySelector(".formulario");
const boton_ordenar_talle = document.querySelector(".boton_ordenar_talle");
let id_elimanar_producto = document.querySelector(".id_elimanar_producto");

window.abrirVentana = (id) => {

    volverAtras(previsualizar, ordenar_por_talle);

    let nuevoButtonID = `
    <button  type="button" class="btn btn-danger" id="${id}" onclick="salir(this.id)"">Terminar</button>
    <button  type="submit" class="btn btn-success cambiar_carga" id="${id}" onclick="enviar_talle(this.id)">Agregar</button>
    `
    boton_ordenar_talle.innerHTML = nuevoButtonID;

}

window.enviar_talle = (id) => {

    const id_talle = document.getElementById("id_talle");
    const id_cantidad = document.getElementById("id_cantidad");

    let dato = {
        talle: id_talle.value,
        cantidad: id_cantidad.value
    };

    agregarPorTalle(id, dato, "cambiar_carga");
    id_talle.value = "";
    id_cantidad.value = "";

}

window.actualizar_salir = () => {
    previsualizar.style.display = "none";
    previsualizar.style.visibility = "hidden";
  
    /* historialGet(recargaPaginaIgual); */
}

window.salir = (id) => {

    const id_talle = document.getElementById("id_talle");
    const id_cantidad = document.getElementById("id_cantidad");

    ordenar_por_talle.style.display = "none";
    ordenar_por_talle.style.visibility = "hidden";

    id_cantidad.value = "";
    id_talle.value = "";
    previsualizar_producto(id);

}


formulario_por_talle.addEventListener("submit", (e) => {
    e.preventDefault();
});

window.previsualizar_producto = (id) => {
    fecthNormalGET("GET",`producto/${id}`)
    .then((res) => {
      
        if(res.ok){

            ordenarPorTalle(res.talles);
            ordenarProductoTable(res.producto, res.talles);
            producto_id.id = id;
            id_elimanar_producto.id = id;

        }
    }) 
    .catch(err => {
        algo_salio_mal(`Algo salio mal: ${ err }`)
    });
    previsualizar.style.display = "grid";
    previsualizar.style.visibility = "visible";
 
}


const leerHistorial = (res) => {
    let historial = ""
    //devolverString(e.productos.cantidad)

    for(let e of res) {
        historial += `
   
        <tr>
          <td data-label="ARTICULO">${e.productos.id}</td>

          <td data-label="MODELO">${devolverString(e.productos.nombre)}</td>
          <td data-label="DISEÑO">${devolverString(e.productos.diseño)}</td>
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
            <img id="${e.productos.id}"  class="img_previsualizar" src="https://img.icons8.com/pastel-glyph/64/000000/clipboard-preview.png" width="25px" onclick="previsualizar_producto(this.id)"/>
          </td>
        </tr>

   
        `;

        prueba.innerHTML = historial;

    }
    
    imprimirTallesEnCadaProducto(res)
    

}


// const conteoPorTalle = (res) => {
//     let cantidadTotal = 0;
    
//     res.map((e) =>{
//         cantidadTotal = e.cantidad  + cantidadTotal
//     })

//     return cantidadTotal;
// };



// function imprimirTallesEnCadaProducto (res){
    
//     res.map( e => {
//         e.talles.map( i => { 

//             document.getElementById(`seleccion_talles_${i.id_producto}`).innerHTML += `<option>Talle:${i.talle}, Stock:${i.cantidad}</option>`;

//         })
//     })


// }


//BUSCADOR

const search = document.querySelector("#search");

search.addEventListener("keyup", ({keyCode}) => {
    numeroPaginas = null;

    if( keyCode !== 13){return;}
    if(search.length === 0){return;}

    getSearch(search.value);
    search.value = "";
});

const volver_Atras_buscar = document.querySelector(".volver_Atras_buscar");

const getSearch = (valor, offset=0) => {

    
    cargaMedio("spinner_load", true);

    fetch(url + "producto/search?" + `nombre=${valor}&offset=${offset}`,{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        cargaMedio("spinner_load", false);

        if(numeroPaginas == null || numeroPaginas == "null" ){
            paginacion(res.contador, "buscador")
        }
        numeroPaginas = res.contador;
        valorGuardado = valor;
        volver_Atras_buscar.style.display = "grid";
        volver_Atras_buscar.style.visibility = "visible";
        leerHistorial(res.productos);
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}



window.volver_inicio = () => {
    numeroPaginas = null;
    volver_Atras_buscar.style.display = "none";
    volver_Atras_buscar.style.visibility = "hidden";
    historialGet();
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



const datos_producto_table = document.querySelector(".datos_producto_table");


const ordenarProductoTable = (res, talles) => {

  

    let result = ""

   

    

        result += `
            <tr>
            <td>${devolverString(res.nombre)} : </td>
            <td><input type="text" id="producto_nombre" name="nombre"></td>
            <td> 
                <button  id="nombre_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>

            <tr>
            <td>Diseño: ${devolverString(res.diseño)} : </td>
            <td><input type="text" id="producto_diseño" name="diseño"></td>
            <td> 
                <button  id="diseño_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>

            <tr>
            <td>Cantidad Total: (${res.cantidad == null ? conteoPorTalle(talles) : res.cantidad}) : </td>
            <td><input type="text" id="producto_cantidad" name="cantidad"></td>
            <td> 
                <button  id="cantidad_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
                <button  id="cantidad_${res.id}" type="button"  class="btn btn-outline-danger btn-sm" onclick="vaciar_cantidad(this.id)">VACIAR</button>
            </td>
            </tr>
            <tr>
            <td>Talles: (${devolverString(res.talles)}) : </td>
            <td><input type="text" id="producto_talle" name="talles"></td>
            <td> 
                <button  id="talle_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>
           
            <tr>
            <td> Precio:$ ${devolverString(res.precio)} : </td>
            <td><input type="text" id="producto_precio" name="precio" ></td>
            <td> 
                <button  id="precio_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>
            <tr>
            <td>Local: (${devolverString(res.local)}) : </td>
            <td><input type="text" id="producto_local" name="local" ></td>
            <td> 
                <button  id="local_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>
    
        `
   
   

    datos_producto_table.innerHTML = result;
}


const talles_datos = document.querySelector(".talles_datos");


window.vaciar_cantidad = (id) =>{

    const palabras = id.split('_');

    const data = {
        cantidad: null
    }
    fecthNormalPOST_PUT("PUT",`producto/${palabras[1]}?vaciar=true`, data)
        .then( res => {
        
            salio_todo_bien("se cambio correctamente");
        })
        .catch(err => {
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
}

const ordenarPorTalle = (res) => {
    let result = ""
    res.map( e => {
        result += ` 
        <div class="datos_talle" id="datos_talle_${e.id}">
        <label for="">Talle : <span class="label_talle">${e.talle}</span> <span class="label_stock_${e.id}">(${e.cantidad})</span></label>

        <input type="number" name="talle_${e.id}" id="talle_unico_${e.id}" >
        <button  type="button"  class="btn btn-outline-primary  btn-sm" id="${e.id}" onclick="agregar_talle(this.id)">AGREGAR</button>
        <button  type="button"  class="btn btn-outline-warning  btn-sm" id="${e.id}" onclick="restar_talle(this.id)">RESTAR </button>
        <button  type="button" class="btn btn-outline-danger  btn-sm"   id="${e.id}" onclick="eliminar_talle(this.id)">ELIMINAR</button>
        </div>

        `
    })

    talles_datos.innerHTML = result;
}

window.cambiar_dato = (id) => {

    const botonLoad = document.querySelector(`#${id}`);

    const palabras = id.split('_');


    let input = document.getElementById(`producto_${palabras[0]}`);
    const nombre = input.name;
    const valor = input.value.replace(/\s*$/,"");

    
    let dato = {name:valor}

    dato[`${nombre}`] = dato.name;
    delete dato.name;


    botonLoad.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only"></span>`

    botonLoad.className = "btn btn-outline-success"
    botonLoad.innerHTML = `OK`
    input.value = "";

    fecthNormalPOST_PUT("PUT",`producto/${palabras[1]}`, dato )
    .then(res => {
        
        if(res.ok) {
   
            
            botonLoad.className = "btn btn-outline-primary  btn-sm"
            botonLoad.innerHTML = `CAMBIAR`
        
            
        }else {
            botonLoad.className = "btn btn-outline-primary  btn-sm"
            botonLoad.innerHTML = `CAMBIAR`
            algo_salio_mal(res.msg)
        }

    })
    .catch( err =>{
 
        botonLoad.className = "btn btn-outline-primary  btn-sm"
        botonLoad.innerHTML = `CAMBIAR`
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}


//agregar mas stock de un talle
window.agregar_talle = (id) => {
    cambiar_stock_talle(id, "suma");
}
window.restar_talle = (id) => {
    cambiar_stock_talle(id, "restar");
}


//eliminar talle por completo
window.eliminar_talle = (id) => {

    let datos_talle_id = document.getElementById(`datos_talle_${id}`);

    fecthNormalGET("DELETE",`talle/${id}`)
       .then(res => {
           if (res.ok){
            datos_talle_id.style.display= "none";
            salio_todo_bien(res.msg);
           }
       })
       .catch(err => {
        algo_salio_mal(`Algo salio mal: ${ err }`)

       })
}


const cambiar_stock_talle = (id, suma_resta) => {

    let input = document.getElementById(`talle_unico_${id}`);

    let cambiarStock = document.querySelector(`.label_stock_${id}`);

    const forData = {
        cantidad: input.value
    }


    fecthNormalPOST_PUT("PUT", `talle/${suma_resta}/${id}`, forData)
        .then(res => {
            if(res.ok) {
                
                cambiarStock.innerHTML = `(${res.talle.cantidad})`;
                if(suma_resta == "restar"){

                    salio_todo_bien(`Se quito correctamente la cantidad de: ${ input.value }`);
                }else if(suma_resta == "suma"){
                    salio_todo_bien(`Se agrego correctamente la cantidad de: ${ input.value }`);
                    
                }
                input.value = "";
            }else {
                algo_salio_mal(`Algo salio mal`)
            }

        })
        .catch(err => {
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
}



//ELIMINAR  PRODUCTO 

window.eliminar_Producto = (id) => {

    Swal.fire({
        title: '¿Esta seguro que quiere eliminar este producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI'
      }).then((result) => {
          fecthNormalGET("DELETE", `producto/${id}`)
             .then(res => {
                 salio_todo_bien("El producto se elimino con exito")
             })
             .catch((err) => {
                 algo_salio_mal("Error: " + err)
             })
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


    if(datos[2] == "buscador"){

        if(datos[1] == 0){
          return getSearch(valorGuardado)
        }else{
    
          return getSearch(valorGuardado, datos[1]+"0")
        }
      }

    if(datos[2] == "locales"){

        if(datos[1] == 0){
            return buscarLocales(valorGuardado)
          }else{
      
            return buscarLocales(valorGuardado, datos[1]+"0")
          }
    }

    if(datos[1] == 0){
        recargaPaginaIgual = "0";
        historialGet();
      
    }else{
        
        historialGet(datos[1]+"0") 
        recargaPaginaIgual = datos[1]+"0";
    }

    
}



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
  