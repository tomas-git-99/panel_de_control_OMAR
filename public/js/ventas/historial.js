import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { funcionParaImprimir, funcionParaImprimir_sin_nombre, imprimirComprobante_cliente, imprimir_parami } from "../helpers/ventas/imprimir_ticket.js";
import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { cargaMedio } from "../helpers/para_todos/carga_de_botones.js";
import { devolverString } from "../helpers/para_todos/null.js";
import { usuarioPermisos } from "../helpers/para_todos/usuarios_permisos.js";
import { conteoPorTalle, imprimirTallesEnCadaProducto } from "../helpers/ventas/productos_ventas.js";


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

    if(e.value == "0"){

        return main_historial();
    }

    fecthNormalGET("GET",`historial/buscar/${e.value}?offset=0`)
    .then( res => {

        
        imprimirEnPantalla(res.datos)
    })
    .catch( err => {
        
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}




//MODIFICAR CARRITO

const productos_orden = document.querySelector('.productos_orden')
const modificarCarrito = document.querySelector('.modificarCarrito')
const cantidadTalle = document.querySelector('.cantidadTalle')

let idORDEN

window.modificar_orden = (id) => {

    idORDEN = id;
 

    fecthNormalGET("GET","ordenDetalle/"+id)
        .then( res => {

            imprimirProductosOrden(res.ordenDetalle);

            cerrar_abrir("modificarCarrito", true);
        

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
        <td>${devolverString(e.id)}</td>
        <td>${devolverString(e.nombre_producto)}</td>
        <td>${devolverString(e.talle)}</td>
        <td>${devolverString(e.cantidad)}</td>
        <td>${devolverString(e.precio)}</td>
        <td>
        <div id="${e.id}" onclick="moificar_producto(this.id)" class="boton">
        <img src="https://img.icons8.com/ios/50/000000/settings--v1.png" width="25px"/> 
        </div>
        
        </td>
        </tr>
        `
    })

    productos_orden.innerHTML = historial;

}

{/* <td>${devolverString()}</td> */}

let idProductoModificar 
window.moificar_producto = (id) => {
    cerrar_abrir("cantidadTalle", true);
    idProductoModificar = id;
}


window.close_ventana = (id) => {
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

    console.log(forData)

  /*   fecthNormalPOST_PUT("PUT", "ordenDetalle/" + idProductoModificar, forData)
            .then( res => {
                if(res.ok == true){
                    salio_todo_bien("se cambio todo con exito")
                }else{
                    algo_salio_mal(`Algo salio mal`)
                }
            }) 
            .catch(err => {
                algo_salio_mal(`Algo salio mal: ${ err }`)
            }) */
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

    fecthNormalGET("GET", "producto/search?" + `nombre=${valor}&offset=${offset}`)
    .then(res => {

        imprimirHistorial(res.productos)
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
const cantidad_unica = document.getElementById("cantidad_unica");

let arrayTalle;

window.agrgarProductoNEW = (event) => {

    cerrar_abrir("cantidad2", true);
    let array = event.value.split(",");

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
  
  })
  