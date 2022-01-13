import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { devolverString } from "../helpers/para_todos/null.js";
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";


const table_rollos = document.querySelector(".table_rollos");
const table_rollos_data = document.querySelector(".table_rollos_data")


const view_data_rollos = document.querySelector(".view_data_rollos")
const bienvenido = document.querySelector(".bienvenido")
const solo_para_id = document.querySelector(".solo_para_id")
const aca_va_solo_el_ID = document.querySelector(".aca_va_solo_el_ID")
const aca_va_el_titulo = document.querySelector(".aca_va_el_titulo")



window.abrir_id = (id) => {


    let data = id.split("_");

    abrir_buscar_id(data[0]);
    solo_para_id.id = data[0];
    volverAtras(bienvenido, view_data_rollos);


    
    aca_va_el_titulo.innerHTML = `<h2>${data[1]}</h2>`

} 


window.cerrar_view = (data) => {
    if(data == "1"){
        main_historial()
        volverAtras(view_data_rollos, bienvenido);
    }else if (data == "2"){

        agregar_rollos.style.display="none";
        agregar_rollos.style.visibility="hidden";
        abrir_buscar_id(aca_va_solo_el_ID.id)

    }else if (data == "3"){

        
        abrir_buscar_id(solo_para_id.id)
        volverAtras( opciones_cambio, view_data_rollos);

    }

}





const main_historial = () => {

    fecthNormalGET("GET", "produccion/rollos")
    .then( res => {
    
        imprimir_historial(res.data)
    })
    .catch (err => {
        algo_salio_mal(`Algo salio mal: ${ err }`);
    })
}


main_historial();

const imprimir_historial = (res) => {


    let historial = ""

    let contador = 0;
   
 

    res.map( (e,p) => {
        for(let i of res[p].rollos){
            contador = i.cantidad + contador;
        } 

        historial += `
        <tr id="${e.rollo.id}_${e.rollo.nombre}" onclick="abrir_id(this.id)">
        <td data-label="NOMBRE">${devolverString(e.rollo.nombre)}</td>
        <td data-label="TOTAL">${devolverString(contador)}</td>
        </tr>
        `
        contador = 0;

    });

    table_rollos.innerHTML = historial;


}



const abrir_buscar_id = (id) => {

    fecthNormalGET("GET", "produccion/rollos/" + id)
    .then( res => {
        imprimir_historial_view(res.rollos)
    })
    .catch (err => {
        algo_salio_mal(`Algo salio mal: ${ err }`);
    })
}

const imprimir_historial_view = (res) => {


    let historial = ""


    res.map( e => {

        historial += `
        <tr id="${e.id}">
        <td>${devolverString(e.cantidad)}</td>
        <td>${devolverString(e.estanpado)}</td>
        <td>${devolverString(e.color)}</td>

        <td data-label= "AJUSTES"> 
        <div id="${e.id}" onclick="enviar_id(this.id)" class="boton_seleccion">
        <img src="https://img.icons8.com/ios/50/000000/settings--v1.png" width="25px"/> 
        </div>
        </td>

        </tr>
        `
    })

    table_rollos_data.innerHTML = historial;


}

const form_agregar_rollo= document.querySelector(".form_agregar_rollo");
const agregar_rollos= document.querySelector(".agregar_rollos");




window.agregar_new_rollos = (id) => {
    aca_va_solo_el_ID.id = id;

    agregar_rollos.style.display="grid";
    agregar_rollos.style.visibility="visible";
    


};


window.agregar_rollos = (id) => {

    
}

form_agregar_rollo.addEventListener("submit", (e) => {
    e.preventDefault();

    const forData = {};
    
    for(let el of form_agregar_rollo.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        }

    forData.id_rollo = aca_va_solo_el_ID.id;


    fecthNormalPOST_PUT("POST", `produccion/rollos/rollos/${aca_va_solo_el_ID.id}`, forData)
        .then( res => {
            
            salio_todo_bien("Todo salio exlente")
        })
        .catch( err =>{
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
})




///CAMBIAR DATOS 

const opciones_cambio = document.querySelector(".opciones_cambio");
const seleccion_cambio = document.querySelector("#seleccion_cambio");
const input_con_el_valor = document.querySelector(".input_con_el_valor");


window.enviar_id = (id) => {
    opciones_cambio.id = id;
    opciones_cambio.style.display = "grid";
    opciones_cambio.style.visibility = "visible";
  
  
    seleccion_cambio.innerHTML = `
    <option selected>Seleccione que cambiar</option>

    <option id="${id}" value="cantidad">Cantidad</option>
    <option id="${id}" value="estanpado">Estanpado</option>
    <option id="${id}" value="color">Color</option>
   
  
    
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
    let input_cambio = document.getElementById("input_cambio");
  
    let dato = {
        name: input_cambio.value
    }
  
    dato[`${input_cambio.name}`] = dato.name;
    delete dato.name;
  
    fecthNormalPOST_PUT("PUT", `produccion/rollos/${id}`, dato)
    .then( res => {
        input_cambio.value = "";
        salio_todo_bien("Todo salio exlente")
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
  
  
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

window.cerrar_seccion = () => {
    cerrar_login();
}
