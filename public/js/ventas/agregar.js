


const url = ( window.location.hostname.includes('localhost'))
? 'http://localhost:8000/api/'
: '';

const formProducto = document.querySelector(".formProducto");




formProducto.addEventListener("submit", (e) => {
    e.preventDefault();

    const forData = {};
    
    for(let el of formProducto.elements){
        if(el.name.length > 0)
            forData[el.name] = el.value;    
        } 


    console.log(forData)


    fetch(url + "producto" ,{ 
        method: "POST",
        body: JSON.stringify( forData ),
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(res => {
        window.location = "/page/roles/admin/ventas/index.html"
    })
    .catch(err => {
        alert("Error: " + err)
    });

    
});




