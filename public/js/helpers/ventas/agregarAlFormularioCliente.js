
export const agregarAlFormularioCliente = (cliente) => {

    let data = JSON.parse(localStorage.getItem("dataCliente"));

    let historial = ""

    data.map( e => {
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

        `
    })

    cliente.innerHTML = historial

}