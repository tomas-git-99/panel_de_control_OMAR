import { Request, Response } from "express";
import { Usuario } from "../../models/ventas/usuario";
import bcryptjs from 'bcryptjs';
import { generarJWT } from "../../helpers/generar-JWT";
import { Op } from "sequelize/dist";


export const login = async( req: Request, res: Response) => {

     try {
        const { nombre, password } = req.body;

    
        const usuario = await Usuario.findAll({where:{ nombre:nombre }});

        if(!usuario){
            return res.json ({
                ok: false,
                fallo: 1,
                msg:'Nombre / Password no son correctos'
            })
        }

        const validPassword =  bcryptjs.compareSync( password , usuario[0].password);


        if (!validPassword) {
            return res.json ( {
                ok: false,
                fallo: 3,
                msg:'Nombre / Password no son correctos'
            });
        }

        const token =  await generarJWT(usuario[0].id);

        res.json({
            ok:true,
            usuario,
            token
        })

     } catch (error) {
      
        res.status(400).json({
            ok:false,
            msg:'hable con el administrador',
            error : error
        });
     }
}




export const crearUsuario = async( req: Request, res: Response) => {

    try {

      
        const usuarios:any = await Usuario.findAll({where:{ nombre:req.body.nombre}});


        if(usuarios.length > 0) {
            return res.json({
                ok:false, 
                msg: "El usuario con este nombre ya esta registrado: " + req.body.nombre
            })
        }
    
        const salt = await bcryptjs.genSaltSync(10);
        
        const newPassword = await bcryptjs.hashSync( req.body.password, salt );


        
        req.body.password = newPassword;
    
        
        const usuario = new Usuario(req.body);
    
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

        console.log(body);

        const usuario = await Usuario.findByPk(id);

        let nombre = Object.keys(body);

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

        if(nombre[0] == 'password'){

            const salt = await bcryptjs.genSaltSync(10);
        
            const newPassword = await bcryptjs.hashSync( body.password, salt );

            body.password = newPassword;

        }

        if(nombre[0] == 'nombre'){
            const usuario = await Usuario.findAll({where:{ nombre:body.nombre, estado:true}});

            if(usuario.length > 0) {
                return res.json({
                    ok:false, 
                    msg: "El usuario con este nombre ya esta registrado: " + body.nombre
                })
            }

        }


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

export const verificarToken = async(req:Request, res:Response) => {

    try {
    const usuario = req.params;
        res.json({
            ok:true,
            usuario
        })
    } catch (error) {
     res.status(400).json({
         ok: false,
         msg:error
     })   
    }
}


export const buscarUsuario = async(req:Request, res:Response) => {
    try {
        

        const usuario = await Usuario.findAll({where:{ estado:true, nombre:{ [Op.like]: '%'+ req.query.value +'%'}}});

        res.json({
            ok:true,
            usuario
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg:error
        })   
        
    }
}