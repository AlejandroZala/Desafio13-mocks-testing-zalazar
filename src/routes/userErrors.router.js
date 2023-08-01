import { Router } from "express";
import ErrorService from "../services/error.service.js";
import { userErrorIncompleteValues } from "../constants/userErrors.js";
import EErrors from "../constants/EErrors.js";

const router = Router();

const users = [];

router.get('/', (req, res) =>{
    res.send({status:"success",payload:users});
})

router.post('/', (req, res) =>{
    const {firstName, lastName, email, password} = req.body;
    //Validar que si vengan todos los datos.
    if(!firstName|| !lastName || !email || !password){
        //ERROR PARA EL CLIENTE: return res.staus(400).send({status:"error",error:"Incomplete values"});
        //Aquí voy a generar un error para el SERVER
        ErrorService.createError({
            name:"Error de craci+on de usuario",
            cause: userErrorIncompleteValues({firstName,lastName,email,password}),
            message: 'Error intentando insertar un nuevo usuario',
            code: EErrors.INCOMPLETE_VALUES,
            status:400
        })
        try{

        }catch(error){
            //analiza el error nativo de la librería que tronó
            //Crea tu propio error, con tus códigos conocidos.
            res.sendStatus(500);
        }
    }
    const user = {
        firstName,
        lastName,
        email,
        password
    }
    users.push(user);
    res.send({status:"success",message:"Usuario agregado"})
})

export default router;
