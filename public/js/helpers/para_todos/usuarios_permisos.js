


export const usuarioPermisos = (rol, tag) => {
    const params = window.location.pathname;


    const dondeEsta = params.split("/");


    let cerrarVentanas = document.querySelector(`.${tag}`);
    let historial_borrar = document.querySelector(`.historial_borrar`);

    if(rol == "VENTAS"){

        if(dondeEsta[4] === "produccion"){
            window.location = "/page/roles/admin/ventas/index.html";
        }

        
        cerrarVentanas.style.display = "none";
        cerrarVentanas.style.visibility = "hidden";

        


        historial_borrar.style.display = "none";
        historial_borrar.style.visibility = "hidden";
        
    }else if( rol == "PRODUCCION"){

        if(dondeEsta[4] === "ventas"){
            window.location = "/page/roles/admin/produccion/index.html";
        }
        cerrarVentanas.style.display = "none";
        cerrarVentanas.style.visibility = "hidden";
    }else{
        return true;
    }
}