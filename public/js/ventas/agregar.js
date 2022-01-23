
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { salio_todo_bien, algo_salio_mal, advertencia } from "../helpers/para_todos/alertas.js";
import { agregarPorTalle } from "../helpers/ventas/agregar_por_talle.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { load_normal } from "../helpers/para_todos/carga_de_botones.js";
import { usuarioPermisos } from "../helpers/para_todos/usuarios_permisos.js";


const rol = localStorage.getItem('roles');
usuarioPermisos( rol, "produccion");
let cantidadComprobante = null;

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
            forData[el.name] = el.value.replace(/\s*$/,"");    
        } 



    if( cantidadComprobante == null){
        return advertencia("Eliga una opcion en el apartado de 'Cantidad', para poder continuar")
    }

     fecthNormalPOST_PUT("POST", "producto" ,forData)
         .then( (res) => {
             if(res.ok == true) {
                 botonSI.id = res.producto.id;

                 load_normal(boton_guardar, false, "GUARDAR")

                 if( cantidadComprobante == true ){

                     volverAtras(bienvenido, pregunta_ordenar_por_talle);
                 }
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

window.cambiarCantidad = (e) => {
    const cantidad = document.querySelector(".cantidad");

    if(e.value == 1 || e.value == "1"){
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: "En la siguente ventana podra agregar la cantidad con su talle correspondiente",
            showConfirmButton: true,
            // timer: 2500
          });

          cantidadComprobante = true;

    }else if(e.value == "0" || e.value == 0){
        cantidadComprobante = null;
    }else{
        cantidadComprobante = false;
        cantidad.innerHTML = ` 
        <img src="/img/flecha.svg" alt="" onclick="volverAtras_cantidad()" srcset="" style="border: 1px solid; border-radius: 50%;  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; cursor: pointer; ">
        <span>Cantida</span>
        <input type="text"class="form-control" name="cantidad">`
    }
}

window.volverAtras_cantidad = () => {
    const cantidad = document.querySelector(".cantidad");

    cantidad.innerHTML = ` <span>Cantidad</span>
    <div class="opcionesDeTalles">
        <select class="form-control form-control-sm" id="seleccion_talles" onchange="cambiarCantidad(this)">
            <option value="0">¿Colocar total o por talle?</option>
            <option value="1">Talle</option>
            <option value="2">Total</option>
            
          </select>` 
;
}