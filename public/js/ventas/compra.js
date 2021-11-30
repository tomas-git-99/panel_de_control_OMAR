

const url = ( window.location.hostname.includes('localhost'))
? 'http://localhost:8000/api/'
: '';


const eliminacion = document.querySelectorAll(".eliminar");
const cantidad = document.querySelector(".cantidad");
const formAgregar =document.querySelector(".formAgregar")





eliminacion.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      event.preventDefault()
    //   document.querySelector("span").innerText = ` id: ${boton.id}`

    cantidad.style.opacity = 1;

    localStorage.setItem("id", boton.id);
    
    //   alert("id:" + boton.id)
    })
  })


  formAgregar.addEventListener("submit", (event) => {

      event.preventDefault();

      const idProducto = localStorage.getItem("id");

      const forData = {idProducto};

      for(let el of formAgregar.elements){
          if(el.name.length > 0)
              forData[el.name] = el.value;    
          } 


    //agregar a carrito para despues comprar con el metodo POST

    fetch(url + "carrito" ,{ 
      method: "POST",
      body: JSON.stringify( forData ),
      headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        
      cantidad.style.opacity = 0;
    })
    .catch(err => {
        alert("Error: " + err)
    });
            
    




  })


  const carrito = document.querySelector(".carrito");

  carrito.addEventListener("click", () => {

    window.location = "/page/roles/admin/ventas/carrito.html"

  })


  const talleUnica = document.querySelector(".talleUnica");

  const checkAgregar = document.getElementById("checkAgregar");

checkAgregar.addEventListener("change", (e) => {
  e.preventDefault();

  if(checkAgregar.checked){

    talleUnica.style.display = "grid";
    talleUnica.style.visibility = "visible";

  }else{
    talleUnica.style.display = "none";
    talleUnica.style.visibility = "hidden";
  }
})


