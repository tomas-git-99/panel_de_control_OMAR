import { fecthNormalGET, fecthNormalGET_QUERY, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js"
import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";

import { verificarToken } from "../helpers/para_todos/permisos.js";



let table_produccion = document.querySelector('.table_produccion');
const token = localStorage.getItem('x-token');
//verificarToken(token);

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
    <td data-label="ID">${e.produccion.id_corte}</td>
    <td data-label="NOMBRE">${e.produccion.nombre}</td>
    <td data-label="TELA">${e.produccion.tela}</td>
    <td data-label="PESO PROMEDIO">${e.produccion.peso_promedio} Kg</td>
    <td data-label="TALLER">${e.produccion.id_taller == undefined || e.produccion.id_taller == null ? "-" : e.taller.nombre_completo}</td>
    <td data-label="FECHA DE SALIDA">${e.produccion.fecha_de_salida == undefined || e.produccion.fecha_de_salida == null ? "-" : e.produccion.fecha_de_salida}</td>
    <td data-label="FECHA DE ENTRA">${e.produccion.fecha_de_entrada == undefined || e.produccion.fecha_de_entrada == null ? "-" : e.produccion.fecha_de_entrada}</td>
    <td data-label="ESTADO" style="font-size:12px">${e.produccion.estado == false? "NO PAGADO" : `PAGADO<br> <span style=font-size:9px>${e.produccion.fecha_de_pago}</span>` } </td>
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
    opciones_cambio.style.display = "grid";
    opciones_cambio.style.visibility = "visible";
    seleccion_cambio.innerHTML = `
        <option selected>Seleccione que cambiar</option>
        <option id="${id}" value="id_corte">ID</option>
        <option id="${id}" value="nombre">Nombre</option>
        <option id="${id}" value="fecha_de_corte">Fecha de corte</option>
        <option id="${id}" value="edad">Edad</option>
        <option id="${id}" value="rollos">Rollos</option>
        <option id="${id}" value="tela">Tela</option>
        <option id="${id}" value="total_por_talle">Total por talles</option>
        <option id="${id}" value="talles">Talles</option>
        <option id="${id}" value="taller">Taller</option>
        <option id="${id}" value="fecha_de_salida">Fecha de salida</option>
        <option id="${id}" value="fecha_de_entrada">Fecha de entrada</option>
        <option id="${id}" value="estado">Pagado</option>
        
    `
}
const previsualizar = document.querySelector(".previsualizar");

window.previsualizar_id = (id) => {
    previsualizar.style.display = "grid";
    previsualizar.style.visibility = "visible";
    imprimir_previsualizar(id);



}
const tabla_previsualizar = document.querySelector("#tabla_previsualizar");


const imprimir_previsualizar = (id) => {

    fecthNormalGET("GET",`produccion/producto_produccion/${id}`)
        .then( res => {
            imprimir_html_datos(res.producto)
        })
        .catch( err => {
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
}

const imprimir_html_datos = (res) => {
    console.log(res)
    res.map ( e => {

        tabla_previsualizar.innerHTML = `
            <tr>
            <td><span>ID : </span>${e.producto.id_corte}</td>
            <td><span>NOMBRE : </span>${e.producto.nombre}</td>
            <td><span>FECHA DE CORTE : </span>${e.producto.fecha_de_corte == null || e.producto.fecha_de_corte == undefined ? "- -" : e.producto.fecha_de_corte}</td>
            <td><span>EDAD : </span>${e.producto.edad}</td>
        </tr>
        <tr>
            <td><span>ROLLOS : </span>${e.producto.rollos}</td>
            <td><span>PESO PROMEDIO : </span>${e.producto.peso_promedio}</td>
            <td><span>TOTAL POR TALLE : </span>${e.producto.total_por_talle}</td>
            <td><span>TALLES : </span>${e.producto.talles}</td>
        </tr>
        <tr>
        
            <td><span>TOTAL : </span>${e.producto.total}</td>
          </tr>
        <tr>
            <td><span>TALLER : </span>${e.taller == null || e.taller == undefined ? "- -" : e.taller.nombre_completo}</td>
            <td><span>FECHA DE SALIDA : </span>${e.producto.fecha_de_salida == null || e.producto.fecha_de_salida == undefined ? "- -" : e.producto.fecha_de_salida}</td>
            <td><span>FECHA DE ENTRADA : </span>${e.producto.fecha_de_entrada == null || e.producto.fecha_de_entrada == undefined ? "- -" : e.producto.fecha_de_entrada}</td>
            <td><span>PAGO : </span>${e.producto.estado == false ? "NO PAGADO" : "PAGADO"} </td>
        
          </tr>

        `
    })
}

window.img_salir_previsualizar = () => {

    previsualizar.style.display = "none";
    previsualizar.style.visibility = "hidden";
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
        <button class="btn btn-outline-primary pagar_taller" id="estado" type="button" onclick="fecha_De_pago(this.id)">Cambiar</button>
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


let id_para_pagar
window.cambiar_pagar = (e) => {
    let estado = document.querySelector(".pagar_taller");
    
    estado.id = e.value;
    
    id_para_pagar = e[e.selectedIndex].id;

}

window.fecha_De_pago = (e) => {
 
    let date = new Date()
    let day = `${(date.getDate())}`.padStart(2,'0');
    let month = `${(date.getMonth()+1)}`.padStart(2,'0');
    let year = date.getFullYear();
    let todayDate = `${year}-${month}-${day}`;

    if(e == true || e == "true") {
        fecthNormalPOST_PUT("PUT", `produccion/producto_produccion/${id_para_pagar}`, {estado:true, fecha_de_pago:todayDate})
        .then( (res) => {
            salio_todo_bien("Todo salio exelente")
        })
        .catch( err => {
            algo_salio_mal(`Algo salio mal: ${ err}`)
        })
        
    }else if ( e == false || e == "false"){

        fecthNormalPOST_PUT("PUT", `produccion/producto_produccion/${id_para_pagar}`, {estado:false})
        .then( (res) => {
            salio_todo_bien("Todo salio exelente")
        })
        .catch( err => {
            algo_salio_mal(`Algo salio mal: ${ err}`)
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
    opciones_cambio.style.display = "none";
    opciones_cambio.style.visibility = "hidden";
}




//buscador


window.ordenar = (e) => {
    const opciones_input = document.querySelector(".opciones_input");

    if(e.value === "0" || e.value == 0){

        fecthNormalGET("GET", "produccion/producto_produccion")
        .then( res => {
            if(res.ok){
                colorearTable(res.produccion);
            }
        })
    
    }else if( "fecha_de_entrada" == e.value || "fecha_de_salida" == e.value || "fecha_de_pago" == e.value){
        
        opciones_input.innerHTML = `
        <div class="p">
        <select class="custom-select" id="${e.value}" onchange="cambiar_filtro(this)">
            <option selected>Filtrar ...</option>
            <option value="1">Rango de fecha</option>
            <option value="2">Fecha exacta</option>
          </select>
           </div>
           <div class="input_fecha">
    
       </div>
    
        `
    }else if ( e[e.selectedIndex].id == "taller" || e[e.selectedIndex].id == "fecha_de_entrada" || e[e.selectedIndex].id == "fecha_de_pago"){

        fecthNormalGET("GET", `produccion/producto_produccion/busqueda/unicos/completo/p/${e[e.selectedIndex].id }`)
            .then( res =>{
                console.log(res)
                colorearTable(res.produccion)
            })
            .catch( err =>{
                algo_salio_mal(`Algo salio mal: ${ err }`)
            })
    
    
    }

}

window.cambiar_filtro = (e) => {

    const input_fecha = document.querySelector(".input_fecha")
    if(e.value == 1){
        input_fecha.innerHTML = `
        <input type="date" id="startDate">
        <input type="date" id="endDate">
        <button id="${e.id}" class="btn btn-primary btn-sm" onclick="rango_buscar(this.id)">Buscar</button>
        `

    }else if(e.value == 2){
        input_fecha.innerHTML = `
        <input type="date" id="fecha_exacta">
        <button id="${e.id}" class="btn btn-primary btn-sm" onclick="exacto_buscar(this.id)">Buscar</button>
        `
    }
}


window.rango_buscar = (id) =>{
    const startDate = document.getElementById("startDate");
    const endDate = document.getElementById("endDate");

    let dato ={fecha:[startDate.value, endDate.value]}

   
    fecthNormalPOST_PUT("POST", `produccion/producto_produccion/busqueda/todos/${id}`, dato)
        .then( res =>{
            if(res.ok){
                colorearTable(res.produccion)
            }else{
                algo_salio_mal(`Algo salio mal`)
            }
        })
        .catch( err =>{
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
    

}

window.exacto_buscar = (id) => {

    const fecha_exacta = document.getElementById("fecha_exacta");
    const dato = {
        fecha:fecha_exacta.value
    }

    fecthNormalPOST_PUT("POST", `produccion/producto_produccion/busqueda/unico/dato/${id}`, dato)
        .then( res =>{
            console.log(res)
            colorearTable(res.produccion)
        })
        .catch( err =>{
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
    
    

}