import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js"
import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";


let table_produccion = document.querySelector('.table_produccion');


fecthNormalGET("GET", "produccion/producto_produccion")
    .then( res => {
        if(res.ok){

            colorearTable(res.produccion);
        }
    })

const colorearTable = (res) => {

    let resultado = ""
    console.log(res)
    res.map ( e => {
        if(e.produccion.id_taller == undefined || e.produccion.id_taller == null){
            resultado += imprimirTable(e, "table-active")
        }else if(e.produccion.fecha_de_entrada == undefined || e.produccion.fecha_de_entrada == null){
            resultado += imprimirTable(e, "table-danger")
        }else if(e.produccion.estado == true){
            resultado += imprimirTable(e, "table-success")    
        }else{
            resultado += imprimirTable(e, "table-warning")    

        }

        ///innerHTML a table
        table_produccion.innerHTML = resultado;
    })
}


const imprimirTable = (e, color) => {
   
    return `
    <tr class="${color}">
    <th scope="row">${e.produccion.id_corte}</th>
    <td>${e.produccion.nombre}</td>
    <td>${e.produccion.tela}</td>
    <td>${e.produccion.id_taller == undefined || e.produccion.id_taller == null ? "-" : e.taller.nombre_completo}</td>
    <td>${e.produccion.fecha_de_salida == undefined || e.produccion.fecha_de_salida == null ? "-" : e.produccion.fecha_de_salida}</td>
    <td>${e.produccion.fecha_de_entrada == undefined || e.produccion.fecha_de_entrada == null ? "-" : e.produccion.fecha_de_entrada}</td>
    <td>${e.produccion.estado == false? "NO PAGADO" : "PAGADO"}</td>
    <td>
    <div id="${e.produccion.id}" onclick="enviar_id(this.id)" class="boton_seleccion">
    <img src="https://img.icons8.com/ios/50/000000/settings--v1.png" width="25px"/> 
    </div>
    </td>
    <td>
    <div id="${e.produccion.id}" onclick="previsualizar_id(this.id)" class="boton_seleccion">
    <img src="https://img.icons8.com/ios/50/000000/file-preview.png"width="25px"/>
    </div>
    </td>
  </tr>
    `
}

const opciones_cambio = document.querySelector(".opciones_cambio");
const seleccion_cambio = document.querySelector("#seleccion_cambio");


window.enviar_id = (id) => {
    opciones_cambio.style.opacity = 1;
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
const previsualizar = document.querySelector(".previsualizar");

window.previsualizar_id = (id) => {
    imprimir_previsualizar(id);
    previsualizar.style.opacity = 1;

}
const tabla_previsualizar = document.querySelector("#tabla_previsualizar");


const imprimir_previsualizar = (id) => {

    fecthNormalGET("GET",`produccion/producto_produccion/${id}`)
        .then( res => {
  
            imprimir_html_datos(res.producto)
        })
}

const imprimir_html_datos = (res) => {
    console.log(res)

    res.map ( e => {

        tabla_previsualizar.innerHTML = `
            <tr>
            <td><span>ID :${e.producto.id_corte}</span></td>
            <td><span>NOMBRE :</span></td>
            <td><span>FECHA DE CORTE :</span>@mdo</td>
            <td><span>EDAD :</span></td>
        </tr>
        <tr>
            <td><span>ROLLOS :</span>acob</td>
            <td><span>PESO PROMEDIO :</span>Thornton</td>
            <td><span>TOTAL POR TALLE :</span>@fat</td>
            <td><span>TALLES :</span>@fat</td>
        </tr>
        <tr>
        
            <td><span>TOTAL :</span>@fat</td>
          </tr>
        <tr>
            <td><span>TALLER :</span>@fat</td>
            <td><span>FECHA DE SALIDA :</span>@fat</td>
            <td><span>FECHA DE ENTRADA :</span>@fat</td>
            <td><span>PAGO :</span>@asjdljksahdlkjashljksa</td>
        
          </tr>
          <tr>
            <td><span>PAGO :</span>@fat</td>
          </tr>
        `
    })
}



const input_con_el_valor = document.querySelector(".input_con_el_valor");

window.selecciconCambios = (e) => {
    if(e.value === "taller"){
        input_con_el_valor.innerHTML = `
        <select class="custom-select" id="seleccion_cambio_taller" onchange="cambiar_taller(this)">

        </select>
        <div class="boton_para_cambiar">
        <button type="button" class="btn btn-outline-primary btn-sm" id="0" onclick="enviar_taller_nuevo(this.id)">Cambiar</button>
        </div>

        `
        return  opcines_taller(e[e.selectedIndex].id);
        
    }else if(e.value == "fecha_de_corte" || e.value == "fecha_de_salida" || e.value == "fecha_de_entrada"){
        input_con_el_valor.innerHTML = `
        <div class="input-group mb-3">
        <input type="date" class="form-control" aria-describedby="basic-addon2" name="${e.value}" id="input_cambio">
        <div class="input-group-append">
        <button class="btn btn-outline-primary " id="${e[e.selectedIndex].id}" type="button" onclick="enviar_cambio(this.id)">Button</button>
        </div>
        </div>
        
        `
    }else if (e.value == "estado") {
        input_con_el_valor.innerHTML = `
        <select class="custom-select" style="width:auto;" id="seleccion_cambio_taller" onchange="cambiar_pagar(this)">
        <option selected value="0">Eligir...</option>
        <option value="${false}" id="${e[e.selectedIndex].id}">NO PAGADO</option>
        <option value="${true}" id="${e[e.selectedIndex].id}">PAGADO</option>
        </select>

        `
    }else{

        input_con_el_valor.innerHTML = `
        <div class="input-group mb-3">
        <input type="text" class="form-control" aria-describedby="basic-addon2" name="${e.value}" id="input_cambio">
        <div class="input-group-append">
        <button class="btn btn-outline-primary " id="${e[e.selectedIndex].id}" type="button" onclick="enviar_cambio(this.id)">Button</button>
        </div>
        </div>
        
        `
    }
}

window.cambiar_pagar = (e) => {
    if(!0 || !"0"){
    fecthNormalPOST_PUT("PUT", `produccion/producto_produccion/${e[e.selectedIndex].id}`, {estado:e.value})
    .then( res => {
        salio_todo_bien("Todo salio exlente")
    })
    }
}

window.cambiar_taller = (e) => {
    const boton_para_cambiar = document.querySelector(".boton_para_cambiar");

    boton_para_cambiar.innerHTML =  ` 
    <button type="button" class="btn btn-outline-primary btn-sm" id="${e.value}_${e[e.selectedIndex].id}" onclick="enviar_taller_nuevo(this.id)">Cambiar</button>
    `
}
window.enviar_taller_nuevo = (id) => {

    const palabras = id.split('_');

    fecthNormalPOST_PUT("PUT", `produccion/producto_produccion/${palabras[1]}`, {id_taller:palabras[0]})
        .then( res => {
            salio_todo_bien("Todo salio exlente")
        })

}
window.enviar_cambio = (id) => {
    const input_cambio = document.getElementById("input_cambio");

    let dato = {
        name: input_cambio.value
    }

    dato[`${input_cambio.name}`] = dato.name;
    delete dato.name;

    fecthNormalPOST_PUT("PUT", `produccion/producto_produccion/${id}`, dato)
        .then( res => {
            salio_todo_bien("Todo salio exelente")
            input_cambio = "";
        })
        .catch(err => {

        })
}

const imprimir_opciones = (res , id) => {
const seleccion_cambio_taller = document.getElementById("seleccion_cambio_taller");


    let talleres = "";

    seleccion_cambio_taller.innerHTML =` <option selected value="0">Eligir...</option>`;
    res.map( e => {

        talleres = `
        <option value="${e.id}" id="${id}">${e.nombre_completo}</option>
        `
        seleccion_cambio_taller.innerHTML += talleres;
    });
}
 
const opcines_taller = (id) => {

    fecthNormalGET("GET","produccion/taller")
        .then(res =>{
            
            imprimir_opciones(res.taller, id)
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })
}

window.salir_cambios = () => {
    opciones_cambio.style.opacity = 0;

}