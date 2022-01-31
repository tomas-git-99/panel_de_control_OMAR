import { fecthNormalGET } from "../ventas/fetch.js"
import { advertencia } from "./alertas.js"

const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : 'https://tiendamilena.com.ar/api/';


const url_local = window.location.origin;

export const verificarToken = (token) => {
    
    if(!token){
        window.location.href = `${url_local}/index.html`
    }

    return fetch(url + "usuario/token/verificar",{ 
        method: "GET",
        headers: {'Content-Type': 'application/json', 'x-token': token},
    })
    .then(response => response.json())
    .then(data => {
        if(data.ok == true){
            enviarLocal(data.usuario.rol);
            return data;
        }else{
            localStorage.removeItem("x-token");

            return window.location.href = `${url_local}/index.html`
        }
    })
    .catch(err => {
        return false;
    });
}


export const enviarLocal = (dato) => {

    const params = window.location.pathname;

    if(dato == "ADMIN"){

        if(params){

            return true;
        }
        /* return window.location = "/page/roles/admin/ventas/index.html"; */

    }else if(dato == "VENTAS"){

        if(params == "/page/roles/usuario_ventas/index.html"){

            return true;

        }
        
        return window.location = "/page/roles/usuario_ventas/index.html";

    }else if(dato == "PRODUCCION"){

        if(params == "/page/roles/usuario_produccion/index.html"){
            return true;
        }
        return window.location = "/page/roles/usuario_produccion/index.html";
    }
}