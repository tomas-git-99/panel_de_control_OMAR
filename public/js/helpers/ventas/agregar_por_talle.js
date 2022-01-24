import { advertencia, algo_salio_mal, salio_todo_bien } from "../para_todos/alertas.js";
import { fecthNormalPOST_PUT } from "./fetch.js";


// error 1: error graves de color rojo
// error 2: error de advertencia de color rojo
// error 3: errro comunes 

export const agregarPorTalle = (id_producto, forData, carga) =>{

    if(forData.talle == 0 || forData.talle == "" || forData.cantidad == 0 || forData.cantidad == ""){
        return advertencia("No puede enviar campos vacios")
    }
    
    document.querySelector(`.${carga}`).innerHTML = `
    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only">Loading...</span>
    `
    fecthNormalPOST_PUT("POST", `talle/${id_producto}`, forData)
        .then( (res) => {
            if(res.ok == true){

                document.querySelector(`.${carga}`).innerHTML = "Agregar"

                return salio_todo_bien("Agregado con exito")

            }else if (res.ok == false){

                if(res.error == 2){
                    document.querySelector(`.${carga}`).innerHTML = "Agregar"
                    return advertencia(res.msg);
                }else{

                    document.querySelector(`.${carga}`).innerHTML = "Agregar"
                    return algo_salio_mal(res.msg);
                }
            
            }
        })
        .catch(err => {
            console.log(err)
            document.querySelector(`.${carga}`).innerHTML = "Agregar"

             algo_salio_mal("Algo salio mal, espero unos minutos o comunicarse con el administrador")

        }) 
    
 
}