


export const salio_todo_bien  = (mensaje) => {
    return Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: mensaje,
        showConfirmButton: false,
        timer: 1500
      })
}

export const algo_salio_mal = (mensaje) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje,

      })
}


export const advertencia = (mesanje) => {
   
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: mesanje,
        })
}