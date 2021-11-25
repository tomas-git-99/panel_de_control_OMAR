import express from "express";
import cors from "cors";



//MIS IMPORTACIONES
import ventasCliente   from "../routers/ventas/cliente"
import ventasUsuario   from "../routers/ventas/usuario"
import ventasOrden     from "../routers/ventas/orden"
import ventasProducto  from "../routers/ventas/producto"
import db from "../DB/conectarDB";

class ServerApp {

    private app: express.Application;
    private port: string;

    private apiPaths = {

        //VENTAS
        usuario: '/api/usuario',
        cliente: '/api/cliente',
        orden:    '/api/orden',
        producto: '/api/producto',

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

        this.app.use(express.json());

        this.app.use(express.static('public'));
    }

    router(){

        //VENTAS
        this.app.use( this.apiPaths.usuario,  ventasUsuario)
        this.app.use( this.apiPaths.cliente,  ventasCliente)
        this.app.use( this.apiPaths.orden,    ventasOrden)
        this.app.use( this.apiPaths.producto, ventasProducto)

        //PRODUCCION
    }
 

    listen(){
        this.app.listen(this.port, () => console.log(`En el port ${this.port}`))
    }
}


export default ServerApp;