const eliminacion = document.querySelectorAll(".eliminar");
const rows =document.getElementsByTagName("table tbody tr")




// boton.addEventListener("click", (e) => {
//     const row = rows.find("td:eq(3)").text();

//     alert(row);
// })



eliminacion.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      event.preventDefault()
    //   document.querySelector("span").innerText = ` id: ${boton.id}`

      alert("id:" + boton.id)
    })
  })
