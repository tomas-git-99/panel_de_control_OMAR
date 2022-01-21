
import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { usuarioPermisos } from "../helpers/para_todos/usuarios_permisos.js";
import { fecthNormalGET, fecthNormalGET_QUERY, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js"

const imprimir_taller = document.querySelector(".imprimir_taller");
const rol = localStorage.getItem('roles');
usuarioPermisos( rol, "ventas");

const main = () => {

    fecthNormalGET("GET", "produccion/taller")
        .then(res => {
            imprimir(res.taller)
        })
        .catch( err => {
            algo_salio_mal(`Algo salio mal: ${ err}`)
        });
}

main();
const imprimir = (res) => {

    let resultado = "";
    res.map ( e => {
        resultado += `
        <tr>
    
        <td data-label="NOMBRE">${e.nombre_completo}</td>
        <td data-label="TELEFONO">${e.telefono}</td>
        <td data-label="DIRECCION">${e.direccion}</td>
        <td>
        <div id="${e.id}" onclick="enviar_id(this.id)" class="boton_seleccion">
        <img src="https://img.icons8.com/ios/50/000000/settings--v1.png" width="25px"/> 
        </div>
        </td>
        
      </tr>
        `
    })
    imprimir_taller.innerHTML = resultado;
};


const opciones_cambio = document.querySelector(".opciones_cambio_2");
const input_con_el_valor = document.querySelector(".input_con_el_valor_2");
const seleccion_cambio = document.querySelector("#seleccion_cambio");

window.enviar_id = (id) => {
    opciones_cambio.style.display = "grid";
    opciones_cambio.style.visibility = "visible";
    seleccion_cambio.innerHTML = `
        <option selected>Seleccione que cambiar</option>
        <option id="${id}" value="nombre_completo">Nombre completo</option>
        <option id="${id}" value="telefono">Telefono</option>
        <option id="${id}" value="direccion">Direccion</option>

        
    `
}




window.selecciconCambios = (e) => {

    input_con_el_valor.innerHTML = `
    <div class="input-group mb-3">
    <input type="text" class="form-control" aria-describedby="basic-addon2" name="${e.value}" id="input_cambio">
    <div class="input-group-append">
    <button class="btn btn-outline-primary " id="${e[e.selectedIndex].id}" type="button" onclick="enviar_cambio(this.id)">Cambiar</button>
    </div>
    </div>
    
    `
}
window.enviar_cambio = (id) => {
    const input_cambio = document.getElementById("input_cambio");

    let dato = {
        name: input_cambio.value
    }

    dato[`${input_cambio.name}`] = dato.name;
    delete dato.name;

    fecthNormalPOST_PUT("PUT", `produccion/taller/${id}`, dato)
        .then( res => {

            salio_todo_bien("Todo salio exelente")
            input_cambio.value = "";
           
            
        })
        .catch( err =>{
            algo_salio_mal(`Algo salio mal: ${ err }`)

            console.log(err)
        })
}

window.salir_cambios = () => {
    opciones_cambio.style.display = "none";
    opciones_cambio.style.visibility = "hidden";
    main()
}

const search = document.getElementById("search");




search.addEventListener("keyup", ({keyCode}) => {

    if( keyCode !== 13){return;}
    if(search.length === 0){return;}

    getSearch(search.value);
    search.value = "";
});


const getSearch = (valor) => {

    fecthNormalGET("GET", `produccion/taller/buscar?nombre=${valor}`)
    .then( res => {
        imprimir(res.taller)
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}

window.cerrar_seccion = () => {
    cerrar_login();
}
const nombre = localStorage.getItem("nombre");


const nombre_usario = document.querySelector("#nombre_usario");


nombre_usario.innerHTML =  nombre;


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