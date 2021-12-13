import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export const generarJWT = async ( id:string | number) => {

    try {
        const payload = {id};
        const token = await jwt.sign(payload, process.env.SECRETORPRIVATEKEY ||'',{
            expiresIn:'6h'
        })
        if (!token){
            throw new Error('No se pudo generar el token');
        }
        
        return token;
        
    } catch (error) {
        throw new Error ("error:" + error);
    }

}
