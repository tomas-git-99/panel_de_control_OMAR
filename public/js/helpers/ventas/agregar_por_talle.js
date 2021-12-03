import { algo_salio_mal, salio_todo_bien } from "../para_todos/alertas.js";
import { fecthNormalPOST_PUT } from "./fetch.js";




export const agregarPorTalle = (id_producto, forData) =>{

    fecthNormalPOST_PUT("POST", `talle/${id_producto}`, forData)
        .then( (res) => {
            if(res.ok == true){
                return salio_todo_bien("Agregado con exito")
            }else if (res.ok == false){
    
                return algo_salio_mal("Algo salio mal, espero unos minutos o comunicarse con el administrador")
            }
        })
        .catch(err => {
            return algo_salio_mal("Algo salio mal, espero unos minutos o comunicarse con el administrador")

       
            }) 
    
 
}