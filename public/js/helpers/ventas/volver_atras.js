export const volverAtras = (cerrar, abrir) => {

    //abrir ventana anterior
    abrir.style.display = "grid";
    abrir.style.visibility = "visible";


    //cerrar ventana
    cerrar.style.display = "none";
    cerrar.style.visibility = "hidden";
}
