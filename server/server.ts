import express from "express";
import cors from "cors";



class ServerApp {

    private app: express.Application;
    private port: string;

    private apiPaths = {

        //VENTAS
        usuarios: '/api/usuarios',
        auth:'/api/auth',
        sala:'/api/sala',

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
            //await db.authenticate();
            console.log('base de datos conectada');
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
        this.app.use( this.apiPaths.usuarios,)
    }
 

    listen(){
        this.app.listen(this.port, () => console.log(`En el port ${this.port}`))
    }
}


export default ServerApp;