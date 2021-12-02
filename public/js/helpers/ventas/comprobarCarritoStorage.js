export const comprobarCarritoStorage = () => {

    const carrito = localStorage.getItem('carrito');

    if(carrito == 1){
        return true;
    
    }else if(carrito == null || undefined){
    
        localStorage.setItem("carrito", 1);
        return false;
    }else if(carrito == 0){
        const idOrden = localStorage.getItem('idOrden');
        if(!idOrden == null){
            return true;
        }else{
        localStorage.setItem("carrito", 1);
        return false;
        }
    }
}

