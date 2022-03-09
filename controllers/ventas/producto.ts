import { NextFunction, Request, Response } from "express";
import { Op, where } from "sequelize/dist";
import db from "../../DB/conectarDB";
import { Producto } from "../../models/ventas/producto";
import { Talle } from "../../models/ventas/talles";
import { Usuario } from "../../models/ventas/usuario";
import usuario from "../../routers/ventas/usuario";




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

        const talles = await Talle.findAll({where:{ id_producto:id}});





        if (!producto){
            return res.status(404).json({
                ok: false,
                msg:`El usuario con el id ${ id } no existe`
            }
            );
        }


        let nombre = Object.keys(body);

        if( req.query.vaciar == "true"){



            await producto.update({cantidad:null!});

            return res.json({
                ok: true,
                producto
            })

        }


        if( nombre[0] == "cantidad"){
            
            if( talles.length > 0 ){
                return res.json({
                    ok: false,
                    msg:"Este producto ya esta separado por talle, si solo quieres usar el total tienes que ELIMINAR los talles de este producto"
                })
            }
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


    let valor:any = req.query.offset;

    let valorOffset = parseInt(valor);


    let valorID:any = req.query.usuario;
    let valorBusqueda = "";


    if(valorID !== undefined) {

        const usuario = await Usuario.findByPk(parseInt(valorID));
        
        if(usuario?.local == null){
            if(usuario?.rol == "ADMIN"){
                valorBusqueda = "";
            }
                
        }else if(usuario.venta == "ONLINE"){
            if(usuario.local) valorBusqueda = usuario.local;
                valorBusqueda = ""
        }else{
            valorBusqueda = usuario.local;
        }
            
    }


/*     let sinEspacio:any = req.query.nombre;

    console.log(sinEspacio.replace(/ /g, "")); */

 
    const productos_rows = await Producto.findAndCountAll({ where:{ 
        estado:true,
        local:{ [Op.like]: '%'+ valorBusqueda +'%'} ,
       [Op.or]:[
           {
               nombre:{ [Op.like]: '%'+ req.query.nombre +'%'}
           },
           {
               id:{ [Op.like]: '%'+ req.query.nombre +'%'}
           }
       ]

    }, limit:10, offset:valorOffset} );


  /*   const productos_rows = await Producto.findAndCountAll({ where:{ 
        estado:true,
        nombre:{ [Op.like]: '%'+ req.query.nombre +'%'},
        id:{ [Op.like]: '%'+ req.query.nombre +'%'}
        
    }, limit:10, offset:valorOffset} );
   */

    let contador = productos_rows.count;
    let ids_productos:any = [];
    productos_rows.rows.map( e => {
        ids_productos.push(e.id);
    });
    const talles = await Talle.findAll({where:{id_producto:ids_productos}});

    let productos:any = [];
    productos_rows.rows.forEach( e =>{
        let tallesNew = talles.filter( i => i.id_producto == e.id ?? i)
        productos = [...productos, {productos:e, talles:tallesNew}]
    })

  
    
    res.json({
        ok:true,
        contador,
        productos

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

        let valor:any = req.query.offset;

        let valorOffset = parseInt(valor)

        let valorID:any = req.query.usuario


        
        let valorBusqueda ="";

        
        
        if(valorID !== undefined) {
            const usuario = await Usuario.findByPk(parseInt(valorID));

            if(usuario?.local == null){
                if(usuario?.rol == "ADMIN"){
                    valorBusqueda = "";
                }
                
            }else if(usuario.venta == "ONLINE"){
                if(usuario.local) valorBusqueda = usuario.local;
                valorBusqueda = ""
            }else{
                valorBusqueda = usuario.local;
    
            }
        }

     
    
        const productos_rows = await Producto.findAndCountAll({where:{estado:true, local:{ [Op.like]: '%'+ valorBusqueda +'%'}  },order: [['createdAt', 'DESC']], limit:10, offset:valorOffset});

        let ids_productos:any= [];

        productos_rows.rows.map( e => {
            ids_productos.push(e.id);
        });

        const talles = await Talle.findAll({where:{id_producto:ids_productos}});

        let productos:any = [];

        const contador = productos_rows.count;
        productos_rows.rows.map( e => {

            let tallesNew = talles.filter( i => i.id_producto == e.id ?? i)
            
       

            productos = [...productos, { productos:e , talles:tallesNew || '' }]
                
            
        })

        res.json({
            ok: true,
            contador,
            productos
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: error
        })
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

    const locales = await Producto.findAll({ where:{estado:true}, attributes:['local']});


    const result:any = [];


    locales.forEach((item)=>{
    	//pushes only unique element
        let local = item.local.toUpperCase()
        if(!result.includes(local)){
            if(local.length > 0){
               
                result.push(local);
            }
    	}
    })


    

    result.sort();
    
    
      res.json({
          ok: true,
          result
       })
}

export const buscarLocal = async (req: Request, res: Response) => {

    let valor:any = req.query.offset;

    let valorOffset = parseInt(valor)

    const productos_rows = await Producto.findAndCountAll({ where:{ 
        estado:true,

        local:{ [Op.like]: '%'+ req.query.local +'%'},
        // tela: { [Op.like]: '%'+ buscarProducto.tela +'%' }, buscar por tela opcionB
    }, limit:10, offset:valorOffset} );

    let contador = productos_rows.count;
    let ids_productos:any = [];
    productos_rows.rows.map( e => {
        ids_productos.push(e.id);
    });
    const talles = await Talle.findAll({where:{id_producto:ids_productos}});

    let productos:any = [];
    productos_rows.rows.forEach( e =>{
        let tallesNew = talles.filter( i => i.id_producto == e.id ?? i)
        productos = [...productos, {productos:e, talles:tallesNew}]
    })


    res.json({
        ok: true,
        contador,
        productos,
    })
}




interface BodyCambioLocal{
    OldValue: string,
    NewValue: string,
}

export const cambiarProductosDeLocal = async (req: Request, res: Response) => {
    
    try {
        
        const datos:BodyCambioLocal = req.body;


        const productos = await Producto.findAll({ where:{
            estado:true,
            local:{[Op.like]: '%' + datos.OldValue + '%' }
        }});


        for( let p of productos ) {

            await p.update({local:datos.NewValue});

        }
    

        res.json({
            ok: true,
            msg: "Bien!!"
        })
        
    } catch (error) {
        res.json({ok: false, msg: error})
    }
}