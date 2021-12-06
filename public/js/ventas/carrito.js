import { comprobarCarritoStorage } from "../helpers/ventas/comprobarCarritoStorage.js";
import { agregarAlFormularioCliente } from "../helpers/ventas/agregarAlFormularioCliente.js";
import { selecciconCambios_direccion } from "../helpers/ventas/seleccicon_cambios_direccion.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";


const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : '';



 ///////////////CONFIRMAR CARRITO EN LOCALSTORAGE/////////////////////////////// 
comprobarCarritoStorage();
 /////////////// FIN CONFIRMAR CARRITO EN LOCALSTORAGE///////////////////////////////


 ////////////////ACTUALIZAR CARRITO A PENAS ENTRA////////////////////////////////
const carritoActualizar = (id=0) => {

    fecthNormalGET("GET", `carrito/${1}`)
    .then( res => {

        leerCarrito(res.carrito_full);
        })

}
carritoActualizar();

const carrito_datos = document.querySelector(".carrito_datos");
const final_precio = document.querySelector(".final_precio");

const leerCarrito = (res) => {

    let historial = ""
    let final = 0;

    res.map( e => {
        historial += `
    
        <tr>
          <td>${e.productos.nombre}</td>
          <td> ${e.carritos.cantidad}</td>
          <td>$${e.productos.precio}</td>
          <td>$${e.carritos.cantidad * e.productos.precio}</td>
          <td>
          <div class="boton rueda" id="${e.carritos.id}" onclick="configurar(this.id)">
          <img src="/img/rueda.svg" alt="" width="23px">
          </div>
          </td>
          <td>
          <div class="boton rueda" id="${e.carritos.id}" onclick="eliminar_producto(this)">
          <img src="/img/cruz.svg" alt="" width="23px">
           </div>
          </td>
        </tr>

   
        `;
        final += e.carritos.cantidad * e.productos.precio;

        carrito_datos.innerHTML = historial;

        
    })

    let cambio_de_moneda = new Intl.NumberFormat('es-AR', { currency: 'ARS' }).format(final)
    final_precio.innerHTML = cambio_de_moneda;

}

 ////////////////FIN ACTUALIZAR CARRITO APENAS ENTRA////////////////////////////////


 ////////////////BOTON DE CONFIRMAR PARA EL CARRITO////////////////////////////////

const bienvenido = document.querySelector(".bienvenido");
const cliente = document.querySelector(".cliente");
const btnConfirmar = document.querySelector(".confirmar");


btnConfirmar.addEventListener("click", (e) => {
    e.preventDefault();

    const confirmarCompra = localStorage.getItem("carrito");

    if(confirmarCompra == 1 ){

        volverAtras(bienvenido, cliente)
        
    }else if( confirmarCompra == null){

        console.log("gatos todos")

    }else{
        const id = localStorage.getItem("id");

        fetch(url, "carrito/" + id,{ 
            method: "GET",
            headers: {'Content-Type': 'application/json'},
        })
        .then(response => response.json())
        .then(res => {
            
        })
        .catch(err => {
            alert("Error: " + err.message)
        });
    }
    //CUANDO APRETE EL BOTON PREGUNTAR SI ESTOS PRODUCTOS YA TIENEN CLIENTES
    
});


const confirmar = (data) => {

    const idCliente = localStorage.getItem("idCliente");

    fetch(url, "confirmar/" + idCliente,{ 
        method: "PUT",
        body: JSON.stringify( data ),
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        //ACA CONFIRMAR EL PEDIDO Y MANDAR A HTML DEL COMPROBANTE PARA QUE LO PUEDA IMPRIMIR
    })
    .catch(err => {
        alert("Error: " + err)
    });
}





//CLIENTE NUEVO O EXISTENTE
const clienteNuevo = document.querySelector(".nuevo");
const clienteExistente = document.querySelector(".existe");

const buscadorCli = document.querySelector(".buscadorCli");
const cartelCliente = document.querySelector(".cartelCliente");

const retroceder = document.querySelector(".retroceder");
const retrocederBuscar = document.querySelector(".retrocederBuscar");




//CLIENTE NUEVO
clienteNuevo.addEventListener("click", (e) =>{
    e.preventDefault();
    
    volverAtras(cliente, cartelCliente)

})

retroceder.addEventListener("click", (e) =>{
    e.preventDefault();
    
    localStorage.removeItem("dataDireccion");

    volverAtras(cartelCliente, cliente)

})


//CLIENTE EXISTENTE
clienteExistente.addEventListener("click", (e) =>{
    e.preventDefault();
    volverAtras(cliente, buscadorCli);

})

retrocederBuscar.addEventListener("click", (e) =>{

    e.preventDefault();
    volverAtras(buscadorCli, cliente);
})







///////////////// CLIENTE EXISTENTE //////////////////

///////////////// BUSCADOR DE CLIENTE 🔍🔍🔍 //////////////////
const search = document.querySelector("#search");
search.addEventListener("keyup", ({keyCode}) => {

    if( keyCode !== 13){return;}
    if(search.length === 0){return;}

    getSearch(search.value);
    search.value = "";
});

//GET BUSCA EN BASE DE DATOS
const getSearch = (valor) => {

    fetch(url + "cliente?" + `dni_cuil=${valor}`,{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        console.log(res)
        leerHistorial(res.cliente);
    })
    .catch(err => {
        console.error(err)
  
    })

}

//ACOMODAR PARA QUE APARESCA EN EL HISTORIAL 

const historialCliente = document.querySelector(".historialCliente");

const leerHistorial = (res) => {


    localStorage.setItem("dataCliente", JSON.stringify(res));
    let historial = ""
    res.map( e => {
        historial += `
   
        <tr>
          <td>${e.nombre}</td>
          <td>${e.apellido}</td>
          <td>${e.dni_cuil}</td>
          <td>
          <div class="preview">
              <button id="${e.id}" onclick="mandarID(this.id)" >
                  Agregar
              </button>
          </div>
      </td>
        </tr>
        `;
        
    })

    historialCliente.innerHTML = historial;
}
///////////////// FIN BUSCADOR DE CLIENTE 🔍🔍🔍 //////////////////

const clientInformacionSOLO = document.querySelector(".clientInformacionSOLO");
const id_del_cliente = document.getElementById("id_del_cliente")

window.mandarID = (e) => {

    volverAtras(buscadorCli, cartelCliente);
    direccionCliente(e);
    agregarAlFormularioCliente(clientInformacionSOLO);
    id_del_cliente.id = e;
}

//AGREGAR A LA BASE DE DATOS DE OREDEN, ID_DIRECCION

//BUSCAR CON EL ID EL CLIENTE LA DIRECCIONES QUE TIENE 

const direccionCliente = (idCliente) =>{

    fetch(url + "direccion/" + idCliente,{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(async(res) => {
        localStorage.setItem("dataDireccion", JSON.stringify(res.direccion));
        const dato = JSON.parse(localStorage.getItem("dataDireccion"));
        agregarDireccionFormulario(dato); 
    })
    .catch(err => {
        alert("Error: " + err)
    });

}

//COLOCAR TODOS LOS DATOS EN EL FORMULARIO

const seleccionDirec = document.querySelector("#seleccionDirec");


const agregarDireccionFormulario = async(dataDireccion) => {
    
    let historialDireccion = "";

    seleccionDirec.innerHTML =` <option value="0">Nueva direccion</option>`;

    dataDireccion.map( e => {

        historialDireccion = `
        <option value="${e.id}">${e.direccion}</option>
        `
        seleccionDirec.innerHTML += historialDireccion;
    });
    
}


const direccionDeCliente = document.querySelector(".direccionDeCliente");
const aca_id_direccion = document.getElementById("0")

window.selecciconCambios = (s) => {
    aca_id_direccion.id = s.value;
    selecciconCambios_direccion(s, direccionDeCliente)

}


///////////////// FIN CLIENTE EXISTENTE //////////////////


/////// RELLENAR DATOS PARA CONFIRMAR COMPRA //////////////////
const botonCliente = document.querySelector(".btnCliente");
const formCliente = document.querySelector(".formProducto")
const descontar_total_id = document.getElementById("descontar_total_id")
const descontar_talle_id = document.getElementById("descontar_talle_id")



// botonCliente.addEventListener("click", (e) => {
//     console.log(e.target)
// })


formCliente.addEventListener("submit", (e) =>{

    e.preventDefault();

    const forData = {};          // DATOS PARA MANDAR A DB DE CLIENTE NUEVO
    const forDataDireccion = {}; // DATOS PARA MANDAR A DB DE CLIENTE NUEVO
    const forDataConfirmar = {}  // 2 DATOS PARA GENERAR NUEVA ORDEN
    
    for(let el of formCliente.elements){
        if(el.name.length > 0){

            if(el.name === "fecha"  || el.name === "transporte"){
                forDataConfirmar[el.name] = el.value;
            }else if(el.name == "provincia" || el.name == "localidad" || el.name == "cp" || el.name == "direccion"){
                forDataDireccion[el.name] = el.value;
            }else{
                forData[el.name] = el.value;
            }

        }

    }
    

    //const id_cliente = localStorage.getItem("id_cliente");
    const id_cliente = botonCliente.id;
    const id_direccion = aca_id_direccion.id;
    const id_usuario = localStorage.getItem("id");

    //SI ESTA AGREGANDO UNA NUEVA DIRECCION PARA ESTE CLIENTE
    if(id_direccion == 0 || id_direccion == "0" || id_direccion == ""){

        fecthNormalPOST_PUT("POST", `direccion/${id_cliente} `,forDataDireccion)
            .then( res => {
                generarOrden(id_cliente, id_cliente, res.newDireccion.id, forDataConfirmar);
            })

    }else{
        generarOrden(id_cliente, id_usuario, id_direccion, forDataConfirmar);
    }
    
    console.log(forData);
    console.log(forDataConfirmar);
    console.log(forDataDireccion);


})

/////// FIN RELLENAR DATOS PARA CONFIRMAR COMPRA //////////////////

const quitar_total_o_individual = document.querySelector(".quitar_total_o_individual");

const generarOrden = (id_cliente, id_usuario, id_direccion, data) => {
    
    fecthNormalPOST_PUT("POST", `orden/${id_cliente}/${id_usuario}/${id_direccion}`, data)
        .then( res => {
            if(res.ok){

                console.log(res);
                // ACA COLOCAMOS QUE SE ABRA LA SIGUENTE VENTANA PARA DESCONTAR DEL TOTAL O POR TALLE
                volverAtras(cartelCliente, quitar_total_o_individual)
                descontar_total_id.id = res.orden.id;
                descontar_talle_id.id = res.orden.id;
            }
        })
        .catch( err => {

        })
                  
}

////DESCONTAR LOS PRODUCTOS DE LA BASE DE DATOS
const comprobante = document.querySelector(".comprobante");

window.descontar_total = (id) => {
    const id_usuario = localStorage.getItem("id");
    descontarEltotal(id_usuario, id);
}

const descontarEltotal = (id_usuario, id_orden) => {

    fecthNormalPOST_PUT("PUT", `carrito/total/${id_usuario}/${id_orden}`)
        .then( res => {
            if(res.ok){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.msg,
                    showConfirmButton: false,
                    timer: 1500
                  })
                volverAtras(quitar_total_o_individual, comprobante);
                //mandar a la ventana para imprimir en pdf los tickets
            }else{
                //volver a carrito por el error de que no ahi stock y colocar el id_orden en local storage
                localStorage.removeItem("carrito");
                localStorage.getItem("carrito", 0);
                localStorage.setItem('id_orden', id_orden);
            }
        })
        .catch(err =>{
            alert("Error: " + err)
        })
}


////////////////////////////////MOFIGICAR CARRITO 🛒🛒🛒//////////////////////////////// 🔴🔴🔴🔴🔴
const modificarCarrito = document.querySelector(".modificarCarrito")
const boton_id_producto = document.getElementById("boton_id_producto")
const salir_modificador_ID = document.getElementById("salir_modificador_ID")

const span_cantidad_actual = document.querySelector(".span_cantidad_actual");
const span_cantidad_carrito = document.querySelector(".span_cantidad_carrito");
const valor_de_cantidad_nueva = document.querySelector("#valor_de_cantidad_nueva");


// BOTON PARA ELIMINAR PRODUCTO DE CARRITO
window.eliminar_producto = (id) => {
    
    fecthNormalGET("DELETE", `carrito/${id.id}`)
    .then( (res) => {
        // cell element
        const cell = id.parentNode;
        // row element
        const row = cell.parentNode;
        document.getElementById("tableContact").deleteRow(row.rowIndex);
    })
    .catch(err => console.log(err))
    
}


//RUEDA DE CONFIGURACION
window.configurar = (id) => {

    configuracion_view(id);
    boton_id_producto.id = id;
    salir_modificador_ID.id = id;
    modificarCarrito.style.display = "grid";
    modificarCarrito.style.visibility = "visible";

}

//BOTON PARA SALIR DE LA VENTA DE MODIFICACION DE CARRITO Y ACTUALIZAR CARRITO
window.salir_actualizar_carrito = (id) => {
    carritoActualizar(id);
    modificarCarrito.style.display = "none";
    modificarCarrito.style.visibility = "hidden";
}


// ENVIAR CAMBIOS DEL CARRITO EN LA VENTANA DE CONFIGURACION
window.enviar_cambio = (id) => {

    const dato = {
        cantidad: valor_de_cantidad_nueva.value
    }
    fecthNormalPOST_PUT("PUT", `carrito/${id}`, dato)
        .then(res => {
            span_cantidad_carrito.innerHTML = res.cantidad;
            valor_de_cantidad_nueva.value = "";
        })
}

const configuracion_view = (id) => {
    fecthNormalGET("GET", `carrito/mostrar/${id}`)
         .then( res => {
            span_cantidad_actual.innerHTML = res.cantidadActual;
            span_cantidad_carrito.innerHTML = res.cantidadCarrito;
         })
         .catch(err => {
             alert(err.message);
         })
}

////////////////////////////////MOFIGICAR CARRITO 🛒🛒🛒////////////////////////////////  🔴🔴🔴🔴🔴