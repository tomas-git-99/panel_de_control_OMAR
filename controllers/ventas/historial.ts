import { Request, Response } from "express";
import moment from "moment";
import { Op, where } from "sequelize/dist";
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


        const locales = await Usuario.findAll({where: { local: local}});


        let ids_local:any = []


        locales.map(e => {
            ids_local.push(e.id);
        })

        let id_cliente:any = []
        let id_direccion:any = []

        console.log(ids_local)

        
    let valor:any = req.query.offset;

    let valorOffset = parseInt(valor)

        
        const orden = await Orden.findAndCountAll({where:{id_usuario:ids_local,  total:{ [Op.gt]: 0}}, order: [['updatedAt', 'DESC']]/* , limit:10, offset:valorOffset */});

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

        console.log(contador);

        res.json({
            ok: true,
            contador,
            datos
        })


    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
    }
}



export const filtroPorFechas = async (req: Request, res: Response) => {
    try {

   

        let data

       req.body.fecha[1] == undefined ? data = {[Op.between]:[req.body.fecha[0]+'T00:00:00.000Z', req.body.fecha[0]+'T23:59:59.000Z']}: data = {[Op.between]:[req.body.fecha[0]+'T00:00:00.000Z', req.body.fecha[1]+'T23:59:59.000Z']}

      /*  new Date(req.body.fecha[1]), new Date(req.body.fecha[1]) */
      //let valor = {[Op.between]:[req.body.fecha[0], req.body.fecha[1]]}
 
     
        let buscar:any = {
            where: {
                total:{ [Op.gt]: 0}
            },order: [['createdAt', 'DESC']]
        }


        console.log(data)


    let local:any = req.query.local;


    buscar.where[`createdAt`] = data;
    


    if(local.length > 0) {
        console.log(req.query.local )
        let ids_local:any = []

        const locales = await Usuario.findAll({where: { local: local}});
    
    
        locales.map(e => {
            ids_local.push(e.id);
        })
    
        buscar.where[`id_usuario`] = ids_local.length > 1 ? ids_local : ids_local[0];
    }



    /* {[Op.like]: '%' + [6,8] + '%' } */
    //buscar.where['fecha'] = req.body.fecha[1] == undefined ?req.body.fecha[0]:{[Op.between]:[req.body.fecha[0], req.body.fecha[1]]}


   const orden = await Orden.findAndCountAll(buscar)
  


    let id_cliente:any = []
    let id_direccion:any = []
    
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
    
        datos = [...datos,{orden:i, cliente:newcliente || "", direccion:direcciones || ""}];
    
    }

    res.json({
        ok: true,
        datos
    })

    } catch (error) {
        
    }
}

const filtroFechaHistorial = async(data:any) => {
    let buscar:any = {
        where: {

        },order: [['createdAt', 'DESC']]
    }

    buscar.where[`createdAt`] = data;

    const orden = await Orden.findAll(buscar)

    return orden
}