import { comprobarCarritoStorage } from "../helpers/ventas/comprobarCarritoStorage.js";
import { agregarAlFormularioCliente } from "../helpers/ventas/agregarAlFormularioCliente.js";
import { selecciconCambios_direccion } from "../helpers/ventas/seleccicon_cambios_direccion.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { fecthNormalGET } from "../helpers/ventas/fetch.js";


const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : '';



 ///////////////CONFIRMAR CARRITO EN LOCALSTORAGE///////////////////////////////
comprobarCarritoStorage();
 /////////////// FIN CONFIRMAR CARRITO EN LOCALSTORAGE///////////////////////////////


fecthNormalGET("GET", `carrito/${1}`)
    .then( res => {

        leerCarrito(res.carrito_full);
        })

 ////////////////ACTUALIZAR CARRITO A PENAS ENTRA////////////////////////////////
const carritoActualizar = () => {

    fetch(url, "carrito",{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        leerCarrito(res)
        localStorage.setItem("carrito", 1);
    })
    .catch(err => {
        alert("Error: " + err.message)
    });

}

const carrito_datos = document.querySelector(".carrito_datos")
const final_precio = document.querySelector(".final_precio")
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
const modificarCarrito = document.querySelector(".modificarCarrito")
const salir_modificador = document.querySelector(".salir_modificador")

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
window.configurar = (id) => {

    modificarCarrito.style.display = "grid";
    modificarCarrito.style.visibility = "visible";
}
salir_modificador.addEventListener("click", () => {
    modificarCarrito.style.display = "none";
    modificarCarrito.style.visibility = "hidden";
})


 ////////////////FIN ACTUALIZAR CARRITO A PENAS ENTRA////////////////////////////////


 ////////////////CONFIGURAR O ELIMINAR PRODUCTO DEL CARRITO////////////////////////////////

const ruedaConfigurar = document.querySelectorAll(".rueda");
const ruedaEliminar   = document.querySelectorAll(".cruz");

//MODIFICAR CARRITO
ruedaConfigurar.forEach( (boton) => {
    boton.addEventListener("click", (e) => {

        e.preventDefault();

        console.log(boton.id);

       //GET FECHT PARA OBTENER LOS DATOS DEL CARRITO Y CAMBIAR LA CANTIDAD 

    })
});



//ELIMINAR PRODUCTO DEL CARRITO
ruedaEliminar.forEach( (boton) => {
    boton.addEventListener("click", (e) => {

        e.preventDefault();
        console.log(boton.id);
        //ELIMINAR DE CARRITO Y CON EL DI DEL USUARIO QUE ESTA USANDO ESTA CUENTA

    })
});
 ////////////////FIN CONFIGURAR O ELIMINAR PRODUCTO DEL CARRITO////////////////////////////////



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
//BUSCADOR
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

const clientInformacionSOLO = document.querySelector(".clientInformacionSOLO");

window.mandarID = async(e) => {

    volverAtras(buscadorCli, cartelCliente);
    direccionCliente(e);
    agregarAlFormularioCliente(clientInformacionSOLO);

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

window.selecciconCambios = (s) => {

    selecciconCambios_direccion(s, direccionDeCliente)

}


///////////////// FIN CLIENTE EXISTENTE //////////////////


/////// RELLENAR DATOS PARA CONFIRMAR COMPRA //////////////////
const botonCliente = document.querySelector(".btnCliente");
const formCliente = document.querySelector(".formProducto")



botonCliente.addEventListener("click", (e) => {
    console.log(e.target)
})


formCliente.addEventListener("submit", (e) =>{

    e.preventDefault();

    const forData = {}; // DATOS PARA MANDAR A DB DE CLIENTE NUEVO
    const forDataConfirmar = {} // 2 DATOS PARA GENERAR NUEVA ORDEN
    
    for(let el of formCliente.elements){
        if(el.name.length > 0){

            if(el.name === "fecha"  || el.name === "transporte"){
                forDataConfirmar[el.name] = el.value;
            }else{

                forData[el.name] = el.value;
            }

        }

    }
    
    console.log(forData);
    console.log(forDataConfirmar);


    fetch(url, "cliente",{ 
        method: "POST",
        body: JSON.stringify( forData ),
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {

        forDataConfirmar["idCliente"] = res.id;
        generarOrden(forDataConfirmar);

    })
    .catch(err => {
        alert("Error: " + err.message)
    });

})

/////// FIN RELLENAR DATOS PARA CONFIRMAR COMPRA //////////////////




const generarOrden = (data) => {

    fetch(url, "cliente",{ 
        method: "POST",
        body: JSON.stringify( data ),
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        localStorage.setItem("idOrden", res.id);
        localStorage.removeItem("carrito");
        localStorage.getItem("carrito", 0);
    })
    .catch(err => {
        alert("Error: " + err.message)
    });
}