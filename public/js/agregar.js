import { advertencia, algo_salio_mal} from "./helpers/para_todos/alertas.js";
import { verificarToken } from "./helpers/para_todos/permisos.js";
import { fecthNormalPOST_PUT } from "./helpers/ventas/fetch.js";
import { cerrar_login } from "./helpers/para_todos/cerrar.js";

const form = document.querySelector("form");
let value_rol;
let online_local_usuario;
let token = localStorage.getItem('x-token');
verificarToken(token);


const local = document.querySelector(".local");
const local_value = document.getElementById("local_value");


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

    if(value_rol == "VENTAS"){
        
        if(online_local_usuario == 0 || online_local_usuario == "0" || online_local_usuario == null || online_local_usuario == undefined){
    
            return algo_salio_mal("Porfavor eliga si esta cuenta se va usar para ventas online o por local")

        }else if(online_local_usuario == "LOCAL"){
            if(local_value.value == ""){

                return algo_salio_mal("Porfavor eliga el local que va ser usado esta cuenta")
            }

        }
    }


    forData["rol"] = value_rol;
    forData["venta"] = online_local_usuario;
    forData["local"] = local_value.value;

   


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
            console.log(err)
             algo_salio_mal(`Algo salio mal: ${ err }`);
 
         })


         /* console.log(forData) */
 
 }) 

 
 const online_o_local = document.querySelector(".online_o_local");
 
 
 window.rol = (e) => {
    value_rol = e.value;
    if(e.value == "VENTAS"){
        online_o_local.style.display = "grid";
        online_o_local.style.visibility = "visible";


    }else{
        online_local_usuario = "";
        online_o_local.style.display = "none";
        online_o_local.style.visibility = "hidden";

    }
}
window.online_local = (e) => {
    online_local_usuario = e.value

    if( e.value == "ONLINE"){
        local.style.display = "none";
        local.style.visibility = "hidden";
        local_value.value = "";

    }else{
        local.style.display = "grid";
        local.style.visibility = "visible";
    }
}
window.cerrar_seccion = () => {
    cerrar_login();
}



