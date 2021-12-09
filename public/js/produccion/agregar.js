import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js"


const bienvenido_form = document.querySelector(".bienvenido_form");
const form_taller = document.querySelector(".form_taller");
const opciones = document.querySelector(".opciones");

const boton = document.querySelector(".boton")

window.agregar_producto = () => {
    volverAtras(opciones, bienvenido_form);
    opcines_taller();
}
window.agregar_taller = () => {
    volverAtras(opciones, form_taller);

}

const formProducto = document.querySelector(".formProducto");

formProducto.addEventListener("submit", (e) => {

    e.preventDefault();
    
    const forData = {};
    
    for(let el of formProducto.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        } 

    boton.innerHTML = `
    <button class="btn btn-primary" type="button" disabled>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  </button>
  
    `

    fecthNormalPOST_PUT("POST", "producto", forData)
        .then( res => {
            if(res.ok){
                salio_todo_bien("Salio todo correcto");
                volverAtras(bienvenido_form, opciones);
            }else{
                algo_salio_mal(`Algo salio mal`)
            }
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })

    
})



const seleccion_taller = document.querySelector("#seleccion_taller");



const opcines_taller = () => {
    fecthNormalGET("GET","tallers")
        .then(res =>{
            imprimir_opciones(res.taller)
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })
}


const imprimir_opciones = (res) => {
    let talleres = "";

    seleccionDirec.innerHTML =` <option value="0">TALLER</option>`;

    res.map( e => {

        talleres = `
        <option value="${e.id}">${e.nombre_completo}</option>
        `
        seleccion_taller.innerHTML += historialDireccion;
    });
}

const boton_taller = document.querySelector(".boton_taller")
const form_taller_agregar = document.querySelector(".form_taller_agregar");

form_taller_agregar.addEventListener("submit", (e) => {

    e.preventDefault();
    
    const forData = {};
    
    for(let el of formProducto.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        }

    boton_taller.innerHTML = `
    <button class="btn btn-primary" type="button" disabled>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  </button>
  
    `

    fecthNormalPOST_PUT("POST", "taller", forData)
        .then( res => {
            if(res.ok){
                salio_todo_bien("Salio todo correcto");
                volverAtras(form_taller, opciones);
            }else{
                algo_salio_mal(`Algo salio mal`)
            }
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })


})