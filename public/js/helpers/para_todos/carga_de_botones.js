



export const load_normal = (tag, estado, escribir="") => {

    if(estado == true){
        tag.disabled = true; 
        tag.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        `
    }else{
        tag.innerHTML = `${escribir}`
        tag.disabled = false; 
    }

}


export const cargaMedio = (tag, estado) => {

    if(estado == true){
        document.getElementById(`${tag}`).style.display = "grid";
        document.getElementById(`${tag}`).style.visibility = "visible";
    }else{
        document.getElementById(`${tag}`).style.display = "node";
        document.getElementById(`${tag}`).style.visibility = "hidden";
    }
}