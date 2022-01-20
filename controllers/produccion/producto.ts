import { query, Request, Response } from "express";
import { Op, where } from "sequelize/dist";
import { Estanpados } from "../../models/produccion/estanpados";
import { Produccion_producto } from "../../models/produccion/productos_produccion";
import { Taller } from "../../models/produccion/talller";



export const crearProducto = async (req: Request, res: Response) => {
    try {

    const producto = new Produccion_producto(req.body);

    const estado = req.query.estado;


    await producto.save();


    if(estado == "true"){

        const data:any = {
            id_corte:req.body.id_corte
        }

        const estanpados = new Estanpados(data);

        await estanpados.save();

    }
    
    res.json({
         ok: true,
         producto
    })
        
    } catch (error) {
        res.status(505).json({
            ok: false,
            msg: error
        })
    }
        
}


export const actualizarProducto = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;
    
        const producto = await Produccion_producto.findByPk(id);
    
    
        let dato = req.body;
        const { estado } = req.body;
        let nombre = Object.keys(dato);
    
     
    
        if(nombre[0] == "total_por_talle"){
    
            let newTotal:number = producto!.talles * dato.total_por_talle;
            await producto?.update({total: newTotal});
        }
        if( nombre[0] == "talles" ){
            let newTotal:number = dato.talles * producto!.total_por_talle;
            await producto?.update({total: newTotal});
        }
    
        if( estado == false){
            let dato_verdad:any = null
            await producto?.update({fecha_de_pago:dato_verdad})
        }
        
    
        await producto?.update(req.body);
    
        res.json({
            ok: true,
            producto
        })
    } catch (error) {
        console.log(error);
    }

}


export const obtenerProduccion = async (req: Request, res: Response) => {

   /*  const produccion_productos = await Produccion_producto.findAll({order: [['updatedAt', 'DESC']], limit:10} ); */

    let valor:any = req.query.offset;

    let valorOffset = parseInt(valor)

    

    const produccion_test = await Produccion_producto.findAndCountAll({order: [['updatedAt', 'DESC']], limit:10, offset:valorOffset});

    const taller = await Taller.findAll()

    let contador = produccion_test.count;
    let produccion:any = []
    
    produccion_test.rows.map ( (e, i) =>{
        taller.map ( (p,m) => {
            if(e.id_taller == p.id){
                produccion = [...produccion, {produccion:e, taller:taller[m]}];
            }

        })
        if(e.id_taller === null){

            produccion = [...produccion, {produccion:e}];
        }
    })

    res.json({
        ok: true,
        contador,
        produccion
    });


}

export const obetenerUnProducto = async (req: Request, res: Response) => {


    const { id } = req.params;


    const productos = await Produccion_producto.findByPk(id);

    let taller = await Taller.findByPk(productos?.id_taller);

    let producto:any = []

    
    producto = [...producto, {producto:productos, taller:taller || ""}]

    res.json({
        ok: true,
        producto,
        taller
    })

};


//["2021-12-12", "2021-12-11"]

export const ordenarPorRango = async (req: Request, res: Response) => {

    const { fecha } = req.body;
    const { query } = req.params;

    const { offset } = req.query;


    let valor:any  = fecha;

    
    
    if( fecha !== undefined ){
        if(fecha.length > 1) {
            valor = {[Op.between]:[fecha[0], fecha[1]]}; 
        } 
    }else{
        valor = null;
        if(query == "estado"){
            valor = false;
        }
    }
    
    console.log(valor);

    
 
    searchFunc(query, valor, offset)
    .then( ({produccion, contador}) => {
        return res.json({
            ok: true,
            contador,
            produccion
        })
    })
    .catch( error => {
        return res.json({
            ok: false,
            msg: error
        })
    })
 

}

export const ordenarPorFechaExacta = async (req: Request, res: Response) => {

    const { fecha } = req.body;

    const { query } = req.params;


    searchFunc(query, fecha)
    .then( (produccion) => {
        return res.json({
            ok: true,
            produccion
        })
    })
    .catch( error => {
        return res.json({
            ok: false,
            msg: error
        })
    })
 
}

export const unicoDatoQuery = async (req: Request, res: Response) =>{

    try {
        const { query } = req.params;

    
        let valor:null | false = null
    
        if(query == "estado"){
            valor = false
        }
        const { offset } = req.query;
    
        searchFunc(query, valor ,offset)
            .then( (produccion:any) => {
              
                return res.json({
                    ok: true,
                    produccion
                })
            })
            .catch( error => {
                return res.json({
                    ok: false,
                    msg: error
                })
            })
        
    } catch (error) {
        res.status(505).json({
            ok: false,
            msg: error
        })
    }
    
}

const searchFunc = async(palabra:any, valor: false | null | number, numero:number | any = 0) =>{


    let valorOffset = parseInt(numero)

    let buscar:any = {
        where: {

        },order: [['updatedAt', 'DESC']], limit:10, offset:valorOffset
    }

    buscar.where[`${palabra}`] = valor;

    const produccion_productos = await Produccion_producto.findAndCountAll(buscar);
    const taller = await Taller.findAll()
        
    let produccion:any = []

         produccion_productos.rows.map ( (e, i) =>{
             taller.map ( (p,m) => {
                 if(e.id_taller == p.id){
                     produccion = [...produccion, {produccion:e, taller:taller[m]}];
                 }
    
             })
             if(e.id_taller === null){
    
                 produccion = [...produccion, {produccion:e}];
             }
         })

    return {produccion, contador:produccion_productos.count};

}


export const buscar = async (req: Request, res: Response) => {

   /*  const dato = req.query; */

    let valor:any = req.query.offset;
    let valorOffset = parseInt(valor);

  

    const produccion_productos = await Produccion_producto.findAndCountAll({ where:{ 
        id_corte:{ [Op.like]: '%'+ req.query.nombre +'%'},
        // tela: { [Op.like]: '%'+ buscarProducto.tela +'%' }, buscar por tela opcionB
    },limit:10, offset:valorOffset});

  
    let contador = produccion_productos.count;
    
    const taller = await Taller.findAll()
    let produccion:any = []
    
    produccion_productos.rows.map ( (e, i) =>{
        taller.map ( (p,m) => {
            if(e.id_taller == p.id){
                produccion = [...produccion, {produccion:e, taller:taller[m]}];
            }

        })
        if(e.id_taller === null){

            produccion = [...produccion, {produccion:e}];
        }
    })

    res.json({
        ok:true,
        contador,
        produccion
    })

}




 

export const agregarProductoAestampos = async (req: Request, res: Response) => {


    try {
        const { id } = req.params

        const producto = await Produccion_producto.findByPk(id)

    
        const estampdos = await Estanpados.findAll({where: {id_corte:producto?.id_corte}});

        if(estampdos.length > 0){

            return res.json({
                ok:false,
                msg: `El producto "${producto?.nombre}" ya esta agregado en Estampados`
            })
        }

        
        const data:any = {
            id_corte:producto?.id_corte
        }
    
        const estanpados = new Estanpados(data);
    
        await estanpados.save();
        res.json({
            ok: true,
            estanpados
        })

    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }

}

export const eliminarProductoDeEstampados = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const producto = await Produccion_producto.findByPk(id)

    
        const estampdos = await Estanpados.findAll({where: {id_corte:producto?.id_corte}});

        if(estampdos.length == 0) {
            return res.json({
                ok: false,
                msg:"El producto que quiere elimnar no esta en estampados"
            })
        }

        await estampdos[0].destroy();

        res.json({
            ok: true
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }
}


export const eliminarProducto = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;
    
    
        const producto = await Produccion_producto.findByPk(id);

        const estampdos = await Estanpados.findAll({where: {id_corte:producto?.id_corte}});

        if(estampdos.length > 0) {
            await estampdos[0].destroy();
        }
    
        await producto?.destroy();
    
    
        res.json({
            ok: true
        })
    } catch (error) {
        
        res.json({
            ok: false,
            msg: error
        })
    }


}