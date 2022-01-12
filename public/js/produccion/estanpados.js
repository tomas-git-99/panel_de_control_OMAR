import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { devolverString } from "../helpers/para_todos/null.js";
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";



const table_produccion = document.querySelector(".table_produccion_estanpado");





const main_historial = () => {

    fecthNormalGET("GET", "produccion/estanpado")
      .then( res => {
        imprimirHistorial(res.data)
      })
}

main_historial()





const imprimirHistorial = (data) => {
   
    let historial 
    data.map ( e => {

        historial = `
        <tr>
        <td data-label="ID">${devolverString(e.producto.id_corte)}</td>
        <td data-label="NOMBRE / MODELO">${devolverString(e.producto.nombre)}</td>
        <td data-label="DIBUJO">${devolverString(e.estanpado.dibujo)}</td>
        <td data-label="ESTANPADOR">${devolverString(e.estanpado.id_estanpador)}</td>
        <td data-label="FECHA DE ENTRADA">${devolverString(e.estanpado.fecha_de_entrada)}</td>
        <td data-label="PAGADO">${e.estanpado.pagado == false ? "NO PAGADO" : "PAGADO"}</td>

        <td data-label= "AJUSTES"> 
        <div id="${e.estanpado.id}" onclick="enviar_id(this.id)" class="boton_seleccion">
        <img src="https://img.icons8.com/ios/50/000000/settings--v1.png" width="25px"/> 
        </div>
        </td>
        <td data-label="PREVISUALIZAR">
        <div id="${e.estanpado.id}" onclick="previsualizar_id(this.id)" class="boton_seleccion">
        <img src="https://img.icons8.com/ios/50/000000/file-preview.png"width="25px"/>
        </div>
        </td>
      </tr>

        ` 
        table_produccion.innerHTML += historial;
    })

}


const opciones_cambio = document.querySelector(".opciones_cambio");
const seleccion_cambio = document.querySelector("#seleccion_cambio");


window.enviar_id = (id) => {

  opciones_cambio.style.display = "grid";
  opciones_cambio.style.visibility = "visible";


  seleccion_cambio.innerHTML = `
  <option selected>Seleccione que cambiar</option>

  <option id="${id}" value="nombre">NOMBRE / MODELO</option>
  <option id="${id}" value="dibujo">Dibujo</option>
  <option id="${id}" value="estanpador">Estanpador</option>
  <option id="${id}" value="fecha_de_entrada">Fecha de entrada</option>
  <option id="${id}" value="pagado">Pagar</option>

  
`
}

const input_con_el_valor = document.querySelector(".input_con_el_valor");


window.selecciconCambios = (e) => {


  if(e.value == "estanpador"){
    input_con_el_valor.innerHTML = `
    <select class="custom-select" id="seleccion_cambio_taller" onchange="cambiar_taller(this)">

    </select>
    <div class="boton_para_cambiar">
    <button type="button" class="btn btn-outline-primary btn-sm" id="0" onclick="enviar_taller_nuevo(this.id)">Cambiar</button>
    </div>

    `


    console.log(e[e.selectedIndex].id)
    return  opcines_taller(e[e.selectedIndex].id);
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


window.enviar_cambio = (id) => {
  let input_cambio = document.getElementById("input_cambio");

  let dato = {
      name: input_cambio.value
  }

  dato[`${input_cambio.name}`] = dato.name;
  delete dato.name;

  fecthNormalPOST_PUT("PUT", `produccion/estanpado/${id}`, dato)
  .then( res => {
      salio_todo_bien("Todo salio exlente")
  })
  .catch( err =>{
      algo_salio_mal(`Algo salio mal: ${ err }`)
  })


}



window.cambiar_taller = (e) => {
  const boton_para_cambiar = document.querySelector(".boton_para_cambiar");

  boton_para_cambiar.innerHTML =  ` 
  <button type="button" class="btn btn-outline-primary btn-sm" id="${e.value}_${e[e.selectedIndex].id}" onclick="enviar_taller_nuevo(this.id)">Cambiar</button>
  `
}

const imprimir_opciones = (res , id) => {

  const seleccion_cambio_taller = document.getElementById("seleccion_cambio_taller");
  
  
      let talleres = "";
  
      seleccion_cambio_taller.innerHTML =` <option selected value="0">Eligir...</option>`;
      res.map( e => {
  
          talleres = `
          <option value="${e.id}" id="${id}">${e.nombre}</option>
          `
          seleccion_cambio_taller.innerHTML += talleres;
      });
      
  }
  
   
  const opcines_taller = (id) => {
  
      fecthNormalGET("GET","produccion/estanpado/oficial")
          .then(res =>{
              
              imprimir_opciones(res.estanpador, id)
          })
          .catch (err => {
              algo_salio_mal(`Algo salio mal: ${ err.message }`)
          })
  }


  window.enviar_taller_nuevo = (id) => {

    console.log(id);
    const palabras = id.split('_');

    fecthNormalPOST_PUT("PUT", `produccion/estanpado/${palabras[1]}`, {id_estanpador:palabras[0]})
        .then( res => {
            salio_todo_bien("Todo salio exlente")
        })
        .catch( err =>{
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })

}