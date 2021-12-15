import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { funcionParaImprimir, funcionParaImprimir_sin_nombre, imprimirComprobante_cliente, imprimir_parami } from "../helpers/ventas/imprimir_ticket.js";
import { algo_salio_mal } from "../helpers/para_todos/alertas.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";



fecthNormalGET("GET","orden/historial/full")
    .then( res => {
        imprimirEnPantalla(res.datos)
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })

const imprimir_historial = document.querySelector(".imprimir_historial")

const imprimirEnPantalla = (res) => {

    let result = ""

    res.map ( e => {
        let cambio_de_moneda = new Intl.NumberFormat('es-AR', { currency: 'ARS' }).format(e.orden.total)

        result += `
             <tr>
             <th scope="row">${e.orden.id}</th>
     
             <td>${e.cliente.nombre} ${e.cliente.apellido}</td>
             <td>${e.cliente.dni_cuil}</td>
             <td>${e.cliente.tel_cel}</td>
             <td>${e.orden.fecha}</td>
             <td>${e.direccion.direccion}</td>
             <td>$ ${cambio_de_moneda}</td>

             <td>
                 <div class="boton imprimir" id="${e.orden.id}" onclick="imprimir_html(this.id)">
                     <img src="/img/imprimir.svg" alt="" width="35px">
                 </div>
             </td>
             </tr>
        `
    })
    imprimir_historial.innerHTML = result;
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

const getSearch = (valor) => {

    fecthNormalGET("GET", `orden/historial/p/id?id=${valor}`)
    .then( res => {
        imprimirEnPantalla(res.datos)
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}

window.cerrar_seccion = () => {
    cerrar_login();
}

const nombre = localStorage.getItem("nombre");


const nombre_usario = document.querySelector("#nombre_usario");


nombre_usario.innerHTML =  nombre;
