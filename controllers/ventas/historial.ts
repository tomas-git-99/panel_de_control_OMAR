import { Request, Response } from "express";
import { Cliente } from "../../models/ventas/cliente";
import { Direccion } from "../../models/ventas/direccion";
import { Orden } from "../../models/ventas/orden";
import { Usuario } from "../../models/ventas/usuario";





export const buscarLocales = async (req: Request, res: Response) => {


    const locales = await Usuario.findAll();

    let local:any = [];

    locales.map( e => {
        if(e.local !== null){

            local.push(e.local);
        }
    })


    res.json({
        ok: true,
        local
    })
}


export const buscarPorLocal = async (req: Request, res: Response) => {


    try {

        const { local } = req.params;


        const locales = await Usuario.findAll({where: { local: local }});

        let ids_local:any = []


        locales.map(e => {
            ids_local.push(e.id);
        })

        let id_cliente:any = []
        let id_direccion:any = []

        
    let valor:any = req.query.offset;

    let valorOffset = parseInt(valor)

        
        const orden = await Orden.findAndCountAll({where:{id_usuario:ids_local}, order: [['updatedAt', 'DESC']], limit:10, offset:valorOffset});

        let contador = orden.count;

        orden.rows.map(async(e, i)=> {
            id_cliente.push(e.id_cliente);
            id_direccion.push(e.id_direccion);
        });



        const cliente = await Cliente.findAll({where:{id:id_cliente}});

        const direccion = await Direccion.findAll({where:{id:id_direccion}});

        
    
        let datos:any = [];
    
        for ( let i of orden.rows){
    
            let newcliente = cliente.find( e => e.id == i.id_cliente);
            let direcciones = direccion.find( h => h.id == i.id_direccion);
    
            datos = [...datos,{orden:i, cliente:newcliente||"", direccion:direcciones || ""}];
    
        }

console.log(datos)
        res.json({
            ok: true,
            contador,
            datos
        })


    } catch (error) {
        console.log(error);
    }
}