
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { salio_todo_bien, algo_salio_mal, advertencia } from "../helpers/para_todos/alertas.js";
import { agregarPorTalle } from "../helpers/ventas/agregar_por_talle.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { load_normal } from "../helpers/para_todos/carga_de_botones.js";



const formProducto = document.querySelector(".formProducto");
const bienvenido = document.querySelector(".bienvenido");

const pregunta_ordenar_por_talle = document.querySelector(".pregunta_ordenar_por_talle");
const ordenar_por_talle = document.querySelector(".ordenar_por_talle");
const aca_viene_id_producto = document.getElementById("aca_viene_id_producto")
const botonSI = document.getElementById("botonSI");



window.entrar = (id) => {
    aca_viene_id_producto.id = id;
    volverAtras(pregunta_ordenar_por_talle, ordenar_por_talle);
}
window.salir = () => {
    
    window.location = "index.html";

}


const boton_guardar = document.querySelector(".boton_guardar")
formProducto.addEventListener("submit", (e) => {
    e.preventDefault();
    load_normal(boton_guardar, true)

    const forData = {};
    
    for(let el of formProducto.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        } 



    fecthNormalPOST_PUT("POST", "producto" ,forData)
        .then( (res) => {
            if(res.ok == true) {
                botonSI.id = res.producto.id;

                load_normal(boton_guardar, false, "GUARDAR")
                volverAtras(bienvenido, pregunta_ordenar_por_talle);
            }else if (res.error == 10 || res.error == "10"){
                localStorage.removeItem("x-token");
                window.location.href = `${window.location.origin}/index.html`
            }else{
                load_normal(boton_guardar, false, "GUARDAR")
                  

                advertencia(res.msg || res.errors[0].msg || res.errors[1].msg || res.errors[2].msg);

            }
        })
        .catch(err => {
            load_normal(boton_guardar, false, "GUARDAR")


            algo_salio_mal("Algo salio mal, espero unos minutos o comunicarse con el administrador")
            
        })

});



const formulario_por_talle = document.querySelector(".formulario");

const cantidad = document.getElementsByName("cantidad")[0].value;
const talle = document.querySelector(".talle")




formulario_por_talle.addEventListener("submit", (e) => {
    e.preventDefault();
    
    
    const forData = {};
    
    for(let el of formulario_por_talle.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;
        
    } 

   agregarPorTalle(aca_viene_id_producto.id, forData, "aca_viene_id_producto");
   setTimeout(() => {
       
       for(let el of formulario_por_talle.elements){
           el.value = "";
       }
   }, 1000);

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