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
    <h2>Comprobante</h2>
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
const precio_final = document.querySelector(".precio_final");
    
    
    fecthNormalGET("GET", `orden/full/${id}`)
    .then( res => {
        if(res.ok){
            escribirEnHTML(res);
            imprimirProducto(res.productos)
            let cambio_de_moneda = new Intl.NumberFormat('es-AR', { currency: 'ARS' }).format(res.orden.total)
            precio_final.innerHTML = `$ ${cambio_de_moneda}`;
            funcionParaImprimir(`${res.cliente.nombre} ${res.cliente.apellido}`, "imprimirCliente" );
        }else{
            
        }
    })
    
    
}

const escribirEnHTML = (e) => {
    
    const infoCliente = document.querySelector(".infoCliente");
    let escribir = "";
    
    escribir += `
    <div class="nombre">
    <label for="">NOMBRE: <span>${e.cliente.nombre}</span> </label>
    </div>
    <div class="DNI O CUIL">
    <label for="">DNI O CUIL: <span>${e.cliente.dni_cuil}</span> </label>
    </div>
    <div class="Telefono">
    <label for="">Telefono: <span>${e.cliente.tel_cel}</span> </label>
    </div>
    <div class="Provincia">
    <label for="">Provincia: <span>${e.direccion.provincia}</span> </label>
    </div>
    <div class="Localida">
    <label for="">Localidad: <span>${e.direccion.localidad}</span> </label>
    </div>
    <div class="Direccion">
    <label for="">Direccion: <span>${e.direccion.direccion}</span> </label>
    </div>
    <div class="Codigo">
    <label for="">Codigo: <span>${e.direccion.cp}</span> </label>
    </div>
    `
    
    infoCliente.innerHTML = escribir;
}



const imprimirProducto = (res) => {
    
    const imprimir_productos = document.querySelector(".imprimir_productos");
    let escribir = "";
    
    res.map(e => {
        
        escribir += `
        <tr>
        
        <td>${e.nombre_producto}</td>
        <td>${e.cantidad}</td>
        <td>$ ${e.precio}</td>
        <td>$ ${e.precio * e.cantidad}</td>
        
        
        
        </tr>
        `
    })
    
    imprimir_productos.innerHTML = escribir;
}




export const imprimir_parami = (id) => {
    fecthNormalGET("GET",`orden/imprimir/parami/${id}`)
    .then(res => {
        console.log(res);
            ticket_parami(res.orden_detalle);
            funcionParaImprimir_sin_nombre("div_para_imprimir_para_mi");
        })
    }

    
const ticket_parami = (res) => {
    console.log(res)
    const imprimir_para_mi_table = document.querySelector(".imprimir_para_mi_table");
    let resultado = "";

    res.map( e => {
        
        resultado += `
        <tr>
        <th>${e.orden_detalle.nombre_producto}</th>
        <td>${e.productos.tela == null || e.productos.tela == undefined ? "- -": e.productos.tela}</td>
        <td>${e.orden_detalle.talle == null || e.orden_detalle.talle == undefined ? "- -" : e.orden_detalle.talle}</td>
        <td>${e.orden_detalle.cantidad}</td>
        </tr>
        `
    })
    imprimir_para_mi_table.innerHTML  = resultado;
}
