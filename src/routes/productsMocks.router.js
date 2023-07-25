import {Router} from "express";
import { generateProduct } from "../mocks/products.mocks.js";

const router = new Router();

router.get('/mockingProducts', (req, res) => {
    const products = [];
    //Endpoint que devolverá 100 usuarios de prueba

    for(let i=0;i<100;i++){
        products.push(generateProduct());
    }
    res.send({status:"success",payload:products})
})
export default router;