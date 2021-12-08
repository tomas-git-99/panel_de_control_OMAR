export const funcionParaImprimir = (nombre_cliente, elemento) => {

    const elementoAimprimir =  document.querySelector(`.${elemento}`);

    html2pdf()
        .set({
        margin: 1,
        filename: `${nombre_cliente}.pdf`,
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 3, // A mayor escala, mejores gráficos, pero más peso
            letterRendering: true,
            useCORS: true
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: 'portrait' // landscape o portrait
        }
    })
      .from(elementoAimprimir)
      .save()
      .catch( err => { console.log(err)})

}

export const funcionParaImprimir_sin_nombre = (elemento) => {

    const elementoAimprimir =  document.querySelector(`.${elemento}`);

    html2pdf()
        .set({
        margin: 1,
        filename: `comprobante.pdf`,
        image: {
            type: 'jpeg',
            quality: 0.98
        },
        html2canvas: {
            scale: 3, // A mayor escala, mejores gráficos, pero más peso
            letterRendering: true,
            useCORS: true
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: 'portrait' // landscape o portrait
        }
    })
      .from(elementoAimprimir)
      .save()
      .catch( err => { console.log(err)})

}