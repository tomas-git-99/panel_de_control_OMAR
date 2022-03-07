import { advertencia, algo_salio_mal, salio_todo_bien} from "./helpers/para_todos/alertas.js";
import { verificarToken } from "./helpers/para_todos/permisos.js";
import { fecthNormalGET, fecthNormalPOST_PUT } from "./helpers/ventas/fetch.js";
import { cerrar_login } from "./helpers/para_todos/cerrar.js";
import { devolverString } from "./helpers/para_todos/null.js";

const form = document.querySelector("form");
let value_rol;
let online_local_usuario;
let token = localStorage.getItem('x-token');
verificarToken(token);


const local = document.querySelector(".local");
const local_value = document.getElementById("local_value");



form.addEventListener('submit', (e) => {

    e.preventDefault();
 
    const forData = {};
 
    for(let el of form.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        } 


    if(value_rol == 0 || value_rol == "0" || value_rol == null){
        return algo_salio_mal("Eliga un rol para continuar")
    }

    if(value_rol == "VENTAS"){
        
        if(online_local_usuario == 0 || online_local_usuario == "0" || online_local_usuario == null || online_local_usuario == undefined){
    
            return algo_salio_mal("Porfavor eliga si esta cuenta se va usar para ventas online o por local")

        }else if(online_local_usuario == "LOCAL"){
            if(local_value.value == ""){

                return algo_salio_mal("Porfavor eliga el local que va ser usado esta cuenta")
            }

        }
    }


    forData["rol"] = value_rol;
    forData["venta"] = online_local_usuario;
    forData["local"] = local_value.value;

   


    fecthNormalPOST_PUT("POST", "usuario", forData)
         .then((res) => {
             if(res.ok == true){
                Swal.fire({
                    icon: 'success',
                    title: 'Creado con exito',
                    text: `Nuevo usuario. Nombre: ${res.usuario.nombre}, DNI O CUIL: ${res.usuario.dni_cuil}`,
                  })

                  for(let el of form.elements){
                    if(el.name.length > 0)
                        el.value = "";
                    } 
             }else{
                 
                advertencia(res.msg || res.errors[0].msg || res.errors[1].msg || res.errors[2].msg);
             }
         })
         .catch((err) => {
            console.log(err)
             algo_salio_mal(`Algo salio mal: ${ err }`);
 
         })


         /* console.log(forData) */
 
 }) 

 
 const online_o_local = document.querySelector(".online_o_local");
 
 
 window.rol = (e) => {
    value_rol = e.value;
    if(e.value == "VENTAS"){
        online_o_local.style.display = "grid";
        online_o_local.style.visibility = "visible";


    }else{
        online_local_usuario = "";
        online_o_local.style.display = "none";
        online_o_local.style.visibility = "hidden";

    }
}
window.online_local = (e) => {
    online_local_usuario = e.value

    if( e.value == "ONLINE"){
        local.style.display = "none";
        local.style.visibility = "hidden";
        local_value.value = "";

    }else{
        local.style.display = "grid";
        local.style.visibility = "visible";
    }
}
window.cerrar_seccion = () => {
    cerrar_login();
}



const search = document.querySelector("#search");

search.addEventListener("keyup", ({keyCode}) => {

    if( keyCode !== 13){return;}
    if(search.length === 0){return;}

    getSearch(search.value);

    console.log(search.value)
    search.value = "";
});

let palabraBuscada = "";

const getSearch = (valor, offset=0) => {

    
   /*  cargaMedio("spinner_load", true); */


    fecthNormalGET("GET", "usuario/buscar/user/v?" + `value=${valor}`)
    .then(res => {
        console.log(res)
        imprimirENLaTabla(res.usuario);
 /*        cargaMedio("spinner_load", false);
        if(palabraBuscada == ""){
            paginacion(res.contador, "search");
        }

        palabraBuscada = valor;
        colorearTable(res.produccion); */

    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })


}

const tablaDeUsuarios = document.querySelector(".tablaDeUsuarios");


const imprimirENLaTabla = (res) => {

    let historial = ""
    res.map ( e => {

        historial += `
        <tr>
            <td>${devolverString(e.nombre)}</td>

            <td>${devolverString(e.rol)}</td>
          
            <td>${devolverString(e.local)}</td>
      
            <td>

                <button class="btn btn-warning btn-sm" onclick="editarUsuario(${e.id}, this)">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${e.id}, this)">Eliminar</button>
            </td>
        </tr>
        `

    })

    tablaDeUsuarios.innerHTML = historial;

}


const CAMBIOS = {
    1: "nombre",
    2: "local",
    3: "password",
}

let valorDeCambio
let idDelUsuairo

let thisUpdate
window.funCambiar = (valor) => {

    document.querySelector('.inputValor').innerHTML = 
    `
    <input type="text" class="form-control" id="inputValue" placeholder="Ingrese el valor">
    <button type="button" class="btn btn-primary" onclick="enviarCambios()">Cambiar</button> 
    `
    valorDeCambio = CAMBIOS[parseInt(valor)]
    
}

let valorIndex
window.enviarCambios = () => {

    let data = {
        data:document.querySelector("#inputValue").value
    }



    data[`${valorDeCambio}`] = data['data'];
    delete data.data

    let nombre = Object.keys(data);


    fecthNormalPOST_PUT("PUT", `usuario/${idDelUsuairo}`, data)
    .then( res => {

        if(res.ok == true){
            if(nombre[0] !== "password"){
                const tablaB = document.getElementById("tablaDeUsuariosID")
                tablaB.deleteRow(thisUpdate);
    
                let fila = tablaB.insertRow(thisUpdate);
    
    
                fila.innerHTML = `
                <td>${devolverString(res.usuario.nombre)}</td>
                <td>${devolverString(res.usuario.rol)}</td>
                <td>${devolverString(res.usuario.local)}</td>
                <td>
        
                <button class="btn btn-warning btn-sm" onclick="editarUsuario(${res.usuario.id}, this)">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${res.usuario.id}, this)">Eliminar</button>
    
                </td>
                `
        
        
        
                salio_todo_bien();

            }else{
                
                salio_todo_bien();

            }


        }else{
            advertencia(res.msg);
        }

     
    })
    .catch( err => {
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}

window.eliminarUsuario = (id, This) => {



    Swal.fire({
        title: '¿Esta seguro que quiere eliminar este usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI'
      }).then((result) => {
        if (result.isConfirmed) {
            fecthNormalPOST_PUT("DELETE", `usuario/${id}`)
            .then( res => {

                const row = This.parentNode.parentNode;
                document.getElementById("tablaDeUsuariosID").deleteRow(row.rowIndex);

                salio_todo_bien();
            }
            )
            .catch( err => {
                algo_salio_mal(`Algo salio mal: ${ err }`)
            }
            )
        
        }
      })



}

window.editarUsuario = (id, This) => {
    abrirCerrar('opcionesDeParaModificaciones',true);
    idDelUsuairo = id;
    thisUpdate = This.parentNode.parentNode.rowIndex;
}
    

const abrirCerrar = (valor, estado) => {


    if(estado){


        document.querySelector(`.${valor}`).style.display = "grid";
        document.querySelector(`.${valor}`).style.visibility = "visible";

    }else{
            
        document.querySelector(`.${valor}`).style.display = "none";
        document.querySelector(`.${valor}`).style.visibility = "hidden";
    }
}



window.cerrarVentana = (valor) => {
    abrirCerrar(valor, false);
}


window.abrirVentanaCerrar = (valorOpen, valorClose) => {
    abrirCerrar(valorOpen, true);
    abrirCerrar(valorClose, false);

}