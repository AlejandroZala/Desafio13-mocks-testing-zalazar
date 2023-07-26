import { Router } from "express";
import ErrorService from "../services/error.service.js";
import { userErrorIncompleteValues } from "../constants/userErrors.js";

const router = Router();

const users = [];

router.get('/', (req, res) =>{
    res.send({status:"success",payload:users});
})

router.post('/', (req, res) =>{
    const {firstName, lastName, email, password} = req.body;
    //Validar que si vengan todos los datos.
    if(!firstName ||!lastName || !email || !password){
        //ERROR PARA EL CLIENTE: return res.staus(400).send({status:"error",error:"Incomplete values"});
        //Aquí voy a generar un error para el SERVER
        ErrorService.createError({
            name:"User creation error",
            cause: userErrorIncompleteValues({firstName,lastName,email,password})
        })
    } 
})
