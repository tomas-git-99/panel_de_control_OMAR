import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Producto } from "../../models/ventas/producto";




export const crearProducto = async (req: Request, res: Response) => {
    try {

        const { nombre, cantidad, local, tela, precio} = req.body;




        const datos = {

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

    const producto = await Producto.findAll({ where:{ nombre:{ [Op.like]: '%' + buscarProducto + '%'} }});


    res.json({
        ok:true,
        producto
    })
}



export const eliminarProducto = async (req: Request, res: Response) => {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    res.json({
        ok: true,
        msg: `El producto ${producto?.nombre} fue eliminado con exito`
    })
}