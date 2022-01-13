import { Request, Response } from "express";
import { Rollo } from "../../models/produccion/rollo";
import { Rollos } from "../../models/produccion/rollos";





export const crearNuevoRollo = async (req: Request, res: Response) => {

    try {
        
        const rollo = new Rollo(req.body);
    
    
        await rollo.save();
    
        res.json({
            ok: true,
            rollo
        })
    } catch (error) {
        
        res.json({
            ok:false,
            msg: error
        })
    }
}


export const obtenerTodoRollo = async (req: Request, res: Response) => {

    try {
        

        const rollo = await Rollo.findAll();


        let ids:any = []

        rollo.map ( e => {
            ids.push(e.id);
        });

        const rollos = await Rollos.findAll({where:{id_rollo:ids}});

        let data:any = []

        for( let i of rollo ){


            let rollosNew = rollos.filter( e => {
                let contador:number = 0;
                if( e.id_rollo == i.id){

                    contador += e.cantidad;

                    return contador;
                }

                
            })
            data = [...data, { rollos: rollosNew, rollo:i}]
                    
        
        }

   
        res.json({
            ok: true,
            data
        })
    } catch (error) {
        res.json({
            ok:false,
            msg: error
        })
    }
}


export const obtenerRollosID = async (req: Request, res: Response) => {


    try {
        const { id } = req.params;


        const rollos = await Rollos.findAll({where: { id_rollo:id}});
    
    
        res.json({
            ok: true,
            rollos
        })
    
    } catch (error) {
        
        res.json({
            ok:false,
            msg: error
        })
    }
}


export const agregarRollosID = async (req: Request, res: Response) => {

    try {
        

        const rollos = new Rollos(req.body);

        await rollos.save();

        res.json({
            ok: true,
            rollos
        })
    } catch (error) {
        
        res.json({
            ok:false,
            msg: error
        })
    }
}


export const cambiarDatosDeRollos = async (req: Request, res: Response) => {

    try {
        const {id} = req.params;
        const rollos = await Rollos.findByPk(id);


        await rollos?.update(req.body);


        res.json({
            ok: true,
            rollos
        })
    } catch (error) {
        res.json({
            ok:false,
            msg: error
        })
    }
}