import { comprobarCarritoStorage, preguntarSiConCliente } from "../helpers/ventas/comprobarCarritoStorage.js";
import { agregarAlFormularioCliente, limpiarForm } from "../helpers/ventas/agregarAlFormularioCliente.js";
import { selecciconCambios_direccion } from "../helpers/ventas/seleccicon_cambios_direccion.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { fecthNormalGET, fecthNormalGET_QUERY, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { advertencia, algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { imprimirComprobante_cliente, imprimir_parami } from "../helpers/ventas/imprimir_ticket.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { cargaMedio, load_normal } from "../helpers/para_todos/carga_de_botones.js";
import { usuarioPermisos } from "../helpers/para_todos/usuarios_permisos.js";

const rol = localStorage.getItem('roles');
usuarioPermisos( rol, "produccion");



let ventaPublico = false

 ///////////////CONFIRMAR CARRITO EN LOCALSTORAGE/////////////////////////////// 
comprobarCarritoStorage();
 /////////////// FIN CONFIRMAR CARRITO EN LOCALSTORAGE///////////////////////////////


 


 ////////////////ACTUALIZAR CARRITO A PENAS ENTRA////////////////////////////////


const carritoActualizar = () => {
    let id = localStorage.getItem("id")

    cargaMedio("spinner_load", true)

    fecthNormalGET("GET", `carrito/${id}`)
    .then( res => {
        cargaMedio("spinner_load", false)
        leerCarrito(res.carrito_full);
        
        })
    .catch( err => {
       
        algo_salio_mal(`Algo salio mal: ${ err.message }`)
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
          <td data-label="MODELO" >${e.productos.nombre}</td>
          <td data-label="CANTIDAD" > ${sumaDetalleTotal(e.talles, e.productos, e.carritos)}</td>
          <td data-label="TALLE" > ${e.carritos.talle == null ? e.productos.talles : e.carritos.talle}</td>
          <td data-label="PRECIO UD" >$${e.carritos.precio_nuevo == null ? e.productos.precio : e.carritos.precio_nuevo}</td>
          <td data-label="TOTAL" >$${contarCurvaTotal(e.talles, e.productos ,e.carritos.precio_nuevo == null ? e.productos.precio : e.carritos.precio_nuevo, e.carritos.cantidad, e.carritos)}</td>
          <td data-label="Ajustes" >
          <div class="boton rueda" id="${e.carritos.id}" onclick="configurar(this.id)">
          <img src="/img/rueda.svg" alt="" width="23px">
          </div>
          </td>
          
          <td data-label="Eliminar" >
          <div class="boton rueda" id="${e.carritos.id}" onclick="eliminar_producto(this)">
          <img src="/img/cruz.svg" alt="" width="23px">
           </div>
          </td>
        </tr>

   
        `;

        let precio = e.carritos.precio_nuevo == null ? e.productos.precio : e.carritos.precio_nuevo 
    
        final += sumaDetalleTotal(e.talles, e.productos, e.carritos) * precio;

      
        carrito_datos.innerHTML = historial;

        
    })

    let cambio_de_moneda = new Intl.NumberFormat('es-AR', { currency: 'ARS' }).format(final)
    final_precio.innerHTML = cambio_de_moneda;

}



const sumaDetalleTotal = ( talles, producto, carrito) => {
    
    if(talles.length == 0  && carrito.talle == null ){
        
        let cantidadDeTalle = producto.talles.split(",");
        let contador = cantidadDeTalle.length * carrito.cantidad;
    
        return contador;

    }else if(talles.length > 0  && carrito.talle == null){

        let countTalles = talles.length;
    
        let contador = countTalles * carrito.cantidad;
    
        return contador;
    }else{
        return carrito.cantidad;
    }


}

const contarCurvaTotal = (talle, producto , precio, cantidad, carrito) => {

    let cantidadDeTalle = producto.talles.split(",");

    
    if(talle.length == 0 && carrito.talle == null){ // solo si el producto tienen el total
        let count = cantidadDeTalle.length * cantidad;
        return count * precio;

    }else if(talle.length > 0 && carrito.talle == null){ // solo si el producto tiene talles por individual    

        let countTalles = talle.length;

        let contador = countTalles * cantidad;
    
        return contador * precio;
   
    }else{
        return cantidad * precio;
    }
}


 ////////////////FIN ACTUALIZAR CARRITO APENAS ENTRA////////////////////////////////


 ////////////////BOTON DE CONFIRMAR PARA EL CARRITO////////////////////////////////

const bienvenido = document.querySelector(".bienvenido");
const cliente = document.querySelector(".cliente");
const btnConfirmar = document.querySelector(".confirmar");
const preguntar_publico_o_online = document.querySelector(".preguntar_publico_o_online");
const venta_publico = document.querySelector(".venta_publico");


btnConfirmar.addEventListener("click", (e) => {
    e.preventDefault();

    const id_orden = localStorage.getItem("id_orden");

    if(id_orden == null || id_orden == undefined){
        //volverAtras(bienvenido, cliente)
        volverAtras(bienvenido, preguntar_publico_o_online);

    }else{
        volverAtras(bienvenido, quitar_total_o_individual);
        descontar_total_id.id = btnConfirmar.id;
        descontar_talle_id.id = btnConfirmar.id;
    }

        
    //CUANDO APRETE EL BOTON PREGUNTAR SI ESTOS PRODUCTOS YA TIENEN CLIENTES
    
});

window.envios = () => {
    volverAtras(preguntar_publico_o_online, cliente)
}
window.publico = () => {
    volverAtras(preguntar_publico_o_online, venta_publico)

}

window.volver_atras = () => {
    location.href = "compra.html"
}
 
//CLIENTE NUEVO O EXISTENTE
const clienteNuevo = document.querySelector(".nuevo");
const clienteExistente = document.querySelector(".existe");

const buscadorCli = document.querySelector(".buscadorCli");
const buscador = document.querySelector(".buscador");

const cartelCliente = document.querySelector(".cartelCliente");

const retroceder = document.querySelector(".retroceder");
const retrocederBuscar = document.querySelector(".retrocederBuscar");




//CLIENTE NUEVO
clienteNuevo.addEventListener("click", (e) =>{
    e.preventDefault();
    volverAtras(cliente, cartelCliente);
    seleccionDirec.style.grid = "none";
    seleccionDirec.style.visibility = "hidden";
    btnCliente.id = "id_del_cliente";
})

retroceder.addEventListener("click", (e) =>{
    e.preventDefault();
    
    localStorage.removeItem("dataDireccion");

    limpiarForm(clientInformacionSOLO);
    volverAtras(cartelCliente, cliente);

})


//CLIENTE EXISTENTE
clienteExistente.addEventListener("click", (e) =>{

    e.preventDefault();
    
    volverAtras(cliente, buscador);

})

retrocederBuscar.addEventListener("click", (e) =>{

    e.preventDefault();
    volverAtras(buscador, cliente);
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

    fecthNormalGET_QUERY("GET", "cliente", "?dni_cuil=", valor)
    .then(res => {
        leerHistorial(res.cliente);
    })
    .catch(err => {
        algo_salio_mal(`Algo salio mal: ${err.message}`)
  
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
          <td data-label="NOMBRE">${e.nombre}</td>
          <td data-label="APELLIDO">${e.apellido}</td>
          <td data-label="DNI O CUIL">${e.dni_cuil}</td>
          <td data-label="AGREGAR">
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

    volverAtras(buscador, cartelCliente);
    direccionCliente(e);
    seleccionDirec.style.grid = "grid";
    seleccionDirec.style.visibility = "visible";
    agregarAlFormularioCliente(clientInformacionSOLO, e);
    id_del_cliente.id = e;
}

//AGREGAR A LA BASE DE DATOS DE OREDEN, ID_DIRECCION

//BUSCAR CON EL ID EL CLIENTE LA DIRECCIONES QUE TIENE 

const direccionCliente = (idCliente) =>{

    fecthNormalGET("GET",`direccion/${idCliente}`)
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

const btnCliente = document.querySelector(".btnCliente")


formCliente.addEventListener("submit", async(e) =>{

    e.preventDefault();

    const forData = {};          // DATOS PARA MANDAR A DB DE CLIENTE NUEVO
    const forDataDireccion = {}; // DATOS PARA MANDAR A DB DE CLIENTE NUEVO
    const forDataConfirmar = {}  // 2 DATOS PARA GENERAR NUEVA ORDEN
    
    load_normal(btnCliente, true)
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
    let id_cliente = botonCliente.id;
    const id_direccion = aca_id_direccion.id;
    const id_usuario = localStorage.getItem("id");
    
    if(id_cliente == null || id_cliente == undefined || id_cliente == "id_del_cliente"){

        let id = await fecthNormalPOST_PUT("POST", "cliente", forData);
    
        id_cliente = id.cliente.id;
    }


    
    //SI ESTA AGREGANDO UNA NUEVA DIRECCION PARA ESTE CLIENTE
    if(id_direccion == 0 || id_direccion == "0" || id_direccion == ""){
        
        fecthNormalPOST_PUT("POST", `direccion/${id_cliente} `,forDataDireccion)
            .then( (res) => {

                load_normal(btnCliente, false, "CONFIRMAR")
                generarOrden(id_cliente, id_usuario, res.direcciones.id, forDataConfirmar);
            })
            .catch(err =>{
                load_normal(btnCliente, false, "CONFIRMAR")
                algo_salio_mal(`Algo salio mal: ${ err }`)
            })

    }else{
        generarOrden(id_cliente, id_usuario, id_direccion, forDataConfirmar);
    }


})

/////// FIN RELLENAR DATOS PARA CONFIRMAR COMPRA //////////////////

const quitar_total_o_individual = document.querySelector(".quitar_total_o_individual");

const generarOrden = (id_cliente, id_usuario, id_direccion, data) => {

    
    fecthNormalPOST_PUT("POST", `orden/${id_cliente}/${id_usuario}/${id_direccion}`, data)
        .then( res => {
            if(res.ok){

                // ACA COLOCAMOS QUE SE ABRA LA SIGUENTE VENTANA PARA DESCONTAR DEL TOTAL O POR TALLE
                //volverAtras(cartelCliente, quitar_total_o_individual)
                //descontar_total_id.id = res.orden.id;
                //descontar_talle_id.id = res.orden.id;
                descontarTotalOporTalle(id_usuario, res.orden.id);
            }else if (res.error == 10 || res.error == "10"){
                localStorage.removeItem("x-token");
                window.location.href = `${window.location.origin}/index.html`
            }else{
                advertencia(`Verifique si lleno bien los campos del formulario...`)
            }
        })
        .catch( err => {
            
            algo_salio_mal(`Algo salio mal no se pudo generar la orden: ${ err }`)
        })
                  
}

////DESCONTAR LOS PRODUCTOS DE LA BASE DE DATOS
const comprobante = document.querySelector(".comprobante");
const aca_id_orden = document.getElementById("aca_id_orden")
const aca_id_orden_para_mi = document.getElementById("aca_id_orden_para_mi")
const btn_confirmar = document.getElementById("btn_confirmar")


window.descontar_total = (id) => {

    const id_usuario = localStorage.getItem("id");

    if(ventaPublico == true ){
        
        return descontarEltotal(id_usuario, id, "true");
    }
    
    descontarEltotal(id_usuario, id)
}
const total_db = document.querySelector(".total_db");

const descontarEltotal = (id_usuario, id_orden, data) => {

    load_normal(total_db, true)
    fecthNormalPOST_PUT("PUT", `carrito/total/${id_usuario}/${id_orden}?publico=${data}`)
        .then( res => {
            load_normal(total_db, false, "TOTAL")
            if(res.ok){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.msg,
                    showConfirmButton: false,
                    timer: 1500
                  }) 

                aca_id_orden.id= id_orden;
                aca_id_orden_para_mi.id = id_orden;
                localStorage.removeItem("id_orden");

                //localStorage.setItem('id_orden', id_orden);
                volverAtras(quitar_total_o_individual, comprobante);
                //mandar a la ventana para imprimir en pdf los tickets
            }else{
              
                advertencia(`Productos sin stock : ${res.productos_sin_stock}`, res.msg)
                //volver a carrito por el error de que no ahi stock y colocar el id_orden en local storage
                //localStorage.removeItem("carrito");
                //localStorage.getItem("carrito", 0);
                btn_confirmar.id = id_orden;
                localStorage.setItem('id_orden', id_orden);
            }
        })
        .catch(err =>{
            algo_salio_mal(`Algo salio mal : ${ err }`)

        })
}

const talle_db = document.querySelector(".talle_db");

window.descontar_talle = (id) => {
    const id_usuario = localStorage.getItem("id");
    descontar_por_talle(id_usuario, id);
}

const descontar_por_talle = (id_usuario, id_orden) => {
    
    load_normal(talle_db, true)
    fecthNormalPOST_PUT("PUT", `carrito/${id_usuario}/${id_orden}`)
    .then( res => {
        if(res.ok){
            load_normal(talle_db, false, "TALLE")
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.msg,
                showConfirmButton: false,
                timer: 1500
              }) 

            aca_id_orden.id= id_orden;
            aca_id_orden_para_mi.id = id_orden;

            localStorage.removeItem("id_orden");

            volverAtras(quitar_total_o_individual, comprobante);
            //mandar a la ventana para imprimir en pdf los tickets
        }else{
            advertencia(`Productos sin stock : ${res.productos_sin_stock}`, res.msg)

            btn_confirmar.id = id_orden;
            localStorage.setItem('id_orden', id_orden);
        }
    })
    .catch(err =>{
        algo_salio_mal(`Algo salio mal : ${ err }`)

    })
}


////////////////////////////////MOFIGICAR CARRITO 🛒🛒🛒//////////////////////////////// 🔴🔴🔴🔴🔴
const modificarCarrito = document.querySelector(".modificarCarrito")
const boton_id_producto = document.getElementById("boton_id_producto")
const salir_modificador_ID = document.getElementById("salir_modificador_ID")
const boton_para_id_solo = document.querySelector(".boton_para_id_solo")
const boton_para_id_solo_1 = document.querySelector(".boton_para_id_solo_1")

const span_cantidad_actual = document.querySelector(".span_cantidad_actual");
const span_cantidad_carrito = document.querySelector(".span_cantidad_carrito");
const span_precio_carrito = document.querySelector(".span_precio_carrito");

const valor_de_cantidad_nueva = document.querySelector("#valor_de_cantidad_nueva");
const valor_de_precio_nueva = document.querySelector("#valor_de_precio_nueva");


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
    .catch(err => algo_salio_mal(`Algo salio mal : ${ err }`));
    
}


//RUEDA DE CONFIGURACION
window.configurar = (id) => {

    configuracion_view(id);
    boton_id_producto.id = id;
    salir_modificador_ID.id = id;
    boton_para_id_solo.id = id;
    boton_para_id_solo_1.id = id;
    modificarCarrito.style.display = "grid";
    modificarCarrito.style.visibility = "visible";
   

}

//BOTON PARA SALIR DE LA VENTA DE MODIFICACION DE CARRITO Y ACTUALIZAR CARRITO
window.salir_actualizar_carrito = (id) => {
    carritoActualizar();
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
            span_cantidad_carrito.innerHTML = res.carrito.cantidad;
            valor_de_cantidad_nueva.value = "";
        })
        .catch(err => {
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
}

window.enviar_cambio_precio = (id, valor) => {
    let dato = {}

    if(valor == true || valor == "true"){
        dato = {precio_nuevo:null}
    }else{
        dato = {precio_nuevo:valor_de_precio_nueva.value}
    }



    if( valor_de_precio_nueva.value.length == 0 && valor == undefined){
        return advertencia("Tienens que llenar los campos")
    }

    fecthNormalPOST_PUT("PUT", `carrito/${id}`, dato)
    .then(res => {
        span_precio_carrito.innerHTML = "$ " + res.carrito.precio_nuevo;
        valor_de_precio_nueva.value = "";
    })
    .catch(err => {
        valor_de_precio_nueva.value = "";
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}

const configuracion_view = (id) => {
    fecthNormalGET("GET", `carrito/mostrar/${id}`)
         .then( res => {
            
            span_cantidad_actual.innerHTML = res.cantidadActual;
            span_cantidad_carrito.innerHTML = res.cantidadCarrito;
            span_precio_carrito.innerHTML = "$ " + res.precio
         })
         .catch( err =>{
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
}

////////////////////////////////MOFIGICAR CARRITO 🛒🛒🛒////////////////////////////////  🔴🔴🔴🔴🔴


/// IMPRIMIR COMPROBANTE 

window.imprimirComprobante = (id)=> {

    imprimirComprobante_cliente(id)
}
window.imprimirComprobante_para_mi = (id)=> {
    imprimir_parami(id);
}


window.cerrar_seccion = () => {
    cerrar_login();
}

const nombre = localStorage.getItem("nombre");


const nombre_usario = document.querySelector("#nombre_usario");


nombre_usario.innerHTML =  nombre;




//////////////////////////////// VENTAS AL PUBLICO //////////////////////////////////

//DATA = {nombre, email, cuil o dni}

const venta_publico_form = document.querySelector(".venta_publico_form");




venta_publico_form.addEventListener("submit", async(e) => {
    e.preventDefault();


    const forData = {}; // DATOS PARA MANDAR A DB DE CLIENTE NUEVO

    
    for(let el of venta_publico_form.elements){
        if(el.name.length > 0){

            forData[el.name] = el.value;
          

        }
    }

    const id_usuario = localStorage.getItem("id");

    let data = await fecthNormalPOST_PUT("POST", "cliente", forData);

 

    fecthNormalGET("GET",`orden/publico/orden/completo/${id_usuario}/${data.cliente.id}?publico=true`)
        .then( res => {
        
            if(res.ok == true){

/*                 volverAtras(venta_publico, quitar_total_o_individual)
                descontar_total_id.id = res.orden.id;
                descontar_talle_id.id = res.orden.id;
                ventaPublico = true; */

                descontarTotalOporTalle(id_usuario, res.orden.id)

            }else{
                algo_salio_mal(`Algo salio mal: ${ res }`);
                volverAtras(venta_publico, bienvenido)
            }
        })
        .catch ( err => {
        
            algo_salio_mal(`Algo salio mal: ${ err }`);
            volverAtras(venta_publico, bienvenido)
        })
    
})

window.salir_publico = () => {
    volverAtras( venta_publico, preguntar_publico_o_online)
}

window.salir_envio = () => {

    volverAtras( cliente, preguntar_publico_o_online)

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





/// DESCONTAR EL TOTAL SOLO CON UNA FUNCION



function descontarTotalOporTalle (id_usuario, id_orden) {



    fecthNormalPOST_PUT("PUT", `carrito/confirmar/compra/${id_usuario}/${id_orden}`)
        .then( res => {
            if(res.ok == true){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.msg,
                    showConfirmButton: false,
                    timer: 1500
                  }) 

                aca_id_orden.id= id_orden;
                aca_id_orden_para_mi.id = id_orden;
                localStorage.removeItem("id_orden");

                //localStorage.setItem('id_orden', id_orden);

                volverAtras(cartelCliente, comprobante);
                volverAtras(venta_publico, comprobante);

            }else if(res.error == 2 || res.error == "2"){
                advertencia(`Productos sin stock : ${res.productos_sin_stock}`, res.msg)
                volverAtras( cartelCliente, bienvenido);
                volverAtras(venta_publico, bienvenido);
            }else{
            
                algo_salio_mal(`Algo salio mal`);
                volverAtras( cartelCliente, bienvenido)
                volverAtras(venta_publico, bienvenido);

            }
        }
        )
        .catch( err => {
            algo_salio_mal(`Algo salio mal: ${ err }`);
            volverAtras( cartelCliente, bienvenido)
            volverAtras(venta_publico, bienvenido);

        })

}