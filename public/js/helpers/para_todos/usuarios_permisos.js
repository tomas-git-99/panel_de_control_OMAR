


export const usuarioPermisos = (rol, tag) => {

    const local = localStorage.getItem('local');


    const params = window.location.pathname;


    const dondeEsta = params.split("/");


    let cerrarVentanas = document.querySelector(`.${tag}`);
    let historial_borrar = document.querySelector(`.historial_borrar`);
    let agregar_solo = document.querySelector(`.agregar_solo`);

    let crear_usuario = document.querySelector(".crear_usuario")

    if(rol == "VENTAS"){

        if(dondeEsta[4] === "produccion"){
            window.location = "/page/roles/admin/ventas/index.html";
        }

        if(local == "Cuartel" || local == "cuartel"){
            
            historial_borrar.style.display = "grid";
            historial_borrar.style.visibility = "visibility";
             
            agregar_solo.style.display = "grid";
            agregar_solo.style.visibility = "visibility";

        }else{
                       
            historial_borrar.style.display = "none";
            historial_borrar.style.visibility = "hidden";

            agregar_solo.style.display = "none";
            agregar_solo.style.visibility = "hidden";
        }
        
        cerrarVentanas.style.display = "none";
        cerrarVentanas.style.visibility = "hidden";

        


        crear_usuario.style.display = "none";
        crear_usuario.style.visibility = "hidden";
        
        
    }else if( rol == "PRODUCCION"){

        if(dondeEsta[4] === "ventas"){
            window.location = "/page/roles/admin/produccion/index.html";
        }
        cerrarVentanas.style.display = "none";
        cerrarVentanas.style.visibility = "hidden";


        crear_usuario.style.display = "none";
        crear_usuario.style.visibility = "hidden";
    }else{
        return true;
    }
}