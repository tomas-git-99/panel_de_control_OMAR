const url = ( window.location.hostname.includes('localhost'))
      ? 'http://localhost:8000/api/'
      : '';


export const fecthNormalGET = (metodo, url_determinado) => {

    return fetch(url + url_determinado,{ 
        method: metodo,
        headers: {'Content-Type': 'application/json'},

    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(err => {
        return err;
    });

}

export const fecthNormalGET_QUERY = (metodo, url_determinado, query, valor) => {

    return fetch(url + url_determinado + query + valor,{ 
        method: metodo,
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(err => {
        return err;
    });

}


export const fecthNormalPOST_PUT = (metodo, url_determinado, valor) => {

    return fetch(url + url_determinado, { 
        method: metodo,
        body: JSON.stringify(valor),
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(err => {
        return err;
    });

}
