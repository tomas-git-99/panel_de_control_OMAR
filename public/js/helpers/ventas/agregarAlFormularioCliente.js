
export const agregarAlFormularioCliente = (cliente, id) => {

    let data = JSON.parse(localStorage.getItem("dataCliente"));


    let dato = data.find( e => e.id == id);

    let clientes = [dato]

    console.log(dato)
    let historial = ""

    clientes.map( e => {
        historial += ` 

        <div class="nombre">
        <span>Nombre</span>
        <input type="text" class="form-control" name="nombre" placeholder="Nombre" value="${e.nombre}" disabled>
    </div>
    <div class="local">
        <span>Apellido</span>
        <input type="text"class="form-control" name="apellido" placeholder="Apellido" value="${e.apellido}" disabled>
    </div>
    <div class="cantidad">
        <span>DNI O CUIL</span>
        <input type="text"class="form-control" name="DNI O CUIL" placeholder="DNI O CUIL" value="${e.dni_cuil}" disabled>
    </div>
    <div class="talles">
        <span>Telefono o Celular</span>
             <input type="text"class="form-control" name="Telefono o Celular" placeholder=" Telefono o Celular" value="${e.tel_cel}" disabled>
         </div>
         <div class="email">
         <span>Email</span>
         <input type="text"class="form-control" name="email" placeholder=" Email"value="${e.email == null || e.email == '' ? '- -' : e.email}" disabled>
     </div>
        `
        cliente.innerHTML = historial
    })


}

export const limpiarForm = (cliente) => {
    let historial = ""

    historial = ` 

    <div class="nombre">
    <span>Nombre</span>
    <input type="text" class="form-control" name="nombre" placeholder="Nombre" >
</div>
<div class="local">
    <span>Apellido</span>
    <input type="text"class="form-control" name="apellido" placeholder="Apellido" >
</div>
<div class="cantidad">
    <span>DNI O CUIL</span>
    <input type="text"class="form-control" name="dni_cuil" placeholder="DNI O CUIL" >
</div>
<div class="talles">
    <span>Telefono o Celular</span>
         <input type="text"class="form-control" name="tel_cel" placeholder=" Telefono o Celular" >
     </div>
     <div class="email">
     <span>Email</span>
     <input type="text"class="form-control" name="email" placeholder=" Email">
 </div>
    `
    cliente.innerHTML = historial
}