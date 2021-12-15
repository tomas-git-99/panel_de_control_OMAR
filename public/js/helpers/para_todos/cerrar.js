

export const cerrar_login = () => {

    Swal.fire({
        title: '¿Esta seguro que quiere salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI'
      }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("x-token");
            window.location.href = `${window.location.origin}/index.html`
        }
      })

}