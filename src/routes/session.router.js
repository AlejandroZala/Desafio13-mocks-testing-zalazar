import { Router } from "express";
import { usersService, cartsService } from "../dao/mongo/Managers/index.js"
import passport from 'passport';
import userModel from "../dao/mongo/models/users.js";
import cartManager from "../dao/mongo/Managers/cartManager.js";
import { createHash, generateToken, passportCall, validatePassword } from "../utils.js";
import { authToken } from "../middlewares/jwtAuth.js";

const router = Router();

router.get('*',(req,res)=>{
    res.send("Página no encontrada");
});

router.post('/register',
    passport.authenticate('register',{failureRedirect:'/api/sessions/registerFail', failureMessage:true}),async(req,res)=>{
    res.send({status:"success",message:"Registered"});
});

router.get('/registerFail',(req,res)=>{
    console.log(req.session.messages);
    res.status(400).send({status:"error",error:req.session.messages})
});

router.post('/login', passportCall('login'),async(req,res)=>{
            const user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role,
        };
        const accessToken = generateToken(user);
        //Cambio de envío desde una cookie
        res.cookie('authToken',accessToken, {
            maxAge:1000*60*60*24,
            httpOnly:true,
            sameSite:"strict"
        }).status(200).send({status:"success",message:"Loguin correcto"});
});

router.get("/github", passportCall("github"), (req, res) => {});

router.get("/githubcallback", passportCall("github"), (req, res) => {
    const user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
    };
    const accessToken = generateToken(user);
    //Cambio de envío desde una cookie
    res.cookie('authToken',accessToken, {
        maxAge:1000*60*60*24,
        httpOnly:true,
        sameSite:"strict"
    })
//   return res.redirect('/')
  res.send({ status: "success", messages: "Logueado, con GITHUB" });
});

router.post('/jwtLogin', async (req, res) => {

})

router.get('/jwtProfile', authToken, async (req, res) => {
    console.log(req.user);
    res.send({status:"success",payload:req.user})
})

router.post('/restorePassword',async(req,res)=>{
    const {email, password } = req.body;
    //¿El usuario sí existe?
    const user = await userModel.findOne({email})
    if(!user) return res.status(400).send({status:"error",error:"User doesn't exist"})
    const isSamePassword = await validatePassword(password,user.password);
    if(isSamePassword) return res.status(400).send({status:"error",error:"Cannot replace password with current password"})
    //Ahora sí, actualizamos
    const newHashedPassword = await createHash(password);
    await userModel.updateOne({email},{$set:{password:newHashedPassword}});
    res.send({ status: "success", message: "Restored password" });
});

router.post("/logout", (req, res) => {
    // Destruye la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesión:", err);
            return res
            .status(500)
            .send({ status: "error", error: "Error al cerrar sesión" });
        }
        res.send({ status: "success", message: "Sesión cerrada correctamente" });
    });
});

router.get('/current', (req, res) => {
    try {
        const user = req.session.user;
        res.send({ status: "success", payload: user });

    } catch (error) {
        return res.send(error);
    }
});

export default router;