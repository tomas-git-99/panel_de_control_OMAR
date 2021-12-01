const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : '';


 ///////////////CONFIRMAR CARRITO EN LOCALSTORAGE///////////////////////////////
      
const comprobarCarritoStorage = () => {

    const carrito = localStorage.getItem('carrito');

    if(carrito == 1){
        return true;
    
    }else if(carrito == null || undefined){
    
        localStorage.setItem("carrito", 1);
        return false;
    }else if(carrito == 0){
        const idOrden = localStorage.getItem('idOrden');
        if(!idOrden == null){
            return true;
        }else{
        localStorage.setItem("carrito", 1);
        return false;
        }
    }
}
comprobarCarritoStorage();
 /////////////// FIN CONFIRMAR CARRITO EN LOCALSTORAGE///////////////////////////////



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


const leerCarrito = (res) => {

    let historial = ""
    res.map( e => {
        historial = `
        <tbody>
        <tr>
          <th scope="row">134</th>

          <td>${e.nombre}</td>
          <td>689</td>
          <td>1,2,3,4,5</td>
          <td>la mejor</td>
          <td>
          <div class="boton rueda" id="${e.id}">
          <img src="/public/img/rueda.svg" alt="" width="23px">
          </div>
          </td>
          <td>
          <div class="boton rueda" id="${e.id}">
          <img src="/public/img/rueda.svg" alt="" width="23px">
           </div>
          </td>
        </tr>

      </tbody>
        `;
        
    })
}

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




const volverAtras = (cerrar, abrir) => {

        //abrir ventana anterior
        abrir.style.display = "grid";
        abrir.style.visibility = "visible";
    
    
        //cerrar ventana
        cerrar.style.display = "none";
        cerrar.style.visibility = "hidden";
}



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
    console.log(res);

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

const mandarID = async(e) =>{

    volverAtras(buscadorCli, cartelCliente);
    
    
    direccionCliente(e);
    agregarAlFormulario();

    const direccionesCliente = JSON.parse(localStorage.getItem("dataDireccion"));

    console.log(direccionesCliente);

    agregarDireccionFormulario(direccionesCliente); 

}

//AGREGAR A LA BASE DE DATOS DE OREDEN, ID_DIRECCION

//BUSCAR CON EL ID EL CLIENTE LA DIRECCIONES QUE TIENE 

const direccionCliente = (idCliente) =>{

    fetch(url + "direccion/" + idCliente,{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {

        localStorage.setItem("dataDireccion", JSON.stringify(res.direccion));

    })
    .catch(err => {
        alert("Error: " + err)
    });

}

//COLOCAR TODOS LOS DATOS EN EL FORMULARIO

const clientInformacionSOLO = document.querySelector(".clientInformacionSOLO");
const agregarAlFormulario = () => {

    const data = JSON.parse(localStorage.getItem("dataCliente"));

    let historial = ""

    data.map( e => {
        historial += ` 

        <div class="nombre">
        <span>Nombre</span>
        <input type="text" class="form-control" name="nombre" placeholder="Nombre" value="${e.nombre}" disabled>
    </div>
    <div class="local">
        <span>Apellido</span>
        <input type="text"class="form-control" name="apellido" placeholder="Apellido" value="${e.apellido}" disabled>
    </div>
    <div class="cantidad">
        <span>DNI O CUIL</span>
        <input type="text"class="form-control" name="DNI O CUIL" placeholder="DNI O CUIL" value="${e.dni_cuil}" disabled>
    </div>
    <div class="talles">
        <span>Telefono o Celular</span>
             <input type="text"class="form-control" name="Telefono o Celular" placeholder=" Telefono o Celular" value="${e.tel_cel}" disabled>
         </div>

        `
    })

    clientInformacionSOLO.innerHTML = historial

}
const seleccionDirec = document.querySelector("#seleccionDirec");

const agregarDireccionFormulario = (dataDireccion) => {

    let historial = ""

    dataDireccion.map( e => {

        historial = `
        <option value="${e.id}">${e.direccion}</option>
        `
        seleccionDirec.innerHTML += historial;
    });


}


const direccionDeCliente = document.querySelector(".direccionDeCliente");
const selecciconCambio = (s) => {

    let historial = ""
    console.log(s.value)
    if(s.value == 0){
        
    historial = `
    
    <div class="provincia">
    <span>Provincia</span>
         <input type="text"class="form-control" name="provincia" placeholder="Provincia" value="">
     </div>

     <div class="localidad">
         <span>Localidad</span
         <input type="text"> 
         <input type="text"class="form-control" name="localidad" placeholder="Localidad" value="">
     </div>

     <div class="direccion">
         <span>Direccion</span>
         <input type="text"class="form-control" name="direccion" placeholder="Direccion" value="">
     </div>

     <div class="talles">
         <span>Codigo Postal</span>
         <input type="text"class="form-control" name="cp" placeholder="Codigo Postal" value="">
     </div>
    `
    return direccionDeCliente.innerHTML = historial;
    }
    const direcciones =  JSON.parse(localStorage.getItem("dataDireccion"));
    console.log(dataDireccion)
    const direcc = direcciones.find( e => { if (e.id == s.value){return e}});


    historial = `
    
    <div class="tela">
    <span>Provincia</span>
         <input type="text"class="form-control" name="provincia" placeholder="Provincia" value="${direcc.provincia}" disabled>
     </div>
     <div class="precio">
         <span>Localidad</span>
         <input type="text"class="form-control" name="localidad" placeholder="Localidad" value="${direcc.localidad}" disabled>
     </div>
     <div class="cantidad">
         <span>Direccion</span>
         <input type="text"class="form-control" name="direccion" placeholder="Direccion" value="${direcc.direccion}" disabled>
     </div>
     <div class="talles">
         <span>Codigo Postal</span>
         <input type="text"class="form-control" name="cp" placeholder="Codigo Postal" value="${direcc.cp}" disabled>
     </div>
    `


    direccionDeCliente.innerHTML = historial;
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