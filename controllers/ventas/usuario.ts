import { Request, Response } from "express";
import { Usuario } from "../../models/ventas/usuario";
import bcryptjs from 'bcryptjs';







export const crearUsuario = async( req: Request, res: Response) => {


    try {

        const { nombre, email, password, dni_cuil, rol} = req.body;

        const salt = await bcryptjs.genSaltSync(10);

        const newPassword = await bcryptjs.hashSync( password, salt );


        const datos:any = {

            nombre,
            email,
            password:newPassword,
            dni_cuil,
            rol

        }



        const usuario = new Usuario(datos);

        await usuario.save();


        res.json({
            ok: true,
            usuario
        })



    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });
    }

    
}


export const editarUsuario = async (req:Request, res:Response) => {
    try {
        
        const { id } = req.params;
        const { body } = req;

        const usuario = await Usuario.findByPk(id);


        if (!usuario){
            return res.status(404).json({
                ok: false,
                msg:`El usuario con el id ${ id } no existe`
            }
            );
        }
//aca colocar por estado
/*         if (!usuario){
            return res.status(404).json({
                ok: false,
                msg:`El usuario no existe`

            });
        } */

        await usuario.update(body);


        res.json({
            ok: true,
            usuario
        })


    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: "Hablar con el administrador"
        });

    }
}



export const eliminarUsuario = async (req: Request, res: Response) => {

    const { id } = req.params;


    const usuario = await Usuario.findByPk(id);

    if (!usuario?.estado){
        return res.status(400).json({ 
            ok: false,
            msg:`El usuario ${usuario?.nombre} no existe en la base de datos`
        })
    } 

     usuario.estado = false;

    await usuario.save();

    res.json({
        ok: true,
        msg: `El usuario ${usuario?.nombre} fue eliminado con exito`
    })
}