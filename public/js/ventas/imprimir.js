/* import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { funcionParaImprimir } from "../helpers/ventas/imprimir_ticket.js";


const imprimir_productos = document.querySelector(".imprimir_productos");
const infoCliente = document.querySelector(".infoCliente");
const precio_final = document.querySelector(".precio_final");



let id_orden = localStorage.getItem("id_orden");

export const imprimirComprobante = (id) => {
    if(id_orden == null || id_orden == undefined){
        alert ("Algo salio mal vuelva intentarlo mas tarde")
        return window.location.href = "/page/roles/admin/ventas/index.html"
    }else{

        fecthNormalGET("GET", `orden/full/${id}`)
            .then( res => {
                if(res.ok){
                    escribirEnHTML(res);
                    imprimirProducto(res.productos)
                    let cambio_de_moneda = new Intl.NumberFormat('es-AR', { currency: 'ARS' }).format(res.orden.total)
                    precio_final.innerHTML = `$ ${cambio_de_moneda}`;
                    funcionParaImprimir(`${res.cliente.nombre} ${res.cliente.apellido}`, "bienvenido" );
                }else{
    
                }
            })
    }

}

imprimirComprobante(id_orden);




const escribirEnHTML = (e) => {

    let escribir = "";

    escribir += `
    <div class="nombre">
    <label for="">NOMBRE: <span>${e.cliente.nombre}</span> </label>
       </div>
         <div class="DNI O CUIL">
       <label for="">DNI O CUIL: <span>${e.cliente.dni_cuil}</span> </label>
        </div>
        <div class="Telefono">
           <label for="">Telefono: <span>${e.cliente.tel_cel}</span> </label>
        </div>
        <div class="Provincia">
           <label for="">Provincia: <span>${e.direccion.provincia}</span> </label>
        </div>
        <div class="Localida">
            <label for="">Localidad: <span>${e.direccion.localidad}</span> </label>
         </div>
         <div class="Direccion">
            <label for="">Direccion: <span>${e.direccion.direccion}</span> </label>
         </div>
         <div class="Codigo">
           <label for="">Codigo: <span>${e.direccion.cp}</span> </label>
        </div>
    `
  
    infoCliente.innerHTML = escribir;
}
 


const imprimirProducto = (res) => {
    console.log(res);
    let escribir = "";

    res.map(e => {

         escribir += `
         <tr>

           <td>${e.nombre_producto}</td>
           <td>${e.cantidad}</td>
           <td>$ ${e.precio}</td>
           <td>$ ${e.precio * e.cantidad}</td>



     </tr>
         `
     })

     imprimir_productos.innerHTML = escribir;
}

 
 */