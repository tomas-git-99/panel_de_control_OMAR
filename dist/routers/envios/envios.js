"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = (0, express_1.Router)();
require('dotenv').config();
const enviarEmail = (data, email) => __awaiter(void 0, void 0, void 0, function* () {
    let testAccount = yield nodemailer_1.default.createTestAccount();
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
        <p>Su telefono: <b>${data.telefono == "" || data.telefono == null
        ? ""
        : data.telefono}</b></p>
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
    let transporter = nodemailer_1.default.createTransport({
        host: process.env.HOST_EMAIL,
        port: 587,
        secure: false,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.PASS_EMAIL, // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    let info = yield transporter.sendMail({
        from: '"Formulario de consulta WEB" <consultasweb@metalsawa.com.ar>',
        to: email,
        subject: "Consultas WEB",
        html: htmlFull,
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /* let email = "sawa_sm@hotmail.com"; */
        let email = "sawa_sm@hotmail.com";
        /* console.log(req.body); */
        enviarEmail(req.body, email)
            .then(response => {
            res.json({
                ok: true
            });
        })
            .catch(err => {
            console.log(err);
            res.json({
                ok: false,
                error: err
            });
        });
    }
    catch (error) {
        res.json({
            ok: false,
            msg: error
        });
    }
}));
exports.default = router;
//# sourceMappingURL=envios.js.map