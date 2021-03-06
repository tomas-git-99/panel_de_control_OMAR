import { fecthNormalGET, fecthNormalPOST_PUT } from "./helpers/ventas/fetch.js";
import { advertencia, algo_salio_mal} from "./helpers/para_todos/alertas.js";
import { verificarToken } from "./helpers/para_todos/permisos.js";
const form = document.querySelector("form");




//const verificar_Token = () => {
//
//const token = localStorage.getItem('x-token');
//
//    if(token){
//        return window.location = "/page/roles/admin/ventas/index.html";
//    }
//}
//
//verificar_Token();

//FALTA CONFIGURAR LAS RUTAS PARA DIFERENTES ROLES
export const PERMISOS = {
    "ADMIN": () =>  window.location = "/page/roles/admin/ventas/index.html",
    "VENTAS": () =>  window.location = "/page/roles/admin/ventas/index.html",
    "PRODUCCION": () =>  window.location = "/page/roles/admin/produccion/index.html"
}



form.addEventListener('submit', (e) => {

   e.preventDefault();

   const forData = {};

   for(let el of form.elements){
       if(el.name.length > 0)
           forData[el.name] = el.value;    
       } 
        

    fecthNormalPOST_PUT("POST", "usuario/login", forData)
        .then((res) => {

            
            if(res.ok == true){
            localStorage.setItem("x-token", res.token)
            localStorage.setItem("id", res.usuario[0].id)
            localStorage.setItem("nombre", res.usuario[0].nombre);
            localStorage.setItem("roles", res.usuario[0].rol);
            localStorage.setItem("local", res.usuario[0].local);
            
            PERMISOS[res.usuario[0].rol]
                ? PERMISOS[res.usuario[0].rol]()
                : advertencia("Este usuario no tiene ROL especifico")
            }else{
                
                advertencia(res.msg);
            }
        })
        .catch((err) => {
            algo_salio_mal(`Algo salio mal: ${ err }`);

        })

}) 

