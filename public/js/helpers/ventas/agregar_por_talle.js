import { advertencia, algo_salio_mal, salio_todo_bien } from "../para_todos/alertas.js";
import { fecthNormalPOST_PUT } from "./fetch.js";


// error 1: error graves de color rojo
// error 2: error de advertencia de color rojo
// error 3: errro comunes 

export const agregarPorTalle = (id_producto, forData) =>{

    fecthNormalPOST_PUT("POST", `talle/${id_producto}`, forData)
        .then( (res) => {
            if(res.ok == true){
                return salio_todo_bien("Agregado con exito")
            }else if (res.ok == false){

                if(res.error == 2){
                    return advertencia(res.msg);
                }
                return algo_salio_mal("Algo salio mal, espero unos minutos o comunicarse con el administrador")
            }
        })
        .catch(err => {
            return algo_salio_mal("Algo salio mal, espero unos minutos o comunicarse con el administrador")

       
            }) 
    
 
}