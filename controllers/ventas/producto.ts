import { NextFunction, Request, Response } from "express";
import { Op, where } from "sequelize/dist";
import db from "../../DB/conectarDB";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";




export const crearProducto = async (req: Request, res: Response) => {
    try {

        const producto = new Producto(req.body);
        await producto.save();


        res.json({
            ok: true,
            producto
        })



    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
}



export const editarProducto = async (req: Request, res: Response) => {


    try {
        const { id } = req.params;

        const { body } = req;

        const producto = await Producto.findByPk(id);

        if (!producto){
            return res.status(404).json({
                ok: false,
                msg:`El usuario con el id ${ id } no existe`
            }
            );
        }


        await producto.update(body);

        res.json({
            ok: true,
            producto
        })
    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });

    }
}

export const buscarProducto = async (req: Request, res: Response) => {
    

    const buscarProducto = req.query;


    
    const producto = await Producto.findAll({ where:{ 

        nombre:{ [Op.like]: '%'+ buscarProducto.nombre +'%'},
        // tela: { [Op.like]: '%'+ buscarProducto.tela +'%' }, buscar por tela opcionB
    }} );

    /* [Op.or]:[{nombre}, {tela}]:{ [Op.like]: '%'+ buscarProducto.nombre +'%'} */
    
    res.json({
        ok:true,
        producto
    })
}



export const eliminarProducto = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;

       
        const producto = await Producto.findByPk(id);


        await producto?.update({estado:false})

        res.json({
            ok:true
        })
    
    } catch (error) {
        res.json({
            ok: false,
            msg:error
        })
    }
}




export const agregarMasStock = async (req: Request, res: Response) => {

    const { id } = req.params;

    const { agregar } = req.body;

    const producto = await Producto.findByPk(id);

    const nuevoStock = agregar + producto?.cantidad;


    await producto?.update({cantidad:nuevoStock});


    res.json({
        ok: true,
        producto
    })
}



export const quitarStock = async (req: Request, res: Response) => {

    const { id } = req.params;

    const { quitar } = req.body;

    const producto = await Producto.findByPk(id);

    const nuevoStock = producto!.cantidad - quitar;

    await producto?.update({cantidad:nuevoStock});


    res.json({
        ok: true,
        producto
    })
}


export const hitorialProductos = async (req: Request, res: Response) => {
    try {
        
        const productos_rows = await Producto.findAndCountAll({where:{estado:true},order: [['createdAt', 'DESC']]});
        const contador = productos_rows.count;
        const productos = productos_rows.rows;

        res.json({
            ok: true,
            productos
        })
    } catch (error) {
        console.log(error);
    }
}

export const obtenerUnoProducto = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const {id} = req.params;
        
        const producto = await Producto.findByPk(id);

        const talles =   await Talle.findAll({where:{ id_producto:id }, order:[ ['talle','ASC'] ]});

        if(!talles){
            return res.json({
                ok: false,
                msg:"Estas talles con existen"
            })
       

        }
    
        return res.json({
            ok: true,
            producto,
            talles
        });
       
        
    } catch (error) {
        return res.status(505).json({
            ok: false,
            msg: error
        })
    }

}


export const soloLocales = async (req: Request, res: Response) => {

    const locales = await Producto.findAll({attributes:['local']});


    const result:any = [];


    locales.forEach((item)=>{
    	//pushes only unique element
        if(!result.includes(item.local)){
    		result.push(item.local);
    	}
    })

    
    
      res.json({
          ok: true,
          result
       })
}

export const buscarLocal = async (req: Request, res: Response) => {
    const query:any = req.query;

    const locales = await Producto.findAll({ where:{ 

        local:{ [Op.like]: '%'+ query.local +'%'},
        // tela: { [Op.like]: '%'+ buscarProducto.tela +'%' }, buscar por tela opcionB
    }} );


    res.json({
        ok: true,
        locales
    })
}


