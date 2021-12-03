import { fecthNormalGET, fecthNormalPOST_PUT } from "../helpers/ventas/fetch.js";
import { salio_todo_bien, algo_salio_mal } from "../helpers/para_todos/alertas.js";


const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : '';

const historialGet = () => {

    fetch(url + "producto",{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        leerHistorial(res.productos)
    })
    .catch(err => {
        console.error(err)
  
    })
}

const prueba = document.querySelector(".prueba")
const previsualizar = document.querySelector(".previsualizar");

window.previsualizar_producto = (id) => {

    fecthNormalGET("GET",`producto/full/prueba/${id}`)
        .then((res) => {
            console.log(res)
            if(res.ok){
                ordenarPorTalle(res.talles);
                ordenarProductoTable(res.producto);

            }
        }) 
        .catch(err => console.log(err));
    previsualizar.style.opacity = 1;

}

const leerHistorial = (res) => {
    console.log(res)
    let historial = ""
    res.map( e => {
        historial += `
   
        <tr>
          <th scope="row">${e.id}</th>

          <td>${e.nombre}</td>
          <td>${e.cantidad}</td>
          <td>1,2,3,4,5</td>
          <td>${e.tela}</td>
          <td>${e.local}</td>
          <td>$${e.precio}</td>
          <td>
            <img id="${e.id}"  class="img_previsualizar" src="https://img.icons8.com/pastel-glyph/64/000000/clipboard-preview.png" width="25px" onclick="previsualizar_producto(this.id)"/>
          </td>
        </tr>

   
        `;
        
    })

    prueba.innerHTML = historial;
}



//BUSCADOR

const search = document.querySelector("#search");

search.addEventListener("keyup", ({keyCode}) => {

    if( keyCode !== 13){return;}
    if(search.length === 0){return;}

    getSearch(search.value);
    search.value = "";
});


const getSearch = (valor) => {

    

    fetch(url + "producto/search?" + `nombre=${valor}`,{ 
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        leerHistorial(res.producto);
    })
    .catch(err => {
        console.error(err)
  
    })
}






//CARGAR EL HISTORIAL CADA VEZ QUE ENTREN A ESTE HTML
historialGet();




//COLOGAR TALLES NUEVOS


const talle_por_ID = (res) => {

    let talles = "";

    res.map( e => {
        talles += `
        <option value="${e.id}"></option>
        `
    })

}

/* fecthNormalGET("GET", `talle/${id_producto}`)
   .then(res => {
       
   }) */



const datos_producto_table = document.querySelector(".datos_producto_table");


const ordenarProductoTable = (res) => {

    let result = ""

    

        result += `
            <tr>
            <td>${res.nombre} : </td>
            <td><input type="text" id="producto_nombre" name="nombre"></td>
            <td> 
                <button  id="nombre_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>
            <tr>
            <td>Cantidad Total: (${res.cantidad}) : </td>
            <td><input type="text" id="producto_cantidad" name="cantidad"></td>
            <td> 
                <button  id="cantidad_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>
            <tr>
            <td>Talles: (${res.talle}) : </td>
            <td><input type="text" id="producto_talle" name="talle"></td>
            <td> 
                <button  id="talle_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>
           
            <tr>
            <td> Precio:$ ${res.precio} : </td>
            <td><input type="text" id="producto_precio" name="precio" ></td>
            <td> 
                <button  id="precio_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>
            <tr>
            <td>Local: (${res.local}) : </td>
            <td><input type="text" id="producto_local" name="local" ></td>
            <td> 
                <button  id="local_${res.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
            </td>
            </tr>
    
        `
   
   

    datos_producto_table.innerHTML = result;
}


const talles_datos = document.querySelector(".talles_datos")
const ordenarPorTalle = (res) => {
    let result = ""
    res.map( e => {
        result += ` 
        <div class="datos_talle">
        <label for="">Talle : <span class="label_talle">${e.talle}</span> <span class="label_stock">(${e.cantidad})</span></label>

        <input type="text" name="talle_${e.id}">
        <button  type="button"  class="btn btn-outline-primary  btn-sm" id="${e.id}" onclick="agregar_talle(this.id)">AGREGAR</button>
        <button  type="button"  class="btn btn-outline-warning  btn-sm" id="${e.id}" onclick="agregar_talle(this.id)">RESTAR </button>
        <button  type="button" class="btn btn-outline-danger  btn-sm"   id="${e.id}" onclick="eliminar_talle(this.id)">ELIMINAR</button>
        </div>

        `
    })

    talles_datos.innerHTML = result;
}

window.cambiar_dato = (id) => {

    const botonLoad = document.querySelector(`#${id}`);

    const palabras = id.split('_');


    let input = document.getElementById(`producto_${palabras[0]}`);
    const nombre = input.name;
    const valor = input.value;

    
    let dato = {name:valor}

    dato[`${nombre}`] = dato.name;
    delete dato.name;


    botonLoad.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    <span class="sr-only"></span>`
    
    fecthNormalPOST_PUT("PUT",`producto/${palabras[1]}`, dato )
    .then(res => {
        
        if(res.ok) {
            botonLoad.className = "btn btn-outline-success"
            botonLoad.innerHTML = `OK`
            input.value = "";

            setTimeout(function(){
            botonLoad.className = "btn btn-outline-primary  btn-sm"
            botonLoad.innerHTML = `CAMBIAR`
                
            }, 1000);
            
        }else {
            // algo_salio_mal(`Algo salio mal`)
        }

    })
    .catch(err => {
        // algo_salio_mal(`Algo salio mal: ${ err.message }`)
    })
 
}

window.agregar_talle = (id) => {

    let input = document.getElementById(`talle_${id}`);

    const forData = {
        agregar: input.value
    }
    fecthNormalPOST_PUT("PUT", `talle/${id}`, forData)
        .then(res => {
            if(res.ok) {
                salio_todo_bien(`Se agrego correctamente la cantidad de: ${ input.value }`)
            }else {
                algo_salio_mal(`Algo salio mal`)
            }

        })
        .catch(err => {
            algo_salio_mal(`Algo salio mal: ${ err.message }`)
        })
}

window.eliminar_talle = (id) => {


    fecthNormalGET("DELETE",`talle/${id}`)
       .then(res => {
           if (res.ok){
               salio_todo_bien(`Se elimino correctamente`)
           }else{

           }
       })
       .catch(err => {
        algo_salio_mal(`Algo salio mal: ${ err.message }`)

       })
}


{/* <tr>
<td>Tela: (${e.Tela}) : </td>
<td><input type="text" id="producto_${e.id}" name="tela" ></td>
<td> 
    <button  id="${e.id}" type="button"  class="btn btn-outline-primary  btn-sm" onclick="cambiar_dato(this.id)">CAMBIAR</button>
</td>
</tr> */}