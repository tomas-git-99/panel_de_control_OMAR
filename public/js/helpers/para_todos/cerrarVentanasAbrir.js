export const abrirCerrarVentanas = (valor, estado) => {


    if(estado){


        document.querySelector(`.${valor}`).style.display = "grid";
        document.querySelector(`.${valor}`).style.visibility = "visible";

    }else{
            
        document.querySelector(`.${valor}`).style.display = "none";
        document.querySelector(`.${valor}`).style.visibility = "hidden";
    }
}
