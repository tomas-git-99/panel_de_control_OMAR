



//CONTEO DEL TOTAL DE TODAS LAS TALLES DEL PRODUCTO
export const conteoPorTalle = (res) => {
    let cantidadTotal = 0;
    
    res.map((e) =>{
        cantidadTotal = e.cantidad  + cantidadTotal
    })

    return cantidadTotal;
};


//IMPRIMIR LAS VARIAS OPCIONES DE TALLES QUE TIENE UN PRODUCTO
export const imprimirTallesEnCadaProducto = (res) => {
    
    res.map( e => {
        e.talles.map( i => { 

            document.getElementById(`seleccion_talles_${i.id_producto}`).innerHTML += `<option>Talle:${i.talle}, Stock:${i.cantidad}</option>`;

        })
    })


}