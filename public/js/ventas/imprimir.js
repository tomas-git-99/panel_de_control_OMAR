import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";


const imprimir_productos = document.querySelector(".imprimir_productos");
const infoCliente = document.querySelector(".infoCliente");
const precio_final = document.querySelector(".precio_final");



let id_orden = localStorage.getItem("id_orden")

const imprimirComprobante = (id) => {
    console.log(id)
    if(id_orden == null || id_orden == undefined){
        alert ("Algo salio mal vuelva intentarlo mas tarde")
        return window.location.href = "/page/roles/admin/ventas/index.html"
    }else{

        fecthNormalGET("GET", `orden/full/${id}`)
            .then( res => {
                if(res.ok){
                    escribirEnHTML(res);
                    imprimirProducto(res.productos)
                    precio_final.innerHTML = res.orden.total;
                    funcionParaImprimir(`${res.cliente.nombre} ${res.cliente.apellido}`)
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

           <td>${e.nombre}</td>
           <td>${e.cantidad}</td>
           <td>$ ${e.precio}</td>
           <td>$ ${e.precio * e.cantidad}</td>



     </tr>
         `
     })

     imprimir_productos.innerHTML = escribir;
}

 
const funcionParaImprimir = (nombre_cliente) => {

    const elementoAimprimir =  document.querySelector(".bienvenido");

    html2pdf()
        .set({
        margin: 1,
        filename: `${nombre_cliente}.pdf`,
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 3, // A mayor escala, mejores gráficos, pero más peso
            letterRendering: true,
            useCORS: true
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: 'portrait' // landscape o portrait
        }
    })
      .from(elementoAimprimir)
      .save()
      .catch( err => { console.log(err)})

}

