import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";



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
                 <div class="boton preview">
     
                     <img src="/img/ver.svg" alt="" width="35px">
                 </div>
             </td>
             <td>
                 <div class="boton imprimir">
                     <img src="/img/imprimir.svg" alt="" width="35px">
                 </div>
             </td>
             </tr>
        `
    })
    imprimir_historial.innerHTML = result;
}