import EErrors from "../constants/EErrors.js";

export default (error, req, res, next) => {//Este middleware es nuestro salvador que define que nunca caiga el server
    console.log(error);
    res.send("Prueba error");
}