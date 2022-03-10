import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { funcionParaImprimir, funcionParaImprimir_sin_nombre, imprimirComprobante_cliente, imprimir_parami } from "../helpers/ventas/imprimir_ticket.js";
import { advertencia, algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { cargaMedio } from "../helpers/para_todos/carga_de_botones.js";
import { devolverString } from "../helpers/para_todos/null.js";
import { usuarioPermisos } from "../helpers/para_todos/usuarios_permisos.js";
import { conteoPorTalle, imprimirTallesEnCadaProducto } from "../helpers/ventas/productos_ventas.js";
import { abrirCerrarVentanas } from "../helpers/para_todos/cerrarVentanasAbrir.js";


const rol = localStorage.getItem('roles');
usuarioPermisos( rol, "produccion");

let numeroPaginas = null;
let valorGuardado 

const main_historial = (offset=0) => {

    cargaMedio("spinner_load", true);
    fecthNormalGET("GET","orden/historial/full?offset="+offset)
    
        .then( res => {
            cargaMedio("spinner_load", false);

            if(numeroPaginas == null || numeroPaginas == "null" ){

                paginacion(res.contador)
    
            }
            numeroPaginas = res.contador;
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

 
             <div class="boton" id="${e.orden.id}" onclick="eliminar_orden(this.id)">
             <img width="35px" src="https://img.icons8.com/ios-glyphs/30/000000/filled-trash.png"/>
             </div>

             <div id="${e.orden.id}" onclick="modificar_orden(this.id)" class="boton">
             <img src="https://img.icons8.com/ios/50/000000/settings--v1.png" width="25px"/> 
             </div> 
      
             
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



{/* <div id="${e.orden.id}" onclick="modificar_orden(this.id)" class="boton">
<img src="https://img.icons8.com/ios/50/000000/settings--v1.png" width="25px"/> 
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
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
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
    numeroPaginas = null;

   /*  cargaMedio("spinner_load", true);

    if(e.value == "0"){
        localNombre = '';
        return main_historial();
    }

    fecthNormalGET("GET",`historial/buscar/${e.value}?offset=0`)
    .then( res => {
        cargaMedio("spinner_load", false);

        localNombre = e.value
        imprimirEnPantalla(res.datos)
    })
    .catch( err => {
        cargaMedio("spinner_load", false);
        
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
 */

    cambiarLocalValue(e.value);
}

const cambiarLocalValue = (value, offset =0) => {
    cargaMedio("spinner_load", true);

    if(value == "0"){
        localNombre = '';
        return main_historial();
    }

    fecthNormalGET("GET",`historial/buscar/${value}?offset=${offset}`)
    .then( res => {
        cargaMedio("spinner_load", false);

        if(numeroPaginas == null || numeroPaginas == "null" ){
            paginacion(res.contador, "local")
        }
    
        numeroPaginas = res.contador;
        localNombre = value
        imprimirEnPantalla(res.datos)
    })
    .catch( err => {
        cargaMedio("spinner_load", false);
        
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}



//MODIFICAR CARRITO

const productos_orden = document.querySelector('.productos_orden')
const modificarCarrito = document.querySelector('.modificarCarrito')
const cantidadTalle = document.querySelector('.cantidadTalle')
const totalOrden_detalle = document.querySelector('.totalOrden_detalle');

let idORDEN

window.modificar_orden = (id) => {

    idORDEN = id;
 
    MODIFICAR_ORDEN_FUNC(id)
  
}


let infoOrden

const MODIFICAR_ORDEN_FUNC = (id) => {
    fecthNormalGET("GET","ordenDetalle/"+id)
    .then( res => {

        console.log(res)

        infoOrden = res.orden

        agregarOpcionesDeModificacionCliente(res.orden)
        imprimirProductosOrden(res.ordenDetalle);

        cerrar_abrir("modificarCarrito", true);
        totalOrden_detalle.innerHTML = `$ ${res.orden.total}`
    

    })
    .catch( err => {
        return algo_salio_mal(`Algo salio mal: ${ error }`)
    })
}

const imprimirProductosOrden = (res) => {

    let historial = "";
    res.map( e => {

        historial += `
        <tr>
        <td>${devolverString(e.id_producto)}</td>
        <td>${devolverString(e.nombre_producto)}</td>
        <td>${devolverString(e.talle)}</td>
        <td>${devolverString(e.cantidad)}</td>
        <td>$ ${devolverString(e.precio)}</td>
        <td>
        <div class="botones_historial">
        <div class="boton" id="${e.id}" onclick="eliminar_ordenDetalle(this.id)">
             <img width="35px" src="https://img.icons8.com/ios-glyphs/30/000000/filled-trash.png"/>
        </div>
        <div id="${e.id}" onclick="moificar_producto(this.id)" class="boton">
        <img src="https://img.icons8.com/ios/50/000000/settings--v1.png" width="25px"/> 
        </div>
        </div>
        
        </td>
        </tr>
        `
    })

    productos_orden.innerHTML = historial;

}

{/* <td>${devolverString()}</td> */}

window.eliminar_ordenDetalle = (id) => {

    Swal.fire({
        title: '¿Estas seguro que quieres eliminar este producto de este comprobante?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI'
      }).then((result) => {
        if (result.isConfirmed) {

            fecthNormalPOST_PUT("DELETE", `ordenDetalle/${idORDEN}/${id}`)
              .then( res =>{
            

                  if(res.ok == true){
                      salio_todo_bien("Se elimino correctamente");
        MODIFICAR_ORDEN_FUNC(idORDEN);

                     /*  main_historial(); */

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


let idProductoModificar 
window.moificar_producto = (id) => {
    cerrar_abrir("cantidadTalle", true);
    idProductoModificar = id;
}


window.close_ventana = (id) => {

    if(id == 'cantidadTalle' || id == 'agregarNuevoProducto'){
        valueLocal = '';

        MODIFICAR_ORDEN_FUNC(idORDEN);

    }else if(id == 'modificarCarrito'){
       /*  main_historial(); */
    }

    valueLocal = '';

    document.querySelector(`.${id}`).style.display = 'none';
    document.querySelector(`.${id}`).style.visibility = 'hidden';
}
const cerrar_abrir = (tag, estado) => {

    if(estado == true){
        document.querySelector(`.${tag}`).style.display = 'grid';
        document.querySelector(`.${tag}`).style.visibility = 'visible';
    }else{
        document.querySelector(`.${tag}`).style.display = 'none';
        document.querySelector(`.${tag}`).style.visibility = 'hidden';
    }
}

const modificador_producto_orden = document.querySelector('.modificador_producto_orden');
const precioCambiarID = document.querySelector('#precioCambiarID');


modificador_producto_orden.addEventListener("submit", (e) => {
    e.preventDefault();
    const forData = {};
    for(let el of modificador_producto_orden.elements){
        if(el.name.length > 0)
      
            forData[el.name] = el.value;
        
    } 

    if(forData.talle == ''){
        forData.talle = null
    }
    if(forData.precio == ''){
        forData.precio = null
    }

    if(forData.cantidad == ''){
        return advertencia("No estas enviando un cantidad para este producto")
    }


    
    fecthNormalPOST_PUT("PUT", "ordenDetalle/" + idProductoModificar, forData)
            .then( res => {
               
                if(res.ok == true){
                    for(let el of modificador_producto_orden.elements){
                     
                        el.value = '';
                    } 
                
                    salio_todo_bien("se cambio todo con exito")

                }else if(res.ok == false){
                    algo_salio_mal(`Algo salio mal`)
                }else if(res.error == 2 || res.error == "2"){
                    advertencia(`Productos sin stock : ${res.productos_sin_stock}`, res.msg)}
            }) 
            .catch(err => {
                algo_salio_mal(`Algo salio mal: ${ err }`)
            })
})

window.agregarProductoID = () => {
    cerrar_abrir("agregarNuevoProducto", true);
}



const search2 = document.querySelector("#search2");

search2.addEventListener("keyup", ({keyCode}) => {


    if( keyCode !== 13){return;}
    if(search2.length === 0){return;}

    getSearch2(search2.value);
    search2.value = "";
});

const getSearch2 = (valor, offset=0) => {
let local = valueLocal;
    fecthNormalGET("GET", "producto/search/index/new/h/u?" + `nombre=${valor}&offset=${offset}&local=${local}`)
    .then(res => {
    
        imprimirHistorial(res.productos);
    })
    .catch( err =>{
        
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}

const imprimirHistorial = (res) => {
    let historial  = ""

for(let e of res){

    historial += `
   
    <tr>
      <td data-label="ARTICULO">${devolverString(e.productos.id)}</td>
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
      <button type="button" value="${e.productos.talles}" class="btn btn-primary btn-sm" id="${e.productos.id}" onclick="agrgarProductoNEW(this)">AGREGAR</button>
      </td>
    </tr>


    `;

    document.querySelector('.tbody_productos').innerHTML = historial;
}
imprimirTallesEnCadaProducto(res)

}
const talles_del_producto = document.querySelector(".talles_del_producto");
let boton_para_cargar = document.querySelector(".boton_para_cargar");
const cantidad_unica = document.getElementById("cantidad_unica");
const precioCambiarID2 = document.getElementById("precioCambiarID2");

let arrayTalle;
let idProductoAgregar

window.agrgarProductoNEW = (event) => {

    cerrar_abrir("cantidad2", true);
    let array = event.value.split(",");

    idProductoAgregar = event.id;
    boton_para_cargar.id = event.id
  arrayTalle = array;
  let historial = "";

  for(let i of array) {

    historial += `
    <div class="form-group">
    <label for="exampleFormControlInput1">${i}</label>
    <input type="number" class="form-control" id="talle_unico_${i}" style="width:50px">
    </div>
    `
  }

  talles_del_producto.innerHTML = historial;
}

cantidad_unica.addEventListener("input", (valor) => {
 
    for(let e of arrayTalle) {
      let talle_unico = document.getElementById(`talle_unico_${e}`);
      talle_unico.value = valor.target.value;
      talle_unico.disabled = true;
      
    }
  
    if(valor.target.value.length == 0 || valor.target.value == ''){
      for(let e of arrayTalle) {
        let talle_unico = document.getElementById(`talle_unico_${e}`);
        talle_unico.disabled = false;
        
      }
    }
  
  });
  
  talles_del_producto.addEventListener("keyup", (keyCode) => {
  
  /*   console.log(keyCode.keyCode); */
    if(keyCode.keyCode == 13) {
   
      let separador = keyCode.path[0].id; 
      if(keyCode.path[0].value.length == 0){
        return advertencia("Se te olvido colocar un valor")
      }
      
      let talles = separador.split("_")[2];

      let data = {
        id: idProductoAgregar,
        cantidad: keyCode.path[0].value,
        talle:talles,
        precio: precioCambiarID2.value == '' ? null : precioCambiarID2.value
      }
  
      
  
      enviarFormCarrito(data)
      
      
    }
  })
                  
                  
  window.enviar_datos_producto = (id) => {


    if( cantidad_unica.value == '' ) {
        return advertencia("Se te olvido colocar un valor")
    }
    let data = {
        id:id,
        cantidad:cantidad_unica.value,
        talle:null,
        precio: precioCambiarID2.value == '' ? null : precioCambiarID2.value

    }
   


    enviarFormCarrito(data)
  }




  const enviarFormCarrito = (data) => {
    
   
      fecthNormalPOST_PUT("POST", "ordenDetalle/"+idORDEN, data)
              .then( res => {

                  
                if(res.ok == true){


                    cantidad_unica.value = "";
               
                    for(let e of arrayTalle) {
                        let talle_unico = document.getElementById(`talle_unico_${e}`);

                        talle_unico.disabled = false;
                        talle_unico.value = "";
                      }
    
                      return salio_todo_bien()
                }else if (res.error == 10 || res.error == "10"){
                    localStorage.removeItem("x-token");
                    window.location.href = `${window.location.origin}/index.html`
                  }else if(res.error == 2 || res.error == "2"){
                    advertencia(`Productos sin stock : ${res.productos_sin_stock}`, res.msg)}
                  else{
                      return algo_salio_mal(`Algo salio mal: error al agregar Producto`)
                  }
              })
              .catch( err => {
                  algo_salio_mal(`Algo salio mal: ${ err }`)
              })
  }


  const flexCheckDefault = document.getElementById('flexCheckDefault');
  const flexCheckDefault2 = document.getElementById('flexCheckDefault2');
  

  flexCheckDefault.addEventListener('click', () => {

    if(flexCheckDefault.checked === true) {

        cerrar_abrir('precioCambiar', true)
    }else{
        cerrar_abrir('precioCambiar', false);
        precioCambiarID.value = ''
    }

  })
 
  flexCheckDefault2.addEventListener('click', () => {
     

    if(flexCheckDefault2.checked === true) {

        cerrar_abrir('precioCambiar2', true)
    }else{
        cerrar_abrir('precioCambiar2', false);
        precioCambiarID2.value = '';
    }

  })
 


//filtro de fecha del historial

let localNombre = '';
window.cambiar_filtro = (e) => {

    const input_fecha = document.querySelector(".input_fecha")
    if(e.value == 1){
        input_fecha.innerHTML = `
        <input type="date" id="startDate" class="form-control form-control-sm">
        <input type="date" id="endDate" class="form-control form-control-sm">
        <button id="${e.id}" class="btn btn-primary btn-sm" onclick="filtroPorFechas(this.id)">Buscar</button>
        `

    }else if(e.value == 2){
        input_fecha.innerHTML = `
        <input type="date" id="fecha_exacta" class="form-control form-control-sm">
        <button id="${e.id}" class="btn btn-primary btn-sm" onclick="filtroPorFechas(this.id)">Buscar</button>
        `
    }else{
        input_fecha.innerHTML = ``
    }
}


window.filtroPorFechas = (e) => {

    /* dataRango = [];  */
    numeroPaginas = null;

    const startDate    = document.getElementById("startDate");
    const endDate      = document.getElementById("endDate");
    const fecha_exacta = document.getElementById("fecha_exacta");
    let dato
   

    fecha_exacta?.value == '' || fecha_exacta?.value == undefined ? dato =  {fecha:[startDate.value, endDate.value]} : dato = {fecha:[fecha_exacta.value]}

    funcFechas(dato);
}


let fechaSave
const funcFechas = (fecha, offset=0) => {

    cargaMedio("spinner_load", true);
    
    fecthNormalPOST_PUT("POST",`historial/fecha/local?local=${localNombre}&offset=${offset}`, fecha)
            .then(res => {

                cargaMedio("spinner_load", false);
                if(numeroPaginas == null || numeroPaginas == "null" ){
                    paginacion(res.contador, "fecha")
                }
            
                numeroPaginas = res.contador;
                fechaSave = fecha;
                imprimirEnPantalla(res.datos);

            })
            .catch( err => {
    cargaMedio("spinner_load", false);

                return algo_salio_mal(`algo_salio_mal(Algo salio mal: ${ err }`)
            })

}

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

    if(datos[2] == "local"){

        if(datos[1] == 0){

          return cambiarLocalValue(localNombre)

        }else{
    
          return cambiarLocalValue(localNombre, datos[1]+"0")
        }
      }
      if(datos[2] == "fecha"){

        if(datos[1] == 0){
          return funcFechas(fechaSave)
        }else{
    
          return funcFechas(fechaSave, datos[1]+"0")
        }
      }

/* 
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
 */
    if(datos[1] == 0){
        recargaPaginaIgual = "0";
        main_historial();
      
    }else{
        
        main_historial(datos[1]+"0") 
        recargaPaginaIgual = datos[1]+"0";
    }

    
}

const seleccion_locales_agregar = document.querySelector("#seleccion_locales_agregar");
const opcionesDeLocales = () => {
    fecthNormalGET("GET", "producto/locales/todos")
        .then( res => {
          let datos = res.result;
          let result = ""
          datos.map( e => {
  
            result = `
            <option value="${e}">${e}</option>
            `
            seleccion_locales_agregar.innerHTML += result;
  
  
          })
        })
        .catch( err =>{
          algo_salio_mal(`Algo salio mal: ${ err }`)
      })
  }
  
  opcionesDeLocales();
let valueLocal = '';

window.cambioDeLocales = (This) => {
    valueLocal = This.value;
}



var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function(event) {
  event.stopPropagation();
  dropdown.classList.toggle('is-active');
});
;

const agregarOpcionesDeModificacionCliente = (orden) => {

    if(orden.id_direccion == null){
        document.querySelector("#seleccion_cambio").innerHTML = 
        `
        <option value="0">Opciones...</option>
        <option value="nombre">Nombre</option>
        <option value="apellido">Apellido</option>
        <option value="dni_cuil">DNI O CUIL</option>
        <option value="tel_cel">Telefono o Celular</option>
        <option value="email">Email</option>
        `

    }else{
        document.querySelector("#seleccion_cambio").innerHTML = 
        `
        <option value="0">Opciones...</option>

        <option value="nombre">Nombre</option>
        <option value="apellido">Apellido</option>
        <option value="dni_cuil">DNI O CUIL</option>
        <option value="tel_cel">Telefono o Celular</option>
        <option value="email">Email</option>
        <option value="direccion">Direccion</option>
        <option value="cp">Codigo Postal</option>
        <option value="provincia">Provincia</option>
        <option value="localidad">Localidad</option>
        `
    }
}

const input_con_el_valor = document.querySelector(".input_con_el_valor");

window.opcionesDrop = (tag, estado) => {
    abrirCerrarVentanas(tag, estado)
}


let valueCambio
window.selecciconCambios = (e) => {

    valueCambio = e.value;


    if( e.value == '0' || e.value == undefined ) {
        input_con_el_valor.innerHTML = ""
    }else{
      

        input_con_el_valor.innerHTML = `
        <div class="input-group mb-3">
        <input type="text" class="form-control" aria-describedby="basic-addon2" name="${e.value}" id="input_cambio">
        <div class="input-group-append">
        <button class="btn btn-outline-primary " type="button" onclick="enviar_cambio(this)">Cambiar</button>
        </div>
        </div>
        `
    }

}



let dataArray = ['nombre', 'apellido', 'dni_cuil', 'tel_cel', 'email'];


window.enviar_cambio = (e) => {

    let data = {
        valor: document.getElementById('input_cambio').value
    }

    data[`${valueCambio}`] = data.valor;
    delete data.valor;

    if( dataArray.some( h => h == valueCambio) == true){

        //cambiar cliente

        fecthNormalPOST_PUT("PUT", "cliente/" + infoOrden.id_cliente, data)
        .then( res => {
            if(res.ok == true){
                salio_todo_bien()
                document.getElementById('input_cambio').value = "";
            }
        })
        .catch( err => {
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })



    }else{
        //cambiar direccion

        fecthNormalPOST_PUT("PUT", "direccion/" + infoOrden.id_direccion, data)
        .then( res => {
            if(res.ok == true){
                salio_todo_bien()
                document.getElementById('input_cambio').value = "";

            }
        }
        )
        .catch( err => {
            algo_salio_mal(`Algo salio mal: ${ err }`)
        }
        )

    }
}