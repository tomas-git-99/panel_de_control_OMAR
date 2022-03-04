import { devolverString } from "../para_todos/null.js";
import { fecthNormalGET } from "./fetch.js";

export const funcionParaImprimir = (nombre_cliente, elemento) => {

    const elementoAimprimir =  document.querySelector(`.${elemento}`);

    html2pdf()
        .set({
        margin: 1,
        filename: `${nombre_cliente}.pdf`,
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

export const funcionParaImprimir_sin_nombre = (elemento) => {

    const elementoAimprimir =  document.querySelector(`.${elemento}`);

    html2pdf()
        .set({
        margin: 1,
        filename: `comprobante.pdf`,
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


export const imprimirDirecto = () => {
    
    
    document.body.innerHTML = `
    <div class="bienvenido_imprimir">
    
    <div class="imprimirCliente" id="imprimirCliente">
    
    <div class="tituloImprimir">
    <h2>Comprobante<span>ID:</span></h2>
    <hr>
    </div>
    
    
    
    <div class="infoCliente">
    
    <div class="nombre">
    <label for="">NOMBRE: <span>tomas</span> </label>
    </div>
    <div class="DNI O CUIL">
    <label for="">DNI O CUIL: <span>tomas</span> </label>
    </div>
    <div class="Telefono">
    <label for="">Telefono: <span>tomas</span> </label>
    </div>
    <div class="Provincia">
    <label for="">Provincia: <span>tomas</span> </label>
    </div>
    <div class="Localida">
    <label for="">Localida: <span>tomas</span> </label>
    </div>
    <div class="Direccion">
    <label for="">Direccion: <span>tomas</span> </label>
    </div>
    <div class="Codigo">
    <label for="">Codigo: <span>tomas</span> </label>
    </div>
    
    
    </div>
    
    <div class="comprasHechas">
    
    
    
    <table class="table" id="tablaImprimir">
    <thead>
    <tr>
    <th scope="col">NOMBRE</th>
    <th scope="col">CANTIDAD</th>
    <th scope="col">PRECIO UD</th>
    <th scope="col">TOTAL</th>
    </tr>
    </thead>
    
    <tbody class="imprimir_productos">
    
    </tbody>
    </table>
    
    </div>
    
    
    
    
    <div class="totalImprimir">
    <div class="totaLinia"></div>
    <label for="">TOTAL: <span class="precio_final"> $9012</span> </label>
    </div>
    
    
    
    </div>
    </div>
    `
    
}


export const imprimirComprobante_cliente = (id) => {

    //const id_comprobante = document.querySelector("#id_comprobante");
    
    
    fecthNormalGET("GET", `orden/full/${id}`)
    .then( res => {

        if(res.direccion == null){

            const precio_final = document.querySelector(".precio_final_publico");
            const id_comprobante = document.querySelector(".id_comprobante_publico");

            escribirEnHTML(res, "info_numero_2", true);
            let arrayProducto = unirProductos(res)
            imprimirProducto(arrayProducto, "imprimir_productos_publico")

            let cambio_de_moneda = new Intl.NumberFormat('es-AR', { currency: 'ARS' }).format(res.orden.total)
            precio_final.innerHTML = `$ ${cambio_de_moneda}`;
            id_comprobante.innerHTML = `ID : ${res.orden.id}`

            funcionParaImprimir(`${res.cliente.nombre} ${res.cliente.apellido == null ? '' : res.cliente.apellido }`, "imprimirCliente_publico" );

        }else{
            const precio_final = document.querySelector(".precio_final_envio");
            const id_comprobante = document.querySelector(".id_comprobante_envio");

            escribirEnHTML(res, "infoCliente_envio_10");
            let arrayProducto = unirProductos(res)

            imprimirProducto(arrayProducto, "imprimir_productos_envio")
            let cambio_de_moneda = new Intl.NumberFormat('es-AR', { currency: 'ARS' }).format(res.orden.total)
            precio_final.innerHTML = `$ ${cambio_de_moneda}`;
            id_comprobante.innerHTML = `ID : ${res.orden.id}`

        
            funcionParaImprimir(`${res.cliente.nombre} ${res.cliente.apellido}`, "imprimirCliente_envio" );
        }
    })
    
    
}

const escribirEnHTML = (e, data="", estado=false) => {

    const infoCliente = document.querySelector(`.${data}`);
    let escribir = "";

    if(estado == false){

        escribir += `
        <div class="nombre">
        <label for="">NOMBRE COMPLETO: <span>${devolverString(e.cliente.nombre)+ " " + devolverString(e.cliente.apellido)}</span> </label>
        </div>
        <div class="DNI O CUIL">
        <label for="">DNI O CUIL: <span>${devolverString(e.cliente.dni_cuil)}</span> </label>
        </div>
        <div class="Telefono">
        <label for="">Telefono: <span>${devolverString(e.cliente.tel_cel)}</span> </label>
        </div>
        <div class="Provincia">
        <label for="">Provincia: <span>${devolverString(e.direccion.provincia)}</span> </label>
        </div>
        <div class="Localida">
        <label for="">Localidad: <span>${devolverString(e.direccion.localidad)}</span> </label>
        </div>
        <div class="Direccion">
        <label for="">Direccion: <span>${devolverString(e.direccion.direccion)}</span> </label>
        </div>
        <div class="Codigo">
        <label for="">CP: <span>${devolverString(e.direccion.cp)}</span> </label>
        </div>
        <div class="transporte">
        <label for="">Transporte: <span>${devolverString(e.orden.transporte)}</span> </label>
        </div>
        `
        
        infoCliente.innerHTML = escribir;

    }else{

        escribir += `
        <div class="nombre">
        <label for="">NOMBRE COMPLETO: <span>${devolverString(e.cliente.nombre)+ " " + devolverString(e.cliente.apellido)}</span> </label>
        </div>
        <div class="DNI O CUIL">
        <label for="">DNI O CUIL: <span>${devolverString(e.cliente.dni_cuil )}</span> </label>
        </div>
        <div class="Telefono">
        <label for="">Telefono: <span>${devolverString(e.cliente.tel_cel)}</span> </label>
        </div>
        <div class="email">
        <label for="">Email: <span>${devolverString(e.cliente.email)}</span> </label>
        </div>
        `

        infoCliente.innerHTML = escribir;

    }
}




const imprimirProducto = (res, elemento) => {
    const imprimir_productos = document.querySelector(`.${elemento}`);
    let escribir = "";
    
    res.map(e => {
        
        escribir += `
        <tr>
        
        <td>${devolverString(e.nombre)}</td>
        <td>${devolverString(e.cantidad)}</td>
        <td>$ ${devolverString(e.precio)}</td>
        <td>$ ${e.total}</td>
        
        
        
        </tr>
        `
    })
    
    imprimir_productos.innerHTML = escribir;
}




export const imprimir_parami = (id) => {

    
    fecthNormalGET("GET",`orden/full/${id}`)
    .then(res => {
        
        if(res.direccion == null){
            
  
            let id_comprobante = document.querySelector(".solo_el_id_envio_publico");

            escribirEnHTML(res, "info_numero_3", true);
     
            ticket_parami(res.para_mi, "imprimir_para_mi_table_publico");
            id_comprobante.innerHTML = `<h2>ID : ${res.orden.id}</h2>`
            funcionParaImprimir_sin_nombre("div_para_imprimir_para_mi_publico");

        }else{
            let id_comprobante = document.querySelector(".solo_el_id_envio");
            escribirEnHTML(res, "info_numero_1", false);
    
          
            ticket_parami(res.para_mi, "imprimir_para_mi_table");
            id_comprobante.innerHTML = `<h2>ID : ${res.orden.id}</h2>`
            funcionParaImprimir_sin_nombre("div_para_imprimir_para_mi_para_envio");
        }


        })
    }

    
const ticket_parami = (res, elemento) => {

    const imprimir_para_mi_table = document.querySelector(`.${elemento}`);
    let resultado = "";
   
    res.map( (e,i) => {
        resultado += `
        <tr>
        <th>${devolverString(e.detalles.nombre_producto)}</th>
        <th>${devolverString(e.producto.diseño)}</th>
        <td>${devolverString(e.producto.tela)}</td>
        <td>${devolverString(e.detalles.talle)}</td>
        <td>${devolverString(e.detalles.cantidad)}</td>
        </tr>
        `
    })
    imprimir_para_mi_table.innerHTML  = resultado;
}





const unirProductos = (res) => {

    let arrayIDProductos = res.productos.map( e => e.id_producto);

    let arrayProductosSinRepetir = [];

    arrayIDProductos.forEach((element) => {

        if (!arrayProductosSinRepetir.includes(element)) {
            arrayProductosSinRepetir.push(element);
        }
    });

    let arrayProductoSinRepetirParaImprimir = [];

    for( let id of arrayProductosSinRepetir){

        let cantidad = 0;
        let precioTotal = 0;
        let juntarTodosLosTallesEnUno

        res.productos.filter( e => e.id_producto == id).map( p => {
            cantidad += p.cantidad;
            precioTotal += p.precio * p.cantidad;
            juntarTodosLosTallesEnUno += p.talle
        });
        let dataProducto = res.productos.find( l => l.id_producto == id)
      
        arrayProductoSinRepetirParaImprimir.push({nombre: dataProducto.nombre_producto, cantidad: cantidad, precio: dataProducto.precio, total: precioTotal})
    }
    

    return arrayProductoSinRepetirParaImprimir;
}