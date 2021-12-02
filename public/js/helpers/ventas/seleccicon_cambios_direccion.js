




export const selecciconCambios_direccion = (s , seleccion_direccion) => {

    let historial = ""

    if(s.value == 0){
        
    historial = `
    
    <div class="provincia">
    <span>Provincia</span>
         <input type="text"class="form-control" name="provincia" placeholder="Provincia" value="">
     </div>

     <div class="localidad">
         <span>Localidad</span
         <input type="text"> 
         <input type="text"class="form-control" name="localidad" placeholder="Localidad" value="">
     </div>

     <div class="direccion">
         <span>Direccion</span>
         <input type="text"class="form-control" name="direccion" placeholder="Direccion" value="">
     </div>

     <div class="talles">
         <span>Codigo Postal</span>
         <input type="text"class="form-control" name="cp" placeholder="Codigo Postal" value="">
     </div>
    `
    return seleccion_direccion.innerHTML = historial;
    }

    const direcciones =  JSON.parse(localStorage.getItem("dataDireccion"));
    const direcc = direcciones.find( e => { if (e.id == s.value){return e}});


    historial = `
    
    <div class="tela">
    <span>Provincia</span>
         <input type="text"class="form-control" name="provincia" placeholder="Provincia" value="${direcc.provincia}" disabled>
     </div>
     <div class="precio">
         <span>Localidad</span>
         <input type="text"class="form-control" name="localidad" placeholder="Localidad" value="${direcc.localidad}" disabled>
     </div>
     <div class="cantidad">
         <span>Direccion</span>
         <input type="text"class="form-control" name="direccion" placeholder="Direccion" value="${direcc.direccion}" disabled>
     </div>
     <div class="talles">
         <span>Codigo Postal</span>
         <input type="text"class="form-control" name="cp" placeholder="Codigo Postal" value="${direcc.cp}" disabled>
     </div>
    `

    seleccion_direccion.innerHTML = historial;
}