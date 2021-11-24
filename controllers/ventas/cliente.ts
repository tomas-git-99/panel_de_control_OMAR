import { Request, Response } from "express";
import { Op } from "sequelize/dist";
import { Cliente } from "../../models/ventas/cliente";





export const crearCliente = async (req: Request, res: Response) => {
    try {

        const { nombre, apellido, dni_cuil, tel_cel, direccion, codigo_postal, provincia, localidad} = req.body;




        const datos = {

            nombre,
            apellido,
            dni_cuil,
            tel_cel,
            direccion,
            codigo_postal,
            provincia,
            localidad,

        }



        const cliente = new Cliente(datos);
        await cliente.save();


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


export const buscarCliente = async (req: Request, res: Response) => {
    const buscarCliente = req.query;

    const cliente = await Cliente.findAll({ where:{ dni_cuil:{ [Op.like]: '%' + buscarCliente + '%'} }});


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
