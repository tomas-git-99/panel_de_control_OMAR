
import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { fecthNormalGET, fecthNormalGET_QUERY, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js"

const imprimir_taller = document.querySelector(".imprimir_taller");


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
    
        <td>${e.nombre_completo}</td>
        <td>${e.telefono}</td>
        <td>${e.direccion}</td>
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
            input_cambio = "";
        })
        .catch(err => {

        })
}

window.salir_cambios = () => {
    opciones_cambio.style.display = "none";
    opciones_cambio.style.visibility = "hidden";
    main()
}