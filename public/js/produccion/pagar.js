import { advertencia } from "../helpers/para_todos/alertas.js";
import { devolverString } from "../helpers/para_todos/null.js";
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { volverAtras } from "../helpers/ventas/volver_atras.js";


const table_Data = document.querySelector(".table_Data");


const cambiar_taller = document.getElementById("cambiar_taller");

const opcines_taller = () => {
    fecthNormalGET("GET","produccion/taller")
        .then(res =>{
            imprimir_opciones(res.taller)
        })
        .catch (err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })
}
opcines_taller();

const imprimir_opciones = (res) => {
    let talleres = "";

    cambiar_taller.innerHTML =` <option value="0">TALLERES...</option>`;

    res.map( e => {

        talleres = `
        <option value="${e.id}">${e.nombre_completo}</option>
        `
        cambiar_taller.innerHTML += talleres;
    });
}
let id_taller = 0;

window.selecciconCambios = (e) => {
    id_taller = e.value;
}

const cargar_datos_productos = (res) => {

    let historial = ""
    
    
    res.map( e => {
        historial += `
        <tr>
                
        <td>${devolverString(e.id_corte)}</td>
        <td>${devolverString(e.nombre)}</td>
        <td>${devolverString(e.fecha_de_entrada)}</td>
        <td>
            <div class="cantidad_entregada">
                <input type="text" class="form-control form-control-sm" id="cantidad_entregada_${e.id}" disabled value="${e.cantidad_entregada}" style="width:80px">
            </div>

        </td>
        <td>
            <div class="cantidad_entregada">
            <input type="text" class="form-control form-control-sm" id="cantidad_pagada_${e.id}" disabled value="" style="width:80px"><span>$</span>
              
            </div>
        </td>
        <td>
            <div class="cantidad_entregada">
                <input type="text" class="form-control form-control-sm" id="suma_total_${e.id}" disabled value="" style="width:80px"><span>$</span>
     
            </div>
        </td>
        <td>
            <div class="cambiar_pago">

                <input type="number" id="valor_input_${e.id}" class="form-control" style="width:80px">
                <button type="button" class="btn btn-primary" id="${e.id}" onclick="calcular(this.id)">OK</button>
            </div>

        </td>
      </tr>
        `
    })

    table_Data.innerHTML = historial;
}

const data_pago = document.querySelector(".data_pago")
const formPago = document.querySelector(".formPago")
const formPagoGet = document.querySelector(".formPagoGet")


window.salir = () => {
    volverAtras(data_pago, formPago);
    const suma_total_final = document.querySelector(".suma_total_final");
    suma_total_final.id = "0"
    suma_total_final.value = "0"
}


formPagoGet.addEventListener( "submit", (e) => {
    e.preventDefault();

    const forData = {"fecha_de_entrada":[]};
    
    for(let el of formPagoGet.elements){
        if(el.name.length > 0){
            if(!el.value == "" || el.value == null){

               
                forData.fecha_de_entrada = [...forData.fecha_de_entrada, el.value]
                
 
            } 

        }
        } 

    if(id_taller == 0 || id_taller == "0"){
       
        advertencia("Elija un taller para continuar...")
    }else if(forData.fecha_de_entrada.length < 2){
        advertencia("Complete bien las fechas...")
    }else{

        fecthNormalPOST_PUT("POST", `produccion/hisorial/pagar/${id_taller}`,forData)
        .then( res => {
            cargar_datos_productos(res.productos);
            volverAtras(formPago, data_pago)
        })
    }

})


let ids_cambiados = [];

window.calcular = (e) => {
    const suma_total_final = document.querySelector(".suma_total_final");

    const valor_input = document.getElementById(`valor_input_${e}`)

    const cantidad_entregada = document.getElementById(`cantidad_entregada_${e}`);
    const cantidad_pagada = document.getElementById(`cantidad_pagada_${e}`);

    const suma_total = document.getElementById(`suma_total_${e}`);


    if(valor_input.value == ""){

        return advertencia("Se olvido colocar un numero para continuar")
    }
    const valorInput = parseInt(valor_input.value);

    const cantidadEntregada = parseInt(cantidad_entregada.value);

    const sumaTotal = parseInt(suma_total.value);

    let sumaTotalFinal = parseInt(suma_total_final.id);

    let nuevoValor = cantidadEntregada * valorInput;
 
    
    ids_cambiados.map( i=> {
        if(i == e){ 
            let descontar = sumaTotal;      

            
            descontar = sumaTotalFinal - descontar;
            
            sumaTotalFinal = descontar;
            
            descontar = 0;
        }
    })
    
    if(ids_cambiados.length > 0){

       let valor = ids_cambiados.some( h => h == e);

       if(valor == false){
        ids_cambiados.push(e)
       }

    }else{
 
        ids_cambiados.push(e)
    }
    
    
 

    

    suma_total.value = `${nuevoValor}`;
    cantidad_pagada.value = `${valorInput}`;

    
    ////FINAL
    
  
    let nuevaTotal = 0;

    nuevaTotal += sumaTotalFinal + nuevoValor;

    let nuevaTotal_moneda = new Intl.NumberFormat('es-AR', { currency: 'ARS' }).format(nuevaTotal);

    suma_total_final.id = nuevaTotal;
    suma_total_final.value = `${nuevaTotal_moneda}$`;


    valor_input.value = "";


}