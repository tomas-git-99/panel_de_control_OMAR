
const btnConfirmar = document.querySelector(".confirmar");


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

//


const ruedaConfigurar = document.querySelectorAll(".rueda");
const ruedaEliminar   = document.querySelectorAll(".cruz");

//MODIFICAR CARRITO
ruedaConfigurar.forEach( (boton) => {
    boton.addEventListener("click", (e) => {

        e.preventDefault();

        console.log(boton.id);

        //GET FECHT PARA OBTENER LOS DATOS DEL CARRITO Y CAMBIAR LA CANTIDAD

    })
})



//ELIMINAR PRODUCTO DEL CARRITO
ruedaEliminar.forEach( (boton) => {
    boton.addEventListener("click", (e) => {

        e.preventDefault();

     
        console.log(boton.id);

        //ELIMINAR DE CARRITO Y CON EL DI DEL USUARIO QUE ESTA USANDO ESTA CUENTA

    })
})



const bienvenido = document.querySelector(".bienvenido");
const cliente = document.querySelector(".cliente");


btnConfirmar.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("forData");
    
    const confirmarCompra = localStorage.getItem("carrito");

    
    if(confirmarCompra == 1){

        volverAtras(bienvenido, cliente)
        
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



const botonCliente = document.querySelector(".btnCliente");
const formCliente = document.querySelector(".formProducto")



botonCliente.addEventListener("click", (e) => {
    console.log(e.target)
})


formCliente.addEventListener("submit", (e) =>{

    e.preventDefault();

    const forData = {};
    const forDataConfirmar = {}
    
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