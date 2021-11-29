const form = document.querySelector("form");


//FALTA CONFIGURAR LAS RUTAS PARA DIFERENTES ROLES
const PERMISOS = {
    "ADMIN": () => console.log("admin"),
    "VENTAS": "was",
    "PRODUCCION": "gato"
}




form.addEventListener('submit', (e) => {

   e.preventDefault();

   const forData = {};

   for(let el of form.elements){
       if(el.name.length > 0)
           forData[el.name] = el.value;    
       } 
         
   console.log(forData) ;

   fetch(url + 'usuario', {
       method: 'POST',
       body: JSON.stringify( forData ),
       headers: {'Content-Type': 'application/json'},
    })
    .then(response => resp.json())
    .then(res => {
        if(res.ok === true){
            const permiso = PERMISOS[res.rol]
                        ? PERMISOS[res.rol]()
                        : alert("ERROR AL ENTRAR, HABLE CON ADMINISTRADOR")
        }
    })
    .catch( err => {
        alert( error = err)
    })

    
}) 


module.exports = PERMISOS