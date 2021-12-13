import { fecthNormalGET } from "../ventas/fetch.js"
import { advertencia } from "./alertas.js"

const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : '';


export const verificarToken = (token) => {

    if(!token){
        window.location = "index.html"
    }

    return fetch(url + "usuario/token/verificar",{ 
        method: "GET",
        headers: {'Content-Type': 'application/json', 'x-token': token},
    })
    .then(response => response.json())
    .then(data => {
        if(data.ok == true){
            return data
        }else{
            return data.ok
        }
    })
    .catch(err => {
        return false;
    });
}

