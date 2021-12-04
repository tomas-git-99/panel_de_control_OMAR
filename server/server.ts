import express from "express";
import cors from "cors";
import path from "path";


//MIS IMPORTACIONES
import ventasCliente   from "../routers/ventas/cliente"
import ventasUsuario   from "../routers/ventas/usuario"
import ventasOrden     from "../routers/ventas/orden"
import ventasProducto  from "../routers/ventas/producto"
import ventasCarrito from "../routers/ventas/carrito"
import ventasDireccion from  "../routers/ventas/direccion"
import ventasTalle from  "../routers/ventas/talle"
import db from "../DB/conectarDB";

class ServerApp {

    private app: express.Application;
    private port: string;

    private apiPaths = {

        //VENTAS
        usuario:  '/api/usuario',
        cliente:  '/api/cliente',
        orden:    '/api/orden',
        producto: '/api/producto',
        carrito:  '/api/carrito',
        direccion:'/api/direccion',
        talle:    '/api/talle',

        //PRODUCCION
    };

    constructor(){
        this.app    = express();
        this.port   = process.env.PORT || '8000';

        /* middleware */
        this.middlewares();

        /* base de datos */
        this.dbConencion();

        /* Definnir routas */
        this.router();

    }

    async dbConencion(){
        try {
            await db.authenticate();
            console.log('Base de datos conectado');
        } catch (error) {
            throw new Error("error" + error);
        }
    }

    middlewares(){

        this.app.use(cors());
        this.app.use((req, res, next) => {

            // Dominio que tengan acceso (ej. 'http://example.com')
               res.header ('Access-Control-Allow-Origin', '*');
            
            next();
            })

        this.app.use(express.json());

        this.app.use(express.static('public'));


    
    }

    router(){

        //VENTAS
        this.app.use( this.apiPaths.usuario,  ventasUsuario)
        this.app.use( this.apiPaths.cliente,  ventasCliente)
        this.app.use( this.apiPaths.orden,    ventasOrden)
        this.app.use( this.apiPaths.producto, ventasProducto)
        this.app.use( this.apiPaths.carrito,  ventasCarrito)
        this.app.use( this.apiPaths.direccion,ventasDireccion)
        this.app.use( this.apiPaths.talle,    ventasTalle)

        //PRODUCCION
    }
 

    listen(){
        this.app.listen(this.port, () => console.log(`En el port ${this.port}`))
    }
}


export default ServerApp;