import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";




export const crearProducto = async (req: Request, res: Response) => {
    try {

        const { nombre, cantidad, local, tela, precio} = req.body;




        const datos:any = {

            nombre,
            cantidad,
            local,
            tela,
            precio

        }



        const producto = new Producto(datos);
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

        console.log(body);

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
    const { id } = req.params;

    const producto = await Producto.findByPk(id);


    await producto?.destroy()

    res.json({
        ok: true,
        msg: `El producto ${producto?.nombre} fue eliminado con exito`
    })
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
    const productos = await Producto.findAll();

    res.json({
        ok: true,
        productos
    })
}

export const obtenerUnoProducto = async (req: Request, res: Response) => {


    const {id} = req.params;
    console.log(id);
    const producto = await Producto.findByPk(id);

    const talles = await Talle.findAll({where:{ id_producto:id }});

    res.json({
        ok: true,
        producto,
        talles
    })
}