import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js"


const bienvenido_form = document.querySelector(".bienvenido_form");
const form_taller = document.querySelector(".form_taller");
const opciones = document.querySelector(".opciones");
const form_estanpador = document.querySelector(".form_estanpador");
const form_rollo = document.querySelector(".form_rollo");

const boton = document.querySelector(".boton")

window.agregar_producto = () => {
    volverAtras(opciones, bienvenido_form);
    opcines_taller();
}
window.agregar_taller = () => {
    volverAtras(opciones, form_taller);

}
window.agregar_estanpador = () => {
    volverAtras(opciones, form_estanpador);
    
}
window.agregar_rollo = () => {
    volverAtras(opciones, form_rollo);
}

window.salir_ventana = (data) => {
    if(data == "estanpado"){
    limpiar(form_estanpador_agregar)
    volverAtras(form_estanpador, opciones);
    }else if(data == "taller"){
    limpiar(form_taller_agregar)

    volverAtras(form_taller, opciones);

    }else if(data == "producto"){
    limpiar(formProducto)

        volverAtras(bienvenido_form, opciones);

    }else if(data == "rollo"){

        volverAtras(form_rollo, opciones);

    }
}
const formProducto = document.querySelector(".formProducto");

let estapadoEstado
window.estanpado = (value) => {
    estapadoEstado = value.value ;
}

formProducto.addEventListener("submit", (e) => {

    e.preventDefault();
    
    const forData = {};
    
    for(let el of formProducto.elements){
        if(el.name.length > 0){
            if(!el.value == "" || el.value == null){

                if(el.name == "id_corte"){
                    const texto = el.value;
                    let newValor = texto.split(" ").join("") ;
                    forData[el.name] = newValor;  
             
                    
                }else{

                    forData[el.name] = el.value;    
                }

            }

        }
        } 

        boton.innerHTML = `
        <button class="btn btn-primary" type="button" disabled>
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      </button>
      `

      
    
    !id_taller == 0 || !id_taller == "0" ? forData.id_taller = id_taller : forData;
    

    fecthNormalPOST_PUT("POST", "produccion/producto_produccion?estado="+ estapadoEstado , forData)
        .then( res => {
            if(res.ok){ 
                salio_todo_bien("Salio todo correcto");
                volverAtras(bienvenido_form, opciones);
            }else if (res.error == 10 || res.error == "10"){
                localStorage.removeItem("x-token");
                window.location.href = `${window.location.origin}/index.html`
            }
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })
 

      

    
})



const seleccion_taller = document.querySelector("#seleccion_taller");



const opcines_taller = () => {
    fecthNormalGET("GET","produccion/taller")
        .then(res =>{
            imprimir_opciones(res.taller)
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })
}


const imprimir_opciones = (res) => {
    let talleres = "";

    seleccion_taller.innerHTML =` <option value="0">TALLER</option>`;

    res.map( e => {

        talleres = `
        <option value="${e.id}">${e.nombre_completo}</option>
        `
        seleccion_taller.innerHTML += talleres;
    });
}
let id_taller 

window.selecciconCambios = (e) => {
    id_taller = e.value;
}

const boton_taller = document.querySelector(".boton_taller")
const form_taller_agregar = document.querySelector(".form_taller_agregar");


form_taller_agregar.addEventListener("submit", (event) => {

    event.preventDefault();
    
    const forData = {};
    
    for(let el of form_taller_agregar.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        }

    boton_taller.innerHTML = `
    <button class="btn btn-primary" type="button" disabled>
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  </button>
  
    `

    fecthNormalPOST_PUT("POST", "produccion/taller", forData)
        .then( res => {
            if(res.ok){
                salio_todo_bien("Salio todo correcto");
                volverAtras(form_taller, opciones);
            }else if (res.error == 10 || res.error == "10"){
                localStorage.removeItem("x-token");
                window.location.href = `${window.location.origin}/index.html`
            }else{
                algo_salio_mal(`Algo salio mal`)
            }
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })


})


const form_estanpador_agregar = document.querySelector(".form_estanpador_agregar");
form_estanpador_agregar.addEventListener("submit", (e) => {

    e.preventDefault();
    
    const forData = {};
    
    for(let el of form_estanpador_agregar.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        }

    fecthNormalPOST_PUT("POST", "produccion/estanpado", forData)
        .then( res => {

     
            if(res.ok){
                salio_todo_bien("Salio todo correcto");
                volverAtras(form_estanpador, opciones);
            }else if (res.error == 10 || res.error == "10"){
                localStorage.removeItem("x-token");
                window.location.href = `${window.location.origin}/index.html`
            }else{
                algo_salio_mal(`Algo salio mal`)
            }
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })

})

const form_rollo_agregar = document.querySelector(".form_rollo_agregar");


form_rollo_agregar.addEventListener ("submit", (e) => {
    e.preventDefault();

    const forData = {};
    
    for(let el of form_rollo_agregar.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        }
    fecthNormalPOST_PUT("POST", "produccion/rollos", forData)
        .then( res => {
            
            if(res.ok){
                salio_todo_bien("Salio todo correcto");
                volverAtras(form_rollo, opciones);
            }else if (res.error == 10 || res.error == "10"){
                localStorage.removeItem("x-token");
                window.location.href = `${window.location.origin}/index.html`
            }else{
                algo_salio_mal(`Algo salio mal`)
            }
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })
    
})

const limpiar = (element) => {

    for(let el of element.elements){
        if(el.name.length > 0)
            el.value = "";    
        }
}
//calcular el el total por talle y talles

const total_por_talle = document.getElementById('total_por_talle');
const talles = document.getElementById('talles');
const total = document.getElementById('total');


talles.addEventListener('keyup', (e) => {
    
    let total_db = total_por_talle.value * talles.value;
    total.value = total_db;

});

total_por_talle.addEventListener('keyup', (e) => {

    let total_db = total_por_talle.value * talles.value;
    total.value = total_db;
})

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