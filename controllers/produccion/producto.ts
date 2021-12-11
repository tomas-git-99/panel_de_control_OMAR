import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Produccion_producto } from "../../models/produccion/productos_produccion";
import { Taller } from "../../models/produccion/talller";



export const crearProducto = async (req: Request, res: Response) => {
    try {

    const producto = new Produccion_producto(req.body);



    await producto.save();
    
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
        await producto?.update({fecha_de_pago:0})
    }

    await producto?.update(req.body);

    res.json({
        ok: true,
        producto
    })
}

export const obtenerProduccion = async (req: Request, res: Response) => {

    const produccion_productos = await Produccion_producto.findAll();

    const taller = await Taller.findAll()

    let produccion:any = []
    
    produccion_productos.map ( (e, i) =>{
        taller.map ( (p,m) => {
            if(e.id_taller == p.id){
                produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
            }

        })
        if(e.id_taller === null){

            produccion = [...produccion, {produccion:produccion_productos[i]}];
        }
    })

    res.json({
        ok: true,
        produccion
    })
}

export const obetenerUnProducto = async (req: Request, res: Response) => {


    const { id } = req.params;


    const productos = await Produccion_producto.findByPk(id);

    let taller

    let producto:any = []
    
    if(!productos?.id_taller == null || !productos?.id_taller == undefined){

        taller = await Taller.findByPk(productos?.id_taller);
    }

    producto = [...producto, {producto:productos, taller:taller}]

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


    console.log(fecha);

    if( query == "fecha_de_entrada") {

        const produccion_productos = await Produccion_producto.findAll({
            where: {
                fecha_de_entrada:{[Op.between]:[fecha[0], fecha[1]]}
                    
            },order: [['updatedAt', 'ASC']]
        
        });
        
        const taller = await Taller.findAll()

        let produccion:any = []
        
        produccion_productos.map ( (e, i) =>{
            taller.map ( (p,m) => {
                if(e.id_taller == p.id){
                    produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
                }
    
            })
            if(e.id_taller === null){
    
                produccion = [...produccion, {produccion:produccion_productos[i]}];
            }
        })

        return res.json({
            ok: true,
            produccion
        })

     
    }else if ( query == "fecha_de_salida"){

        const produccion_productos = await Produccion_producto.findAll({
            where: {
                fecha_de_salida:{[Op.between]:[fecha[0], fecha[1]]}
                    
            },order: [['updatedAt', 'ASC']]
        
        });
        
        const taller = await Taller.findAll()

        let produccion:any = []
        
        produccion_productos.map ( (e, i) =>{
            taller.map ( (p,m) => {
                if(e.id_taller == p.id){
                    produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
                }
    
            })
            if(e.id_taller === null){
    
                produccion = [...produccion, {produccion:produccion_productos[i]}];
            }
        })

        return res.json({
            ok: true,
            produccion
        })

    }else if ( query == "fecha_de_pago"){
        
        const produccion_productos = await Produccion_producto.findAll({
            where: {
                fecha_de_pago:{[Op.between]:[fecha[0], fecha[1]]}
                    
            },order: [['updatedAt', 'ASC']]
        
        });
        
        const taller = await Taller.findAll()

        let produccion:any = []
        
        produccion_productos.map ( (e, i) =>{
            taller.map ( (p,m) => {
                if(e.id_taller == p.id){
                    produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
                }
    
            })
            if(e.id_taller === null){
    
                produccion = [...produccion, {produccion:produccion_productos[i]}];
            }
        })

        return res.json({
            ok: true,
            produccion
        })
    }


}

export const ordenarPorFechaExacta = async (req: Request, res: Response) => {

    const { fecha } = req.body;

    const { query } = req.params;

    if( query == "fecha_de_entrada") {

        const produccion_productos = await Produccion_producto.findAll({
            where: {
                fecha_de_entrada:{fecha}
                    
            },order: [['updatedAt', 'ASC']]
        
        });
        
        const taller = await Taller.findAll()

        let produccion:any = []
        
        produccion_productos.map ( (e, i) =>{
            taller.map ( (p,m) => {
                if(e.id_taller == p.id){
                    produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
                }
    
            })
            if(e.id_taller === null){
    
                produccion = [...produccion, {produccion:produccion_productos[i]}];
            }
        })

        return res.json({
            ok: true,
            produccion
        })

     
    }else if ( query == "fecha_de_salida"){

        const produccion_productos = await Produccion_producto.findAll({
            where: {
                fecha_de_salida:{fecha}
                    
            },order: [['updatedAt', 'ASC']]
        
        });
        
        const taller = await Taller.findAll()

        let produccion:any = []
        
        produccion_productos.map ( (e, i) =>{
            taller.map ( (p,m) => {
                if(e.id_taller == p.id){
                    produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
                }
    
            })
            if(e.id_taller === null){
    
                produccion = [...produccion, {produccion:produccion_productos[i]}];
            }
        })

        return res.json({
            ok: true,
            produccion
        })

    }else if ( query == "fecha_de_pago"){
        
        const produccion_productos = await Produccion_producto.findAll({
            where: {
                fecha_de_pago:{fecha}
                    
            },order: [['updatedAt', 'ASC']]
        
        });
        
        const taller = await Taller.findAll()

        let produccion:any = []
        
        produccion_productos.map ( (e, i) =>{
            taller.map ( (p,m) => {
                if(e.id_taller == p.id){
                    produccion = [...produccion, {produccion:produccion_productos[i], taller:taller[m]}];
                }
    
            })
            if(e.id_taller === null){
    
                produccion = [...produccion, {produccion:produccion_productos[i]}];
            }
        })

        return res.json({
            ok: true,
            produccion
        })
    }

 
}