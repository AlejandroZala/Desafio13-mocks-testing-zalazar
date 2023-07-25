import express from 'express';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import config from './config/config.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import {Server} from 'socket.io';

import productMocksRouter from './routes/productsMocks.router.js';
import userMocksRouter from './routes/usersMocks.router.js';
import UserRouter from './routes/users.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/session.router.js';
import SessionsJwtRouter from './routes/sessionJwt.router.js';

import initializePassportStrategies from './config/passport.config.js';
import registerChatHandler from './listeners/chatHandler.js';
import __dirname from './utils.js';

const app = express();

//prueba custom router
const userRouter =new UserRouter();
const sessionsJwtRouter = new SessionsJwtRouter();

// const PORT = process.env.PORT ||8080;
const PORT = config.app.PORT;
const server = app.listen(PORT,() => console.log(`Listening on port ${PORT}`));
mongoose.connect(config.mongo.URL)
const io = new Server(server);      //Levanto mi server

//CONFIGURACION MAILING
const APP_PASSWORD = config.nodemailer.APP_PASSWORD;
const APP_EMAIL = config.nodemailer.APP_EMAIL;
//Genero el vinculo entre el servico seleccionado y mi herramienta
const transport = nodemailer.createTransport({
    service: 'gmail',
    port:587,
    auth:{
        user:APP_EMAIL,
        pass:APP_PASSWORD
    }
});

app.get('/mail',async (req, res) => {
    const result = await transport.sendMail({
        from: 'Alejandro <alejandrodzalazar@gmail.com>',
        to:'galeza2012@hotmail.com',
        subject:'Correo de prueba mailing',
        html:`
        <div>
        <h1>ESTÉTICA PROFESIONAL</h1>
        <img src="cid:logo"/>
        <h1>Esta es un prueba de mailing en Backend</h1>
        </div>`,
        attachments:[
            {
                filename:'ListaPrecios.pdf',
                path:'./src/docs/listaPrecios.pdf'
            },
            {
                filename:'logoda.jpg',
                path:'./src/public/imagenes/logoda.jpg',
                cid:'logo'
            }
        ]
    })
    res.send({status:"success",payload:result})
})

//CONFIGURACIÓN MENSAJERÍA TWILIO
const TWILIO_NUMBER= config.twilio.TWILIO_NUMBER;
const TWILIO_SID = config.twilio.TWILIO_SID;
const TWILIO_TOKEN = config.twilio.TWILIO_TOKEN;

//TWILIO INICIALIZA AL CLIENTE
const twilioClient = twilio(TWILIO_SID,TWILIO_TOKEN);

app.get('/sms', async(req, res) => {
    const CLIENT_NUMBER = config.twilio.CLIENT_NUMBER;
    const result = await twilioClient.messages.create({
        body: 'SMS de prueba',
        from: TWILIO_NUMBER,
        to: CLIENT_NUMBER
    })
    res.send({status:"success",payload:result})
})

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(`${__dirname}/public`));

app.use(cookieParser());

initializePassportStrategies();

app.use('/api/mockingProducts',productMocksRouter);
app.use('/api/mockingUsers', userMocksRouter);
app.use('/api/products', productsRouter); //Cuando llegue la peticion la redirije a usersRouter
app.use('/api/carts', cartsRouter);
app.use('/',viewsRouter);
// app.use('/api/sessions', sessionsRouter);
app.use('/api/users', userRouter.getRouter());
app.use('/api/sessions', sessionsJwtRouter.getRouter());

//creo middleware para referenciar mi io
app.use((req,res,next) => {
    req.io = io;
    next();
})

io.on('connection',socket=>{
    registerChatHandler(io,socket);
    console.log("Socket conectado");
})