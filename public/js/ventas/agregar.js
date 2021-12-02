
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";
import { salio_todo_bien, algo_salio_mal } from "../helpers/para_todos/alertas.js";



const formProducto = document.querySelector(".formProducto");
const bienvenido = document.querySelector(".bienvenido");

const pregunta_ordenar_por_talle = document.querySelector(".pregunta_ordenar_por_talle");
const ordenar_por_talle = document.querySelector(".ordenar_por_talle");



window.entrar = () => {
    volverAtras(pregunta_ordenar_por_talle, ordenar_por_talle)
}
window.salir = () => {
    window.location = "/page/roles/admin/ventas/index.html"

}
/* window.agregar_db = () => {
    fe
} */
formProducto.addEventListener("submit", (e) => {
    e.preventDefault();

    const forData = {};
    
    for(let el of formProducto.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        } 


    console.log(forData)


    fecthNormalPOST_PUT("POST", "producto" ,forData)
        .then( (res) => {
            if(res.ok){
                localStorage.setItem("id_producto", res.producto.id);
                volverAtras(bienvenido, pregunta_ordenar_por_talle);
            }
        })
        .catch(err => {
            algo_salio_mal("Algo salio mal, espero unos minutos o comunicarse con el administrador")
            
        })

});



const formulario_por_talle = document.querySelector(".formulario");

const cantidad = document.getElementsByName("cantidad")[0].value;
const talle = document.querySelector(".talle")



/* window.enviar = () => {
    console.log(cantidad)
} */

formulario_por_talle.addEventListener("submit", (e) => {
    e.preventDefault();

    const id_producto = localStorage.getItem("id_producto");

    const forData = {};
    
    for(let el of formulario_por_talle.elements){
        if(el.name.length > 0){
            forData[el.name] = el.value;

        }
        
        
    } 
    console.log(forData)
        



    fecthNormalPOST_PUT("POST", `talle/${id_producto}`, forData)
        .then( (res) => {
            if(res.ok == true){
                salio_todo_bien("Agregado con exito")
            }else if (res.ok == false){
 
                algo_salio_mal("Algo salio mal, espero unos minutos o comunicarse con el administrador")
            }
        })
        .catch(err => {
            algo_salio_mal("Algo salio mal, espero unos minutos o comunicarse con el administrador")

       
            }) 

})



