import { advertencia, salio_todo_bien } from "../helpers/para_todos/alertas.js";
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
                
        <td data-label="CODIGO">${devolverString(e.id_corte)}</td>
        <td data-label="MODELO">${devolverString(e.nombre)}</td>
        <td data-label="FECHA DE ENTREGA">${devolverString(e.fecha_de_entrada)}</td>
        <td data-label="CANTIDAD ENTRGADA">
            <div class="cantidad_entregada">
                <input type="text" class="form-control form-control-sm" id="cantidad_entregada_${e.id}" disabled value="${e.cantidad_entregada}" style="width:80px">
            </div>

        </td>
        <td data-label="PAGO">
            <div class="cantidad_entregada">
            <input type="text" class="form-control form-control-sm" id="cantidad_pagada_${e.id}" disabled value="" style="width:80px"><span>$</span>
              
            </div>
        </td>
        <td data-label="TOTAL">
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


let historialBusqueda = {}

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

            historialBusqueda = forData;
            cargar_datos_productos(res.productos);
            volverAtras(formPago, data_pago);
        })
        .catch(error => {
            algo_salio_mal(`Algo salio mal: ${ error }`)
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




export const funcionParaImprimir = ( elemento) => {

    const elementoAimprimir =  document.querySelector(`.${elemento}`);


    html2pdf()
        .set({
        margin: 1,
        filename: `ticket.pdf`,
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 3, // A mayor escala, mejores gráficos, pero más peso
            letterRendering: true,
            useCORS: true
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: 'portrait' // landscape o portrait
        }
    })
      .from(elementoAimprimir)
      .save()
      .catch( err => { console.log(err)})

}


window.imprimir = () => {



    funcionParaImprimir("tabla_de_pagos");

}




window.pagar_estado = () => {

    const suma_total_final = document.querySelector(".suma_total_final");
    let date = new Date()
    let day = `${(date.getDate())}`.padStart(2,'0');
    let month = `${(date.getMonth()+1)}`.padStart(2,'0');
    let year = date.getFullYear();
    let todayDate = `${year}-${month}-${day}`;

    historialBusqueda["fecha_de_pago"] = todayDate

    fecthNormalPOST_PUT("POST", `produccion/hisorial/pagar/estado/${id_taller}`, historialBusqueda)
             .then( res => {
                volverAtras(data_pago, formPago);
                suma_total_final.id = "0"
                suma_total_final.value = "0"
                salio_todo_bien("El pago se logro con exito");
             })
             .catch(  err => {
                 alert("Error: " + err)
             })

}