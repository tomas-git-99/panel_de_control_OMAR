const eliminacion = document.querySelectorAll(".eliminar");
const cantidad = document.querySelector(".cantidad");
const formAgregar =document.querySelector(".formAgregar")





eliminacion.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      event.preventDefault()
    //   document.querySelector("span").innerText = ` id: ${boton.id}`

    cantidad.style.opacity = 1;

    localStorage.setItem("id", boton.id)
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
            
      console.log(forData);


      cantidad.style.opacity = 0;


  })


  const carrito = document.querySelector(".carrito");



  carrito.addEventListener("click", () => {
    window.location = "/public/page/roles/admin/ventas/carrito.html"
  })