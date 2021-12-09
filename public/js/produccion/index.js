import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js"


let table_produccion = document.querySelector('.table_produccion');


fecthNormalGET("GET", "produccion/producto_produccion")
    .then( res => {
        if(res.ok){
            colorearTable(res.produccion);
        }
    })

const colorearTable = (res) => {

    let resultado = ""

    res.map ( e => {
        if(e.taller == undefined){
            resultado += imprimirTable(e, "table-active")
        }else if(e.fecha_de_salida == undefined){
            resultado += imprimirTable(e, "table-danger")
        }else if(e.fecha_de_entrada == true){
            resultado += imprimirTable(e, "table-warning")
        }else if(e.estado == true){
            resultado += imprimirTable(e, "table-success")    
        }

        ///innerHTML a table
        table_produccion.innerHTML = resultado;
    })
}


const imprimirTable = (e, color) => {
    return `
    <tr class="${color}">
    <th scope="row">${e.id_corte}</th>
    <td>${e.nombre}</td>
    <td>${e.tela}</td>
    <td>${e.taller == undefined ? "-" : e.taller}</td>
    <td>${e.fecha_de_salida == undefined || e.fecha_de_salida == null ? "-" : e.fecha_de_salida}</td>
    <td>${e.fecha_de_entrada == undefined || e.fecha_de_entrada == null ? "-" : e.fecha_de_entrada}</td>
    <td>${e.estado == false? "NO PAGADO" : "PAGADO"}</td>
    <td>
    <div id="${e.id}" onclick="enviar_id(this.id)">
    hola 
    </div>
    </td>
  </tr>
    `
}
const opciones_cambio = document.querySelector(".opciones_cambio");
const seleccion_cambio = document.querySelector(".seleccion_cambio");


window.enviar_id = (id) => {
    console.log("HJOLA")
    seleccion_cambio.innerHTML = `
        <option selected>Seleccione que cambiar</option>
        <option id="${id}" value="id_corte">ID</option>
        <option id="${id}" value="nombre">Nombre</option>
        <option id="${id}" value="fecha_de_corte">Fecha de corte</option>
        <option id="${id}" value="edad">Edad</option>
        <option id="${id}" value="rollos">Rollos</option>
        <option id="${id}" value="total_por_talle">Total por talles</option>
        <option id="${id}" value="talles">Talles</option>
        <option id="${id}" value="total">Total</option>
        <option id="${id}" value="taller">Taller</option>
        <option id="${id}" value="fecha_de_salida">Fecha de salida</option>
        <option id="${id}" value="fecha_de_entrada">Fecha de entrada</option>
        <option id="${id}" value="estado">Pagado</option>
        
    `
}

const input_con_el_valor = document.querySelector(".input_con_el_valor");
const seleccion_cambio_taller = document.querySelector(".seleccion_cambio_taller");
const input_cambio = document.getElementById("input_cambio");
const aca_id_taller = document.getElementById("aca_id_taller");

window.selecciconCambios = (e) => {
    if(e.value === "taller"){
        input_con_el_valor.innerHTML = `
        <select class="custom-select" id="seleccion_cambio_taller" onchange="cambiar_taller(this)">
        <option selected>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
        </select>
        <button type="button" class="btn btn-outline-primary" id="aca_id_taller" onclick="enviar_taller_nuevo(this.id)">Cambiar</button>
        `
        return opcines_taller();
    }else{

        input_con_el_valor.innerHTML = `
        <div class="input-group mb-3">
      <input type="text" class="form-control" placeholder="Recipient's username" aria-describedby="basic-addon2" name="${e.value}" id="input_cambio">
      <div class="input-group-append">
        <button class="btn btn-outline-success" id="${e.id}" type="button" onclick="enviar_cambio(this.id)">Button</button>
      </div>
      </div>
    
        `
    }
}
window.cambiar_taller = (valor) => {
    aca_id_taller.id = valor.value;
}
window.enviar_taller_nuevo = () => {
    //fecthNormalPOST_PUT()
}
window.enviar_cambio = (id) => {
    
    fecthNormalPOST_PUT("PUT", `producto/${id}`,input_cambio.value)
        .then( res => {
            input_cambio = "";
        })
        .catch(err => {

        })
}

const imprimir_opciones = (res) => {

    let talleres = "";

    //seleccionDirec.innerHTML =` <option value="0">TALLER</option>`;

    res.map( e => {

        talleres = `
        <option value="${e.id}">${e.nombre_completo}</option>
        `
        seleccion_cambio_taller.innerHTML += talleres;
    });
}
 
const opcines_taller = () => {
    fecthNormalGET("GET","tallers")
        .then(res =>{
            imprimir_opciones(res.taller)
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })
}