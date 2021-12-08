import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { funcionParaImprimir, funcionParaImprimir_sin_nombre } from "../helpers/ventas/imprimir_ticket.js";



fecthNormalGET("GET","orden/historial/full")
    .then( res => {
        imprimirEnPantalla(res.datos)
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
    localStorage.setItem("id_orden", id);
    window.location.href = `/page/roles/admin/ventas/imprimir.html`
}

    
window.imprimirComprobante_parami = (id) => {
    volverAtras(bienvenido, imprimir_para_mi)
    imprimir_parami(id);
}

const imprimir_para_mi_table = document.querySelector(".imprimir_para_mi_table");


const imprimir_parami = (id) => {
    fecthNormalGET("GET",`orden/${id}`)
        .then(res => {
            ticket_parami(res.producto);
            funcionParaImprimir_sin_nombre("imprimir_para_mi")
        })
}
const ticket_parami = (res) => {

    let resultado = "";

    res.map( e => {
        
        resultado += `
        <tr>
        <th>${e.producto.nombre}</th>
        <td>${e.producto.tela}</td>
        <td>${e.producto.talle}</td>
        <td>${e.cantidad}</td>
        </tr>
        `
    })
    imprimir_para_mi_table.innerHTML  = resultado;
}