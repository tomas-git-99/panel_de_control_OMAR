import { fecthNormalGET, fecthNormalPOST_PUT } from "./helpers/ventas/fetch.js";
import { advertencia, algo_salio_mal} from "./helpers/para_todos/alertas.js";
import { verificarToken } from "./helpers/para_todos/permisos.js";
const form = document.querySelector("form");





//FALTA CONFIGURAR LAS RUTAS PARA DIFERENTES ROLES
export const PERMISOS = {
    "ADMIN": () =>  window.location = "inicio.html",
    "VENTAS": () =>  window.location = "/page/roles/usuario_ventas/index.html",
    "PRODUCCION": () =>  window.location = "/page/roles/usuario_produccion/index.html"
}

verificarToken("holaperrin")
.then(res =>{
    console.log(res)
})

form.addEventListener('submit', (e) => {

   e.preventDefault();

   const forData = {};

   for(let el of form.elements){
       if(el.name.length > 0)
           forData[el.name] = el.value;    
       } 
        

    fecthNormalPOST_PUT("POST", "usuario/login", forData)
        .then((res) => {
            if(!res.ok){
                advertencia(res.msg);
            }else{
                const permiso = PERMISOS[res.usuario.rol]
                    ? PERMISOS[res.usuario.rol]()
                    : advertencia("Este usuario no tiene ROL especifico")
            }
        })
        .catch((err) => {
            algo_salio_mal(`Algo salio mal: ${ err }`);

        })

}) 


