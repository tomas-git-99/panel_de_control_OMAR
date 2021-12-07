export const comprobarCarritoStorage = () => {

    const carrito = localStorage.getItem('carrito');
    
    if(carrito == 1){
        return true;
    }else if(carrito == null || undefined){
        localStorage.setItem("carrito", 1);
        return false;
    }else if(carrito == 0){
        console.log(carrito);
        
        const idOrden = localStorage.getItem('id_orden');
        const numero = parseInt(idOrden);

        if(numero > 0 ){
            preguntarSiConCliente();
            return true;
        }else{
        localStorage.setItem("carrito", 1);
        return false;
        }
    }
}


export const preguntarSiConCliente = () => {

    const dato = JSON.parse(localStorage.getItem("dataCliente"));
     
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: '¿Quiere seguir con el mismo cliente?',
        text: `Nombre: ${dato[0].nombre} ${dato[0].apellido}, DNI O CUIL: ${dato[0].dni_cuil}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Continuando!',
            `Con: ${dato[0].nombre} ${dato[0].apellido}`,
            'success'
          )
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          localStorage.removeItem("id_orden");
          localStorage.removeItem("dataCliente");
          localStorage.removeItem("dataDireccion");
          swalWithBootstrapButtons.fire(
            'Se limpiaron los datos',
            'Puede continuar con su compra',
            'error'
          )
        }
      })
}