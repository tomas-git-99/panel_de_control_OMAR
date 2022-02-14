import { algo_salio_mal, salio_todo_bien } from "../helpers/para_todos/alertas.js";
import { cerrar_login } from "../helpers/para_todos/cerrar.js";
import { devolverString } from "../helpers/para_todos/null.js";
import { usuarioPermisos } from "../helpers/para_todos/usuarios_permisos.js";
import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";

const rol = localStorage.getItem('roles');
usuarioPermisos( rol, "ventas");

const table_produccion = document.querySelector(".table_produccion_estanpado");





const main_historial = () => {

    fecthNormalGET("GET", "produccion/estanpado")
      .then( res => {
        console.log(res)

        colorearTable(res.data)
      })
      .catch (err => {
        algo_salio_mal(`Algo salio mal: ${ err}`)
      })

}

main_historial()

const fechaARG = (data) => {
  console.log(data)

  if(data == "- -" ){
      return "- -"
  }else{
      let fecha = new Date(data);

      return fecha.getDate() + "/" + (fecha.getMonth() +1) + "/" + fecha.getFullYear();
  }


}




const imprimirHistorial = (e, color) => {

   
  /*   let historial = ""
    data.map ( e => {

        historial +=  */
        return `
        <tr class="${color}">
        <td data-label="CODIGO">${devolverString(e.estanpado.id_corte)}</td>
        <td data-label="NOMBRE / MODELO">${devolverString(e.producto.nombre)}</td>
        <td data-label="DIBUJO">${devolverString(e.estanpado.dibujo)}</td>
        <td data-label="ESTAMPADOR">${devolverString(e.estanpador.nombre)}</td>
        <td data-label="FECHA DE ENTRADA">${fechaARG(devolverString(e.estanpado.fecha_de_entrada))}</td>
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
   /*    })
      table_produccion.innerHTML = historial; */


}



const colorearTable = (res) => {

  let resultado = ""
  
  res.map ( e => {
      if(e.estanpado.id_estanpador == undefined || e.estanpado.id_estanpador == null){

          resultado += imprimirHistorial(e, "table-active")

      }else if(e.estanpado.fecha_de_entrada == undefined || e.estanpado.fecha_de_entrada == null){

          resultado += imprimirHistorial(e, "table-danger")

      }else if(e.estanpado.pagado == true){

          resultado += imprimirHistorial(e, "table-success")    

      }else{
          resultado += imprimirHistorial(e, "table-warning")    

      }

      ///innerHTML a table
      table_produccion.innerHTML = resultado;
  })
}



// LO SACAQUE PORQUE NO ERA NESECARIO POR EL TEMA DE YA TODOS LOS DATOS SE MUESTRAN EN PANTALLA


const opciones_cambio = document.querySelector(".opciones_cambio");
const seleccion_cambio = document.querySelector("#seleccion_cambio");


window.enviar_id = (id) => {

  opciones_cambio.style.display = "grid";
  opciones_cambio.style.visibility = "visible";


  seleccion_cambio.innerHTML = `
  <option selected>Seleccione que cambiar</option>

  <option id="${id}" value="nombre">NOMBRE / MODELO</option>
  <option id="${id}" value="dibujo">Dibujo</option>
  <option id="${id}" value="estanpador">Estampador</option>
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


    
    return  opcines_taller(e[e.selectedIndex].id);
  }else if (e.value == "pagado"){

    input_con_el_valor.innerHTML = `
    <select class="custom-select" style="width:auto;" id="seleccion_cambio_taller" onchange="cambiar_pagar(this)">
    <option selected value="0">Eligir...</option>
    <option value="${false}" id="${e[e.selectedIndex].id}">NO PAGADO</option>
    <option value="${true}" id="${e[e.selectedIndex].id}">PAGADO</option>
    </select>
    <button class="btn btn-outline-primary pagar_taller" id="estado" type="button" onclick="fecha_De_pago(this.id)">Cambiar</button>
    `

  }else if (e.value == "fecha_de_entrada"){
    input_con_el_valor.innerHTML = `
    <div class="input-group mb-3">
    <input type="date" class="form-control" aria-describedby="basic-addon2" name="${e.value}" id="input_cambio">
    <div class="input-group-append">
    <button class="btn btn-outline-primary " id="${e[e.selectedIndex].id}" type="button" onclick="enviar_cambio(this.id)">Cambiar</button>
    </div>
    </div>
    
    `
  }else{
    input_con_el_valor.innerHTML = `
    <div class="input-group mb-3">
    <input type="text" class="form-control" aria-describedby="basic-addon2" name="${e.value}" id="input_cambio">
    <div class="input-group-append">
    <button class="btn btn-outline-primary " id="${e[e.selectedIndex].id}" type="button" onclick="enviar_cambio(this.id)">Cambiar</button>
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
              algo_salio_mal(`Algo salio mal: ${ err }`)
          })
  }


  window.enviar_taller_nuevo = (id) => {

    
    const palabras = id.split('_');

    fecthNormalPOST_PUT("PUT", `produccion/estanpado/${palabras[1]}`, {id_estanpador:palabras[0]})
        .then( res => {
            salio_todo_bien("Todo salio exlente")
        })
        .catch( err =>{
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })

}


let id_para_pagar
window.cambiar_pagar = (e) => {
    let estado = document.querySelector(".pagar_taller");
    
    estado.id = e.value;
    
    id_para_pagar = e[e.selectedIndex].id;

}




window.fecha_De_pago = (e) => {
 
/*   let date = new Date()
  let day = `${(date.getDate())}`.padStart(2,'0');
  let month = `${(date.getMonth()+1)}`.padStart(2,'0');
  let year = date.getFullYear();
  let todayDate = `${year}-${month}-${day}`; */

  if(e == true || e == "true") {
      fecthNormalPOST_PUT("PUT", `produccion/estanpado/${id_para_pagar}`, {pagado:true})
      .then( (res) => {
          salio_todo_bien("Todo salio bien")
      })
      .catch( err => {
          algo_salio_mal(`Algo salio mal: ${ err}`)
      })
      
  }else if ( e == false || e == "false"){

      fecthNormalPOST_PUT("PUT", `produccion/estanpado/${id_para_pagar}`, {pagado:false})
      .then( (res) => {
          salio_todo_bien("Todo salio bien")
      })
      .catch( err => {
          algo_salio_mal(`Algo salio mal: ${ err}`)
      })
  }
}


window.salir_cambios = () => {
  opciones_cambio.style.display = "none";
  opciones_cambio.style.visibility = "hidden";
  main_historial()
}




const previsualizar = document.querySelector(".previsualizar");

window.previsualizar_id = (id) => {
    previsualizar.style.display = "grid";
    previsualizar.style.visibility = "visible";
    imprimir_previsualizar(id);



}



const tabla_previsualizar = document.querySelector("#tabla_previsualizar");


const imprimir_previsualizar = (id) => {

    fecthNormalGET("GET",`produccion/estanpado/unico/${id}`)
        .then( res => {
          
            imprimir_html_datos(res)
          
        })
        .catch( err => {
            algo_salio_mal(`Algo salio mal: ${ err }`)
        })
}



const imprimir_html_datos = (res) => {
    
/*     res.map ( e => { */

        tabla_previsualizar.innerHTML = `
        <tr>
        <td><span>ID : </span>${devolverString(res.producto.id_corte)}</td>
        <td><span>NOMBRE : </span>${devolverString(res.producto.nombre)}</td>
        <td><span>ESTAMPADOR : </span>${devolverString(res.estanpador.nombre)}</td>
    </tr>

    <tr>
        <td><span>DIBUJO : </span>${devolverString(res.estanpados.dibujo)}</td>
        <td><span>FECHA DE ENTREGA : </span>${fechaARG(devolverString(res.estanpados.fecha_de_entrada))}</td>
        <td><span>PAGO : </span>${res.estanpados.pagado == false ? "NO PAGADO" : "PAGADO"} </td>

    </tr>
    <tr>
    <td><span>TOTAL POR TALLE : </span>${devolverString(res.producto.total_por_talle)}</td>
    <td><span>TALLES (cantidad) : </span>${devolverString(res.producto.talles)}</td>
    <td><span>TOTAL : </span>${devolverString(res.producto.total)} </td>
    </tr>


 

        `
    /* }) */
}


window.img_salir_previsualizar = () => {

  previsualizar.style.display = "none";
  previsualizar.style.visibility = "hidden";
}



window.ordenar = (e) => {
  const opciones_input = document.querySelector(".opciones_input");

  if(e.value == "fecha_de_entrada"){
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
  }else if ( e.value == "estanpador"){
    opciones_input.innerHTML = `
    <div class="p">
    <select class="custom-select taller" id="${e.value}" onchange="buscarDataTaller(this)">
        <option selected>Filtrar ...</option>

      </select>
       </div>
       <div class="input_fecha">

   </div>

    `

    opciones_de_taller();

  }else if (e.value == "pagado"){

    let data = {
      valor:false
    }


    fecthNormalPOST_PUT("POST", `produccion/estanpado/buscar/filtro/${e.value}`, data)
    .then( res =>{
  
      console.log(res)
        if(res.ok){
          colorearTable(res.data)

        }else{
            algo_salio_mal(`Algo salio mal`)
        }
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })


  }else if (e.value == "0"){
    
    main_historial();
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

  let dato ={valor:[startDate.value, endDate.value]}

 
  fecthNormalPOST_PUT("POST", `produccion/estanpado/buscar/filtro/${id}`, dato)
      .then( res =>{
          if(res.ok){
            colorearTable(res.data)

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
      valor:fecha_exacta.value
  }

  fecthNormalPOST_PUT("POST", `produccion/estanpado/buscar/filtro/${id}`, dato)
      .then( res =>{
   
        colorearTable(res.data)
      })
      .catch( err =>{
          algo_salio_mal(`Algo salio mal: ${ err }`)
      })
  
  

}




const opciones_de_taller = () => {

  fecthNormalGET("GET","produccion/estanpado/oficial")
  .then(res =>{
      imprimir_taller(res.estanpador)
  })
  .catch (err => {
      algo_salio_mal(`Algo salio mal: ${ err }`)
  })
}
const escribir_busquedas = document.querySelector(".escribir_busquedas");

const imprimir_taller = (talleres) => {

  const taller = document.querySelector(".taller");

  let data_taller = "<option value='0' selected >Filtrar ...</option>"
  talleres.map (e => {

      data_taller += `
      <option value="${e.id}">${e.nombre}</option>
      `
  })

  taller.innerHTML = data_taller;
}


window.buscarDataTaller = (value) => {

  if(value.value == "0" || value.value == 0){
  /*     escribir_busquedas.style.display = "none";
      escribir_busquedas.style.visibility = "hidden"; */
      /* main_historial() */
  }else{

    let data = {
      valor: value.value 
    }
   
      fecthNormalPOST_PUT("POST",`produccion/estanpado/buscar/filtro/${"id_estanpador"}`, data)
      .then(res =>{
/*           if(res.produccion.length == 0){
              escribir_busquedas.style.display = "grid";
              escribir_busquedas.style.visibility = "visible";
              escribir_busquedas.innerHTML = `<h3>No se pudo encontrar ningun taller</h3>`

          }else{ */
         
            colorearTable(res.data)
          /* } */
      })
      .catch (err => {
          algo_salio_mal(`Algo salio mal: ${ err }`)
      })
  }
}



///buscador 


const search = document.querySelector("#search");

search.addEventListener("keyup", ({keyCode}) => {

    if( keyCode !== 13){return;}
    if(search.length === 0){return;}

    getSearch(search.value);
    search.value = "";
});


const getSearch = (valor) => {

    
  /*   cargaMedio("spinner_load", true); */


    fecthNormalGET("GET", "produccion/estanpado/buscar/solo/nombre?" + `nombre=${valor}`)
    .then(res => {
    /* cargaMedio("spinner_load", false); */

    
    colorearTable(res.data);
    })
    .catch( err =>{
        algo_salio_mal(`Algo salio mal: ${ err }`)
    })
}



const nombre = localStorage.getItem("nombre");


const nombre_usario = document.querySelector("#nombre_usario");


nombre_usario.innerHTML =  nombre;


const menu = document.querySelector(".menu");

window.style_menu = () => {
    menu.style.left = "0px"
    menu.style.transition = ".5s all"
    menu.style.zIndex = "200"
}

window.style_menu_salir = () => {
    menu.style.left = "-300px"
    menu.style.transition = ".5s all"
}


window.cerrar_seccion = () => {
  cerrar_login();
}
