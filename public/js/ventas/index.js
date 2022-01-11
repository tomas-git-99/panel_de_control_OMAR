import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { salio_todo_bien, algo_salio_mal } from "../helpers/para_todos/alertas.js";
import { agregarPorTalle } from "../helpers/ventas/agregar_por_talle.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { verificarToken } from "../helpers/para_todos/permisos.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { cargaMedio } from "../helpers/para_todos/carga_de_botones.js";
import { devolverString } from "../helpers/para_todos/null.js";


const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : 'https://tiendamilena.com.ar/api/';

let token = localStorage.getItem('x-token');

      
verificarToken(token);


const historialGet = () => {

    cargaMedio("spinner_load", true);

    fetch(url + "producto",{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {

        cargaMedio("spinner_load", false);

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
  
    historialGet();
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
            ordenarProductoTable(res.producto);
            producto_id.id = id;

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
   
    res.map( e => {
        historial += `
   
        <tr>
          <td data-label="ID">${e.id}</td>

          <td data-label="NOMBRE">${devolverString(e.nombre)}</td>
          <td data-label="DISEÑO">${devolverString(e.diseño)}</td>
          <td data-label="STOCK">${devolverString(e.cantidad)}</td>
          <td data-label="TALLES">${devolverString(e.talles)}</td>
          <td data-label="TELA">${devolverString(e.tela)}</td>
          <td data-label="LOCAL">${devolverString(e.local)}</td>
          <td data-label="PRECIO">$${devolverString(e.precio)}</td>
          <td>
            <img id="${e.id}"  class="img_previsualizar" src="https://img.icons8.com/pastel-glyph/64/000000/clipboard-preview.png" width="25px" onclick="previsualizar_producto(this.id)"/>
          </td>
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

    
    cargaMedio("spinner_load", true);

    fetch(url + "producto/search?" + `nombre=${valor}`,{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
    cargaMedio("spinner_load", false);

        leerHistorial(res.producto);
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
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



const datos_producto_table = document.querySelector(".datos_producto_table");


const ordenarProductoTable = (res) => {

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
            <td>${devolverString(res.diseño)} : </td>
            <td><input type="text" id="producto_diseño" name="diseño"></td>
            <td> 
                <button  id="diseño_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>

            <tr>
            <td>Cantidad Total: (${devolverString(res.cantidad)}) : </td>
            <td><input type="text" id="producto_cantidad" name="cantidad"></td>
            <td> 
                <button  id="cantidad_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>
            <tr>
            <td>Talles: (${devolverString(res.talles)}) : </td>
            <td><input type="text" id="producto_talle" name="talle"></td>
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

const ordenarPorTalle = (res) => {
    let result = ""
    res.map( e => {
        result += ` 
        <div class="datos_talle" id="datos_talle_${e.id}">
        <label for="">Talle : <span class="label_talle">${e.talle}</span> <span class="label_stock_${e.id}">(${e.cantidad})</span></label>

        <input type="number" name="talle_${e.id}" id="talle_${e.id}" >
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
    const valor = input.value;

    
    let dato = {name:valor}

    dato[`${nombre}`] = dato.name;
    delete dato.name;


    botonLoad.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only"></span>`
    
    fecthNormalPOST_PUT("PUT",`producto/${palabras[1]}`, dato )
    .then(res => {
        
        if(res.ok) {
            botonLoad.className = "btn btn-outline-success"
            botonLoad.innerHTML = `OK`
            input.value = "";

            setTimeout(function(){
            botonLoad.className = "btn btn-outline-primary  btn-sm"
            botonLoad.innerHTML = `CAMBIAR`
                
            }, 1000);
            
        }else {
            algo_salio_mal(`Algo salio mal`)
        }

    })
    .catch( err =>{
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

    let input = document.getElementById(`talle_${id}`);

    let cambiarStock = document.querySelector(`.label_stock_${id}`);

    const forData = {
        cantidad: input.value
    }
    fecthNormalPOST_PUT("PUT", `talle/${suma_resta}/${id}`, forData)
        .then(res => {
            if(res.ok) {
                cambiarStock.innerHTML = `(${res.talle.cantidad})`;
                salio_todo_bien(`Se quito correctamente la cantidad de: ${ input.value }`);
                input.value = "";
            }else {
                algo_salio_mal(`Algo salio mal`)
            }

        })
        .catch(err => {
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
