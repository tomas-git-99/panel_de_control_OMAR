import { Router } from "express";
import nodemailer from "nodemailer";


const router = Router();

require('dotenv').config();


const enviarEmail = async (data:any, email:any) => {
    
  let testAccount = await nodemailer.createTestAccount();

  let htmlFull = `
  <style>
  .contenido_full {
    width: 100%;
    height: 100%;
    display: grid;
    justify-content: center;
    align-content: center;
    gap: 20px;
    background: rgb(209 213 219);
  }
  .contendio {
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
      rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    display: grid;
    justify-content: center;
    width: auto;
    height: auto;
    align-content: center;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    background:rgb(249 250 251);

  }
  .mensaje {
    display: grid;

    justify-items: start;
    align-items: center;
    margin: 20px;
  }
  img {
    width: 90px;
   

  }
  .img {
    display: grid;
    justify-content: center;
    width: 100%;
  }
  .contacto {
    place-self: center;
    text-align: start;
    color: rgb(75 85 99);
  }
  .texto {
    width: 400px;
    
  }
  .texto h3 {
    text-align: center;
    color: rgb(75 85 99);

  }
  </style>
  <body>
  <div class="contenido_full" >


    <div
    class="contendio"
    
  >
    <div
      class="mensaje"
    
    >
    <div class="img">
      <img
       
        src="https://firebasestorage.googleapis.com/v0/b/node-chat-destruccion.appspot.com/o/sawa-imagenes%2Flogo%2FSAWA_final.png?alt=media&token=87c3ae8b-d47e-4b46-9467-8c758ff217a5"
        alt=""
      />
      </div>

      <div class="contacto">
        <p>Enviado por: <b>${data.nombre}</b></p>
        <p>Su email es: <b>${data.email}</b></p>
        <p>Su telefono: <b>${
            data.telefono == "" || data.telefono == null
              ? ""
              : data.telefono
          }</b></p>
      </div>

      <div class="texto" >
        <h3 >Mensaje:</h3>
        <p>
         ${data.mensaje}
        </p>
      </div>
    </div>
  </div>

  </div>
  </body>
    `;

  let transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER_EMAIL, // generated ethereal user
      pass: process.env.PASS_EMAIL, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  let info = await transporter.sendMail({
    from: '"Formulario de consulta WEB" <consultasweb@metalsawa.com.ar>', // sender address
    to: email, // list of receivers
    subject: "Consultas WEB", // Subject line
    html: htmlFull,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

router.post('/', async(req:any, res:any) => {
    try {

        /* let email = "sawa_sm@hotmail.com"; */
        let email = "tomasgit@hotmail.com";
        /* console.log(req.body); */

        
        enviarEmail(req.body, email)
        .then( response => { 
            res.json({
                ok:true
            })
        })
    
        .catch( err => {
            console.log(err)
            res.json({ 
                ok:false,
                error: err})
        })
    } catch (error) {
        res.json({
            ok:false,
            msg: error
        })
    }
})



export default router;
