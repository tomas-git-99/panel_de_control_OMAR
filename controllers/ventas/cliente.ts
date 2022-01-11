import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Cliente } from "../../models/ventas/cliente";
import { Producto } from "../../models/ventas/producto";





export const crearCliente = async (req: Request, res: Response) => {
    try {

        const { nombre, apellido, dni_cuil, tel_cel} = req.body;

        console.log(req.body);
/* 
        const datos:any = {
            nombre,
            apellido,
            dni_cuil,
            tel_cel,
        }

 */

        const cliente = new Cliente(req.body);

        await cliente.save();


        res.json({
            ok: true,
            cliente
        })



    } catch (error) {
        res.json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }
}


export const buscarCliente = async (req: Request, res: Response) => {

    const buscarCliente:any = req.query;


    
    //const cliente = await Cliente.findAll({ where:{ dni_cuil:{ [Op.like]: '%' + buscarCliente + '%'} }});
    const cliente = await Cliente.findAll({ where:{ dni_cuil:buscarCliente.dni_cuil} });

    

    res.json({
        ok:true,
        cliente
    })
}



export const editarCliente = async (req: Request, res: Response) => {


    try {
        const { id } = req.params;

        const { body } = req;

        const cliente = await Cliente.findByPk(id);

        if (!cliente){
            return res.status(404).json({
                ok: false,
                msg:`El cliente con el id ${ id } no existe`
            }
            );
        }


        await cliente.update(body);

        res.json({
            ok: true,
            cliente
        })
    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });

    }
}


