import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { funcionParaImprimir, funcionParaImprimir_sin_nombre, imprimirComprobante_cliente, imprimir_parami } from "../helpers/ventas/imprimir_ticket.js";
import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { cargaMedio } from "../helpers/para_todos/carga_de_botones.js";
import { devolverString } from "../helpers/para_todos/null.js";
import { usuarioPermisos } from "../helpers/para_todos/usuarios_permisos.js";


const rol = localStorage.getItem('roles');
usuarioPermisos( rol, "produccion");


const main_historial = () => {

    cargaMedio("spinner_load", true);
    fecthNormalGET("GET","orden/historial/full")
    
        .then( res => {
            cargaMedio("spinner_load", false);
            
            imprimirEnPantalla(res.datos);
        })
        .catch( err =>{
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
}
main_historial();


const imprimir_historial = document.querySelector(".imprimir_historial")

const imprimirEnPantalla = (res) => {


    let result = ""

    res.map ( e => {
        let cambio_de_moneda = new Intl.NumberFormat('es-AR', { currency: 'ARS' }).format(e.orden.total)

      
        result += `
             <tr>
             <th scope="row">${e.orden.id}</th>
     
             <td>${devolverString(e.cliente.nombre)} ${e.cliente.apellido || ""}</td>
             <td>${devolverString(e.cliente.dni_cuil)}</td>
             <td>${devolverString(e.cliente.tel_cel)}</td>
             <td>${devolverString(e.orden.fecha) }</td>
             <td>${devolverString(e.direccion.direccion)}</td>
             <td>$ ${cambio_de_moneda}</td>

 
             <td>
             <div class="botones_historial">

 

                 <div class="boton imprimir" id="${e.orden.id}" onclick="imprimir_html(this.id)">
                     <img src="/img/imprimir.svg" alt="" width="35px">
                 </div>

             </div>

             </td>


             </tr>
        `
    })
    imprimir_historial.innerHTML = result;
}


{/* <div class="boton" id="${e.orden.id}" onclick="eliminar_orden(this.id)">
<img width="35px" src="https://img.icons8.com/ios-glyphs/30/000000/filled-trash.png"/>
</div> */}
const prueba = (e) => {

    try {
        e == null || e == undefined || e == "" ? "- -" : e
    } catch (error) {
        return "- -"
    }
}

const comprobante = document.querySelector('.comprobante');
const aca_id_orden = document.getElementById("aca_id_orden")
const aca_id_orden_parami = document.getElementById("aca_id_orden_parami")
const bienvenido = document.querySelector(".bienvenido");
const imprimir_para_mi = document.querySelector(".imprimir_para_mi");

    
window.imprimir_html = (id) => {
    comprobante.style.display = "grid";
    comprobante.style.visibility = "visible";
    aca_id_orden.id = id;
    aca_id_orden_parami.id = id;
}

window.imprimirComprobante = (id) => {
    imprimirComprobante_cliente(id);
    //imprimirComprobante(id);
    comprobante.style.display = "none";
    comprobante.style.visibility = "hidden";
}

    
window.imprimirComprobante_parami = (id) => {
    imprimir_parami(id);
    
    comprobante.style.display = "none";
    imprimir_para_mi.style.visibility = "hidden";
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
const buscar_producto = document.getElementById("buscar_producto");


buscar_producto.addEventListener("keyup", ({keyCode}) => {

    if( keyCode !== 13){return;}
    if(buscar_producto.length === 0){return;}

    getSearch(buscar_producto.value);
    buscar_producto.value = "";
});

const volver_Atras_buscar = document.querySelector(".volver_Atras_buscar");

const getSearch = (valor) => {
    cargaMedio("spinner_load", true);
    
    fecthNormalGET("GET", `orden/historial/p/id?id=${valor}`)
    .then( res => {
    cargaMedio("spinner_load", false);
    volver_Atras_buscar.style.display = "grid";
    volver_Atras_buscar.style.visibility = "visible";
    imprimirEnPantalla(res.datos)
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}


window.volver_inicio = () => {
    volver_Atras_buscar.style.display = "none";
    volver_Atras_buscar.style.visibility = "hidden";
    main_historial();
}

window.cerrar_seccion = () => {
    cerrar_login();
}

const nombre = localStorage.getItem("nombre");


const nombre_usario = document.querySelector("#nombre_usario");


nombre_usario.innerHTML =  nombre;



//MODIFICAR ORDEN

window.eliminar_orden = (e) => {
    Swal.fire({
        title: '¿Esta seguro que quiere eliminar esta orden?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI'
      }).then((result) => {
        if (result.isConfirmed) {

            fecthNormalPOST_PUT("DELETE", `orden/${e}`)
              .then( res =>{
                console.log(res)


                  if(res.ok == true){
                      salio_todo_bien("Se elimino correctamente");
                      main_historial();

                  }else{
                    algo_salio_mal(`Algo salio mal: ${ res.msg }`)
                  }
              })
              .catch( err => {
                  algo_salio_mal(`Algo salio mal: ${ err }`)
              })
        }
      })
}


///HISTORIAL POR LOCALES


const seleccion_locales = document.querySelector("#seleccion_locales");

const localesFiltro = () => {

    fecthNormalGET("GET","historial")
      .then( res => {

        opcionesDelocales(res.local)
      })
      .catch( err => {
          algo_salio_mal(`Algo salio mal: ${ err }`)
      })
}


const opcionesDelocales = (res) => {

    let historial = "";

    seleccion_locales.innerHTML = `<option value="0">Ordenar por local</option>`;
    res.map ( e => {
        historial = `
        <option value="${e}">${e}</option>

        `
        seleccion_locales.innerHTML += historial
    })


}

localesFiltro();

window.cambioDeLocal = (e) => {

    if(e.value == "0"){

        return main_historial();
    }

    fecthNormalGET("GET",`historial/buscar/${e.value}?offset=0`)
    .then( res => {

        
        imprimirEnPantalla(res.datos)
    })
    .catch( err => {
        console.log(err)
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}