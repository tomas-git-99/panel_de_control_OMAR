import { advertencia, algo_salio_mal} from "./helpers/para_todos/alertas.js";
import { fecthNormalPOST_PUT } from "./helpers/ventas/fetch.js";

const form = document.querySelector("form");
let value_rol;

form.addEventListener('submit', (e) => {

    e.preventDefault();
 
    const forData = {};
 
    for(let el of form.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        } 


    if(value_rol == 0 || value_rol == "0" || value_rol == null){
        return algo_salio_mal("Eliga un rol para continuar")
    }

    forData["rol"] = value_rol;
    console.log(forData);
    fecthNormalPOST_PUT("POST", "usuario", forData)
         .then((res) => {
             if(res.ok == true){
                Swal.fire({
                    icon: 'success',
                    title: 'Creado con exito',
                    text: `Nuevo usuario. Nombre: ${res.usuario.nombre}, DNI O CUIL: ${res.usuario.dni_cuil}`,
                  })

                  for(let el of form.elements){
                    if(el.name.length > 0)
                        el.value = "";
                    } 
             }else{

                 advertencia(res.msg || res.errors[0].msg || res.errors[1].msg || res.errors[2].msg);
             }
         })
         .catch((err) => {
             algo_salio_mal(`Algo salio mal: ${ err }`);
 
         })
 
 }) 

window.rol = (e) => {
    value_rol = e.value;
}