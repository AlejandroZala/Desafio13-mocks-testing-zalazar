import {Router} from "express";
import { generateUser } from "../mocks/users.mocks.js";

const router = new Router();

router.get('/mockingUsers', (req, res) => {
    const users = [];
    //Endpoint que devolverá 100 usuarios de prueba

    for(let i=0;i<100;i++){
        users.push(generateUser());
    }
    res.send({status:"success",payload:users})
})
export default router;